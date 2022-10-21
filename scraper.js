const scrapeCategory = async (browser, url) =>
    new Promise(async (resolve, reject) => {
        try {
            let page = await browser.newPage();
            console.log(">>Mở tab mới ...");
            await page.setDefaultNavigationTimeout(0);
            // Chờ đợi vô điều kiện
            await page.goto(url);
            console.log(">>Truy cập vào: " + url);
            await page.waitForSelector("#webpage");
            console.log(">>Web đã load xong...");

            const dataCategory = await page.$$eval(
                "#navbar-menu > ul > li",
                (els) => {
                    dataCategory = els.map((el) => {
                        return {
                            category: el.querySelector("a").innerText,
                            link: el.querySelector("a").href,
                        };
                    });
                    return dataCategory;
                }
            );
            await page.close();
            console.log(">>Tab đã dong");

            resolve(dataCategory);
        } catch (error) {
            console.log("lỗi ở scrape category: " + error);
            reject(error);
        }
    });

const scraper = async (browser, url) =>
    new Promise(async (resolve, reject) => {
        try {
            let newPage = await browser.newPage();
            console.log(">> Đã mở tab mới");
            await newPage.setDefaultNavigationTimeout(0);
            await newPage.goto(url);
            console.log(">>Đã truy cập vào trang: " + url);
            await newPage.waitForSelector("#main");
            console.log(">> Đã load xong");

            const scrapeData = {};
            // lấy header
            const headerData = await newPage.$eval("header", (el) => {
                return {
                    title: el.querySelector("h1").innerText,
                    description: el.querySelector("p").innerText,
                };
            });
            scrapeData.header = headerData;

            // lấy links detail item
            const detailLinks = await newPage.$$eval(
                "#left-col > section.section-post-listing > ul > li",
                (els) => {
                    detailLinks = els.map((el) => {
                        return el.querySelector(".post-meta h3 > a").href;
                    });
                    return detailLinks;
                }
            );

            const scraperDetail = (link) =>
                new Promise(async (resolve, reject) => {
                    try {
                        let pageDetail = await browser.newPage();
                        await pageDetail.setDefaultNavigationTimeout(0);
                        if (
                            link !=
                            "https://phongtro123.com/dat-hxt-can-goc-vuon-lai-tan-phu-chi-25-trieu-tl-dt-170m2-pr601383.html"
                        ) {
                            await pageDetail.goto(link);
                        } else {
                            await pageDetail.goto(
                                "https://phongtro123.com/gio-hang-cho-thue-nha-pho-vinhomes-grand-park-quan-9-pr600588.html"
                            );
                        }
                        console.log("<<Truy cập vào link: " + link);
                        await pageDetail.waitForSelector("#main");

                        const detailData = {};
                        //bắt đầu cạo
                        // cạo ảnh
                        const images = await pageDetail.$$eval(
                            "#left-col > article > div.post-images > div > div.swiper-wrapper > div.swiper-slide",
                            (els) => {
                                images = els.map((el) => {
                                    return el.querySelector("img")?.src;
                                });
                                return images.filter((i) => !i === false);
                            }
                        );
                        detailData.images = images;

                        // lấy header detail
                        const header = await pageDetail.$eval(
                            "header.page-header",
                            (el) => {
                                return {
                                    title: el.querySelector("h1 > a").innerText,
                                    star: el
                                        .querySelector("h1 > span")
                                        ?.className?.replace(/^\D+/g, ""),
                                    categories: {
                                        content:
                                            el.querySelector("p").innerText,
                                        categoryType:
                                            el.querySelector("p > a > strong")
                                                .innerText,
                                    },
                                    address:
                                        el.querySelector("address").innerText,
                                    attributes: {
                                        price: el.querySelector(
                                            "div.post-attributes > .price > span"
                                        ).innerText,
                                        acreage: el.querySelector(
                                            "div.post-attributes > .acreage > span"
                                        ).innerText,
                                        published: el.querySelector(
                                            "div.post-attributes > .published > span"
                                        ).innerText,
                                        hashtag: el.querySelector(
                                            "div.post-attributes > .hashtag > span"
                                        ).innerText,
                                    },
                                };
                            }
                        );
                        detailData.header = header;
                        //thông tin mô tả
                        const sectionTitle = await pageDetail.$eval(
                            "#left-col > article.the-post > section.post-main-content",
                            (el) =>
                                el.querySelector("div.section-header > h2")
                                    .innerText
                        );
                        const sectionContent = await pageDetail.$$eval(
                            "#left-col > article.the-post > section.post-main-content > .section-content > p",
                            (els) => els.map((el) => el.innerText)
                        );
                        detailData.mainContent = {
                            title: sectionTitle,
                            content: sectionContent,
                        };
                        // đặc điểm tin đăng

                        const overviewTitle = await pageDetail.$eval(
                            "#left-col > article.the-post > section.post-overview",
                            (el) =>
                                el.querySelector("div.section-header > h3")
                                    .innerText
                        );
                        const overviewContent = await pageDetail.$$eval(
                            "#left-col > article.the-post > section.post-overview > .section-content > table.table > tbody > tr",
                            (els) => {
                                return els.map((el) => {
                                    return {
                                        name: el.querySelector("td:first-child")
                                            .innerText,
                                        content:
                                            el.querySelector("td:last-child")
                                                .innerText,
                                    };
                                });
                            }
                        );

                        detailData.overview = {
                            title: overviewTitle,
                            content: overviewContent,
                        };
                        // Thông tin liên hệ
                        const contactTitle = await pageDetail.$eval(
                            "#left-col > article.the-post > section.post-contact",
                            (el) =>
                                el.querySelector("div.section-header > h3")
                                    .innerText
                        );

                        const contactContent = await pageDetail.$$eval(
                            "#left-col > article.the-post > section.post-contact > .section-content > table.table > tbody > tr",
                            (els) => {
                                return els.map((el) => {
                                    return {
                                        name: el.querySelector("td:first-child")
                                            .innerText,
                                        content:
                                            el.querySelector("td:last-child")
                                                .innerText,
                                    };
                                });
                            }
                        );

                        detailData.contact = {
                            title: contactTitle,
                            content: contactContent,
                        };

                        // Thông tin bản đồ

                        // const mapTitle = await pageDetail.$eval(
                        //     "#left-col > article.the-post > section.post-map",
                        //     (el) =>
                        //         el.querySelector("div.section-header > h3")
                        //             .innerText
                        // );

                        // const mapContent = await pageDetail.$$eval(
                        //     "#left-col > article.the-post > section.post-map > .section-content > table.table > tbody > tr",
                        //     (els) => {
                        //         return els.map((el) => {
                        //             return {
                        //                 name: el.querySelector("td:first-child")
                        //                     .innerText,
                        //                 content:
                        //                     el.querySelector("td:last-child")
                        //                         .innerText,
                        //             };
                        //         });
                        //     }
                        // );

                        // detailData.map = {
                        //     title: mapTitle,
                        //     content: mapContent,
                        // };

                        await pageDetail.close();
                        console.log(">>Đã đóng tab: " + link);
                        resolve(detailData);
                    } catch (error) {
                        console.log("Lấy data detail lỗi: " + error);
                        reject(error);
                    }
                });
            const details = [];
            for (let link of detailLinks) {
                const detail = await scraperDetail(link);
                details.push(detail);
            }

            scrapeData.body = details;
            // Đóng trình duyệt
            console.log(">>Trình duyệt đã đóng");
            resolve(scrapeData);
        } catch (error) {
            reject(error);
        }
    });

module.exports = {
    scrapeCategory,
    scraper,
};
