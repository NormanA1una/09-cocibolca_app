import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductHistoryModel } from '../models/productHistory.model';

@Injectable({
  providedIn: 'root',
})
export class ProductHistoryService {
  header = {
    headers: new HttpHeaders().set(
      'Authorization',
      `Bearer ${sessionStorage.getItem('user_access_token')}`
    ),
  };

  private url = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getProductHistory(product_id: string) {
    return this.http.get(
      `${this.url}/product-history/${product_id}`,
      this.header
    );
  }

  deleteAllRecords(product_id: string | undefined) {
    return this.http.delete(
      `${this.url}/product-history/${product_id}`,
      this.header
    );
  }
}
