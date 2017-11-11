import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AVAILABLE_CHARACTERS, VIEWER } from '../../../shared/characters.const';
import { DEFAULT_USERNAME } from '../main/main.component';

@Component({
  selector: 'character-picker',
  templateUrl: './character-picker.component.html',
  styleUrls: ['./character-picker.component.scss']
})
export class CharacterPickerComponent implements OnInit {
  @Input() selectedCharacter: string = null;
  @Input() joinGameMode = false;
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

  clearDefaultValue(){
    if ( this.username === DEFAULT_USERNAME) {
      this.username = '';
    }
  }

  validateDefaultValue(){
    if ( this.username === '') {
      this.username = DEFAULT_USERNAME;
    }
  }

}
