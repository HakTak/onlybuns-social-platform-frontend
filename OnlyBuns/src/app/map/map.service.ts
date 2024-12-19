import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  constructor(private http: HttpClient) {}

  search(street: string): Observable<any> {
    return this.http.get(
      'https://nominatim.openstreetmap.org/search?format=json&q=' + street
    );
  }

  reverseSearch(lat: number, lon: number): Observable<any> {
    return this.http.get(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&<params>`
    );
  }


  getPostLocations(): Observable<any> {
    return this.http.get('http://localhost:8080/api/posts/locations');
  }

  getRabbitCareLocations(): Observable<any> {
    // Slanje GET zahteva na backend bez dodatnih zaglavlja
    return this.http.get<any>(
      'http://localhost:8080/api/careLocations' // URL za dohvat lokacija
    );
  }
  
  
}
