import Phaser from 'phaser'

import Boot from './scenes/Boot'
import MainMenu from './scenes/MainMenu'
import SoloGame from './scenes/SoloGame';


const WIDTH = 1920;
const HEIGHT = 1080;

var config = {
    type: Phaser.AUTO,
    backgroundColor: '#ff9600',
    
    scale: {
        zoom: 1 / devicePixelRatio,
        width: WIDTH * devicePixelRatio,
        height: HEIGHT * devicePixelRatio,
        mode: Phaser.Scale.FIT, //Auto fit of the scene, keeping the aspect ratio  
        autoCenter: Phaser.Scale.CENTER_BOTH //Center the scene in the center of the window
    },
    scene: [
        Boot,
        MainMenu,
        SoloGame
    ]
};


export default new Phaser.Game(config)
