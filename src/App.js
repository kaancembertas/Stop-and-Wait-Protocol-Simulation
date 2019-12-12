import React, { Component } from 'react';
import './App.css';

const WIDTH = 800;
const HEIGHT = 1500;
const SPACE = 300;
const RECT_WIDTH = 100;
const RECT_HEIGHT = 40;



export default class App extends Component {

  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();

    this.sender = {
      X: (WIDTH - RECT_WIDTH - SPACE) / 2,
      Y: 20
    }

    this.receiver = {
      X: (WIDTH - RECT_WIDTH + SPACE) / 2,
      Y: 20
    }

    this.lastY = this.sender.Y + RECT_HEIGHT;

    //INPUTS
    this.ber = 1000; //Bit Error Rate
    this.length = 450; //Package Length
    this.packageCount = 10; //Number of Packages
    this.rtt = 15; //Run Trip Time (ms)
    this.timeout = 4 * this.rtt; //Timeout

  }

  componentDidMount = () => {
    this.ctx = this.canvasRef.current.getContext("2d");
    this.ctx.strokeStyle = 'black';
    this.drawSender();
    this.drawReceiver();
    this.drawSendPacket();
    this.drawAcknowledge();


    this.ctx.stroke();
  }

  getY = () => {
    this.lastY += 30;
    return this.lastY;
  }

  drawSender = () => {
    //Draw Box
    this.ctx.rect(this.sender.X, this.sender.Y, RECT_WIDTH, RECT_HEIGHT);
    //Draw Text
    this.ctx.font = "20px Arial";
    this.ctx.fillText("Sender", this.sender.X + 15, this.sender.Y + (RECT_HEIGHT / 2) + 8);
    //Draw Line
    this.ctx.moveTo(this.sender.X + RECT_WIDTH / 2, this.sender.Y + RECT_HEIGHT);
    this.ctx.lineTo(this.sender.X + RECT_WIDTH / 2, HEIGHT - this.sender.Y + RECT_HEIGHT);
  }

  drawReceiver = () => {
    //Draw Box
    this.ctx.rect(this.receiver.X, this.receiver.Y, RECT_WIDTH, RECT_HEIGHT);
    //Draw Text
    this.ctx.font = "20px Arial";
    this.ctx.fillText("Receiver", this.receiver.X + 10, this.receiver.Y + (RECT_HEIGHT / 2) + 8);
    //Draw Line
    this.ctx.moveTo(this.receiver.X + RECT_WIDTH / 2, this.receiver.Y + RECT_HEIGHT);
    this.ctx.lineTo(this.receiver.X + RECT_WIDTH / 2, HEIGHT - this.receiver.Y + RECT_HEIGHT);
  }

  drawSendPacket = () => {
    //Draw Line
    let fromY = this.getY();
    let toY = this.getY();
    this.ctx.moveTo(this.sender.X + RECT_WIDTH / 2, fromY);
    this.ctx.lineTo(this.receiver.X + RECT_WIDTH / 2, toY);
    //Draw Package
    let p = {
      X: (this.sender.X + this.receiver.X) / 2,
      Y: (fromY + toY) / 2 - 14
    };
    this.ctx.rect(p.X - 10, p.Y - 15, 40, 20);
    this.ctx.font = "15px Arial";
    this.ctx.fillText("P1", p.X, p.Y);
  }

  drawAcknowledge = () => {
    //Draw Line
    let fromY = this.getY();
    let toY = this.getY();
    this.ctx.moveTo(this.receiver.X + RECT_WIDTH / 2, fromY);
    this.ctx.lineTo(this.sender.X + RECT_WIDTH / 2, toY);

    //Draw Package
    let p = {
      X: (this.sender.X + this.receiver.X) / 1.7,
      Y: (fromY + toY) / 2 - 14
    };
    this.ctx.rect(p.X - 3, p.Y - 15, 60, 20);
    this.ctx.font = "15px Arial";
    this.ctx.fillText("ACK1", p.X, p.Y);
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

