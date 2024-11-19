import { Component, OnInit } from '@angular/core';
import { TrendService } from '../service/trend.service';

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

  constructor(private trendService: TrendService) {}

  ngOnInit(): void {
    this.loadTrends();
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
}
