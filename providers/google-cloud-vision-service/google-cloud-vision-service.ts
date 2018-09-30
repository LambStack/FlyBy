import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';  // im not really sure what this does, but i see it everywhere
import { environment } from '../../enviroment';
@Injectable()
export class GoogleCloudVisionServiceProvider {
  constructor(public http: Http) { }
  getText(base64Image) {
    const body = {
      "requests": [
        {
          "image": {
            "content": base64Image
          },
          "features": [
            {
              "type": "TEXT_DETECTION"
            }
          ]
        }
      ]
    }
    return this.http.post('https://vision.googleapis.com/v1/images:annotate?key=' + environment.api_key, body);
    }
}