function main(item) {
    // 获取频道ID
    var id = item.id || "dfws";
    
    // 频道ID映射表
    var n = {
        'dfws': '2030',     // 上海东方卫视
        'xwzh': '20',       // 上海新闻综合
        'xjs': '1600',      // 上海新纪实
        'mdy': '1601',      // 上海魔都眼
        'lypd': '1745',     // 上海乐游频道
        'dycj': '21',       // 上海第一财经
        'dspd': '18',       // 上海都市频道
        'wxty': '1605'      // 上海五星体育
    };
    
    // 获取目标频道ID
    var targetId = n[id];
    if (!targetId) {
        return {
            error: "未找到频道ID: " + id
        };
    }
    
    // API地址
    var apiurl = 'https://bp-api.bestv.cn/cms/api/live/channels';
    
    // 请求头
    var headers = {
        'Content-Type': 'application/json'
    };
    
    // 请求体
    var postData = '{}';
    
    // 发送POST请求
    var response = ku9.post(apiurl, headers, postData);
    
    // 解析JSON响应
    var data;
    try {
        data = JSON.parse(response);
    } catch (e) {
        return {
            error: "解析API响应失败: " + e.toString()
        };
    }
    
    var playurl = "";
    
    // 遍历查找目标频道
    if (data && data.dt && Array.isArray(data.dt)) {
        for (var i = 0; i < data.dt.length; i++) {
            var channel = data.dt[i];
            if (channel.id == targetId) {
                playurl = channel.channelUrl || "";
                break;
            }
        }
    }
    
    // 检查是否找到播放地址
    if (!playurl) {
        return {
            error: "未找到频道播放地址，ID: " + targetId
        };
    }
    
    // 返回播放地址
    return {
        url: playurl
    };
}