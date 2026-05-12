import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomePageComponent } from './home-page/home-page.component';
import { MoviesPageComponent } from './movies-page/movies-page.component';
import { LoginComponent } from './login/login.component';
import { RegisterPageComponent } from './register-page/register-page.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { AdminGuard } from './guards/admin.guard';
import { AuthGuard } from './guards/auth.guard';
import { MovieDetailPageComponent } from './movie-detail-page/movie-detail-page.component';
import { ActivityPageComponent } from './activity-page/activity-page.component';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { WatchlistPageComponent } from './watchlist-page/watchlist-page.component';

const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'movies', component: MoviesPageComponent },
  { path: 'movies/:id', component: MovieDetailPageComponent },
  {
    path: 'activity',
    component: ActivityPageComponent,
    canActivate: [AuthGuard],
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterPageComponent },
  {
    path: 'admin',
    component: AdminPageComponent,
    canActivate: [AdminGuard],
  },
  {
    path: 'profile',
    component: ProfilePageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'watchlist',
    component: WatchlistPageComponent,
    canActivate: [AuthGuard],
  },
  { path: '**', component: ErrorPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}