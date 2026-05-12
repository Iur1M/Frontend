import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Movie } from '../shared/models/movie.model';
import { AdminUser } from '../shared/models/admin-user.model';
import { AdminComment } from '../shared/models/admin-comment.model';

type AdminTab = 'add' | 'movies' | 'comments' | 'users';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css'],
})
export class AdminPageComponent implements OnInit {
  private movieUrl = `${environment.apiUrl}/movie`;
  private commentUrl = `${environment.apiUrl}/comments`;
  private userUrl = `${environment.apiUrl}/users`;

  selectedFile: File | null = null;

  tab: AdminTab = 'add';

  loadingMovies = false;
  loadingComments = false;
  loadingUsers = false;
  savingMovie = false;

  movies: Movie[] = [];
  comments: AdminComment[] = [];
  users: AdminUser[] = [];

  genres: string[] = [];

  directors: string[] = [];
  filteredDirectors: string[] = [];
  showDropdown = false;

  movie = {
    title: '',
    year: new Date().getFullYear(),
    rating: 0,
    director: '',
    genre: '',
    posterUrl: '',
    trailerUrl: '',
    description: '',
  };

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadMovies();
    this.loadGenres();
    this.loadDirectors();
  }

  setTab(tab: AdminTab): void {
    this.tab = tab;

    switch (tab) {
      case 'movies':
        this.loadMovies();
        break;

      case 'comments':
        this.loadComments();
        break;

      case 'users':
        this.loadUsers();
        break;
    }
  }

  loadMovies(): void {
    this.loadingMovies = true;

    this.http.get<{ items: Movie[] } | Movie[]>(this.movieUrl).subscribe({
      next: (res) => {
        this.movies = Array.isArray(res) ? res : res.items;
        this.loadingMovies = false;
      },
      error: (err) => {
        console.error('Failed to load movies', err);
        this.loadingMovies = false;
      },
    });
  }

  loadGenres(): void {
    this.http.get<string[]>(`${this.movieUrl}/genres`).subscribe({
      next: (res) => {
        this.genres = res;
      },
      error: (err) => {
        console.error('Failed to load genres', err);
      },
    });
  }

  loadDirectors(): void {
    this.http.get<string[]>(`${this.movieUrl}/directors`).subscribe({
      next: (res) => {
        this.directors = res;
        this.filteredDirectors = res;
      },
      error: (err) => {
        console.error('Failed to load directors', err);
      },
    });
  }

  addMovie(): void {
    this.savingMovie = true;

    const formData = new FormData();

    formData.append('Title', this.movie.title);
    formData.append('Year', this.movie.year.toString());
    formData.append('Rating', this.movie.rating.toString());
    formData.append('Director', this.movie.director);
    formData.append('Genre', this.movie.genre);
    formData.append('TrailerUrl', this.movie.trailerUrl || '');
    formData.append('Description', this.movie.description);

    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    this.http.post(`${this.movieUrl}/upload`, formData).subscribe({
      next: () => {
        this.loadMovies();
        this.resetForm();
        this.savingMovie = false;
      },
      error: (err) => {
        console.error('Failed to add movie', err);
        this.savingMovie = false;
      },
    });
  }

  updateMovie(movie: Movie): void {
    this.http.put(`${this.movieUrl}/${movie.id}`, movie).subscribe({
      next: () => {
        alert('Movie updated');
      },
      error: (err) => {
        console.error('Failed to update movie', err);
      },
    });
  }

  deleteMovie(id: number): void {
    if (!confirm('Delete movie?')) return;

    this.http.delete(`${this.movieUrl}/${id}`).subscribe({
      next: () => {
        this.movies = this.movies.filter((m) => m.id !== id);
      },
      error: (err) => {
        console.error('Failed to delete movie', err);
      },
    });
  }

  loadComments(): void {
    this.loadingComments = true;

    this.http.get<AdminComment[]>(`${this.commentUrl}/all`).subscribe({
      next: (res) => {
        this.comments = res;
        this.loadingComments = false;
      },
      error: (err) => {
        console.error('Failed to load comments', err);
        this.loadingComments = false;
      },
    });
  }

  deleteComment(id: number): void {
    this.http.delete(`${this.commentUrl}/${id}`).subscribe({
      next: () => {
        this.comments = this.comments.filter((c) => c.id !== id);
      },
      error: (err) => {
        console.error('Failed to delete comment', err);
      },
    });
  }

  loadUsers(): void {
    this.loadingUsers = true;

    this.http.get<AdminUser[]>(`${this.userUrl}/all`).subscribe({
      next: (res) => {
        this.users = res;
        this.loadingUsers = false;
      },
      error: (err) => {
        console.error('Failed to load users', err);
        this.loadingUsers = false;
      },
    });
  }

  banUser(id: string): void {
    if (!confirm('Ban this user?')) return;

    this.http.delete(`${this.userUrl}/${id}`).subscribe({
      next: () => {
        this.users = this.users.filter((u) => u.id !== id);
      },
      error: (err) => {
        alert(err.error?.message || 'Delete failed');
      },
    });
  }

  goToMovie(id: number): void {
    this.router.navigate(['/movies', id]);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) return;

    this.selectedFile = input.files[0];
  }

  filterDirectors(): void {
    const value = this.movie.director.toLowerCase();

    this.filteredDirectors = this.directors.filter((d) =>
      d.toLowerCase().includes(value),
    );
  }

  onFocus(): void {
    this.showDropdown = true;
    this.filteredDirectors = this.directors;
  }

  selectDirector(director: string): void {
    this.movie.director = director;
    this.showDropdown = false;
  }

  hideDropdown(): void {
    setTimeout(() => {
      this.showDropdown = false;
    }, 200);
  }

  private resetForm(): void {
    this.movie = {
      title: '',
      year: new Date().getFullYear(),
      rating: 0,
      director: '',
      genre: '',
      posterUrl: '',
      trailerUrl: '',
      description: '',
    };

    this.selectedFile = null;
  }
}
