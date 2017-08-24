import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './game/main/main.component';
import { GameModule } from './game/game.module';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
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
