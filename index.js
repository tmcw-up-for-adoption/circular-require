#!/usr/bin/env node

var mdeps = require('module-deps'),
    path = require('path'),
    graphlib = require('graphlib');

var core = ['events', 'path', 'util', 'vm', 'dns', 'dgram', 'http', 'https', 'net', 'fs'];

var externalModuleRegexp = process.platform === 'win32' ?
  /^(\.|\w:)/ :
  /^[\/.]/;

var transform = [];
try {
    transform = require(path.resolve('package.json')).browserify.transform;
} catch(e) { }

var g = new graphlib.Graph({ directed: true });
var md = mdeps({
    transform: transform,
    filter: function(id) {
        return core.indexOf(id) === -1 && externalModuleRegexp.test(id);
    }
});

md.on('data', function(entry) {
    Object.keys(entry.deps).forEach(function(dep) {
        g.setEdge(entry.id, entry.deps[dep]);
    });
});

md.on('end', function() {

    var cycles = graphlib.alg.findCycles(g);

    console.log('found %s cycles', cycles.length);

    cycles.forEach(function(cycle) {
        console.log(cycle);
    });
    if (cycles.length)
        process.exit(1);
});

md.end({ file: process.argv[2] });
