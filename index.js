#!/usr/bin/env node

const fs = require('fs');
const spawn = require('child_process').spawn;
const path = require('path');
const program = require('commander');
var colors = require('colors/safe');

const version = '1.1.1';

/**
 * 
 * @param {String} pathEntry 
 * @param {Array} directories 
 */
const pushDirectoryFiles = function(pathEntry, directories){
	// console.log(pathEntry);
	if(pathEntry.endsWith("node_modules")) return;
	if(fs.lstatSync(pathEntry).isDirectory()){
		let entries = fs.readdirSync(pathEntry);
		entries.forEach((entry)=>{
			pushDirectoryFiles(path.join(pathEntry, entry), directories);
		})
	} else {
		directories.push(pathEntry);
	}
}

/**
 * 
 * @param {Array} command
 * 
 */
const runCommand = function(command){
	// console.log("Entered", command)
	// let commandSplit = command.split(" ");
	// console.log(command[0], command.slice(1))
	let runner = spawn(command[0], command.slice(1), {
		shell: true,
		cwd: process.cwd()
	})
	// console.log(runner.stdout.toString());
	runner.stdout.pipe(process.stdout);
	// runner.stderr.pipe(process.stderr)
	runner.stderr.on('data', (data)=>process.stderr.write(colors.red(data.toString())));
	// runner.on('message', (message)=>{
	// 	console.log("MSG:", message)
	// })
	// runner.on('close', (code)=>{
	// 	console.log("Closing code", code);
	// })
	runner.on('error', (err)=>{
		console.error(err);
	})
}

program
	.version(version)
	.description("A tool that watches a given directory (defaults to current directory) and executes a command")
	// .arguments('<file> [commands]')
	// .action(function(file, commands){
	// 	console.log("LOGGING");
	// 	console.log(file, commands)
	// })
	// .command('version', 'Print version of CLI tool' ,{isDefault: true})
	// .action(function(){
	// 	console.log("Version", version);
	// })

program
	.command("run <command...>")
	.alias("r")
	.description("Start watching and fire command on change of file")
	.option("-d, --dir <directory>", "Set directory to watch. Defaults to current working directory")
	.option("-r, --recursive", "Watch the given diretory recursively")
	// .action((command, dir)=>{
	.action((command, options)=>{
		// console.log(options.dir)
		// console.log(path.join(process.cwd(), options.dir))
		let paused = false;
		// const directory = options.dir? path.join(process.cwd(), options.dir) : undefined;
		// console.log("DIR", dir);
		const directory = options.dir? path.join(process.cwd(), options.dir) : process.cwd();
		// console.log("DIRECTORY", directory);
		let directories = [];
		pushDirectoryFiles(directory, directories);
		directories.forEach((file)=>{
			fs.watch(file, (event, filename)=>{
				// console.log("EVENT", event, "FILE", filename);
				if(event === 'change' && !paused){
					paused = true;
					setTimeout(()=>paused = false, 100);
					runCommand(command);
				}
			})
		})
		// .on("error", (err)=>{
		// 	console.error(err);
		// })

		// console.log("Watching", directories);
		console.log(colors.green("Watching", directory));
		runCommand(command);
	})

program.parse(process.argv);
