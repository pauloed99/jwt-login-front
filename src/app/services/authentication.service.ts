import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserRequest } from '../models/user-request';
import { UserResponse } from '../models/user-response';
import { AuthenticationRequest } from '../models/authentication-request';
import { AuthenticationResponse } from '../models/authentication-response';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  baseUrl = 'http://localhost:8080/auth';

  constructor(private http: HttpClient) { }

  login(credentials: AuthenticationRequest) {
    return this.http.post<AuthenticationResponse>(`${this.baseUrl}/login`, credentials);
  }

  register(user: UserRequest) {
    return this.http.post<UserResponse>(`${this.baseUrl}/register`, user);
  }
}
