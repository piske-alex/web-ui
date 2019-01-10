import { Component, OnInit, Input } from '@angular/core';
import { LoadingService } from '../../providers/loading/loading.service';

@Component({
  selector: 'gz-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {
  @Input()
  public showLoading: boolean = false;//是否显示loading

  constructor(private loadingService:LoadingService) { }

  ngOnInit() {
    this.loadingService.getLoding().subscribe(loading => {
      this.showLoading = loading;
    });
  }

}
