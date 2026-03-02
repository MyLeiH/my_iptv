
//识别名称main
function main(item) {
    // 基础配置
    const base_live_url = "http://iptv.huuc.edu.cn/hls/";
    
    // 全频道映射表
    const all_channels = {
        "zjhd": "浙江卫视高清",
        "hunanhd": "湖南卫视高清", 
        "jshd": "江苏卫视高清",
        "cctv5hd": "CCTV-5高清",
        "dfhd": "东方卫视高清",
        "ahhd": "安徽卫视高清",
        "btv6hd": "北京体育高清",
        "cctv8hd": "CCTV-8高清",
        "cctv1hd": "CCTV-1高清",
        "cctv2hd": "CCTV-2高清",
        "cctv3hd": "CCTV-3高清",
        "cctv4hd": "CCTV-4高清",
        "cctv5phd": "CCTV-5+高清",
        "cctv6hd": "CCTV-6高清",
        "cctv7hd": "CCTV-7高清",
        "cctv9hd": "CCTV-9高清",
        "cctv10hd": "CCTV-10高清",
        "cctv12hd": "CCTV-12高清",
        "cctv13hd": "CCTV-13高清",
        "cctv14hd": "CCTV-14高清",
        "cgtnhd": "CGTN高清",
        "chchd": "CHC高清电影",
        "btv1hd": "北京卫视高清",
        "btv2hd": "北京文艺高清",
        "btv4hd": "北京影视高清",
        "btv9hd": "北京新闻高清",
        "btv11hd": "北京纪实高清",
        "hljhd": "黑龙江卫视高清",
        "lnhd": "辽宁卫视高清",
        "szhd": "深圳卫视高清",
        "gdhd": "广东卫视高清",
        "tjhd": "天津卫视高清",
        "hbhd": "湖北卫视高清",
        "sdhd": "山东卫视高清",
        "cqhd": "重庆卫视高清",
        "docuchina": "上海纪实高清",
        "schd": "四川卫视高清",
        "gedocu": "金鹰纪实高清",
        "dnhd": "福建东南卫视高清",
        "hebhd": "河北卫视高清",
        "jxhd": "江西卫视高清",
        "fhzw": "",
        "fhzx": "",
        "fhdy": "",
        "discovery": "",
        "natlgeo": "",
        "startv": "",
        "channelv": "",
        "starsports": "",
        
        // 校园专属直播
        "temphd2": "XXXXXXXXXXXXXXXX一家亲"
    };

    // 获取频道ID参数
    const url = item.url;
    const channel_id = ku9.getQuery(url, "id");
    
    // 如果没有ID参数或ID不在频道列表中，显示频道列表
    if (!channel_id || !all_channels[channel_id]) {
        return showChannelList(all_channels);
    }
    
    // 代理转发直播流
    return proxyLiveStream(base_live_url, channel_id);
}

/**
 * 显示频道列表页面
 */
function showChannelList(channels) {
    let html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>校园直播-IPTV代理</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@3.4.1/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body { font-family: "Microsoft YaHei", sans-serif; background: #f5f5f5; }
        .container { background: white; padding: 20px; border-radius: 8px; margin-top: 20px; }
        .channel-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 15px; margin: 20px 0; }
        .channel-item { padding: 15px; border: 1px solid #ddd; border-radius: 6px; background: #f9f9f9; transition: all 0.3s; }
        .channel-item:hover { background: #e3f2fd; border-color: #2196f3; transform: translateY(-2px); box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .channel-link { color: #0066cc; text-decoration: none; font-weight: bold; display: block; }
        .channel-id { color: #666; font-size: 12px; margin-top: 8px; }
        .nav-tabs { border-bottom: 2px solid #ddd; }
        .nav-tabs > li.active > a { background-color: #f5f5f5; border: 1px solid #ddd; border-bottom-color: transparent; }
    </style>
</head>
<body>
    <div class="container">
        <h1>📺 校园IPTV直播代理</h1>
        <p class="text-muted">共 ${Object.keys(channels).length} 个频道，点击频道名称开始观看</p>
        
        <div class="row tv-row">
            <div class="col-md-12">
                <ul class="nav nav-tabs">
                    <li class="active"><a>全部频道</a></li>
                </ul>
            </div>
        </div>
        
        <div class="channel-grid">`;
    
    // 生成频道列表
    for (const id in channels) {
        html += `
            <div class="channel-item">
                <a class="channel-link" href="?id=${id}" target="_blank">${channels[id]}</a>
                <div class="channel-id">ID: ${id}</div>
            </div>`;
    }
    
    html += `
        </div>
        
        <div class="text-center text-muted" style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <small>Powered by IPTV Proxy © ${new Date().getFullYear()}</small>
        </div>
    </div>
</body>
</html>`;
    
    return { webview: "data:text/html;charset=utf-8," + encodeURIComponent(html) };
}

/**
 * 代理转发直播流
 */
function proxyLiveStream(base_url, channel_id) {
    const live_url = base_url + channel_id + ".m3u8";
    
    // 使用ku9.request获取m3u8内容
    const res = ku9.request(live_url, "GET", {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }, null, true);
    
    // 检查请求是否成功
    if (res.code !== 200) {
        // 返回错误m3u8
        const error_m3u8 = `#EXTM3U
#EXT-X-VERSION:3
#EXT-X-MEDIA-SEQUENCE:0
#EXT-X-TARGETDURATION:10
#EXTINF:10.0,
error.ts
#EXT-X-ENDLIST`;
        return { m3u8: error_m3u8 };
    }
    
    let m3u8_content = res.body;
    
    // 修复TS分片路径：将相对路径转为绝对路径
    // 使用正则表达式替换相对路径为绝对路径
    const regex = new RegExp('\\n(' + channel_id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '-\\d+\\.ts)', 'g');
    m3u8_content = m3u8_content.replace(regex, '\n' + base_url + '$1');
    
    // 返回修复后的m3u8内容
    return { m3u8: m3u8_content };
}