import { Component } from '@angular/core';
import { ApiService } from '../shared/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent {
  topMovies: any[] = [];

  constructor(
    private api: ApiService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loadTopMovies();
  }

  loadTopMovies() {
    this.api.getMovies('', 'rating', true).subscribe((res) => {
      const movies = res.items ?? res;

      this.topMovies = movies.slice(0, 5);
    });
  }

  openDetails(id: number) {
    this.router.navigate(['/movies', id]);
  }
}
