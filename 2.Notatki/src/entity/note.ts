import { CheckDatabaseLocation } from '../interfaces/database'
import { Tag } from './tag'
type AccessModifier = 'public' | 'private'

export class Note {
	public readonly createDate = new Date().toISOString()
	public readonly id = Date.now()
	public access: AccessModifier

	constructor(
		public title: string,
		public content: string,
		public ownerId?: number,
		public tags?: Tag[],
		accessToNote: AccessModifier = 'private'
	) {
		this.access = accessToNote
	}

	Save() {
		CheckDatabaseLocation().saveNote(this)
	}
}
