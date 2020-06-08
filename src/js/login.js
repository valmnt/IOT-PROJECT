const bdd = require('./bdd_connect');

function connect(req, res) {

    var connection = bdd.connectBdd()

    connection.connect(function (err) {
        if (err) {
            console.log(err.code);
            console.log(err.fatal);
        }
        else {
            console.log('DATABASE ACCESS')
        }
    })

    var username = req.body.username;
    var pswd = req.body.password;

    $query = "SELECT * FROM users WHERE username = '" + username + "' and pswd = '" + pswd + "';"

    connection.query($query, function (err, rows, fields) {
        if (err) {
            console.log("An error ocurred performing the query.");
            console.log(err);
            return;
        }
        console.log("Query succesfully executed");
        console.log(rows);

        if (rows.length != 0) {
            req.session.username = rows[0].username;
            req.session.device = rows[0].device;
            req.session.role = rows[0].role;
            console.log(req.session.device)
            res.redirect('/dashboard');
        } else {
            res.redirect('/login');
        }
    })
}

module.exports = {
    connect
};
