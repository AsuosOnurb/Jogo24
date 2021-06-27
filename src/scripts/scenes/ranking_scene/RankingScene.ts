// RankingScene.ts
/**
 * Module responsible for the implementation of the Ranking/TOP scene.
 * @module
 */



import Phaser from 'phaser'
import { AlignGrid } from '../../utils/external/AlignGrid'
import { BetterButton } from '../../components/BetterButton';
import { BetterText } from '../../components/BetterText';
import { LoginData } from '../../backend/LoginData';
import { ParsedUpdatedScoreData, ParseScoreData } from '../../backend/BackendUtils';
import { GetGlobalTOP, GetFilteredTOP, SpaceFilter, DifficultyFilter } from '../../backend/BackendConnection';
import { ScoreTable } from './ScoreTable';

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

    private scoreTable: ScoreTable;

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
        this.dataInicial = `${x}-09-01`;
        this.dataFinal = `${y}-08-31`;
        this.dificultyFilter = DifficultyFilter.Easy;
        this.spaceFilter = SpaceFilter.All;

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

       
        this.scoreTable = new ScoreTable(this);
       

    }

    /* ======================= Scnene construction (visual side of things ) ======================== */


    /**
     * Starts the whole scene creation process.
     * At the end of execution, the scene is completely done and ready for interaction.
     */
    private CompleteScene(): void {

        // Setup the table 
        this.CreateTable();

        // Setup the filter on the right side of the screen
        /*
        this.SetupFilter();
        this.SetupYearFilterDropdown();

        if (!LoginData.IsLoggedIn()) {
            this.HideUserFilter();
        }
        */
    }



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

    



    /* ================================ Data manipulation ================================ */

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

    /* ================================ Connection with backend ================================ */


}