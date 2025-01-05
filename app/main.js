const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("$ ", (answer) => {
  checkCommand(answer);
  rl.close();
});

function checkCommand(command) {
  console.log(`${command}: command not found`);
};