import { Component, Input, Output, OnInit, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnChanges {

  @Input() jewelleryObjectInput?: Array<any>;
  @Output() imageObjectEmitter: EventEmitter<any> = new EventEmitter();
  chosenImage: any;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.jewelleryObjectInput) {
      this.chosenImage = this.jewelleryObjectInput[0];
      this.reload();
    }
  }

  ngOnInit(): void {}

  reload() {
    this.imageObjectEmitter.emit(this.chosenImage);
  }

}
