const readline = require("readline");
const path = require("path");
const fs = require("fs");
const { execSync } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const CMDS = ["type", "echo", "exit", "pwd", "cd"]
const SPECIAL_CHARS = ["\\", "$", "\"", "\n"]

prepareShell();
rl.on("line", (answer) => {
  answer = answer.trim();
  executeCommand(answer);
  prepareShell();
});

function executeCommand(command) {
  const {cmd, args} = getCmdAndArgs(command);
  if (command === "exit 0"){
    process.exit(0);
  }
  
  let res = `${command}: command not found`;
  if (cmd === "echo") {
    res = handleArgs(args);
  } else if (cmd === "type") {
    res = getTypeCmd(args);
  } else if (cmd === "pwd") {
    res = process.cwd() 
  } else if (cmd === "cd") {
    res = execCd(args)
    if (res === undefined) {
      return;      
    }
  } else {
    res = execExternalProgram(cmd, command)
  }
  
  console.log(res);
};

function prepareShell() {
  process.stdout.write("$ ");
};

function getCmdAndArgs(fullCommand) {
  let firstSpaceIndex = fullCommand.indexOf(" ");
  if (fullCommand.indexOf(" ") === -1) {
    return {cmd: fullCommand};
  }
  let cmd = fullCommand.substring(0, firstSpaceIndex).trim();
  let args = fullCommand.substring(firstSpaceIndex + 1).trim();
  return {cmd, args};
}

function getCmdFullPath(cmd) {
  const paths = process.env.PATH.split(path.delimiter);
  for (let p of paths) {
    const fullPath = path.join(p, cmd);
    if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
      return `${fullPath}`;
    }
  }
  return "";
}

function getTypeCmd(cmdName) {
  cmdFullPath = getCmdFullPath(cmdName);
  if(CMDS.includes(cmdName)) {
    return `${cmdName} is a shell builtin`;
  } else if (cmdFullPath !== "") {
    return `${cmdName} is ${cmdFullPath}`;
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

function execCd(args) {
  if (args === "~") {
    process.chdir(process.env.HOME);
  } else if (fs.existsSync(args) === false) {
    return `cd: ${args}: No such file or directory`
  } else {
    process.chdir(args)
  }
}

function handleArgs(args) {
  let res = "";
  let first_dq = -1;
  let first_sq = -1;
  let last_indx = 0;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "\"" && first_dq === -1 && first_sq === -1) {
      first_dq = i;
    } else if (args[i] === "\"" && first_dq !== -1) {
      let between_space = "";
      if (last_indx !== first_dq) {
        between_space = " ";
      }
      res += between_space + handleDoubleQuotes(args.slice(first_dq+1, i));
      first_dq = -1;
      last_indx = i + 1;
    } else if (args[i] === "'" && first_dq === -1 && first_sq === -1) {
      first_sq = i;
    } else if (args[i] === "'" && first_sq !== -1) {
      let between_space = "";
      if (last_indx !== first_sq) {
        between_space = " ";
      }
      res += between_space + args.slice(first_sq+1, i);
      first_sq = -1;
      last_indx = i + 1;
    }
  }
  res = res + args.slice(last_indx, args.length).split(/\s+/).join(" ");
  return res.trim();
}


function handleDoubleQuotes(str) {
  let res = "";
  let i = 0;
  while (i < str.length) {
    if (str[i] == "\\" && i < str.length - 1 && SPECIAL_CHARS.includes(str[i+1])) {
      res += str[i];
      i += 2;
    } else {
      res += str[i];
      i += 1;
    }
  }
  return res;
}