const qs = require('querystring');

module.exports.functions = (req, res ,next) => {
        let url = req.url.slice(0, -5).split('/');
        let extra = req.params.extra ? qs.parse(url.pop()) : {}
    
        // detect country code from CDN headers if available
        const countryCode = req.headers['cf-ipcountry'] ||  // CloudFlare CDN
                            req.headers['CDN-RequestCountryCode'] || // Bunny CDN
                            req.headers['CloudFront-Viewer-Country'] // CloudFront CDN
    
        if (countryCode) extra.countryCode = countryCode
        extra.countryCode = 'dz'
            
        url.push(qs.stringify(extra));
        url = url.join('/') + '.json';
    
        if(req.params.extra || extra.countryCode) req.url = url
    
        next()
}

module.exports.route = '/:config?/:resource(stream||meta||catalog||subtitles)/:type/:id/:extra?.json';

module.exports.method = 'get';

