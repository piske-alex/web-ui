import { Component, OnInit, AfterViewInit } from '@angular/core';
import { UrlParam } from "../../../models/common/UrlParam";

declare let Swiper: any;

@Component({
  selector: 'app-swiper-slide',
  templateUrl: './swiper-slide.component.html',
  styleUrls: ['./swiper-slide.component.scss']
})
export class SwiperSlideComponent implements OnInit, AfterViewInit {
  mySwiper: any;
  
  slides: Array<UrlParam>;

  constructor() { }

  ngOnInit() {

    this.slides = new Array<UrlParam>();
    let urlParam: UrlParam;
    urlParam = new UrlParam();
    urlParam.imageUrl = "./assets/images/1.jpg";
    urlParam.linkUrl = "./adShow";
    this.slides.push(urlParam);

    urlParam = new UrlParam();
    urlParam.imageUrl = "./assets/images/2.jpg";
    urlParam.linkUrl = "./adShow";
    this.slides.push(urlParam);

    urlParam = new UrlParam();
    urlParam.imageUrl = "./assets/images/3.jpg";
    urlParam.linkUrl = "./adShow";
    this.slides.push(urlParam);



    setTimeout(() => {
      this.initSwiper();
    }, 20);
  }

  ngAfterViewInit() {

  }

  initSwiper() {
    this.mySwiper = new Swiper('.swiper-container', {
      slidesPerView: 'auto',
      //freeMode: true,
      observer:true,//修改swiper自己或子元素时，自动初始化swiper
      observeParents:true,//修改swiper的父元素时，自动初始化swiper
      
      autoplay: true,
      autoplayDisableOnInteraction:false,
      speed: 3000,
      //grabCursor: true,// 开启鼠标的抓手状态
      loop: true,
      pagination : '.swiper-pagination',
      paginationClickable :true,

    });
  }

}
