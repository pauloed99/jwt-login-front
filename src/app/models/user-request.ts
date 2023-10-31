import { Address } from "./address";

export interface UserRequest {
    id: number;
    name: string;
    email: string;
    password: string;
    birthDate: Date;
    address: Address;
}