import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../providers/user/user.service';
import { userCollectInfo } from '../../models/user/userCollectInfo';
import { LanguageService } from '../../providers/language/language.service';
import { DialogService } from '../../providers/dialog/dialog.service';


@Component({
  selector: 'gz-collection-info',
  templateUrl: './collection-info.component.html',
  styleUrls: ['./collection-info.component.scss']
})
export class CollectionInfoComponent implements OnInit {

  userId: string;
  collectionInfo: userCollectInfo = new userCollectInfo();
  i18ns: any = {};

  constructor(private location: Location,
    private userService: UserService,
    private router: Router,
    private languageService: LanguageService,
    private dialogService: DialogService) {
  }

  async ngOnInit() {
    const _accessToken = localStorage.getItem('access_token');
    if (!_accessToken) {
      this.router.navigate(['/login']);
      return;
    }
    this.userId = localStorage.getItem('user_id');
    if (!this.userId) {
      this.router.navigate(['/login']);
      return;
    }

    this.collectionInfo = await this.userService.getCollectionInfoByUserId({ userid: this.userId });
    console.log(this.collectionInfo)
  }

  goToDetail(param:string) {
    if(param == "ali"  && this.collectionInfo){
      this.router.navigate(['collectionInfoDetail'],{ queryParams: { settype: param } }); 
    }
    if(param == "wx"  && this.collectionInfo){
      this.router.navigate(['collectionInfoDetail'],{ queryParams: { settype: param } }); 
    }
    if(param == "ebank"  && this.collectionInfo){
      this.router.navigate(['collectionInfoDetail'],{ queryParams: { settype: param } }); 
    }
  }

  goBack() {
    this.router.navigate(['/my']);
  }

}
