const readline = require("readline");
const path = require("path");
const fs = require("fs");
const { exec, execSync } = require('child_process');

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
  
  let res = `${command}: command not found`;
  if (cmd === "echo") {
    res = getEchoCmd(args);
  } else if (cmd === "type") {
    res = getTypeCmd(args[0]);
  } else {
    res = execExternalProgram(cmd, command)
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

function getCmdFullPath(cmd) {
  const paths = process.env.PATH.split(path.delimiter);
  for (let p of paths) {
    const fullPath = path.join(p, cmd);
    if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
      return `${cmd} is ${fullPath}`;
    }
  }
  return "";
}

function getTypeCmd(cmdName) {
  cmdFullPath = getCmdFullPath(cmdName);
  if(CMDS.includes(cmdName)) {
    return `${cmdName} is a shell builtin`;
  } else if (cmdFullPath !== "") {
     `${cmdName} is ${cmdFullPath}`;
  }
  return `${cmdName}: not found`;
}

function execExternalProgram(cmd, command) {
    cmdFullPath = getCmdFullPath(cmd);
    if (cmdFullPath === "") {
      return `${command}: command not found`
    }
    return execSync(command).toString().trim();
}