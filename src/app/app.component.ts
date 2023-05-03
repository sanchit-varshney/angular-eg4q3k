import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Seat {
  id: number;
  isBooked: boolean;
}

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  rows = [
    { rowNumber: 1, seats: [] },
    { rowNumber: 2, seats: [] },
    { rowNumber: 3, seats: [] },
    { rowNumber: 4, seats: [] },
    { rowNumber: 5, seats: [] },
    { rowNumber: 6, seats: [] },
    { rowNumber: 7, seats: [] },
    { rowNumber: 8, seats: [] },
    { rowNumber: 9, seats: [] },
    { rowNumber: 10, seats: [] },
  ];
  numSeats: number;
  bookedSeats: number[] = [];

  constructor(private http: HttpClient) {
    this.http.get('/api/seats').subscribe((seats: Seat[]) => {
      seats.forEach((seat) => {
        this.rows[seat.id % 7].seats.push(seat);
      });
    });
  }

  bookSeat(seat: Seat ) {
    if (!seat.isBooked) {
      seat.isBooked = true;
      this.bookedSeats.push(seat.id);
    }
  }

  bookSeats() {
    this.http.post('/api/book-seats', { numSeats: this.numSeats }).subscribe((seatNumbers: number[]) => {
      seatNumbers.forEach((seatNumber) => {
        const seat = this.getSeatByNumber(seatNumber);
        if (seat) {
          seat.isBooked = true;
        }
      });
      this.bookedSeats = seatNumbers;
    });
  }

  getSeatByNumber(seatNumber: number): Seat | undefined {
    for (const row of this.rows) {
      const seat = row.seats.find((
        (seat) => seat.id === seatNumber)
        );
        if (seat) {
          return seat;
        }
      }
      return undefined;
    }
  }