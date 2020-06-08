const sql = require('mysql');

function connectBdd() {
    return connection = sql.createConnection({
        host: 'localhost',
        port: '8889',
        user: 'covidalert',
        password: 'covidalert',
        database: 'covidalert'
    })
}

module.exports = {
    connectBdd
};