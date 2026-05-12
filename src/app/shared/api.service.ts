import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Movie } from './models/movie.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = `${environment.apiUrl}/movie`;

  constructor(private http: HttpClient) {}

  getYears() {
    return this.http.get<number[]>(`${this.baseUrl}/years`);
  }

  getGenres() {
    return this.http.get<string[]>(`${this.baseUrl}/genres`);
  }

  getMovies(
    search?: string,
    sortBy?: string,
    desc: boolean = false,
    year?: number,
    genre?: string,
    page: number = 1,
    pageSize: number = 10,
  ) {
    let params = new HttpParams().set('page', page).set('pageSize', pageSize);

    if (search && search.trim()) {
      params = params.set('search', search.trim());
    }

    if (sortBy) {
      params = params.set('sortBy', sortBy);
      params = params.set('desc', desc.toString());
    }

    if (year) {
      params = params.set('year', year.toString());
    }

    if (genre) {
      params = params.set('genre', genre);
    }

    return this.http.get<{
      items: Movie[];
      totalCount: number;
    }>(this.baseUrl, { params });
  }

  getMovieById(id: number) {
    return this.http.get<Movie>(`${this.baseUrl}/${id}`);
  }
}
