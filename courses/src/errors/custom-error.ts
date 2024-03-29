export abstract class CustomError extends Error {
    abstract statusCode: number;
  
    constructor(public msg: string) {
        super();
        Object.setPrototypeOf(this, CustomError.prototype);
    }
  
    abstract serializeErrors(): { message: string; fields?: string }[] | string;
}
