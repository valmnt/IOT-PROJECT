const sql = require('mysql');

function connectBdd() {
    return connection = sql.createConnection({
        host: 'localhost',
        user: 'covidAlert',
        password: 'covidAlert',
        database: 'covidalert'
    })
}

module.exports = {
    connectBdd
};