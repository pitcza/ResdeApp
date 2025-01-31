import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-privacypolicy',
    templateUrl: './privacypolicy.component.html',
    styleUrls: ['./privacypolicy.component.scss']
})
export class PrivacypolicyComponent {
    @Output() agreed = new EventEmitter<void>(); // Emit when the user agrees
    @Output() disagreed = new EventEmitter<void>(); // Emit when the user disagrees

    constructor(public dialogRef: MatDialogRef<PrivacypolicyComponent>) {}

    closeDialog() {
        this.dialogRef.close();
    }

    agree() {
        this.agreed.emit(); // Emit the "agreed" event
        this.closeDialog(); // Close the modal
    }

    disagree() {
        this.disagreed.emit(); // Emit the "disagreed" event
        this.closeDialog(); // Close the modal
    }
}