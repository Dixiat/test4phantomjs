var page = require("webpage").create(),
    url = "http://localhost:4000/";

page.settings.javascriptEnabled = true;
page.settings.localToRemoteUrlAccessEnabled = true;

page.open(url, function (status) {
    if (status !== "success") {
        phantom.exit();
    } else {
            setTimeout(function () {
                var htmlContent = page.evaluate(function () {
                    return document.documentElement.outerHTML;
                });
                console.log(htmlContent);
                page.render("test.png");
                phantom.exit();
            }, 1000);
    }
});

/*
//当页面加载完毕时获取html元素
function onPageReady() {
    var htmlContent = page.evaluate(function () {
        return document.documentElement.outerHTML;
    });
    page.render("test.png");
    console.log(htmlContent);
    phantom.exit();
}

page.open(url, function (status) {
    //迭代检测页面加载状态
    function checkReadyState() {
        setTimeout(function () {
            var readyState = page.evaluate(function () {
                return document.readyState;
            });
            if (readyState == "complete") {
                console.log("adff");
                onPageReady();
            } else {
                console.log("sf");
                checkReadyState();
            }
        },10);
    }

    checkReadyState();

});
*/
