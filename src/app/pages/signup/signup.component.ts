import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CepService } from 'src/app/services/cep.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  registrationForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private toastService: ToastrService,
    private cepService: CepService,
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.registrationForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      name: ['', Validators.required],
      birthDate: ['', Validators.required],
      address: this.fb.group({
        zip: ['', Validators.required],
        street: ['', Validators.required],
        neighborhood: ['', Validators.required],
        city: ['', Validators.required],
        uf: ['', Validators.required],
      }),
    });
  }

  get email() {
    return this.registrationForm.get('email')!;
  }

  get password() {
    return this.registrationForm.get('password')!;
  }

  get name() {
    return this.registrationForm.get('name')!;
  }

  get birthDate() {
    return this.registrationForm.get('birthDate')!;
  }

  get zip() {
    return this.registrationForm.get('address.zip')!;
  }

  handleZip(event: Event) {
    if (this.registrationForm.get('address.zip')?.valid) {
      const zip = (event.target as HTMLInputElement).value;

      this.cepService.getAddressByCep(zip).subscribe((res) => {
        this.registrationForm.get('address.street')?.setValue(res.logradouro);
        this.registrationForm.get('address.neighborhood')?.setValue(res.bairro);
        this.registrationForm.get('address.city')?.setValue(res.localidade);
        this.registrationForm.get('address.uf')?.setValue(res.uf);
      });
    } else {
      const addressGroup = this.registrationForm.get('address') as FormGroup;
      Object.keys(addressGroup.controls).forEach((control) => {
        if (control !== 'zip') {
          addressGroup.get(control)?.reset();
        }
      });
    }
  }

  signUp(group: FormGroup) {
    if (group.valid) {
      this.authService.register(group.value).subscribe({
        next: (response) => {
          this.registrationForm.reset();
          this.toastService.success('Cadastro efetuado com sucesso!');
        },
        error: (error) => console.log(error)
      });
    } else {
      Object.keys(group.controls).forEach((value) => {
        let control = group.get(value);

        if (control instanceof FormGroup) {
          this.signUp(control);
        } else {
          control?.markAsDirty();
        }
      });
    }
  }
}
