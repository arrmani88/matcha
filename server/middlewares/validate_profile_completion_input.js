const { isBirthday, isGender } = require('../functions/input_validation')
const fieldIsNullMessage = "One of the fields 'birthday', 'gender', 'sexualPreferences', 'biography' is empty or wasn't sent"

const validateProfileCompletionInput = (req, res, next) => {
    const { birthday, gender, sexualPreferences, biography } = req.body
    if (!birthday || !gender || !sexualPreferences || !biography) {
        res.status(422)
        return res.json({error: {'details': fieldIsNullMessage}})
    } else if (!isBirthday(birthday)){
        res.status(422)
		return res.json({error: {"details": "Invalid 'birthday' syntax, should be like YYYY-MM-DD"}})
    } else if (!isGender(gender)){
        res.status(422)
		return res.json({error: {"details": "Invalid 'gender' syntax, should be either 'M', 'F' or 'N' (if not specified)"}})
    } else if (!isGender(sexualPreferences)){
        res.status(422)
		return res.json({error: {"details": "Invalid 'sexualPreferences' syntax, should be either 'M', 'F' or 'N' (if not specified)"}})
    } else {
        next()
    }

}

module.exports = validateProfileCompletionInput
