import fs from 'fs'
import { Note } from '../entity/note'
import { Tag } from '../entity/tag'
import { User } from '../entity/user'
import { DataStorage } from '../interfaces/database'

export class FilesDatabase implements DataStorage {
	//#region Paths
	private notesPath: string = '././data/notes.json'
	private tagsPath: string = '././data/tags.json'
	private usersPath: string = '././data/users.json'
	//#endregion

	//#region Notes
	async saveNote(note: Note) {
		const notes = await this.downloadNotes()
		const index = notes.findIndex(x => x.id == note.id)
		if (index >= 0) notes[index] = note
		else notes.push(note)
		this.writeFile(JSON.stringify(notes, null, 2), this.notesPath)
	}
	async updateNote(note: Note) {
		const notes = await this.downloadNotes()
		const index = notes.findIndex(x => x.id == note.id)
		notes[index] = note

		this.writeFile(JSON.stringify(notes, null, 2), this.notesPath)
	}
	async deleteNote(note: Note) {
		const notes = await this.downloadNotes()
		const index = notes.findIndex(x => x.id == note.id)

		if (index >= 0) notes.splice(index, 1)
		else throw new Error('Nie odnaleziono notatki z podanym ID.')
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
	async updateUser(user: User) {
		const users = await this.downloadUsers()
		const index = users.findIndex(x => x.id == user.id)
		users[index] = user

		this.writeFile(JSON.stringify(users, null, 2), this.usersPath)
	}
	async deleteUser(user: User) {
		const users = await this.downloadUsers()
		const index = users.findIndex(x => x.id == user.id)

		if (index >= 0) users.splice(index, 1)
		else throw new Error('Nie odnaleziono użytkownika z podanym ID')

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
	async updateTag(tag: Tag) {
		const tags = await this.downloadTags()
		const index = tags.findIndex(x => x.name == tag.name)
		tags[index] = tag

		this.writeFile(JSON.stringify(tags, null, 2), this.tagsPath)
	}
	async deleteTag(tag: Tag) {
		const tags = await this.downloadTags()
		const index = tags.findIndex(x => x.id == tag.id)

		if (index >= 0) tags.splice(index, 1)
		else throw new Error('Nie odnaleziono podanego tagu.')

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
