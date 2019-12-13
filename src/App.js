import React, { Component } from 'react';
import './App.css';
import Sender from './Sender';
import Receiver from './Receiver';
import consts from './Constants.js';


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
    this.lastY = this.sender.coords.Y + consts.RECT_HEIGHT;
  }

  startLoop = () => {
    setInterval(() => this.simulatorLoop(), 500);
  }

  simulatorLoop = () => {
    this.ctx.clearRect(0, 0, consts.WIDTH, consts.HEIGHT);
    this.ctx.beginPath();

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
          width={consts.WIDTH}
          height={consts.HEIGHT}
          style={{ marginTop: '10px', border: '1px solid #c3c3c3' }}>
        </canvas>
      </div>
    );
  }
}

