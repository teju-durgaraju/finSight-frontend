import { Component, Input } from '@angular/core';
// import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'; // Will not resolve if not installed

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent {
  @Input() title: string = 'Confirm Action';
  @Input() message: string = 'Are you sure you want to proceed?';
  @Input() confirmText: string = 'Confirm';
  @Input() cancelText: string = 'Cancel';
  @Input() confirmButtonClass: string = 'btn-danger';
  @Input() cancelButtonClass: string = 'btn-secondary';

  // constructor(public activeModal: NgbActiveModal) {} // Requires NgbActiveModal
  constructor() {} // Placeholder constructor

  onConfirm(): void {
    // this.activeModal.close(true); // Requires NgbActiveModal
    console.log('Confirmed (NgbActiveModal not available)');
  }

  onCancel(): void {
    // this.activeModal.dismiss(false); // Requires NgbActiveModal
    console.log('Cancelled (NgbActiveModal not available)');
  }
}
