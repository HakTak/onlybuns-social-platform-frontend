import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from '../service/analytics.service';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit {

  postsAndComments: any;
  userActivity: any;
  postsData: any;
  commentsData: any

  constructor(private analyticsService: AnalyticsService) { }

  ngOnInit(): void {
    this.loadPostsAndCommentsAnalytics();
    this.loadUserActivityAnalytics();
  }

  loadPostsAndCommentsAnalytics(): void {
    this.analyticsService.getPostsAndCommentsAnalytics().subscribe(data => {
      this.postsAndComments = data;
      this.commentsData = this.prepareCommentsData();
      this.postsData = this.preparePostsData();
    });
  }

  loadUserActivityAnalytics(): void {
    this.analyticsService.getUserActivityAnalytics().subscribe(data => {
      this.userActivity = data;
    });
  }

  prepareCommentsData(): any[] {
    return [
      { name: 'Weekly', value: this.postsAndComments.weeklyComments },
      { name: 'Monthly', value: this.postsAndComments.monthlyComments },
      { name: 'Yearly', value: this.postsAndComments.yearlyComments }
    ];
  }

  preparePostsData(): any[] {
    return [
      { name: 'Weekly', value: this.postsAndComments.weeklyPosts },
      { name: 'Monthly', value: this.postsAndComments.monthlyPosts },
      { name: 'Yearly', value: this.postsAndComments.yearlyPosts }
    ];
  }
}
