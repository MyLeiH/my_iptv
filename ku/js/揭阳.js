function main(item) {
    const id = item.id;
    const url = "https://ap.jyrtv.tv/tvradio/Tvfront/getTvInfo?tv_id=" + id;
    
    // 发送GET请求获取频道信息
    let res = ku9.request(url, "GET");
    
    // 检查响应状态码
    if (res.code !== 200) {
        return { url: "" }; // 请求失败返回空地址
    }
    
    // 解析JSON响应
    let jsonData = JSON.parse(res.body);
    
    // 获取m3u8播放地址
    let m3u8Url = jsonData.data.m3u8;
    
    // 返回播放地址
    return { url: m3u8Url };
}