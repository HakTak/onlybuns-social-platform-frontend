import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { AuthGuard } from './guards/auth.guard';
import {AllPostsComponent} from './all-posts/all-posts.component'
import { ProfileComponent } from './profile/profile.component';
import { PostCreationComponent } from './post-creation/post-creation.component';
import { AllUsersComponent } from './all-users/all-users.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { TrendsComponent } from './trends/trends.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full'
  },
  {
    path: 'users',
    component: AllUsersComponent
  },

  { 
    path: 'trends',
    component: TrendsComponent
  },

  {
    path: 'analytics',
    component: AnalyticsComponent
  },
  { 
    path: 'profile/:username',
    component: ProfileComponent
  },

  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'posts',
    component: AllPostsComponent,
  },
  {
    path: 'signup',
    component: SignUpComponent,
  },
  {
    path: 'post-creation',
    component: PostCreationComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
