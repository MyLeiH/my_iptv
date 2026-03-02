function main(item) {
    // 获取请求参数 id
    let id = item.id || ku9.getQuery(item.url, "id") || "cpd";

    // 定义频道映射表
    let channelMap = {
        "hnjs": "280",   // 湖南经视
        "hnyl": "344",   // 湖南娱乐
        "hndy": "221",   // 湖南电影
        "hnds": "346",   // 湖南都市
        "hndsj": "484",  // 湖南电视剧
        "hnaw": "261",   // 湖南爱晚
        "hngj": "229",   // 湖南国际
        "jyjs": "316",   // 金鹰纪实
        "jykt": "287",   // 金鹰卡通
        "xfpy": "329",   // 先锋乒羽
        "klcd": "218",   // 快乐垂钓
        "cpd": "578",    // 茶频道
        "csxwzh": "269", // 长沙新闻综合
        "cszfpd": "254", // 长沙政法频道
        "csnxpd": "230", // 长沙女性频道
        "klg": "267"     // 快乐购
    };

    // 如果id不存在于映射表中，直接返回空
    if (!channelMap.hasOwnProperty(id)) {
        return {};
    }

    // 拼接请求URL
    let channelId = channelMap[id];
    let apiUrl = "http://pwlp.bz.mgtv.com/v1/epg/turnplay/getLivePlayUrlMPP?version=PCweb_1.0&platform=1&buss_id=2000001&channel_id=" + channelId;

    // 构建请求头
    let headers = {
        "User-Agent": "okhttp/3.12.11",
        "Content-Type": "application/x-www-form-urlencoded"
    };

    // 发起网络请求，获取重定向后的真实播放地址
    let res = ku9.request(apiUrl, "GET", headers, null, false);

    // 解析JSON
    if (!ku9.isJsonObject(res.body)) {
        return {};
    }

    let json = JSON.parse(res.body);
    if (!json || !json.data || !json.data.url) {
        return {};
    }

    let m3u8Url = json.data.url;

    // 返回播放地址
    return { url: m3u8Url };
}
