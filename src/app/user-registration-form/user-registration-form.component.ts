import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { User } from '../user';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-registration-form',
  templateUrl: './user-registration-form.component.html',
  styleUrls: ['./user-registration-form.component.css']
})
export class UserRegistrationFormComponent implements OnInit {
  @Input()
  initialState: BehaviorSubject<User> = new BehaviorSubject({});
  
  @Output()
  formValuesChanged = new EventEmitter<User>();
  
  @Output()
  formSubmitted = new EventEmitter<User>();
  
  registerForm: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder, private router: Router,private userService: UserService) { }
  get name() { return this.registerForm.get('name')!; }
  get phoneNumber() { return this.registerForm.get('phoneNumber')!; }
  get email() { return this.registerForm.get('email')!; }
  get password() { return this.registerForm.get('password')!; }
  get username() { return this.registerForm.get('username')!; }

  ngOnInit() {
    this.initialState.subscribe(user => {
      this.registerForm = this.fb.group({
        username: [ user.username, [Validators.required] ],
        password: [ user.password, [ Validators.required ] ]
      });
    });
  
    this.registerForm.valueChanges.subscribe((val) => { this.formValuesChanged.emit(val); });
  }

  submitForm() {
    console.log(this.registerForm.value);
    this.userReg(this.registerForm.value);
  }

  userReg(user: User) {
    this.userService.createUser(user)
      .subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: (error) => {
          alert("Failed to create user");
        }
      });
  }
}
