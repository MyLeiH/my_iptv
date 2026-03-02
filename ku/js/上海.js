//识别名称main
function main(item) {
    // 获取传入的id参数
    const id = item.id;
    if (!id) {
        return JSON.stringify({ error: "错误：请在URL中添加id参数，例如 ?id=1601" });
    }

    // API接口地址
    const apiUrl = "https://bp-api.bestv.cn/cms/api/live/channels";

    // 请求头
    const headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36 Edg/136.0.0.0",
        "Content-Type": "application/json"
    };

    // 请求体
    const body = JSON.stringify({ id: id });

    // 发送POST请求
    let res = ku9.request(apiUrl, "POST", headers, body, false);
    if (!res || !res.body) {
        return JSON.stringify({ error: "请求失败：无法获取接口数据" });
    }

    // 解析响应
    let jsonData;
    try {
        jsonData = JSON.parse(res.body);
    } catch (e) {
        return JSON.stringify({ error: "响应解析失败：" + e.message });
    }

    // 检查接口状态
    if (jsonData.code !== 0) {
        return JSON.stringify({ error: "接口错误：" + (jsonData.msg || "未知错误") });
    }

    // 查找目标频道
    const channelList = jsonData.dt || [];
    let targetChannel = null;
    for (let i = 0; i < channelList.length; i++) {
        const channel = channelList[i];
        if (String(channel.id) === String(id)) {
            targetChannel = channel;
            break;
        }
    }

    // 返回播放地址
    if (targetChannel && targetChannel.channelUrl) {
        // 解码URL中的转义字符（如\/转为/）
        const playUrl = targetChannel.channelUrl.replace(/\\\//g, "/");
        return JSON.stringify({ url: playUrl });
    } else {
        return JSON.stringify({ error: "错误：未找到播放地址或频道不存在" });
    }
}