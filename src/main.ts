import Phaser from 'phaser'

import Boot from './scenes/Boot'
import MainMenu from './scenes/MainMenu'


var config = {
    type: Phaser.WEBGL,
    backgroundColor: '#0D161D',
    pixelArt: true,
    scale: {
        mode: Phaser.Scale.FIT, // we will resize the game with our own code (see Boot.js)
        width: window.innerWidth * window.devicePixelRatio, // set game width by multiplying window width with devicePixelRatio
        height: window.innerHeight * window.devicePixelRatio, // set game height by multiplying window height with devicePixelRatio
        zoom: 1 / window.devicePixelRatio // Set the zoom to the inverse of the devicePixelRatio
    },
    scene: [
        Boot,
        MainMenu
    ]
};


export default new Phaser.Game(config)
