import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { ProductHistoryModel } from 'src/app/models/productHistory.model';
import { ProductHistoryService } from 'src/app/services/product-history.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-history',
  templateUrl: './product-history.component.html',
  styleUrls: ['./product-history.component.css'],
})
export class ProductHistoryComponent implements OnInit {
  input = '';

  dataSource: any;

  productHistory: ProductHistoryModel[] = [];

  displayedColumns: string[] = [
    'product_id',
    'nombreProducto',
    'cantidadAMano',
    'cantidadContada',
    'fechaDeInventario',
    'nombreSupplier',
  ];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  isLoading = false;

  constructor(
    private productHistoryService: ProductHistoryService,
    private ref: ChangeDetectorRef,
    private _liveAnnouncer: LiveAnnouncer,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const product_id: any = this.route.snapshot.paramMap.get('id');

    this.isLoading = true;

    this.productHistoryService
      .getProductHistory(product_id)
      .subscribe((resp: any) => {
        console.log(resp);

        this.productHistory = resp.reverse();
        this.isLoading = false;
        this.dataSource = new MatTableDataSource<ProductHistoryModel>(
          this.productHistory
        );
        this.ref.detectChanges();
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  deleteRecords() {
    const product_id: any = this.route.snapshot.paramMap.get('id');

    if (sessionStorage.getItem('rol_usuario') === 'administrador') {
      Swal.fire({
        title: 'AVISO',
        text: `¿Está seguro que quieres eliminar todos los datos?`,
        icon: 'warning',
        showConfirmButton: true,
        showCancelButton: true,
      }).then((resp) => {
        if (resp.value) {
          this.productHistoryService.deleteAllRecords(product_id).subscribe({
            next: (resp) => {
              this.productHistory.splice(0);

              this.dataSource.data = this.productHistory;
            },
            error: (e) => {
              console.log(e);

              Swal.fire({
                title: 'Solo los Administradores pueden borrar el historial',
                icon: 'info',
                allowOutsideClick: false,
              });
            },
          });
        }
      });
    } else {
      Swal.fire({
        title: 'Solo los Administradores pueden borrar el historial',
        icon: 'info',
        allowOutsideClick: false,
      });
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;

    this.input = filterValue;

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
