import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, tap, throwError } from 'rxjs';

// Использованное api: https://kinopoiskapiunofficial.tech/documentation/api/

export interface Genre {
  genre: string;
}

export interface Movies {
  items: Movie[];
  totalPages: number;
}

export interface Movie {
  kinopoiskId: number;
  nameOriginal: string;
  nameRu: string;
  nameEn: string;
  year: number;
  posterUrlPreview: string;
  genres: Genre[];
  description: string;
  ratingKinopoisk: number;
}

@Injectable({
  providedIn: 'root',
})
export class MoviesService {
  http: HttpClient = inject(HttpClient);
  baseApiUrl = 'https://kinopoiskapiunofficial.tech/api/v2.2/films';

  apyURL = import.meta.env.NG_APP_KEY;

  totalPages = signal(1);

  getMovies(page: number) {
    return this.http
      .get<Movies>(`${this.baseApiUrl}?page=${page}`, {
        headers: {
          'X-API-KEY': `${this.apyURL}`,
          'Content-Type': 'application/json',
        },
      })
      .pipe(
        tap((res) => this.totalPages.set(res.totalPages)),
        catchError((error) => {
          if (error.status === 401) {
            console.error('Пустой или неправильный токен');
          } else if (error.status === 402) {
            console.error('Превышен лимит запросов(или дневной, или общий)');
          } else if (error.status === 429) {
            console.error(
              'Слишком много запросов. Общий лимит - 20 запросов в секунду'
            );
          }
          return throwError(() => new Error('Что-то пошло не так'));
        })
      );
  }

  getMovie(kinopoiskId: number) {
    return this.http
      .get<Movie>(`${this.baseApiUrl}/${kinopoiskId}`, {
        headers: {
          'X-API-KEY': `${this.apyURL}`,
          'Content-Type': 'application/json',
        },
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            console.error('Пустой или неправильный токен');
          } else if (error.status === 402) {
            console.error('Превышен лимит запросов(или дневной, или общий)');
          } else if (error.status === 404) {
            console.error('Фильм не найден');
          } else if (error.status === 429) {
            console.error(
              'Слишком много запросов. Общий лимит - 20 запросов в секунду'
            );
          }
          return throwError(() => new Error('Что-то пошло не так'));
        })
      );
  }

  filterMoviesByKeyword(keyword: string, page: number) {
    return this.http
      .get<Movies>(`${this.baseApiUrl}?keyword=${keyword}&page=${page}`, {
        headers: {
          'X-API-KEY': `${this.apyURL}`,
          'Content-Type': 'application/json',
        },
      })
      .pipe(
        tap((res) => this.totalPages.set(res.totalPages)),
        catchError((error) => {
          if (error.status === 401) {
            console.error('Пустой или неправильный токен');
          } else if (error.status === 402) {
            console.error('Превышен лимит запросов(или дневной, или общий)');
          } else if (error.status === 429) {
            console.error(
              'Слишком много запросов. Общий лимит - 20 запросов в секунду'
            );
          }
          return throwError(() => new Error('Что-то пошло не так'));
        })
      );
  }

  filterMoviesByRating(ratingFrom: number) {
    return this.http
      .get<Movies>(`${this.baseApiUrl}?ratingFrom=${ratingFrom}`, {
        headers: {
          'X-API-KEY': `${this.apyURL}`,
          'Content-Type': 'application/json',
        },
      })
      .pipe(
        tap((res) => this.totalPages.set(res.totalPages)),
        catchError((error) => {
          if (error.status === 401) {
            console.error('Пустой или неправильный токен');
          } else if (error.status === 402) {
            console.error('Превышен лимит запросов(или дневной, или общий)');
          } else if (error.status === 429) {
            console.error(
              'Слишком много запросов. Общий лимит - 20 запросов в секунду'
            );
          }
          return throwError(() => new Error('Что-то пошло не так'));
        })
      );
  }
}
