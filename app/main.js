const readline = require("readline");
const path = require("path");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const CMDS = ["type", "echo", "exit"]

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
  
  // console.log(`*${cmd}*****${args}*`);
  let res = `${command}: command not found`;
  if (cmd === "echo") {
    res = getEchoCmd(args);
  } else if (cmd === "type") {
    res = getTypeCmd(args[0]);
  }
  console.log(res);
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

function getEchoCmd(args) {
  return args.join(" ");
}

function getTypeCmd(cmdName) {
  let found = false;
  if(CMDS.includes(cmdName)) {
    return `${cmdName} is a shell builtin`;
  } else {
    const paths = process.env.PATH.split(path.delimiter);

    for (let path of paths) {
      if (path.split("/").includes(cmdName)) {
        return `${cmdName} is ${path}`;
      }
    }
  }
  return `${cmdName}: not found`;
}