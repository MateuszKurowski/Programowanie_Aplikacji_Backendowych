export class Restaurant {
	public TelNumber?: string
	public Nip?: string
	public Email?: string
	public www?: string

	constructor(
		public Name: string,
		public Adress: string,
		TelNumber?: string,
		Nip?: string,
		Email?: string,
		www?: string
	) {
		if (TelNumber && this.validateNumber(TelNumber)) this.TelNumber = TelNumber
		else throw new Error('Podano nieprawidłowy numer telefonu.')

		if (Nip && this.validateNip(Nip)) this.Nip = Nip
		else throw new Error('Podano nieprawidłowy NIP.')

		if (Email && this.validateEmail(Email)) this.Email = Email
		else throw new Error('Podano nieprawidłowy adres email.')

		if (www && www.indexOf('.') > 0) this.www = www
		else throw new Error('Podano nieprawidłowy adres strony www.')
	}

	private validateNumber(telNumber: string) {
		const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{3})$/
		return phoneRegex.test(telNumber)
	}

	private validateNip(nip: string) {
		if (typeof nip !== 'string') return false

		nip = nip.replace(/[\ \-]/gi, '')

		let weight = [6, 5, 7, 2, 3, 4, 5, 6, 7]
		let sum = 0
		let controlNumber = parseInt(nip.substring(9, 10))
		let weightCount = weight.length
		for (let i = 0; i < weightCount; i++) {
			sum += parseInt(nip.substr(i, 1)) * weight[i]
		}

		return sum % 11 === controlNumber
	}

	private validateEmail(email: string) {
		if (!email) return false

		const emailRegex =
			/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

		return emailRegex.test(email)
	}
}
