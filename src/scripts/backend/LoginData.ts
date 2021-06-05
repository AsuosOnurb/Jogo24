import { ParseLoginData } from "./BackendUtils";


export class LoginData {
    private static Instance: LoginData;
    private static m_User: string;
    private static m_FirstName: string;
    private static m_Class: string;
    private static m_School: string;


    private constructor() {
        LoginData.SetUser('');
        LoginData.SetFirstName('');
        LoginData.SetClass('');
        LoginData.SetSchool('');
    }

    static GetInstance(): LoginData {
        if (!LoginData.Instance) {
            LoginData.Instance = new LoginData();
        }

        return LoginData.Instance
    }

    // sessionStorage format:
    // "user": string
    // "firstName": string
    // "turma": string
    // "escola": string

    /**
     * Retrieve data saved in the browser's sessionstorage if it exists
     */
    static GetLocalData() {
        
       

    }

    /**
     * Set browser's sessionstorage accordingly to the current class data
     */
    static SetLocalData() {

        if (typeof (Storage) === "undefined") {
            return;
        }

        let storeInfo = {
            'user': LoginData.GetUser(), 'firstName': LoginData.GetFirstName(),
            'turma': LoginData.GetClass(), 'escola': LoginData.GetSchool()
        };


        let info = JSON.stringify(storeInfo);

        sessionStorage.setItem("loginInfo", info);
    }

    /**
     * Delete user login info
     */
    static Logout() {
        LoginData.SetUser('');
        LoginData.SetFirstName('');
        LoginData.SetClass('');
        LoginData.SetSchool('');
        LoginData.SetLocalData();
    }



    /**
     * Parse retrieve data from browser's sessionstorage
     * @param {JSON} data - retrieved data in Json format
     */
    private static ParseData(data: JSON) {
        if (data['user']) { // returns false if undefined/null
            LoginData.SetUser(data['user']);
        }
        if (data['firstName']) { // returns false if undefined/null
            LoginData.SetFirstName(data['firstName']);
        }
        if (data['turma']) { // returns false if undefined/null
            LoginData.SetClass(data['turma']);
        }
        if (data['escola']) { // returns false if undefined/null
            LoginData.SetSchool(data['escola']);
        }

    }

    static GetUser(): string {
        return this.m_User;
    }

    static SetUser(user: string): void {
        this.m_User = user;
    }

    static GetFirstName(): string {
        return this.m_FirstName;
    }

    static SetFirstName(fname: string): void {
        this.m_FirstName = fname;
    }

    static GetClass(): string {
        return this.m_Class;
    }

    static SetClass(turma: string): void {
        this.m_Class = turma;
    }

    static GetSchool(): string {
        return this.m_School;
    }

    static SetSchool(school: string): void {
        this.m_School = school;
    }

    static LoginWithData(data) {
        const loginData = ParseLoginData(data);

        if (loginData === "WRONG_PASSWORD") {
            alert("Utilizador ou Password Errados");
            return false;
        }
        else {
            this.m_User = loginData['user'];
            this.m_FirstName = loginData['firstName'];
            this.m_Class = loginData['turma'];
            this.m_School = loginData['escola'];
            return true;
        }

    }

    static IsLoggedIn() : boolean 
    {
        return this.m_User != '';
    }
}