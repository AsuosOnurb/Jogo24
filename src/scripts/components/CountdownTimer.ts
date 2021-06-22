// CountdownTimer.ts
/**
 * Module responsible for the implementation of a timer.
 * @module
 */


import { BetterText } from "./BetterText";

/**
 * A timer that ticks until 00:00 is reached.
 * A callback function can be specified so that it can be triggered when time time runs out.
 */
export class CountdownTimer {

    /**
     * The scene where the timer is placed.
     */
    private currentScene: Phaser.Scene;

    /**
     * The Phaser.Event object that ticks every second.
     */
    private timerEvent: Phaser.Time.TimerEvent;

    /**
     * The amount of time the timer starts with.
     */
    private readonly INITIAL_TIME: number;

    /**
     * The amount of time left to count down.
     */
    private currentTime: number;

    /**
     * Whether or not the timer is (or should be) ticking.
     * @remarks CountdownTimers are not ticking by default. Time starts counting after using {@link CountdownTimer.StartCountdown} method.
     */
    private isRunning: boolean;

    /**
     * The text representation of the time.
     */
    private textObject: BetterText;

    /**
     * The function/method that gets called when the time reaches zero.
     */
    private callback;

    /**
     * Creates a new CountdownTimer.
     * @param scene The scene where the timer is to be placed.
     * @param startingTime The starting amount of time.
     * @param callback The method/function that is to be called once the time runs out.
     * @param textX The x coordinate of the text representation of the timer
     * @param textY The y coordinate of the text representation of the timer
     * @param textSize The size of the text
     * @param optionalInitialText The (optional) initial text string
     */
    constructor(scene: Phaser.Scene, startingTime: number, callback, textX: number, textY: number, textSize: number, optionalInitialText: string | undefined) {

        this.currentScene = scene;

        this.isRunning = false;

        this.INITIAL_TIME = startingTime;
        this.currentTime = startingTime;

        this.textObject = new BetterText(scene, textX, textY, "", { fontFamily: 'Vertiky', fill: "#fff", fontStyle: "bold", fontSize: textSize });

        if (optionalInitialText)
            this.textObject.setText(optionalInitialText);
        else
            this.textObject.setText(this.FormatTime());

        this.callback = callback;
    }


    /**
     * Begins the ticking/counting down of time.
     */
    StartCountdown(): void {

        if (!this.isRunning) {
            this.timerEvent = this.currentScene.time.addEvent({
                delay: 1000,
                callback: this.Tick,
                callbackScope: this,
                loop: true
            });

            this.currentTime = this.INITIAL_TIME;
            this.isRunning = true;

            // Make text white
            this.textObject.setFill("#fff");
        }
    }

    /**
     * Pauses the timer ticking.
     */
    StopCountdown(): void {
        if (this.isRunning) {
            this.timerEvent.paused = true;
        }
    }

    /**
     * Resets the timer by putting it in the same state it had when it was created.
     */
    Reset(): void {
        this.isRunning = false;
        this.currentTime = this.INITIAL_TIME
        this.textObject.setText(this.FormatTime());
        this.textObject.setFill("#fff");
    }

    /**
     * Handles each tick of the timer.
     */
    private Tick(): void {
        if (this.currentTime > 0) {
            this.currentTime -= 1; // One second 
            //Update Timer  
            this.textObject.setText(this.FormatTime());
        } else {
            this.callback(this.currentScene);

            this.isRunning = false;
            this.currentScene.time.removeEvent(this.timerEvent); // Stop the timer event
            //Update Timer  
            this.textObject.setText("00 : 00");


        }

        if (this.currentTime < 10)
            // Make text red
            this.textObject.setFill("#ff251a");


    }

    /**
     * Returns a string specifically formated for the timer.
     * @returns A formatted string for the representation of the remaining time.
     */
    private FormatTime(): string {
        if (this.currentTime == 121 || this.currentTime == 120)
            return `02 : 00`;
        // Returns formated time
        // Minutes Portion
        var minutes = Math.floor(this.currentTime / 60);

        // Seconds Portion
        var partInSeconds = this.currentTime % 60;


        if (partInSeconds < 10)//maintain the first 0 of the seconds portion
            return `0${minutes} : 0${partInSeconds}`;
        else
            return `0${minutes} : ${partInSeconds}`;
    }

   
}