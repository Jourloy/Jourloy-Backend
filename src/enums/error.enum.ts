export enum ERR {
	// Database
	DATABASE = `Database error`,

	// User
	USER_EXIST = `User already exist`,
	USER_NOT_FOUND = `User not found`,
	INCORRECT_PASSWORD = `Password is incorrect`,
	REFRESH_TOKEN_NOT_VALID = `Refresh token is not valid`,

	// Tracker
	TRACKER_EXIST = `Tracker already exist`,
	TRACKER_NOT_FOUND = `Tracker not found`,

	// Other
	INCORRECT_DATA = `Data is incorrect`,
	FORBIDDEN = `Forbidden`,
}