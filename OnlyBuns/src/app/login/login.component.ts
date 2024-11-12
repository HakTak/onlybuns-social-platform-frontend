import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService, UserService} from '../service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

interface DisplayMessage {
  msgType: string;
  msgBody: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  title = 'Login';
  form!: FormGroup;

  /**
   * Boolean used in telling the UI
   * that the form has been submitted
   * and is awaiting a response
   */
  submitted = false;

   /**
   * Notification message from received
   * form request or router
   */
    notification!: DisplayMessage;

    returnUrl!: string;
    private ngUnsubscribe: Subject<void> = new Subject<void>();


  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.route.params
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((params: any) => {
        this.notification = params as DisplayMessage;
      });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.form = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(64)])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(32)])]
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onSubmit(): void {

    if (this.form.invalid) {
      return;
    }
  
    this.submitted = true;
    console.log(JSON.stringify(this.form.value));
  
    
    
    this.authService.login(this.form.value).subscribe({
      next: (accessToken) => {
        console.log('Login successful, token:', accessToken);
        this.notification = {
          msgType: 'success',
          msgBody: 'Login successful!'
        };
        this.router.navigate(['/']); // Redirekcija na početnu stranicu nakon prijave
        this.submitted = false;
      },
      error: (error) => {
        this.submitted = false;
        console.log('Login error:', error);
        this.notification = {
          msgType: 'error',
          msgBody: error.error || 'Invalid credentials'
        };
      }
    });
  }
  

}
