import {AfterContentInit, AfterViewInit, Component, Input, NgZone, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {GameService} from '../../services/game.service';
import {AuthorizationMiddleware} from '../../../core/configured-apollo/network/authorization-middleware';
import {CurrentGame, GameFields, PlayerFields, Team} from '../../../types';
import {Subscription} from 'rxjs/Subscription';
import {Subject} from 'rxjs/Subject';
import {AcEntity, AcNotification, ActionType, CesiumService} from 'angular-cesium';
import {Observable} from 'rxjs/Observable';
import {EmptyObservable} from 'rxjs/observable/EmptyObservable';
import {MatSnackBar} from '@angular/material';
import {CharacterService, MeModelState, ViewState} from '../../services/character.service';
import {TakeControlService} from '../../services/take-control.service';
import {SnackBarContentComponent} from '../../../shared/snack-bar-content/snack-bar-content.component';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import * as _ from 'lodash';
import {FlightService} from "../game-map/other-players/flight.service";
import {Player, CharacterData, PlayerLocation, Location} from '../../../types'
import {environment} from '../../../../environments/environment';


export class OtherPlayerEntity extends AcEntity {
}

@Component({
  selector: 'game-container',
  templateUrl: './game-container.component.html',
  styleUrls: ['./game-container.component.scss'],
  providers: [TakeControlService]
})
export class GameContainerComponent implements OnInit, OnDestroy {
  isViewer: boolean;
  otherPlayers$: Subject<AcNotification> = new Subject<AcNotification>();
  allPlayers$: Subject<PlayerFields.Fragment[]> = new Subject<PlayerFields.Fragment[]>();
  gameResult$: Subject<Team> = new Subject();
  gameData$: Observable<GameFields.Fragment>;
  gameNotifications$: Observable<string>;
  me: GameFields.Me;
  gameCode: string;
  viewState: ViewState;
  private game: CurrentGame.CurrentGame;
  private gameDataSubscription: Subscription;
  private gameNotificationsSubscription: Subscription;
  private paramsSubscription: Subscription;

  flights$: Subject<AcNotification> = new Subject<AcNotification>();
  private flightSubscription: Subscription;
  private tempData;
  flightMap$ = new Map<string, any>();
  statusFlights:boolean = false;
  changeView: boolean = false;

  constructor(private gameService: GameService,
              private character: CharacterService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private ngZone: NgZone,
              public controlledService: TakeControlService,
              private snackBar: MatSnackBar,
              private flightService: FlightService,
              ) {
    Cesium.BingMapsApi.defaultKey = 'AmzowhvWedaZu8mSrSHOwx2A52aRoYbkKvs4TeVUu_AzSXMnhvLCLFsqLFBqBS0V';
    // Cesium.BingMapsApi.defaultKey = 'AmzowhvWedaZu8mSrSHOwx2A52aRoYbkKvs4TeVUu_AzSXMnhvLCLFsqLFBqBS0V';
    // Cesium.BingMapsApi.defaultKey = 'AkXEfZI-hKtZ995XgjM0XHxTiXpyS4i2Vb4w08Pjozwn-NAfVIvvHBYaP6Pgi717';
  }

  ngOnInit() {
    this.paramsSubscription = this.activatedRoute.params.subscribe(params => {
      this.ngZone.runOutsideAngular(() => {
        if (!params.playerToken) {
          this.router.navigate(['/']);
          this.paramsSubscription.unsubscribe();
          return;
        }

        this.ngZone.run(() => {
          this.gameCode = params.gameCode;
        });
        AuthorizationMiddleware.setToken(params.playerToken);
        this.gameService.refreshConnection();
        this.gameNotifications$ = (this.gameService.getCurrentGameNotifications()).map(notification => {
          return notification.gameNotifications.message;
        });
        this.gameData$ = (this.gameService.getCurrentGameData())
          .map(({gameData}) => gameData);
        this.gameDataSubscription = this.gameData$.subscribe(currentGame => {
          this.game = currentGame;
          this.me = currentGame.me;
          this.gameResult$.next(currentGame.winingTeam);
          const players = this.game.players.filter(p => p.state !== 'WAITING');

          const allPlayers = [...players];
          if (this.me) {
            this.isViewer = this.me.type === 'OVERVIEW' || this.me['__typename'] === 'Viewer';
            this.character.meFromServer = this.me;
            if (!this.isViewer && this.me.state !== 'CONTROLLED') {
              this.character.syncState(this.me);
              allPlayers.push(this.me);
            }

            if (this.character.initialized) {
              this.setCharacterStateFromServer();
            }
          }

          const controlledPlayer = this.controlledService.controlledPlayer;
          this.allPlayers$.next(allPlayers);
          players
            .filter(p => !controlledPlayer || controlledPlayer.id !== p.id)
            .map<AcNotification>(player => ({
              actionType: ActionType.ADD_UPDATE,
              id: player.id,
              entity: new OtherPlayerEntity({...player, name: player.character.name}),
            })).forEach(notification => {
            this.otherPlayers$.next(notification);
          });
        }, e => {
          console.log('subscription error', e);
          this.router.navigate(['/']);
        }, () => {
          console.log('subscription complete');
        });
      });
      this.character.viewState$.subscribe(viewState => {

        if (viewState === ViewState.OVERVIEW && this.statusFlights) {
          console.log('OVERVIEW. '+ this.statusFlights);
          this.flightService.airTrafficQuery().subscribe();
          this.changeView = true;
        }
        if (viewState === ViewState.SEMI_FPV && this.statusFlights) {
          console.log('SEMI_FPV');
          // this.flightService.airTrafficQuery().subscribe();
          // this.changeView = true;
        }
      });
    });
  }

  private setCharacterStateFromServer() {
    if (!this.isViewer) {
      if (this.me.state === 'DEAD') {
        this.character.state = MeModelState.DEAD;
      } else if (this.me.state === 'CONTROLLED') {
        this.character.state = MeModelState.CONTROLLED;
        this.character.isInsideBuilding = false;
        // from controlled to normal state
      } else if (this.character.state === MeModelState.CONTROLLED && this.me.state === 'ALIVE') {
        this.character.state = MeModelState.WALKING;
        this.character.viewState = ViewState.OVERVIEW;
        this.character.viewState = ViewState.SEMI_FPV;
        this.otherPlayers$.next({
          id: this.me.id,
          actionType: ActionType.DELETE,
        });
      }
      if (this.character.viewState === ViewState.OVERVIEW) {
        this.otherPlayers$.next({
          id: this.me.id,
          actionType: ActionType.ADD_UPDATE,
          entity: this.me,
        });
      }

    } else {
      // if controlling set state from controlled player
      if (this.controlledService.controlledPlayer) {
        const controlledPlayer = this.game.players.find(p => p.id === this.controlledService.controlledPlayer.id);
        if (controlledPlayer && controlledPlayer.state === 'DEAD') {
          this.character.state = MeModelState.DEAD;
        }
      } else {
        this.character.state = MeModelState.WALKING;
      }
    }
  }


  getPlayers(team: Team): Observable<PlayerFields.Fragment[]> {
    return this.allPlayers$.map((players) => players.filter(p => p.team === team)).distinctUntilChanged((a, b) => _.isEqual(a, b));
  }

  setPlayers(flight: PlayerFields.Fragment) {
    this.allPlayers$.next()
  }

  gameStarted() {
    this.gameService.toggleFlightMode(this.me.id, false).subscribe(() => {
    });
    this.gameNotificationsSubscription = this.gameNotifications$
      .subscribe(notification => {
        this.ngZone.run(() => {
          this.snackBar.openFromComponent(SnackBarContentComponent, {
            data: notification,
            duration: 5000,
          });
        });
      });
  }

  degreesToCartesian(location) {
    return new Cesium.Cartesian3.fromDegrees(location.x, location.y, location.z);
  }

  nextLocation(id) {
    // currentLocation,velocity, heading
    const plane = this.flightMap$.get(id);
    // console.log(plane.currentLocation.location)

    /*For simulation*/
    // let newLocation = this.destinationPoint(plane.currentLocation.location.y, plane.currentLocation.location.x,200,300)
    let newLocation = this.destinationPoint(plane.currentLocation.location.y, plane.currentLocation.location.x, plane.currentLocation.distance, plane.currentLocation.heading);


    // console.log(newLocation);
    const newPosition = {
      ...plane,
      currentLocation: {
        ...plane.currentLocation,
        location: {
          ...plane.currentLocation.location,
          x: Number(newLocation.nextLon),
          y: Number(newLocation.nextLat),
        }
      }
    };
    // console.log(newPosition);

    const acMap = {
      id: id,
      actionType: ActionType.ADD_UPDATE,
      entity: new AcEntity(newPosition),
    };
    this.flights$.next(acMap);
  }

  destinationPoint(lat, lon, distance, bearing) {
    let R = 6371e3; // (Mean) radius of earth
    // console.log(`locationData: ${lat}, ${lon}, ${distance}, ${bearing}`)
    const lat2 = Math.asin(Math.sin(Math.PI / 180 * lat) * Math.cos(distance / R) + Math.cos(Math.PI / 180 * lat) * Math.sin(distance / R) * Math.cos(Math.PI / 180 * bearing));
    const lon2 = Math.PI / 180 * lon + Math.atan2(Math.sin(Math.PI / 180 * bearing) * Math.sin(distance / R) * Math.cos(Math.PI / 180 * lat), Math.cos(distance / R) - Math.sin(Math.PI / 180 * lat) * Math.sin(lat2));

    return {'nextLat': (180 / Math.PI * lat2).toFixed(5), 'nextLon': (180 / Math.PI * lon2).toFixed(5)};
  }

  flightStatus(newStatus: any): void {
    this.statusFlights = newStatus;
    if (this.statusFlights) {
      console.log("air traffic on");
      this.airTraffic();
    }
    if (!this.statusFlights) {
      console.log("air traffic off");

      this.flightMap$.forEach(f => {
         this.flights$.next({
         id: f.id,
         entity: new AcEntity(),
         actionType: ActionType.DELETE
        })
      });
      // this.flights$.forEach(x=>{
      //   console.log(x);
      // });
      this.flightSubscription.unsubscribe();
      this.flightMap$.clear();
      delete this.tempData;

    }
  }

  airTraffic() {

    this.ngZone.runOutsideAngular(() => {

      this.flightService.airTrafficQuery().subscribe();
      this.flightSubscription = this.flightService.subscribeAirTraffic()
        .subscribe((data) => {
          console.log("sub");
          if(this.tempData){
            const checkDeduplicateData = JSON.stringify(this.tempData).localeCompare(JSON.stringify(data));
            if (checkDeduplicateData){
              // createFlight();
              console.log("createFlight");
              this.tempData = {...data};
              // console.log(this.tempData);

              if (this.tempData.messageAdded.length === 0) {
                console.error("The air traffic data received empty");
                this.flightService.airTrafficQuery().subscribe();
              }
              this.tempData.messageAdded.forEach(flight => {
                // console.log(flight)

                const flightId = flight.icao24;
                let character: CharacterData = {
                  name: 'plane',
                  model: '/assets/models/planes/plane.gltf',
                  scale: 1,
                  team: null,
                  imageUrl: null,
                  description: null,
                  portraitUrl: null,
                  iconUrl: '/assets/icons/plane-mark2-big.png',
                  iconDeadUrl: '/assets/icons/plane-mark-dead.png',
                  fixedHeight: null,
                };
                let location = {
                  x: Number(flight.longitude),
                  y: Number(flight.latitude),
                  z: Number(flight.geo_altitude)
                };
                let mapping: any = {
                  id: flightId,
                  username: null,
                  character: character,
                  state: 'ALIVE',
                  lifeState: 'FULL',
                  lifeStatePerctange: 100,
                  isCrawling: false,
                  isFlying: false,
                  isShooting: false,
                  isMe: false,
                  flight: null,
                  currentLocation: {
                    location: location,
                    heading: Number(flight.heading),
                    velocity: Number(flight.velocity),
                    distance: Number(flight.velocity * (environment.config.updateFlightIntervalSec))
                  },
                  team: 'NONE',
                  syncState: 'VALID',
                  type: 'BACKGROUND_CHARACTER',
                };
                const acMap = {
                  id: flightId,
                  actionType: ActionType.ADD_UPDATE,
                  entity: new AcEntity(mapping),
                };

                if (!this.flightMap$.get(flightId)) {
                  this.flights$.next(acMap);

                }

                this.flightMap$.set(flightId, mapping);
              });
              this.flightMap$.forEach(flight => {
                this.nextLocation(flight.id);
              })
            }
            else{
              console.log("same Data !!!!!");
                if(this.changeView){
                  console.log("so what ?!?");
                  this.tempData.messageAdded.forEach(flight => {
                   let remainTime = Number ((new Date().getTime()/1000-flight.time).toFixed(0));
                    console.log(`remainTime--- ${remainTime}`);
                    const flightId = flight.icao24;

                    let character: CharacterData = {
                      name: 'plane',
                      model: '/assets/models/planes/plane.gltf',
                      scale: 1,
                      team: null,
                      imageUrl: null,
                      description: null,
                      portraitUrl: null,
                      iconUrl: '/assets/icons/plane-mark2-big.png',
                      iconDeadUrl: '/assets/icons/plane-mark-dead.png',
                      fixedHeight: null,
                    };
                    let location = {
                      x: Number(flight.longitude),
                      y: Number(flight.latitude),
                      z: Number(flight.geo_altitude)
                    };
                    let mapping: any = {
                      id: flightId,
                      username: null,
                      character: character,
                      state: 'ALIVE',
                      lifeState: 'FULL',
                      lifeStatePerctange: 100,
                      isCrawling: false,
                      isFlying: false,
                      isShooting: false,
                      isMe: false,
                      flight: null,
                      currentLocation: {
                        location: location,
                        heading: Number(flight.heading),
                        velocity: Number(flight.velocity),
                        distance: Number(flight.velocity * (environment.config.updateFlightIntervalSec-(remainTime)))
                      },
                      team: 'NONE',
                      syncState: 'VALID',
                      type: 'BACKGROUND_CHARACTER',
                    };
                    const acMap = {
                      id: flightId,
                      actionType: ActionType.ADD_UPDATE,
                      entity: new AcEntity(mapping),
                    };

                    if (!this.flightMap$.get(flightId)) {
                      this.flights$.next(acMap);

                    }

                    this.flightMap$.set(flightId, mapping);
                  });
                  this.flightMap$.forEach(flight => {
                    this.nextLocation(flight.id);
                  })
                  this.changeView = false;
                };

            }

          }else{
            // createFlight();
            this.tempData = {...data};
            console.log("first time");

            if (this.tempData.messageAdded.length === 0) {
              console.error("The air traffic data received empty");
            }
            this.tempData.messageAdded.forEach(flight => {

              const flightId = flight.icao24;
              let remainTime = Number ((new Date().getTime()/1000-flight.time).toFixed(0));
              // console.log(`remainTime---${remainTime}`);
              let character: CharacterData = {
                name: 'plane',
                model: '/assets/models/planes/plane.gltf',
                scale: 1,
                team: null,
                imageUrl: null,
                description: null,
                portraitUrl: null,
                iconUrl: '/assets/icons/plane-mark2-big.png',
                iconDeadUrl: '/assets/icons/plane-mark-dead.png',
                fixedHeight: null,
              };
              let location = {
                x: Number(flight.longitude),
                y: Number(flight.latitude),
                z: Number(flight.geo_altitude)
              };
              let mapping: any = {
                id: flightId,
                username: null,
                character: character,
                state: 'ALIVE',
                lifeState: 'FULL',
                lifeStatePerctange: 100,
                isCrawling: false,
                isFlying: false,
                isShooting: false,
                isMe: false,
                flight: null,
                currentLocation: {
                  location: location,
                  heading: Number(flight.heading),
                  velocity: Number(flight.velocity),
                  distance: Number(flight.velocity * (environment.config.updateFlightIntervalSec-(remainTime)))

            },
                team: 'NONE',
                syncState: 'VALID',
                type: 'BACKGROUND_CHARACTER',
                remainTime: remainTime+1

              };
              const acMap = {
                id: flightId,
                actionType: ActionType.ADD_UPDATE,
                entity: new AcEntity(mapping),
              };

              if (!this.flightMap$.get(flightId)) {
                this.flights$.next(acMap);

              }

              this.flightMap$.set(flightId, mapping);
            });
            this.flightMap$.forEach(flight => {
              this.nextLocation(flight.id);
            })
          }
        });

    });
  }

  ngOnDestroy() {
    if (this.gameDataSubscription) {
      this.gameDataSubscription.unsubscribe();
    }

    if (this.gameNotificationsSubscription) {
      this.gameNotificationsSubscription.unsubscribe();
    }

    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
    if (this.flightSubscription) {
      this.flightSubscription.unsubscribe()
    }
  }
}
