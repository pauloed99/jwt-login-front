import { Address } from './address';

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  birthDate: Date;
  address: Address;
}
