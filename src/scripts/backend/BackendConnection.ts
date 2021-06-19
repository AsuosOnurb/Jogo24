// BackendConnection.ts
/**
 * Module responsible for the implementation of the interface with the game's backend.
 * @module
 */


import { LoginData } from "./LoginData";

import * as $ from 'jquery';

export enum DifficultyFilter  {
    Easy = 1,
    Medium = 2,
    Hard = 3

}

export enum SpaceFilter 
{
    Class = 0,
    School = 1,
    All = 2,
}


/* ======================== Login System ========================= */

/**
 * Attempts to login the user.
 * @param username The user's username
 * @param password The user's password
 * @return Returns a promise of a string with the user's login data (name, school, class)
 */
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
 * Attempts to logout the user.
 */
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


/* ============================= Ranking Scene Scores ===================================== */

/**
 * Gets, from the DB, a (big) string with all user's data in a given date interval.
 * @param di The initial date of the time interval.
 * @param df The final date of the time interval.
 * 
 * @return Returns a promise of that data.
 * 
 */
export function GetGlobalTOP(di: string, df: string) {
    return new Promise(function (resolve, reject) {
        $.ajax
            ({
                type: "POST",
                url: "https://www.hypatiamat.com/newHRecords.php",

                data: 
                    `action=mostraNew
                    &anoLi=${di} 
                    &anoLf=${df}
                    &mturma=
                    &mescola=
                    &flag=${SpaceFilter.All}
                    &tip=${DifficultyFilter.Easy}
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

/**
 * Gets, from the DB, a (big) string with all user's data in a given date interval.
 * @param di The initial date of the time interval.
 * @param df The final date of the time interval.
 * 
 * @return Returns a promise of that data.
 * 
 * @remarks This function is used only when we're trying ot update the score table with different filters.
 * 
 */
export function GetFilteredTOP(di: string, df: string, flag: SpaceFilter, tipoTOP: DifficultyFilter) {
    let classCode: string = LoginData.GetClass();
    let schoolCode: string = LoginData.GetSchool();

    return new Promise(function (resolve, reject) {
        $.ajax
            ({
                type: "POST",
                url: "https://www.hypatiamat.com/newHRecords.php",

                data: 
                    `action=mostraNew
                    &anoLi=${di}
                    &anoLf=${df}
                    &mturma=${classCode}
                    &mescola=${schoolCode}
                    &flag=${flag}
                    &tip=${tipoTOP}
                    &tC=jogo24HypatiaTOP`,

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


/* ============================= Getting and Sending Scores ===================================== */

/**
 * Gets, from the DB, the most updated scores.
 * @param score The score that the player got.
 * @param diff The difficulty of the game.
 * @returns A promise of an object containing different kinds of scores.
 * 
 * @remarks This is useful in the singleplayer game, when we want to check if the player got a PB and things like that.
 * We need to perform this update because new scores can be added while the user is playing.
 */
export function GetUpdatedScores(score: number, diff: number) {
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
/**
 * Sends/Registers the player score to the DB.
 * @param score The score to send/register.
 * @param diff The difficulty mode of the game.
 * @returns A promise 
 */
export function UpdateScore(score: number, diff: number) {

    const userUsername = LoginData.GetUser();
    const userSchool = LoginData.GetSchool();
    const userClass = LoginData.GetClass();

    return new Promise(function (resolve, reject) {
        $.ajax
            ({
                type: "POST",
                url: "https://www.hypatiamat.com/newHRecords.php",

                data: 
                    `action=insere&musername=${userUsername}
                    &mturma=${userClass}
                    &mescola=${userSchool}
                    &mpontuacao=${score}
                    &mtipo=${diff}
                    &t=jogo24Hypatia&tC=jogo24HypatiaTOP`,

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





