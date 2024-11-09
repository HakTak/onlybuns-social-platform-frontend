import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { ApiService } from './api.service';
import { UserService } from './user.service';
import { ConfigService } from './config.service';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';
import { throwError } from 'rxjs';
import { tap } from 'rxjs/operators';


@Injectable()
export class AuthService {

  constructor(
    private apiService: ApiService,
    private userService: UserService,
    private config: ConfigService,
    private router: Router
  ) {
  }

  private access_token: string | null = null;


  
  login(user: any): Observable<string> {
    const body = {
      email: user.email,
      password: user.password
    };
  
    return this.apiService.post(this.config.login_url, body)
      .pipe(
        map((response:any) => {
          const responseBody = response.body; // Pristupamo `body` delu odgovora
          console.log('Full response body:', responseBody); // Provera celog `body` odgovora
          const accessToken = responseBody.access_token; // Pristup `access_token` u `body`
          console.log('Access token received:', accessToken);
  
          if (accessToken) {
            localStorage.setItem("jwt", accessToken);
            this.access_token = accessToken;
          } else {
            console.error("No access token found in response");
          }
  
          return accessToken;
        })
      );
  }
  
  
  signup(user: any): Observable<string> {
    return this.apiService.post(this.config.signup_url, user)
      .pipe(
        map((response: any) => {
          console.log('Sign up success:', response.message);
          return response.message;
        })
      );
  }
  


  logout() {
    this.userService.currentUser = null;
    localStorage.removeItem("jwt");
    this.access_token = null;
    this.router.navigate(['/login']);
  }

    
    
    


  tokenIsPresent() {
    return this.access_token != undefined && this.access_token != null;
  }

  getToken() {
    return this.access_token;
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem("jwt");
    return !!token; // Vraća true ako token postoji, u suprotnom false
  }



  getCurrentUserName(): string | null {
    const token = localStorage.getItem("jwt");
    if (token) {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.sub; 
    }
    return null;
  }

}
