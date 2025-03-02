import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-terms-conditions',
    templateUrl: './terms-conditions.component.html',
    styleUrls: ['./terms-conditions.component.scss']
})
export class TermsConditionsComponent {
    @Output() agreed = new EventEmitter<void>();
    @Output() disagreed = new EventEmitter<void>();

    constructor(public dialogRef: MatDialogRef<TermsConditionsComponent>) {}

    closeDialog() {
        this.dialogRef.close();
    }

    agree() {
        this.agreed.emit(); 
        this.closeDialog(); 
    }

    disagree() {
      this.disagreed.emit(); // Emit the "disagreed" event
      this.closeDialog(); // Close the modal
  }
}