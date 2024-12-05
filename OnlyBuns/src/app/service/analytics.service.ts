import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ConfigService } from './config.service';
import { NotificationService } from '../service/notification.service';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  private baseUrl = this.config.analytics_url;

  constructor(private http: HttpClient, private router: Router, private config: ConfigService,private notificationService: NotificationService) { }

  getPostsAndCommentsAnalytics(year: number, month: string): Observable<any> {
    const token = localStorage.getItem('jwt'); // Preuzimanje tokena iz localStorage
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Dodavanje tokena u Authorization header
    });
    const url = month === 'all' ? `${this.baseUrl}/posts-comments?year=${year}` : `${this.baseUrl}/posts-comments?year=${year}&month=${month}`;
    return this.http.get(url, { headers }).pipe(
      catchError(error => {
        if (error.status === 403) {
          // Preusmeravanje na login ako je zabranjen pristup
          this.router.navigate(['/login']);
          this.notificationService.notify('You must be logged as Admin',3000,true);
        }
        return throwError(() => error);  // Prosleđivanje greške dalje
      })
    );
  }

  getPostsAndCommentsByYear(): Observable<any> {
    const token = localStorage.getItem('jwt'); // Preuzimanje tokena iz localStorage
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Dodavanje tokena u Authorization header
    });
    return this.http.get(`${this.baseUrl}/posts-comments-by-year`, { headers }).pipe(
      catchError(error => {
        if (error.status === 403) {
          // Preusmeravanje na login ako je zabranjen pristup
          this.router.navigate(['/login']);
          this.notificationService.notify('You must be logged as Admin',3000,true);
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
          this.notificationService.notify('You must be logged as Admin',3000,true);
        }
        return throwError(() => error);  // Prosleđivanje greške dalje
      })
    );
  }
}