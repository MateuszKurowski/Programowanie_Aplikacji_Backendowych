import { Note } from '../entity/note'
import { Tag } from '../entity/tag'
import { User } from '../entity/user'
import { DataStorage } from '../interfaces/database'
import { ChangeStreamDocument } from "mongodb";
import mongoose from "mongoose";

export class SQLDatabase implements DataStorage {
	saveNote(notes: Note) {
		throw new Error('Method not implemented.')
	}
	saveNotes(notes: Note[]) {
		throw new Error('Method not implemented.')
	}
	downloadNotes(): Promise<Note[]> {
		throw new Error('Method not implemented.')
	}
	saveUser(users: User) {
		throw new Error('Method not implemented.')
	}
	saveUsers(users: User[]) {
		throw new Error('Method not implemented.')
	}
	downloadUsers(): Promise<User[]> {
		throw new Error('Method not implemented.')
	}
	saveTag(tags: Tag) {
		throw new Error('Method not implemented.')
	}
	saveTags(tags: Tag[]) {
		throw new Error('Method not implemented.')
	}
	downloadTags(): Promise<Tag[]> {
		throw new Error('Method not implemented.')
	}
}

export function ConnectToDatabase()
{
	
}