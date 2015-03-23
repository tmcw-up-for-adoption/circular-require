#!/usr/bin/env node

var mdeps = require('module-deps'),
    traverse = require('traverse');

var core = ['events', 'path', 'util', 'vm', 'dns', 'dgram', 'http', 'https', 'net', 'fs'];

var externalModuleRegexp = process.platform === 'win32' ?
  /^(\.|\w:)/ :
  /^[\/.]/;


var entries = {};
var md = mdeps({
    filter: function(id) {
        return core.indexOf(id) === -1 && externalModuleRegexp.test(id);
    }
});

function make(id) {
    if (entries[id]) return entries[id];
    entries[id] = [];
    return entries[id];
}

md.on('data', function(entry) {
    var e = make(entry.id);
    Object.keys(entry.deps).forEach(function(dep) {
        return e.push(make(entry.deps[dep]));
    });
});

md.on('end', function() {
    traverse(entries).map(function () {
        if (this.circular) console.log('circular dependency: ' + this.path[0]);
    });
});

md.end({ file: process.argv[2] });
