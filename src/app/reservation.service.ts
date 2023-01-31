import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';
import { Reservation } from './reservation';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  private url = 'http://localhost:5200';
  private reservations$: Subject<Reservation[]> = new Subject();
  
  constructor(private httpClient: HttpClient) { }
  
  private refreshReservations() {
    this.httpClient.get<Reservation[]>(`${this.url}/reservations`)
      .subscribe(reservations => {
        this.reservations$.next(reservations);
      });
  }

  getReservations(): Subject<Reservation[]> {
    this.refreshReservations();
    return this.reservations$;
  }
  
  createReservation(reservation: Reservation): Observable<string> {
    return this.httpClient.post(`${this.url}/reservations`, reservation, { responseType: 'text' });
  }
}