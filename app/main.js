const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

prepareShell();
rl.on("line", (answer) => {
  handleExit(answer);
  checkCommand(answer);
  prepareShell();
});

function checkCommand(command) {
  console.log(`${command}: command not found`);
};

function prepareShell() {
  process.stdout.write("$ ");
};

function handleExit(answer) {
  if (answer.trim() === "exit 0"){
    process.exit(0);
  }
}