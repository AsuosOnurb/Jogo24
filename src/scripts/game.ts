import 'phaser'

import { SingleplayerScene } from './scenes/SingleplayerScene'
import { MultiplayerScene } from './scenes/MultiplayerScene'
import { MainMenuScene } from './scenes/MainMenu'
import { RankingScene } from './scenes/RankingScene'
import { PreloadScene } from './scenes/preloadScene'

import UIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js'


import { LoginData } from './backend/LoginData'


const config = {
  type: Phaser.AUTO,
  backgroundColor: '#ffffff',
  dom: {
    createContainer: true
  },
  scale: {
    parent: 'game-wrapper',
    
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,

    width: 1920,
    height: 1080
  },
  antialias: true,

  scene: [PreloadScene, MainMenuScene, SingleplayerScene, MultiplayerScene, RankingScene],


  plugins:
  {
    scene: [
      {
        key: 'rexUI',
        plugin: UIPlugin,
        mapping: 'rexUI'
      },
      
    ]
  }
}


var game = new Phaser.Game(config);
game.scale.fullscreenTarget = document.getElementById(`game-wrapper`);
var userLoginData = LoginData.GetInstance();
