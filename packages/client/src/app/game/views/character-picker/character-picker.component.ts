import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AVAILABLE_CHARACTERS, VIEWER } from '../../../shared/characters.const';

@Component({
  selector: 'character-picker',
  templateUrl: './character-picker.component.html',
  styleUrls: ['./character-picker.component.scss']
})
export class CharacterPickerComponent implements OnInit {
  @Input() selectedCharacter: string = null;
  @Input() showGameCodePicker = false;
  @Output() select: EventEmitter<any> = new EventEmitter();

  @Input() username = 'Anonymous User';
  @Output() usernameChange = new EventEmitter<string>();

  @Input()
  gamecode: string;
  @Output() gamecodeChange = new EventEmitter<string>();

  availableCharacters = AVAILABLE_CHARACTERS;
  viewer = VIEWER;

  constructor() {
  }

  ngOnInit() {
  }

}
