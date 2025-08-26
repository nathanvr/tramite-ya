import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class SheetServiceService {
  private http = inject(HttpClient);
  private apiUrl =
    'https://script.google.com/macros/s/AKfycbxxi-7DSkwcu5mkMfAhpG7VFW-xuAGbdLBn0X1VIY4ktENi2uO-R7amasbPZ-DY14-q2Q/exec';
  idToken = '';

  constructor() {
    const idTokenData = localStorage.getItem('user');

    if (idTokenData) {
      this.idToken = JSON.parse(idTokenData).idToken;
    }
  }
  headers = new HttpHeaders({
    'Content-Type': 'text/plain;charset=utf-8',
  });

  saveData(data: any) {
    return this.http.post(
      this.apiUrl,
      JSON.stringify({ ...data, idToken: this.idToken }),
      {
        headers: this.headers,
      }
    );
  }

  getData(data: any) {
    return this.http.post(
      this.apiUrl,
      JSON.stringify({ ...data, idToken: this.idToken }),
      {
        headers: this.headers,
      }
    );
  }

  updateRecord(data: any) {
    return this.http.post(
      this.apiUrl,
      JSON.stringify({ ...data, idToken: this.idToken }),
      {
        headers: this.headers,
      }
    );
  }
}
