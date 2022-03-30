export class Tag {
	id: number
	name: string

	constructor(name: string) {
		this.id = Date.now()
		this.name = name
	}
}
