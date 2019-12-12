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


  }

  setReceiver = (r) => {
    this.Receiver = r;
  }

  getAcknowledge = () => {

  }

  sendPackage = () => {

  }
}

class Receiver {
  constructor() {
    this.coords = {
      X: (WIDTH - RECT_WIDTH + SPACE) / 2,
      Y: 20,
      lineX: ((WIDTH - RECT_WIDTH + SPACE) / 2) + RECT_WIDTH / 2
    }
  }

  setSender = (s) => {
    this.Sender = s;
  }
  getPackage = () => {

  }

  sendAcknowledge = () => {

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

    this.packages = []; //Packages Sent
    this.acknowledges = []; //Acknowledges Sent

    this.id = 0;
    this.flag = true;


  }

  sendPackage = (id) => {
    this.packages.push(
      {
        id: id,
        fromX: this.sender.coords.lineX,
        fromY: this.getY(),
        toX: this.receiver.coords.lineX,
        toY: this.getY()
      }
    );
  }

  sendAcknowledge = (id) => {
    this.acknowledges.push(
      {
        id: id,
        fromX: this.receiver.coords.lineX,
        fromY: this.getY(),
        toX: this.sender.coords.lineX,
        toY: this.getY()
      }
    );
  }

  startLoop = () => {
    setInterval(() => this.simulatorLoop(), 500);
  }

  simulatorLoop = () => {
    this.ctx.clearRect(0, 0, WIDTH, HEIGHT);
    this.ctx.beginPath();

    if (this.flag) {
      this.id++;
      this.sendPackage(this.id);
      this.flag = !this.flag;
    }
    else {
      this.sendAcknowledge(this.id);
      this.flag = !this.flag;
    }

    this.drawSender();
    this.drawReceiver();
    this.drawSentPackages();
    this.drawAcknowledge();
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

  drawSender = () => {
    //Draw Box
    this.ctx.rect(this.sender.coords.X, this.sender.coords.Y, RECT_WIDTH, RECT_HEIGHT);
    //Draw Text
    this.ctx.font = "20px Arial";
    this.ctx.fillText("Sender", this.sender.coords.X + 15, this.sender.coords.Y + (RECT_HEIGHT / 2) + 8);
    //Draw Line
    this.ctx.moveTo(this.sender.coords.X + RECT_WIDTH / 2, this.sender.coords.Y + RECT_HEIGHT);
    this.ctx.lineTo(this.sender.coords.X + RECT_WIDTH / 2, HEIGHT - this.sender.coords.Y + RECT_HEIGHT);
  }

  drawReceiver = () => {
    //Draw Box
    this.ctx.rect(this.receiver.coords.X, this.receiver.coords.Y, RECT_WIDTH, RECT_HEIGHT);
    //Draw Text
    this.ctx.font = "20px Arial";
    this.ctx.fillText("Receiver", this.receiver.coords.X + 10, this.receiver.coords.Y + (RECT_HEIGHT / 2) + 8);
    //Draw Line
    this.ctx.moveTo(this.receiver.coords.X + RECT_WIDTH / 2, this.receiver.coords.Y + RECT_HEIGHT);
    this.ctx.lineTo(this.receiver.coords.X + RECT_WIDTH / 2, HEIGHT - this.receiver.coords.Y + RECT_HEIGHT);
  }

  drawSentPackages = () => {

    this.packages.forEach((p) => {
      //Draw Line
      this.ctx.moveTo(p.fromX, p.fromY);
      this.ctx.lineTo(p.toX, p.toY);
      //Draw Package
      let box = {
        X: (this.sender.coords.X + this.receiver.coords.X) / 2,
        Y: (p.fromY + p.toY) / 2 - 14
      };
      this.ctx.rect(box.X - 5, box.Y - 15, 40, 20);
      this.ctx.font = "15px Arial";
      this.ctx.fillText("P" + p.id, box.X, box.Y);

    });


  }

  drawAcknowledge = () => {

    this.acknowledges.forEach((a) => {
      //Draw Line
      this.ctx.moveTo(a.fromX, a.fromY);
      this.ctx.lineTo(a.toX, a.toY);

      //Draw Package
      let box = {
        X: (this.sender.coords.X + this.receiver.coords.X) / 1.7,
        Y: (a.fromY + a.toY) / 2 - 14
      };
      this.ctx.rect(box.X - 3, box.Y - 15, 60, 20);
      this.ctx.font = "15px Arial";
      this.ctx.fillText("ACK" + a.id, box.X, box.Y);

    });

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

