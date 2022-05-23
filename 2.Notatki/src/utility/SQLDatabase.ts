import { Note, NoteModel } from '../entity/note'
import { Tag, TagModel } from '../entity/tag'
import { User, UserModel } from '../entity/user'
import { DataStorage } from '../interfaces/database'
import { ChangeStreamDocument, MongoClient, ObjectID, ServerApiVersion } from 'mongodb'
import mongoose, { mongo } from 'mongoose'
import { connectionString } from '../../config.json'
import { appendFile } from 'fs'

export class SQLDatabase implements DataStorage {
	async saveNote(note: Note) {
		await new NoteModel({
			_id: note.Id,
			Title: note.Title,
			Content: note.Content,
			OwnerId: note.OwnerId,
			Tags: note.Tags,
			IsPublic: note.IsPublic,
			CreateDate: note.createDate,
		}).save()
	}
	async deleteNote(note: Note) {
		await NoteModel.findByIdAndDelete(note.Id)
	}
	async updateNote(note: Note) {
		await NoteModel.findByIdAndUpdate(note.Id)
	}
	async downloadNotes(): Promise<Note[]> {
		const monogocollection = await NoteModel.find()
		let notes: Note[] = []
		for (const mongo of monogocollection) {
			notes.push(
				new Note(
					mongo.Title,
					mongo.Content,
					mongo.OwnerId,
					mongo._id,
					mongo.Tags,
					mongo.IsPublic,
					mongo.SharedUserIds,
					mongo.CreateDate
				)
			)
		}
		return notes
	}

	async saveUser(user: User) {
		await new UserModel({
			_id: user.Id,
			Login: user.login,
			Password: user.password,
			Name: user.name,
			Surname: user.surname,
			DateOfBirth: user.dateOfBirth,
			IsAdmin: user.IsAdmin,
			CreateDate: user.createDate,
		}).save()
	}
	async deleteUser(user: User) {
		await UserModel.findByIdAndDelete(user.Id)
	}
	async updateUser(user: User) {
		await UserModel.findByIdAndUpdate(user.Id)
	}
	async downloadUsers(): Promise<User[]> {
		const monogocollection = await UserModel.find()
		let users: User[] = []
		for (const mongo of monogocollection) {
			users.push(
				new User(
					mongo.Login,
					mongo.Password,
					mongo._id,
					mongo.CreateDate,
					mongo.IsAdmin,
					mongo.Name,
					mongo.Surname,
					mongo.DateOfBirth
				)
			)
		}
		return users
	}
	async saveTag(tag: Tag) {
		await new TagModel({
			_id: tag.Id,
			Name: tag.name,
		}).save()
	}
	async deleteTag(tag: Tag) {
		await TagModel.findByIdAndDelete(tag.Id)
	}
	async updateTag(tag: Tag) {
		await TagModel.findByIdAndUpdate(tag.Id)
	}
	async downloadTags(): Promise<Tag[]> {
		const monogocollection = await TagModel.find()
		let tags: Tag[] = []
		for (const mongo of monogocollection) {
			tags.push(new Tag(mongo._id, mongo.Name))
		}
		return tags
	}
}

export async function ConnectSQL() {
	await mongoose
		.connect(connectionString)
		.then(result => console.log('Otwarto połączenie z bazą!'))
		.catch(err => console.log(err))
}
