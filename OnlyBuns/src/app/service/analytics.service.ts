import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  private baseUrl =this.config.analytics_url;

  constructor(private http: HttpClient, private router: Router,private config: ConfigService) { }

  getPostsAndCommentsAnalytics(): Observable<any> {
    const token = localStorage.getItem('jwt'); // Preuzimanje tokena iz localStorage
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Dodavanje tokena u Authorization header
    });
    return this.http.get(`${this.baseUrl}/posts-comments`, { headers }).pipe(
      catchError(error => {
        if (error.status === 403) {
          // Preusmeravanje na login ako je zabranjen pristup
          this.router.navigate(['/login']);
          alert("You must be logged as Amin")
        }
        return throwError(() => error);  // Prosleđivanje greške dalje
      })
    );
  }

  getUserActivityAnalytics(): Observable<any> {
    const token = localStorage.getItem('jwt'); // Preuzimanje tokena iz localStorage
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Dodavanje tokena u Authorization header
    });
    return this.http.get(`${this.baseUrl}/user-activity`, { headers }).pipe(
      catchError(error => {
        if (error.status === 403) {
          // Preusmeravanje na login ako je zabranjen pristup
          this.router.navigate(['/login']);
          alert("You must be logged as Amin")
        }
        return throwError(() => error);  // Prosleđivanje greške dalje
      })
    );
  }
}