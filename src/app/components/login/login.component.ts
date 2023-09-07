import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  returnUrl: string;
  loginError = '';
  loginForm: FormGroup;
  loginSubscription$: Subscription;
  loginFormSubscription$: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.createLoginForm();
    this.subscribeToFormChanges();
  }

  ngOnDestroy(): void {
    this.loginSubscription$?.unsubscribe();
  }

  createLoginForm(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  subscribeToFormChanges(): void {
    this.loginFormSubscription$ = this.loginForm.valueChanges.subscribe(() => {
      this.loginError = '';
    });
  }

  login(): void {
    if (this.loginForm.invalid) return;

    const { username, password } = this.loginForm.value;

    this.loginSubscription$ = this.authService.login(username, password).subscribe(
      () => {
        this.router.navigateByUrl(this.returnUrl);
      },
      (error) => {
        this.loginError = error.error.message;
      }
    );
  };
}
