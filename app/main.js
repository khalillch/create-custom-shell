const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const PATH_CONST = process.env.PATH_TEST;

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
  //cmdPath = PATH_CONST.split(":").find(ele => ele.includes(cmdName));
  cmdPath = PATH_CONST.split(":");
  console.log(cmdPath);
  for (path of cmdPath) {
    if (path.split("/").includes(cmdName)) {
      return `${cmdName} is ${path}`;
    }
  }
  // if (cmdPath !== undefined) {
  //   return `${cmdName} is ${cmdPath}`;
  // } 
  return `${cmdName}: not found`;
}