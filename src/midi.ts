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
		this.identifier = crypto.createHash("md5").update(this.midiDevice + os.hostname()).digest("hex");
		data.set("io.midi." + this.identifier + ".deviceType", this.deviceType);
		data.set("io.midi." + this.identifier + ".devicePort", this.devicePort);
		data.set("io.midi." + this.identifier + ".host", os.hostname());
		this.midiInput.openPort(this.midiId);
		this.midiInput.on("message", this.receive.bind(this));
	}

	// Receive callback
	public receive(deltaTime, message) {
		data.set("io.midi." + this.identifier + ".raw." + message[0] + "." + message[1], message[2]);
	}
}
