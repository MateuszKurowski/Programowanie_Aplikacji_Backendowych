import { MealCategoryModel } from '../entities/MealCategory'
import { OrderStateModel } from '../entities/OrderState'
import { PostionModel } from '../entities/Position'
import { RestaurantModel } from '../entities/Restaurant'
import { TableStateModel } from '../entities/TableState'
import { UnitModel } from '../entities/Unit'

export function InitDatabase() {
	process.on('uncaughtException', async function (exception) {
		await new TableStateModel({
			Name: 'Wolny',
		}).save()
		await new TableStateModel({
			Name: 'Zajety',
		}).save()
		await new TableStateModel({
			Name: 'Niedostępny',
		}).save()

		await new UnitModel({
			Name: 'Kilogram',
		}).save()
		await new UnitModel({
			Name: 'Gram',
		}).save()
		await new UnitModel({
			Name: 'Dekogram',
		}).save()
		await new UnitModel({
			Name: 'Litr',
		}).save()
		await new UnitModel({
			Name: 'Mililitr',
		}).save()

		await new OrderStateModel({
			Name: 'W trakcie przygotowania',
		}).save()
		await new OrderStateModel({
			Name: 'Przyjęte',
		}).save()
		await new OrderStateModel({
			Name: 'Zakończone',
		}).save()

		await new MealCategoryModel({
			Name: 'Mięsne',
		}).save()
		await new MealCategoryModel({
			Name: 'Wegetariańskie',
		}).save()
		await new MealCategoryModel({
			Name: 'Wegańskie',
		}).save()
		await new MealCategoryModel({
			Name: 'Bez glutenu',
		}).save()

		await new RestaurantModel({
			Name: 'Pod blachą',
			Address: 'Krakowsa 32/4',
			TelNumber: '123456789',
			NIP: '5721873778',
			Email: 'testowy.mail@gmail.com',
			WWW: 'www.podblacha.pl',
		}).save()

		await new PostionModel({
			Name: 'Kelner',
		}).save()
		await new PostionModel({
			Name: 'Kucharz',
		}).save()
		await new PostionModel({
			Name: 'Kasjer',
		}).save()
		await new PostionModel({
			Name: 'Sprzątacz',
		}).save()
		await new PostionModel({
			Name: 'Księgowy',
		}).save()
		await new PostionModel({
			Name: 'Szef',
		}).save()
		await new PostionModel({
			Name: 'Zastępca szefa',
		}).save()
	})
}
