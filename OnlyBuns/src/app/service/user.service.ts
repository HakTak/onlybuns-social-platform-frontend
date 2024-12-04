import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { ConfigService } from './config.service';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  currentUser!: any;

  constructor(
    private apiService: ApiService,
    private config: ConfigService,
    private router: Router,
    private http: HttpClient,
  ) {
  }

  getMyInfo() {
    return this.apiService.get(this.config.whoami_url)
      .pipe(map(user => {
        this.currentUser = user;
        return user;
      }));
  }

  getUserByUsername(username: string): Observable<any> {
    const token = localStorage.getItem('jwt'); // Preuzimanje tokena iz localStorage
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Dodavanje tokena u Authorization header
    });
    return this.apiService.get(`${this.config.prifile_url}/${username}`, { headers }).pipe(
      catchError(error => {
        if (error.status === 403) {
          // Preusmeravanje na login ako je zabranjen pristup
          this.router.navigate(['/login']);
          alert("You must be logged in as Admin");
        }
        return throwError(() => error);  // Prosleđivanje greške dalje
      })
    );
  }

  getUserByEmail(email: string): Observable<any> {
    return this.apiService.get(`${this.config.user_url}/findByEmail?email=${email}`);
  }

  getUsers(page: number, size: number, searchParams: any, sort: string): Observable<User[]> {
    const token = localStorage.getItem('jwt'); // Preuzimanje tokena iz localStorage
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Dodavanje tokena u Authorization header
    });
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('size', size.toString());
    params.append('sort', sort);
    for (const key in searchParams) {
      if (searchParams[key]) {
        params.append(key, searchParams[key]);
      }
    }
    return this.http.get<User[]>(`${this.config.user_url}/allPaged?${params.toString()}`, { headers }).pipe(
      catchError(error => {
        if (error.status === 403) {
          // Preusmeravanje na login ako je zabranjen pristup
          this.router.navigate(['/login']);
          alert("You must be logged in as Admin");
        }
        return throwError(() => error);  // Prosleđivanje greške dalje
      })
    );
  }

  getFollowings(page: number, size: number, searchParams: any, sort: string,username:string): Observable<User[]> {
    const token = localStorage.getItem('jwt'); // Preuzimanje tokena iz localStorage
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Dodavanje tokena u Authorization header
    });
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('size', size.toString());
    params.append('username', username);
    params.append('sort', sort);
    for (const key in searchParams) {
      if (searchParams[key]) {
        params.append(key, searchParams[key]);
      }
    }
    return this.http.get<User[]>(`${this.config.user_url}/allFollowingsPaged?${params.toString()}`, { headers }).pipe(
      catchError(error => {
        if (error.status === 403) {
          // Preusmeravanje na login ako je zabranjen pristup
          this.router.navigate(['/login']);
          alert("You must be logged in");
        }
        return throwError(() => error);  // Prosleđivanje greške dalje
      })
    );
  }

  getFollowers(page: number, size: number, searchParams: any, sort: string, username: string): Observable<User[]> {
    const token = localStorage.getItem('jwt'); // Preuzimanje tokena iz localStorage
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Dodavanje tokena u Authorization header
    });
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('size', size.toString());
    params.append('username', username);
    params.append('sort', sort);
    for (const key in searchParams) {
      if (searchParams[key]) {
        params.append(key, searchParams[key]);
      }
    }
    return this.http.get<User[]>(`${this.config.user_url}/allFollowersPaged?${params.toString()}`, { headers }).pipe(
      catchError(error => {
        if (error.status === 403) {
          // Preusmeravanje na login ako je zabranjen pristup
          this.router.navigate(['/login']);
          alert("You must be logged in");
        }
        return throwError(() => error);  // Prosleđivanje greške dalje
      })
    );
  }

  getAll() {
    const token = localStorage.getItem('jwt'); // Preuzimanje tokena iz localStorage
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Dodavanje tokena u Authorization header
    });

    return this.apiService.get(this.config.users_url, { headers }).pipe(
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

  followUser(followdUserId: number) {
    const token = localStorage.getItem('jwt'); // Preuzimanje tokena iz localStorage
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Dodavanje tokena u Authorization header
    });
    return this.http.post(`${this.config.follow_url}/follow/${followdUserId}`, {}, { headers }).pipe(
      catchError(error => {
        if (error.status === 403) {
          // Preusmeravanje na login ako je zabranjen pristup
          this.router.navigate(['/login']);
          alert("You must be logged as user")
        }
        return throwError(() => error);  // Prosleđivanje greške dalje
      })
    )
  }

  unfollowUser(followdUserId: number) {
    const token = localStorage.getItem('jwt'); // Preuzimanje tokena iz localStorage
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Dodavanje tokena u Authorization header
    });
    return this.http.post(`${this.config.follow_url}/unfollow/${followdUserId}`, {}, { headers }).pipe(
      catchError(error => {
        if (error.status === 403) {
          // Preusmeravanje na login ako je zabranjen pristup
          this.router.navigate(['/login']);
          alert("You must be logged as user")
        }
        return throwError(() => error);  // Prosleđivanje greške dalje
      })
    );
  }
}
