import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../shared/api.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommentService } from '../shared/comment.service';
import { AuthService } from '../shared/auth.service';
import { WatchlistService } from '../shared/watchlist.service';
import { Comment } from '../shared/models/comment.model';
import { Movie } from '../shared/models/movie.model';

@Component({
  selector: 'app-movie-detail-page',
  templateUrl: 'movie-detail-page.component.html',
  styleUrls: ['movie-detail-page.component.css'],
})
export class MovieDetailPageComponent implements OnInit {
  movie!: Movie;
  comments: Comment[] = [];
  newComment = '';
  newRating = 8;
  suggestedMovies: Movie[] = [];
  isInWatchlist = false;

  safeTrailerUrl!: SafeResourceUrl;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private commentService: CommentService,
    public auth: AuthService,
    private watchlistService: WatchlistService,
    private router: Router,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));

      if (id) {
        this.loadMovie(id);
        this.loadComments(id);
        this.loadSuggestedMovies(id);
        this.checkWatchlistStatus(id);
      }
    });
  }

  checkWatchlistStatus(movieId: number) {
    if (this.auth.isLoggedIn()) {
      this.watchlistService.getWatchlist().subscribe((list) => {
        this.isInWatchlist = list.some((m) => m.id === movieId);
      });
    }
  }

  toggleWatchlist() {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.watchlistService.toggleWatchlist(this.movie.id).subscribe((res) => {
      this.isInWatchlist = res.added;
    });
  }

  loadMovie(id: number) {
    this.api.getMovieById(id).subscribe((movie) => {
      this.movie = movie;
      this.safeTrailerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        movie.trailerUrl,
      );
    });
  }

  loadSuggestedMovies(currentMovieId: number) {
    this.api.getMovies().subscribe((response: any) => {
      const moviesArray: Movie[] = response.items;

      const filtered = moviesArray.filter((m) => m.id !== currentMovieId);

      for (let i = filtered.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [filtered[i], filtered[j]] = [filtered[j], filtered[i]];
      }

      this.suggestedMovies = filtered.slice(0, 10);
    });
  }

  loadComments(movieId: number) {
    this.commentService
      .getByMovie(movieId)
      .subscribe((c) => (this.comments = c));
  }

  addComment() {
    if (!this.newComment.trim()) return;

    this.commentService
      .create({
        movieId: this.movie.id,
        text: this.newComment,
        rating: this.newRating,
      })
      .subscribe((c) => {
        this.comments.unshift(c);
        this.newComment = '';
        this.newRating = 8;
      });
  }

  deleteComment(id: number) {
    this.commentService.delete(id).subscribe(() => {
      this.comments = this.comments.filter((c) => c.id !== id);
    });
  }

  canDelete(c: Comment): boolean {
    if (!this.auth.isLoggedIn()) return false;

    const currentUserId = this.auth.getUserId();
    const isAdmin = this.auth.isAdmin();

    return isAdmin || (currentUserId !== null && c.userId === currentUserId);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  watchNow() {
    this.router.navigate(['/']);
  }

  goBack() {
    this.router.navigate(['/movies']);
  }

  likeComment(c: Comment) {
    this.commentService.like(c.id).subscribe((res) => {
      c.likes = res.likes;
      c.isLiked = !c.isLiked;
    });
  }
}