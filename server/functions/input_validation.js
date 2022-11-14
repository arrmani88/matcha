function isName(name) {
	const rgx = /^[a-zA-Z ]{2,35}$/
	return rgx.test(String(name))
}

function isUsername(username) {
	const rgx = /^[a-zA-Z0-9]{2,35}$/
	return rgx.test(String(username))
}

function isEmail(email) {
	const rgx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	return rgx.test(String(email).toLowerCase())
}
	
function isPassword(password) {
	const rgx = /^.{6,20}$/
	return rgx.test(String(password))
}

function isBirthday(date) {
	const rgx = /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/
	return rgx.test(String(date))
	// should be like this: 2022-05-28
}

function isGender(gender) {
	return (gender == 'M' || gender == 'F' || gender == 'N')
}

function isCity(city) {
	const rgx = /^([a-zA-Z\u0080-\u024F]+(?:. |-| |'))*[a-zA-Z\u0080-\u024F]*$/
	return rgx.test(String(city))
}

module.exports = { isName, isUsername, isEmail, isPassword, isBirthday, isGender, isCity }