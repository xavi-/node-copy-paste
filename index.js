var copypaste;

switch(process.platform) {
	case "darwin":
		copypaste = require("./platform/darwin");
		break;
	case "win32":
		copypaste = require("./platform/win32");
		break;
	case "linux":
		copypaste = require("./platform/linux");
		break;
	default:
		throw "Unknown platform.  Don't know how to copy and paste."
		break;
}

exports.copy = GLOBAL.copy = copypaste.copy;
exports.paste = GLOBAL.paste = copypaste.paste;

