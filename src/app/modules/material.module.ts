import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatOption, MatSelect } from '@angular/material/select';

const MatModules = [
  CommonModule,
  MatButtonModule,
  MatTableModule,
  MatIconModule,
  MatDividerModule,
  MatDialogModule,
  MatFormFieldModule,
  MatCardModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSortModule,
  ReactiveFormsModule,
  FormsModule,
  MatSelect,
  MatOption,
  MatDialogModule
];

@NgModule({
  declarations: [],
  imports: [MatModules],
  exports: [MatModules]
})
export class MaterialModule {}
