import { LoginData } from "./LoginData";

import * as $ from 'jquery';


/* ======================== Login System ========================= */

export function Login(username: string, password: string) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: "POST",

            url: "https://www.hypatiamat.com/loginActionVH.php",
            
            data: "action=dologin&u=" + 
            username + "&p=" + password,

            crossDomain: true,
            cache: false,

            success: function (data) {
                resolve(data)

            },

            error: function (err) {
                reject(err);
            }
        })
    });

};



/**
 * Check if there is an active session
 */
/*
 export function SessionVerify() {
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
}*/

export function DestroySession() {
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


/* ============================= Scores ===================================== */

export function GetTOP(di: string, df: string) {
    return new Promise(function (resolve, reject) {
        $.ajax
            ({
                type: "POST",
                url: "https://www.hypatiamat.com/newHRecords.php",

                data: `action=mostraNew&anoLi=${di} 
                    &anoLf=${df}
                    &mturma=
                    &mescola=
                    &flag=2
                    &tip=1
                    &tC=jogo24HypatiaTOP`,
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


export function UpdateTOP(di, df, flag, tipoTOP) {
    let classCode: string = LoginData.GetClass();
    let schoolCode: string = LoginData.GetSchool();

    return new Promise(function (resolve, reject) {
        $.ajax
            ({
                type: "POST",
                url: "https://www.hypatiamat.com/newHRecords.php",
                data: "action=mostraNew&anoLi=" + di + "&anoLf=" + df +
                    "&mturma=" + classCode +
                    "&mescola=" + schoolCode +
                    "&flag=" + flag + "&tip=" + tipoTOP + "&tC=jogo24HypatiaTOP",
                crossDomain: true,
                cache: false,
                success: function (data) {
                    resolve(data)
                },

                error: function (err) {
                    reject(err)
                }
            });
    });


}

export function VerifyScore(score, diff) {
    const username = LoginData.GetUser();
    const school = LoginData.GetSchool();
    const _class = LoginData.GetClass();

    return new Promise(function (resolve, reject) {
        $.ajax
            ({
                type: "POST",
                url: "https://www.hypatiamat.com/newHRecords.php",
                data: "action=minimoGlobal&codAl=" + username +
                    "&codTurma=" + _class +
                    "&codEscola=" + school +
                    "&pont=" + score +
                    "&tip=" + diff +
                    "&t=jogo24Hypatia&tC=jogo24HypatiaTOP",
                crossDomain: true,
                cache: false,
                success: function (data) {

                    const scores =
                    {
                        'personalBest': parseFloat(data.split("vlMin4=")[1]),
                        'classBest': parseFloat(data.split("vlMin3=")[1].split("&")[0]),
                        'schoolBest': parseFloat(data.split("vlMin2=")[1].split("&")[0]),
                        'top100GlobalBest': parseFloat(data.split("vlMin1=")[1].split("&")[0])
                    };

                    resolve(scores);
                },
                error: function (err) {
                    reject(err);
                }
            });
    });


}

/* Tipar função */
export function GravaRecords(score, diff) {

    const username = LoginData.GetUser();
    const school = LoginData.GetSchool();
    const _class = LoginData.GetClass();




    return new Promise(function (resolve, reject) {
        $.ajax
            ({
                type: "POST",
                url: "https://www.hypatiamat.com/newHRecords.php",
                data: "action=insere&musername=" + username +
                    "&mturma=" + _class +
                    "&mescola=" + school +
                    "&mpontuacao=" + score +
                    "&mtipo=" + diff +
                    "&t=jogo24Hypatia&tC=jogo24HypatiaTOP",
                crossDomain: true,
                cache: false,
                success: function (data) {
                    resolve(data);
                },
                error: function (err) {
                    reject(err);
                }
            });
    });

}

export function GetRecords(diff) {
    const username = LoginData.GetUser();
    const _class = LoginData.GetClass();
    const school = LoginData.GetSchool();



    return new Promise(function (resolve, reject) {

        $.ajax({
            type: "POST",
            url: "https://www.hypatiamat.com/newHRecords.php",
            data: "action=minimoGlobal&codAl=" + username +
                "&codTurma=" + _class +
                "&codEscola=" + school +
                "&pont=" + 0 +
                "&tip=" + diff +
                "&t=jogo24Hypatia&tC=jogo24HypatiaTOP",
            crossDomain: true,
            cache: false,
            success: function (data) {



                const scores =
                {
                    'personalBest': parseFloat(data.split("vlMin4=")[1]),
                    'classBest': parseFloat(data.split("vlMin3=")[1].split("&")[0]),
                    'schoolBest': parseFloat(data.split("vlMin2=")[1].split("&")[0]),
                    'top100GlobalBest': parseFloat(data.split("vlMin1=")[1].split("&")[0])
                };

                resolve(scores);


            },
            error: function (err) {
                reject(err)
            }
        });
    });

}





