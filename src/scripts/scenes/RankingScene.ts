// RankingScene.ts
/**
 * Module responsible for the implementation of the Ranking/TOP scene.
 * @module
 */



import Phaser from 'phaser'
import { AlignGrid } from '../utils/external/AlignGrid'
import { BetterButton } from '../components/BetterButton';
import { BetterText } from '../components/BetterText';
import { LoginData } from '../backend/LoginData';
import { ParsedUpdatedScoreData, ParseScoreData } from '../backend/BackendUtils';
import { GetGlobalTOP, GetFilteredTOP, SpaceFilter, DifficultyFilter } from '../backend/BackendConnection';

/**
 
 * The class that implements the ranking/socreboard/top scene.
 * The only way yo arrive to this scene is from the main menu.
 * 
 * Here' we're using the BackendConnection (static) object to facilitate the communication between this and the database.
 * 
 * To speed up things, we're using 2 pieces of external code.
 * The first one is the RexUI's plugin. It provides us some tools to create scrollable tables, radio buttons and the likes.
 * 
 * 
 * The other one is the AlignGrid object defined on AlignedGrid.js . This object lets us create a grid where we can specify positions for the UI elements. 
 * Not only that, this object will also scale and position them according to the game's scale.
 * 
 * 
 *  ================================================================================
 *                                  Filter Based Updating
 * Another thing one might notice is how the table is updated everytime a filter is clicked. 
 * We have to connect to the database everyime because we want to receive the most updated information/scores.
 * We could just retrieve them all and store them in based on their filter categories, but that would mean we wouldn't take into account
 * the new scores that could be added during the time the player is in this scene.
 * ===========================================================================================
 *              
 */
export class RankingScene extends Phaser.Scene {




    /* ===== The labels that appear on the top of the ranking table: Jogador, Pontos, Escola, etc...  ==========*/
    private lblJogador: BetterText;
    private lblPontos: BetterText;
    private lblEscola: BetterText;
    private lblTurma: BetterText;
    private lblData: BetterText;
    /* ======================================================================================================== */

    /* ================= The filters on the right side of the scene (radio buttons, labels) =========================== */

    /**
     * The label that reads 'Ano Letivo'
     */
    private lblAnoLetivo: BetterText;

    /**
     * The label that reads 'Dificuldade'
     */
    private lblDificuldade: BetterText;

    /**
     * The label that reads 'Dificil'
     */
    private lblDificil: BetterText;
    private iconDificil;

    /**
     * The label that reads 'Normal'
     */
    private lblNormal: BetterText;
    private iconNormal;

    /**
     * The label that reads 'Fácil'
     */
    private lblFacil: BetterText;
    private iconFacil;

    /**
    * The label that reads 'Filtro'.
    */
    private lblFiltro: BetterText;

    /**
     * The label that reads 'Turma'.
     */
    private lblFiltroTurma: BetterText;
    private iconTurma;

    /**
     * The label that reads 'Todos'.
     */
    private lblFiltroTodos: BetterText;
    private iconTodos;

    /**
     * The label that reads 'Escola' (on the right side of the screen).
     * 
     */

    private lblFiltroEscola: BetterText;
    private iconEscola;

    /**
     * The orange(brownish) background of the filter option on the right side of the screen.
     * It's another UI element from RexUI, so we're oblivious to what its type might be.
     */
    private filterBackground;


    /**
     * The (scrollable) table object created using RexUI's plugin.
     * This specific table is the one we use to display the scores.
     */
    private scoreTable;

    /**
     * Another (scrollable) table created using RexUI's plugin.
     * This specific tables is the one we use to display the different school years list on the right side of the screen.
     */
    private schoolYearDropdown;


    /**
     * The image with the game's title.
     */
    private imgTitle: Phaser.GameObjects.Image;

    /**
     * The button that starts the transition to the main menu.
     */
    private btnMainMenu: BetterButton;

    /**
     * A reference to the RexUI's plugin.
     * Again, we're mixing javascript with typescript. It's not ideal, but its what we got.
     */
    private rexUI;

    /**
    * The alignment grid that helps us align the elements on the screen.
    * This is javascript object defined on the corresponding file (AlignGrid.js).
    */
    private alignmentGrid;

    /*
         =================================   Data members =================================
         The class members declare below could probably be in another class or maybe a structured object.
         Having this kind of data (related to the database inner workings) doesnt feel right.


         TODO: Later, find a better solution for this.
    */

    /**
     * An array that contains the data we parse from the DB's response everytime we resquest something from it.
     * Specifically, its an array with structured objects, where each of these objects contain information pertaining to a user/player (things like score, name, school, class, etc...)
     * Only parsed/human readable data is assigned to this array.  
     */
    private databaseData: Array<any>;


    private dataInicial: string;
    private dataFinal: string;

    /**
     * The dificulty filter parameter that is sent with the url to the DB. Value range is [1,2,3].
     * 
     * 
     * If dificulty = 1, then the user is asking for the 'Easy' mode scores
     * If dificulty = 2, then the user is asking for the 'Normal'/'Medium' mode scores
     * If dificulty = 3, then the user is asking for the 'Hard' mode scores
     * 
     */
    private dificultyFilter: DifficultyFilter;

    /**
     * The parameter that is sent to the DB and determines the space of scores to retrieve. Value range is [0,1,2].
     * 
     * 
     * If flag = 2, then the user is trying to see the global scores.
     * If flag = 1, then the user is trying to see the school scores.
     * If flag = 0, then the user is trying to see his/her classe's scores.
     */
    private spaceFilter: SpaceFilter;





    constructor() {
        super('RankingScene');

        const d = new Date();
        const m = d.getMonth();
        const n = d.getFullYear();

        let x, y;
        if (m > 7) {
            x = n;
            y = n + 1;
        }
        else {
            x = n - 1;
            y = n;
        }
        this.dataInicial = x + "-09-01";
        this.dataFinal = y + "-08-31";
        this.dificultyFilter = DifficultyFilter.Easy;
        this.spaceFilter = SpaceFilter.All;

    }




    /**
     * The preload() procedure provided by phaser.
     * THe only reason we're using this procedure is because the RexUI's plugin has to be pre-loaded before everything else.
     */
    private preload() {

        /* Load the RexUI's plugin */
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'src/scripts/utils/external/RexUI/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });


    }

    /**
     * The init() procedure provided by phaser.
     * 
     * Here's where we setup the whole UI.
     * 
     * It begins with one decision:
     * 
     * We try to connect to the database to retrieve it's data. If there's no internet connection, or if the connection fails (for some reason),
     *      then we'll just load the blue background with an empty table.
     * 
     * If the connection to the database is successfull, then things run normally.
     */
    private init() {

        // Blue background
        this.add.image(this.scale.width / 2, this.scale.height / 2, 'blueBackground').setDisplaySize(this.scale.width, this.scale.height);

        // Title image
        this.imgTitle = this.add.image(this.scale.width / 2, 112, 'title');
        this.imgTitle.setScale(0.6, 0.6);

        // Setup the "Back" button
        this.SetupMenuButton()

        let fadedoutImg =  this.add.image(this.scale.width / 2, this.scale.height / 2, 'blueBackground').setDisplaySize(this.scale.width, this.scale.height);

        

        let connection = GetGlobalTOP(this.dataInicial, this.dataFinal);

        connection.then((data) => {

            let parsedData = ParseScoreData(data);

            this.databaseData = parsedData; // databaseData is what we use to populate the table when we first start the scene.

            this.tweens.add({
                targets: fadedoutImg,
                alpha: 0,
                duration: 500,
            });

            this.CompleteScene();

           

        }).catch((err) => {
            this.LoadEmptyScene();

        });

    }

    /* ======================= Scnene construction (visual side of things ) ======================== */


    /**
     * Starts the whole scene creation process.
     * At the end of execution, the scene is completely done and ready for interaction.
     */
    private CompleteScene(): void {



        const gridConfig = {
            'scene': this,
            'cols': 15,
            'rows': 15
        }
        this.alignmentGrid = new AlignGrid(this.game, gridConfig);

        // Setup the table 
        this.CreateTable();

        // Setup the filter on the right side of the screen
        this.SetupFilter();
        this.SetupYearFilterDropdown();

        if (!LoginData.IsLoggedIn()) {
            this.lblFiltro.visible = false;
            this.lblFiltroTurma.visible = false;
            this.iconTurma.visible = false;
            this.lblFiltroEscola.visible = false;
            this.iconEscola.visible = false;
            this.lblFiltroTodos.visible = false;
            this.iconTodos.visible = false;
        }




    }


    /**
     * Creates the scoreboard table.
     * Utilizes the RexUI's plugin.
     */
    private CreateTable(): void {

        /**
         * Lots of values used here are hardcoded, which could be a bad thing. It's what you get fo reusing code.
         * At the same time, this values seem to work just fine. If it ain't broke, don't fix it.
         */

        this.scoreTable = this.rexUI.add.gridTable({
            x: 848,
            y: this.scale.height / 2 + 64,

            width: 1560,
            height: 768,

            scrollMode: 0, // Vertical scroll

            background: this.rexUI.add.roundRectangle(-100, 0, 8, 10, 10, 0xe79946),

            table: {
                cellWidth: 50,
                cellHeight: 50,
                columns: 6,

                mask: {
                    padding: 2,
                    updateMode: 0,
                },

                reuseCellContainer: true,
            },



            slider: {
                track: this.rexUI.add.roundRectangle(0, 0, 18, 10, 10, 0x260e04),
                thumb: this.rexUI.add.roundRectangle(0, 0, 32, 32, 13, 0xc85c02),
            },
            space: {
                left: 10,
                right: 26,
                top: 132,
                bottom: 30,

                table: 10,
                header: 10,
                footer: 10,
            },

            createCellContainerCallback: function (cell, cellContainer) {
                let newwith;

                if (cell.index % 6 == 0) {//index
                    newwith = 10;
                }
                if (cell.index % 6 == 1) {//nome
                    newwith = 10;
                }
                if (cell.index % 6 == 2) {//pontos
                    newwith = 500;
                }
                if (cell.index % 6 == 3) {//Escola
                    newwith = 1305;
                }
                if (cell.index % 6 == 4) {//turm
                    newwith = 2140;
                }
                if (cell.index % 6 == 5) {
                    newwith = 2370;
                }


                var scene = cell.scene,
                    width = newwith,
                    height = cell.height,
                    item = cell.item,
                    index = cell.index,

                    cellContainer = scene.rexUI.add.label({
                        width: width,
                        height: height,

                        orientation: 'top-to-bottom',
                        text: scene.add.text(50, 50, item.name, { fontFamily: 'Bubblegum', fontSize: 21, color: '#000000', align: 'center' }),
                        align: 'center',
                    });

                return cellContainer;
            },
            items: this.GetTableData()
        })
            .layout()


        /* Setup the labels on the top od the table */
        this.lblJogador = new BetterText(this, 0, 0, 'Jogador', { fontFamily: 'Folks-Bold', fontSize: 40, color: '#403217' });
        this.alignmentGrid.placeAtIndex(61, this.lblJogador);

        this.lblPontos = new BetterText(this, 0, 0, 'Pontos', { fontFamily: 'Folks-Bold', fontSize: 40, color: '#403217' });
        this.alignmentGrid.placeAtIndex(63, this.lblPontos);
        this.lblPontos.x -= 20;

        this.lblEscola = new BetterText(this, 0, 0, 'Escola', { fontFamily: 'Folks-Bold', fontSize: 40, color: '#403217' });
        this.alignmentGrid.placeAtIndex(66, this.lblEscola);
        this.lblEscola.x += 45;

        this.lblTurma = new BetterText(this, 0, 0, 'Turma', { fontFamily: 'Folks-Bold', fontSize: 40, color: '#403217' });
        this.alignmentGrid.placeAtIndex(69, this.lblTurma);
        this.lblTurma.x += 130

        this.lblData = new BetterText(this, 0, 0, 'Data', { fontFamily: 'Folks-Bold', fontSize: 40, color: '#403217' });
        this.alignmentGrid.placeAtIndex(71, this.lblData);
        this.lblData.x += 50;


    }







    /**
     *  Sets up the "Go back to menu" button.
     **/
    private SetupMenuButton(): void {
        this.btnMainMenu = new BetterButton(this, 128, 128, 0.8, 0.8, '', {}, 'btn_gotoMenu');
        this.btnMainMenu.on('pointerup', () => this.scene.start('MainMenu'));
    }

    /**
     * Procedure responsible for the setting up of the labels and their radio buttons.
     * These labels are the ones we see on the right side of the screen (the filter).
     * 
     * The radio buttons have the UpdateTop() procedure assocciated because we want the table to update when we click them.
     */
    private SetupFilter(): void {
        this.filterBackground = this.rexUI.add.roundRectangle(0, 0, 216, 768, 10, 0xe79946);
        this.alignmentGrid.placeAtIndex(133, this.filterBackground);
        this.filterBackground.x += 32
        this.filterBackground.y -= 10;


        this.lblAnoLetivo = new BetterText(this, 0, 0, 'Ano Letivo', { fontFamily: 'Folks-Bold', fontSize: 32, color: '#403217', align: 'center' });
        this.alignmentGrid.placeAtIndex(58, this.lblAnoLetivo);
        this.lblAnoLetivo.x += 32
        this.lblAnoLetivo.y += 16

        /* Radio button: hard diff */
        this.lblDificil = new BetterText(this, 0, 0, 'Dificil', { fontFamily: 'Bubblegum', fontSize: 25, color: '#000000', align: 'left' });
        this.alignmentGrid.placeAtIndex(133, this.lblDificil);
        this.lblDificil.x += 22;

        this.iconDificil = this.add.circle(0, 0, 10, 0xffffff);
        this.alignmentGrid.placeAtIndex(133, this.iconDificil);
        this.iconDificil.x -= 32


        /* Radio button: Normal Diff */
        this.lblNormal = new BetterText(this, 0, 0, 'Normal', { fontFamily: 'Bubblegum', fontSize: 25, color: '#000000', align: 'left' });
        this.alignmentGrid.placeAtIndex(133, this.lblNormal);
        this.lblNormal.x += 32;
        this.lblNormal.y += 35;


        this.iconNormal = this.add.circle(0, 0, 10, 0xffffff);
        this.alignmentGrid.placeAtIndex(133, this.iconNormal);
        this.iconNormal.x -= 32;
        this.iconNormal.y += 35;

        /* Radio button: Easy diff */
        this.lblFacil = new BetterText(this, 0, 0, 'Fácil', { fontFamily: 'Bubblegum', fontSize: 25, color: '#000000', align: 'left' });
        this.alignmentGrid.placeAtIndex(148, this.lblFacil);
        this.lblFacil.x += 22

        this.iconFacil = this.add.circle(0, 0, 10, 0xffffff);
        this.alignmentGrid.placeAtIndex(148, this.iconFacil);
        this.iconFacil.x -= 32

        this.lblDificuldade = new BetterText(this, 0, 0, 'Dificuldade', { fontFamily: 'Folks-Bold', fontSize: 32, color: '#403217', align: 'center' });
        this.alignmentGrid.placeAtIndex(118, this.lblDificuldade);
        this.lblDificuldade.x += 32
        this.lblDificuldade.y += 28


        this.lblFacil.setInteractive({ useHandCursor: true });
        this.lblFacil.input.hitArea.setTo(-50, -5, this.lblFacil.width + 60, this.lblFacil.height);
        this.lblFacil.on('pointerdown', () => {
            this.iconDificil.setFillStyle('0xffffff');
            this.iconNormal.setFillStyle('0xffffff');
            this.iconFacil.setFillStyle('0x000000');
            this.dificultyFilter = DifficultyFilter.Easy;

            this.UpdateTable(); // Connect to DB

        });

        this.lblNormal.setInteractive({ useHandCursor: true });
        this.lblNormal.input.hitArea.setTo(-50, -5, this.lblNormal.width + 60, this.lblNormal.height);

        this.lblNormal.on('pointerdown', () => {
            this.iconDificil.setFillStyle('0xffffff');
            this.iconNormal.setFillStyle('0x000000');
            this.iconFacil.setFillStyle('0xffffff');
            this.dificultyFilter =  DifficultyFilter.Medium;



            this.UpdateTable(); // Connect to BD
        });

        this.lblDificil.setInteractive({ useHandCursor: true });
        this.lblDificil.input.hitArea.setTo(-50, -5, this.lblDificil.width + 60, this.lblDificil.height);
        this.lblDificil.on('pointerdown', () => {
            this.iconDificil.setFillStyle('0x000000');
            this.iconNormal.setFillStyle('0xffffff');
            this.iconFacil.setFillStyle('0xffffff');
            this.dificultyFilter =  DifficultyFilter.Hard;



            this.UpdateTable();
        });

        this.lblFiltro = new BetterText(this, 0, 0, 'Filtro', { fontFamily: 'Folks-Bold', fontSize: 32, color: '#403217', align: 'center' });
        this.alignmentGrid.placeAtIndex(163.3, this.lblFiltro);
        this.lblFiltro.y += 32;



        this.lblFiltroTurma = new BetterText(this, 0, 0, 'Turma', { fontFamily: 'Bubblegum', fontSize: 25, color: '#000000', align: 'left' });
        this.alignmentGrid.placeAtIndex(193.2, this.lblFiltroTurma);

        this.iconTurma = this.add.circle(0, 0, 10, 0xffffff);
        this.alignmentGrid.placeAtIndex(193, this.iconTurma);
        this.iconTurma.x -= 32;


        this.lblFiltroEscola = new BetterText(this, 0, 0, 'Escola', { fontFamily: 'Bubblegum', fontSize: 25, color: '#000000', align: 'left' });
        this.alignmentGrid.placeAtIndex(178.2, this.lblFiltroEscola);
        this.lblFiltroEscola.y += 35;


        this.iconEscola = this.add.circle(0, 0, 10, 0xffffff);
        this.alignmentGrid.placeAtIndex(178, this.iconEscola);
        this.iconEscola.x -= 32;
        this.iconEscola.y += 35;

        this.lblFiltroTodos = new BetterText(this, 0, 0, 'Todos', { fontFamily: 'Bubblegum', fontSize: 25, color: '#000000', align: 'left' });
        this.alignmentGrid.placeAtIndex(178.2, this.lblFiltroTodos);

        this.iconTodos = this.add.circle(0, 0, 10, 0xffffff);
        this.alignmentGrid.placeAtIndex(178, this.iconTodos);
        this.iconTodos.x -= 32;

        this.lblFiltroTodos.setInteractive({ useHandCursor: true });
        this.lblFiltroTodos.input.hitArea.setTo(-50, -5, this.lblFiltroTodos.width + 60, this.lblFiltroTodos.height);
        this.lblFiltroTodos.on('pointerdown', () => {

            this.iconTodos.setFillStyle('0x000000');

            this.iconEscola.setFillStyle('0xffffff');

            this.iconTurma.setFillStyle('0xffffff');

            this.spaceFilter = SpaceFilter.All;



            this.UpdateTable();
        });

        this.lblFiltroEscola.setInteractive({ useHandCursor: true });
        this.lblFiltroEscola.input.hitArea.setTo(-50, -5, this.lblFiltroEscola.width + 60, this.lblFiltroEscola.height);
        this.lblFiltroEscola.on('pointerdown', () => {

            this.iconTodos.setFillStyle('0xffffff');

            this.iconEscola.setFillStyle('0x000000');

            this.iconTurma.setFillStyle('0xffffff');

            this.spaceFilter = SpaceFilter.School;

            this.UpdateTable();
        });
        this.lblFiltroTurma.setInteractive({ useHandCursor: true });
        this.lblFiltroTurma.input.hitArea.setTo(-50, -5, this.lblFiltroTurma.width + 60, this.lblFiltroTurma.height);
        this.lblFiltroTurma.on('pointerdown', () => {

            this.iconTodos.setFillStyle('0xffffff');

            this.iconEscola.setFillStyle('0xffffff');

            this.iconTurma.setFillStyle('0x000000');

            this.spaceFilter = SpaceFilter.Class;


            this.UpdateTable();
        });

        this.iconTodos.setFillStyle('0x000000');
        this.iconFacil.setFillStyle('0x000000');

    }

    /**
     * Creates the school year list/dropdown filter.
     */
    private SetupYearFilterDropdown(): void {
        this.schoolYearDropdown = this.rexUI.add.gridTable({
            x: 1750,
            y: 400,
            width: 180,
            height: 250,

            scrollMode: 0, // Vertical scroll

            table: {
                cellWidth: 100,
                cellHeight: 50,
                columns: 1,

                mask: {
                    padding: 2,
                    updateMode: 0,
                },

                reuseCellContainer: true,
            },



            slider: {
                track: this.rexUI.add.roundRectangle(0, 0, 10, 10, 10, 0x260e04),
                thumb: this.rexUI.add.roundRectangle(0, 0, 32, 32, 13, 0xc85c02),
            },
            space: {
                left: 20,
                right: 0,
                top: 20,
                bottom: 20,

                table: 10,
                header: 10,
                footer: 10,
            },

            createCellContainerCallback: (cell, cellContainer) => {

                var scene = cell.scene,
                    width = cell.width,
                    height = cell.height,
                    item = cell.item,
                    index = cell.index,

                    cellContainer = scene.rexUI.add.label({
                        width: width,
                        height: height,

                        orientation: 0,
                        icon: scene.add.circle(0, 50, 10).setFillStyle('0xffffff'),
                        text: scene.add.text(50, 50, item, { fontFamily: 'Bubblegum', fontSize: 25, color: 'black', align: 'center' }),
                        align: 'center',
                        space: {
                            icon: 20,
                        }
                    });

                const currDate: Date = new Date()
                var m = currDate.getMonth();
                var n = currDate.getFullYear();

                let x: number, y: number;
                if (m > 7) {
                    x = n;
                    y = n + 1;
                }
                else {
                    x = n - 1;
                    y = n;
                }


                let xx: string = x.toString();
                let yy: string = y.toString();


                cellContainer.setInteractive({ useHandCursor: true });
                cellContainer.on('pointerdown', () => {
                    if (scene.lastclick) {
                        scene.lastclick.setFillStyle('0xffffff');
                    }
                    scene.lastclick = cellContainer.getElement('icon').setFillStyle('0x000000');

                    if (cellContainer.getElement('text')._text != 'Todos') {
                        this.dataInicial = '20' + cellContainer.getElement('text')._text.split('-')[0] + '-9-1';
                        this.dataFinal = '20' + cellContainer.getElement('text')._text.split('-')[1] + '-8-31';

                    }
                    else {
                        this.dataInicial = '2015-09-01'
                        this.dataFinal = new Date().toISOString().slice(0, 10)
                    }

                    this.UpdateTable(); // Connect to the BD
                });

                let tmp = xx.slice(2, 4) + '-' + yy.slice(2, 4);
                if (cellContainer.getElement('text')._text == tmp) {
                    scene.lastclick = cellContainer.getElement('icon').setFillStyle('0x000000');
                }

                return cellContainer;


            },
            items: this.GetSchoolYearList()
        })
            .layout()
    }

    /**
     * Used to create an empty table (an empty scene).
     * 
     * We use this when no connection to the database is possible when we enter this scene. This way, we dont get just a blank screen.
     */
    private LoadEmptyScene(): void {

        // Move the menu button to the center of the screen
        this.btnMainMenu.setDepth(1); // This is not cool. We're making it so that this button stays in front of everything we're about to add next.
        this.tweens.add(
            {
                targets: this.btnMainMenu,
                x: this.scale.width / 2,
                y: this.scale.height / 2 + 256,
                scale: 1.1,
                duration: 500,
                ease: 'Power1'
            }
        );

        // Show an empty panel where we later put a warning text
        let panelImg: Phaser.GameObjects.Image = this.add.image(this.scale.width / 2, this.scale.height / 2 + 128, "panel_empty");
        panelImg.setAlpha(0);
        this.tweens.add(
            {
                targets: panelImg,
                scale: 1.5,
                alpha: 1,
                duration: 500,
                ease: 'Power1'
            }
        )

        // Create a text warning the user that connection to internet was not possible
        let noConnectionWarningText: BetterText = new BetterText(this, this.scale.width / 2, this.scale.height / 2 - 64,
            "Não foi possível ligar à internet.", { fontFamily: 'Vertiky', align: 'center', fontSize: 64, color: "#4e2400" });
        noConnectionWarningText.setAlpha(0);

        let tryAgainText: BetterText = new BetterText(this, this.scale.width / 2, this.scale.height / 2 + 32,
            "Verifica a tua ligação e tenta novemente.", { fontFamily: 'Vertiky', align: 'center', fontSize: 48, color: "#4e2400" });
        tryAgainText.setAlpha(0);

        this.tweens.add(
            {
                targets: [noConnectionWarningText, tryAgainText],
                alpha: 1,
                duration: 500,
                ease: 'Power1',
                delay: 300
            }
        )

    }

    /* =================== Data manipulation ================================ */

    /**
       * Creates an array filled with strings relating to the school years from 2015 until the current year.
       * This procedure is used, only, when we're creating the fitlers for each school year on the topmost portion on the right side of the screen.
       * 
       * @return An array with strings for each school year interval, i.e: an array like ["Todos", "20-21", "18-19", "17-18", "16-17", "15-16"]
       **/
    private GetSchoolYearList(): Array<string> {
        var data = new Array<string>();

        var d = new Date();
        var m = d.getMonth();
        var n = d.getFullYear();

        let y;
        if (m > 7) {
            y = n + 1;
        }
        else {
            y = n;
        }

        let j = 15;
        for (let i = 2015; i < y; i++) {

            data.push('' + j.toString() + '-' + (j + 1).toString());
            j++;
        }
        data.push('Todos');
        data = data.reverse();

        return data;
    }

    /**
 * Creates an array with user data by parsing the array 'databaseData'.
 
 * 
 * @returns An array of objects that RexUI understands and can use to add to the table.
 **/
    private GetTableData(): Array<any> {

        /*
        * This procedure has a quirk that can only be explained by inspecting RexUI's source.
        * To add items to the table, it seems that it is necessary to add them wrapped in an object
        * with a 'name' property (see this function's definition).
        * 
        * Also, currently we're adding the data item by item, where maybe it would be better to add it
        * in chuncks (line by line for example).
        */

        const tableData: Array<any> = [];

        this.databaseData.forEach((u) => {
            tableData.push({ 'name': u });
        });

        return tableData;
    }

    /* ======================== Connection with backend =================== */


    /**
     * Fetches information from the DB and updates the ranking table with that data.
     * If, at the time of invocation, it is not possible to correctly communicate with the DB, then the score table is emptied.
     */
    private UpdateTable(): void {

        /** 
         * This procedure does two things (wich is probably bad practice...):
         * 1 - Attempts to connect to the database.
         * 2 - If connection is done successfully, then it sets the table with the data it got.
         *      Else, it empties the table.
         * 
         * Also, notice how we have to parse what we receive from the database. We don't use the raw data we receive from the DB.
         */


        let connection = GetFilteredTOP(this.dataInicial, this.dataFinal, this.spaceFilter, this.dificultyFilter);

        connection.then((data) => {


            let parsedData = ParsedUpdatedScoreData(data);
            if (parsedData.length < 4)
                this.scoreTable.setItems([]);
            else
                this.scoreTable.setItems(parsedData);

            this.scoreTable.refresh();

        }).catch(function (err) {
            alert("Não foi possível estabelecer ligação. Por favor tente mais tarde.")

        });
    }


}