import consts from './Constants';
import App from './App';

export default class Sender {

    constructor(rtt) {
        this.coords = {
            X: (consts.WIDTH - consts.RECT_WIDTH - consts.SPACE) / 2,
            Y: 20,
            lineX: ((consts.WIDTH - consts.RECT_WIDTH - consts.SPACE) / 2) + consts.RECT_WIDTH / 2
        }
        this.packages = []; //Packages Sent
        this.lastPackageSent = null;
        this.rtt = rtt;


    }

    setReceiver = (r) => {
        this.receiver = r;
    }

    sendPackage = (id) => {
        this.lastPackageSent = {
            id: id,
            fromX: this.coords.lineX,
            fromY: App.getY(),
            toX: this.receiver.coords.lineX,
            toY: App.getY()
        };
        this.packages.push(this.lastPackageSent);
        this.receiver.getPackage(this.lastPackageSent);

    }

    drawSender = (ctx) => {
        //Draw Box
        ctx.rect(this.coords.X, this.coords.Y, consts.RECT_WIDTH, consts.RECT_HEIGHT);
        //Draw Text
        ctx.font = "20px Arial";
        ctx.fillText("Sender", this.coords.X + 15, this.coords.Y + (consts.RECT_HEIGHT / 2) + 8);
        //Draw Line
        ctx.moveTo(this.coords.X + consts.RECT_WIDTH / 2, this.coords.Y + consts.RECT_HEIGHT);
        ctx.lineTo(this.coords.X + consts.RECT_WIDTH / 2, consts.HEIGHT - this.coords.Y + consts.RECT_HEIGHT);
    }

    drawSentPackages = (ctx) => {

        this.packages.forEach((p) => {
            //Draw Line
            ctx.moveTo(p.fromX, p.fromY);
            ctx.lineTo(p.toX, p.toY);
            //Draw Package
            let box = {
                X: (this.coords.X + this.receiver.coords.X) / 2,
                Y: (p.fromY + p.toY) / 2 - 14
            };
            ctx.rect(box.X - 5, box.Y - 15, 40, 20);
            ctx.font = "15px Arial";
            ctx.fillText("P" + p.id, box.X, box.Y);

        });
    }

    draw = (ctx) => {
        this.drawSender(ctx);
        this.drawSentPackages(ctx);
    }
}