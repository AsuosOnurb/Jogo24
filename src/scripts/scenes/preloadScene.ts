export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' })
  }

  preload() {
    this.load.image('phaser-logo', 'assets/img/phaser-logo.png')


    /* 
      This is where we pre-load all of the images used in the game.
      This is done ONLY once for all images
    */
    this.load.spritesheet('btn_close', 'assets/img/ui/buttons/btn_close.png', { frameWidth: 550, frameHeight: 550 });
    this.load.spritesheet('btn', 'assets/img/ui/buttons/btns_base.png', { frameWidth: 724, frameHeight: 180 });

    /* =================================== Main menu assets =================================== */
    this.load.image('background', 'assets/img/ui/imgs/background0.png');
    this.load.image('title', 'assets/img/ui/imgs/titulo1.png');
    this.load.image('toon', 'assets/img/ui/imgs/boneco.png');

    this.load.image('btn_easy', 'assets/img/ui/buttons/facilBT.png');
    this.load.image('btn_medium', 'assets/img/ui/buttons/medioBT.png');
    this.load.image('btn_hard', 'assets/img/ui/buttons/dificilBT.png');


    this.load.image('btn_about', 'assets/img/ui/buttons/sobreojogoBT.png');
    this.load.image('btn_howToPlay', 'assets/img/ui/buttons/instrucoesBT.png');
    this.load.image('btn_top', 'assets/img/ui/buttons/topBT.png');
    this.load.image('btn_tabletMode', 'assets/img/ui/buttons/modotabletBT.png');
    this.load.image('btn_credits', 'assets/img/ui/buttons/creditosBT.png');

    /* ======================================================================================== */


    /* =================================== Solo game assets =================================== */

  }

  create() {
    this.scene.start('MainMenu')

    /**
     * This is how you would dynamically import the mainScene class (with code splitting),
     * add the mainScene to the Scene Manager
     * and start the scene.
     * The name of the chunk would be 'mainScene.chunk.js
     * Find more about code splitting here: https://webpack.js.org/guides/code-splitting/
     */
    // let someCondition = true
    // if (someCondition)
    //   import(/* webpackChunkName: "mainScene" */ './mainScene').then(mainScene => {
    //     this.scene.add('MainScene', mainScene.default, true)
    //   })
    // else console.log('The mainScene class will not even be loaded by the browser')
  }
}
