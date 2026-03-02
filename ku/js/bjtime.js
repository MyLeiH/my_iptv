function main(item) {
    var id = item.id || 'bjws';
    
    // 频道映射配置
    var channels = {
      'bjws4k': '5481pu3mib99s696hvtkq65c25n',//北京卫视4K
        'bjws': '573ib1kp5nk92irinpumbo9krlb', //北京卫视
        'bjwy': '54db6gi5vfj8r8q1e6r89imd64s', //BRTV文艺
        'bjjs': '53bn9rlalq08lmb8nf8iadoph0b', //BRTV纪实科教
        'bjys': '50mqo8t4n4e8gtarqr3orj9l93v', //BRTV影视
        'bjcj': '50e335k9dq488lb7jo44olp71f5', //BRTV财*
        'bjty': '54hv0f3pq079d4oiil2k12dkvsc', //BRTV体育休闲
        'bjsh': '50j015rjrei9vmp3h8upblr41jf', //BRTV生活
        'bjxw': '53gpt1ephlp86eor6ahtkg5b2hf', //BRTV新闻
        'bjkk': '55skfjq618b9kcq9tfjr5qllb7r'  //卡酷少儿
    };
    
    // 缓存设置
    let cacheKey = "bjzb_cache_" + id;
    const cacheExpiry = 2 * 3600 * 1000; // 2小时缓存
    
    // 尝试从缓存获取数据
    const cachedData = ku9.getCache(cacheKey);
    if (cachedData) {
        return JSON.stringify({ 
            url: cachedData,
            headers: {
                'Referer': 'https://www.brtn.cn/',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
    }
    
    // 生成时间戳和签名
    var t = Math.floor(Date.now() / 1000); // 秒级时间戳
    var signStr = channels[id] + "151" + t + 'TtJSg@2g*$K4PjUH';
    var sign = ku9.md5(signStr).substring(0, 8);
    
    // 构建API请求URL
    var apiUrl = "https://pc.api.btime.com/video/play?from=pc&id=" + channels[id] + "&type_id=151&timestamp=" + t + "&sign=" + sign;
    
    // 请求头设置
    var headers = {
        'Referer': 'https://www.brtn.cn/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Content-Type': 'application/json'
    };
    
    // 发送API请求
    var response = ku9.get(apiUrl, JSON.stringify(headers));
    var jsonData = JSON.parse(response);
    
    // 解析播放地址
    var playURL = null;
    if (jsonData && jsonData.data && jsonData.data.video_stream && jsonData.data.video_stream[0]) {
        var streamUrl = jsonData.data.video_stream[0].stream_url;
        // 双重base64解码（先反转字符串）
        var reversedUrl = streamUrl.split('').reverse().join('');
        var firstDecode = ku9.decodeBase64(reversedUrl);
        playURL = ku9.decodeBase64(firstDecode);
    }
    
    // 缓存结果
    if (playURL) {
        ku9.setCache(cacheKey, playURL, cacheExpiry);
    }
    
    // 返回播放地址和头信息
    return JSON.stringify({ 
        url: playURL,
        headers: headers
    });
}

// 辅助函数：生成查询字符串（保留以备后续使用）
function generateQueryString(params) {
    var queryParts = [];
    for (var key in params) {
        if (params.hasOwnProperty(key)) {
            queryParts.push(encodeURIComponent(key) + '=' + encodeURIComponent(params[key]));
        }
    }
    return queryParts.join('&');
}