import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  usuarioActivo = sessionStorage.getItem('usuario_activo');

  isAdmin = false;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    if (sessionStorage.getItem('rol_usuario') === 'usuario') {
      return;
    } else {
      this.isAdmin = true;
    }
  }

  cerrarSesion() {
    this.router.navigate(['/logIn']);
    this.auth.logOut();
  }
}
