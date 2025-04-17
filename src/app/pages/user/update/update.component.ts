import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { DetailsPayload } from '../../../../Models/details-payload.model';
import { FormValidationErrorComponent } from '../../../Validators/form-validator.component';
import { UserUpdatePayload } from '../../../../Models/user-update-payload.model';
import { CustomValidators } from '../../../Validators/CustomValidator';
@Component({
  selector: 'app-update',
  imports: [RouterModule, NgIf, ReactiveFormsModule, FormValidationErrorComponent, NgClass, NgFor],
  templateUrl: './update.component.html',
  styleUrl: './update.component.scss'
})
export class UpdateComponent implements OnInit{
  userUpdateForm :FormGroup;
  userDetails ?: DetailsPayload;
  showPassword: boolean = false;
  showUpdatePassword: boolean = false;
  backendErrors: string[] = [];
  showChangePassword:boolean = false;

  constructor(    
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  )
    {
      this.userUpdateForm = this.fb.group({
        username: CustomValidators.username(),
        email: CustomValidators.email(),
        password: ['', [Validators.required]],
        newPassword: CustomValidators.newPassword(),
    })
  }

  ngOnInit(): void {
    this.userService.userDetails$.subscribe((data)=>{
      if(data){
        this.userDetails = data;
      }else{
        this.userService.getDetails().subscribe(details => this.userDetails = details);
      }
      this.userUpdateForm.patchValue({
        username: this.userDetails?.username,
        email: this.userDetails?.email
      })
    })
  }

  onSubmit(): void{
    console.log(this.userUpdateForm.value)
    if(this.userUpdateForm.invalid) {
      console.log("form invalid")
      this.userUpdateForm.markAllAsTouched();
      return;
    }

    const {username, email, password, newPassword} = this.userUpdateForm.value;

    const updatePayload: UserUpdatePayload = {
      username:username,
      email:email,
      password:password,
      newPassword: newPassword != '' ? newPassword : null
    };
    console.log(updatePayload);

    this.userService.updateUser(updatePayload).subscribe({
      next: (res) => {
        this.backendErrors = [];
        this.router.navigate(['/users']);
      },
      error: (err) => {
        console.error('Update error:', err);
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
