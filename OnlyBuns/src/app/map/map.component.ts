import { Component, AfterViewInit, Output, EventEmitter, Input } from '@angular/core';
import * as L from 'leaflet';
import { MapService } from './map.service';
import { UserService } from '../service';
import { NotificationService } from '../service/notification.service';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements AfterViewInit {
  private map: any;
  private currentMarker: L.Marker | null = null; // Marker za pretragu
  private postMarkers: L.Marker[] = []; // Svi markeri za postove
  @Output() setLocation = new EventEmitter<number[]>();
  @Input() user: any;
  @Input() longitude = 45.2396;
  @Input() latitude = 19.8227;
  
  isMapPostPage: boolean = false; // Podrazumevano nije mapPost stranica
  constructor(private mapService: MapService,private userService:UserService,private notificationService:NotificationService) {}

  private initMap(): void {
    this.map = L.map('map', {
      center: [this.latitude, this.longitude],
      zoom: 13,
    });

    const tiles = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 18,
        minZoom: 3,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    );
    tiles.addTo(this.map);
    this.setMarker(this.latitude, this.longitude);
    this.registerOnClick();
    this.loadPostLocations(); 
  }

  ngAfterViewInit(): void {
   

    this.isMapPostPage = window.location.pathname.includes('/mapPost');

    let DefaultIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.6.0/dist/images/marker-icon.png',
    });
  
    L.Marker.prototype.options.icon = DefaultIcon;

    const token = localStorage.getItem('jwt'); 
    if (token) {
      try {
        
        const payload = JSON.parse(atob(token.split('.')[1])); 
    
      
        this.user = { username: payload.sub || payload.username }; 
    
      } catch (error) {
        console.error('Error parsing JWT token:', error);
        this.user = null;
      }
    } else {
      console.warn('JWT token not found in localStorage.');
      this.user = null; 
    }
    
    
    if (this.user && this.user.username) {
      this.userService.getUserLocation(this.user.username).subscribe({
        next: (location) => {
          this.latitude = location.latitude;
          this.longitude = location.longitude;
          this.initMap(); 
        },
        error: () => {
          console.error('Error fetching user location, using default coordinates.');
          this.initMap(); 
        },
      });
    } else {
      console.warn('User not provided, using default coordinates.');
      this.initMap();
    }
  }
  
  
  private loadPostLocations(): void {
    // Definišite prilagođenu ikonu za objave
    const postIcon = L.icon({
      iconUrl: 'assets/logo.png', // Putanja do vaše slike
      iconSize: [32, 32], // Veličina ikone (širina, visina)
      iconAnchor: [16, 32], // Tačka koja se koristi za pozicioniranje ikone na mapi
      popupAnchor: [0, -32], // Pomak popup-a u odnosu na ikonu
    });
  
    this.mapService.getPostLocations().subscribe({
      next: (locations) => {
        const bounds = L.latLngBounds([]); // Kreirajte granice za sve markere
  
        locations.forEach((location: any) => {
          const marker = L.marker([location.longitude, location.latitude], { icon: postIcon }) // Koristite prilagođenu ikonu
            .addTo(this.map)
            .bindPopup(`<b>Post :</b> ${location.id}`);
          this.postMarkers.push(marker);
  
          // Dodajte koordinate markera u granice
          bounds.extend([location.latitude, location.longitude]);
        });
  
        // Ako postoje lokacije, prilagodite prikaz mape granicama
        if (locations.length > 0) {
          this.map.fitBounds(bounds);
        }
      },
      error: () => {
        console.error('Error loading post locations');
      },
    });
  }
  

  search(address: string): void {
    this.mapService.search(address).subscribe({
      next: (result) => {
        if (result.length > 0) {
          this.removeMarker();

          this.currentMarker = L.marker([result[0].lat, result[0].lon])
            .addTo(this.map)
            .bindPopup(result[0].display_name)
            .openPopup();

          this.setLocation.emit([result[0].lat, result[0].lon]);
        } else {
          alert("Sorry, couldn't find address: " + address + "\nCould you try again?");
        }
      },
      error: () => {
        console.error('Error searching for address');
      },
    });
  }

  registerOnClick(): void {
    this.map.on('click', (e: any) => {
      const coord = e.latlng;
      const lat = coord.lat;
      const lng = coord.lng;

      this.removeMarker();

      this.mapService.reverseSearch(lat, lng).subscribe((res) => {
        this.currentMarker = new L.Marker([lat, lng])
          .addTo(this.map)
          .bindPopup(res.display_name)
          .openPopup();
      });

      this.setLocation.emit([lat, lng]);
    });
  }

  setMarker(lat: number, lng: number): void {
    this.removeMarker();

    this.mapService.reverseSearch(lat, lng).subscribe((res) => {
      this.currentMarker = new L.Marker([lat, lng])
        .addTo(this.map)
        .bindPopup(res.display_name)
        .openPopup();
    });
  }

  removeMarker(): void {
    if (this.currentMarker) {
      this.map.removeLayer(this.currentMarker);
      this.currentMarker = null;
    }
  }









  saveSelectedLocation(): void {
    if (!this.currentMarker) {
      this.notificationService.notify('Please select a location on the map.', 3000); // Trajanje notifikacije u ms
      return;
    }
  
    const { lat, lng } = this.currentMarker.getLatLng();
  
    if (!this.user || !this.user.username) {
      this.notificationService.notify('User data is not available.', 3000); // Trajanje notifikacije u ms
      return;
    }
  
    this.userService.updateUserLocation(this.user.username, { latitude: lat, longitude: lng }).subscribe({
      next: () => {
        this.notificationService.notify('Location saved successfully!', 3000); // Trajanje notifikacije u ms
      },
      error: () => {
         this.notificationService.notify('Location saved successfully!', 3000); // Trajanje notifikacije u ms
      },
    });
  }
  




}
