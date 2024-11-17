import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Use this for animations

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CardComponent } from './card/card.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ApiService } from './service/api.service';
import { FooService } from './service/foo.service';
import { AuthService } from './service/auth.service';
import { UserService } from './service/user.service';
import { ConfigService } from './service/config.service';
import { AuthGuard } from './guards/auth.guard';

import { TokenInterceptor } from './interceptor/TokenInterceptor';
import { AngularMaterialModule } from './angular-material/angular-material.module';
import { AllPostsComponent } from './all-posts/all-posts.component';
import { PostCommentsComponent } from './post-comments/post-comments.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ProfileComponent } from './profile/profile.component';
import { PostCreationComponent } from './post-creation/post-creation.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MapComponent } from './map/map.component';
import { CommentFormComponent } from './comment-form/comment-form.component';
import { ConfirmDeleteDialog } from './confirm-delete-dialog/confirm-delete-dialog.component';
import { PostModificationComponent } from './post-modification/post-modification.component';
import { AllUsersComponent } from './all-users/all-users.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@NgModule({
  declarations: [
    AppComponent,
    CardComponent,
    HomeComponent,
    HeaderComponent,
    LoginComponent,
    SignUpComponent,
    AllPostsComponent,
    PostCommentsComponent,
    ProfileComponent,
    PostCreationComponent,
    MapComponent,
    CommentFormComponent,
    ConfirmDeleteDialog,
    PostModificationComponent,
    AllUsersComponent,
    AnalyticsComponent,
    
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
    NgxChartsModule
  ],
  providers: [ 
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    FooService,
    AuthService,
    ApiService,
    UserService,
    ConfigService,
    AuthGuard
  ],
  bootstrap: [AppComponent],
  
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule { }
