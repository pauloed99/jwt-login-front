import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Address } from 'src/app/models/address';
import { UserRequest } from 'src/app/models/user-request';
import { UserResponse } from 'src/app/models/user-response';
import { CepService } from 'src/app/services/cep.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css'],
})
export class UserDetailsComponent implements OnInit {
  editForm!: FormGroup;
  user!: UserResponse;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private toastService: ToastrService,
    private cepService: CepService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getUserLogged();
    this.initForm();
  }

  initForm() {
    this.editForm = this.fb.group({
      email: ['', Validators.required],
      password: [''],
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
    return this.editForm.get('email')!;
  }

  get password() {
    return this.editForm.get('password')!;
  }

  get name() {
    return this.editForm.get('name')!;
  }

  get birthDate() {
    return this.editForm.get('birthDate')!;
  }

  get zip() {
    return this.editForm.get('address.zip')!;
  }

  getUserLogged() {
    this.userService.getUser().subscribe({
      next: (user) => {
        this.user = user;
        this.editForm.patchValue(user);
      },
      error: () => {
        this.toastService.error('Faça o login para acessar essa página!');
        this.router.navigate(['/login']);
      },
    });
  }

  logout() {
    sessionStorage.removeItem('token');
    this.router.navigate(['/login']);
    this.toastService.success('Logout efetuado com sucesso!');
  }

  handleZip(event: Event) {
    if (this.editForm.get('address.zip')?.valid) {
      const zip = (event.target as HTMLInputElement).value;

      this.cepService.getAddressByCep(zip).subscribe((res) => {
        this.editForm.get('address.street')?.setValue(res.logradouro);
        this.editForm.get('address.neighborhood')?.setValue(res.bairro);
        this.editForm.get('address.city')?.setValue(res.localidade);
        this.editForm.get('address.uf')?.setValue(res.uf);
      });
    } else {
      const addressGroup = this.editForm.get('address') as FormGroup;
      Object.keys(addressGroup.controls).forEach((control) => {
        if (control !== 'zip') {
          addressGroup.get(control)?.reset();
        }
      });
    }
  }

  editUser(group: FormGroup) {
    if (group.valid) {
      const addressToBeUpdated: Address = {...this.user.address, ...this.editForm.get('address')?.value}
      const userToBeUpdated: UserRequest = {...this.user, ...this.editForm.value}
      userToBeUpdated.address = addressToBeUpdated;
      
      this.userService.updateUser(userToBeUpdated).subscribe({
        next: () => {
          this.toastService.success('Atualização efetuada com sucesso!');
        },
        error: () => this.toastService.error('Não foi possível atualizar os dados!'),
      });
    } else {
      Object.keys(group.controls).forEach((value) => {
        let control = group.get(value);

        if (control instanceof FormGroup) {
          this.editUser(control);
        } else {
          control?.markAsDirty();
        }
      });
    }
  }

  deleteUserLogged() {
    this.userService.deleteUser().subscribe({
      next: () => {
        sessionStorage.removeItem('token');
        this.router.navigate(['/login']);
        this.toastService.success('Sua conta foi excluída com sucesso!');
      },
      error: () => {
        this.toastService.error('Erro ao excluir a sua conta!');
      }
    });
  }
}
