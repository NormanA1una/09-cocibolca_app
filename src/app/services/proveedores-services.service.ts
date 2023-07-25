import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProveedorModel } from '../models/proveedor.model';

import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProveedoresServicesService {
  header = {
    headers: new HttpHeaders().set(
      'Authorization',
      `Bearer ${sessionStorage.getItem('user_access_token')}`
    ),
  };

  private url = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  crearProveedor(proveedor: ProveedorModel) {
    return this.http.post(`${this.url}/supplier`, proveedor, this.header).pipe(
      map((resp: any) => {
        proveedor.id = resp.id;
        console.log(proveedor);
        return proveedor;
      })
    );
  }

  actualizarProveedor(proveedor: ProveedorModel) {
    console.log(proveedor);
    return this.http.put(
      `${this.url}/supplier/${proveedor.id}`,
      proveedor,
      this.header
    );
  }

  getProveedores() {
    return this.http.get(`${this.url}/supplier`, this.header);
  }

  getProveedor(id: string) {
    return this.http.get(`${this.url}/supplier/${id}`, this.header);
  }

  deleteProveedor(id: string | undefined) {
    return this.http.delete(`${this.url}/supplier/${id}`, this.header);
  }
}
