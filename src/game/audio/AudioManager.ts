import Phaser from 'phaser';

export class AudioManager {
  private scene: Phaser.Scene;
  private bgMusic?: Phaser.Sound.BaseSound;
  private normalDriving?: Phaser.Sound.BaseSound;
  private boostDriving?: Phaser.Sound.BaseSound;
  private engineStart?: Phaser.Sound.BaseSound;
  private pickupSound?: Phaser.Sound.BaseSound;
  private boostSound?: Phaser.Sound.BaseSound;
  private victorySound?: Phaser.Sound.BaseSound;
  private isMuted: boolean = false;
  private isInitialized: boolean = false;
  private static instance: AudioManager;
  private isGameScene: boolean = false;
  private isDrivingSoundPlaying: boolean = false;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.setupMuteControl();
    this.isGameScene = scene.scene.key === 'GameScene';
    AudioManager.instance = this;
  }

  static getInstance(): AudioManager | undefined {
    return AudioManager.instance;
  }

  initializeAudio() {
    if (this.isInitialized) return;
    
    try {
      // Background music
      this.bgMusic = this.scene.sound.add('bgMusic', {
        loop: true,
        volume: 0.3
      });

      // Normal driving sound
      this.normalDriving = this.scene.sound.add('normalDriving', {
        loop: true,
        volume: 0.4
      });

      // Boost driving sound
      this.boostDriving = this.scene.sound.add('boostDriving', {
        loop: true,
        volume: 0.4
      });

      // Engine start sound
      this.engineStart = this.scene.sound.add('engineStart', {
        loop: false,
        volume: 0.5
      });

      // Pickup sound
      this.pickupSound = this.scene.sound.add('pickupSound', {
        loop: false,
        volume: 0.4
      });

      // Boost sound
      this.boostSound = this.scene.sound.add('boostSound', {
        loop: false,
        volume: 0.4
      });

      // Victory sound
      this.victorySound = this.scene.sound.add('victorySound', {
        loop: false,
        volume: 0.5
      });
      
      this.isInitialized = true;
      
      if (!this.isMuted) {
        this.bgMusic?.play();
        // Only play engine start in game scene
        if (this.isGameScene) {
          this.playEngineStart();
        }
      }
    } catch (error) {
      console.warn('Error initializing audio:', error);
    }
  }

  playEngineStart() {
    if (!this.isMuted && this.engineStart && this.isGameScene && !this.engineStart.isPlaying) {
      this.engineStart.play();
    }
  }

  playDrivingSound(isBoostActive: boolean = false) {
    if (this.isMuted || !this.isGameScene) return;

    if (isBoostActive) {
      if (this.normalDriving?.isPlaying) {
        this.normalDriving.stop();
      }
      if (this.boostDriving && !this.boostDriving.isPlaying) {
        this.boostDriving.play();
        this.isDrivingSoundPlaying = true;
      }
    } else {
      if (this.boostDriving?.isPlaying) {
        this.boostDriving.stop();
      }
      if (this.normalDriving && !this.normalDriving.isPlaying) {
        this.normalDriving.play();
        this.isDrivingSoundPlaying = true;
      }
    }
  }

  stopDrivingSound() {
    if (this.isDrivingSoundPlaying) {
      this.normalDriving?.stop();
      this.boostDriving?.stop();
      this.isDrivingSoundPlaying = false;
    }
  }

  playPickupSound() {
    if (!this.isMuted && this.pickupSound && this.isGameScene && !this.pickupSound.isPlaying) {
      this.pickupSound.play();
    }
  }

  playBoostSound() {
    if (!this.isMuted && this.boostSound && this.isGameScene && !this.boostSound.isPlaying) {
      this.boostSound.play();
    }
  }

  playVictorySound() {
    if (!this.isMuted && this.victorySound && this.isGameScene) {
      // Stop other sounds
      this.stopDrivingSound();
      this.bgMusic?.stop();
      
      if (!this.victorySound.isPlaying) {
        this.victorySound.play();
      }
    }
  }

  stopBackgroundMusic() {
    this.bgMusic?.stop();
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.scene.sound.mute = true;
      this.stopDrivingSound();
    } else {
      this.scene.sound.mute = false;
      if (this.isInitialized && !this.bgMusic?.isPlaying) {
        this.bgMusic?.play();
      }
    }
  }

  private setupMuteControl() {
    this.scene.input.keyboard.on('keydown-M', () => {
      this.toggleMute();
    });
  }
}