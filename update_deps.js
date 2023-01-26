const path = require('path');
const fs = require('fs');

function findReplaceFolderSync(source, filter, find, replace) {
    var exists = fs.existsSync(source);
    var stats = exists && fs.statSync(source);
    var isDirectory = exists && stats.isDirectory();
    if (isDirectory) {
        let children = fs.readdirSync(source)
        if (children.length > 0) {
            children.forEach((childItemName) => findReplaceFolderSync(
                path.join(source, childItemName),
                filter,
                find,
                replace
            ));
        }
    } else {
        if ((filter != null && source.includes(filter)) || filter == null) {
            let contents = fs.readFileSync(source).toString()
            const updated = contents.replace(find, replace);
            fs.writeFileSync(source, updated)
        }
    }
}
findReplaceFolderSync('.', "package.json", /(.*(?:elaraai).*)/, `     "@elaraai/edk": "${version}"`)
