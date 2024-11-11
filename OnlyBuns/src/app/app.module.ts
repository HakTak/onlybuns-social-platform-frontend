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
import { MatTooltipModule } from '@angular/material/tooltip';

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
    MatTooltipModule
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
