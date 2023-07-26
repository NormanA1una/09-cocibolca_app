import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProveedorModel } from 'src/app/models/proveedor.model';
import { AuthService } from 'src/app/services/auth.service';
import { ProveedoresServicesService } from 'src/app/services/proveedores-services.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css'],
})
export class ProveedoresComponent implements OnInit {
  // lengthTable: number = 0;

  ip: string | undefined;

  proveedorUpdate = new ProveedorModel();

  proveedores: ProveedorModel[] = [];
  isLoading = false;

  constructor(private proveedoresServices: ProveedoresServicesService) {
    this.ip = environment.ip;
  }

  ngOnInit() {
    this.isLoading = true;

    this.proveedoresServices.getProveedores().subscribe((resp: any) => {
      console.log(resp);

      this.proveedores = resp.reverse();
      this.isLoading = false;
    });
  }

  //Funcion para cambiar estado
  cambiarEstado(proveedor: ProveedorModel) {
    this.proveedorUpdate = proveedor;

    Swal.fire({
      title: 'AVISO',
      text: `¿Quieres cambiar el estado a "${
        !this.proveedorUpdate.estado ? 'Activo' : 'Inactivo'
      }"?`,
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true,
    }).then((resp) => {
      if (resp.value) {
        this.proveedorUpdate.estado = !this.proveedorUpdate.estado;

        this.proveedoresServices
          .actualizarProveedor(this.proveedorUpdate)
          .subscribe();

        Swal.fire({
          text: 'Información actualizada correctamente!',
          icon: 'success',
        });
      }
    });
  }

  borrarProveedor(proveedor: ProveedorModel, i: number) {
    Swal.fire({
      title: 'AVISO',
      text: `¿Está seguro que quiere eliminar "${proveedor.nombreProveedor}"?`,
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true,
    }).then((resp) => {
      if (resp.value) {
        this.proveedores.splice(i, 1);

        this.proveedoresServices.deleteProveedor(proveedor.id).subscribe();
      }
    });
  }
}
