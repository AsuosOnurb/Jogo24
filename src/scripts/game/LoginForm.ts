import Phaser, { DOM } from 'phaser'


export default class LoginForm {

    private usernameInput: Phaser.GameObjects.DOMElement;
    private passwordInput: Phaser.GameObjects.DOMElement;

    private usernameText: string;
    private passwordText: string;

    constructor(mainMenuScene: Phaser.Scene) {
        let user = `
        <input type="text" name="username" style=" outline:black;
        border:black;
        background-color: transparent;
        border-width: 1px;
        font-size: 15px;
        font-family: 'Vertiky';
        text-align: center;">
        `;

        let pass = `
        <input type="password" name="password" style=" outline:black;
        border:black;
        background-color: transparent;
        border-width: 1px;
        font-size: 15px;
        font-family: 'Vertiky';
        text-align: center;">
        `;

        this.usernameInput = mainMenuScene.add.dom(0, 0).createFromHTML(user, 'phaser-example');
        this.usernameInput.setPosition(mainMenuScene.scale.width / 2, mainMenuScene.scale.height / 2);
        this.usernameInput.setScale(2.85, 3.2);
        this.usernameInput.x += 73
        this.usernameInput.y -= 28



        this.passwordInput = mainMenuScene.add.dom(0, 0).createFromHTML(pass, 'phaser-example');
        this.passwordInput.setPosition(mainMenuScene.scale.width / 2, mainMenuScene.scale.height / 2);
        this.passwordInput.setScale(2.85, 3.2);
        this.passwordInput.x += 73
        this.passwordInput.y += 179

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

    }

    DisableForm() : void 
    {
        let unameInput = (<HTMLInputElement> this.usernameInput.getChildByName('username'));
        unameInput.value = "";
        unameInput.disabled = true;

        let passwdInput = (<HTMLInputElement> this.passwordInput.getChildByName('password'));
        passwdInput.value = "";
        passwdInput.disabled = true;
    }




}