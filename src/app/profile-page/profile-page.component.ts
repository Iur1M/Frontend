import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { ActivityService } from '../shared/activity.service';
import { ApiService } from '../shared/api.service';
import { WatchlistService } from '../shared/watchlist.service';
import { Activity } from '../shared/models/activity.model';
import { Movie } from '../shared/models/movie.model';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css',
})
export class ProfilePageComponent implements OnInit {
  user: any;
  activities: Activity[] = [];
  allMovies: Movie[] = [];
  watchlistMovies: Movie[] = [];
  loading = true;
  showMoviePicker = false;

  constructor(
    private auth: AuthService,
    private activity: ActivityService,
    private api: ApiService,
    private watchlistService: WatchlistService
  ) {
    this.auth.user$.subscribe((u) => (this.user = u));
  }

  ngOnInit() {
    this.activity.getMyHistory().subscribe((res) => {
      this.activities = res.slice(0, 4);
      this.loading = false;
    });

    this.api.getMovies('', '', false, undefined, '', 1, 20).subscribe((res) => {
      this.allMovies = res.items || res;
    });

    this.watchlistService.getWatchlist().subscribe((res) => {
      this.watchlistMovies = res.slice(0, 4);
    });
  }

  toggleMoviePicker() {
    this.showMoviePicker = !this.showMoviePicker;
  }

  selectFavorite(movie: Movie) {
    this.auth.updateFavoriteMovie(movie.id).subscribe({
      next: () => {
        if (this.user) {
          this.user.favoriteMoviePoster = movie.posterUrl;
          this.user.favoriteMovieId = movie.id;
          this.auth.updateLocalUser(this.user);
        }
        this.showMoviePicker = false;
      },
    });
  }

  label(type: string) {
    return type === 'View' ? 'Viewed' : 'Commented';
  }
}