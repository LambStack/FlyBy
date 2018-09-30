import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Camera, CameraOptions } from '@ionic-native/camera';
import { GoogleCloudVisionServiceProvider } from "../../providers/google-cloud-vision-service/google-cloud-vision-service";
import { GoogleCloudNaturalLanguageProvider } from "../../providers/google-cloud-natural-language/google-cloud-natural-language";
import { Calendar } from '@ionic-native/calendar';
import { EventProvider } from "../../providers/event/event";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  options: CameraOptions = {
  quality: 100,
  destinationType: this.camera.DestinationType.DATA_URL,
  encodingType: this.camera.EncodingType.JPEG,
  mediaType: this.camera.MediaType.PICTURE
}
bgImage;
buttonName: string = "take a picture";

  constructor( private eventPro: EventProvider, private calendar: Calendar, private languageService: GoogleCloudNaturalLanguageProvider, private vision: GoogleCloudVisionServiceProvider, private camera: Camera, public navCtrl: NavController) { 
    if(!this.calendar.hasWritePermission()){
        this.calendar.requestWritePermission();
      }
  }
  ionViewDidEnter(){
    
  }
  analyzeText(text){
    this.languageService.analyzeText(text)
    .subscribe((result)=>{
      let entities = result.json().entities;

      // find the location, the largest salience (hell yeah, its sorted by salience), and any other useful stuff
      // helpful types will be: location, organization, event, largest salience
      // assume defaults for each entry
     let event = entities[0]; // assume the event is the most salient word
      let location = {name:"here"}; // later upgrade to using geolocation
      let time = null; // im not sure how time is stored in calendar yet
      let organization = undefined;
      let notes = text; // notes will be all of the text from the flyer
      //loop backwards through the entities, so the most salient of each type is whats placed in each
      for(let i = entities.length-1; i>=0;i--){
        if(entities[i].type == "LOCATION"){
          location = entities[i];
        }
        else if(entities[i].type == "ORGANIZATION"){
          organization = entities[i];
        }
        else if(entities[i].type == "EVENT"){
          event = entities[i];
        }else{
          // its probably worthless, but we can maybe use it for a different query
        }
      }
      // try to find other things with regex
      // regex to match time
      time = text.match("[0-9]:[0-9][0-9]-.|[0-9]:[0-9][0-9][aApP][mM]");
      
      if(time == null){
        time = text.match("[0-9]-.|[0-9][aApP][mM]");
      }
      if(time == null){
        time = ["now"];
      }

      // more complicated regex to match date
      console.log("Event: ");console.log(event);
      console.log("location: ");console.log(location);
      console.log("time: " +time[0]);
      console.log("organization: ");console.log(organization);
      console.log("notes: " +notes);

      // add these to the calendar
      if(this.calendar.hasWritePermission()){
        let rightNow:Date = new Date();
        let amPm = time[0].charAt(time[0].length-2);
      //  alert(time[0]);
       // alert(time[0].split(':'[0]));
        let numericalTime = parseInt(time[0].split(':')[0]);
        let colIndex = time[0].indexOf(':');
        let min = 0;
        if(colIndex > -1){
           min = parseInt(time[0].substring(colIndex+1, time[0].length-2));
       //    alert(time[0].substring(colIndex+1, time[0].length-2));
        }
        if(amPm != 'a' || amPm != 'A'){
          numericalTime += 12;
        }
      //  alert(time[0].split(':')[0]);
        rightNow.setHours(numericalTime);
    //    alert(numericalTime);
        rightNow.setMinutes(min);
     //   alert(min);
     //   alert(rightNow.toISOString());
      let title = (organization==undefined?event.name:organization.name + ": " + event.name);
        this.calendar.createEventInteractively(title,location.name,notes, rightNow);

          this.eventPro.addEvent({"title":title, 
                                  "dateTime":rightNow});
      }
   }), err=>{
      alert(err); 
      console.log(err);
    };
  }
  takeAPic(){
    this.camera.getPicture(this.options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64

      // im going to pretend this works and keep moving forward
      
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.bgImage = base64Image;

      this.vision.getText(imageData).subscribe((result)=>{
        // do something with the result
        let response = result.json().responses[0];
        
        let textAnnotations = response.textAnnotations;

        // make a call with the entire document
        let docString = textAnnotations[0].description;
        docString.replace("\n", " ");

        // MAKE CALL HERE
        this.analyzeText(docString);
       
      }, err=>{
        alert(err);
      });
        }, (err) => {
          // Handle error
          alert(err);
          this.buttonName = "Error";
        });
    }
}
