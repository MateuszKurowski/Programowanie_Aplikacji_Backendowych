type TableState = 'Wolny' | 'Zajęty' | 'Niedostępny'

export class Table {
	public SeatsNumber: number
	constructor(public tableNumber: number, SeatsNumber: number, public State: TableState) {
		if (SeatsNumber < 1) throw new Error('Ilość miejsc przy stoliku nie może być mniejsza niż 1!')
		this.SeatsNumber = SeatsNumber
	}
}
