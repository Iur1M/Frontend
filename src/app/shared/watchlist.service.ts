import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Movie } from './models/movie.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WatchlistService {
  private apiUrl = `${environment.apiUrl}/watchlist`;

  constructor(private http: HttpClient) {}

  getWatchlist(): Observable<Movie[]> {
    return this.http.get<Movie[]>(this.apiUrl);
  }

  toggleWatchlist(movieId: number): Observable<{ added: boolean }> {
    return this.http.post<{ added: boolean }>(`${this.apiUrl}/${movieId}`, {});
  }
}
