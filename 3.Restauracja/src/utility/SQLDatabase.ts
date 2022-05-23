import mongoose from 'mongoose'
import { EmployeeModel } from '../entities/Employee'
import { MealModel } from '../entities/Meal'
import { MealCategoryModel } from '../entities/MealCategory'
import { OrderModel } from '../entities/Order'
import { OrderStateModel } from '../entities/OrderState'
import { PostionModel } from '../entities/Positions'
import { ProductModel } from '../entities/Product'
import { ReservationModel } from '../entities/Reservation'
import { RestaurantModel } from '../entities/Restaurant'
import { TableModel } from '../entities/table'
import { TableStateModel } from '../entities/TableState'
import { UnitModel } from '../entities/Unit'
import { DataStorage } from '../interfaces/database'

import { connectionString } from '../../config.json'

export class SQLDatabase implements DataStorage {
	async save(entityModel: any, entityName: string) {
		await entityModel.save()
	}
	async delete(entityModel: any, entityName: string) {
		switch (entityName) {
			case 'Employee':
				await EmployeeModel.findByIdAndDelete(entityModel._id)
				break
			case 'Meal':
				await MealModel.findByIdAndDelete(entityModel._id)
				break
			case 'MealCategory':
				await MealCategoryModel.findByIdAndDelete(entityModel._id)
				break
			case 'Order':
				await OrderModel.findByIdAndDelete(entityModel._id)
				break
			case 'OrderState':
				await OrderStateModel.findByIdAndDelete(entityModel._id)
				break
			case 'Position':
				await PostionModel.findByIdAndDelete(entityModel._id)
				break
			case 'Product':
				await ProductModel.findByIdAndDelete(entityModel._id)
				break
			case 'Reservation':
				await ReservationModel.findByIdAndDelete(entityModel._id)
				break
			case 'Restaurant':
				await RestaurantModel.findByIdAndDelete(entityModel._id)
				break
			case 'Table':
				await TableModel.findByIdAndDelete(entityModel._id)
				break
			case 'TableState':
				await TableStateModel.findByIdAndDelete(entityModel._id)
				break
			case 'Unit':
				await UnitModel.findByIdAndDelete(entityModel._id)
				break
		}
	}
	async update(entityModel: any, entityName: string) {
		switch (entityName) {
			case 'Employee':
				await EmployeeModel.findByIdAndUpdate(entityModel._id)
				break
			case 'Meal':
				await MealModel.findByIdAndUpdate(entityModel._id)
				break
			case 'MealCategory':
				await MealCategoryModel.findByIdAndUpdate(entityModel._id)
				break
			case 'Order':
				await OrderModel.findByIdAndUpdate(entityModel._id)
				break
			case 'OrderState':
				await OrderStateModel.findByIdAndUpdate(entityModel._id)
				break
			case 'Position':
				await PostionModel.findByIdAndUpdate(entityModel._id)
				break
			case 'Product':
				await ProductModel.findByIdAndUpdate(entityModel._id)
				break
			case 'Reservation':
				await ReservationModel.findByIdAndUpdate(entityModel._id)
				break
			case 'Restaurant':
				await RestaurantModel.findByIdAndUpdate(entityModel._id)
				break
			case 'Table':
				await TableModel.findByIdAndUpdate(entityModel._id)
				break
			case 'TableState':
				await TableStateModel.findByIdAndUpdate(entityModel._id)
				break
			case 'Unit':
				await UnitModel.findByIdAndUpdate(entityModel._id)
				break
		}
	}
	async download(entityName: string) {
		switch (entityName) {
			case 'Employee':
				return await EmployeeModel.find()
			case 'Meal':
				return await MealModel.find()
			case 'MealCategory':
				return await MealCategoryModel.find()
			case 'Order':
				return await OrderModel.find()
			case 'OrderState':
				return await OrderStateModel.find()
			case 'Position':
				return await PostionModel.find()
			case 'Product':
				return await ProductModel.find()
			case 'Reservation':
				return await ReservationModel.find()
			case 'Restaurant':
				return await RestaurantModel.find()
			case 'Table':
				return await TableModel.find()
			case 'TableState':
				return await TableStateModel.find()
			case 'Unit':
				return await UnitModel.find()
		}
	}
}

export async function ConnectSQL() {
	await mongoose
		.connect(connectionString)
		.then(result => console.log('Otwarto połączenie z bazą!'))
		.catch(err => console.log(err))
}
