import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import {Modal } from 'bootstrap';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  imports:[NgClass]
})
export class ConfirmationModalComponent {
  @Input() title = 'Confirm';
  @Input() message = 'Are you sure?';
  @Input() confirmBtnClass = 'btn-primary';
  @Input() headerClass = 'bg-primary text-white';
  @Input() onConfirm!: () => void;

  confirm() {
    if (this.onConfirm) this.onConfirm();
    const modalElement = document.getElementById('confirmationModal');
    const modal = Modal.getInstance(modalElement!);
    modal?.hide();
  }
}