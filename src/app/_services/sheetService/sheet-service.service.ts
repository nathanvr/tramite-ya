import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class SheetServiceService {
  private http = inject(HttpClient);
  private apiUrl =
    'https://script.google.com/macros/s/AKfycbyoGJF1LHyDDp_8ypPm994rm6RUQ41aWEfV5ql-Hsq_7-Y1cG3946PWYgFgWMI-E3DncQ/exec';
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
