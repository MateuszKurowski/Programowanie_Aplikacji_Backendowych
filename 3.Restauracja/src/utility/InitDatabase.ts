import { EmployeeModel } from '../entities/Employee'
import { MealCategoryModel } from '../entities/MealCategory'
import { OrderStateModel } from '../entities/OrderState'
import { PositionModel } from '../entities/Position'
import { RestaurantModel } from '../entities/Restaurant'
import { TableModel } from '../entities/Table'
import { TableStateModel } from '../entities/TableState'
import { UnitModel } from '../entities/Unit'

export async function InitDatabase() {
	// process.on('uncaughtException', async () => {})
	try {
		await new TableStateModel({
			Name: 'Wolny',
		}).save()
	} catch (MongoServerError) {}
	try {
		await new TableStateModel({
			Name: 'Zajęty',
		}).save()
	} catch (MongoServerError) {}
	try {
		await new TableStateModel({
			Name: 'Niedostępny',
		}).save()
	} catch (MongoServerError) {}

	try {
		await new TableModel({
			TableNumber: 1,
			SeatsNumber: 3,
		}).save()
	} catch (MongoServerError) {}
	try {
		await new TableModel({
			TableNumber: 2,
			SeatsNumber: 2,
		}).save()
	} catch (MongoServerError) {}
	try {
		await new TableModel({
			TableNumber: 3,
			SeatsNumber: 4,
		}).save()
	} catch (MongoServerError) {}
	try {
		await new TableModel({
			TableNumber: 4,
			SeatsNumber: 3,
		}).save()
	} catch (MongoServerError) {}
	try {
		await new TableModel({
			TableNumber: 5,
			SeatsNumber: 5,
		}).save()
	} catch (MongoServerError) {}

	try {
		await new UnitModel({
			Name: 'Kilogram',
		}).save()
	} catch (MongoServerError) {}
	try {
		await new UnitModel({
			Name: 'Gram',
		}).save()
	} catch (MongoServerError) {}
	try {
		await new UnitModel({
			Name: 'Dekogram',
		}).save()
	} catch (MongoServerError) {}
	try {
		await new UnitModel({
			Name: 'Litr',
		}).save()
	} catch (MongoServerError) {}
	try {
		await new UnitModel({
			Name: 'Mililitr',
		}).save()
	} catch (MongoServerError) {}

	try {
		await new OrderStateModel({
			Name: 'W trakcie przygotowania',
		}).save()
	} catch (MongoServerError) {}
	try {
		await new OrderStateModel({
			Name: 'Przyjęte',
		}).save()
	} catch (MongoServerError) {}
	try {
		await new OrderStateModel({
			Name: 'Zakończone',
		}).save()
	} catch (MongoServerError) {}

	try {
		await new MealCategoryModel({
			Name: 'Zupy',
		}).save()
	} catch (MongoServerError) {}
	try {
		await new MealCategoryModel({
			Name: 'Dania z wołowiny',
		}).save()
	} catch (MongoServerError) {}
	try {
		await new MealCategoryModel({
			Name: 'Dania z drobiu',
		}).save()
	} catch (MongoServerError) {}
	try {
		await new MealCategoryModel({
			Name: 'Dania z wieprzowiny',
		}).save()
	} catch (MongoServerError) {}
	try {
		await new MealCategoryModel({
			Name: 'Makarony',
		}).save()
	} catch (MongoServerError) {}
	try {
		await new MealCategoryModel({
			Name: 'Dania z ryb',
		}).save()
	} catch (MongoServerError) {}
	try {
		await new MealCategoryModel({
			Name: 'Dania jarskie',
		}).save()
	} catch (MongoServerError) {}
	try {
		await new MealCategoryModel({
			Name: 'Dania dla najmłodszych',
		}).save()
	} catch (MongoServerError) {}
	try {
		await new MealCategoryModel({
			Name: 'Sałatki',
		}).save()
	} catch (MongoServerError) {}
	try {
		await new MealCategoryModel({
			Name: 'Dodatki',
		}).save()
	} catch (MongoServerError) {}
	try {
		await new MealCategoryModel({
			Name: 'Desery',
		}).save()
	} catch (MongoServerError) {}
	try {
		await new MealCategoryModel({
			Name: 'Napoje ciepłe',
		}).save()
	} catch (MongoServerError) {}
	try {
		await new MealCategoryModel({
			Name: 'Drinki alkoholowe',
		}).save()
	} catch (MongoServerError) {}
	try {
		await new MealCategoryModel({
			Name: 'Drinki bezalkoholowe',
		}).save()
	} catch (MongoServerError) {}
	try {
		await new MealCategoryModel({
			Name: 'Alkohole',
		}).save()
	} catch (MongoServerError) {}
	try {
		await new MealCategoryModel({
			Name: 'Dania bezglutenowe',
		}).save()
	} catch (MongoServerError) {}

	try {
		await new RestaurantModel({
			Name: 'Pod blachą',
			Address: 'Krakowsa 32/4',
			TelNumber: '123456789',
			NIP: '5721873778',
			Email: 'testowy.mail@gmail.com',
			WWW: 'www.podblacha.pl',
		}).save()
	} catch (MongoServerError) {}

	try {
		await new PositionModel({
			Name: 'Kelner',
			AccessLevel: 0,
		}).save()
	} catch (MongoServerError) {}
	try {
		await new PositionModel({
			Name: 'Kucharz',
			AccessLevel: 2,
		}).save()
	} catch (MongoServerError) {}
	try {
		await new PositionModel({
			Name: 'Kucharz',
			AccessLevel: 2,
		}).save()
	} catch (MongoServerError) {}
	try {
		await new PositionModel({
			Name: 'Kasjer',
			AccessLevel: 1,
		}).save()
	} catch (MongoServerError) {}
	try {
		await new PositionModel({
			Name: 'Sprzątacz',
			AccessLevel: 0,
		}).save()
	} catch (MongoServerError) {}
	try {
		await new PositionModel({
			Name: 'Księgowy',
			AccessLevel: 3,
		}).save()
	} catch (MongoServerError) {}
	try {
		await new PositionModel({
			Name: 'Szef',
			AccessLevel: 4,
		}).save()
	} catch (MongoServerError) {}
	try {
		await new PositionModel({
			Name: 'Zastępca szefa',
			AccessLevel: 4,
		}).save()
	} catch (MongoServerError) {}
	try {
		await new PositionModel({
			Name: 'Admin',
			AccessLevel: 99,
		}).save()
	} catch (MongoServerError) {}

	try {
		const adminRole = await PositionModel.findOne({ Name: 'Admin' })
		await new EmployeeModel({
			Login: 'admin',
			Password: 'Admin',
			Name: 'Admin',
			Surname: 'Admin',
			Position: adminRole?._id,
		}).save()
	} catch (error) {}

	console.log('Koniec inicjalizacji bazy.')
}
