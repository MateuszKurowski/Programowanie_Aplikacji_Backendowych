import { ObjectId } from 'mongodb'
import mongoose from 'mongoose'
import { CheckDatabaseLocation } from '../interfaces/database'
import { Tag } from './tag'
type AccessModifier = 'Public' | 'Private'

export class Note {
	constructor(
		public Title: string,
		public Content: string,
		public OwnerId: number,
		public Id = Date.now(),
		public Tags: Tag[] = [],
		public IsPublic: Boolean = false,
		public SharedUserIds: number[] = [],
		public createDate = new Date().toISOString()
	) {}
}

export async function GetNoteById(noteId: number) {
	if (!noteId || noteId == 0) return null
	const notes = await CheckDatabaseLocation().downloadNotes()
	const note = notes?.find(x => x.Id == noteId)
	if (!note) return null
	return note
}

export async function GetNotesByUserId(userId: number) {
	if (!userId || userId == 0) return null
	const notes = await CheckDatabaseLocation().downloadNotes()
	const userNotes = notes?.filter(function (Note) {
		return Note.OwnerId == userId
	})
	if (!userNotes || userNotes.length < 1) return []
	return userNotes
}

export async function GetSharedNotesByUserId(userId: number) {
	if (!userId || userId == 0) return null
	const notes = await CheckDatabaseLocation().downloadNotes()
	let sharedNotes: Note[] = []
	for (const note of notes) {
		if (note.SharedUserIds.find(x => x == userId)) sharedNotes.push(note)
	}

	if (!sharedNotes || sharedNotes.length < 1) return null
	return sharedNotes
}

export async function GetNotes() {
	return await CheckDatabaseLocation().downloadNotes()
}
export const NoteModel = mongoose.model(
	'Notes',
	new mongoose.Schema(
		{
			_id: {
				type: Number,
			},
			Title: {
				type: String,
				required: true,
			},
			Content: {
				type: String,
				required: false,
			},
			OwnerId: {
				type: Number,
				required: true,
			},
			Tags: {
				type: [Number],
				required: false,
			},
			IsPublic: {
				type: Boolean,
				required: false,
				default: false,
			},
			SharedUserIds: {
				type: [Number],
				required: false,
			},
			CreateDate: {
				type: Date,
				required: false,
			},
		},
		{
			_id: false,
		}
	)
)
