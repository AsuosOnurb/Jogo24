// LoginForm.ts
/**
 * The module that implements  the Login Form functionality.
 * @module
 */


import Phaser, { DOM } from 'phaser'

/**
 * An object that controls the HTML element dedicated to the login form (the one on the main menu).
 */
export class LoginForm {

    /**
     * The username (edit/text)box html element.
     */
    private usernameInput: Phaser.GameObjects.DOMElement;

    /**
     * The password (edit/text)box html element.
     */
    private passwordInput: Phaser.GameObjects.DOMElement;

    /**
     * The css style applied to each input box.
     */
    private readonly STYLE_TEXT: string = 
    ` style=" 
        outline:black;
        border:black;
        background-color: transparent;
        border-width: 1px;
        font-size: 15px;
        font-family: 'Vertiky';
        text-align: center;
        position: absolute;
        "
    `;

    /**
     * Creates a LoginForm object.
     * @param mainMenuScene The scene where the login form is to be used.
     * @remarks For now, the only place we use the LoginForm is in the main menu scene.
     * The login form starts hidden/disabled. It can be activated using {@link LoginForm.EnableForm}.
     */
    constructor(mainMenuScene: Phaser.Scene) {

        let user = `<input type="text" name="username" ${this.STYLE_TEXT} >`;

        let pass = `<input type="password" name="password" ${this.STYLE_TEXT}>`;


        this.usernameInput = mainMenuScene.add.dom(0, 0).createFromHTML(user, 'phaser-example');
        this.usernameInput.setPosition(mainMenuScene.scale.width / 2, mainMenuScene.scale.height / 2);
        this.usernameInput.setScale(2.85, 3.2);
        this.usernameInput.x -= 150;
        this.usernameInput.y -= 60;
        


        this.passwordInput = mainMenuScene.add.dom(0, 0).createFromHTML(pass, 'phaser-example');
        this.passwordInput.setPosition(mainMenuScene.scale.width / 2, mainMenuScene.scale.height / 2);
        this.passwordInput.setScale(2.85, 3.2);
        this.passwordInput.x += -150;
        this.passwordInput.y += 148;

        mainMenuScene.game.domContainer.setAttribute("id", "loginFormContainer")

        this.DisableForm();


    }

    /**
     * Makes the login form appear and acivates touch events for it.
     */
    EnableForm() : void 
    {
        (<HTMLInputElement> this.usernameInput.getChildByName('username')).disabled = false;
        (<HTMLInputElement> this.passwordInput.getChildByName('password')).disabled = false;

        document.getElementById("loginFormContainer")?.style.removeProperty("pointer-events");


    }

    /**
     * Makes the login form disappear and stops registering its touch/pointer-events
     */
    DisableForm() : void 
    {
        let unameInput = (<HTMLInputElement> this.usernameInput.getChildByName('username'));
        unameInput.value = "";
        unameInput.disabled = true;

        let passwdInput = (<HTMLInputElement> this.passwordInput.getChildByName('password'));
        passwdInput.value = "";
        passwdInput.disabled = true;

        document.getElementById("loginFormContainer")?.style.setProperty("pointer-events", "none")

    }

    /**
     * Gets the username.
     * @returns The username string on the username inputbox.
     */
    GetUsername() : string 
    {
        return (<HTMLInputElement> this.usernameInput.getChildByName('username')).value;
    }

    /**
     * Gets the password.
     * @returns The password string on the password inputbox.
     */
    GetPassword () : string 
    {
        return (<HTMLInputElement> this.passwordInput.getChildByName('password')).value;
    }



}