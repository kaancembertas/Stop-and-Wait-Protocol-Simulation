import consts from './Constants.js';
import App from './App';

export default class Receiver {
    constructor(propagationDelay) {
        this.coords = {
            X: (consts.WIDTH - consts.RECT_WIDTH + consts.SPACE) / 2,
            Y: 20,
            lineX: ((consts.WIDTH - consts.RECT_WIDTH + consts.SPACE) / 2) + consts.RECT_WIDTH / 2
        }

        this.acknowledges = []; //Acknowledges Sent
        this.propagationDelay = propagationDelay;

    }

    setSender = (s) => {
        this.sender = s;
    }
    getPackage = (p) => {
        setTimeout(() => {
            this.sendAcknowledge(p.id);
        }, this.propagationDelay * consts.SPEED);
    }

    sendAcknowledge = (id) => {
        const ack = {
            id: id,
            fromX: this.coords.lineX,
            fromY: App.getY(),
            toX: this.sender.coords.lineX,
            toY: App.getY()
        };

        this.acknowledges.push(ack);
        this.sender.getAcknowledge(ack);
    }

    drawReceiver = (ctx) => {
        //Draw Box
        ctx.rect(this.coords.X, this.coords.Y, consts.RECT_WIDTH, consts.RECT_HEIGHT);
        //Draw Text
        ctx.font = "20px Arial";
        ctx.fillText("Receiver", this.coords.X + 10, this.coords.Y + (consts.RECT_HEIGHT / 2) + 8);
        //Draw Line
        ctx.moveTo(this.coords.X + consts.RECT_WIDTH / 2, this.coords.Y + consts.RECT_HEIGHT);
        ctx.lineTo(this.coords.X + consts.RECT_WIDTH / 2, consts.HEIGHT - this.coords.Y + consts.RECT_HEIGHT);
    }

    drawAcknowledges = (ctx) => {

        this.acknowledges.forEach((a) => {
            //Draw Line
            ctx.moveTo(a.fromX, a.fromY);
            ctx.lineTo(a.toX, a.toY);

            //Draw Package
            let box = {
                X: (this.sender.coords.X + this.coords.X) / 1.7,
                Y: (a.fromY + a.toY) / 2 - 14
            };
            ctx.rect(box.X - 3, box.Y - 15, 60, 20);
            ctx.font = "15px Arial";
            ctx.fillText("ACK" + a.id, box.X, box.Y);

        });
    }

    draw = (ctx) => {
        this.drawReceiver(ctx);
        this.drawAcknowledges(ctx);
    }
}