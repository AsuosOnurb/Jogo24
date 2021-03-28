import Phaser, { AUTO } from 'phaser'
import Boot from './scenes/Boot'
import MainMenu from './scenes/MainMenu'
import SoloGame from './scenes/SoloGame';

const DEF_WIDTH = 1920;
const DEF_HEIGHT = 1080;

var config = {
    type: Phaser.AUTO,
    backgroundColor: '#ff9600',
    scale: {
        width: 1920 * devicePixelRatio,
        height: 1080 * devicePixelRatio,
        mode: Phaser.Scale.FIT, //Auto fit of the scene, keeping the aspect ratio  
        autoCenter: Phaser.Scale.CENTER_BOTH //Center the scene in the center of the window,
    },
    scene: [
        Boot,
        MainMenu,
        SoloGame
    ]
};


export default new Phaser.Game(config)
