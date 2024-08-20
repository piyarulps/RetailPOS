import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { HttpClient } from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})
export class AppService {
  currentlatitude: any;
  
  constructor(private http: HttpClient,
    ) {
  }


  post(url: string, body: any) {

    return this.http.post(url, body);
  }

  get(url: string, params) {

    const param = new HttpParams()

    return this.http.get(url, { params }
    )
  }

  delete() {

  }

  put(url: string, body: any) {

    return this.http.post(url, body);
  }
}



