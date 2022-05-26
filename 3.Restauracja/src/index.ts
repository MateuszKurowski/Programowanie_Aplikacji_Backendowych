import express from 'express'
import { ConnectToDatabase } from './utility/ConnectToDatabase'
import { InitDatabase } from './utility/InitDatabase'

const employeeRoute = require('./Handlers/EmployeeHandler')
const mealCategoryRoute = require('./Handlers/MealCategoryHandler')
const mealRoute = require('./Handlers/MealHandler')
const orderRoute = require('./Handlers/OrderHandler')
const orderStateRoute = require('./Handlers/OrderStateHandler')
const positionRoute = require('./Handlers/PositionHandler')
const productRoute = require('./Handlers/ProductHandler')
const productNeedRoute = require('./Handlers/ProductNeedHandler')
const raportRoute = require('./Handlers/RaportHandler')
const reservationRoute = require('./Handlers/ReservationHandler')
const restaurantRoute = require('./Handlers/RestaurantHandler')
const tableRoute = require('./Handlers/TableHandler')
const tableStateRoute = require('./Handlers/TableStateHandler')
const unitRoute = require('./Handlers/UnitHandler')

const app = express()
app.use(express.json())
ConnectToDatabase().then(() => {
	InitDatabase()
})

app.use('/employee', employeeRoute)
app.use('/mealcategory', mealCategoryRoute)
app.use('/meal', mealRoute)
app.use('/order', orderRoute)
app.use('/orderstate', orderStateRoute)
app.use('/position', positionRoute)
app.use('/product', productRoute)
app.use('/productneed', productNeedRoute)
app.use('/raport', raportRoute)
app.use('/reservation', reservationRoute)
app.use('/restaurant', restaurantRoute)
app.use('/table', tableRoute)
app.use('/tablestate', tableStateRoute)
app.use('/unit', unitRoute)

app.listen(3000)
