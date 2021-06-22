// LoginData.ts
/**
 * Module responsible for the implementation of the LoginData utility object.
 * @module
 */



import { Login } from "./BackendConnection";
import { ParseLoginData } from "./BackendUtils";


/**
 * The class that models a LoginData object.
 * 
 * At any moment, there can only be one instance of this object (it's a singleton).
 * 
 * To get this object we use the GetInstance() function.
 */
export class LoginData {


    /**
     * The current (and only one) instance of the LoginData type.
     */
    private static Instance: LoginData;

    /**
     * The username of the currently logged in user.
     */
    private username: string;

    /**
     * The first name of the currently logged in user.
     */
    private firstName: string;

    /**
     * The class of the currently logged in user.
     */
    private userClass: string;

    /**
     * The school of the currently logged in user.
     */
    private school: string;

    /**
     * Whether or not the user is currently logged in.
     */
    private isLoggedIn: boolean = false;


    /**
     * Gets the currently running instance of the LoginData object.
     * If none currently exists, the one gets created and then returned.
     * @returns The instance of the singleton LoginData.
     */
    static GetInstance(): LoginData {
        if (!LoginData.Instance) {
            LoginData.Instance = new LoginData();
        }

        return LoginData.Instance
    }

    static LoginWithData(data) {
        const loginData = ParseLoginData(data);

        if (loginData === "WRONG_PASSWORD") {
            alert("Utilizador ou Password Errados");
            return false;
        }
        else {
            LoginData.GetInstance().username = loginData['user'];
            LoginData.GetInstance().firstName = loginData['firstName'];
            LoginData.GetInstance().userClass = loginData['turma'];
            LoginData.GetInstance().school = loginData['escola'];

            LoginData.GetInstance().isLoggedIn = true;

            return true;
        }

    }

    /**
     * Logs out the currently logged in user.
     */
    static Logout(): void {
        LoginData.GetInstance().username = "";
        LoginData.GetInstance().firstName = "";
        LoginData.GetInstance().userClass = "";
        LoginData.GetInstance().school = "";

        LoginData.GetInstance().isLoggedIn = false;
    }


    static GetUsername(): string {
        return LoginData.GetInstance().username;
    }

    static GetFirstName(): string {
        return LoginData.GetInstance().firstName;
    }

    static GetClass(): string {
        return LoginData.GetInstance().userClass;
    }

    static GetSchool(): string {
        return LoginData.GetInstance().school;
    }

    static IsLoggedIn(): boolean {
        return LoginData.GetInstance().isLoggedIn;
    }


}