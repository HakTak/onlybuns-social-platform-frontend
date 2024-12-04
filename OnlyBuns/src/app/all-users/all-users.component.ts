import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '../service/user.service';
import { User } from '../models/user.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.css']
})
export class AllUsersComponent implements OnInit {

  users: User[] = [];
  currentPage: number = 0;
  usersPerPage: number = 5;
  canGoNext: boolean = true;
  searchQuery: string = '';
  sortDirection: string = 'asc';
  showSearchForm: boolean = false;
  searchForm: FormGroup;
  @Input() followers = false;
  @Input() followings = false;
  @Input() username = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.searchForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      minPosts: [''],
      maxPosts: ['']
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.currentPage = +params['page'] || 0;
      this.searchQuery = params['search'] || '';
      this.sortDirection = params['sort'] || 'asc';
      this.loadData();
    });
  }

  loadData(): void {
    if (this.followers) {
      this.loadFollowers();
    } else if (this.followings) {
      this.loadFollowings();
    } else {
      this.loadUsers();
    }
  }

  loadFollowings(): void {
    const searchParams = this.searchForm.value;
    this.userService.getFollowings(this.currentPage, this.usersPerPage, searchParams, this.sortDirection,this.username).subscribe((users: User[]) => {
      this.users = users;
      this.checkNextPage();
      if (this.users.length == 0 && this.currentPage > 0) {
        this.goToPage(0);
      }
    });
  }

  loadFollowers(): void {
    const searchParams = this.searchForm.value;
    this.userService.getFollowers(this.currentPage, this.usersPerPage, searchParams, this.sortDirection, this.username).subscribe((users: User[]) => {
      this.users = users;
      this.checkNextPage();
      if (this.users.length == 0 && this.currentPage > 0) {
        this.goToPage(0);
      }
    });
  }

  goToProfile(username: String): void {
    this.username = username.toString();
    this.router.navigate(['/profile', username]);
  }

  loadUsers(): void {
    const searchParams = this.searchForm.value;
    this.userService.getUsers(this.currentPage, this.usersPerPage, searchParams, this.sortDirection).subscribe((users: User[]) => {
      this.users = users;
      this.checkNextPage();
      if (this.users.length == 0 && this.currentPage > 0) {
        this.goToPage(0);
      }
    });
  }

  checkNextPage(): void {
    const searchParams = this.searchForm.value;
    if (this.followers) {
      this.userService.getFollowers(this.currentPage + 1, this.usersPerPage, searchParams, this.sortDirection, this.username).subscribe((users: User[]) => {
        if (users.length < 1) {
          this.canGoNext = false;
        } else {
          this.canGoNext = true;
        }
      });
    } else if (this.followings) {
      this.userService.getFollowings(this.currentPage + 1, this.usersPerPage, searchParams, this.sortDirection,this.username).subscribe((users: User[]) => {
        if (users.length < 1) {
          this.canGoNext = false;
        } else {
          this.canGoNext = true;
        }
      });
    } else {
      this.userService.getUsers(this.currentPage + 1, this.usersPerPage, searchParams, this.sortDirection).subscribe((users: User[]) => {
        if (users.length < 1) {
          this.canGoNext = false;
        } else {
          this.canGoNext = true;
        }
      });
    }
  }

  nextPage(): void {
    this.currentPage++;
    if (!this.followers && !this.followings) {
      this.updateUrl();
    }
    this.loadData();
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updateUrl();
      this.loadData();
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.updateUrl();
    this.loadData();
  }

  updateUrl(): void {
    const searchParams = this.searchForm.value;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: this.currentPage, search: JSON.stringify(searchParams), sort: this.sortDirection },
      queryParamsHandling: 'merge'
    });
  }

  onSearch(): void {
    this.currentPage = 0;
    this.updateUrl();
    this.loadData();
  }

  onSortChange(): void {
    this.currentPage = 0;
    this.updateUrl();
    this.loadData();
  }

  toggleSearchForm(): void {
    this.showSearchForm = !this.showSearchForm;
  }
}
