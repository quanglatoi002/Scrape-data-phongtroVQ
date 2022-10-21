const puppeteer = require("puppeteer");

const startBrowser = async () => {
    let browser;

    try {
        browser = await puppeteer.launch({
            //Có hiện UI của Chromium hay không, false là có
            headless: true,

            //Chrome sử dụng multiple layers của sanlbox để tránh những nội dụng web không đáng tin cậy,
            // nếu tin tưởng content dung thi set như v
            args: ["--disable-setuid-sandbox"],

            //truy cập web bỏ qua lỗi liên quan http secure
            ignoreHTTPSErrors: true,
        });
        return browser;
    } catch (error) {
        console.log("Khởi động trình duyệt thất bại " + error);
    }
};

module.exports = startBrowser;
