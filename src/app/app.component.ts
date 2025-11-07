import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  effect,
} from '@angular/core';
import { MoviesService } from './movies.service';
import { AsyncPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ModalComponent } from './modal/modal.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { debounceTime, Subscription, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgClass } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [
    AsyncPipe,
    MatButtonModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    NgClass,
    MatIconModule,
    MatProgressBarModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  title = 'movie-app';

  movieService = inject(MoviesService);

  page = signal(1);
  movies$ = signal(this.movieService.getMovies(this.page()));
  moviesFilteredByRating$ = this.movieService.filterMoviesByRating(9);
  previousPageButton = signal(true);
  nextPageButton = signal(false);

  input = new FormControl('');
  inputSub!: Subscription;

  dialog = inject(MatDialog);

  constructor() {
    this.inputSub = this.input.valueChanges
      .pipe(
        debounceTime(300),
        switchMap((inputValue) => {
          if (!inputValue) {
            this.page.set(1);
            this.movies$.set(this.movieService.getMovies(this.page()));
            return this.movieService.filterMoviesByKeyword(
              inputValue!,
              this.page()
            );
          }
          this.movies$.set(
            this.movieService.filterMoviesByKeyword(inputValue!, 1)
          );

          this.page.set(1);

          this.previousPageButton.set(true);
          this.nextPageButton.set(false);

          if (this.movieService.totalPages() === 1) {
            this.nextPageButton.set(true);
          }

          return this.movieService.filterMoviesByKeyword(
            inputValue!,
            this.page()
          );
        }),
        takeUntilDestroyed()
      )
      .subscribe();

    effect(() => {
      if (this.page() >= this.movieService.totalPages()) {
        this.nextPageButton.set(true);
      } else {
        this.nextPageButton.set(false);
      }
    });
  }

  previousPage() {
    if (this.input.value!.length > 0) {
      this.page.update((value) => value - 1);
      this.movies$.set(
        this.movieService.filterMoviesByKeyword(this.input.value!, this.page())
      );
    } else {
      this.page.update((value) => value - 1);
      this.movies$.set(this.movieService.getMovies(this.page()));
    }

    window.scrollTo(0, 0);

    if (this.page() === 1) {
      this.previousPageButton.set(true);
    }

    if (this.page() < this.movieService.totalPages()) {
      this.nextPageButton.set(false);
    }
  }

  nextPage() {
    if (this.input.value!.length > 0) {
      this.page.update((value) => value + 1);
      this.movies$.set(
        this.movieService.filterMoviesByKeyword(this.input.value!, this.page())
      );
    } else {
      this.page.update((value) => value + 1);
      this.movies$.set(this.movieService.getMovies(this.page()));
    }

    window.scrollTo(0, 0);

    if (this.page() === this.movieService.totalPages()) {
      this.nextPageButton.set(true);
    }

    if (this.page() > 1) {
      this.previousPageButton.set(false);
    }
  }

  openDialog(kinopoiskId: number): void {
    this.movieService.getMovie(kinopoiskId).subscribe((data) => {
      const dialogRef = this.dialog.open(ModalComponent, {
        height: `${window.innerWidth > 600 ? '500px' : '8c0dvh'}`,
        width: `${window.innerWidth > 600 ? '600px' : '100dvw'}`,
        data: {
          name: data.nameRu || data.nameEn || data.nameOriginal,
          year: data.year,
          genres: data.genres,
          description: data.description,
          poster: data.posterUrlPreview,
          rating: data.ratingKinopoisk,
        },
      });

      dialogRef.afterClosed();
    });
  }

  ngOnDestroy() {
    this.inputSub.unsubscribe();
  }
}
