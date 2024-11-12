import { Component, AfterViewInit, Output, EventEmitter } from '@angular/core';
import * as L from 'leaflet';
import { MapService } from './map.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements AfterViewInit {
  private map: any;
  private currentMarker: L.Marker | null = null;  // Track the current marker
  @Output() setLocation = new EventEmitter<number[]>();

  constructor(private mapService: MapService) {}

  private initMap(): void {
    this.map = L.map('map', {
      center: [45.2396, 19.8227],
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
    this.registerOnClick();
  }

  ngAfterViewInit(): void {
    let DefaultIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.6.0/dist/images/marker-icon.png',
    });

    L.Marker.prototype.options.icon = DefaultIcon;
    this.initMap();
  }

  // Method to handle search functionality and add marker
  search(adress : string): void {
    this.mapService.search(adress).subscribe({
      next: (result) => {
        if(result.length > 0){
          // Remove the existing marker, if any
          this.removeMarker()
          // Add new marker
          this.currentMarker = L.marker([result[0].lat, result[0].lon])
            .addTo(this.map)
            .bindPopup(result[0].display_name)
            .openPopup();
        
          this.setLocation.emit([result[0].lat, result[0].lon])
        }else
          alert("Sorry could't find address: " + adress + "\nCould you try again")
      },
      error: () => {
        console.error('Error searching for address');
      },
    });
  }

  // Method to handle the map click event and add/remove marker
  registerOnClick(): void {
    this.map.on('click', (e: any) => {
      const coord = e.latlng;
      const lat = coord.lat;
      const lng = coord.lng;

      // Remove the existing marker, if any
      this.removeMarker()

      // Add the new marker at the clicked location
      this.mapService.reverseSearch(lat, lng).subscribe((res) => {

        this.currentMarker = new L.Marker([lat, lng])
          .addTo(this.map)
          .bindPopup(res.display_name)
          .openPopup();
      });

      this.setLocation.emit([lat, lng])
    });
  }

  removeMarker(){
    if (this.currentMarker) {
      this.map.removeLayer(this.currentMarker);
    }
  }
}
