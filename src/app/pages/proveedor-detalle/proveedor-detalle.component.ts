import { Component, OnInit } from '@angular/core';
import { ProductoModel } from 'src/app/models/producto.model';
import { ProductosService } from 'src/app/services/productos.service';
import { ProveedoresServicesService } from 'src/app/services/proveedores-services.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-proveedor-detalle',
  templateUrl: './proveedor-detalle.component.html',
  styleUrls: ['./proveedor-detalle.component.css'],
})
export class ProveedorDetalleComponent implements OnInit {
  ipImg: string = environment.ipImg;

  productos: ProductoModel[] = [];

  isLoading = false;

  constructor(private productoService: ProductosService) {}

  ngOnInit() {
    this.productoService.getProductos().subscribe((resp: any) => {
      console.log(resp);

      this.productos = resp.reverse();
      this.isLoading = false;
    });
  }

  deleteProducto(producto: ProductoModel, i: number) {
    Swal.fire({
      title: 'AVISO',
      text: `¿Está seguro que quieres eliminar "${producto.nombreProducto}"?`,
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true,
    }).then((resp) => {
      if (resp.value) {
        this.productos.splice(i, 1);

        //Aca hay que agregar un http.delete de la imagen que se va a subir para la imagen de presentación

        this.productoService.deleteProducto(producto.id).subscribe();
      }
    });
  }
}
