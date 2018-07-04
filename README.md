# watch-exec

Watchs a directory and runs the command(s) specified

## Installation

```
$ npm install -g fs-watch-exec
```

## Usage

### Basic usage
```
$ watch-exec run -d [directory] <command>
```

If directory is not provided, defaults to current working directory.
Unlike node's default `fs.watch` function, watch-exec watches all files in your directory recursively

### Coloring
By default watch-exec will print all logs in the following colors:
- Green: watch-exec logs
- Red: Error output (STDERR)
- White (or terminal default): Normal log (STDOUT)

## Roadmap
- Optional disable coloring
- Optional disable recursive watcher
- Optional print files being watched