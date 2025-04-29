import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-validation-error',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div *ngIf="control?.invalid && control?.touched" class="invalid-feedback d-block m-0">
      <div *ngIf="control?.errors?.['required']" >Required</div>
      <div *ngIf="control?.errors?.['email']"  >Please enter a valid email address</div>
      <div *ngIf="control?.errors?.['minlength']">Should contain at least {{ control?.errors?.['minlength'].requiredLength }} characters</div>
      <div *ngIf="control?.errors?.['maxlength']">Maximum length: {{ control?.errors?.['maxlength'].requiredLength }}</div>
      <div *ngIf="control?.errors?.['pattern']">{{ patternMessage || 'Invalid format' }}</div>
    </div>
  `,
})
export class FormValidationErrorComponent {
  @Input() control!: AbstractControl | null;
  @Input() patternMessage: string = '';
}