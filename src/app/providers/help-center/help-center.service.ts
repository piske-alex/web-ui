import { Injectable } from '@angular/core';
import { HelpContent } from "../../models/help/HelpContent";

@Injectable({
  providedIn: 'root'
})
export class HelpCenterService {

  constructor() {
  }


  queryHelpList() {
    return [
      {
        category: {
          name: '快速开始',
        },
        helpList: [
          {
            id: 1,
            title: '费率说明'
          },
        ],
      },

    ];
  }

  queryHelpById(id: string): any {
    return HelpContent.CONTENT[id];
  }

}
