// This will be an error that we want to be able to throw at some point in time, any time the user tries to navigate to some route that doesn't exist.
import { CustomError } from "./custom-error";


export class NotFoundError extends CustomError {
    statusCode = 404;

    constructor() {
        super('Route not found');

        Object.setPrototypeOf(this, NotFoundError.prototype);
    }

    serializeErrors() {
        return [{ message: 'Not Found' }]
    }
}