
module.paths.push('/usr/local/lib/node_modules');

var livereload = require('livereload');
var server = livereload.createServer({
    exclusions : ["zzzxc/"]
});
server.watch(__dirname);
