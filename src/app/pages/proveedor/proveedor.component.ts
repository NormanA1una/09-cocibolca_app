import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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
  //Mensaje utilizado cuando no hay ninguna imagen cargada en el input de cargar imagenes
  messageNoneFile = 'No file uploaded yet.';

  //variable que captura el valor de la ip, que se encuentra en una variable de entorno
  ip: string = environment.ip;

  //boolean que ayuda al cambio de botones con el ngIf
  btnDeleteImage = true;

  //string que ayuda a capturar el nombre del archivo que se esta cargando en el input de carga para mostrarlo en pantalla
  fileName = '';

  //boolean que me ayuda a mostrar el h1 en donde se dice que se tiene que agregar un proveedor y no actualizar uno nuevo
  esEdicion = false;

  //Ayuda a mostrar el nombre del proveedor cuando proveedor funciona como pantalla de actualización
  title: string = '';

  //Gracias a estro podemos realizar los formularios reactivos
  forma!: FormGroup;

  //Aca importamos el modelo de lo que deberia de tener un Proveedor
  proveedor = new ProveedorModel();

  statusSubmit = 'noSubmit';

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
    //en le constructor se manda a llamar el formulario, pues es lo primero que se dispara al entrar a la pagina
    this.crearFormulario();
  }

  //el ngOnInit simplemente nos sirve para que si nos encontramos en la pagina de proveedor/:id y no proveedor/nuevo, se cargue la
  //info del proveedor que seleccionamos
  ngOnInit() {
    const id: any = this.route.snapshot.paramMap.get('id');

    if (id !== 'nuevo') {
      this.proveedorService.getProveedor(id).subscribe((resp: any) => {
        console.log(resp);

        this.proveedor = resp as ProveedorModel;
        this.esEdicion = true;
        this.title = this.proveedor.nombreProveedor;
        this.statusSubmit = 'submit';
        console.log(this.proveedor);
      });
    }
  }

  //El ngOnDestroy nos esta ayudando a manejar una alerta cuando nos encontramos agregando un proveedor y le damos a regresar
  //ya sea en el btn del nav o en el btn creado por nosotros, lo ideal es que se pudiera manejar de otra forma la cual se pudiera cancelar
  ngOnDestroy() {
    const id: any = this.route.snapshot.paramMap.get('id');

    if (id !== 'nuevo') {
      return;
    }

    alert(
      'Estas seguro que quiere abandonar la pagina? Perderas lo que no hayas guardado!'
    );
  }

  //get que nos ayuda para la validacion del nombre, es decir para el ngIf del hint
  get nombreNoValido() {
    return (
      this.forma.get('nombreProveedor')?.invalid &&
      this.forma.get('nombreProveedor')?.touched
    );
  }

  //get que nos ayuda para la validacion del tipo de producto, es decir para el ngIf del hint
  get tipoDeProductoNoValido() {
    return (
      this.forma.get('tipoDeProducto')?.invalid &&
      this.forma.get('tipoDeProducto')?.touched
    );
  }

  //Aca se crea el formulario de forma reactiva, el cual es mandado a llamar desde el constructor
  crearFormulario() {
    this.forma = this.fb.group({
      databaseId: [''],
      nombreProveedor: ['', [Validators.required, Validators.minLength(3)]],
      tipoDeProducto: ['', [Validators.required, Validators.minLength(3)]],
      activo: [''],
      logo: [''],
      tools: [''],
    });
  }

  //método que nos permite subir imagenes al servidor para luego retornar una referencia, la cual se ocupara para colorcarla en el src
  //de la img y renderizarla en el front
  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    console.log(
      'Proveedor antes de que se suba la imagen',
      this.proveedor.logo
    );

    if (file) {
      console.log(file);
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

  //btn que nos sirve para regresar a la pagina principal, cabe mencionar que esta navegacion igual dispara la alerta del ngOnDestroy
  onRegresar() {
    this.router.navigate(['/proveedores']);
  }

  //metodo que ocupada el evento de beforeUnload de windows, que en este caso es utilizado para mandar una alerta que advierta que
  //aquello que no este guardado se eliminará
  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: BeforeUnloadEvent) {
    event.preventDefault();
    event.returnValue = true;
  }

  //metodo vinculado a un btn que nos permite eliminar la imagen que estamos subiendo en el formulario, en este caso en caso que se
  //quiera subir otra, cabe mencionar que esto es necesario para no llenar la memoria pues en el estado actual de la app las imagenes
  //se almacenan en una ruta directa en la computadora
  deleteResourceOnUnload() {
    if (this.proveedor.logo === undefined) {
      console.log('Imagen del proveedor no subida');
      return;
    }

    this.http
      .delete(`http://localhost:3000/file/${this.proveedor.logo}`)
      .subscribe(() => {
        this.fileName = '';
        console.log('Llamada HTTP DELETE exitosa');
      });
  }

  //metodo importante, el cual permite hacer el submit al todo el form, en donde se valida si esta invalido y se clickea el save para
  //que mande las alertas, ademas agregados los alert de Swal en donde nos permiten tener una interfaz agradable, cabe mencionar que
  //está tentable utilizar el FormGroup.reset pero se necesita debuguear cierto inconvenientes
  guardar() {
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

    if (this.proveedor.id) {
      peticion = this.proveedorService.actualizarProveedor(this.proveedor);
    } else {
      peticion = this.proveedorService.crearProveedor(this.proveedor);
    }

    peticion.subscribe((resp) => {
      Swal.fire({
        title: this.proveedor.nombreProveedor,
        text: 'Información actualizada correctamente',
        icon: 'success',
      });

      this.statusSubmit = 'submit';
      this.forma.reset();
      this.fileName = '';
      this.proveedor.logo = '';
      this.proveedor.id = undefined;
    });
  }
}
