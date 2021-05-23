export class PlayerData {
    private static m_TimesPlayed: number;
    private static m_TotalWins: number;
    private static m_TotalLosses: number;

    private static readonly m_DATA_NAME: string = "Jogo24Data";

    constructor() {
        PlayerData.m_TimesPlayed = 0;
        PlayerData.m_TotalWins = 0;
        PlayerData.m_TotalLosses = 0;
    }

    /**
       * Retrieve data saved in the browser's localstorage if it exists
       */
    GetLocalData() {
        if (typeof (Storage) === "undefined") {
            return;
        }

        let dataAux = localStorage.getItem(PlayerData.m_DATA_NAME);
        if (dataAux != null) {
            let data = JSON.parse(dataAux);
            this.ParseData(data);
        }

    }

    /**
     * Set browser's localstorage accordingly to the current class data
     */
    SetLocalData() {

        if (typeof (Storage) === "undefined") {
            return;
        }

        let storeInfo = {
            'timesPlayed': PlayerData.m_TimesPlayed, 
            'totalWins': PlayerData.m_TotalWins,
            'totalLosses': PlayerData.m_TotalLosses
        };


        let info = JSON.stringify(storeInfo);
        localStorage.setItem(PlayerData.m_DATA_NAME, info);
    }

    /**
     * Parse and retrieve data from browser's localstorage
     * @param {JSON} data - retrieved data in Json format
     */
    ParseData(data) {

        console.log("Player data on local storage: ")
        console.log(data);

        /*
        if (Number.isInteger(data['played'])) { // returns false if undefined/null
            this.played = data['played'];
        }
    
        if (Array.isArray(data['totalWins'])
            && data['totalWins'].length == 3
            && this.checkArrayInteger(data['totalWins'])) {

            PlayerData.m_TotalWins = data['totalWins'].slice();
        }

        if (Array.isArray(data['totalLosses'])
            && data['totalLosses'].length == 3
            && this.checkArrayInteger(data['totalLosses'])) {

            PlayerData.m_TotalLosses =  data['totalLosses'].slice();
        }
        */

    }

    /**
     * Check if array only contains integers
     * @param {array} arr - array to check
     * @return {boolean} boolean value of the operation, true -> array only has integers
     */
    CheckArrayInteger(arr) {

        for (let i = 0; i < arr.length; i++) {
            if (!Number.isInteger(arr[i]) || arr[i] < 0) {
                return false;
            }
        }
        return true;
    }

}