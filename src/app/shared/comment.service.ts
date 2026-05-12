import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Comment } from './models/comment.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CommentService {
  private api = `${environment.apiUrl}/comments`;

  constructor(private http: HttpClient) {}

  getByMovie(movieId: number) {
    return this.http.get<Comment[]>(`${this.api}/${movieId}`);
  }

  create(data: { movieId: number; text: string; rating: number }) {
    return this.http.post<Comment>(this.api, data);
  }

  update(id: number, data: { text: string; rating: number }) {
    return this.http.put<Comment>(`${this.api}/${id}`, data);
  }

  delete(id: number) {
    return this.http.delete(`${this.api}/${id}`);
  }

  like(commentId: number) {
    return this.http.post<{ likes: number }>(
      `${this.api}/${commentId}/like`,
      {},
    );
  }
}
