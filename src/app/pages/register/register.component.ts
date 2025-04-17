import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { TokenService } from '../../core/auth/token.service';
import { CommonModule } from '@angular/common';
import { FormValidationErrorComponent } from '../../Validators/form-validator.component';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CustomValidators } from '../../Validators/CustomValidator';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule, FormValidationErrorComponent, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

   registerForm: FormGroup;
   backendErrors: string[] = [];
   showPassword:boolean = false;
   showConfirmPassword:boolean = false;


   constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router
   ){
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(24)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(30), Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$")]],
      confirmPassword: ['', Validators.required]
    },{
        validators: CustomValidators.passwordsMatchValidator
    });
   }

   onSubmit(): void{
    console.log(this.registerForm.value)
    if(this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    const {username, email, password} = this.registerForm.value;
    this.authService.register({username,password,email}).subscribe({
      next: (res) => {
        this.tokenService.saveToken(res.token);
        this.backendErrors = [];
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Registration error:', err);
        if (err.error && typeof err.error.error === 'string') {
          // Split error message string by comma
          this.backendErrors = err.error.error.split(',').map((e:string) => e.trim());
        } else {
          this.backendErrors = ['An unknown error occurred.'];
        }
      }
    });
   }
}

