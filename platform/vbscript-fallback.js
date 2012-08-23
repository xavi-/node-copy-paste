var execSync = require("execSync");
var spawn = require("child_process").spawn;

exports.copy = function(text) {
	var child = spawn("cscript", [ "/Nologo", ".\\platform\\fallbacks\\copy.vbs" ]);

	child
		.on("exit", function() { console.log("Copy complete??"); })
		.stderr.on("data", function(err) { console.error(err.toString()); });

	if(text.pipe) { text.pipe(child.stdin); }
	else { child.stdin.end(text); }
};

exports.paste = function() {
	return execSync.stdout("cscript /Nologo .\\platform\\fallbacks\\paste.vbs");
};