import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UsuarioModel } from '../models/nuevoUsuario.model';
import { map } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  jwtService = new JwtHelperService();

  private url = 'http://localhost:3000';

  userToken!: string | null;

  constructor(private http: HttpClient) {
    this.leerToken();
  }

  //Log Out
  logOut() {
    sessionStorage.removeItem('user_access_token');
    sessionStorage.removeItem('token_expira');
    sessionStorage.removeItem('usuario_activo');
    sessionStorage.removeItem('rol_usuario');
  }

  //Log In
  logIn(usuario: UsuarioModel) {
    const authData = {
      username: usuario.username,
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

  //Sign Up
  singUp(usuario: UsuarioModel) {
    return this.http.post(`${this.url}/user`, usuario);
  }

  //Funcion privada para guardar el token en la session storage
  private guadarToken(token: string) {
    const tokenDecode = this.jwtService.decodeToken(token);

    sessionStorage.setItem(
      'token_expira',
      new Date(tokenDecode.exp * 1000).getTime().toString()
    );

    this.userToken = token;
    console.log('Token Decode', tokenDecode);

    sessionStorage.setItem('user_access_token', token);
    sessionStorage.setItem('usuario_activo', tokenDecode.username);
    sessionStorage.setItem('rol_usuario', tokenDecode.rol);
  }

  //Lectura token inicial
  leerToken() {
    if (sessionStorage.getItem('user_access_token')) {
      this.userToken = sessionStorage.getItem('user_access_token');
    } else {
      this.userToken = '';
    }

    return this.userToken;
  }

  //Comprobación si esta autenticado
  isAuthenticated(): boolean {
    if (this.userToken!.length < 2) {
      return false;
    }

    const expira = Number(sessionStorage.getItem('token_expira'));
    const expiraDate = new Date();
    expiraDate.setTime(expira);

    if (expiraDate > new Date()) {
      return true;
    } else {
      return false;
    }
  }
}
