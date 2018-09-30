import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { EventProvider } from "../../providers/event/event";
// import { Calendar } from '@ionic-native/calendar';
// this is the events page, because its easier than renaming it

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  events = [];
  constructor(private eventPro: EventProvider, public navCtrl: NavController) {
    // if(!this.calendar.hasReadPermission()){
    //   this.calendar.requestReadPermission();
    // }
    // this.calendar.findEvent().then((result)=>{
      
    //   eventPro.addEvent("title":result.title(),"dateTime":result.startDate)
    // })
    // this.calendar.findEvent()
    //JK this is a lot harder than i thought it would be
  }
  ionViewDidEnter(){
    console.log("here");
    this.events = this.eventPro.getEvents();
    console.log(this.events);
  }

}
