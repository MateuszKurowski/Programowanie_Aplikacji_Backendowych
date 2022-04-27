import mongoose from 'mongoose'
import { CheckDatabaseLocation } from '../interfaces/database'
import { Tag } from './tag'
type AccessModifier = 'Public' | 'Private'

export class Note {
	public readonly createDate = new Date().toISOString()
	public readonly id = Date.now()

	constructor(
		public title: string,
		public content: string,
		public ownerId: number,
		public tags?: Tag[],
		public accessToNote: AccessModifier = 'Private'
	) {}

	Save() {
		CheckDatabaseLocation().saveNote(this)
	}
}

export async function GetNoteById(noteId: number) {
	if (!noteId || noteId == 0) return null
	const notes = await CheckDatabaseLocation().downloadNotes()
	const note = notes?.find(x => x.id == noteId)
	if (!note) return null
	return note
}

export async function GetNotesByUserId(userId: number) {
	if (!userId || userId == 0) return null
	const notes = await CheckDatabaseLocation().downloadNotes()
	const userNotes = notes?.filter(function (Note) {
		return Note.ownerId == userId
	})
	if (!userNotes) return null
	return userNotes
}

export const notesSchema = new mongoose.Schema(
	{
		title: String,
		content: String,
		ownerId: Number,
		access: String,
		tags: [String],
	},
	{
		timestamps: true,
	}
)
