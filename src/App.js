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

  componentDidMount = () => {
    this.ctx = this.canvasRef.current.getContext("2d");
    this.ctx.strokeStyle = 'black';
    this.initialize();
    this.startSimulatorLoop();
    this.startSendingPackages();
  }

  initialize = () => {
    //INPUTS
    this.ber = 1000; //Bit Error Rate
    this.length = 450; //Package Length
    this.packageCount = 10; //Number of Packages
    this.rtt = 15; //Run Trip Time (ms)
    this.timeout = 4 * this.rtt; //Timeout

    //Set Devices
    this.sender = new Sender(this.rtt);
    this.receiver = new Receiver(this.rtt);
    this.sender.setReceiver(this.receiver);
    this.receiver.setSender(this.sender);
    //this.lastY = this.sender.coords.Y + consts.RECT_HEIGHT; STATIC

    //Set Packages Queue
    this.packageQueue = [];
    for (let i = 0; i < this.packageCount; i++) {
      this.packageQueue.push({
        id: i + 1
      });
    }
  }

  drawPackageQueue = () => {
    const width = 60;
    const height = 30;
    const x = 5;
    let y = 20;

    this.ctx.font = "15px Arial";
    this.ctx.fillText("Package Queue", x, y);
    y += 8;
    this.packageQueue.forEach((p) => {
      this.ctx.rect(x, y, width, height);
      this.ctx.fillText("P" + p.id, x + 10, y + height - 8);
      y += height;

    });
  }

  startSimulatorLoop = () => {
    this.simulatorLoop = setInterval(() => {
      this.ctx.clearRect(0, 0, consts.WIDTH, consts.HEIGHT);
      this.ctx.beginPath();
      this.drawPackageQueue();
      this.sender.draw(this.ctx);
      this.receiver.draw(this.ctx);
      this.ctx.stroke();

      if (this.packageQueue.length === 0) {
        clearInterval(this.simulatorLoop);
      }

    }, 1000 / 60);
  }


  startSendingPackages = () => {
    //TODO: Hata var
    /* while (this.packageQueue.length > 0) {
       setTimeout(() => {
         this.sender.sendPackage(this.packageQueue.shift().id, this.getY(), this.getY());
       }, this.rtt * 100);
     }
     */
  }

  static getY = () => {
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

App.lastY = 50;

