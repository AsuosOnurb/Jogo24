import Phaser from 'phaser'

let instance: EventDispatcher;

export default class EventDispatcher extends Phaser.Events.EventEmitter {
    constructor() {
        super();
    }

    static getInstance(): EventDispatcher {
        if (instance == null)
            instance = new EventDispatcher();

        return instance;
    }
}
