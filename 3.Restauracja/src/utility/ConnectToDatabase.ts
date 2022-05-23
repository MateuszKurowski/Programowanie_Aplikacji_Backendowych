import mongoose from 'mongoose'
import { connectionString } from '../../config.json'

export async function ConnectToDatabase() {
	await mongoose
		.connect(connectionString)
		.then(result => console.log('Otwarto połączenie z bazą!'))
		.catch(err => console.log(err))
}
