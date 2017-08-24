import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

export const AVAILABLE_CHARACTERS = [
  {
    name: 'Eitan',
    description: 'Speaks Russian',
    // tslint:disable-next-line
    imageUrl: 'https://scontent.ftlv1-1.fna.fbcdn.net/v/t31.0-8/18238543_447257052333221_4423008766681926894_o.jpg?oh=c18dc10cbcc317e366e672f7ac8b8644&oe=5A2CD20E'
  },
  {
    name: 'David',
    description: 'Pashosh is included',
    // tslint:disable-next-line
    imageUrl: 'https://scontent.ftlv1-1.fna.fbcdn.net/v/t31.0-8/856999_10200413794563189_701601511_o.jpg?oh=051480dff94662cec4ffcbfabe29f488&oe=5A352FC1'
  },
  {
    name: 'Tomer',
    description: 'Shit in the pool',
    // tslint:disable-next-line
    imageUrl: 'https://scontent.ftlv1-1.fna.fbcdn.net/v/t1.0-9/10933934_1038125566201555_2751753187717304132_n.jpg?oh=2e19a30638a79407e9dd64f154b26b7d&oe=5A1B029C'
  },
];

@Component({
  selector: 'character-picker',
  templateUrl: './character-picker.component.html',
  styleUrls: ['./character-picker.component.scss']
})
export class CharacterPickerComponent implements OnInit {
  @Input() private selectedCharacter: string = null;
  @Output() select: EventEmitter<any> = new EventEmitter();

  private availableCharacters = AVAILABLE_CHARACTERS;

  constructor() {
  }

  ngOnInit() {
  }

}
