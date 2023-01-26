const path = require('path');
const fs = require('fs');

function findReplaceFolderSync(source, filter, find, replace) {
    var exists = fs.existsSync(source);
    var stats = exists && fs.statSync(source);
    var isDirectory = exists && stats.isDirectory();
    if (isDirectory) {
        if(!source.includes('node_modules')) {
            let children = fs.readdirSync(source)
            if (children.length > 0) {
                children.forEach((childItemName) => findReplaceFolderSync(
                    path.join(source, childItemName),
                    filter,
                    find,
                    replace
                ));
            }
        }
    } else {
        if ((filter != null && source.includes(filter)) || filter == null) {
            let contents = fs.readFileSync(source).toString()
            const updated = contents.replace(find, replace);
            fs.writeFileSync(source, updated)
        }
    }
}
const version = JSON.parse(fs.readFileSync("version.json").toString())
findReplaceFolderSync('.', "package.json", /(.*(?:elaraai\/core).*)/, `     "@elaraai/core": "${version["core"]}",`)
findReplaceFolderSync('.', "package.json", /(.*(?:elaraai\/cli).*)/, `     "@elaraai/cli": "${version["cli"]}"`)
