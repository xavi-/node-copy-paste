const clipboard = require("./index.js");

exports.copy = (text) => {
	return new Promise((resolve, reject) => {
		clipboard.copy(text, (err, result) => {
			if (err) reject(err);
			else resolve(result);
		});
	});
};

exports.copy.json = (obj) => {
	return new Promise((resolve, reject) => {
		clipboard.copy.json(obj, (err, result) => {
			if (err) reject(err);
			else resolve(result);
		});
	});
};

exports.paste = () => {
	return new Promise((resolve, reject) => {
		clipboard.paste((err, result) => {
			if (err) reject(err);
			else resolve(result);
		});
	});
};
