var execSync = require("execSync");
var spawn = require("child_process").spawn;

GLOBAL.copy = function(text) {
	var child = spawn("pbcopy");

	child
		.on("error", function(err) { console.error("A copy error has occured: ", err); })
		.on("close", function() { console.log("Copy complete"); })

	if(text.pipe) { text.pipe(child.stdin); }
	else { child.stdin.end(text); }
};

GLOBAL.paste = function() {
	return execSync.stdout("pbpaste");
};