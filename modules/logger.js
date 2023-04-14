const path = require('path'),
    express = require("express"),
    serveIndex = require('serve-index'), 
	fs = require('fs'),
    zipstream = require('zip-stream'),
    async = require('async');

class logger{
    constructor(logsDir){
        this.logsDir = logsDir;
    }
    logsModule(){
        if(!this.logsDir) return;
        return {
            route: '/logs', 
            functions: [
                (_, res, next) => {
                    res.set('Cache-Control', 'no-store');
                    console.log('func 0')
                    next();
                },(_, res, next) => {
                    console.log('logsDir',this.logsDir)
                    next();
                },
                express.static(this.logsDir, { etag: false }),
                serveIndex('logs', { 'icons': true, 'view': 'details' })
            ]
        }
    }
    zipModule(){
        if(!this.logsDir) return;
        return { 
            route: '/logs.zip', 
            functions: (req, res) => {
                try {
                    let files = fs.readdirSync(this.logsDir) || [];
                    console.log(files)
                    const logFiles = [];
    
                    files.forEach(file => {
                        if (file.endsWith(".log")) logFiles.push({ path: path.join(this.logsDir,file), name: file })
                    })
    
                    filename = 'logs.zip';
                    cb = function() {};
    
                    res.header('Content-Type', 'application/zip');
                    res.header('Content-Disposition', 'attachment; filename="' + filename + '"');
                  
                    var zip = zipstream(exports.options);
                    zip.pipe(res); // res is a writable stream
                  
                    var addFile = function(file, cb) {
                      zip.entry(fs.createReadStream(file.path), { name: file.name }, cb);
                    };
                  
                    async.forEachSeries(logFiles, addFile, function(err) {
                      if (err) return cb(err);
                      zip.finalize();
                      cb(null, zip.getBytesWritten());
                    });
    
                } catch (e) {
                    console.error(e);
                }
            }
        }
    }
}
module.exports = logger
/*
function logs(logsDir){
    return {
        route: '/logs', 
        functions: [
            (_, res, next) => {
                res.set('Cache-Control', 'no-store');
                console.log('func 0')
                next();
            },(_, res, next) => {
                console.log('logsDir',logsDir)
                next();
            },
            express.static(logsDir, { etag: false }),
            serveIndex('logs', { 'icons': true, 'view': 'details' })
        ]
    }
}


function LogZip(logsDir){
    return { 
        route: '/logs.zip', 
        functions: (req, res) => {
            try {
                let files = fs.readdirSync(logsDir) || [];
                console.log(files)
                const logFiles = [];

                files.forEach(file => {
                    if (file.endsWith(".log")) logFiles.push({ path: path.join(logsDir,file), name: file })
                })

                filename = 'logs.zip';
                cb = function() {};

                res.header('Content-Type', 'application/zip');
                res.header('Content-Disposition', 'attachment; filename="' + filename + '"');
              
                var zip = zipstream(exports.options);
                zip.pipe(res); // res is a writable stream
              
                var addFile = function(file, cb) {
                  zip.entry(fs.createReadStream(file.path), { name: file.name }, cb);
                };
              
                async.forEachSeries(logFiles, addFile, function(err) {
                  if (err) return cb(err);
                  zip.finalize();
                  cb(null, zip.getBytesWritten());
                });

            } catch (e) {
                console.error(e);
            }
        }
    }
}

module.exports = (logsDir)=>{ 
    if(!logsDir) return;
    return {logs:logs(logsDir),LogZip:LogZip(logsDir)}}
*/