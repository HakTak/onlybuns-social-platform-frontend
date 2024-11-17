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
  commentsData: any;
  radialChartData: any;

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
      this.radialChartData = this.prepareRadialChartData();
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

  prepareRadialChartData(): any {
    const usersWithPosts = this.userActivity.usersWithPosts;
    const usersWithCommentsOnly = this.userActivity.usersWithCommentsOnly;
    const inactiveUsers = this.userActivity.inactiveUsers;

    return [
      { name: 'Made Posts', value: usersWithPosts },
      { name: 'Made Only Comments', value: usersWithCommentsOnly },
      { name: 'No Activity', value: inactiveUsers }
    ];
  }

  valueFormatting(value: number): string {
    return value.toString();
  }

  tooltipText(c: any): string {
    return `${c.data.label}: ${c.data.value.toFixed(2)}%`;
  }
}
