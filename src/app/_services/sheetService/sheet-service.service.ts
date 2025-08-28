import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class SheetServiceService {
  private http = inject(HttpClient);
  private apiUrl =
    'https://script.google.com/macros/s/AKfycbynjS4R0r0bqmBJVWaCgiBLOSHd_sPEU2GjjvjHjyjFTqpYjmX1Jvxebi_EwO5_3IbGEA/exec';
  idToken = '';

  constructor() {}
  headers = new HttpHeaders({
    'Content-Type': 'text/plain;charset=utf-8',
  });

  saveData(data: any) {
    return this.http.post(this.apiUrl, data, {
      headers: this.headers,
    });
  }

  getData(data: any) {
    return this.http.post(this.apiUrl, data, {
      headers: this.headers,
    });
  }

  updateRecord(data: any) {
    return this.http.post(this.apiUrl, data, {
      headers: this.headers,
    });
  }
}
