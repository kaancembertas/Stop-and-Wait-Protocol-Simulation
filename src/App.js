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
    this.packageCount = 5; //Number of Packages
    this.propagationDelay = 15; //Run Trip Time (ms)
    this.rtt = 2 * this.propagationDelay;
    this.timeout = 2 * this.rtt; //Timeout

    //Set Devices
    this.sender = new Sender(this.propagationDelay);
    this.receiver = new Receiver(this.propagationDelay);
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
    //Time variables
    this.timeoutCounter = 0; //(ms)
    this.simulationTime = 0; //(ms)
    this.masterClock = 0;
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

  drawSimulationData = () => {
    this.ctx.font = "15px Arial";
    this.ctx.fillText("Master Clock: " + this.masterClock, 625, 20);
    this.ctx.fillText("Simulation Time: " + this.simulationTime, 625, 40);
    this.ctx.fillText("Timeout Counter: " + this.timeoutCounter, 625, 60);
  }

  startSimulatorLoop = () => {
    this.simulatorLoop = setInterval(() => {
      this.ctx.clearRect(0, 0, consts.WIDTH, consts.HEIGHT);
      this.ctx.beginPath();
      this.drawPackageQueue();
      this.drawSimulationData();
      this.sender.draw(this.ctx);
      this.receiver.draw(this.ctx);
      this.ctx.stroke();
    }, 1000 / 10);
  }


  startSendingPackages = () => {
    this.sendPackageLoop = setInterval(() => {
      if (this.receiver.acknowledges.length === this.packageCount) {
        clearInterval(this.sendPackageLoop);
        return;
      }

      if (this.sender.lastPackageSent.id === this.sender.lastAcknowledge.id) {
        this.timeoutCounter = 0;
        this.sender.sendPackage(this.packageQueue.shift().id);
      }

      if (this.timeoutCounter === this.timeout) {
        this.sender.sendPackage(this.sender.lastPackageSent.id);
        this.timeoutCounter = 0;
      }

      this.timeoutCounter += this.propagationDelay;
      this.simulationTime += this.propagationDelay;
      this.masterClock++;



    }, this.propagationDelay * consts.SPEED); //consts.SPEED times slower
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

App.lastY = 60;

