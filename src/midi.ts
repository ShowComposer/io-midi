// Import Utils
import { Logging } from "@hibas123/nodelogging";
// Import ShowComposer-Modules
import { Datalib } from "@showcomposer/datalib";
// Import system stuff
import * as crypto from "crypto";
// Import midi
import * as midi from "midi";
import * as os from "os";

const data = new Datalib();

export class IOMidiInput {
	public midiId;
	public midiDevice;
	public midiInput;
	public deviceType;
	public devicePort;
	public identifier;

	// Constructor
  constructor(id) {
		this.midiInput = new midi.Input();
		this.midiId = id;
		this.midiDevice = this.midiInput.getPortName(this.midiId);
		Logging.log("Created MIDI Input for " + this.midiDevice);
		this.deviceType = this.midiDevice.split(":")[0];
		this.devicePort = this.midiDevice.split(":")[1];
		this.identifier = crypto.createHash("md5").update(this.midiDevice + os.hostname() + "in").digest("hex");
		data.set("io.midi." + this.identifier + ".deviceType", this.deviceType);
		data.set("io.midi." + this.identifier + ".devicePort", this.devicePort);
		data.set("io.midi." + this.identifier + ".host", os.hostname());
		data.set("io.midi." + this.identifier + ".direction", "input");
		this.midiInput.openPort(this.midiId);
		this.midiInput.on("message", this.receive.bind(this));
	}

	// Receive callback
	public receive(deltaTime, message) {
		data.set("io.midi." + this.identifier + ".raw." + message[0] + "." + message[1], message[2]);
	}
}

export class IOMidiOutput {
	public midiId;
	public midiDevice;
	public midiOutput;
	public deviceType;
	public devicePort;
	public identifier;

	// Constructor
  constructor(id) {
		this.midiOutput = new midi.Output();
		this.midiId = id;
		this.midiDevice = this.midiOutput.getPortName(this.midiId);
		Logging.log("Created MIDI Input for " + this.midiDevice);
		this.deviceType = this.midiDevice.split(":")[0];
		this.devicePort = this.midiDevice.split(":")[1];
		this.identifier = crypto.createHash("md5").update(this.midiDevice + os.hostname() + "out").digest("hex");
		data.set("io.midi." + this.identifier + ".deviceType", this.deviceType);
		data.set("io.midi." + this.identifier + ".devicePort", this.devicePort);
		data.set("io.midi." + this.identifier + ".host", os.hostname());
		data.set("io.midi." + this.identifier + ".direction", "output");
		this.midiOutput.openPort(this.midiId);
		data.subscribe("io.midi." + this.identifier + ".raw").on('data', this.onData.bind(this));
	}

	public onData(key, value) {
		const path = key.split('.');
		if(path.length>=6) {
			Logging.debug("Send message to "+path[4]+","+path[5]+","+value);
			this.midiOutput.sendMessage([path[4],path[5],value]);
		}
	}
}
