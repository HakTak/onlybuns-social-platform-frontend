import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, UserService } from '../service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface DisplayMessage {
  msgType: string;
  msgBody: string;
}

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit, OnDestroy {

  title = 'Sign up';
  form!: FormGroup;
  submitted = false;
  notification!: DisplayMessage;
  returnUrl!: string;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.route.params
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((params: any) => {
        this.notification = params as DisplayMessage;
      });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    
    this.form = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(32)]],
      confirmPassword: ['', Validators.required],
      firstname: ['', Validators.required], 
      lastname: ['', Validators.required],  
      address: ['', Validators.required]   
    }, { validator: this.passwordMatchValidator });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  // Custom validator to check if password and confirmPassword fields match
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }



  onSubmit() {
    if (this.form.invalid) {
      return;
    }
  
    this.submitted = true;
    console.log(JSON.stringify(this.form.value));
  
    this.authService.signup(this.form.value)
      .subscribe({
        next: (message) => {
          console.log('Success message:', message);
          this.notification = {
            msgType: 'success',
            msgBody: message
          };
          this.submitted = false;
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.submitted = false;
          console.log('Sign up error:', error);
          this.notification = { msgType: 'error', msgBody: error.error?.message || 'An unknown error occurred.' };
        }
      });
  }
  
  




}
