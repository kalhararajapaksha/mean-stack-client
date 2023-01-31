import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { User } from '../user';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-signin-form',
  templateUrl: './user-signin-form.component.html',
  styleUrls: ['./user-signin-form.component.css']
})
export class UserSigninFormComponent implements OnInit{
  @Input()
  initialState: BehaviorSubject<User> = new BehaviorSubject({});
  
  @Output()
  formValuesChanged = new EventEmitter<User>();
  
  @Output()
  formSubmitted = new EventEmitter<User>();
  
  loginForm: FormGroup = new FormGroup({});

  

  constructor(private fb: FormBuilder, private router: Router,private userService: UserService) { }
  get username() { return this.loginForm.get('username')!; }
  get password() { return this.loginForm.get('password')!; }
   
 ngOnInit() {
  this.initialState.subscribe(user => {
    this.loginForm = this.fb.group({
      username: [ user.username, [Validators.required] ],
      password: [ user.password, [ Validators.required ] ]
    });
  });

  this.loginForm.valueChanges.subscribe((val) => { this.formValuesChanged.emit(val); });
}

submitForm() {
  console.log(this.loginForm.value);
  //this.formSubmitted.emit(this.employeeForm.value);
  this.userLogin(this.loginForm.value);
}

userLogin(user: User) {
  this.userService.login(user)
    .subscribe({
      next: () => {
        this.router.navigate(['/home/new']);
      },
      error: (error) => {
        alert("Failed to Login");
      }
    });
}
}
