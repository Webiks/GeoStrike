import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './game/views/main/main.component';
import { GameModule } from './game/game.module';
import { GameRoomComponent } from './game/views/game-room/game-room.component';
import { GameContainerComponent } from './game/views/game-container/game-container.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
  },
  {
    path: 'room/:playerToken',
    component: GameRoomComponent,
  },
  {
    path: 'game/:playerToken',
    component: GameContainerComponent,
  },
  {
    path: '**',
    component: MainComponent,
  },
];

@NgModule({
  imports: [
    GameModule,
    RouterModule.forRoot(routes, {
      enableTracing: false,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
