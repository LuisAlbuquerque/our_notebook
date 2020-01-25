var bcrypt = require('bcryptjs');
var fs = require('fs');

fs.readFile('passwords.txt', function (err, data) {
    if (err) {
        return console.error(err);
    }
    data = data.toString().split("\n")
    data.pop()
    data = data.map(pass => bcrypt.hashSync(pass,10))
    fs.writeFile('enc_passwords.txt', data.join("\n"), err => console.error(err));
});
