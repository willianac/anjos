import { Component } from '@angular/core';

@Component({
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  public register = {
    name: '',
    lastName: '',
    email: '',
    password: '',
    cellphone: '',
    phone: '',
    country: '',
    state: '',
    zipcode: '',
    address: '',
    birthdate: '',
    motherName: '',
    confirmPassword: '',
    document: ''
  };

  constructor() { }

}
