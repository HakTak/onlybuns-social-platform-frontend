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
  combinedData: any;
  radialChartData: any;
  availableYears: number[] = [];
  selectedYear: number = new Date().getFullYear();
  selectedMonth: string = 'all';
  yearlyPostsAndCommentsData: any;
  months = [
    { name: 'January', value: 1 },
    { name: 'February', value: 2 },
    { name: 'March', value: 3 },
    { name: 'April', value: 4 },
    { name: 'May', value: 5 },
    { name: 'June', value: 6 },
    { name: 'July', value: 7 },
    { name: 'August', value: 8 },
    { name: 'September', value: 9 },
    { name: 'October', value: 10 },
    { name: 'November', value: 11 },
    { name: 'December', value: 12 }
  ];
  xAxisLabel: string = 'Month';

  constructor(private analyticsService: AnalyticsService) { }

  ngOnInit(): void {
    this.generateAvailableYears();
    this.loadPostsAndCommentsAnalytics(this.selectedYear, this.selectedMonth);
    this.loadUserActivityAnalytics();
    this.loadYearlyPostsAndCommentsData();
  }

  loadYearlyPostsAndCommentsData(): void {
    this.analyticsService.getPostsAndCommentsByYear().subscribe(data => {
      this.yearlyPostsAndCommentsData = this.prepareYearlyPostsAndCommentsData(data);
    });
  }

  prepareYearlyPostsAndCommentsData(data: any): any {
    const yearlyData:any[] = [];
    const yearlyPosts = data.yearlyPosts || [];
  const yearlyComments = data.yearlyComments || [];

  yearlyPosts.forEach((post: any) => {
    const year = post.year;
    const comments = yearlyComments.find((comment: any) => comment.year === year);
    yearlyData.push({
      name: year.toString(),
      series: [
        { name: 'Comments', value: comments ? comments.count : 0 },
        { name: 'Posts', value: post.count }
      ]
    });
  });

  return yearlyData;
  }

  generateAvailableYears(): void {
    const currentYear = new Date().getFullYear();
    for (let i = 0; i < 6; i++) {
      this.availableYears.push(currentYear - i);
    }
  }

  loadPostsAndCommentsAnalytics(year: number, month: string): void {
    this.analyticsService.getPostsAndCommentsAnalytics(year, month).subscribe(data => {
      this.postsAndComments = data;
      this.combinedData = this.prepareCombinedData(month);
    });
  }

  onYearChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const year = Number(target.value);
    this.selectedYear = year;
    this.loadPostsAndCommentsAnalytics(year, this.selectedMonth);
  }

  onMonthChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const month = target.value;
    this.selectedMonth = month;
    this.loadPostsAndCommentsAnalytics(this.selectedYear, month);
  }

  loadUserActivityAnalytics(): void {
    this.analyticsService.getUserActivityAnalytics().subscribe(data => {
      this.userActivity = data;
      this.radialChartData = this.prepareRadialChartData();
    });
  }

  prepareCommentsData(): any {
    if (!this.postsAndComments || !this.postsAndComments.monthlyComments) {
      return [];
    }

    return this.postsAndComments.monthlyComments.map((item: any) => ({
      name: new Date(0, item.month - 1).toLocaleString('default', { month: 'long' }),
      value: item.count
    }));
  }

  preparePostsData(): any {
    if (!this.postsAndComments || !this.postsAndComments.monthlyPosts) {
      return [];
    }

    return this.postsAndComments.monthlyPosts.map((item: any) => ({
      name: new Date(0, item.month - 1).toLocaleString('default', { month: 'long' }),
      value: item.count
    }));
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

  prepareCombinedData(month: string): any {
    const combinedData = [];
    if (month === 'all') {
      const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
  
      for (let i = 0; i < 12; i++) {
        const monthName = months[i];
        const comments = this.postsAndComments.monthlyComments.find((item: any) => item.month === i + 1);
        const posts = this.postsAndComments.monthlyPosts.find((item: any) => item.month === i + 1);
  
        combinedData.push({
          name: monthName,
          series: [
            { name: 'Comments', value: comments ? comments.count : 0 },
            { name: 'Posts', value: posts ? posts.count : 0 }
          ]
        });
      }
      this.xAxisLabel = 'Month';
    } else {
      const weeks = this.getWeeksInMonth(this.selectedYear, parseInt(month));
      for (let i = 0; i < weeks.length; i++) {
        const weekName = weeks[i];
        const comments = this.postsAndComments.weeklyComments.find((item: any) => ('Week '+item.week) === weekName);
        const posts = this.postsAndComments.weeklyPosts.find((item: any) => ('Week '+item.week) === weekName);
  
        combinedData.push({
          name: "Week "+(i+1),
          series: [
            { name: 'Comments', value: comments ? comments.count : 0 },
            { name: 'Posts', value: posts ? posts.count : 0 }
          ]
        });
      }
      this.xAxisLabel = 'Week';
    }
  
    return combinedData;
  }
  
  getWeeksInMonth(year: number, month: number): string[] {
    const weeks:any[] = [];
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    let currentDay = firstDay;
  
    while (currentDay <= lastDay) {
      const weekNumber = this.getWeekNumber(currentDay);
      if (!weeks.includes(`Week ${weekNumber}`)) {
        weeks.push(`Week ${weekNumber}`);
      }
      currentDay.setDate(currentDay.getDate() + 1);
    }
  
    return weeks;
  }
  
  getWeekNumber(date: Date): number {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - startOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
  }

  valueFormatting(value: number): string {
    return value.toString();
  }

  tooltipText(c: any): string {
    return `${c.data.label}: ${c.data.value.toFixed(2)}%`;
  }
}
