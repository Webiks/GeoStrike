import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

export const AVAILABLE_CHARACTERS = [
  {
    name: 'Steve Rogers',
    description: 'Blue Team',
    team: 'BLUE',
    imageUrl: '/assets/characters/soldier_temp.png',
  },
  {
    name: 'Anthony Stark',
    description: 'Blue Team',
    team: 'BLUE',
    imageUrl: '/assets/characters/soldier_temp.png',
  },
  {
    name: 'Peter Parker',
    description: 'Red Team',
    team: 'RED',
    imageUrl: '/assets/characters/soldier_temp.png',
  },
  {
    name: 'Bruce Wayne',
    description: 'Red Team',
    team: 'RED',
    imageUrl: '/assets/characters/soldier_temp.png',
  },
];

export const VIEWER = {
  name: 'viewer',
  team: 'NONE',
};
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
