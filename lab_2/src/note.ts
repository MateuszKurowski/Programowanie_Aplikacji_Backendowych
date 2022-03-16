export class Note {
	title: string
	content: string
	createDate: string
	tags: string[]
	id: number

	constructor(title : string, content : string) {
		this.title = title
		this.content = content
	}
}
