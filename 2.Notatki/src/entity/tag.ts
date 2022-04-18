import { CheckDatabaseLocation } from '../interfaces/database'

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
