function main(item) {
    // 1. 参数获取
    let ipParam = ku9.getQuery(item.url, 'ip');
    if (!ipParam) throw new Error('缺少代理IP参数: ip');
    let playId = ku9.getQuery(item.url, 'id') || 'cctv1HD';

    try {
        // 2. 代理设置
        let [ip, port = "1080"] = ipParam.split(':');
        ku9.setProxy(ip, port);

        // 3.  API 请求 
        let cityId = '5A';
        let appId = "kdds-chongqingdemo";
        let timestamps = Date.now();
        let signStr = `aIErXY1rYjSpjQs7pq2Gp5P8k2W7P^Y@appId${appId}cityId${cityId}playId${playId}relativeId${playId}timestamps${timestamps}type1`;
        let sign = ku9.md5(signStr);

        let headers = {
            'appId': appId,
            'sign': sign,
            'timestamps': timestamps.toString(),
            'Content-Type': 'application/json;charset=utf-8'
        };

        let apiUrl = `https://portal.centre.live.cbncdn.cn/others/common/playUrlNoAuth?cityId=${cityId}&playId=${playId}&relativeId=${playId}&type=1`;
        let res = ku9.request(apiUrl, "GET", headers);
        if (res.code !== 200) throw new Error(`API请求失败: ${res.code}`);

        let apiData = JSON.parse(res.body);
        let transcodes = apiData?.data?.result?.protocol?.[0]?.transcode;
        if (!transcodes || !transcodes.length) throw new Error('无有效播放源');

        // 画质排序
        transcodes.sort((a, b) => {
            let getV = (i) => i.quality?.includes('4K') ? 4000 : (parseInt(i.quality) || 0);
            return getV(b) - getV(a);
        });

        let finalUrl = transcodes[0].url;

        // 4. 跟随重定向核心逻辑
        let mobileUA = 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 3_1_2 like Mac OS X; en-us) AppleWebKit/528.18 (KHTML, like Gecko) Version/4.0 Mobile/7D11 Safari/528.16';
        let redirectHeaders = { 'User-Agent': mobileUA };

        let maxRedirects = 10; 
        while (maxRedirects > 0) {
            // 第三个参数为 false，禁用自动重定向，手动捕获 Location
            let redirectRes = ku9.getHeaders(finalUrl, redirectHeaders, false);
            let code = parseInt(redirectRes.code);

            // 检查 3xx 状态码
            if (code >= 300 && code < 400) {
                let location = redirectRes.headers?.['Location'] || redirectRes.headers?.['location'];
                if (location) {
                    // 处理 URL 拼接
                    if (location.startsWith('http')) {
                        finalUrl = location;
                    } else if (location.startsWith('/')) {
                        // 根路径：替换域名后的所有内容
                        let match = finalUrl.match(/^(https?:\/\/[^\/]+)/);
                        finalUrl = (match ? match[1] : '') + location;
                    } else {
                        // 相对路径：拼接到当前目录
                        let baseUrl = finalUrl.substring(0, finalUrl.lastIndexOf('/') + 1);
                        finalUrl = baseUrl + location;
                    }
                    maxRedirects--;
                    continue; 
                }
            }
            break;
        }

        // 5. 返回结果
        return { 
            url: finalUrl,
            player: 3
        };

    } catch (error) {
        throw new Error(`解析异常: ${error.message}`);
    }
}