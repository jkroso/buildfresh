# Buildfresh

Automatically run a command and reload your browser when files change

## Getting Started

	$ npm install jkroso/buildfresh -g

## Basic Usage

The simplest possible case is `buildfresh` followed by whatever you normal build command is

	$ buildfresh make

I will monitor __all__ files within the current working and run `make` whenever one changes before sending a signal to liveReload to refresh the browser. Often this won't be good enough though since if the built file is within the CWD it will trigger another file change event and thereby start an infinite loop. To prevent this you can reduce the files being monitored in a number of ways. 

### Selecting the top level directory

	$ buildfresh -d src

Will not look at anything above `$CWD/src/`. In a lot of cases this will be enough but if not you also have some filtering options. See below.

### Filtering files

	$ buildfresh -e node_modules\|public

Will prevent files with either "node_modules" or "public" in their path from being watched. Its a good idea to exclude "node_modules" anyway since it could slow things down if their are a lot of them.

	$ buildfresh -i app

Will monitor only files with "app" somewhere in their path

## Thanks 
To Andrey Tarantsov for the awesome [liveReload](http://livereload.com/) tool chain and filewatching tools. This tool is just a thin interface on your work.

## Release History
_(Nothing yet)_

## License
Copyright (c) 2012 Andrey Tarantsov

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
