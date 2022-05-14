import { ObjectId } from 'mongodb'
import mongoose from 'mongoose'
import { CheckDatabaseLocation } from '../interfaces/database'
import { Tag } from './tag'
type AccessModifier = 'Public' | 'Private'

export class Note {
	public readonly createDate = new Date().toISOString()
	public readonly id = Date.now()

	constructor(
		public Title: string,
		public Content: string,
		public OwnerId: number,
		public Tags?: Tag[],
		public IsPublic: Boolean = false
	) {}

	Save() {
		CheckDatabaseLocation().saveNote(this)
	}
	Delete() {
		CheckDatabaseLocation().deleteNote(this)
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
		return Note.OwnerId == userId
	})
	if (!userNotes) return null
	return userNotes
}

export async function GetNotes() {
	return await CheckDatabaseLocation().downloadNotes()
}
export const NoteModel = mongoose.model(
	'Notes',
	new mongoose.Schema(
		{
			Title: {
				type: String,
				required: true,
			},
			Content: String,
			OwnerId: {
				type: ObjectId,
				required: true,
			},
			Tags: [ObjectId],
			IsPublic: {
				type: Boolean,
				required: true,
				default: false,
			},
		},
		{
			timestamps: true,
		}
	)
)
