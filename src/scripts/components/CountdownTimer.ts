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
export class CountdownTimer extends BetterText {


    private startTime: Date;

    private totalTime: number;
    private timeElapsed: number;
    private minutes: number;
    private seconds: number;

    private displayString: string;
    private initialString: string;


    private currScene: Phaser.Scene;
    private callback;

    private isCounting: boolean;
    private reachedEnd: boolean;

    constructor(scene: Phaser.Scene, totalTime: number, callback, x, y, initialText:string, textSize: number) {

        super(scene, x, y, initialText, { fontFamily: 'Vertiky', fill: "#fff", fontStyle: "bold", fontSize: textSize });

        this.displayString = initialText;
        this.initialString = initialText;

        this.isCounting = false;
        this.reachedEnd = false;
        this.startTime = new Date();
        this.totalTime = totalTime;
        this.timeElapsed = 0;


        this.currScene = scene;
        this.callback = callback;


    }

    update() {


        if (this.isCounting) {
            const currTime = new Date();
            const delta = this.startTime.getTime() - currTime.getTime();

            this.timeElapsed = Math.abs(delta / 1000);

            const secondsRemaining = this.totalTime - this.timeElapsed;

             this.minutes = Math.floor(secondsRemaining / 60);
             this.seconds = Math.floor(secondsRemaining) - (60 *  this.minutes);

            this.displayString = this.FormattedString( this.minutes,  this.seconds);
        }


        if (this.timeElapsed >= this.totalTime) {
            this.isCounting = false;

            if (!this.reachedEnd)
            {
                this.reachedEnd = true;
                this.callback(this.currScene);

            }

            this.displayString = "00:00";
        }

        this.setText(this.displayString);

    }

    StartCountdown(): void {
        this.isCounting = true;
        this.startTime = new Date();
    }

    StopCountdown(): void {
        this.isCounting = false;
    }

    Reset () : void 
    {
        this.isCounting = false;
        this.reachedEnd = false;
        this.timeElapsed = 0


        this.minutes = Math.floor(this.totalTime / 60);
        this.seconds = Math.floor(this.totalTime) - (60 *  this.minutes);
        this.displayString = this.initialString;
    }


    private FormattedString(minutes, seconds): string {
        
        let secondString, minuteString;
        


        if (seconds < 10)
            secondString = `0${seconds}`;
        else 
            secondString = seconds;



        if (minutes < 10)
            minuteString = `0${minutes}`;
        else 
            minuteString = minutes;


        if (minutes < 1)
            return `00:${secondString}`;
        else 
            return `${minuteString}:${secondString}`;

    }



}
