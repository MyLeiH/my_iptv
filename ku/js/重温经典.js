/*
 * 脚本框架参考https://www.right.com.cn/forum/thread-8437443-1-1.html。仅作播放器功能测试，不得用于商业或非法用途，您必须在下载后24小时内，从设备中删除，否则后果自负。
 */function main(item) {
    const cacheKey = "cwjdHD";
    const cachedUrl = ku9.getCache(cacheKey);
    if (cachedUrl) {
        return { url: cachedUrl };
    }

    function getCommonHeaders() {
        const deviceId = ku9.md5(Date.now().toString());
        return {
            'charset': 'UTF-8',
            'channelId': 'cbn',
            'deviceType': '2048',
            'releaseVersion': '2.0.3',
            'releaseVersionCode': '203',
            'uId': '',
            'os': 'Android',
            'deviceId': deviceId,
            'API-VERSION': '2',
            'orgCode': '',
            'token': '',
            'isGd': '',
            'User-Agent': 'okhttp/3.14.9',
            'Accept': '*/*',
            'Connection': 'keep-alive'
        };
    }

    // 生成签名
    function generateSign(input, flag) {
        const ts = Math.floor(Date.now() / 1000);
        const charset = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        let randStr = "";
        
        // 生成4-11位随机字符串
        const randLen = Math.floor(Math.random() * 8) + 4;
        for (let i = 0; i < randLen; i++) {
            randStr += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        
        const suffix = flag ? "01234ibcp9" : "0123456789";
        const s1 = `${input}-${ts}-${randStr}-${suffix}`;
        const hexMd5 = ku9.md5(s1);
        
        return `${ts}-${randStr}-${hexMd5}`;
    }

    try {
        // 第一步：POST请求
        const firstSign = generateSign("/v1/resourceProductRightsAuth", true);
        const headers1 = {
            ...getCommonHeaders(),
            'sign': firstSign,
            'Host': 'saleservice.5gtv.com.cn',
            'Content-Type': 'application/json'
        };
        
        const postData = JSON.stringify({
            resId: "30167",
            resourceStreamId: "30167"
        });
        
        const res1 = ku9.request(
            "https://saleservice.5gtv.com.cn/v1/resourceProductRightsAuth",
            "POST",
            headers1,
            postData
        );
        
        if (!res1.body) throw new Error("第一步请求失败");
        const json1 = JSON.parse(res1.body);
        const firstUrl = json1.data.url + "&t=1&v=203";
        
        // 提取URI路径
        const uri = firstUrl.split("//")[1].split("/").slice(1).join("/");
        
        // 第二步：GET请求
        const secondSign = generateSign("/" + uri, true);
        const headers2 = {
            ...getCommonHeaders(),
            'sign': secondSign,
            'Host': 'live-dispatcher.5gtv.com.cn'
        };
        
        const res2 = ku9.request(firstUrl, "GET", headers2);
        if (!res2.body) throw new Error("第二步请求失败");
        const json2 = JSON.parse(res2.body);
        const playUrl = json2.data.url;
        
        // 设置缓存（10分钟）
        ku9.setCache(cacheKey, playUrl, 600000);
        
        return { url: playUrl };
        
    } catch (error) {
        return { error: error.message };
    }
}