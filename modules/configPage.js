const express = require('express')

module.exports = (opts = {}) =>{
        if(opts.HTML) return {
                method: 'get',
                route: '/:configuration?/configure',
                functions : (_, res) => {
                        res.setHeader('content-type', 'text/html')
                        res.end(opts.HTML)
                }
        }  
        if(opts.dir) return {
                method: 'get',
                route: '/:configuration?/configure',
                functions : express.static(opts.dir)
        }
}

/*
module.exports.html = (HTML)=>{
        return {
                method: 'get',
                route: '/:configuration?/configure',
                functions : (_, res) => {
                        res.setHeader('content-type', 'text/html')
                        res.end(HTML)
                }
        } 
}

module.exports.dir = (dir)=>{
        return {
                method: 'get',
                route: '/:configuration?/configure',
                functions : express.static(dir)
        }
}
*/

