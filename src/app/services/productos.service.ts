import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductoModel } from '../models/producto.model';

import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProductosService {
  private url = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  //Servicios referentes a los productos!!!
  crearProducto(producto: ProductoModel) {
    return this.http.post(`${this.url}/product-supplier`, producto).pipe(
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
      producto
    );
  }

  getProductos() {
    return this.http.get(`${this.url}/product-supplier`);
  }

  getProducto(id: string) {
    return this.http.get(`${this.url}/product-supplier/${id}`);
  }

  deleteProducto(id: string | undefined) {
    return this.http.delete(`${this.url}/product-supplier/${id}`);
  }
}
