const fs = require("fs");

function write (id, scode, mcode, sname) {

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
        rd[id+"sc"] = scode;
        rd[id+"mc"] = mcode;
        rd[id+"sn"] = sname;
        fs.writeFile("./data/info.json", JSON.stringify(rd), "utf8", (er) => {
            if (er) {
                return console.log("[Alice] " + er);
            }
        });
    
    });
}

module.exports.write = write;