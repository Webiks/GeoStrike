import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { AVAILABLE_CHARACTERS, VIEWER } from "../../../shared/characters.const";
import { DEFAULT_USERNAME } from "../main/main.component";
import { GameService } from "../../services/game.service";

@Component({
  selector: "character-picker",
  templateUrl: "./character-picker.component.html",
  styleUrls: ["./character-picker.component.scss"]
})
export class CharacterPickerComponent implements OnInit {
  @Input() selectedCharacter: string = null;
  @Input() joinGameMode = false;
  @Output() select: EventEmitter<any> = new EventEmitter();
  @Input() username = "Anonymous User";
  @Output() usernameChange = new EventEmitter<string>();
  @Input() gamecode: string;
  @Output() gamecodeChange = new EventEmitter<string>();

  availableCharacters = AVAILABLE_CHARACTERS;
  viewer = VIEWER;

  terrains = [
    { name: "NY City (Urban)", value: "URBAN" },
    { name: "Alps (Nature)", value: "MOUNTAIN" },
    { name: "Australia (Nature)", value: "AUSTRALIA" },
    { name: "NewZealand (Nature)", value: "NEWZEALAND" }
  ];
  selectedTerrain;

  constructor(private gameService: GameService) {}

  ngOnInit() {
    this.selectedTerrain = this.terrains[0];
  }

  clearDefaultValue() {
    if (this.username === DEFAULT_USERNAME) {
      this.username = "";
    }
  }

  validateDefaultValue() {
    if (this.username === "") {
      this.username = DEFAULT_USERNAME;
    }
  }

  onChange(terrain) {
    this.gameService.modifyTerrainEnviorment(terrain.value);
  }
}
