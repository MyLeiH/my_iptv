function main(item) {
    var id = item.id || 'cctv1hd';
    ku9.setProxy("47.121.223.219", "1024");
    // 频道映射配置
    var channels = {
        'cctv1hd': 'http://live1.hrtn.net/live/cctv1hd_3000.m3u8',
        'cctv2hd': 'http://live1.hrtn.net/live/cctv2hd_3000.m3u8',
        'cctv3hd': 'http://live1.hrtn.net/live/cctv3hd_3000.m3u8',
        'cctv4': 'http://live1.hrtn.net/live/cctv4_1000.m3u8',
        'cctv5hd': 'http://live1.hrtn.net/live/cctv5hd_3000.m3u8',
        'cctv5jhd': 'http://live1.hrtn.net/live/cctv5jhd_3000.m3u8',
        'cctv6hd': 'http://live1.hrtn.net/live/cctv6hd_3000.m3u8',
        'cctv7hd': 'http://live1.hrtn.net/live/cctv7hd_3000.m3u8',
        'cctv8hd': 'http://live1.hrtn.net/live/cctv8hd_3000.m3u8',
        'cctv9hd': 'http://live1.hrtn.net/live/cctv9hd_3000.m3u8',
        'cctv10hd': 'http://live1.hrtn.net/live/cctv10hd_3000.m3u8',
        'cctv11': 'http://live1.hrtn.net/live/cctv11_1000.m3u8',
        'cctv12hd': 'http://live1.hrtn.net/live/cctv12hd_3000.m3u8',
        'cctv13': 'http://live1.hrtn.net/live/cctv13_1000.m3u8',
        'cctv14hd': 'http://live1.hrtn.net/live/cctv17hd_3000.m3u8',
        'cctv15': 'http://live1.hrtn.net/live/cctv14_1000.m3u8',
        'cctv16hd': 'http://live1.hrtn.net/live/cctv16hd_3000.m3u8',
        'cctv17hd': 'http://live1.hrtn.net/live/cctv14hd_3000.m3u8',
        'hbwshd': 'http://live1.hrtn.net/live/hbwshd_3000.m3u8',
        'hnwshd': 'http://live1.hrtn.net/live/hnwshd_3000.m3u8',
        'dfwshd': 'http://live1.hrtn.net/live/dfwshd_3000.m3u8',
        'zjwshd': 'http://live1.hrtn.net/live/zjwshd_3000.m3u8',
        'bjwshd': 'http://live1.hrtn.net/live/bjwshd_3000.m3u8',
        'jswshd': 'http://live1.hrtn.net/live/jswshd_3000.m3u8',
        'ahwshd': 'http://live1.hrtn.net/live/ahwshd_3000.m3u8',
        'sdwdhd': 'http://live1.hrtn.net/live/sdwdhd_3000.m3u8',
        'henwshd': 'http://live1.hrtn.net/live/henwshd_3000.m3u8',
        'scwshd': 'http://live1.hrtn.net/live/scwshd_3000.m3u8',
        'hebws': 'http://live1.hrtn.net/live/hebws_1000.m3u8',
        'jlwshd': 'http://live1.hrtn.net/live/jlwshd_3000.m3u8',
        'hljwshd': 'http://live1.hrtn.net/live/hljwshd_3000.m3u8',
        'lnwshd': 'http://live1.hrtn.net/live/lnwshd_3000.m3u8',
        'gdwshd': 'http://live1.hrtn.net/live/gdwshd_3000.m3u8',
        'szwshd': 'http://live1.hrtn.net/live/szwshd_3000.m3u8',
        'cqwshd': 'http://live1.hrtn.net/live/cqwshd_3000.m3u8',
        'dnwshd': 'http://live1.hrtn.net/live/dnwshd_3000.m3u8',
        'gxwshd': 'http://live1.hrtn.net/live/gxwshd_3000.m3u8',
        'gzwshd': 'http://live1.hrtn.net/live/gzwshd_3000.m3u8',
        'jxwshd': 'http://live1.hrtn.net/live/jxwshd_3000.m3u8',
        'tjwshd': 'http://live1.hrtn.net/live/tjwshd_3000.m3u8',
        'ynws': 'http://live1.hrtn.net/live/ynws_1000.m3u8',
        'sxws': 'http://live1.hrtn.net/live/sxws_1000.m3u8',
        'shxws': 'http://live1.hrtn.net/live/shxws_1000.m3u8',
        'gsws': 'http://live1.hrtn.net/live/gsws_1000.m3u8',
        'nxws': 'http://live1.hrtn.net/live/nxws_1000.m3u8',
        'nmws': 'http://live1.hrtn.net/live/nmws_1000.m3u8',
        'qhws': 'http://live1.hrtn.net/live/qhws_1000.m3u8',
        'hainwshd': 'http://live1.hrtn.net/live/hainwshd_3000.m3u8',
        'xjws': 'http://live1.hrtn.net/live/xjws_1000.m3u8',
        'xzws': 'http://live1.hrtn.net/live/xzws_1000.m3u8',
        'btws': 'http://live1.hrtn.net/live/btws_1000.m3u8',
        'hbzhhd': 'http://live1.hrtn.net/live/hbzhhd_3000.m3u8',
        'hbjsjd': 'http://live1.hrtn.net/live/hbjsjd_3000.m3u8',
        'hbgghd': 'http://live1.hrtn.net/live/hbgghd_3000.m3u8',
        'hbjy': 'http://live1.hrtn.net/live/hbjy_1000.m3u8',
        'hbsh': 'http://live1.hrtn.net/live/hbsh_1000.m3u8',
        'hbys': 'http://live1.hrtn.net/live/hbys_1000.m3u8',
        'zgjy1hd': 'http://live1.hrtn.net/live/zgjy1hd_3000.m3u8',
        'zgjy4': 'http://live1.hrtn.net/live/zgjy4_1000.m3u8',
        'jjkt': 'http://live1.hrtn.net/live/jjkt_1000.m3u8',
        'jiajkt': 'http://live1.hrtn.net/live/jiajkt_1000.m3u8',
        'dajs': 'http://live1.hrtn.net/live/dajs_1000.m3u8',
        'jyjs': 'http://live1.hrtn.net/live/jyjs_1000.m3u8',
        'cctvnews': 'http://live1.hrtn.net/live/cctvnews_1000.m3u8',
        'jtlc': 'http://live1.hrtn.net/live/jtlc_1000.m3u8',
        'kkse': 'http://live1.hrtn.net/live/kkse_1000.m3u8',
        'shjs': 'http://live1.hrtn.net/live/shjs_1000.m3u8',
        'zgqx': 'http://live1.hrtn.net/live/zgqx_1000.m3u8',
        'sdjyws': 'http://live1.hrtn.net/live/sdjyws_1000.m3u8'
    };
    
    // 缓存设置
    let cacheKey = "hrtn_cache_" + id;
    const cacheExpiry = 2 * 3600 * 1000; // 2小时缓存
    
    // 尝试从缓存获取数据
    const cachedData = ku9.getCache(cacheKey);
    if (cachedData) {
        return JSON.stringify({ url: cachedData });
    }
    
    // 获取原始URL
    var input_url = channels[id] || channels['cctv1hd'];
    
    // 生成认证URL
    var current_timestamp_ms = Date.now();
    var new_authed_url = generate_auth_url(input_url, current_timestamp_ms);
    
    // 缓存结果
    if (new_authed_url) {
        ku9.setCache(cacheKey, new_authed_url, cacheExpiry);
    }
    
    return JSON.stringify({ url: new_authed_url });
}

// 生成认证URL函数
function generate_auth_url(url, timestamp_ms) {
    var expiration_ts = Math.floor(timestamp_ms / 1000) + 172800; // 48小时有效期
    
    // 解析URL路径
    var path = getPathFromUrl(url);
    if (!path) {
        path = "/";
    }
    
    // 生成随机UUID
    var random_uuid_hex;
    try {
        random_uuid_hex = generateRandomHex(16);
    } catch (e) {
        random_uuid_hex = ku9.md5(Date.now().toString() + Math.random().toString());
    }
    
    var salt = "kK6QfSCS2X";
    
    // 生成签名字符串
    var string_to_sign = path + '-' + expiration_ts + '-' + random_uuid_hex + '-0-' + salt;
    
    // 计算MD5哈希
    var md5_hash = ku9.md5(string_to_sign);
    
    // 生成认证密钥
    var auth_key = expiration_ts + '-' + random_uuid_hex + '-0-' + md5_hash;
    
    // 构建最终URL
    var separator = url.indexOf('?') !== -1 ? '&' : '?';
    var final_url = url + separator + 'auth_key=' + auth_key;
    
    return final_url;
}

// 辅助函数：从URL中提取路径
function getPathFromUrl(url) {
    var match = url.match(/:\/\/[^\/]+(\/[^?]*)/);
    return match ? match[1] : '';
}

// 辅助函数：生成随机十六进制字符串
function generateRandomHex(length) {
    var hex = '';
    for (var i = 0; i < length; i++) {
        hex += Math.floor(Math.random() * 16).toString(16);
    }
    return hex;
}

// 辅助函数：生成查询字符串（保留以备其他用途）
function generateQueryString(params) {
    var queryParts = [];
    for (var key in params) {
        if (params.hasOwnProperty(key)) {
            queryParts.push(encodeURIComponent(key) + '=' + encodeURIComponent(params[key]));
        }
    }
    return queryParts.join('&');
}