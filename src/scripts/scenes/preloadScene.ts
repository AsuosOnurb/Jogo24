export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' })
  }

  preload() {
 

    /* 
      This is where we pre-load all of the images used in the game.
      This is done ONLY once for all images
    */
 

    /* ======================= Assets used globally ============================================= */
    this.load.image('btn_undo', 'assets/img/common/voltaratrasBT.png')
    this.load.image('btn_reset', 'assets/img/common/refreshBT.png')

    /* =================================== Main menu assets =================================== */
    this.load.image('fullscreenToggle', 'assets/img//main_menu/fullScreen.png')

    this.load.image('blueBackground',   'assets/img/main_menu/background0.png');
    this.load.image('title',        'assets/img/main_menu/titulo1.png');
    this.load.image('toon',         'assets/img/main_menu/boneco.png');

    this.load.image('btn_easy',     'assets/img/main_menu/facilBT.png');
    this.load.image('btn_medium',   'assets/img/main_menu/medioBT.png');
    this.load.image('btn_hard',     'assets/img/main_menu/dificilBT.png');


    this.load.image('btn_about',      'assets/img/main_menu/sobreojogoBT.png');
    this.load.image('btn_howToPlay',  'assets/img/main_menu/instrucoesBT.png');
    this.load.image('btn_top',        'assets/img/main_menu/topBT.png');
    this.load.image('btn_tabletMode', 'assets/img/main_menu/modotabletBT.png');
    this.load.image('btn_credits',    'assets/img/main_menu/creditosBT.png');

    this.load.image('aboutGame', 'assets/img/main_menu/sobreojogoMC.png')
    this.load.image('howToPlay', 'assets/img/main_menu/instrucoesMC.png')



    this.load.image('btn_close', 'assets/img/main_menu/closeBT.png')


    /* ======================================================================================== */


    /* =================================== Solo game assets =================================== */
    this.load.image('smallTitle',   'assets/img/solo_game/titulo2-peq.png');

    this.load.image('btn_playCard',   'assets/img/solo_game/playCard.png');
    this.load.image('btn_gotoMenu',   'assets/img/solo_game/retmenuBT.png');


    this.load.image('clockBG1', 'assets/img/solo_game/relogio.png')
    this.load.image('clockBG2', 'assets/img/solo_game/relogioN.png')
    this.load.image('correctCounter',   'assets/img/solo_game/assinalaCertos.png');
    this.load.image('wrongCounter',   'assets/img/solo_game/assinalaErrados.png');
    this.load.image('inputBar',   'assets/img/solo_game/barra.png');


    this.load.image('cardBG',   'assets/img/solo_game/cardBackground.png');
    this.load.image('btn_numberBG',   'assets/img/common/numeroBTBG.png');

    this.load.image('btn_addition',   'assets/img/solo_game/opAdicao.png');
    this.load.image('btn_subtraction',   'assets/img/solo_game/opSubtracao.png');
    this.load.image('btn_multiplication',   'assets/img/solo_game/opMultiplicacao.png');
    this.load.image('btn_division',   'assets/img/solo_game/opDivisao.png');

    



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
