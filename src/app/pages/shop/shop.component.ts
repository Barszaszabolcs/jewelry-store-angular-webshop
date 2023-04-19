import { Component, OnInit } from '@angular/core';
import { ShopService } from '../../shared/services/shop.service';
import { Image } from '../../shared/models/Image';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit{

  jewelleryObject?: Array<Image>;
  chosenImage?: Image;

  constructor(private shopService: ShopService) {}

  ngOnInit(): void {
    this.shopService.loadImageMeta('__credits.json').subscribe((data: Array<Image>) => {
      this.jewelleryObject = data;
    })
  }

  loadImage(imageObject: Image) {
    this.chosenImage = imageObject;
  }
}
