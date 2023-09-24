export enum ERR {
	// Database
	DATABASE = `Database error`,

	// User
	USER_EXIST = `User already exist`,
	USER_NOT_FOUND = `User not found`,
	INCORRECT_PASSWORD = `Password is incorrect`,
	REFRESH_TOKEN_NOT_VALID = `Refresh token is not valid`,

	// Calculator
	CALC_EXIST = `Calculator already exist`,
	CALC_NOT_FOUND = `Calculator not found`,

	// Other
	INCORRECT_DATA = `Data is incorrect`,
	FORBIDDEN = `Forbidden`,

	// Tracker
	TRACKER_EXIST = `Tracker already exist`,
	TRACKER_NOT_FOUND = `Tracker not found`,

	// Dark
	DARK_ATTRIBUTE_EXIST = `Dark attribute already exist`,
	DARK_ATTRIBUTE_NOT_FOUND = `Dark attribute not found`,
	DARK_CLASS_EXIST = `Dark class already exist`,
	DARK_CLASS_NOT_FOUND = `Dark class not found`,
	DARK_LEVEL_EXIST = `Dark level already exist`,
	DARK_LEVEL_NOT_FOUND = `Dark level not found`,
}