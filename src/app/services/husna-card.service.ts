import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HusnaCardService {
  constructor(private http: HttpClient) { }

  public getHusna(counter: number): Observable<any> {
    return this.http.get<any>(`https://api.aladhan.com/v1/asmaAlHusna/${counter}`); 
  }

  public getmawaqit(city: string, country: string, method: number): Observable<any> {
    return this.http.get<any>(
      `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=${method}`
    ); 
  }
}