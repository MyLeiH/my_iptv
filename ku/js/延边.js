function main(item) {
    // API地址
    const apiUrl = 'https://api.iyb983.cn/peony/v1/oppoz/v1/pc/channel?page_index=1&page_size=500&series=1&platform=app&rid=4';
    
    // 设置默认ID（延边卫视频道，ID=3）
    const defaultId = "3";
    const defaultPlayUrl = "http://[your-default-play-url]";
    
    // 从URL参数获取ID
    const url = item.url;
    let channelId = ku9.getQuery(url, "id") || defaultId;
    
    try {
        // 请求API获取频道列表
        const response = ku9.request(apiUrl, "GET", {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "application/json"
        }, null, true);
        
        if (response.code !== 200) {
            return { url: defaultPlayUrl };
        }
        
        const jsonData = JSON.parse(response.body);
        
        if (!jsonData.data || !jsonData.data.data) {
            return { url: defaultPlayUrl };
        }
        
        const channels = jsonData.data.data;
        
        // 构建频道映射
        const channelMap = {};
        channels.forEach(channel => {
            if (channel.id && channel.play_url) {
                channelMap[channel.id.toString()] = channel.play_url;
            }
        });
        
        // 校验并获取播放地址
        if (!channelMap[channelId]) {
            channelId = defaultId;
        }
        
        const playUrl = channelMap[channelId] || defaultPlayUrl;
        
        return { 
            url: playUrl,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Referer": "https://www.oppoz.com/"
            }
        };
        
    } catch (error) {
        return { url: defaultPlayUrl };
    }
}