import { CheckDatabaseLocation } from '../interfaces/database'
import mongoose from 'mongoose'
import { AnyBulkWriteOperation } from 'mongodb'

export class Tag {
	private _id: number = 0
	constructor(public name: string) {
		CheckDatabaseLocation()
			.downloadTags()
			.then(tagsData => {
				if (tagsData.findIndex(x => x.name.toLowerCase() == name.toLowerCase()) >= 0)
					throw new Error('Podany tag już istnieje')
			})
	}

	public get Id() {
		return this._id
	}

	SetId() {
		if (this._id == 0) this._id = Date.now()
	}
}

export async function IsTagExist(tagName: string) {
	if (!tagName) return null
	const tags = await CheckDatabaseLocation().downloadTags()
	const existingTag = tags.find(x => x.name.toLowerCase() == tagName.toLowerCase().trim())
	if (!existingTag) {
		const tag = new Tag(tagName.trim())
		await CheckDatabaseLocation().saveTag(tag)
		return tag
	} else return existingTag
}

export async function GetTagById(tagId: number) {
	if (!tagId || tagId == 0) return null
	const tags = await CheckDatabaseLocation().downloadTags()
	const tag = tags?.find(x => x.Id == tagId)
	if (!tag) return null
	return tag
}

export const TagModel = mongoose.model(
	'Tag',
	new mongoose.Schema(
		{
			name: {
				type: String,
				required: true,
				unique: true,
				uppercase: true,
			},
		},
		{
			timestamps: true,
		}
	)
)
