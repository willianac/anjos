function validateInput(str: string): boolean {
	const valid = /[^A-Za-z0-9_@.,-]/
	
	return valid.test(str)
}

export default validateInput;