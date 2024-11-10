import {Injectable} from '@angular/core';
import {ApiService} from './api.service';
import {ConfigService} from './config.service';
import {map} from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';  
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  currentUser!:any;

  constructor(
    private apiService: ApiService,
    private config: ConfigService,
    private router:Router
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
    return this.apiService.get(`${this.config.prifile_url}/${username}`);

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
}
