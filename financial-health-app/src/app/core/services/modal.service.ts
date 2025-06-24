import { Injectable } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from '../../shared/components/confirmation-modal/confirmation-modal.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(private ngbModalService: NgbModal) {}

  public confirm(
    title: string,
    message: string,
    confirmText: string = 'Confirm',
    cancelText: string = 'Cancel',
    confirmButtonClass: string = 'btn-danger',
    cancelButtonClass: string = 'btn-outline-secondary',
    modalOptions?: NgbModalOptions
  ): Promise<boolean> {
    const modalRef = this.ngbModalService.open(ConfirmationModalComponent, { centered: true, backdrop: 'static', ...modalOptions });
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.message = message;
    modalRef.componentInstance.confirmText = confirmText;
    modalRef.componentInstance.cancelText = cancelText;
    modalRef.componentInstance.confirmButtonClass = confirmButtonClass;
    modalRef.componentInstance.cancelButtonClass = cancelButtonClass;

    return modalRef.result.then(
      (result) => {
        return !!result; // Resolves to true if modalRef.close(true) was called
      },
      (reason) => {
        return false; // Resolves to false if modal was dismissed
      }
    );
  }
}
