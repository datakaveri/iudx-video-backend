export interface UserInterface {
    id: string;
    name: string;
    email: string;
    password: string;
    salt: string;
    verificationCode: string;
    verified: boolean;
    role: string;
    approved: boolean;
}
