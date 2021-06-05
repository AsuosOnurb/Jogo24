import Phaser, { DOM } from 'phaser'

export default class LoginForm {

    private usernameInput: Phaser.GameObjects.DOMElement;
    private passwordInput: Phaser.GameObjects.DOMElement;




    private readonly STYLE_TEXT:string = 
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

    constructor(mainMenuScene: Phaser.Scene) {

        const gridConfig = {
            'scene': mainMenuScene,
            'cols': 15,
            'rows': 15
        }



        
        let user = `
        <input type="text" name="username" ${this.STYLE_TEXT} >`;

        let pass = `
        <input type="password" name="password" ${this.STYLE_TEXT}>`;


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

    GetUsername() : string 
    {
        return (<HTMLInputElement> this.usernameInput.getChildByName('username')).value;
    }

    GetPassword () : string 
    {
        return (<HTMLInputElement> this.passwordInput.getChildByName('password')).value;
    }

    EnableForm() : void 
    {
        (<HTMLInputElement> this.usernameInput.getChildByName('username')).disabled = false;
        (<HTMLInputElement> this.passwordInput.getChildByName('password')).disabled = false;

        document.getElementById("loginFormContainer")?.style.removeProperty("pointer-events");


    }

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

    SetFormPosition(x, y): void 
    {
        this.usernameInput.setPosition(x,y);
        this.usernameInput.setPosition(x,y + 256);
    }




}