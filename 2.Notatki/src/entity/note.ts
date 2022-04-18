import { Tag } from './tag'

export class Note {
	public readonly createDate = new Date().toISOString()
	public readonly id = Date.now()

	constructor(public title: string, public content: string, public ownerId?: number, public tags?: Tag[]) {}
}
