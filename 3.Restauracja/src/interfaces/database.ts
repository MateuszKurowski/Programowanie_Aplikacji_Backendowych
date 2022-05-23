import { SQLDatabase, ConnectSQL } from '../utility/SQLDatabase'

export interface DataStorage {
	save(entityModel: any, entityName: string): any
	delete(entityModel: any, entityName: string): any
	update(entityModel: any, entityName: string): any
	download(entityName: string): any
}

export function CheckDatabaseLocation(): DataStorage {
	const saveData = require('../../config.json').saveData
	switch (saveData) {
		default:
		case 'database':
			return new SQLDatabase()
		// default:
		// case 'files':
		// 	return new FilesDatabase()
	}
}

export async function StartConnection() {
	const saveData = require('../../config.json').saveData
	switch (saveData) {
		case 'database':
			await ConnectSQL()
			return true
		default:
		case 'files':
			return false
	}
}
