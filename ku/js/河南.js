function main(item) {
    const url = item.url;
    const id = ku9.getQuery(url, "id") || "hnws";
    
    // 频道映射表
    const n = {
        // 省台
        'hnws': 145,  // 河南卫视
        'hnds': 141,  // 河南都市
        'hnms': 146,  // 河南民生
        'hmfz': 147,  // 河南法治
        'hndsj': 148, // 河南电视剧
        'hnxw': 149,  // 河南新闻
        'htgw': 150,  // 欢腾购物
        'hngg': 151,  // 河南公共
        'hnxc': 152,  // 河南乡村
        'hngj': 153,  // 河南国际
        'hnly': 154,  // 河南梨园
        'wwbk': 155,  // 文物宝库
        'wspd': 156,  // 武术世界
        'jczy': 157,  // 睛彩中原
        'ydxj': 163,  // 移动戏曲
        'xsj': 183,   // 象视界
        'gxpd': 194,  // 国学频道
        // 地方
        'zz1': 197,   // 郑州新闻综合
        'kf1': 198,   // 开封新闻综合
        'ly1': 204,   // 洛阳新闻综合
        'pds1': 205,  // 平顶山新闻综合
        'ay1': 206,   // 安阳新闻综合
        'hb1': 207,   // 鹤壁新闻综合
        'xx1': 208,   // 新乡新闻综合
        'jz1': 209,   // 焦作新闻综合
        'py1': 219,   // 濮阳新闻综合
        'xc1': 220,   // 许昌新闻综合
        'lh1': 221,   // 漯河新闻综合
        'smx1': 222,  // 三门峡新闻综合
        'ny1': 223,   // 南阳新闻综合
        'sq1': 224,   // 商丘新闻综合
        'xy1': 225,   // 信阳新闻综合
        'zk1': 226,   // 周口新闻综合
        'zmd1': 227,  // 驻马店新闻综合
        'jy1': 228    // 济源新闻综合
    };
    
    // 获取当前时间戳
    const t = Math.floor(Date.now() / 1000);
    
    // 计算签名
    const sign = ku9.sha256("6ca114a836ac7d73" + t);
    
    // 获取频道ID，如果不存在则默认使用hnws
    const channelId = n[id] || n["hnws"];
    
    // 请求地址
    const apiUrl = `https://pubmod.hntv.tv/program/getAuth/channel/channelIds/1/${channelId}`;
    
    // 请求头
    const headers = {
        'timestamp': t.toString(),
        'sign': sign,
        'User-Agent': 'okhttp/3.12.11'
    };
    
    // 发送请求
    const res = ku9.request(apiUrl, "GET", headers, null, true);
    
    if (res.code !== 200) {
        // 请求失败
        return { url: "", headers: {} };
    }
    
    try {
        // 解析JSON响应
        const responseBody = res.body;
        
        // 检查是否是有效的JSON
        if (!ku9.isJsonArray(responseBody)) {
            return { url: "", headers: {} };
        }
        
        const data = JSON.parse(responseBody);
        
        // 获取播放地址
        if (data && data.length > 0 && 
            data[0].video_streams && 
            data[0].video_streams.length > 0) {
            
            const playUrl = data[0].video_streams[0];
            
            // 返回播放地址
            return { url: playUrl, headers: {} };
        } else {
            return { url: "", headers: {} };
        }
        
    } catch (error) {
        return { url: "", headers: {} };
    }
}