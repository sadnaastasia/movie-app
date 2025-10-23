import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { Genre } from '../movies.service';
import { MatIconModule } from '@angular/material/icon';

export interface DialogData {
  name: string;
  year: number;
  poster: string;
  genres: Genre[];
  description: string;
  rating: number;
}

@Component({
  selector: 'app-modal',
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent {
  dialogRef = inject(MatDialogRef<ModalComponent>);
  data = inject<DialogData>(MAT_DIALOG_DATA);

  closeModal(): void {
    this.dialogRef.close();
  }
}
