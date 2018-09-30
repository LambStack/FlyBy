import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';  // im not really sure what this does, but i see it everywhere
import { environment } from '../../enviroment';
@Injectable()
export class  GoogleCloudNaturalLanguageProvider{
  constructor(public http: Http) { }
  analyzeText(content) {
    const body = {
      "document":{
        "type":"PLAIN_TEXT",
        "language": "EN",
        "content":content
      },
      "encodingType":"UTF8"
    }
    return this.http.post('https://language.googleapis.com/v1beta2/documents:analyzeEntities?key=' + environment.api_key, body);
    }
}