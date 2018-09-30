import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

// this is the settings page, because its easier than renaming it

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  constructor(public navCtrl: NavController) {

  }

}
