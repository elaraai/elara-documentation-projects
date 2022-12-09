import { Const, SourceBuilder, Template } from "@elaraai/core"

// Note that FTP server accessible below is courtesy of <Link href="https://www.wftpserver.com/onlinedemo.htm">Wing FTP Server</Link>. It is not maintained or affiliated with ELARA. Use this service at your own risk.
const protocol = "ftp://"
const url = "demo.wftpserver.com"
const file_path = "/download/version.txt"
const username = "demo"
const password = "demo"

const my_ftp_datasource = new SourceBuilder("My FTP")
    .ftp({
        cron: "* * * * *",
        uri: () => Const(protocol + url + file_path),
        username: () => Const(username),
        password: () => Const(password),
    });

export default Template(
    my_ftp_datasource
)
