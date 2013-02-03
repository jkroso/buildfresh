#!/usr/bin/env node

var program = require('commander')
  , path = require('path')
  , fs   = require('fs')
  , exec = require('child_process').exec

program.version(require('../package').version)
	.usage('[options] <command> to run before reloading the browser')
	.option('-d, --directory <path>', 'absolute or relative to the CWD', path.resolve)
	.option('-e, --exclude <regexp>', 'a regexp to match against file paths', RegExp)
	.option('-i, --include <regexp>', 'a regexp to match against file paths', RegExp)
	.option('-v, --verbose', 'show whats going on')

program.on('--help', function () {
	console.log('  Example: monitor the "src" sub-folder and run `make dist/file.js`:')
	console.log('')
	console.log('     $ buildfresh -d src make dist/file.js')
	console.log('')
})

program.parse(process.argv)

// the env has to be set before loading the submodules
// which use debug statements
if (program.verbose) process.env.DEBUG = '*'

var fsmonitor = require('fsmonitor')
  , LiveReloadServer = require('livereload-server')
  , debug = require('debug')('buildfresh')

// default to CWD
if (!program.directory) program.directory = process.cwd()

// Join the leftover args since they make up the command
var command = program.args.join(' ')

// Create the filter functions if they are required
var filter
if (program.include || program.exclude) {
	debug('Including files matching: %s', program.include || 'all')
	debug('Excluding files matching: %s', program.exclude || 'null')
	filter = {
		matches: program.include
			? function (path) {
				return !!path.match(program.include)
			}
			: function () {return true},
		excludes: program.exclude 
			? function (path) {
				return !!path.match(program.exclude)
			}
			: function () {return false}
	}
}

var server = new LiveReloadServer({
	// identifies your app
	id: "component",
	name: "development",
	version: "1.0",
	// protocols specifies the versions of subprotocols you support
	protocols: {
		monitoring: 7,
		saving: 1
	} 
});

server.on('connected', function(connection) {
	debug("Client connected (%s)", connection.id)
});

server.on('disconnected', function(connection) {
	debug("Client disconnected (%s)", connection.id)
})

server.on('command', function(connection, message) {
	debug("Received command %s: %j", message.command, message)
})

server.on('error', function(err, connection) {
	console.warn("Error (%s): %s", connection.id, err.message)
})

server.on('livereload.js', function(request, response) {
	debug("Serving livereload.js.")
	fs.readFile(require.resolve('./livereload'), 'utf8', function(err, data) {
		if (err) throw err
		response.writeHead(200, {'Content-Length': data.length, 'Content-Type': 'text/javascript'})
		response.end(data)
	})
})

server.on('httprequest', function(url, request, response) {
	response.writeHead(404)
	response.end()
})

server.listen(function(err) {
	if (err) console.warn("Listening failed: %s", err.message)
	else console.warn("Listening on port %d.", server.port)
})

/*!
 * Watch for changes
 */
console.warn('Watching directory: %s', program.directory)

fsmonitor.watch(program.directory, filter, function(change) {
	debug("Change detected:\n" + change)

	debug('Running command: "%s"', command)
	exec(command, {stdio: 'inherit', maxBuffer: 2000*1024}, function (err) {
		if (err) throw err
		var file = change.modifiedFiles[0] || ''
		// Refresh the browser
		connections.forEach(function (con) {
			con.send({command:'reload', path:file, liveCSS:true})
		})
	})
	var connections = Object.keys(server.connections).map(function (id) {
		return server.connections[id]
	})
	if (!connections.length) console.warn('No browsers connected')
})
