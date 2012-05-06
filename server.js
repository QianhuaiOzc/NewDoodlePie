var http = require("http");
var fs = require("fs");
var url = require("url");
var path = require("path");

var getContentType = function (uri) {
    if (uri.indexOf(".html") >= 0) {
        return "text/html";
    } else if (uri.indexOf(".css") >= 0) {
        return "text/css";
    } else {
        return "text/plain";
    }
}

http.createServer(function (request, response) {
    var uri = url.parse(request.url).pathname;
    var filepath = path.join(process.cwd(), uri);

    // check whether the file is exist and get the result from callback
    path.exists(filepath, function (exists) {
        if (!exists) {
            response.writeHead(404, {"Content-Type": "text/plain"});
            response.write("404 Not Found\n");
            response.end();
        } else {
            // read the file content and get the result from callback
            fs.readFile(filepath, "binary", function (error, data) {
                if (error) {
                    response.writeHead(500, {"Content-Type": "text/plain"});
                    response.write(error + "\n");
                } else {
                    response.writeHead(200, {"Content-Type": getContentType(uri)});
                    response.write(data, "binary");
                }

                response.end();
            });
        }
    });
}).listen(8877, "127.0.0.1");

console.log("Listining port 8877");
