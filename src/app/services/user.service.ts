import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserRequest } from '../models/user-request';
import { UserResponse } from '../models/user-response';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = 'http://localhost:8080/users';
  token = sessionStorage.getItem('token');
  header = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

  constructor(private http: HttpClient) { }

  getUser() {
    return this.http.get<UserResponse>(this.baseUrl, {headers: this.header});
  }

  updateUser(user: UserRequest) {
    return this.http.put(this.baseUrl, user, {headers: this.header});
  }

  deleteUser() {
    return this.http.delete(this.baseUrl, {headers: this.header});
  }
}
