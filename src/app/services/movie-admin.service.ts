import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MovieAdminService {
  private baseUrl = `${environment.apiUrl}/movie`;

  constructor(private http: HttpClient) {}

  addMovie(movie: any) {
    return this.http.post(this.baseUrl, movie);
  }

  deleteMovie(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
