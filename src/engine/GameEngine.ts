export class GameEngine {
  private score: number;
  private numOfClicks: number;
  private gameOver: boolean;
  private moleHideTimeRange: [number, number] = [20000, 40000];

  constructor() {
    this.score = 0;
    this.numOfClicks = 0;
    this.gameOver = false;
  }

  public getScore() {
    return this.score;
  }

  public getNumOfClicks() {
    return this.numOfClicks;
  }

  public incrementScore(points: number) {
    if (!this.gameOver) this.score += points;
  }

  public incrementNumOfClicks() {
    if (!this.gameOver) this.numOfClicks++;
  }

  public endGame() {
    this.gameOver = true;
  }

  public getRandomMoleHideTime(): number {
    const [min, max] = this.moleHideTimeRange;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  public resetGame() {
    this.score = 0;
    this.numOfClicks = 0;
    this.gameOver = false;
  }

  public isGameOver(): boolean {
    return this.gameOver;
  }
}
