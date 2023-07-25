import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioModel } from 'src/app/models/nuevoUsuario.model';
import { Roles } from 'src/app/models/roles.interface';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sing-up',
  templateUrl: './sing-up.component.html',
  styleUrls: ['./sing-up.component.css'],
})
export class SingUpComponent implements OnInit {
  usuario!: UsuarioModel;

  forma!: FormGroup;

  recordarme = false;

  alertas = false;

  roles: Roles[] = [
    { value: 'usuario', viewValue: 'Usuario' },
    { value: 'administrador', viewValue: 'Administrador' },
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.crearFormulario();
  }

  ngOnInit() {
    this.usuario = new UsuarioModel();
  }

  get correoNoValido() {
    return (
      this.forma.get('correo')?.invalid && this.forma.get('correo')?.touched
    );
  }

  get nombreNoValido() {
    return (
      this.forma.get('nombreYApellido')?.invalid &&
      this.forma.get('nombreYApellido')?.touched
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
      username: ['', [Validators.minLength(2), Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      roles: ['', [Validators.required]],
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
      title: 'Espere',
      text: 'Guardando Información',
      allowOutsideClick: false,
    });
    Swal.showLoading();

    this.authService.singUp(this.usuario).subscribe({
      next: (resp) => {
        console.log(resp);
        Swal.fire({
          title: 'USUARIO CREADO',
          text: `Puedes inciar sesión, ${this.usuario.username}`,
          icon: 'success',
        });

        if (this.recordarme) {
          sessionStorage.setItem('username', this.usuario.username);
        }

        this.router.navigate(['/logIn']);
      },
      error: (e) => {
        console.log(e);

        Swal.fire({
          text: 'Correo Electrónico en existencia',
          icon: 'error',
        });
      },
    });
  }
}
