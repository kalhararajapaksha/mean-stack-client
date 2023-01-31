import { Component, Renderer2, ElementRef, AfterViewInit, HostListener,ViewChild  } from '@angular/core';
import { TestService } from '../test.service';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Reservation } from '../reservation';
import { ReservationService } from '../reservation.service';

@Component({
  selector: 'app-square',
  templateUrl: './seat-order.component.html',
  styleUrls: ['square.component.css']
})
export class SquareComponent implements AfterViewInit{
  nameControl = new FormControl('');
  items =Array.from(Array(10).keys());
  //<div class="square" *ngFor="let square of squares"></div>
  // You can use properties and methods here to keep track of the state of the square
   private clientID="";
   private GameID="";
   private playerColor="";
   private game=null;
   backgroundColor: string = 'white';

   seats:number=0;
   trainID:any='';
   trainPrice:any='';
   trainTime:any='';
   trainName:any='';

   selectedSeat: string[] = [];

    index?: number;

    @ViewChild('trainNameRef') trainNameElement?: ElementRef;
    @ViewChild('trainTimeID') trainTimeElement?: ElementRef;
    @ViewChild('price') priceElement?: ElementRef;
    

   constructor(private wsService: TestService,private renderer: Renderer2, private el: ElementRef,private router: Router,
    private route: ActivatedRoute,private reservationService: ReservationService) {
    this.items=Array.from(Array(0).keys());
    this.wsService.receive().subscribe(message => {
      if(message.method=="connect"){

        this.clientID=message.clientId;

        const id = this.route.snapshot.paramMap.get('id');
        this.trainID=id;
        if (!id) {
          alert('No id provided');
        }
        else{ 
          this.GameID=id;
          this.join(id);}
      };

      if(message.method=="join"){
        this.GameID=message.game.id;
        this.game=message.game.clients;
        console.log("You joined Successfully");
        message.game.clients.forEach((num: any) => {

          if(num.clientId==this.clientID){
            this.items =Array.from(Array(message.game.balls).keys());
            this.onLoad();
          }
        });

      };
      if(message.method=="update"){

        console.log("Game state updated");
        if (!message.game.state) return;
          Object.entries(message.game.state).forEach(([key, value]) => {

          if(key!=''){
          this.changeColor(key,value);
        }
        });


      };
    });

    
  }

  ngAfterViewInit() {

    this.trainPrice=this.route.snapshot.paramMap.get('price');
    this.trainTime=this.route.snapshot.paramMap.get('time');
    this.trainName=this.route.snapshot.paramMap.get('trainName');
    console.log('View has been initialized');
 
  }


  join(id:any) {

    const payLoad = {
      method: 'join',
      clientId: this.clientID,
      gameId:id,
    };
    this.wsService.send(payLoad);
    console.log("send join request ")
  }

  onLoad(){
    const payLoad = {
      method: 'play',
      clientId: this.clientID,
      gameId:this.GameID,
      ballId:'',
      color:this.playerColor
    };
    this.wsService.send(payLoad);
  }

  clickOnSeat(data: any) {
   
    console.log("id is "+data)
    this.index=this.selectedSeat.indexOf(data);
    if (this.index !== -1) {
      this.selectedSeat.splice(this.index, 1);
      this.playerColor="white"
      this.seats=this.seats-1
    }else{
      this.selectedSeat.push(data);
      this.playerColor="red"
      this.seats=this.seats+1
    }
    console.log(this.selectedSeat);
    const payLoad = {
    method: 'play',
    clientId: this.clientID,
    gameId:this.GameID,
    ballId:data,
    color:this.playerColor
    };
    this.wsService.send(payLoad);
  }

  changeColor(i: any,color: any) {

    const div = document.getElementById(i);
    this.renderer.setStyle(div, 'background-color', color);
   
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    const confirmationMessage = "Are you sure you want to leave this page? Your changes will not be saved.";
    $event.returnValue = confirmationMessage;
    if(confirm(confirmationMessage)){
        // Perform action for leave condition
       // this.wsService.send({ method: 'leave', clientId: this.clientID, gameId:this.GameID });
    }
  }


  saveticket(){
    if(this.trainNameElement && this.trainTimeElement && this.priceElement && this.selectedSeat){
    const trainName = this.trainNameElement.nativeElement.textContent;
    const trainTimeID = this.trainTimeElement.nativeElement.textContent;
    const price = this.priceElement.nativeElement.textContent;
    console.log(trainName);

    const reservation: Reservation = {};
    reservation.seats = this.selectedSeat;
    reservation.date = "2023-02-01";
    reservation.trainTime = trainTimeID;
    reservation.trainID = trainName;
    reservation.total = price;

    console.log(reservation);
    this.newReservation(reservation)

    }
  }

  newReservation(reservation: Reservation) {
    this.reservationService.createReservation(reservation)
      .subscribe({
        next: () => {
          this.router.navigate(['/home']);
        },
        error: (error) => {
          alert("Failed to Make a Reservation");
          console.error(error);
        }
      });
  }
  


}
