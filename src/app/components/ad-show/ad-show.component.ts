import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { CommonService } from '../../providers/common/common.service';

@Component({
  selector: 'app-ad-show',
  templateUrl: './ad-show.component.html',
  styleUrls: ['./ad-show.component.scss']
})
export class AdShowComponent implements OnInit {

  bannerId: string;
  banner: any;
  bannerDescription: string;

  constructor(private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private commonService: CommonService) { }

  async ngOnInit() {
    try {

      this.route.queryParams.subscribe(params => {
         this.bannerId  = params.id;
         console.log('id', this.bannerId);
     });

     this.banner = await this.commonService.getBannerInfo({ id: this.bannerId });
        console.log('banners', this.banner);

        this.bannerDescription = this.banner.description;
    } catch (e) {
      console.error(e);
    }
  }

  goBack() {
    this.location.back();
  }
}
