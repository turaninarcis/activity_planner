import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { TokenService } from '../../core/auth/token.service';
import { CommonModule, NgClass, NgIf } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [NgIf, NgClass, CommonModule,ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  loginForm: FormGroup;
  backendErrors: string[] = [];
  showPassword:boolean = false;
  

  constructor(    
    private fb: FormBuilder,
    private authService: AuthService,
    private tokenService: TokenService,
    private router:Router)
    {
      this.loginForm = this.fb.group({
        username: ['', [Validators.required]],
        password: ['', [Validators.required]]
    })
  }
  onSubmit(): void{
    console.log(this.loginForm.value)
    if(this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    const {username, email, password} = this.loginForm.value;
    this.authService.login({username,password}).subscribe({
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
