const fs = require('fs');

exports.deleteFile = (pathToFile) => {
    fs.unlink(pathToFile, err => {
        if (err) {
            throw (err);
        }
    })
}