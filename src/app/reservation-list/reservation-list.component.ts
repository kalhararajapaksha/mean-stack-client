import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Reservation } from '../reservation';
import { ReservationService } from '../reservation.service';

@Component({
  selector: 'app-reservation-list',
  templateUrl:'./reservation-list.component.html',
  styles: [
  ]
})
export class ReservationListComponent implements OnInit {

  reservations$: Observable<Reservation[]> = new Observable();
 
  constructor(private reservationService: ReservationService) { }
  
  ngOnInit(): void {
    this.fetchReservations();
  }
  

  private fetchReservations(): void {
    this.reservations$ = this.reservationService.getReservations();
  }
 }