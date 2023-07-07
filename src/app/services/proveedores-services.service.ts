import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProveedorModel } from '../models/proveedor.model';

import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProveedoresServicesService {
  private url = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  //Servicio referente a los proveedores!!
  crearProveedor(proveedor: ProveedorModel) {
    return this.http.post(`${this.url}/supplier`, proveedor).pipe(
      map((resp: any) => {
        proveedor.id = resp.id;
        console.log(proveedor);
        return proveedor;
      })
    );
  }

  actualizarProveedor(proveedor: ProveedorModel) {
    console.log(proveedor);
    return this.http.put(`${this.url}/supplier/${proveedor.id}`, proveedor);
  }

  getProveedores() {
    return this.http.get(`${this.url}/supplier`);
  }

  getProveedor(id: string) {
    return this.http.get(`${this.url}/supplier/${id}`);
  }

  deleteProveedor(id: string | undefined) {
    return this.http.delete(`${this.url}/supplier/${id}`);
  }
}
