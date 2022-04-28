function isName(name) {
	const rgx = /^[a-zA-Z]{2,35}$/
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
	const rgx = /^(?=.*\d)(?=.*[a-zA-Z]).{8,}$/
	return rgx.test(String(password))
}
	
module.exports = { isName, isUsername, isEmail, isPassword }