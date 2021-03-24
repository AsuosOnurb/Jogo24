import Phaser from 'phaser'

import Boot from './scenes/Boot'
import MainMenu from './scenes/MainMenu'


var config = {
    type: Phaser.WEBGL,
    backgroundColor: '#0D161D',
    pixelArt: true,
    width: window.innerWidth * window.devicePixelRatio, // set game width by multiplying window width with devicePixelRatio
    height: window.innerHeight * window.devicePixelRatio, // set game height by multiplying window height with devicePixelRatio
    scale: {
        mode: Phaser.Scale.FIT, //Auto fit of the scene, keeping the aspect ratio  
        autoCenter: Phaser.Scale.CENTER_BOTH //Center the scene in the center of the window
    },
    scene: [
        Boot,
        MainMenu
    ]
};


export default new Phaser.Game(config)
