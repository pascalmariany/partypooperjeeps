import Phaser from 'phaser';
import { WORLD_CONFIG } from '../game/config';
import { ControlsManager } from '../game/controls/ControlsManager';
import { RetroUI } from '../game/ui/RetroUI';
import { CameraManager } from '../game/camera/CameraManager';
import { VEHICLES } from '../game/constants';
import { GameRules } from '../game/rules/GameRules';
import { Vehicle } from '../game/types';
import { PLAYER1_KEYS } from '../game/controls/KeyBindings';
import { JeepGraphics } from '../game/graphics/JeepGraphics';
import { BaseGraphics } from '../game/graphics/BaseGraphics';
import { BackgroundGraphics } from '../game/graphics/BackgroundGraphics';
import { ChristmasTree } from '../game/entities/ChristmasTree';
import { CollectibleSystem } from '../game/systems/CollectibleSystem';
import { FuelStationSystem } from '../game/systems/FuelStationSystem';
import { PlayerSetup } from '../game/systems/PlayerSetup';
import { QuitMenu } from '../game/ui/QuitMenu';
import { CollisionSystem } from '../game/systems/CollisionSystem';
import { InputSystem } from '../game/systems/InputSystem';
import { GameUpdateSystem } from '../game/systems/GameUpdateSystem';
import { AudioManager } from '../game/audio/AudioManager';
import { BuildingSystem } from '../game/systems/BuildingSystem';
import { WaterSystem } from '../game/systems/WaterSystem';
import { CountdownUI } from '../game/ui/CountdownUI';

interface GameSceneData {
  mode: 'single' | 'multi';
  player1Name: string;
  player2Name: string;
}

export class GameScene extends Phaser.Scene {
  private player1?: Vehicle;
  private player2?: Vehicle;
  private controlsManager?: ControlsManager;
  private retroUI?: RetroUI;
  private cameraManager?: CameraManager;
  private quitMenu?: QuitMenu;
  private audioManager?: AudioManager;
  private gameMode: 'single' | 'multi' = 'single';
  private player1Name: string = '';
  private player2Name: string = '';
  private fuelStations: any[] = [];
  private trees: ChristmasTree[] = [];
  private presents: any[] = [];
  private speedBoosts: any[] = [];
  private buildings: Phaser.GameObjects.Container[] = [];
  private waterPools: Phaser.GameObjects.Container[] = [];
  private isGameStarted: boolean = false;

  constructor() {
    super({ key: 'GameScene' });
  }

  init(data: GameSceneData) {
    this.gameMode = data.mode;
    this.player1Name = data.player1Name;
    this.player2Name = data.player2Name;
    this.isGameStarted = false;
    
    // Reset all arrays
    this.fuelStations = [];
    this.trees = [];
    this.presents = [];
    this.speedBoosts = [];
    this.buildings = [];
    this.waterPools = [];
  }

  create() {
    // Set world bounds first
    this.physics.world.setBounds(0, 0, WORLD_CONFIG.WORLD_WIDTH, WORLD_CONFIG.WORLD_HEIGHT);

    // Create background first
    BackgroundGraphics.create(this);

    // Create buildings and water pools
    this.buildings = BuildingSystem.createBuildings(this);
    this.waterPools = WaterSystem.createWaterPools(this);

    // Initialize managers
    this.controlsManager = new ControlsManager(this);
    this.retroUI = new RetroUI(this);
    this.cameraManager = new CameraManager(this);
    this.quitMenu = QuitMenu.getInstance(this);
    this.audioManager = new AudioManager(this);

    // Initialize player 1
    this.player1 = { ...VEHICLES.PLAYER1 };
    GameRules.initializeTankStats(this.player1);
    
    // Create player 1's base and vehicle
    BaseGraphics.create(this, 100, WORLD_CONFIG.WORLD_HEIGHT / 2, this.player1.color);
    this.player1.sprite = JeepGraphics.create(this, this.player1);
    this.player1.sprite.setPosition(100, WORLD_CONFIG.WORLD_HEIGHT / 2);

    // Setup player 1 controls
    this.controlsManager.setupTankControls(this.player1, PLAYER1_KEYS);

    // Create Christmas tree for player 1
    this.trees.push(new ChristmasTree(this, 100, WORLD_CONFIG.WORLD_HEIGHT / 2, this.player1.id));

    // Setup appropriate game mode
    if (this.gameMode === 'single') {
      this.player2 = PlayerSetup.setupSinglePlayer(this, {
        player1: this.player1,
        controlsManager: this.controlsManager,
        cameraManager: this.cameraManager,
        trees: this.trees
      });
    } else {
      this.player2 = PlayerSetup.setupMultiPlayer(this, {
        player1: this.player1,
        controlsManager: this.controlsManager,
        cameraManager: this.cameraManager,
        trees: this.trees
      });
    }

    // Setup RetroUI
    if (this.retroUI) {
      this.retroUI.setGameMode(this.gameMode);
      this.retroUI.setPlayerNames(this.player1Name, this.player2Name);
      this.retroUI.setVehicles([this.player1, this.player2].filter((v): v is Vehicle => !!v));
    }

    // Create game objects
    this.fuelStations = FuelStationSystem.createStations(this);
    const collectibles = CollectibleSystem.createCollectibles(this);
    this.presents = collectibles.presents;
    this.speedBoosts = collectibles.speedBoosts;

    // Setup collisions
    CollisionSystem.setupCollisions({
      scene: this,
      vehicles: [this.player1, this.player2].filter((v): v is Vehicle => !!v),
      presents: this.presents,
      speedBoosts: this.speedBoosts,
      trees: this.trees,
      fuelStations: this.fuelStations,
      buildings: this.buildings,
      waterPools: this.waterPools
    });

    // Setup input controls
    InputSystem.setupControls({
      scene: this,
      player1: this.player1,
      player2: this.player2,
      gameMode: this.gameMode
    });

    // Initialize audio
    this.audioManager?.initializeAudio();

    // Start countdown before game begins
    this.physics.pause();
    const countdown = new CountdownUI(this, () => {
      this.physics.resume();
      this.isGameStarted = true;
    });
    countdown.startCountdown();
  }

  update() {
    if (!this.isGameStarted || !this.controlsManager || !this.player1 || !this.retroUI) return;

    // Update game state
    GameUpdateSystem.update({
      scene: this,
      controlsManager: this.controlsManager,
      player1: this.player1,
      player2: this.player2,
      retroUI: this.retroUI,
      gameMode: this.gameMode,
      player1Name: this.player1Name,
      player2Name: this.player2Name
    }).then(gameEnd => {
      // If game has ended, transition to end scene
      if (gameEnd) {
        this.audioManager?.stopBackgroundMusic();
        this.scene.start('EndScene', {
          ...gameEnd.data,
          gameMode: this.gameMode
        });
      }
    });
  }

  shutdown() {
    // Clean up the quit menu
    this.quitMenu?.destroy();
    
    // Clean up the AI system
    GameUpdateSystem.cleanup();
    
    // Clean up all keyboard listeners
    this.input.keyboard.removeAllKeys(true);
    
    // Stop all sounds
    this.sound.stopAll();
  }
}