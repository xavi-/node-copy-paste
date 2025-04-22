const child_process = require("node:child_process");
const spawn = child_process.spawn;
const execSync = child_process.execSync;
const util = require("node:util");

let config;

switch (process.platform) {
	case "darwin":
		config = require("./platform/darwin");
		break;
	case "win32":
		config = require("./platform/win32");
		break;
	case "linux":
		if (process.env.WAYLAND_DISPLAY) {
			config = require("./platform/linux-wayland");
		} else {
			config = require("./platform/linux");
		}
		break;
	case "freebsd":
		config = require("./platform/linux");
		break;
	case "openbsd":
		config = require("./platform/linux");
		break;
	case "android":
		config = require("./platform/android");
		break;
	default:
		throw new Error(`Unknown platform: "${process.platform}"`);
}

const noop = () => {};

exports.copy = (text, callback) => {
	const opts = { env: { ...process.env, ...config.copy.env } };
	const child = spawn(config.copy.command, config.copy.args, opts);

	let done = callback
		? (...args) => {
				callback(...args);
				done = noop;
			}
		: (err) => {
				if (err) throw err;

				done = noop;
			};

	const err = [];

	child.stdin.on("error", (err) => done(err));
	child
		.on("exit", () => done(null, text))
		.on("error", (err) => done(err))
		.stderr.on("data", (chunk) => err.push(chunk))
		.on("end", () => {
			if (err.length === 0) return;

			done(new Error(config.decode(err)));
		});

	if (!child.pid) return text;

	if (text?.pipe) text.pipe(child.stdin);
	else {
		let output;

		const type = Object.prototype.toString.call(text);
		if (type === "[object String]") output = text;
		else if (type === "[object Object]") output = util.inspect(text, { depth: null });
		else if (type === "[object Array]") output = util.inspect(text, { depth: null });
		else if (type === "[object Null]") output = "null";
		else if (type === "[object Undefined]") output = "undefined";
		else output = text.toString();

		child.stdin.end(config.encode(output));
	}

	return text;
};
exports.copy.json = (obj, callback) => exports.copy(JSON.stringify(obj, null, "\t"), callback);

const pasteCommand = [config.paste.command].concat(config.paste.args).join(" ");
exports.paste = (callback) => {
	const opts = { env: { ...process.env, ...config.paste.env } };
	if (execSync && !callback) return config.decode(execSync(pasteCommand, opts));

	if (callback) {
		const child = spawn(config.paste.command, config.paste.args, opts);

		let done =
			callback &&
			((...args) => {
				callback(...args);
				done = noop;
			});

		const data = [];
		const err = [];

		child.on("error", (err) => done(err));
		child.stdout
			.on("data", (chunk) => data.push(chunk))
			.on("end", () => done(null, config.decode(data)));
		child.stderr
			.on("data", (chunk) => err.push(chunk))
			.on("end", () => {
				if (err.length === 0) return;

				done(new Error(config.decode(err)));
			});
	} else {
		throw new Error("A synchronous version of paste is not supported on this platform.");
	}
};

exports.global = () => {
	global.copy = exports.copy;
	global.paste = exports.paste;

	return exports;
};
