import { Note, NoteModel } from '../entity/note'
import { Tag, TagModel } from '../entity/tag'
import { User, UserModel } from '../entity/user'
import { DataStorage } from '../interfaces/database'
import { ChangeStreamDocument, MongoClient, ObjectID, ServerApiVersion } from 'mongodb'
import mongoose from 'mongoose'
import { connectionString } from '../../config.json'

export class SQLDatabase implements DataStorage {
	async saveNote(note: Note) {
		const db = await mongoose.connect(connectionString)
		const noteMongo = new NoteModel({
			Title: note.Title,
			Content: note.Content,
			OwnerId: note.OwnerId,
			Tags: note.Tags,
			IsPublic: note.IsPublic,
		}).Save()
	}
	async deleteNote(note: Note) {
		const db = await mongoose.connect(connectionString)
		NoteModel.findByIdAndDelete(new ObjectID(note.id.toString()))
	}
	async updateNote(note: Note) {
		const db = await mongoose.connect(connectionString)
		NoteModel.findByIdAndUpdate(note.id)
	}
	async downloadNotes(): Promise<Note[]> {
		const db = await mongoose.connect(connectionString)
		return NoteModel.find()
	}
	async saveUser(user: User) {
		const db = await mongoose.connect(connectionString)
		const userMongo = new UserModel({
			Login: user.login,
			Password: user.password,
			Name: user.name,
			Surname: user.surname,
			DateOfBirth: user.dateOfBirth,
		}).Save()
	}
	async deleteUser(user: User) {
		const db = await mongoose.connect(connectionString)
		UserModel.findByIdAndDelete(new ObjectID(user.id.toString()))
	}
	async updateUser(user: User) {
		const db = await mongoose.connect(connectionString)
		UserModel.findByIdAndUpdate(user.id)
	}
	async downloadUsers(): Promise<User[]> {
		const db = await mongoose.connect(connectionString)
		return UserModel.find()
	}
	async saveTag(tag: Tag) {
		const db = await mongoose.connect(connectionString)
		const tagMongo = new TagModel({
			Name: tag.name,
		}).Save()
	}
	async deleteTag(tag: Tag) {
		const db = await mongoose.connect(connectionString)
		TagModel.findByIdAndDelete(new ObjectID(tag.id.toString()))
	}
	async updateTag(tag: Tag) {
		const db = await mongoose.connect(connectionString)
		TagModel.findByIdAndUpdate(tag.id)
	}
	async downloadTags(): Promise<Tag[]> {
		const db = await mongoose.connect(connectionString)
		return TagModel.find()
	}
}
