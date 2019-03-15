/**
 * 
 * @authors gaogao (gao.jing@58che.com)
 * @date    2018-07-02 17:27:20
 * @version $Id$
 */


var liveServer = require("live-server");
 
var params = {
    port: 8181, // Set the server port. Defaults to 8080. 
    host: "0.0.0.0", // Set the address to bind to. Defaults to 0.0.0.0 or process.env.IP. 
    headers: {
      "Content-Type": "text/html; charset=gbk"
      },
};
liveServer.start(params);
