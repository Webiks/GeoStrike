import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'character-item',
  templateUrl: './character-item.component.html',
  styleUrls: ['./character-item.component.scss']
})
export class CharacterItemComponent implements OnInit {
  @Output() onClick: EventEmitter<any> = new EventEmitter();
  @Input() name: string;
  @Input() team: string;
  @Input() description: string;
  @Input() image: string;
  @Input() selected: boolean;
  @Input() disabled = false;

  constructor() { }

  ngOnInit() {
  }

  onItemClick(){
    if (!this.disabled){
      this.onClick.emit({name: this.name, team: this.team})
    }
  }

}
