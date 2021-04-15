import BetterText from "../better/BetterText";

export default class CountdownTimer {

    private m_currentScene: Phaser.Scene;

    private m_timerEvent: Phaser.Time.TimerEvent;

    private readonly m_INITIAL_TIME: number;
    private  m_currentTime: number;
    private m_isRunning: boolean;

    private m_textObject: BetterText;

    private m_callback;

    constructor(scene: Phaser.Scene, startingTime: number, callback, textX: number, textY: number, textSize: number) {

        this.m_currentScene = scene;

        this.m_isRunning = false;

        this.m_INITIAL_TIME = startingTime;
        this.m_currentTime = startingTime;

        //this.m_textObject = new BetterText(scene, 256, window.innerHeight / 2, "02:00", { fill: "#fff", fontStyle: "bold", fontSize: 64 });
        this.m_textObject = new BetterText(scene,textX, textY, "02 : 00", { fill: "#fff", fontStyle: "bold", fontSize: textSize });

        this.m_callback = callback;
    }

    StartCountdown() : void
    {
        if (!this.m_isRunning)
        {
            this.m_timerEvent = this.m_currentScene.time.addEvent({ 
                delay: 1000, 
                callback: this.Tick, 
                callbackScope: this, 
                loop: true 
            });

            this.m_currentTime = this.m_INITIAL_TIME;
            this.m_isRunning = true;
        }
            
    }

    private Tick(): void {
        if (this.m_currentTime > 0)
        {
            this.m_currentTime -= 1; // One second 
             //Update Timer  
            this.m_textObject.setText(this.FormatTime());
        } else 
        {
            this.m_callback(this.m_currentScene);

            this.m_isRunning = false;
            this.m_currentScene.time.removeEvent(this.m_timerEvent); // Stop the timer event
             //Update Timer  
            this.m_textObject.setText("00:00");
        }

       
    }

    private FormatTime(): string {
        if (this.m_currentTime == 121 || this.m_currentTime == 120)
            return `02 : 00`;
        // Returns formated time
        // Minutes Portion
        var minutes = Math.floor(this.m_currentTime / 60);

        // Seconds Portion
        var partInSeconds = this.m_currentTime % 60;


        if (partInSeconds < 10)//maintain the first 0 of the seconds portion
            return `0${minutes} : 0${partInSeconds}`;
        else
            return `0${minutes} : ${partInSeconds}`;
    }
}