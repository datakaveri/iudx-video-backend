class ServiceError extends Error {
    title: string;
    status: number;

    constructor(
        message: string,
        title: string = 'Internal Server Error',
        status: number = 500
    ) {
        super(message);
        this.title = title;
        this.status = status;
    }
}

export default ServiceError;