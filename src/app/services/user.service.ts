import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  header = {
    headers: new HttpHeaders().set(
      'Authorization',
      `Bearer ${sessionStorage.getItem('user_access_token')}`
    ),
  };

  private url = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getUsers() {
    return this.http.get(`${this.url}/user`, this.header);
  }

  deleteUser(id: string) {
    return this.http.delete(`${this.url}/user/${id}`, this.header);
  }
}
