import { LoginData } from "./LoginData";

import * as $ from 'jquery';
import { ParseScoreData } from "./BackendUtils";

export class BackendConnection {

    private static Instance: BackendConnection;
    private static mPontuacao;
    private static mPontuacaoGlobal;


    private constructor() {

    }

    GetInstance(): BackendConnection {
        if (!BackendConnection.Instance)
            BackendConnection.Instance = new BackendConnection();

        return BackendConnection.Instance;
    }

    GetUserInfoInstance(): LoginData {
        return LoginData.GetInstance();
    }

    /**
     * Login user
     * @param {string} username Name to try to login with
     * @param {string} password Password to try to login with
     * @param {Phaser.Scene} scene scope in with the login is being made
     */
    static Login(username, password) {

        $.ajax
            ({
                type: "POST",
                url: "https://www.hypatiamat.com/loginActionVH.php",
                data: "action=dologin&u=" + username + "&p=" + password,
                crossDomain: true,
                cache: false,

                success: (response) => {
                    if (response != "false") {

                        LoginData.SetUser(response.split(",")[0]);
                        LoginData.SetFirstName(response.split(",")[1]);
                        LoginData.SetSchool(response.split(",")[2]);
                        LoginData.SetClass(response.split(",")[3]);

                        LoginData.SetLocalData();
                    }

                },
                error: (response) => {
                    LoginData.SetUser('');
                    alert("Falha de ligação, por favor verifique a sua conexão")
                }
            })
    };



    /**
     * Check if there is an active session
     */
    static SessionVerify() {
        $.ajax
            ({
                type: "POST",
                url: "https://www.hypatiamat.com/loginActionVH.php",
                data: "action=verify",
                cache: false,
                success: function (response) {
                    if (response != "not") {
                        LoginData.SetUser(response.split(",")[0]);
                        LoginData.SetFirstName(response.split(",")[1]);
                        LoginData.SetSchool(response.split(",")[2]);
                        LoginData.SetClass(response.split(",")[3]);
                        LoginData.SetLocalData();
                    }
                    else {
                        LoginData.SetUser("");
                        return;

                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    LoginData.SetUser("");
                    alert("Falha de ligação, por favor verifique a sua conexão")
                }
            })
    }

    static DestroySession() {
        $.ajax
            ({
                type: "POST",
                url: "https://www.hypatiamat.com/loginActionVH.php",
                data: "action=des",
                cache: false,
                success: function (response) {
                    LoginData.Logout();
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    LoginData.SetUser("");
                    alert("Falha de ligação, por favor verifique a sua conexão")
                }
            })
    }


    static GetTOP(di, df, globalCodTurma, globalCodEscola, tipoTOP) {
        return new Promise(function (resolve, reject) {
            $.ajax
                ({
                    type: "POST",
                    url: "https://www.hypatiamat.com/newHRecords.php",

                    data: "action=mostraNewA&anoLi=" + di +
                        "&anoLf=" + df +
                        "&mturma=" + globalCodTurma +
                        "&mescola=" + globalCodEscola +
                        "&flag=2" +
                        "&tip=" + tipoTOP +
                        "&tC=trapbeeTOP",
                    crossDomain: true,
                    cache: false,
                    success: function (data) {
                        resolve(data)
                    },

                    error: function (err) {
                        reject(err);
                    }
                });
        });

       


    }


    static UpdateTOP(di, df, globalCodTurma, globalCodEscola, flag, tipoTOP) {
        let data;
        let success: boolean = false;
        $.ajax
            ({
                type: "POST",
                url: "https://www.hypatiamat.com/newHRecords.php",
                data: "action=mostraNewA&anoLi=" + di + "&anoLf=" + df +
                    "&mturma=" + globalCodTurma +
                    "&mescola=" + globalCodEscola +
                    "&flag=" + flag + "&tip=" + tipoTOP + "&tC=jogo24HypatiaTOP",
                crossDomain: true,
                cache: false,
                success: function (response) {
                    data = [];
                    let j = 0;
                    response = response.split('&');
                    for (let i = 0; i < response.length; i++) {
                        response[i] = response[i].split('=')[1];
                        if (i % 5 == 0) {
                            j++;
                            response[i] = response[i].split(" ");
                            if (response[i].length == 1) {

                                response[i] = response[i][0];
                            }
                            else {
                                response[i] = response[i][0] + " " + response[i][response[i].length - 1];
                            }
                            data.push({
                                name: j
                            });
                        }
                        if (i % 5 == 2) {
                            response[i] = response[i].replace("Agrupamento de Escolas", "A.E.");
                        }
                        data.push({
                            name: response[i]
                        });

                    }

                    success = true;
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    data = [];
                    alert("Falha de ligação, por favor verifique a sua conexão");
                    success = false;
                }
            })

        return { success, data };
    }



    static VerificaRecords(username, globalCodTurma, globalCodEscola, pontuacao, tipoTOP, scene) {

        $.ajax
            ({
                type: "POST",
                url: "https://www.hypatiamat.com/newHRecords.php",
                data: "action=maximoGlobal&codAl=" + username +
                    "&codTurma=" + globalCodTurma +
                    "&codEscola=" + globalCodEscola +
                    "&pont=" + pontuacao + "&tip=" + tipoTOP +
                    "&t=jogo24Hypatia&tC=jogo24HypatiaTOP",
                crossDomain: true,
                cache: false,
                success: function (response) {
                    var data = new Array<number>();

                    data.push(parseFloat(response.split("vlMin4=")[1]));               //melhor resultado pessoal
                    data.push(parseFloat(response.split("vlMin3=")[1].split("&")[0])); //minimo da turma
                    data.push(parseFloat(response.split("vlMin2=")[1].split("&")[0])); //minimo da escola
                    data.push(parseFloat(response.split("vlMin1=")[1].split("&")[0])); //minimo global - TOP 100 

                    scene.endText = scene.add.text(0, 0, '', { fontStyle: 'bold', fontSize: 40, color: '#463516', wordWrap: { width: 700, useAdvancedWrap: true }, align: 'center' });
                    scene.endText.setOrigin(0.4, 0.5);
                    scene.aGrid.placeAtIndex(136, scene.endText);

                    pontuacao = parseFloat(pontuacao);

                    if (pontuacao > 0 && scene.ended == 1) {
                        scene.endText.setText("Parabéns!");
                        scene.endText2 = scene.add.text(0, 0, " ", { fontSize: 40, color: '#463516', wordWrap: { width: 700, useAdvancedWrap: true }, align: 'center' });
                        scene.endText2.setOrigin(0.4, 0.5);
                        scene.aGrid.placeAtIndex(220, scene.endText2);

                        if (LoginData.GetUser() != '') {
                            if (data[0] > pontuacao && pontuacao > 0) {
                                if (data[3] > pontuacao) {//top global
                                    scene.endText2 = scene.endText2.setText(username + ", conseguiste um novo record ABSOLUTO! Com " + pontuacao + " pontos. Vê o teu resultado no TOP 100 absoluto.");
                                }
                                else if (data[2] > pontuacao) {//top escola
                                    scene.endText2 = scene.endText2.setText(0, 0, username + ", conseguiste um novo record na tua escola!\n " + "Com " + pontuacao + " pontos. Vê o teu resultado no TOP 100 da tua escola.");
                                }
                                else if (data[1] > pontuacao) { // top turma
                                    scene.endText2 = scene.endText2.setText(0, 0, username + ", conseguiste um novo record na tua turma!\n" + "Com " + pontuacao + " pontos. Vê o teu resultado no TOP 100 da tua turma.");
                                }
                                else { // top pessoal
                                    scene.endText2.setText(username + ", conseguiste melhorar o teu resultado  anterior, no entanto,\n ainda não conseguiste\nentrar no TOP 100.\nTenta outra vez.");

                                }
                            }

                            else {
                                scene.endText2 = scene.setText(username + " obtiveste " + pontuacao + " pontos.\nNão conseguiste melhorar o \nteu resultado anterior (o teu melhor \nresultado é " + data[0] + " pontos).\n    Tenta outra vez.");
                            }

                        }

                        else {
                            if (data[3] > pontuacao && pontuacao > 0) {

                                scene.endText2 = scene.endText2.setText("Se estivesses registado o teu nome figuraria no TOP 100 absoluto com " + pontuacao + " pontos.\nRegista - te em \nwww.hypatiamat.com.");
                                scene.endText2.setOrigin(0.4, 0.5);

                            }
                            else {
                                scene.endText2 = scene.endText2.setText("Para que o teu nome figure nos TOPs tens de estar registado.\n Regista - te em\n  www.hypatiamat.com.");
                                scene.endText2.setOrigin(0.4, 0.5);


                            }
                        }

                    }

                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    if (scene.ended == 1) {
                        scene.endText = scene.add.text(0, 0, 'Erro de ligação', { fontSize: 40, color: '#463516' });
                        scene.endText.setOrigin(0.5, 0.5);
                        scene.aGrid.placeAtIndex(157, scene.endText);
                        scene.endText2 = scene.add.text(0, 0, 'Verifica o estado da ligação á internet', { fontSize: 40, color: '#463516' });
                        scene.endText2.setOrigin(0.45, 0.5);
                        scene.aGrid.placeAtIndex(220, scene.endText2);
                    }

                }
            })

    }


    static GravaRecords(username, globalCodTurma, globalCodEscola, pontuacao, tipoTop) {

        $.ajax
            ({
                type: "POST",
                url: "https://www.hypatiamat.com/newHRecords.php",
                data: "action=insereA&musername=" + username +
                    "&mturma=" + globalCodTurma +
                    "&mescola=" + globalCodEscola +
                    "&mpontuacao=" + pontuacao +
                    "&mtipo=" + tipoTop +
                    "&t=jogo24Hypatia&tC=jogo24HypatiaTOP",
                crossDomain: true,
                cache: false,
                success: function (response) {
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert("Falha de ligação, por favor verifique a sua conexão");
                }
            });
    }



    static GetRecords(username, globalCodTurma, globalCodEscola, tipoTOP, scene) {

        $.ajax
            ({
                type: "POST",
                url: "https://www.hypatiamat.com/newHRecords.php",
                data: "action=maximoGlobal&codAl=" + username +
                    "&codTurma=" + globalCodTurma +
                    "&codEscola=" + globalCodEscola +
                    "&pont=" + 0 +
                    "&tip=" + tipoTOP +
                    "&t=trapbeeHypatia&tC=trapbeeTOP",
                crossDomain: true,
                cache: false,
                success: (response) => {

                    this.mPontuacao = parseFloat(response.split("vlMin4=")[1]);               //melhor resultado pessoal

                    this.mPontuacaoGlobal = parseFloat(response.split("vlMin1=")[1].split("&")[0]); //minimo global - TOP 100 


                    if (response.split("vlMin4=")[1] <= (response.split("vlMin1=")[1].split("&")[0]) && this.mPontuacao > 0) {
                        scene.recordTOP.visible = true;
                        scene.record.visible = false;

                    }
                    scene.recorde = scene.recorde.setText(response.split("vlMin4=")[1].slice(0, 4));

                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    if (scene.ended == 1) {
                        alert("Falha de ligação, por favor verifique a sua conexão");
                    }
                }
            })

    }


    private static Sync_GetTOP(di, df, globalCodTurma, globalCodEscola, tipoTOP) {
        
    }
}




