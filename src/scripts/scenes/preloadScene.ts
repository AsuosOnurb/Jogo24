

export  class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' })
  }

  preload() {
 

    /* 
      This is where we pre-load all of the images used in the game.
      This is done ONLY once for all images
    */
 

    /* ======================= Assets used globally ============================================= */
    this.load.image('blueBackground',   'assets/img/common/background0.png');
    this.load.image('btn_undo', 'assets/img/common/voltaratrasBT.png')
    this.load.image('btn_reset', 'assets/img/common/refreshBT.png')

    this.load.image('title',        'assets/img/common/titulo1.png');
    this.load.image('toon',         'assets/img/common/boneco.png');

    /* =================================== Main menu assets =================================== */
    this.load.image('fullscreenToggle', 'assets/img//main_menu/fullScreen.png')

   

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




    /* =================================== Solo game assets =================================== */
    this.load.image('smallTitle',   'assets/img/solo_game/titulo2-peq.png');

    this.load.image('btn_playCard',   'assets/img/solo_game/playCard.png');
    this.load.image('btn_gotoMenu',   'assets/img/solo_game/retmenuBT.png');


    this.load.image('clockBG1', 'assets/img/solo_game/relogio.png')
    this.load.image('clockBG2', 'assets/img/solo_game/relogioN.png')
    this.load.image('correctCounter',   'assets/img/solo_game/assinalaCertos.png');
    this.load.image('wrongCounter',   'assets/img/solo_game/assinalaErrados.png');
    this.load.image('inputBar',   'assets/img/common/barra.png');


    this.load.image('cardBG',   'assets/img/solo_game/cardBackground.png');
    this.load.image('btn_numberBG',   'assets/img/common/numeroBTBG.png');

    this.load.image('btn_addition',   'assets/img/solo_game/opAdicao.png');
    this.load.image('btn_subtraction',   'assets/img/solo_game/opSubtracao.png');
    this.load.image('btn_multiplication',   'assets/img/solo_game/opMultiplicacao.png');
    this.load.image('btn_division',   'assets/img/solo_game/opDivisao.png');

    /* =================================== Multiplayer game assets ============================== */
    
    this.load.image('btn_allDifficulties', 'assets/img/multiplayer_game/todosBT.png');
    this.load.image('textImage_rules', 'assets/img/multiplayer_game/textoi.png')
    this.load.image('textImage_pickDiff', 'assets/img/multiplayer_game/textoi2.png')

    this.load.image('btn_player1', 'assets/img/multiplayer_game/btt1.png');
    this.load.image('btn_player2', 'assets/img/multiplayer_game/btt2.png');
    this.load.image('btn_player3', 'assets/img/multiplayer_game/btt3.png');
    this.load.image('btn_player4', 'assets/img/multiplayer_game/btt4.png');

    /* ========================== Ranking scene ==================================== */
    this.load.image('sliderThumb', 'assets/img/common/numeroBTBG.png');

  }

  create() {
    this.scene.start('MainMenu')
  }
}
