export default class AuthError extends Error {
    constructor(message, code) {
        super(message);
        this.name = this.constructor.name;
        this.extensions = {
            code: code
        }
        Error.captureStackTrace(this, this.constructor);
    }
}