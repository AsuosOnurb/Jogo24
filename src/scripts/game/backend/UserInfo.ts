export class UserInfo
{
    private m_User: string;
    private m_FirstName: string;
    private m_Class: string;
    private m_School: string;

/**
     * Create inicial loginInfo
     */
    constructor() {
        this.m_User = '';
        this.m_FirstName = '';
        this.m_Class = '';
        this.m_School = '';
    }

    // sessionStorage format:
    // "user": string
    // "firstName": string
    // "turma": string
    // "escola": string

    /**
     * Retrieve data saved in the browser's sessionstorage if it exists
     */
    GetLocalData(){
        if(typeof(Storage) === "undefined") {
            return;
        }
        
        let dataAux = sessionStorage.getItem('loginInfo');
        if(dataAux != null){
            let data = JSON.parse(dataAux);
            this.ParseData(data);
        }

    }

    /**
     * Set browser's sessionstorage accordingly to the current class data
     */
    SetLocalData(){
        
        if(typeof(Storage) === "undefined") {
            return;
        }
        
        let storeInfo = {
            'user': this.m_User, 'firstName': this.m_FirstName,
            'turma': this.m_Class, 'escola': this.m_School};


        let info = JSON.stringify(storeInfo);

        sessionStorage.setItem("loginInfo", info);
    }

    /**
     * Delete user login info
     */
    Logout() {
        this.m_User = '';
        this.m_FirstName = '';
        this.m_Class = '';
        this.m_School = '';
        this.SetLocalData();
    }



    /**
     * Parse retrieve data from browser's sessionstorage
     * @param {JSON} data - retrieved data in Json format
     */
    ParseData(data) {
        if(data['user']){ // returns false if undefined/null
            this.m_User = data['user'];
        }
        if (data['firstName']) { // returns false if undefined/null
            this.m_FirstName = data['firstName'];
        }
        if (data['turma']) { // returns false if undefined/null
            this.m_Class = data['turma'];
        }
        if (data['escola']) { // returns false if undefined/null
            this.m_School = data['escola'];
        }
        
    }

    GetUser() : string
    {
        return this.m_User;
    }

    GetFirstName() : string
    {
        return this.m_FirstName;
    }

    GetClass() : string
    {
        return this.m_Class;
    }

    GetSchool() : string
    {
        return this.m_School;
    }
}