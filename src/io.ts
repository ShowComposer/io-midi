// Import Utils
import { Logging } from "@hibas123/nodelogging";
// Import ShowComposer-Modules
import { Datalib } from "@showcomposer/datalib";

// Import midi
import * as midi from "midi";

// Initialize globals
// SC Data
const data = new Datalib();

// Initialize midi i/o
const input = new midi.Input();
const output = new midi.Output();

// Create input for all ports
const inputPortCount = input.getPortCount();
Logging.debug("MIDI Input ports: "+inputPortCount);
const outputPortCount = output.getPortCount();
Logging.debug("MIDI Output ports: "+outputPortCount);

// input.on('message', (deltaTime, message) => {
//   // The message is an array of numbers corresponding to the MIDI bytes:
//   //   [status, data1, data2]
//   // https://www.cs.cf.ac.uk/Dave/Multimedia/node158.html has some helpful
//   // information interpreting the messages.
//   console.log(`m: ${message} d: ${deltaTime}`);
// 	output.sendMessage([0x90,0,0x04]);
// 	setTimeout(() => {
// 		output.sendMessage([0x90,0,0]);
// 	},10000);
// });

// Open first input
// ToDo: Open other inputs
// console.log(input.getPortName(1));
