import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeesListComponent } from './employees-list/employees-list.component';
import { AddEmployeeComponent } from './add-employee/add-employee.component'; 
import { EditEmployeeComponent } from './edit-employee/edit-employee.component'; 
import { SquareComponent } from './seat-order/seat-order.component'; 
import { ReservationFormComponent } from './reservation-form/reservation-form.component';
import { CanvasComponent } from './canvas/canvas.component';
import { UserSigninFormComponent } from './user-signin-form/user-signin-form.component';
import { UserRegistrationFormComponent } from './user-registration-form/user-registration-form.component';
import { ReservationListComponent } from './reservation-list/reservation-list.component';
 
const routes: Routes = [
 { path: '', redirectTo: 'home', pathMatch: 'full' },
 { path: 'home', component: EmployeesListComponent },
 { path: 'home/new', component: ReservationFormComponent },
 { path: 'home/new/reservations', component: ReservationListComponent },
 { path: 'home/new/reservation/:id/:time/:trainName/:price', component: SquareComponent },
 { path: 'home/login', component: UserSigninFormComponent },
 { path: 'home/login/register', component: UserRegistrationFormComponent },
 { path: 'employees/edit/:id', component: EditEmployeeComponent }]; 
 
 
@NgModule({
 imports: [RouterModule.forRoot(routes)],
 exports: [RouterModule]
})
export class AppRoutingModule { }