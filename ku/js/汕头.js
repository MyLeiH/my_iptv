function main(item) {
    // 获取ID参数
    var id = ku9.getQuery(item.url, "id").toLowerCase();
    
    // 频道配置
    var hosts = "http://sttv-hls.strtv.cn";
    var ids = {
        "st1": "lKGXIQa",
        "st2": "7xjJK9d",
        "fm1025": "s7k681h",
        "fm1072": "Li7mg21"
    };
    
    var key = "bf9b2cab35a9c38857b82aabf99874aa96b9ffbb";
    
    // 获取当前时间戳（秒）并加上7200秒，转换为16进制
    var currentTime = Math.floor(new Date().getTime() / 1000);
    var dectime = (currentTime + 7200).toString(16);
    
    // 根据ID前缀确定码率
    var rate = id.substring(0, 2) === "st" ? "500" : "64";
    
    // 生成路径名
    var pathName = generatePathName(ids[id]);
    
    // 构建路径
    var path = '/' + ids[id] + '/' + rate + '/' + pathName + '.m3u8';
    
    // 生成签名
    var sign = ku9.md5(key + path + dectime);
    
    // 构建直播URL
    var liveURL = hosts + path + "?sign=" + sign + "&t=" + dectime;
    
    // 返回播放地址
    return { url: liveURL };
}

// 生成路径名函数
function generatePathName(e) {
    // 获取当天0点的时间戳（毫秒）
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var o = today.getTime();
    
    var a = 0;
    var r = 0;
    var d = -1;
    var p = 0;
    var l = 0;
    
    // 计算字符编码和
    for (a = 0; a < e.length; a++) {
        p = e.charCodeAt(a);
        r = r + p;
        if (d !== -1) {
            l = l + (d - p);
        }
        d = p;
    }
    
    r = r + l;
    
    // 转换为36进制
    var s = r.toString(36);
    var c = o.toString(36);
    
    // 计算字符编码和
    var u = 0;
    for (a = 0; a < c.length; a++) {
        u = u + c.charCodeAt(a);
    }
    
    // 字符串处理
    c = c.substring(5) + c.substring(0, 5);
    var f = Math.abs(u - r);
    c = s.split('').reverse().join('') + c;
    var g = c.substring(0, 4);
    var w = c.substring(4);
    var b = (new Date().getDay()) % 2;
    
    var m = [];
    
    for (a = 0; a < e.length; a++) {
        if (a % 2 === b) {
            var index = a % c.length;
            m.push(c.charAt(index));
        } else {
            var hIndex = a - 1;
            if (hIndex >= 0) {
                var h = e.charAt(hIndex);
                var v = g.indexOf(h);
                if (v === -1) {
                    m.push(h);
                } else {
                    m.push(w.charAt(v));
                }
            } else {
                var gIndex = a % g.length;
                m.push(g.charAt(gIndex));
            }
        }
    }
    
    // 生成最终结果
    var fBase36 = f.toString(36);
    var reversedF = fBase36.split('').reverse().join('');
    var result = reversedF + m.join('');
    result = result.substring(0, e.length);
    
    return result;
}