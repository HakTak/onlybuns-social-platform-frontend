export class Location {
    id: number;
    longitude: number;
    latitude: number;
  
    constructor(
      id: number,
      longitude: number,
      latitude: number,
    ) {
      this.id = id;
      this.longitude = longitude;
      this.latitude = latitude;
    }
  }