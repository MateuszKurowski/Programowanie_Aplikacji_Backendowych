import { MealCategoryModel } from '../entities/MealCategory'
import { OrderStateModel } from '../entities/OrderState'
import { PositionModel } from '../entities/Position'
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

		await new PositionModel({
			Name: 'Kelner',
			AccessLevel: 0,
		}).save()
		await new PositionModel({
			Name: 'Kucharz',
			AccessLevel: 2,
		}).save()
		await new PositionModel({
			Name: 'Kasjer',
			AccessLevel: 1,
		}).save()
		await new PositionModel({
			Name: 'Sprzątacz',
			AccessLevel: 0,
		}).save()
		await new PositionModel({
			Name: 'Księgowy',
			AccessLevel: 3,
		}).save()
		await new PositionModel({
			Name: 'Szef',
			AccessLevel: 4,
		}).save()
		await new PositionModel({
			Name: 'Zastępca szefa',
			AccessLevel: 4,
		}).save()
	})
}
