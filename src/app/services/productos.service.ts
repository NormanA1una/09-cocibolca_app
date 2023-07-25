import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductoModel } from '../models/producto.model';

import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProductosService {
  header = {
    headers: new HttpHeaders().set(
      'Authorization',
      `Bearer ${sessionStorage.getItem('user_access_token')}`
    ),
  };

  private url = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  crearProducto(producto: ProductoModel) {
    return this.http
      .post(`${this.url}/product-supplier`, producto, this.header)
      .pipe(
        map((resp: any) => {
          producto.id = resp.id;
          console.log(producto);
          return producto;
        })
      );
  }

  actualizarProducto(producto: ProductoModel) {
    return this.http.put(
      `${this.url}/product-supplier/${producto.id}`,
      producto,
      this.header
    );
  }

  getProductos() {
    return this.http.get(`${this.url}/product-supplier`, this.header);
  }

  getProducto(id: string) {
    return this.http.get(`${this.url}/product-supplier/${id}`, this.header);
  }

  deleteProducto(id: string | undefined) {
    return this.http.delete(`${this.url}/product-supplier/${id}`, this.header);
  }
}
