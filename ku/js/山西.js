//********ku9 js使用(适合1.3.4及以上版本使用)********//

// 识别名称main
function main(item) {
    // 获取地址
    const url = item.url;
    
    // 从URL中获取id参数
    var id = ku9.getQuery(url, "id");
    
    // 如果没有获取到id参数，可以设置默认值（根据PHP注释中的示例）
    if (!id) {
        // id = 'q8RVWgs'; // PHP中的注释示例，根据需要开启
        return JSON.stringify({ error: "缺少id参数" });
    }
    
    // 构造API请求URL
    var apiUrl = 'https://dyhhplus.sxrtv.com/apiv4.5/api/m3u8_notoken?channelid=' + id + '&site=53';
    
    // 发送GET请求获取JSON数据
    var res = ku9.request(apiUrl, "GET");
    
    // 检查响应状态码
    if (res.code !== 200) {
        return JSON.stringify({ error: "API请求失败，状态码: " + res.code });
    }
    
    // 解析JSON响应
    try {
        var jsonData = JSON.parse(res.body);
        
        // 检查是否有数据
        if (!jsonData || !jsonData.data || !jsonData.data.address) {
            return JSON.stringify({ error: "API返回的数据格式不正确或缺少地址信息" });
        }
        
        // 获取播放地址
        var playUrl = jsonData.data.address;
        
        // PHP中的header设置
        // Access-Control-Allow-Origin: * 在酷9中不需要手动设置，平台会处理
        // Location: $p 在PHP中是重定向，在酷9中我们直接返回播放地址
        
        // 返回播放地址（类似于PHP的Location重定向）
        return JSON.stringify({ 
            url: playUrl,
            headers: {
                // 可以在这里添加额外的请求头
            }
        });
        
    } catch (e) {
        return JSON.stringify({ error: "JSON解析失败: " + e.message });
    }
}