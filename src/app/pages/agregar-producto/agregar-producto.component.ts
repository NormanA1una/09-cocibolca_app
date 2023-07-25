import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ProductoModel } from 'src/app/models/producto.model';
import { ProveedorModel } from 'src/app/models/proveedor.model';
import { Proveedor } from 'src/app/models/usuario.interface';
import { ProductosService } from 'src/app/services/productos.service';
import { ProveedoresServicesService } from 'src/app/services/proveedores-services.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-agregar-producto',
  templateUrl: './agregar-producto.component.html',
  styleUrls: ['./agregar-producto.component.css'],
})
export class AgregarProductoComponent implements OnInit, OnDestroy {
  header = {
    headers: new HttpHeaders().set(
      'Authorization',
      `Bearer ${sessionStorage.getItem('user_access_token')}`
    ),
  };

  ipImg: string = environment.ipImg;

  statusSubmit = 'noSubmit';

  proveedores = new ProveedorModel();

  nombreProveedores: Proveedor[] = [];

  producto = new ProductoModel();

  supplierSelect!: string;

  messageNoneFile = 'No file uploaded yet.';

  esEdicion = false;

  title: string = '';

  fileName: string = '';

  forma!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private proveedorServices: ProveedoresServicesService,
    private productoService: ProductosService,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {
    this.crearFormulario();

    this.proveedorServices.getProveedores().subscribe((resp: any) => {
      resp.forEach((element: any) => {
        const obj: any = { value: element.nombreProveedor };
        this.nombreProveedores.push(obj);
      });
    });
  }

  ngOnInit() {
    console.log(this.forma);

    const id: any = this.route.snapshot.paramMap.get('id');

    if (id !== 'nuevo') {
      this.productoService.getProducto(id).subscribe((resp: any) => {
        console.log(resp);

        this.producto = resp as ProductoModel;
        this.esEdicion = true;
        this.title = this.producto.nombreProducto;
        this.statusSubmit = 'submit';
        console.log(this.producto);
      });
    }
  }

  ngOnDestroy() {
    const id: any = this.route.snapshot.paramMap.get('id');

    if (id !== 'nuevo') {
      return;
    }

    alert(
      'Estas seguro que quiere abandonar la pagina? Perderas lo que no hayas guardado!'
    );
  }

  get nombreProductoInvalido() {
    return (
      this.forma.get('nombreProducto')?.invalid &&
      this.forma.get('nombreProducto')?.touched
    );
  }

  crearFormulario() {
    this.forma = this.fb.group({
      databaseID: [''],
      nombreProducto: ['', [Validators.required, Validators.minLength(3)]],
      cantidadAMano: [''],
      contada: [''],
      presentacion: [''],
      fechaDeInventario: [''],
      nombreSupplier: [''],
      herramientas: [''],
    });
  }

  onRegresar() {
    this.router.navigate(['/productos']);
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      this.fileName = file.name;

      const formData = new FormData();

      formData.append('productFile', file);

      const upload$ = this.http.post(
        'http://localhost:3000/productFile',
        formData,
        this.header
      );

      upload$.subscribe((resp: any) => {
        this.producto.presentacion = resp.filename;

        return this.producto.presentacion;
      });
    }
  }

  deleteResourceOnUnload() {
    if (this.producto.presentacion === undefined) {
      console.log('Imagen del proveedor no subida');
      return;
    }

    this.http
      .delete(`http://localhost:3000/productFile/${this.producto.presentacion}`)
      .subscribe(() => {
        this.fileName = '';
        console.log('Llamada DELETE exitosa!');
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

    let peticion: Observable<any>;

    if (this.producto.id) {
      peticion = this.productoService.actualizarProducto(this.producto);
    } else {
      peticion = this.productoService.crearProducto(this.producto);
    }

    peticion.subscribe((resp) => {
      Swal.fire({
        title: this.producto.nombreProducto,
        text: 'Información actualizada correctamente',
        icon: 'success',
      });

      console.log(resp.id);
      console.log(this.forma);

      this.statusSubmit = 'submit';
      this.forma.reset();
      this.fileName = '';
      this.producto.presentacion = '';
      this.producto.id = undefined;
    });
  }
}
