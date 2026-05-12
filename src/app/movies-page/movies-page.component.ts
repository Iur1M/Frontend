import { Component, OnInit, HostListener } from '@angular/core';
import { ApiService } from '../shared/api.service';
import { Router } from '@angular/router';
import { Movie } from '../shared/models/movie.model';

@Component({
  selector: 'app-movies-page',
  templateUrl: './movies-page.component.html',
  styleUrls: ['./movies-page.component.css'],
})
export class MoviesPageComponent implements OnInit {
  movies: Movie[] = [];
  years: number[] = [];
  genres: string[] = [];

  searchTerm = '';
  sortBy = 'rating';
  desc = true;
  selectedYear?: number;
  selectedGenre?: string;
  sortByOption = 'ratingDesc';

  page = 1;
  pageSize = 15;
  totalCount = 0;
  showBackToTop = false;

  constructor(
    private api: ApiService,
    private router: Router,
  ) {}

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.showBackToTop = window.pageYOffset > 400;
  }

  ngOnInit() {
    this.loadMovies();
    this.loadYears();
    this.loadGenres();
  }

  loadYears() {
    this.api.getYears().subscribe({
      next: (res) => {
        this.years = res;
      },
      error: (err) => console.error('Error loading years', err),
    });
  }

  loadGenres() {
    this.api.getGenres().subscribe({
      next: (res) => {
        this.genres = res;
      },
      error: (err) => console.error('Error loading genres', err),
    });
  }

  loadMovies() {
    const term = this.searchTerm ? this.searchTerm.trim() : '';
    if (term.length > 0 && term.length < 3) {
      return;
    }

    this.api
      .getMovies(
        term,
        this.sortBy,
        this.desc,
        this.selectedYear,
        this.selectedGenre,
        this.page,
        this.pageSize,
      )
      .subscribe((res) => {
        this.movies = res.items;
        this.totalCount = res.totalCount;
      });
  }

  nextPage() {
    if (this.page * this.pageSize < this.totalCount) {
      this.page++;
      this.loadMovies();
      this.scrollToTop();
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.loadMovies();
      this.scrollToTop();
    }
  }

  onSortChange(value: string) {
    this.page = 1;

    if (value === 'ratingAsc') {
      this.sortBy = 'rating';
      this.desc = false;
    } else if (value === 'ratingDesc') {
      this.sortBy = 'rating';
      this.desc = true;
    } else {
      this.sortBy = '';
      this.desc = false;
    }
    this.loadMovies();
  }

  onYearChange(year: string) {
    this.page = 1;
    this.selectedYear = year ? Number(year) : undefined;
    this.loadMovies();
  }

  onGenreChange(genre: string) {
    this.page = 1;
    this.selectedGenre = genre || undefined;
    this.loadMovies();
  }

  openDetails(id: number) {
    this.router.navigate(['/movies', id]);
  }

  getTotalPages(): number {
    return Math.ceil(this.totalCount / this.pageSize);
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}