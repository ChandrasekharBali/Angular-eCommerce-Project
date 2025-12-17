import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProductService {

  private baseUrl = 'http://localhost:5000';
  private http = inject(HttpClient);

getProducts() {
const token = localStorage.getItem('jwt');
const headers = new HttpHeaders({ 'Authorization': token || "" });

return this.http.get(`${this.baseUrl}/products`, {headers});

}

}
