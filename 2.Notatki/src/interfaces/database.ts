import { Note } from '../entity/note'
import { User } from '../entity/user'
import { Tag } from '../entity/tag'
import { FilesDatabase } from '../utility/FilesDatabase'
import { ConnectSQL, SQLDatabase } from '../utility/SQLDatabase'

export interface DataStorage {
	saveNote(note: Note): any
	deleteNote(note: Note): any
	updateNote(note: Note): any
	downloadNotes(): Promise<Note[]>

	saveUser(user: User): any
	deleteUser(user: User): any
	updateUser(user: User): any
	downloadUsers(): Promise<User[]>

	saveTag(tag: Tag): any
	deleteTag(tag: Tag): any
	updateTag(tag: Tag): any
	downloadTags(): Promise<Tag[]>
}

export function CheckDatabaseLocation(): DataStorage {
	const saveData = require('../../config.json').saveData
	switch (saveData) {
		case 'database':
			return new SQLDatabase()
		default:
		case 'files':
			return new FilesDatabase()
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
