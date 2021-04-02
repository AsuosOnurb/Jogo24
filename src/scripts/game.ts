import 'phaser'

import SoloGame from './scenes/SoloGame'
import MainMenu from './scenes/MainMenu'
import PreloadScene from './scenes/preloadScene'

const DEFAULT_WIDTH = 1920
const DEFAULT_HEIGHT = 1080

const config = {
  type: Phaser.AUTO,
  backgroundColor: '#ff9600',
  scale: {
    parent: 'phaser-game',
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT
  },
  scene: [PreloadScene, MainMenu, SoloGame],
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 400 }
    }
  }
}

window.addEventListener('load', () => {
  const game = new Phaser.Game(config)
})
