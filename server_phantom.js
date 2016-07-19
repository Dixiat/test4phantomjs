var PORT = 5000,
    FILE = "./build/index.html",
    cmdStr = "phantomjs render.js",
    contentTypesByExtension = {
        '.html': "text/html",
        ".css": "text/css",
        ".js": "text/javascript"
    };

var http = require("http"),
    fs = require("fs"),
    path = require("path"),
    url = require("url"),
    exec = require("child_process").exec;
var server = http.createServer(function (request, response) {
    var uri = url.parse(request.url).pathname,
        filename = path.join(process.cwd(), "assets/", uri);

    if (uri == "/" || uri == "/index.html") {
        var Start_time = Date.now();
        fs.exists(FILE, function (exists) {
            if (!exists) {
                exec(cmdStr, function (err, stdout, stderr) {
                    if (err) {
                        console.log("get webpage error: " + stderr);
                    } else {
                        response.writeHead(200, {
                            "Content-Type": "text/html"
                        });
                        console.log(stdout);

                        fs.writeFile(FILE, stdout, function (err) {
                            if (err) {
                                return console.log(err);
                            }
                            console.log("The rendered file was saved!");
                            var EndTime = Date.now();
                            console.log("Saving file: " + (EndTime - Start_time));
                        });

                        response.write(stdout);
                        response.end();
                        console.log("response completed!");
                    }
                });
            } else {
                fs.readFile(FILE, "binary", function (err, file) {
                    if (err) {
                        response.writeHead(500, { "Content-Type": "text/plain" });
                        response.write(err + "\n");
                        response.end();
                        return;
                    }

                    response.writeHead(200, { "Content-Type": "text/html" });
                    response.write(file, "binary");
                    response.end();
                    console.log('sent: ' + "/build/index.html");
                });
            }
        });


    } else {
        fs.exists(filename, function (exists) {
            if (!exists) {
                response.writeHead(404, { "Content-Type": "text/plain" });
                response.write("404 Not Found: " + filename);
                response.end();
                return;
            }

            if (fs.statSync(filename).isDirectory()) filename += '/index.html';
            //输出客户端获取的文件名
            console.log("get: " + filename);

            fs.readFile(filename, "binary", function (err, file) {
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
    }


}).listen(PORT);

console.log("Server running at port " + PORT + ".");
