const scrapers = require("./scraper");
const fs = require("fs");

const scrapeController = async (browserInstance) => {
    const url = "https://phongtro123.com/";
    const indexs = [1, 2, 3, 4]; // chỉ lấy 4 chỉ số index đầu tiên
    try {
        let browser = await browserInstance;
        //gọi hàm cạo ở file scrape
        let categories = await scrapers.scrapeCategory(browser, url);
        // dùng filter để lọc ra xem có bất kỳ phần tử nào trùng với chỉ số indexs thì lấy
        const selectedCategories = categories.filter(
            (category, index) => indexs.some((i) => i === index) // bất kỳ phần tử i nào trong indexs mà === chỉ số index của category thì đúng
        );
        //Sau khi seletedCategories lấy được object li gồm 4 phần tử
        // let result1 = await scrapers.scraper(
        //     browser,
        //     selectedCategories[0].link
        // );
        // fs.writeFile("chothuephongtro.json", JSON.stringify(result1), (err) => {
        //     if (err) console.log("Ghi data zo file json thất bại: " + err);
        //     console.log("Thêm data thành công!.");
        // });

        // info nhà cho thuê
        // let result2 = await scrapers.scraper(
        //     browser,
        //     selectedCategories[1].link
        // );
        // fs.writeFile("nhachothue.json", JSON.stringify(result2), (err) => {
        //     if (err) console.log("Ghi data zo file json thất bại: " + err);
        //     console.log("Thêm data thành công!.");
        // });

        //inf cho thuê căn hộ
        // let result3 = await scrapers.scraper(
        //     browser,
        //     selectedCategories[2].link
        // );
        // fs.writeFile("chothuecanho.json", JSON.stringify(result3), (err) => {
        //     if (err) console.log("Ghi data zo file json thất bại: " + err);
        //     console.log("Thêm data thành công!.");
        // });

        // info cho thuê mặt bằng

        let result4 = await scrapers.scraper(
            browser,
            selectedCategories[3].link
        );
        fs.writeFile("chothuematbang.json", JSON.stringify(result4), (err) => {
            if (err) console.log("Ghi data zo file json thất bại: " + err);
            console.log("Thêm data thành công!.");
        });
        await browser.close();
    } catch (e) {
        console.log("Lỗi ở scrape controller: " + e);
    }
};
module.exports = scrapeController;
