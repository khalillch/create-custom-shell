const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const CMD_NAMES = ["type", "echo", "exit"]

prepareShell();
rl.on("line", (answer) => {
  answer = answer.trim();
  executeCommand(answer);
  prepareShell();
});

function executeCommand(command) {
  const {cmd, args} = getCmd(command);
  
  if (command === "exit 0"){
    process.exit(0);
  }
  
  if (cmd === "echo") {
    console.log(args.join(" "));
  } else if (cmd === "type") {
    printType(args[0]);
  } else {
    console.log(`${command}: command not found`);
  }
};

function prepareShell() {
  process.stdout.write("$ ");
};

function getCmd(answer) {
  let args = answer.split(/\s+/);
  cmd = args[0];
  args.shift();

  return {cmd, args};
}

function printType(cmdName) {
  if (CMD_NAMES.includes(cmdName)) {
    console.log(`${cmdName} is a shell builtin`);
  } else {
    console.log(`${cmdName}: not found`);
  }
}