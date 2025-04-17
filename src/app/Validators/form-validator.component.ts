import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-validation-error',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div *ngIf="control?.invalid && control?.touched" class="invalid-feedback d-block">
      <div *ngIf="control?.errors?.['required']">This field is required.</div>
      <div *ngIf="control?.errors?.['email']">Please enter a valid email address.</div>
      <div *ngIf="control?.errors?.['minlength']">Minimum length: {{ control?.errors?.['minlength'].requiredLength }}</div>
      <div *ngIf="control?.errors?.['maxlength']">Maximum length: {{ control?.errors?.['maxlength'].requiredLength }}</div>
      <div *ngIf="control?.errors?.['pattern']">{{ patternMessage || 'Invalid format' }}</div>
    </div>
  `,
})
export class FormValidationErrorComponent {
  @Input() control!: AbstractControl | null;
  @Input() patternMessage: string = '';
}