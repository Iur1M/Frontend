export interface User {
  firstName: string;
  lastName: string;
  email: string;
  accessToken: string;
  refreshToken: string;
  favoriteMovieId?: number;
  favoriteMoviePoster?: string;
  roles?: string[];
}
