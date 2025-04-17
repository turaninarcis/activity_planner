import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

export class CustomValidators {

    static username(){
        return ['', [Validators.required, Validators.minLength(3), Validators.maxLength(24)]];   
    }
    static email(){ 
        return ['', [Validators.required, Validators.email]];
    }
    static password() {
       return ['', [Validators.required, Validators.minLength(10), Validators.maxLength(30), Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$")]];
    }
    static newPassword() {
        return ['', [Validators.minLength(10), Validators.maxLength(30), Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$")]];
     }

  static passwordsMatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { passwordsMismatch: true };
  };
}
