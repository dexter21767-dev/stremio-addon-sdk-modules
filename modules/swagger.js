const pkg = require('../package.json');
const swStats = require('swagger-stats');

class swagger{
    constructor(){
        this.user = {
            name: 'Stremio',
            pass: 'StremioIsBetterThanKodi',
        };
        this.manifest = {};
    }
    SetManifest(manifest){
        if(manifest) this.manifest = manifest;
    }
    setUser(username, password){
        if(username && typeof username == "string") this.user.name = username;
        if(password && typeof password == "string") this.user.pass = password;
    }
    module(){
        const user = this.user; 
        return swStats.getMiddleware(
            {
                name: this.manifest.name || pkg.name,
                version: this.manifest.version || pkg.version,
                authentication: true,
                onAuthenticate: function (req, username, password) {
                    // simple check for username and password
                    return ((username === (user.name))
                        && (password === (user.pass)));
                }
    
            }
        )
    };

}
/*
function swagger(options = {}) {
    return swStats.getMiddleware(
        {
            name: options.manifest.name || pkg.name,
            version: options.manifest.version || pkg.version,
            authentication: true,
            onAuthenticate: function (req, username, password) {
                // simple check for username and password
                return ((username === (options.user.name || 'Stremio'))
                    && (password === (options.user.pass || 'StremioIsBetterThanKodi')));
            }

        }
    )
}*/

module.exports = swagger