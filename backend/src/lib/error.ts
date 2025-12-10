


export class HTTPError extends Error {
    status: number;
    details?: unknown;

    constructor(status: number, message: string, details?: unknown) {
        super(message);
        this.status = status;
        this.details = details;
    }
}

export class NotFoundError extends HTTPError {
    constructor(message: string = "Not Found"){
        super(404, message);
    }
}

export class BadRequestError extends HTTPError {
    constructor(message: string = "Bad Request", details?: unknown){
        super(400, message, details);
    }
}

export class UnauthorizedError extends HTTPError {
    constructor(message: string = "Unauthorized", ){
        super(401, message);
    }
}

export class ForbiddenError extends HTTPError {
    constructor(message: string = "Forbidden", ){
        super(403, message);
    }
}