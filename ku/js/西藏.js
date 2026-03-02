//********ku9 js使用示例(适合1.3.4及以上版本使用)********//

// 西藏移动频道解析脚本
// 识别名称main
function main(item) {
    // 获取地址
    const url = item.url;
    
    // 获取id参数
    var id = ku9.getQuery(url, "id") || "0"; // 默认为0
    
    // 目标API地址
    var apiUrl = "http://api.vtibet.cn/xizangmobileinf/rest/xz/cardgroups";
    
    // 设置请求头
    var headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0'
    };
    
    // POST请求体数据
    var postData = 'json=%7B%22cardgroups%22%3A%22LIVECAST%22%2C%22paging%22%3A%7B%22page_no%22%3A%221%22%2C%22page_size%22%3A%22100%22%7D%2C%22version%22%3A%221.0.0%22%7D';
    
    try {
        // 发送POST请求获取频道列表
        var response = ku9.request(apiUrl, "POST", headers, postData, false);
        
        if (response.code === 200) {
            // 解析JSON响应
            var jsonData = JSON.parse(response.body);
            
            // 检查数据结构
            if (jsonData && 
                jsonData.cardgroups && 
                jsonData.cardgroups.length > 1 &&
                jsonData.cardgroups[1].cards &&
                jsonData.cardgroups[1].cards.length > 0) {
                
                // 获取指定ID的播放地址
                var cardIndex = parseInt(id);
                if (cardIndex >= 0 && cardIndex < jsonData.cardgroups[1].cards.length) {
                    var playUrl = jsonData.cardgroups[1].cards[cardIndex].video.url_hd;
                    
                    // 返回播放地址
                    if (playUrl) {
                        // 设置CORS头（模拟PHP中的header设置）
                        var resultHeaders = {
                            'Access-Control-Allow-Origin': '*'
                        };
                        
                        // 返回播放地址和headers
                        return JSON.stringify({
                            url: playUrl,
                            headers: resultHeaders
                        });
                    } else {
                        return JSON.stringify({
                            error: "播放地址获取失败"
                        });
                    }
                } else {
                    return JSON.stringify({
                        error: "ID参数超出范围，可用ID: 0-" + (jsonData.cardgroups[1].cards.length - 1)
                    });
                }
            } else {
                return JSON.stringify({
                    error: "API返回数据格式不正确"
                });
            }
        } else {
            return JSON.stringify({
                error: "API请求失败，状态码: " + response.code
            });
        }
    } catch (error) {
        return JSON.stringify({
            error: "脚本执行异常: " + error.toString()
        });
    }
}

// 另一种简洁写法（如果确定数据结构稳定）：
/*
function main(item) {
    var id = ku9.getQuery(item.url, "id") || "0";
    
    var response = ku9.request(
        "http://api.vtibet.cn/xizangmobileinf/rest/xz/cardgroups",
        "POST",
        {'Content-Type': 'application/x-www-form-urlencoded'},
        'json=%7B%22cardgroups%22%3A%22LIVECAST%22%2C%22paging%22%3A%7B%22page_no%22%3A%221%22%2C%22page_size%22%3A%22100%22%7D%2C%22version%22%3A%221.0.0%22%7D'
    );
    
    if (response.code === 200) {
        var json = JSON.parse(response.body);
        var playUrl = json.cardgroups[1].cards[parseInt(id)].video.url_hd;
        
        return JSON.stringify({
            url: playUrl,
            headers: {'Access-Control-Allow-Origin': '*'}
        });
    }
    
    return JSON.stringify({error: "请求失败"});
}
*/