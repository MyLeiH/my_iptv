function main(item) {
    const id = ku9.getQuery(item.url, "id") || 'jsws';
    const n = {
   'jsws' : "jsws_live", //江苏卫视 
   'jscs' : "jscs_live", //江苏城市 
   'jszy' : "jszy_live", //江苏综艺 
   'jsys' : "jsys_live", //江苏影视 
   'jsxw' : "jsxw_live", //江苏新闻 
   'jsjy' : "jsjy_live", //江苏教育
   'jsty' : "jsxx_live", //江苏体育休闲 
   'jsgj' : "jsgj_live", //江苏国际 
   'ymkt' : "ymkt_live", //优漫卡通 

   'nj1' : "nanjing", //南京新闻综合 
   'njlh' : "luhe", //六合新闻综合

   'wx1' : "wuxi", //无锡新闻综合 
   'wxjy' : "jiangyin", //江阴新闻综合 

   'xz1' : "xuzhou", //徐州新闻综合 
   'xzpz' : "pizhou", //邳州综合 
   'xzxy' : "xinyi", //新沂新闻综合 
   'xzjw' : "jiawang", //贾汪新闻综合 
   'xzts' : "tongshan", //铜山新闻综合 

   'cz1' : "changzhou", //常州新闻
   'czwj' : "wujin", //武进综合 

   'sz1' : "suzhou", //苏州新闻综合 
   'szcs' : "changshu", // 常熟综合x
   'szwj' : "wujiang", //吴江新闻综合 
   'szzjg' : "zhangjiagang", //张家港新闻综合x 

   'nt1' : "nantong", //南通新闻综合 

   'lyg1' : "lianyungang", //连云港新闻综合 
   'lygdh' : "donghai", //东海新闻综合 

   'ha1' : "huaian", //淮安综合 
   'haxy' : "xuyi", //盱眙综合 
   'hahz' : "hongze", //洪泽综合 

   'yc1' : "yancheng", //盐城1套 
   'ycxs' : "xiangshui", //响水综合

   'yz1' : "yangzhou", //扬州新闻x
   'yzhj' : "hanjiang", //邗江综合x

   'zj1' : "zhenjiang", //镇江新闻综合 
   'zjjr' : "jurong", //句容新闻综合x 

   'tz1' : "taizhou", //泰州新闻 
   'tzjj' : "jingjiang", //靖江新闻 
   'tztx' : "taixing", //泰兴新闻综合 
   'tzxh' : "xinghua", //兴化新闻综合 

   'sq1' : "suqian", //宿迁综合 
   'sqsy' : "siyang", //泗阳综合 
    };

    const t = Math.floor(Date.now() / 1000) + 180;
    const txTime = t.toString(16);
        const a = "tJanAHkyGtaifaQG4dWe";
    //const a = "4hhrs7mm8h6X7CPGjZnK";
    const b = n[id] || n['jsws'];
    const txSecret = ku9.md5(a + b + txTime);

    const finalUrl = `https://litchi-play-encrypted-site.jstv.com/live/${b}.m3u8?txSecret=${txSecret}&txTime=${txTime}`;
    const header_4 = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Referer': 'https://live.jstv.com/',
        'Accept': '*/*',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive'};

    return JSON.stringify({ 
        url: finalUrl,
        headers: JSON.stringify(header_4)
    });
}