import 'phaser'

import {SingleplayerScene} from './scenes/SingleplayerScene'
import {MultiplayerScene} from './scenes/MultiplayerScene'
import {MainMenuScene} from './scenes/MainMenu'
import {PreloadScene} from './scenes/preloadScene'

const DEFAULT_WIDTH = 1920
const DEFAULT_HEIGHT = 1080

const config = {
  type: Phaser.AUTO,
  backgroundColor: '#ffffff',
  scale: {
    parent: 'phaser-game',
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,

    width: 1920 ,
    height: 1080
  },
  antialias: true,
  
  scene: [PreloadScene, MainMenuScene, SingleplayerScene, MultiplayerScene],
  
}

window.addEventListener('load', () => {
  const game = new Phaser.Game(config)
})
