export enum HttpCode {
    OK = 200,
    CREATED = 201,
    NOT_MODIFIED = 304,
    SOMETHING_WENT_WRONG_MESSAGE = 400,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500,
}


export enum Message {
    SOMETHING_WENT_WRONG = "SOMETHING WENT WRONG",
    NO_DATA_FOUND = "NO DATA FOUND",
    CREATE_FAILED = "CREATE FAILED",
    UPDATE_FAILED = "UPDATE FAILED",

    NO_MEMBER_NICK = "No member with that member nick",
    USED_MEMBER_PHONE = "You are inserting already used nick or phone",
    WRONG_PASSWORD = "Wrong password",
    BAD_REQUEST = "Bad request",

    NOT_AUTHENTICATED = "Not authorized",
    BLOCKED_USER = "BLOCKED USER"
}

class Errors extends Error {
	public code: HttpCode;
	public message: Message;

	static standard = {
		code: HttpCode.INTERNAL_SERVER_ERROR,
		message: Message.SOMETHING_WENT_WRONG,
	}

	constructor(statusCode: HttpCode, statusMessage: Message) {
		super();
		this.code = statusCode;
		this.message = statusMessage;
	}
}

export default Errors