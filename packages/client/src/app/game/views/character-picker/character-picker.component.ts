import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AVAILABLE_CHARACTERS, VIEWER } from '../../../shared/characters.const';

@Component({
  selector: 'character-picker',
  templateUrl: './character-picker.component.html',
  styleUrls: ['./character-picker.component.scss']
})
export class CharacterPickerComponent implements OnInit {
  @Input() private selectedCharacter: string = null;
  @Output() select: EventEmitter<any> = new EventEmitter();

  private availableCharacters = AVAILABLE_CHARACTERS;
  private viewer = VIEWER;

  constructor() {
  }

  ngOnInit() {
  }

}
