import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
    private router: Router
  ) {
    this.crearFormulario();
  }

  ngOnInit() {}

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
      correo: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'),
        ],
      ],
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
        Swal.close();
        console.log(resp);
        this.router.navigate(['/proveedores']);
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
}
