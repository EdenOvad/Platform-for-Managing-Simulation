export interface GenericResponse {
    status: string;
    message: string;
}

export interface IUser {
    username: string;
    role: string;
    _id: string;
    created_at: string;
    updated_at: string;
}

export interface RegisterUserRequest {
    username: string;
    email: string;
    password: string;
}

export interface LoginUserRequest {
    username: string;
    password: string;
}