import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ProveedorModel } from 'src/app/models/proveedor.model';
import { ProveedoresServicesService } from 'src/app/services/proveedores-services.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environments/environment';

import { Observable } from 'rxjs';

import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-proveedor',
  templateUrl: './proveedor.component.html',
  styleUrls: ['./proveedor.component.css'],
})
export class ProveedorComponent implements OnInit, OnDestroy {
  messageNoneFile = 'No file uploaded yet.';

  ip: string = environment.ip;

  btnDeleteImage = true;

  fileName = '';

  esEdicion = false;

  title: string = '';
  //Gracias a estro podemos realizar los formularios reactivos
  forma!: FormGroup;

  //Aca importamos el modelo de lo que deberia de tener un Proveedor
  proveedor = new ProveedorModel();

  //En el constructor tenemos el fb que es el que nos permite hacer el .group y no tener que estar creando tantas instancias
  //Tenemos tambien el proveedorServices que es el que nos trae la info del BackEnd
  //Ahora para poder leer el id que viene como parametro en el URL tenemos el activatedRoute
  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private proveedorService: ProveedoresServicesService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.crearFormulario();
  }

  ngOnInit() {
    const id: any = this.route.snapshot.paramMap.get('id');

    if (id !== 'nuevo') {
      this.proveedorService.getProveedor(id).subscribe((resp: any) => {
        this.proveedor = resp as ProveedorModel;
        this.esEdicion = true;
        this.title = this.proveedor.nombreProveedor;
        console.log(this.proveedor);
      });
    }
  }

  ngOnDestroy() {
    alert(
      'Estas seguro que quiere abandonar la pagina? Perderas lo que no hayas guardado!'
    );
  }

  crearFormulario() {
    this.forma = this.fb.group({
      databaseId: [''],
      nombreProveedor: [''],
      tipoDeProducto: [''],
      activo: [''],
      logo: [''],
      tools: [''],
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    console.log(
      'Proveedor antes de que se suba la imagen',
      this.proveedor.logo
    );

    if (file) {
      this.fileName = file.name;

      const formData = new FormData();

      formData.append('file', file);

      const upload$ = this.http.post('http://localhost:3000/file', formData);

      upload$.subscribe((resp: any) => {
        this.proveedor.logo = resp.filename;
        console.log(this.proveedor.logo);

        console.log(resp);
        return this.proveedor.logo;
      });
    }
  }

  //TODO Mejorar este botón
  /* onRegresar() {
    const id: any = this.route.snapshot.paramMap.get('id');

    const confirmationMessage =
      '¿Estás seguro de que deseas retroceder? Los cambios no guardados se perderán.';

    if (id !== 'nuevo') {
      return;
    } else if (confirm(confirmationMessage)) {
      // El usuario aceptó retroceder
      this.deleteResourceOnUnload();
      this.router.navigate(['/proveedores']);
    } else {
      // El usuario canceló el retroceso pero igual se borra la imagen del disco
      if (id !== 'nuevo') {
        return;
      } else {
        this.deleteResourceOnUnload();
        this.router.navigate(['/proveedor/nuevo']);
      }
    }
  } */

  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: BeforeUnloadEvent) {
    event.preventDefault();
    event.returnValue = true;
  }

  deleteResourceOnUnload() {
    if (this.proveedor.logo === undefined) {
      console.log('Imagen del proveedor no subida');
      return;
    }

    console.log(this.proveedor.logo);

    this.http
      .delete(`http://localhost:3000/file/${this.proveedor.logo}`)
      .subscribe(() => {
        this.fileName = '';
        console.log('Llamada HTTP DELETE exitosa');
      });
  }

  guardar() {
    if (this.forma.invalid) {
      console.log('Formulario no válido');
      return;
    }

    Swal.fire({
      title: 'Espere',
      text: 'Guardando Información',
      allowOutsideClick: false,
    });
    Swal.showLoading();

    let peticion: Observable<any>;

    if (this.proveedor.id) {
      peticion = this.proveedorService.actualizarProveedor(this.proveedor);
    } else {
      peticion = this.proveedorService.crearProveedor(this.proveedor);
    }

    peticion.subscribe((resp) => {
      console.log(resp);

      Swal.fire({
        title: this.proveedor.nombreProveedor,
        text: 'Información actualizada correctamente',
        icon: 'success',
      });
    });
  }
}
