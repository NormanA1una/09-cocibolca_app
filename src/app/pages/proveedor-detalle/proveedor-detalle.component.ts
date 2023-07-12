import { LiveAnnouncer } from '@angular/cdk/a11y';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
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

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  isLoading = false;

  constructor(
    private productoService: ProductosService,
    private http: HttpClient,
    private ref: ChangeDetectorRef,
    private _liveAnnouncer: LiveAnnouncer
  ) {}

  ngOnInit() {
    this.isLoading = true;

    this.productoService.getProductos().subscribe((resp: any) => {
      console.log(resp);

      this.productos = resp.reverse();
      this.isLoading = false;
      this.dataSource = new MatTableDataSource<ProductoModel>(this.productos);
      console.log(this.dataSource);
      this.ref.detectChanges();
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
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
        const { pageIndex, pageSize } = this.paginator;

        const removeIndex = i + pageIndex * pageSize;
        console.log(removeIndex);

        this.productos.splice(removeIndex, 1);
        this.dataSource.data = this.productos;

        this.productoService.deleteProducto(producto.id).subscribe();

        /* this.productos.splice(i, 1);
        this.dataSource.data = this.productos;

        console.log(this.dataSource);

        this.productoService.deleteProducto(producto.id).subscribe(); */
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}
