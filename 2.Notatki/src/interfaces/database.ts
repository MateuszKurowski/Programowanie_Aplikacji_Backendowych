import { Note } from '../entity/note'
import { User } from '../entity/user'
import { Tag } from '../entity/tag'
import { FilesDatabase } from '../utility/FilesDatabase'
import { SQLDatabase } from '../utility/SQLDatabase'

export interface DatabaseOperation {
	saveNote(notes: Note): any
	saveNotes(notes: Note[]): any
	downloadNotes(): Promise<Note[]>

	saveUser(users: User): any
	saveUsers(users: User[]): any
	downloadUsers(): Promise<User[]>

	saveTag(tags: Tag): any
	saveTags(tags: Tag[]): any
	downloadTags(): Promise<Tag[]>
}

export function CheckDatabaseLocation(): DatabaseOperation {
	const saveData = require('../../config.json')
	switch (saveData) {
		case 'database':
			return new SQLDatabase()
		default:
		case 'files':
			return new FilesDatabase()
	}
}
