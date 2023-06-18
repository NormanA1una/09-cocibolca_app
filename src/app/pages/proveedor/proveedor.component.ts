import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProveedorModel } from 'src/app/models/proveedor.model';
import { ProveedoresServicesService } from 'src/app/services/proveedores-services.service';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-proveedor',
  templateUrl: './proveedor.component.html',
  styleUrls: ['./proveedor.component.css'],
})
export class ProveedorComponent implements OnInit {
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
    private fb: FormBuilder,
    private proveedorService: ProveedoresServicesService,
    private route: ActivatedRoute
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
