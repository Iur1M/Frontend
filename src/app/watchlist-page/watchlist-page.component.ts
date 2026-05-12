import { Component, OnInit } from '@angular/core';
import { WatchlistService } from '../shared/watchlist.service';
import { Movie } from '../shared/models/movie.model';

@Component({
  selector: 'app-watchlist-page',
  templateUrl: './watchlist-page.component.html',
  styleUrls: ['./watchlist-page.component.css']
})
export class WatchlistPageComponent implements OnInit {
  movies: Movie[] = [];
  loading = true;

  constructor(private watchlistService: WatchlistService) {}

  ngOnInit() {
    this.loadWatchlist();
  }

  loadWatchlist() {
    this.watchlistService.getWatchlist().subscribe({
      next: (data) => {
        this.movies = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  removeFromWatchlist(event: Event, movieId: number) {
    event.stopPropagation(); 
    
    this.watchlistService.toggleWatchlist(movieId).subscribe({
      next: (res) => {
        if (!res.added) {
          this.movies = this.movies.filter(m => m.id !== movieId);
        }
      },
      error: (err) => console.error('Failed to remove from watchlist', err)
    });
  }
}