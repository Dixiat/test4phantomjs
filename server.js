//预定义变量
var PORT = 4000;
var contentTypesByExtension = {
    '.html': "text/html",
    ".css": "text/css",
    ".js": "text/javascript"
};

var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs");

var server = http.createServer(function(request, response) {
    var uri = url.parse(request.url).pathname,
        filename = path.join(process.cwd(), "assets/", uri);
        console.log(uri);
    fs.exists(filename, function(exists) {
        if (!exists) {
            response.writeHead(404, { "Content-Type": "text/plain" });
            response.write("404 Not Found: " + filename);
            response.end();
            return;
        }

        if (fs.statSync(filename).isDirectory()) filename += '/index.html';
        //输出客户端获取的文件名
        console.log("get: " + filename);

        fs.readFile(filename, "binary", function(err, file) {
            if (err) {
                response.writeHead(500, { "Content-Type": "text/plain" });
                response.write(err + "\n");
                response.end();
                return;
            }

            var headers = {};
            var contentType = contentTypesByExtension[path.extname(filename)];
            if (contentType) headers["Content-Type"] = contentType;
            response.writeHead(200, headers);
            response.write(file, "binary");
            response.end();
            console.log('sent: ' + filename);
        });
    });

    // response.writeHead(200, { 'Content-Type': 'text/plain' });

    // response.end("Hello World!");
}).listen(PORT);

console.log("Server running at http://127.0.0.1:4000/");
