import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioModel } from 'src/app/models/nuevoUsuario.model';
import { UsuarioLogin } from 'src/app/models/usuarioLogin.interface';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css'],
})
export class LogInComponent implements OnInit {
  usuarioLogin!: UsuarioLogin;

  usuario: UsuarioModel = new UsuarioModel();

  forma!: FormGroup;

  recordarme = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.crearFormulario();

    this.redirectHome();
  }

  ngOnInit() {
    if (sessionStorage.getItem('username')) {
      this.usuario.username = sessionStorage.getItem('username');
      this.recordarme = true;
    }
  }

  get correoNoValido() {
    return (
      this.forma.get('correo')?.invalid && this.forma.get('correo')?.touched
    );
  }

  get passwordNoValida() {
    return (
      this.forma.get('password')?.invalid && this.forma.get('password')?.touched
    );
  }

  crearFormulario() {
    this.forma = this.fb.group({
      username: ['', [Validators.minLength(2), Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      recordarme: [''],
    });
  }

  guardarForm() {
    if (this.forma.invalid) {
      return Object.values(this.forma.controls).forEach((control) => {
        if (control instanceof FormGroup) {
          Object.values(control.controls).forEach(
            (control) => control.markAsTouched
          );
        } else {
          control.markAsTouched;
        }
      });
    }

    Swal.fire({
      allowOutsideClick: false,
      text: 'Espere por favor...',
      icon: 'info',
    });
    Swal.showLoading();

    this.authService.logIn(this.usuario).subscribe({
      next: (resp) => {
        console.log(resp);

        Swal.close();

        if (this.recordarme) {
          sessionStorage.setItem('username', this.usuario.username);
        } else {
          if (this.usuario.username === sessionStorage.getItem('username')) {
            sessionStorage.removeItem('username');
          }
        }

        this.router.navigate(['/home']);
      },
      error: (e) => {
        console.log(e);

        Swal.fire({
          text: 'Correo electrónico o contraseña inválida',
          icon: 'error',
        });
      },
    });
  }

  redirectHome() {
    if (
      this.authService.isAuthenticated() &&
      this.route.routeConfig?.path === 'logIn'
    ) {
      this.router.navigate(['/home']);
    }
  }
}
