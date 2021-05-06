import Phaser from 'phaser'
import { AlignGrid } from '../better/AlignGrid';
import { BetterButton } from '../better/BetterButton';
import { BetterText } from '../better/BetterText';
import {BackendConnection} from '../game/backend/BackendConnection';
import { UserInfo } from '../game/backend/UserInfo';

export class RankingScene extends Phaser.Scene {

    private lastclick;

    private m_Data; // The data object that comes from the main menu
    private m_Backend: BackendConnection;

    private array;

    private jogador;
    private pontos;
    private escola;
    private turma;
    private dataC;

    private ano;
    private dificil;
    private hard_icon;
    private normal;
    private normal_icon;
    private facil: BetterText;
    private easy_icon;
    private dificuldade;


    private m_AlignGrid;

    private di;
    private df;
    private dificulty;
    private flag;
    private table;
    private dropdown;

    private filtro;

    private turma_filtro;
    private turma_icon;

    private todos;
    private todos_icon;

    private escola_filtro;
    private escola_icon;

    private container;

    private title: Phaser.GameObjects.Image;
    private topTitle: Phaser.GameObjects.Image;
    private btn_back: BetterButton;
    private rexUI;


    constructor() {
        super('RankingScene');
    }



  

    preload() {
        this.load.scenePlugin({
            key: 'rexUI',
            url: 'src/scripts/RexUI/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });

        
    }

    init(data) {

        /* Get data passed from the main menu scene */
        this.array = data;
        console.log('==== Entered Ranking Scene =====');
        console.log(this.array);

        
    }

    create() {

        // Blue background
        this.add.image(this.scale.width / 2, this.scale.height / 2, 'blueBackground').setDisplaySize(this.scale.width, this.scale.height);


        // Title imge96
        this.title = this.add.image(this.scale.width / 2, 112, 'title');
        this.title.setScale(0.6, 0.6);

        const gridConfig = {
            'scene': this,
            'cols': 15,
            'rows': 15
        }
        this.m_AlignGrid = new AlignGrid(this.game, gridConfig);
        console.log('Crreated align grid.');
        console.log(this.m_AlignGrid);

        var d = new Date();
        var m = d.getMonth();
        var n = d.getFullYear();
        if (m > 7) {
            var x = n;
            var y = n + 1;
        }
        else {
            var x = n - 1;
            var y = n;
        }

        this.di = x + '-09-01';
        this.df = y + '-08-31';
        this.dificulty = 1;
        this.flag = 2;

        //TABLE
        var scrollMode = 0; // 0:vertical, 1:horizontal

        console.log('======== PRINTING SCEN PLUGIN ====');
        console.log(this.plugins.scenePlugins)
        this.table = this.rexUI.add.gridTable({
            x: 848,
            y: this.scale.height / 2 + 64,

            width: 1560,
            height: 768,

            scrollMode: scrollMode,

            background: this.rexUI.add.roundRectangle(-100, 0, 8, 10, 10, 0xe7a738),

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
                thumb: this.add.image(0, 0, 'sliderThumb').setScale(0.3),
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
                        text: scene.add.text(50, 50, item.name, { fontFamily: 'myfont2', fontSize: 21, color: '#000000', align: 'center' }),
                        align: 'center',
                    });

                return cellContainer;
            },
            items: this.CreateItems(600)
        })
            .layout()

        // this.m_AlignGrid.placeAt(7, 8, this.table);

        

       


        this.container = this.rexUI.add.roundRectangle(0, 0, 216, 768, 10, 0xe7a738);
        this.m_AlignGrid.placeAtIndex(133, this.container);
        this.container.x += 32
        this.container.y -= 10;

        this.lastclick;

        this.dropdown = this.rexUI.add.gridTable({
            x: 1750,
            y: 400,
            width: 180,
            height: 250,

            scrollMode: scrollMode,

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
                thumb: this.rexUI.add.roundRectangle(0, 0, 0, 0, 13, 0x7b5e57),
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

            createCellContainerCallback: function (cell, cellContainer) {

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
                        text: scene.add.text(50, 50, item, { fontFamily: 'myfont2', fontSize: 25, color: '#000000', align: 'center' }),
                        align: 'center',
                        space: {
                            icon: 20,
                        }
                    });


                var m = d.getMonth();
                var n = d.getFullYear();
                if (m > 7) {
                    var x = n;
                    var y = n + 1;
                }
                else {
                    var x = n - 1;
                    var y = n;
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
                        scene.di = '20' + cellContainer.getElement('text')._text.split('-')[0] + '-9-1';
                        scene.df = '20' + cellContainer.getElement('text')._text.split('-')[1] + '-8-31';

                    }
                    else {
                        scene.di = '2015-09-01'
                        scene.df = new Date().toISOString().slice(0, 10)
                    }

                    this.m_Backend.updateTOP(scene.di, scene.df, UserInfo.GetClass(), UserInfo.GetSchool(), scene.flag, scene.dificulty, scene);
                });

                let tmp = xx.slice(2, 4) + '-' + yy.slice(2, 4);
                if (cellContainer.getElement('text')._text == tmp) {
                    scene.lastclick = cellContainer.getElement('icon').setFillStyle('0x000000');
                }

                return cellContainer;


            },
            items: this.selectYear()
        })
            .layout()


        this.ano = new BetterText(this, 0, 0, 'Ano letivo', {fontSize: 25, color: '#403217', align: 'center' });
        this.m_AlignGrid.placeAtIndex(58, this.ano);
        this.ano.x += 32
        //this.ano.y -= 40

        /* Radio button: hard diff */
        this.dificil = new BetterText(this, 0, 0, 'Dificil', {fontSize: 25, color: '#000000', align: 'left' });
        this.m_AlignGrid.placeAtIndex(178, this.dificil);
        this.dificil.x += 32;

        this.hard_icon = this.add.circle(0, 0, 10, 0xffffff);
        this.m_AlignGrid.placeAtIndex(178, this.hard_icon);
        this.hard_icon.x -= 32


        /* Radio button: Normal Diff */
        this.normal = new BetterText(this, 0, 0, 'Normal',{ fontSize: 25, color: '#000000', align: 'left' });
        this.m_AlignGrid.placeAtIndex(178, this.normal);
        this.normal.x += 32;
        this.normal.y += 35;
        

        this.normal_icon = this.add.circle(0, 0, 10, 0xffffff);
        this.m_AlignGrid.placeAtIndex(178, this.normal_icon);
        this.normal_icon.x -= 32;
        this.normal_icon.y += 35;

        /* Radio button: Easy diff */
        this.facil = new BetterText(this, 0, 0, 'Fácil', {fontSize: 25, color: '#000000', align: 'left' });
        this.m_AlignGrid.placeAtIndex(193, this.facil);
        this.facil.x += 32

        this.easy_icon = this.add.circle(0, 0, 10, 0xffffff);
        this.m_AlignGrid.placeAtIndex(193, this.easy_icon);
        this.easy_icon.x -= 32

        this.dificuldade = new BetterText(this, 0, 0, 'Dificuldade', {fontSize: 25, color: '#403217', align:'center' });
        this.m_AlignGrid.placeAtIndex(163, this.dificuldade);
        this.dificuldade.x += 32
        this.dificuldade.y += 32


        this.facil.setInteractive({ useHandCursor: true });
        this.facil.input.hitArea.setTo(-50, -5, this.facil.width + 60, this.facil.height);
        this.facil.on('pointerdown', () => {
            this.hard_icon.setFillStyle('0xffffff');
            this.normal_icon.setFillStyle('0xffffff');
            this.easy_icon.setFillStyle('0x000000');
            this.dificulty = 1;
            this.m_Backend.updateTOP(this.di, this.df, UserInfo.GetClass(), UserInfo.GetSchool(), this.flag, this.dificulty, this);

        });

        this.normal.setInteractive({ useHandCursor: true });
        this.normal.input.hitArea.setTo(-50, -5, this.normal.width + 60, this.normal.height);

        this.normal.on('pointerdown', () => {
            this.hard_icon.setFillStyle('0xffffff');
            this.normal_icon.setFillStyle('0x000000');
            this.easy_icon.setFillStyle('0xffffff');
            this.dificulty = 2;
            this.m_Backend.updateTOP(this.di, this.df, UserInfo.GetClass(), UserInfo.GetSchool(), this.flag, this.dificulty, this);
        });

        this.dificil.setInteractive({ useHandCursor: true });
        this.dificil.input.hitArea.setTo(-50, -5, this.dificil.width + 60, this.dificil.height);
        this.dificil.on('pointerdown', () => {
            this.hard_icon.setFillStyle('0x000000');
            this.normal_icon.setFillStyle('0xffffff');
            this.easy_icon.setFillStyle('0xffffff');
            this.dificulty = 3;
            this.m_Backend.updateTOP(this.di, this.df,UserInfo.GetClass(), UserInfo.GetSchool(), this.flag, this.dificulty, this);
        });

        this.filtro = new BetterText(this, 0,0, 'Filtro', { fontSize: 25, color: '#403217' });
        this.filtro.setOrigin(0, 0.5);
        this.m_AlignGrid.placeAtIndex(163.3, this.filtro);



        this.turma_filtro = new BetterText(this, 0,0, 'Turma', {fontSize: 25, color: '#000000', align: 'left' });
        this.turma_filtro.setOrigin(-0.5, -1.3);
        this.m_AlignGrid.placeAtIndex(178, this.turma_filtro);
        this.turma_icon = this.add.circle(0, 0, 10,0xffffff);

        this.turma_icon.setOrigin(0.5, -2.7);
        this.m_AlignGrid.placeAtIndex(178, this.turma_icon);


        
        this.escola_filtro = new BetterText(this, 0, 0, 'Escola', { fontSize: 25, color: '#000000', align: 'left' });

        this.escola_filtro.setOrigin(-0.45, -0.05);
        this.m_AlignGrid.placeAtIndex(178, this.escola_filtro);
        this.escola_icon = this.add.circle(0, 0, 10, 0xffffff);

        this.escola_icon.setOrigin(0.5, -0.5);
        this.m_AlignGrid.placeAtIndex(178, this.escola_icon);

        this.todos = new BetterText(this, 0, 0, 'Todos', {fontSize: 25, color: '#000000', align: 'left' });


        this.todos.setOrigin(-0.5, 1.4);

        this.m_AlignGrid.placeAtIndex(178, this.todos);
        this.todos_icon = this.add.circle(0, 0, 10, 0xffffff);

        this.todos_icon.setOrigin(0.5, 2);
        this.m_AlignGrid.placeAtIndex(178, this.todos_icon);

        this.todos.setInteractive({ useHandCursor: true });
        this.todos.input.hitArea.setTo(-50, -5, this.todos.width + 60, this.todos.height);
        this.todos.on('pointerdown', () => {

            this.todos_icon.setFillStyle('0x000000');

            this.escola_icon.setFillStyle('0xffffff');

            this.turma_icon.setFillStyle('0xffffff');

            this.flag = 2;
            this.m_Backend.updateTOP(this.di, this.df, UserInfo.GetClass(), UserInfo.GetSchool(), this.flag, this.dificulty, this);

        });

        this.escola_filtro.setInteractive({ useHandCursor: true });
        this.escola_filtro.input.hitArea.setTo(-50, -5, this.escola_filtro.width + 60, this.escola_filtro.height);
        this.escola_filtro.on('pointerdown', () => {

            this.todos_icon.setFillStyle('0xffffff');

            this.escola_icon.setFillStyle('0x000000');

            this.turma_icon.setFillStyle('0xffffff');

            this.flag = 1;
            this.m_Backend.updateTOP(this.di, this.df, UserInfo.GetClass(), UserInfo.GetSchool, this.flag, this.dificulty, this);
        });
        this.turma_filtro.setInteractive({ useHandCursor: true });
        this.turma_filtro.input.hitArea.setTo(-50, -5, this.turma_filtro.width + 60, this.turma_filtro.height);
        this.turma_filtro.on('pointerdown', () => {

            this.todos_icon.setFillStyle('0xffffff');

            this.escola_icon.setFillStyle('0xffffff');

            this.turma_icon.setFillStyle('0x000000');

            this.flag = 0;

            this.m_Backend.updateTOP(this.di, this.df, UserInfo.GetClass, UserInfo.GetSchool, this.flag, this.dificulty, this);
        });

        this.todos_icon.setFillStyle('0x000000');
        this.easy_icon.setFillStyle('0x000000');


        if (UserInfo.GetUser() == '') {
            this.filtro.visible = false;
            this.turma_filtro.visible = false;
            this.turma_icon.visible = false;
            this.escola_filtro.visible = false;
            this.escola_icon.visible = false;
            this.todos.visible = false;
            this.todos_icon.visible = false;
        }





        this.events.on('transitionstart', (fromScene, duration) => {

            this.table.y += this.scale.height;
            this.jogador.y += this.scale.height;
            this.pontos.y += this.scale.height;
            this.escola.y += this.scale.height;
            this.turma.y += this.scale.height;
            this.dataC.y += this.scale.height;
            this.dropdown.y += this.scale.height;
            this.ano.y += this.scale.height;
            this.dificil.y += this.scale.height;
            this.hard_icon.y += this.scale.height;
            this.normal.y += this.scale.height;
            this.normal_icon.y += this.scale.height;
            this.facil.y += this.scale.height;
            this.easy_icon.y += this.scale.height;
            this.dificuldade.y += this.scale.height;
            this.filtro.y += this.scale.height;
            this.turma_filtro.y += this.scale.height;
            this.turma_icon.y += this.scale.height;
            this.escola_filtro.y += this.scale.height;
            this.escola_icon.y += this.scale.height;
            this.todos.y += this.scale.height;
            this.todos_icon.y += this.scale.height;
            this.container.y += this.scale.height;

            this.tweens.add({
                delay: 1000,
                targets: [this.table,  this.jogador, 
                                this.pontos, this.escola, this.turma, 
                                this.dataC, this.dropdown, this.ano, 
                                this.dificil, this.hard_icon, this.normal, 
                                this.normal_icon, this.facil, this.easy_icon, 
                                this.dificuldade, this.filtro, this.turma_filtro, 
                                this.turma_icon, this.escola_filtro, this.escola_icon, 
                                this.todos, this.todos_icon, this.container],
                durantion: 5000,
                y: '-=' + this.scale.height,
                ease: 'Power2',
            });

        }, this);

        this.jogador = new BetterText(this, 0, 0, 'Jogador', { fontFamily: 'myfont3', fontSize: 40, color: '#403217' });

        this.pontos = new BetterText(this, 0, 0, 'Pontos',   {fontSize: 40, color: '#403217' });

        this.escola = new BetterText(this, 0, 0, 'Escola',   {fontSize: 40, color: '#403217' });

        this.turma = new BetterText(this, 0, 0, 'Turma',   {fontSize: 40, color: '#403217' });

        this.dataC = new BetterText(this, 0, 0, 'Data',   {fontSize: 40, color: '#403217' });



        this.m_AlignGrid.placeAtIndex(61, this.jogador);
        this.m_AlignGrid.placeAtIndex(63, this.pontos);
        this.m_AlignGrid.placeAtIndex(66, this.escola);
        this.m_AlignGrid.placeAtIndex(69, this.turma);
        this.m_AlignGrid.placeAtIndex(71, this.dataC);

        // this.m_AlignGrid.showNumbers();


    }

    CreateItems(count) {
        var data =  new Array<object> ();
        for (var i = 0; i < count; i++) {
            if (this.array[i] != '') {
                data.push({
                    name: this.array[i],
                });
            }
        }
        if (this.array.length < 4) {
            return []
        }
        return data;
    }

    selectYear() {
        var data = new Array<string> ();

        var d = new Date();
        var m = d.getMonth();
        var n = d.getFullYear();
        if (m > 7) {
            var x = n;
            var y = n + 1;
        }
        else {
            var x = n - 1;
            var y = n;
        }
        let di = x + '-09-01';
        let df = y + '-08-31';
        let j = 15;
        for (let i = 2015; i < y; i++) {

            data.push('' + j.toString() + '-' + (j + 1).toString());
            j++;
        }
        data.push('Todos');
        data = data.reverse();
        return data;
    }








}
