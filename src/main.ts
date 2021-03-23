import Phaser from 'phaser'

import MainMenu from './scenes/MainMenu'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	backgroundColor: '#0D161D',
	scale: {
		mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH,
		width: 1920,
		height: 1080,
	},
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 200 }
		}
	},
	scene: [MainMenu]
}


export default new Phaser.Game(config)

