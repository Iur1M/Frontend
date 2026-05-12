import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomePageComponent } from './home-page/home-page.component';
import { MoviesPageComponent } from './movies-page/movies-page.component';
import { RegisterPageComponent } from './register-page/register-page.component';
import { FormsModule } from '@angular/forms';
import { ErrorPageComponent } from './error-page/error-page.component';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { MovieDetailPageComponent } from './movie-detail-page/movie-detail-page.component';
import { ActivityPageComponent } from './activity-page/activity-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { CommonModule } from '@angular/common';
import { WatchlistPageComponent } from './watchlist-page/watchlist-page.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomePageComponent,
    MoviesPageComponent,
    RegisterPageComponent,
    ErrorPageComponent,
    AdminPageComponent,
    MovieDetailPageComponent,
    ActivityPageComponent,
    ProfilePageComponent,
    WatchlistPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    CommonModule,
    RouterModule
  ],
  providers: [
    provideClientHydration(),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
