export class UserInfo
{
    private static Instance: UserInfo;
    private static m_User: string;
    private static m_FirstName: string;
    private static m_Class: string;
    private static m_School: string;


    private  constructor() {
        UserInfo.SetUser('');
        UserInfo.SetFirstName('');
        UserInfo.SetClass('');
        UserInfo.SetSchool('');
    }

    static GetInstance() : UserInfo 
    {
        if (!UserInfo.Instance)
        {
            UserInfo.Instance = new UserInfo();
        }
        
        return UserInfo.Instance
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
    static SetLocalData(){
        
        if(typeof(Storage) === "undefined") {
            return;
        }
        
        let storeInfo = {
            'user': UserInfo.GetUser(), 'firstName': UserInfo.GetFirstName(),
            'turma': UserInfo.GetClass(), 'escola': UserInfo.GetSchool()};


        let info = JSON.stringify(storeInfo);

        sessionStorage.setItem("loginInfo", info);
    }

    /**
     * Delete user login info
     */
    Logout() {
        UserInfo.SetUser('');
        UserInfo.SetFirstName('');
        UserInfo.SetClass('');
        UserInfo.SetSchool('');
        UserInfo.SetLocalData();
    }



    /**
     * Parse retrieve data from browser's sessionstorage
     * @param {JSON} data - retrieved data in Json format
     */
    ParseData(data) {
        if(data['user']){ // returns false if undefined/null
            UserInfo.SetUser(data['user']);
        }
        if (data['firstName']) { // returns false if undefined/null
            UserInfo.SetFirstName(data['firstName']);
        }
        if (data['turma']) { // returns false if undefined/null
            UserInfo.SetClass(data['turma']);
        }
        if (data['escola']) { // returns false if undefined/null
            UserInfo.SetSchool(data['escola']);
        }
        
    }

    static GetUser() : string
    {
        return this.m_User;
    }

    static SetUser(user: string) : void 
    {
        this.m_User = user;
    }

    static GetFirstName() : string
    {
        return this.m_FirstName;
    }

    static SetFirstName(fname: string) : void
    {
        this.m_FirstName = fname;
    }

    static  GetClass() : string
    {
        return this.m_Class;
    }

    static SetClass(turma: string) : void
    {
        this.m_Class = turma;
    }

    static GetSchool() : string
    {
        return this.m_School;
    }
    
    static SetSchool(school: string) : void 
    {
        this.m_School = school;
    }
}