import { Component, OnInit, AfterViewInit } from '@angular/core';
import { UrlParam } from '../../../models/common/UrlParam';
import { CommonService } from '../../../providers/common/common.service';
import { EnvironmentConstant } from '../../../../environments/environment';

declare let Swiper: any;

@Component({
  selector: 'app-swiper-slide',
  templateUrl: './swiper-slide.component.html',
  styleUrls: ['./swiper-slide.component.scss']
})
export class SwiperSlideComponent implements OnInit, AfterViewInit {
  mySwiper: any;
  slides: Array<UrlParam>;

  banners: any = [];

  constructor(private commonService: CommonService) { }

  async ngOnInit() {

     this.slides = new Array<UrlParam>();
    // let urlParam: UrlParam;
    // urlParam = new UrlParam();
    // urlParam.imageUrl = "./assets/images/1.jpg";
    // urlParam.linkUrl = "88";
    // this.slides.push(urlParam);

    // urlParam = new UrlParam();
    // urlParam.imageUrl = "./assets/images/2.jpg";
    // urlParam.linkUrl = "88";
    // this.slides.push(urlParam);

    // urlParam = new UrlParam();
    // urlParam.imageUrl = "./assets/images/3.jpg";
    // urlParam.linkUrl = "88";
    // this.slides.push(urlParam);

    try {
      const sUserAgent = navigator.userAgent;
      const mobileAgents = ['Android', 'iPhone', 'Symbian', 'WindowsPhone', 'iPod', 'BlackBerry', 'Windows CE'];
      let isMobile = 0;
      let file_type = 'pc';
      for ( let i = 0; i < mobileAgents.length; i++) {
          if (sUserAgent.indexOf(mobileAgents[i]) > -1) {
            isMobile = 1;
            file_type = 'phone';
              break;
          }
      }

      if ( file_type == 'pc') {
        this.banners = await this.commonService.getBannerList({ type: file_type });
        console.log('banners', this.banners);
       (this.banners || []).forEach(_data => {
           let urlParam: UrlParam;
           urlParam = new UrlParam();
           if (_data.filename_desktop ) {
            urlParam.imageUrl = EnvironmentConstant.MINIO_URL_V1 + '/banner/' + _data.filename_desktop ;
           } else if (_data.filename_mobile ) {
            urlParam.imageUrl = EnvironmentConstant.MINIO_URL_V1 + '/banner/' + _data.filename_desktop ;
           }
           urlParam.linkUrl = _data.id;
           this.slides.push(urlParam);
       });
      } else {
        this.banners = await this.commonService.getBannerList({ type: file_type });
        console.log('banners', this.banners);
        (this.banners || []).forEach(_data => {
            let urlParam: UrlParam;
            urlParam = new UrlParam();
            if (_data.filename_mobile ) {
              urlParam.imageUrl = EnvironmentConstant.MINIO_URL_V1 + '/banner/' + _data.filename_mobile ;
             } else if (_data.filename_desktop ) {
              urlParam.imageUrl = EnvironmentConstant.MINIO_URL_V1 + '/banner/' + _data.filename_desktop ;
             }
            urlParam.linkUrl = _data.id;
            this.slides.push(urlParam);
        });
      }
      
    } catch (e) {
      console.error(e);
    }

    setTimeout(() => {
      this.initSwiper();
    }, 20);
  }

  ngAfterViewInit() {

  }

  initSwiper() {
    this.mySwiper = new Swiper('.adSwiperHeader', {
      //slidesPerView: 'auto',
      freeMode: true,
      observer:true,//修改swiper自己或子元素时，自动初始化swiper
      observeParents:true,//修改swiper的父元素时，自动初始化swiper
      
      autoplay: true,
      autoplayDisableOnInteraction:false,
      speed: 3000,
      //grabCursor: true,// 开启鼠标的抓手状态
      loop: true,
      pagination : '.adSwiperHeaderPagination',
      paginationClickable :true,

    });
  }

}
