import { Component, ViewChild, OnInit } from '@angular/core';
import { MapComponent } from '../map/map.component';
import { NotificationService } from '../service/notification.service';
import { UserService } from '../service/user.service';
import { ActivatedRoute } from '@angular/router';
import { NotificationType } from '../models/notificationType.enum';

@Component({
  selector: 'app-map-post',
  templateUrl: './map-post.component.html',
  styleUrls: ['./map-post.component.css']
})
export class MapPostComponent implements OnInit {
  @ViewChild(MapComponent) mapComponent!: MapComponent;
  searchQuery: string = '';
  selectedLocation: { latitude: number; longitude: number } | null = null;
  userLocation: { latitude: number; longitude: number } = { latitude: 45.2396, longitude: 19.8227 }; // Default vrednosti

  constructor(
    private notificationService: NotificationService,
    private userService: UserService,
    private route: ActivatedRoute,

  ) {}












  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const username = params.get('username');
      if (username) {
        // Preuzmite korisnika preko username-a
        this.userService.getUserByUsername(username).subscribe({
          next: (user: any) => {
            if (user.location) {
              this.userLocation = {
                latitude: user.location.latitude,
                longitude: user.location.longitude,
              };
            }
          },
          error: (error) => {
            console.error('Error fetching user by username:', error);
          },
        });
      }
    });
  }
  
 












  onSearch(): void {
    if (!this.searchQuery || this.searchQuery.trim() === '') {
      this.notificationService.notify({message:'Please enter a location to search.', duration:3000, notificationType:NotificationType.INFO});
      return;
    }

    this.mapComponent?.search(this.searchQuery);
  }

  setLocation(latlng: number[]): void {
    this.selectedLocation = { latitude: latlng[0], longitude: latlng[1] };
    console.log('Selected Location:', this.selectedLocation);
  }
}
