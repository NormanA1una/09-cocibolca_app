import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ProductoModel } from 'src/app/models/producto.model';
import { ProductosService } from 'src/app/services/productos.service';
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

  //PROBANDO HACER LA TABLA CON MATERIAL
  dataSource: any;
  displayedColumns: string[] = [
    'id',
    'nombreProducto',
    'cantidadAMano',
    'cantidadContada',
    'presentacion',
    'fechaDeInventario',
    'nombreSupplier',
    'Herramientas',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  isLoading = false;

  constructor(
    private productoService: ProductosService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.isLoading = true;

    this.productoService.getProductos().subscribe((resp: any) => {
      console.log(resp);

      this.productos = resp.reverse();
      this.isLoading = false;
      this.dataSource = new MatTableDataSource<ProductoModel>(this.productos);
      this.dataSource.paginator = this.paginator;
      console.log(this.dataSource);
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
        this.http
          .delete(`http://localhost:3000/productFile/${producto.presentacion}`)
          .subscribe((resp) => {
            console.log('Llamada DELETE ejecutada correctamente!');
          });

        this.productoService.deleteProducto(producto.id).subscribe();
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
