import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { UserSigninFormComponent } from './user-signin-form.component';
import { UserService } from '../user.service';
import { of } from 'rxjs';

describe('UserSigninFormComponent', () => {
    const mockRouter = jasmine.createSpyObj('Router', ['navigate']);
const mockUserService = jasmine.createSpyObj('UserService', ['login']);

  let component: UserSigninFormComponent;
  let fixture: ComponentFixture<UserSigninFormComponent>;
  let userServiceStub: Partial<UserService>;
  //let routerSpy: jasmine.SpyObj<Router>;


  beforeEach(() => {
    userServiceStub = {
      login: jasmine.createSpy().and.returnValue(of({}))
    };

    //routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [UserSigninFormComponent],
      providers: [
        FormBuilder,
        { provide: UserService, useValue: userServiceStub },
        //{ provide: Router, useValue: routerSpy }
      ]
    });

    fixture = TestBed.createComponent(UserSigninFormComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call userLogin on submitForm', () => {
    component.ngOnInit();
    component.submitForm();
    expect(userServiceStub.login).toHaveBeenCalled();
  });

//   it('should navigate to home/new on successful login', () => {
//     component.ngOnInit();
//     component.submitForm();
//    // expect(routerSpy.navigate).toHaveBeenCalledWith(['/home/new']);
//   });

  it('should show an error message on failed login', () => {
    userServiceStub.login = jasmine.createSpy().and.returnValue(
      new Promise((resolve, reject) => {
        reject(new Error('Failed to Login'));
      })
    );
    spyOn(window, 'alert');
    component.ngOnInit();
    component.submitForm();
    expect(window.alert).toHaveBeenCalledWith('Failed to Login');
  });
});
