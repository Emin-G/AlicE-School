const fs = require("fs");

function read (id, callback) {

    fs.readFile("./data/info.json", "utf8", (err, rdata) => {
        if (err) {
            return console.log("[Alice] " + err);
        }
        var rd = "";
        if (rdata.replace(" ", "") === "") {
            rd = JSON.parse("{}");
        } else {
            rd = JSON.parse(rdata);
        }
        return callback(null, rd[id+"sc"] + ";" + rd[id+"mc"] + ";" + rd[id+"sn"]);
    });
}

module.exports.read = read;