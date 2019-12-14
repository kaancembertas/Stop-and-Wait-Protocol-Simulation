import React, { Component } from 'react';
import './App.css';
import Sender from './Sender';
import Receiver from './Receiver';
import consts from './Constants.js';


export default class App extends Component {

  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.state = {
      isStartedSimulation: false
    }
  }

  componentDidMount = () => {
    this.ctx = this.canvasRef.current.getContext("2d");
    this.ctx.strokeStyle = 'black';
  }

  startSimulation = () => {
    this.setState({ isStartedSimulation: true });
    this.initialize();
    this.startSimulatorLoop();
    this.startSendingPackages();
  }

  initialize = () => {
    //INPUTS
    App.lastY = 60;
    this.ber = parseInt(this.state.ber); //Bit Error Rate 10^-ber

    this.length = parseInt(this.state.length); //Package Length
    this.packageCount = parseInt(this.state.pcount); //Number of Packages
    this.propagationDelay = parseInt(this.state.pdelay);
    this.rtt = 2 * this.propagationDelay; //Run Trip Time (ms)
    this.timeout = 2 * this.rtt; //Timeout
    this.bandwith = 8000; //bits per sec

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
    //Time variables and Counters
    this.timeoutCounter = 0; //(ms)
    this.simulationTime = 0; //(ms)
    this.masterClock = 0;

    this.errorCounter = 1;
    this.bitCounter = 0;
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
    this.ctx.fillText("Simulation Time: " + this.simulationTime + "ms", 625, 40);
    this.ctx.fillText("Total Bits: " + this.bitCounter, 625, 60);
    this.ctx.fillText("Sucessfull Bits: " + (this.bitCounter - (this.errorCounter - 1) * this.length), 625, 80);
    this.ctx.fillText("Timeout Counter: " + this.timeoutCounter + "ms", 625, 100);
  }

  drawOutput = () => {
    this.ctx.fillText("OUTPUT", 5, 20);
  }

  startSimulatorLoop = () => {
    this.simulatorLoop = setInterval(() => {
      this.ctx.clearRect(0, 0, consts.WIDTH, consts.HEIGHT);
      this.ctx.beginPath();
      if (this.packageQueue.length !== 0) this.drawPackageQueue();
      else this.drawOutput();

      this.drawSimulationData();
      this.sender.draw(this.ctx);
      this.receiver.draw(this.ctx);
      this.ctx.stroke();
    }, 1000 / 10);
  }

  isPacketLoss = () => {
    if (this.bitCounter >= this.errorCounter * this.ber) {
      this.errorCounter++;
      return true;
    }
    return false;
  }

  startSendingPackages = () => {
    this.sendPackageLoop = setInterval(() => {

      if (this.receiver.acknowledges.filter(ack => !ack.loss).length === this.packageCount) {
        clearInterval(this.sendPackageLoop);
        this.setState({ isStartedSimulation: false });
        return;
      }

      if (this.sender.lastPackageSent.id === this.sender.lastAcknowledge.id) {
        this.timeoutCounter = 0;
        this.bitCounter += this.length;
        this.sender.sendPackage(this.packageQueue.shift().id, this.isPacketLoss(), false);
      }


      if (this.timeoutCounter === this.timeout) {
        this.bitCounter += this.length;
        this.sender.sendPackage(
          this.sender.lastPackageSent.id,
          this.isPacketLoss(),
          this.receiver.packagesGot.includes(this.sender.lastPackageSent.id) ? true : false);

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
        <div style={{ marginTop: 5 }}>
          <label>Bit Error Rate: </label>
          <input disabled={this.state.isStartedSimulation} type="text"
            onChange={(e) => this.setState({ ber: e.target.value })} />

          <label>  Package Length: </label>
          <input disabled={this.state.isStartedSimulation} type="text"
            onChange={(e) => this.setState({ length: e.target.value })} />
          <br />
          <br />
          <label>Package Count: </label>
          <input disabled={this.state.isStartedSimulation} type="text"
            onChange={(e) => this.setState({ pcount: e.target.value })} />

          <label>  Propagation Delay: </label>
          <input disabled={this.state.isStartedSimulation} type="text"
            onChange={(e) => this.setState({ pdelay: e.target.value })} />
          <br />
          <br />
          <input disabled={this.state.isStartedSimulation} type="button" value="Start Simulation" onClick={() => this.startSimulation()} />


        </div>
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

