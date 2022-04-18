import fs from 'fs'
import { Note } from '../entity/note'
import { Tag } from '../entity/tag'
import { User } from '../entity/user'
import { DatabaseOperation } from '../interfaces/database'

export class FilesDatabase implements DatabaseOperation {
	//#region Paths
	private notesPath: string = '././data/notes.json'
	private tagsPath: string = '././data/tags.json'
	private usersPath: string = '././data/users.json'
	//#endregion

	//#region Notes
	async saveNote(note: Note) {
		const notes = await this.downloadNotes()
		notes.push(note)
		this.writeFile(JSON.stringify(notes, null, 2), this.notesPath)
	}
	async saveNotes(notes: Note[]) {
		this.writeFile(JSON.stringify(notes, null, 2), this.notesPath)
	}
	async downloadNotes() {
		const data = await this.readFile(this.notesPath)
		if (data.length < 1) return []
		return JSON.parse(data) as Note[]
	}
	//#endregion

	//#region Users
	async saveUser(user: User) {
		const users = await this.downloadUsers()
		users.push(user)
		this.writeFile(JSON.stringify(users, null, 2), this.usersPath)
	}
	async saveUsers(users: User[]) {
		this.writeFile(JSON.stringify(users, null, 2), this.usersPath)
	}
	async downloadUsers() {
		const data = await this.readFile(this.usersPath)
		if (data.length < 1) return []
		return JSON.parse(data) as User[]
	}
	//#endregion

	//#region Tags
	async saveTag(tag: Tag) {
		const tags = await this.downloadTags()
		tags.push(tag)
		this.writeFile(JSON.stringify(tags, null, 2), this.tagsPath)
	}
	async saveTags(tags: Tag[]) {
		this.writeFile(JSON.stringify(tags, null, 2), this.tagsPath)
	}
	public async downloadTags() {
		const data = await this.readFile(this.tagsPath)
		if (data.length < 1) return []
		return JSON.parse(data) as Tag[]
	}
	//#endregion

	//#region Operations on files
	private async readFile(filePath: string) {
		try {
			return await fs.promises.readFile(filePath, 'utf-8')
		} catch (err) {
			console.log(err)
			return ''
		}
	}

	private writeFile(dataToSave: string, filePath: string): void {
		try {
			fs.promises.writeFile(filePath, dataToSave)
		} catch (err) {
			console.log(err)
		}
	}
	//#endregion
}
