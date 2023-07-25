import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { UsuarioModel } from 'src/app/models/nuevoUsuario.model';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lista-usuarios',
  templateUrl: './lista-usuarios.component.html',
  styleUrls: ['./lista-usuarios.component.css'],
})
export class ListaUsuariosComponent implements OnInit {
  dataSource: any;
  displayedColumns: string[] = [
    'id',
    'username',
    'correo',
    'roles',
    'herramientas',
  ];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  isLoading = false;

  usuario: UsuarioModel[] = [];

  constructor(
    private userService: UserService,
    private ref: ChangeDetectorRef,
    private _liveAnnouncer: LiveAnnouncer,
    private router: Router
  ) {
    this.noAdmin();
  }

  ngOnInit() {
    this.isLoading = true;

    this.userService.getUsers().subscribe((resp: any) => {
      console.log(resp);

      this.usuario = resp.reverse();
      this.isLoading = false;
      this.dataSource = new MatTableDataSource<UsuarioModel>(this.usuario);
      this.ref.detectChanges();
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  borrarUsuario(usuario: UsuarioModel, i: number) {
    Swal.fire({
      title: 'AVISO',
      text: `¿Está seguro que quieres eliminar el usuario: "${usuario.username}"?`,
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true,
    }).then((resp) => {
      if (resp.value) {
        const { pageIndex, pageSize } = this.paginator;

        const removeIndex = i + pageIndex * pageSize;

        this.usuario.splice(removeIndex, 1);
        this.dataSource.data = this.usuario;

        this.userService.deleteUser(usuario.id).subscribe((resp) => {
          console.log(resp);
        });
      }
    });
  }

  noAdmin() {
    if (sessionStorage.getItem('rol_usuario') === 'usuario') {
      this.router.navigate(['/home']);
    }
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
