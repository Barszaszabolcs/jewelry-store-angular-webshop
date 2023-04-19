import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { User } from '../../shared/models/User';
import { UserService } from '../../shared/services/user.service';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit{

  registerForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
    passwordAgain: new FormControl(''),
    name: new FormGroup({
      firstname: new FormControl(''),
      lastname: new FormControl('')
    })
  });

  constructor(private router: Router, private location: Location, 
    private authService: AuthService, private userService: UserService, 
    private toastr: ToastrService) {}

  ngOnInit(): void {}

  onSubmit() {
    if (this.registerForm.get('email')?.value === '' || this.registerForm.get('password')?.value === '' || 
    this.registerForm.get('passwordAgain')?.value === '' || this.registerForm.get('name.firstname')?.value === '' || 
    this.registerForm.get('name.lastname')?.value === '') {
      this.toastr.error('Minden mezőt ki kell tölteni!', 'Regisztráció hiba!');
      return;
    }

    if (this.registerForm.get('password')?.value !== this.registerForm.get('passwordAgain')?.value) {
      this.toastr.error('A két jelszónak meg kell egyeznie!', 'Regisztráció hiba!');
      return;
    }
    
    this.authService.signup(this.registerForm.get('email')?.value as string, this.registerForm.get('password')?.value as string).then(cred => {
      const user: User = {
        id: cred.user?.uid as string,
        email: this.registerForm.get('email')?.value as string,
        username: this.registerForm.get('email')?.value?.split('@')[0] as string,
        name: {
          firstname: this.registerForm.get('name.firstname')?.value as string,
          lastname: this.registerForm.get('name.lastname')?.value as string,
        }
      };
      this.userService.create(user).then(_ => {
        this.toastr.success('Sikeres regisztrálás', 'Regisztráció');
        this.router.navigateByUrl('/shop');
      }).catch(error => {
        console.error(error);
      });
    }).catch(error => {
      console.error(error);
    });
  }

  goBack() {
    this.location.back();
  }
}
