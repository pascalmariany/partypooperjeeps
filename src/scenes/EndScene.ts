import Phaser from 'phaser';
import { supabase } from '../lib/supabase';

interface EndSceneData {
  winner: string;
  player1Name: string;
  player2Name: string;
  player1Score: number;
  player2Score: number;
  player1Presents: number;
  player2Presents: number;
  gameMode: 'single' | 'multi';
}

export class EndScene extends Phaser.Scene {
  private data!: EndSceneData;
  private highScores: any[] = [];

  constructor() {
    super('EndScene');
  }

  init(data: EndSceneData) {
    this.data = {
      ...data,
      player1Name: data.player1Name || 'PLAYER 1',
      player2Name: data.player2Name || 'CPU',
      player1Score: data.player1Score || 0,
      player2Score: data.player2Score || 0,
      player1Presents: data.player1Presents || 0,
      player2Presents: data.player2Presents || 0,
      gameMode: data.gameMode || 'single'
    };
  }

  async create() {
    // Save scores
    await this.saveScores();
    
    // Load high scores
    await this.loadHighScores();

    // Show winner
    const title = this.add.text(
      this.cameras.main.centerX,
      50,
      `${this.data.winner} WINS!`,
      {
        fontSize: '64px',
        fontFamily: 'monospace',
        color: '#00ff00',
      }
    );
    title.setOrigin(0.5);

    // Show scores
    const scoreText = this.add.text(
      this.cameras.main.centerX,
      150,
      this.getScoreText(),
      {
        fontSize: '24px',
        fontFamily: 'monospace',
        color: '#00ff00',
        align: 'center'
      }
    );
    scoreText.setOrigin(0.5);

    // Show high scores
    const highScoreText = this.add.text(
      this.cameras.main.centerX,
      300,
      this.getHighScoreText(),
      {
        fontSize: '24px',
        fontFamily: 'monospace',
        color: '#00ff00',
        align: 'center'
      }
    );
    highScoreText.setOrigin(0.5);

    // Play again text
    const playAgainText = this.add.text(
      this.cameras.main.centerX,
      500,
      'Press SPACEBAR to play again\nPress ESC for menu',
      {
        fontSize: '24px',
        fontFamily: 'monospace',
        color: '#00ff00',
        align: 'center'
      }
    );
    playAgainText.setOrigin(0.5);

    // Handle input
    this.input.keyboard.once('keydown-SPACE', () => {
      this.scene.start('NameInputScene');
    });

    this.input.keyboard.once('keydown-ESC', () => {
      this.scene.start('MenuScene');
    });
  }

  private async saveScores() {
    const winnerName = this.data.winner === 'PLAYER 1' ? 
      this.data.player1Name : this.data.player2Name;
    const winnerScore = this.data.winner === 'PLAYER 1' ? 
      this.data.player1Score : this.data.player2Score;
    const winnerPresents = this.data.winner === 'PLAYER 1' ? 
      this.data.player1Presents : this.data.player2Presents;

    try {
      await supabase.from('highscores').insert({
        player_name: winnerName,
        score: winnerScore,
        presents_collected: winnerPresents,
        player1_name: this.data.player1Name,
        player2_name: this.data.player2Name,
        game_mode: this.data.gameMode,
        winner_name: winnerName
      });
    } catch (error) {
      console.error('Error saving score:', error);
    }
  }

  private async loadHighScores() {
    try {
      const { data } = await supabase
        .from('highscores')
        .select('*')
        .order('score', { ascending: false })
        .limit(5);

      this.highScores = data || [];
    } catch (error) {
      console.error('Error loading high scores:', error);
      this.highScores = [];
    }
  }

  private getScoreText(): string {
    return [
      'FINAL SCORES',
      '------------',
      `${this.data.player1Name}: ${this.data.player1Score} (${this.data.player1Presents} presents)`,
      `${this.data.player2Name}: ${this.data.player2Score} (${this.data.player2Presents} presents)`,
    ].join('\n');
  }

  private getHighScoreText(): string {
    const lines = ['TOP SCORES', '----------'];
    
    this.highScores.forEach((score, index) => {
      const name = score.player_name || 'UNKNOWN';
      const gameMode = score.game_mode === 'multi' ? 'MP' : 'SP';
      lines.push(
        `${index + 1}. ${name}: ${score.score} points ` +
        `(${score.presents_collected} presents) [${gameMode}]`
      );
    });

    return lines.join('\n');
  }
}