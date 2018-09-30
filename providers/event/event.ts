import { Injectable } from '@angular/core';

/*
  Generated class for the EventProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class EventProvider {
  private events = [];
  constructor() {
  }

  addEvent(event){
    this.events.push(event);
  }
  getEvents(){
    console.log(this.events);
    return this.events;
  }

}
