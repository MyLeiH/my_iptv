from base.parser import Parser
import requests
from typing import Tuple, Any, Dict, Union, Iterable
import base64
import json
import time
import threading
import logging

# 配置日志
logger = logging.getLogger(__name__)

class Parser(Parser):
    """
    吉林电视台解析器 - 优化加速版
    支持缓存、预加载、异步更新等特性
    """

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # 缓存机制
        self._cache = {}
        self._cache_time = {}
        self._cache_lock = threading.Lock()
        
        # 预加载数据
        self._preload_data = {}
        self._preload_time = 0
        self._preload_lock = threading.Lock()
        
        # 缓存清理时间
        self._last_cleanup = time.time()
        
        # 请求会话（连接复用）
        self._session = requests.Session()
        self._session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': '*/*',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Referer': 'https://www.jlntv.cn/'
        })
        
        logger.info("吉林电视台解析器初始化完成")

    def parse(self, params: Dict[str, str]) -> Dict[str, str]:
        """
        解析吉林电视台参数并返回播放地址 - 优化加速版
        
        Args:
            params: 参数字典，包含频道ID
            
        Returns:
            包含播放地址或错误信息的字典
        """
        start_time = time.time()
        
        try:
            # 清理过期缓存
            self._cleanup_expired_cache()
            
            # 获取频道ID参数
            channel_id = params.get("id", "jlws").strip().lower()
            
            # 检查缓存
            cache_key = f"channel_{channel_id}"
            cached_result = self._get_cached_result(cache_key)
            if cached_result:
                logger.debug(f"缓存命中: {channel_id}, 耗时: {time.time() - start_time:.3f}s")
                return {"url": cached_result}
            
            # 频道映射
            channel_number = self._get_channel_number(channel_id)
            if not channel_number:
                return {"error": f"不支持的频道ID: {channel_id}"}
            
            # 获取播放地址
            play_url = self._fast_get_stream_url(channel_number)
            
            if not play_url:
                logger.warning(f"无法获取频道 {channel_id} 的播放地址")
                return {"error": "无法获取播放地址"}
            
            # 更新缓存
            self._set_cached_result(cache_key, play_url)
            
            # 异步预加载数据
            self._async_preload_data()
            
            logger.info(f"解析成功: {channel_id} -> {self._mask_url(play_url)}, 总耗时: {time.time() - start_time:.3f}s")
            return {"url": play_url}
            
        except Exception as e:
            logger.error(f"解析失败: {e}", exc_info=True)
            return {"error": f"解析失败: {str(e)}"}

    def _get_channel_number(self, channel_id: str) -> int:
        """获取频道编号"""
        channel_mapping = {
            'jlws': 2,    # 吉林卫视
            'jlds': 3,    # 吉林都市
            'jlsh': 4,    # 吉林生活
            'jlys': 5,    # 吉林影视
            'jlxc': 6,    # 吉林乡村
            'jlzywh': 8,  # 吉林综艺·文化
            'ybws': 22,   # 延边卫视
            'cczh': 31,   # 长春综合
            'jlszh': 23,  # 吉林市新闻综合
            'spzh': 24,   # 四平新闻综合
            'lyzh': 25,   # 辽源新闻综合
            'thzh': 26,   # 通化新闻综合
            'bszh': 29,   # 白山新闻综合
            'bczh': 27,   # 白城新闻综合
            'syzh': 28    # 松原新闻综合
        }
        return channel_mapping.get(channel_id, 2)  # 默认吉林卫视

    def _get_cached_result(self, cache_key: str) -> str:
        """获取缓存结果"""
        with self._cache_lock:
            current_time = time.time()
            if (cache_key in self._cache and 
                current_time - self._cache_time.get(cache_key, 0) < 30):  # 30秒缓存
                return self._cache[cache_key]
        return ""

    def _set_cached_result(self, cache_key: str, result: str):
        """设置缓存结果"""
        with self._cache_lock:
            self._cache[cache_key] = result
            self._cache_time[cache_key] = time.time()

    def _cleanup_expired_cache(self):
        """清理过期缓存"""
        current_time = time.time()
        if current_time - self._last_cleanup > 300:  # 5分钟清理一次
            with self._cache_lock:
                expired_keys = [
                    k for k, t in self._cache_time.items() 
                    if current_time - t > 60  # 60秒过期
                ]
                for key in expired_keys:
                    self._cache.pop(key, None)
                    self._cache_time.pop(key, None)
                self._last_cleanup = current_time
                if expired_keys:
                    logger.debug(f"清理了 {len(expired_keys)} 个过期缓存")

    def _fast_get_stream_url(self, channel_number: int) -> str:
        """
        快速获取流地址
        """
        # 首先检查预加载数据
        with self._preload_lock:
            if (self._preload_data and 
                time.time() - self._preload_time < 60):  # 1分钟预加载缓存
                cached_url = self._preload_data.get(str(channel_number))
                if cached_url:
                    return cached_url
        
        # 实时获取数据
        api_data = self._fetch_api_data()
        if not api_data:
            return ""
        
        # 提取流地址并更新预加载数据
        stream_url = self._extract_stream_url(api_data, channel_number)
        if stream_url:
            self._update_preload_data(api_data)
        
        return stream_url

    def _fetch_api_data(self) -> dict:
        """
        获取API数据 - 带重试机制
        """
        max_retries = 2
        for attempt in range(max_retries + 1):
            try:
                response = self._session.get(
                    "https://clientapi.jlntv.cn/broadcast/list?page=1&size=10000&type=1",
                    timeout=5  # 5秒超时
                )
                
                if response.status_code != 200:
                    logger.warning(f"API响应状态码异常: {response.status_code}")
                    if attempt < max_retries:
                        continue
                    return {}
                
                # 处理响应数据
                cleaned_data = response.text.replace('"', '')
                try:
                    decoded_data = base64.b64decode(cleaned_data)
                except Exception as e:
                    logger.warning(f"Base64解码失败: {e}")
                    if attempt < max_retries:
                        continue
                    return {}
                
                # XXTEA解密
                key = "5b28bae827e651b3"
                decrypted_data = self._optimized_xxtea_decrypt(decoded_data, key)
                
                if not decrypted_data:
                    if attempt < max_retries:
                        continue
                    return {}
                
                return json.loads(decrypted_data)
                
            except requests.exceptions.Timeout:
                logger.warning(f"API请求超时 (尝试 {attempt + 1}/{max_retries + 1})")
                if attempt == max_retries:
                    return {}
            except requests.exceptions.RequestException as e:
                logger.warning(f"网络请求异常: {e} (尝试 {attempt + 1}/{max_retries + 1})")
                if attempt == max_retries:
                    return {}
            except Exception as e:
                logger.error(f"API数据处理异常: {e}")
                if attempt == max_retries:
                    return {}
        
        return {}

    def _extract_stream_url(self, api_data: dict, channel_number: int) -> str:
        """从API数据中提取流地址"""
        for item in api_data.get('data', []):
            if (item.get('data') and 
                item['data'].get('id') == channel_number and 
                item['data'].get('streamUrl')):
                return item['data'].get('streamUrl', '')
        return ""

    def _update_preload_data(self, api_data: dict):
        """更新预加载数据"""
        preload_map = {}
        for item in api_data.get('data', []):
            if item.get('data') and item['data'].get('id'):
                preload_map[str(item['data']['id'])] = item['data'].get('streamUrl', '')
        
        with self._preload_lock:
            self._preload_data = preload_map
            self._preload_time = time.time()

    def _async_preload_data(self):
        """异步预加载数据"""
        def preload_task():
            try:
                api_data = self._fetch_api_data()
                if api_data:
                    self._update_preload_data(api_data)
                    logger.debug("异步预加载数据完成")
            except Exception as e:
                logger.error(f"异步预加载失败: {e}")
        
        # 使用守护线程异步执行
        thread = threading.Thread(target=preload_task, daemon=True)
        thread.start()

    def _optimized_xxtea_decrypt(self, data: bytes, key: str) -> str:
        """
        优化版XXTEA解密
        """
        try:
            if len(data) < 8:
                return ""
                
            v = self._str_to_long(data, False)
            k = self._str_to_long(key.encode('utf-8'), False)
            
            # 补齐key长度
            while len(k) < 4:
                k.append(0)
            
            n = len(v) - 1
            if n < 1:
                return ""
                
            # XXTEA解密算法
            z = v[n]
            y = v[0]
            delta = 0x9E3779B9
            q = 6 + 52 // (n + 1)
            sum_val = self._int32(q * delta)
            
            while sum_val != 0:
                e = (sum_val >> 2) & 3
                
                for p in range(n, 0, -1):
                    z = v[p - 1]
                    mx = self._int32(
                        ((z >> 5 & 0x07FFFFFF) ^ (y << 2)) + 
                        ((y >> 3 & 0x1FFFFFFF) ^ (z << 4)) ^ 
                        ((sum_val ^ y) + (k[p & 3 ^ e] ^ z))
                    )
                    y = v[p] = self._int32(v[p] - mx)
                
                z = v[n]
                mx = self._int32(
                    ((z >> 5 & 0x07FFFFFF) ^ (y << 2)) + 
                    ((y >> 3 & 0x1FFFFFFF) ^ (z << 4)) ^ 
                    ((sum_val ^ y) + (k[0 & 3 ^ e] ^ z))
                )
                y = v[0] = self._int32(v[0] - mx)
                sum_val = self._int32(sum_val - delta)
            
            return self._long_to_str(v, True)
            
        except Exception as e:
            logger.error(f"XXTEA解密失败: {e}")
            return ""

    def _str_to_long(self, s: bytes, include_length: bool) -> list:
        """字符串转long数组"""
        v = []
        length = len(s)
        
        for i in range(0, length, 4):
            val = 0
            for j in range(4):
                if i + j < length:
                    val |= s[i + j] << (j * 8)
            v.append(val)
        
        if include_length:
            v.append(length)
        
        return v

    def _long_to_str(self, v: list, include_length: bool) -> str:
        """long数组转字符串"""
        result = []
        length = len(v)
        n = (length - 1) << 2
        
        if include_length:
            m = v[length - 1]
            if m < n - 3 or m > n:
                return ""
            n = m
        
        for i in range(length - 1 if include_length else length):
            val = v[i]
            for j in range(4):
                if i * 4 + j < n:
                    result.append(chr((val >> (j * 8)) & 0xFF))
        
        return ''.join(result)

    def _int32(self, n: int) -> int:
        """32位整数处理"""
        n = int(n)
        n &= 0xFFFFFFFF
        if n & 0x80000000:
            n -= 0x100000000
        return n

    def _mask_url(self, url: str) -> str:
        """掩码URL用于安全日志输出"""
        if not url or len(url) < 20:
            return url
        return url[:20] + "***" + url[-10:]

    def proxy(self, url: str, headers: Dict[str, Any]) -> Tuple[Union[bytes, Iterable[bytes]], Dict[str, str]]:
        """代理方法"""
        return b"Proxy not implemented", {"Content-Type": "text/plain"}

    def stop(self):
        """停止解析器，清理资源"""
        logger.info("停止吉林电视台解析器")
        with self._cache_lock:
            self._cache.clear()
            self._cache_time.clear()
        
        with self._preload_lock:
            self._preload_data.clear()
        
        if hasattr(self, '_session'):
            self._session.close()

    def __del__(self):
        """析构函数"""
        self.stop()
