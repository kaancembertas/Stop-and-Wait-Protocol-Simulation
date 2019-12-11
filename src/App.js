import React, { Component } from 'react';
import './App.css';

const WIDTH = 800;
const HEIGHT = 800;
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
    this.ctx.moveTo(this.sender.X + RECT_WIDTH / 2, this.sender.Y + RECT_HEIGHT + 20);
    this.ctx.lineTo(this.receiver.X + RECT_WIDTH / 2, this.receiver.Y + RECT_HEIGHT + 50);
  }

  drawAcknowledge = () => {
    //Draw Line
    this.ctx.moveTo(this.receiver.X + RECT_WIDTH / 2, this.receiver.Y + RECT_HEIGHT + 55);
    this.ctx.lineTo(this.sender.X + RECT_WIDTH / 2, this.sender.Y + RECT_HEIGHT + 80);
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

