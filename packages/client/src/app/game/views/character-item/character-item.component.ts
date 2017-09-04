import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'character-item',
  templateUrl: './character-item.component.html',
  styleUrls: ['./character-item.component.scss']
})
export class CharacterItemComponent implements OnInit {
  @Output() click: EventEmitter<any> = new EventEmitter();
  @Input() name: string;
  @Input() team: string;
  @Input() description: string;
  @Input() image: string;
  @Input() selected: boolean;

  constructor() { }

  ngOnInit() {
  }

}
