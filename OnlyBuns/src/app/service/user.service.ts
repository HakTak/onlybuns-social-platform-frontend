import {Injectable} from '@angular/core';
import {ApiService} from './api.service';
import {ConfigService} from './config.service';
import {map} from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  currentUser!:any;

  constructor(
    private apiService: ApiService,
    private config: ConfigService,
  ) {
  }

  getMyInfo() {
    return this.apiService.get(this.config.whoami_url)
      .pipe(map(user => {
        this.currentUser = user;
        return user;
      }));
  }

  getAll() {
    const token = localStorage.getItem('jwt');  // Uzmite token sa localStorage

    console.log(token)
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`  // Dodajte token u Authorization header
    });

    return this.apiService.get(this.config.users_url,  headers);  // Proslijedite headers kao opciju
  }

}
