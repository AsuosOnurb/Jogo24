import Phaser from 'phaser'
import EventDispatcher from './EventDispatcher';

export default class ImageButton extends Phaser.GameObjects.Group
{
    private imageKey: string;
    private imageObject: Phaser.GameObjects.Image;
    private text: string;
    private textObject: Phaser.GameObjects.Text;


    private x: integer;
    private y: integer;

    private eventDispatcher!: EventDispatcher;

    private readonly currScene!: Phaser.Scene;



    constructor (currentScene: Phaser.Scene, 
                text: string, img: string,
                xPos: integer, yPos: integer
                 )
    {
        super(currentScene);

        this.currScene = currentScene;
        

        
        this.x = xPos;
        this.y = yPos;

        this.imageObject = currentScene.add.image(this.x, this.y, img);
        
        this.text = text;
        this.textObject = currentScene.add.text(this.x, this.y, this.text);
        this.textObject.setFill("#34eb55");


        this.eventDispatcher = EventDispatcher.getInstance();

    }

    listenTo(eventName: string, callback, context)
    {
        this.imageObject.on(eventName, callback, context);
        //this.eventDispatcher.on(eventName, callback);
    }

    /*
    listenOnPressed(eventName: string, callbackFunction)
    {
        this.eventDispatcher.emit(eventName, eventCallbackFunction);
    }*/

}