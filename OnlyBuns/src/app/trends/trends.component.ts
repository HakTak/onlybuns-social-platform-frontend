import { Component, OnInit } from '@angular/core';
import { TrendService } from '../service/trend.service';
import { User } from '../models/user.model';
import { ConfigService } from '../service';

@Component({
  selector: 'app-trends',
  templateUrl: './trends.component.html',
  styleUrls: ['./trends.component.css']
})
export class TrendsComponent implements OnInit {
  stats: any = {};
  popularPostsLastWeek: any[] = [];
  popularPostsAllTime: any[] = [];
  topLikersLastWeek: any[] = [];
  topLikers: any[] = [];



  constructor(private trendService: TrendService,    private config: ConfigService,) {}

  ngOnInit(): void {
    this.loadTrends();
    this.loadTopLikers();
  }

  loadTrends(): void {
    // Učitavanje statistike mreže
    this.trendService.getNetworkStats().subscribe(data => {
      this.stats = data;
    });

    // Učitavanje najpopularnijih postova prošle nedelje
    this.trendService.getPopularPostsLastWeek().subscribe(data => {
      this.popularPostsLastWeek = data;
    });

    // Učitavanje najpopularnijih postova svih vremena
    this.trendService.getPopularPostsAllTime().subscribe(data => {
      this.popularPostsAllTime = data;
    });

   
  }



  loadTopLikers(): void {
    this.trendService.getTopLikersLastWeek().subscribe(
      (data) => {
        this.topLikers = data; 
      },
      (error) => {
        console.error('Error fetching top likers:', error);
      }
    );
  }
  

  getImage(imgPath: string): string {
    const ret = `${this.config.posts_image_url}/${imgPath}`;
    return ret;
  }



}
