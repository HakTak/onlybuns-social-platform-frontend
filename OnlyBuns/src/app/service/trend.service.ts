import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class TrendService {
  private baseUrl = 'http://localhost:8080/api/trends'; // URL vašeg backend API-ja

  constructor(private http: HttpClient) {}

  getNetworkStats(): Observable<any> {
    return this.http.get(`${this.baseUrl}/stats`);
  }

  getPopularPostsLastWeek(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/most-liked/weekly`); // Korekcija endpointa
  }

  getPopularPostsAllTime(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/most-liked`); // Korekcija endpointa
  }

  
  

  getTopLikersLastWeek(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/top-likers`);
  }
  
  

 
}
