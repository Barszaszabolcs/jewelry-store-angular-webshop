import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../../shared/services/auth.service';

import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy{

  email = new FormControl('');
  password = new FormControl('');

  loadingSubscription?: Subscription
  loadingObservation?: Observable<boolean>;

  loading: boolean = false;

  constructor(private router: Router, private authService: AuthService, private toastr: ToastrService) {}

  ngOnInit(): void {}

  async login(){

    if (this.email.value === '' || this.password.value === '') {
      this.toastr.error('Minden mezőt ki kell tölteni!', 'Bejelentkezés hiba!');
      return;
    }

    this.loading = true;
    this.authService.login(this.email.value as string, this.password.value as string).then(_ => {
     const interval = setTimeout(() => {
       clearInterval(interval)
       this.toastr.success('Sikeres bejelentkezés', 'Bejelentkezés');
       this.router.navigateByUrl('/shop');
       this.loading = false;
     }, 2000);
    }).catch(error => {
      console.error(error);
      this.loading = false;
    });
   }

  ngOnDestroy(): void {
    this.loadingSubscription?.unsubscribe;
  }
}
