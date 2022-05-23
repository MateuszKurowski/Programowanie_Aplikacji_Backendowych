import { CheckDatabaseLocation } from '../interfaces/database'
import mongoose from 'mongoose'
import { AnyBulkWriteOperation } from 'mongodb'

export class Tag {
	public name: string
	constructor(Name: string, public readonly Id: number = Date.now()) {
		// CheckDatabaseLocation()
		// 	.downloadTags()
		// 	.then(tagsData => {
		// 		if (tagsData.findIndex(x => x.name.toUpperCase() == Name.toUpperCase()) >= 0)
		// 			throw new Error('Podany tag już istnieje')
		// 	})
		this.name = Name.toUpperCase()
	}
}

export async function IsTagExist(tagName: string) {
	if (!tagName) return null
	const tags = await CheckDatabaseLocation().downloadTags()
	const existingTag = tags.find(x => x.name.toUpperCase() == tagName.toUpperCase().trim())
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

export async function GetTagByName(tagName: string) {
	if (!tagName || tagName.length < 1) return null
	const tags = await CheckDatabaseLocation().downloadTags()

	const tag = tags?.find(x => x.name.toUpperCase == tagName.toUpperCase)
	if (!tag) return null
	return tag
}

export async function GetTags() {
	return await CheckDatabaseLocation().downloadTags()
}

export const TagModel = mongoose.model(
	'Tag',
	new mongoose.Schema(
		{
			_id: {
				type: Number,
			},
			Name: {
				type: String,
				required: true,
				unique: true,
				uppercase: true,
			},
		},
		{
			_id: false,
		}
	)
)
