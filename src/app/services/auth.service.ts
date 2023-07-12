import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UsuarioModel } from '../models/nuevoUsuario.model';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private url = 'http://localhost:3000';

  userToken!: string | null;

  constructor(private http: HttpClient) {
    this.leerToken();
  }

  logOut() {}

  logIn(usuario: UsuarioModel) {
    const authData = {
      correo: usuario.correo,
      password: usuario.password,
    };

    return this.http.post(`${this.url}/auth/login`, authData).pipe(
      map((resp: any) => {
        console.log('Token guardado en session storage', resp);
        this.guadarToken(resp['access_token']);
        return resp;
      })
    );
  }

  singUp(usuario: UsuarioModel) {
    return this.http.post(`${this.url}/user`, usuario);
  }

  private guadarToken(token: string) {
    this.userToken = token;
    sessionStorage.setItem('user_access_token', token);
  }

  leerToken() {
    if (sessionStorage.getItem('user_access_token')) {
      this.userToken = sessionStorage.getItem('user_access_token');
    } else {
      this.userToken = '';
    }

    return this.userToken;
  }
}
