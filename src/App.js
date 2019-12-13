import React, { Component } from 'react';
import './App.css';

const WIDTH = 800;
const HEIGHT = 1500;
const SPACE = 300;
const RECT_WIDTH = 100;
const RECT_HEIGHT = 40;

class Sender {

  constructor() {
    this.coords = {
      X: (WIDTH - RECT_WIDTH - SPACE) / 2,
      Y: 20,
      lineX: ((WIDTH - RECT_WIDTH - SPACE) / 2) + RECT_WIDTH / 2
    }
    this.packages = []; //Packages Sent


  }

  setReceiver = (r) => {
    this.receiver = r;
  }

  getAcknowledge = () => {

  }

  sendPackage = (id, fromY, toY) => {
    this.packages.push(
      {
        id: id,
        fromX: this.coords.lineX,
        fromY: fromY,
        toX: this.receiver.coords.lineX,
        toY: toY
      }
    );

  }

  drawSender = (ctx) => {
    //Draw Box
    ctx.rect(this.coords.X, this.coords.Y, RECT_WIDTH, RECT_HEIGHT);
    //Draw Text
    ctx.font = "20px Arial";
    ctx.fillText("Sender", this.coords.X + 15, this.coords.Y + (RECT_HEIGHT / 2) + 8);
    //Draw Line
    ctx.moveTo(this.coords.X + RECT_WIDTH / 2, this.coords.Y + RECT_HEIGHT);
    ctx.lineTo(this.coords.X + RECT_WIDTH / 2, HEIGHT - this.coords.Y + RECT_HEIGHT);
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

class Receiver {
  constructor() {
    this.coords = {
      X: (WIDTH - RECT_WIDTH + SPACE) / 2,
      Y: 20,
      lineX: ((WIDTH - RECT_WIDTH + SPACE) / 2) + RECT_WIDTH / 2
    }

    this.acknowledges = []; //Acknowledges Sent
  }

  setSender = (s) => {
    this.sender = s;
  }
  getPackage = () => {

  }

  sendAcknowledge = (id, fromY, toY) => {
    this.acknowledges.push(
      {
        id: id,
        fromX: this.coords.lineX,
        fromY: fromY,
        toX: this.sender.coords.lineX,
        toY: toY
      }
    );
  }

  drawReceiver = (ctx) => {
    //Draw Box
    ctx.rect(this.coords.X, this.coords.Y, RECT_WIDTH, RECT_HEIGHT);
    //Draw Text
    ctx.font = "20px Arial";
    ctx.fillText("Receiver", this.coords.X + 10, this.coords.Y + (RECT_HEIGHT / 2) + 8);
    //Draw Line
    ctx.moveTo(this.coords.X + RECT_WIDTH / 2, this.coords.Y + RECT_HEIGHT);
    ctx.lineTo(this.coords.X + RECT_WIDTH / 2, HEIGHT - this.coords.Y + RECT_HEIGHT);
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


export default class App extends Component {

  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();

  }

  initialize = () => {
    //INPUTS
    this.ber = 1000; //Bit Error Rate
    this.length = 450; //Package Length
    this.packageCount = 10; //Number of Packages
    this.rtt = 15; //Run Trip Time (ms)
    this.timeout = 4 * this.rtt; //Timeout

    //Set Devices
    this.sender = new Sender();
    this.receiver = new Receiver();
    this.sender.setReceiver(this.receiver);
    this.receiver.setSender(this.sender);
    this.lastY = this.sender.coords.Y + RECT_HEIGHT;

    //Sent Packages, Acknowledges
    /*
      {
        id,
        fromX,
        fromY,
        toX,
        toY
      }
    */
    this.id = 0;
    this.flag = true;
  }

  startLoop = () => {
    setInterval(() => this.simulatorLoop(), 500);
  }

  simulatorLoop = () => {
    this.ctx.clearRect(0, 0, WIDTH, HEIGHT);
    this.ctx.beginPath();

    if (this.flag) {
      this.id++;
      this.sender.sendPackage(this.id, this.getY(), this.getY());
      this.flag = !this.flag;
    }
    else {
      this.receiver.sendAcknowledge(this.id, this.getY(), this.getY());
      this.flag = !this.flag;
    }

    this.sender.draw(this.ctx);
    this.receiver.draw(this.ctx);
    this.ctx.stroke();

  }

  componentDidMount = () => {
    this.ctx = this.canvasRef.current.getContext("2d");
    this.ctx.strokeStyle = 'black';
    this.initialize();
    this.startLoop();
  }

  getY = () => {
    this.lastY += 30;
    return this.lastY;
  }

  render = () => {
    return (
      <div className="App">
        <canvas
          ref={this.canvasRef}
          id="canvas"
          width={WIDTH}
          height={HEIGHT}
          style={{ marginTop: '10px', border: '1px solid #c3c3c3' }}>
        </canvas>
      </div>
    );
  }
}

