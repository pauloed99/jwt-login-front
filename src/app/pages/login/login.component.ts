import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private router: Router,
    private toastService: ToastrService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  get email() {
    return this.loginForm.get('email')!;
  }

  get password() {
    return this.loginForm.get('password')!;
  }

  signIn() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.loginForm.reset();
          sessionStorage.setItem('token', response.token);
          this.router.navigate(['/user-details']);
          this.toastService.success('Login efetuado com sucesso!');
        },
        error: () =>
          this.toastService.error(
            'As credenciais para efetuar o login estão incorretas!'
          ),
      });
    } else {
      Object.keys(this.loginForm.controls).forEach((control) => {
        this.loginForm.get(control)?.markAsDirty();
      });
    }
  }
}
