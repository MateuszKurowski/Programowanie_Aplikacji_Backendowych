import { CheckDatabaseLocation } from '../interfaces/database'
import mongoose from 'mongoose'

export class Tag {
	public readonly id = Date.now()
	constructor(public name: string) {
		CheckDatabaseLocation()
			.downloadTags()
			.then(tagsData => {
				if (tagsData.findIndex(x => x.name.toLowerCase() == name.toLowerCase()) >= 0)
					throw new Error('Podany tag już istnieje')
			})
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
	const tag = tags?.find(x => x.id == tagId)
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
