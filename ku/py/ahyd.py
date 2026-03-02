from base.parser import Parser
import requests,urllib.parse,re,logging,time,threading,base64 as b64
from datetime import datetime
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
from typing import Dict,Union,Tuple,Iterable,Any

class Parser(Parser):
 def __init__(self,*a,**k):
  super().__init__(*a,**k)
  
  def _d(s):
   decoded_str = b64.b64decode(s).decode()
   return ''.join(chr(ord(c) - 1) for c in decoded_str)
  h = _d('MjIyLzQ6LzMxMy82ODs4ODkz')
  self.proxy_addr = h
  self.p0 = {'http': f'socks5://{h}', 'https': f'socks5://{h}'}
  
  self.s1 = self._c2()
  logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
  self.l3 = logging.getLogger(__name__)
  self.l3.info("优化版SOCKS5代理解析器初始化完成")

 def _c2(self):
  s = requests.Session()
  a = HTTPAdapter(pool_connections=20, pool_maxsize=50, max_retries=Retry(total=1, backoff_factor=0.1, status_forcelist=[500, 502, 503, 504]))
  s.mount('http://', a); s.mount('https://', a)
  s.headers.update({
   'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
   'Accept': '*/*',
   'Accept-Encoding': 'identity',
   'Connection': 'keep-alive',
  })
  return s

 def parse(self, p: Dict[str, str]) -> Dict[str, str]:
  try:
   u = p.get("a", "").strip()
   if not u:
    return {"error": "缺少播放URL参数", "usage": "请使用 ?a=播放URL 的形式调用"}
   if not u.startswith(('http://', 'https://')):
    return {"error": "无效的URL格式", "message": "URL必须以 http:// 或 https:// 开头"}
   ps = p.get("playseek", "").strip()
   if ps:
    u = self._f4(u, ps)
   t = threading.Thread(target=self._t5, args=(u,))
   t.daemon = True
   t.start()
   pu = f"{self.address}?a={urllib.parse.quote(u, safe='')}"
   return {
    "url": pu,
    "proxy_type": "SOCKS5",
    "proxy_server": self.proxy_addr,
    "status": "ready",
    "play_url": pu,
    "m3u8_url": u,
    "note": "优化版代理，快速回看支持"
   }
  except Exception as e:
   self.l3.error(f"解析参数时出错: {e}")
   return {"error": f"解析失败: {str(e)}"}

 def _f4(self, u: str, ps: str) -> str:
  try:
   if '-' not in ps:
    return u
   s, e = ps.split('-', 1)
   st = self._p6(s)
   et = self._p6(e)
   if st and et:
    sep = '&' if '?' in u else '?'
    u += f"{sep}playseek={st}-{et}"
   return u
  except Exception as ex:
   self.l3.warning(f"快速处理回看参数时出错: {ex}")
   return u

 def _p6(self, t: str) -> str:
  try:
   c = t.strip()
   if c.startswith('${(') and c.endswith(')}'):
    c = c[3:-2]
   if c.isdigit():
    if len(c) == 13:
     return c
    elif len(c) == 10:
     return f"{c}000"
   if '|' in c:
    fp, tz = c.split('|', 1)
    return self._f7(fp)
   else:
    return self._f7(c)
  except:
   return str(int(time.time() * 1000))

 def _f7(self, f: str) -> str:
  try:
   m = {'yyyy': '%Y', 'MM': '%m', 'dd': '%d', 'HH': '%H', 'mm': '%M', 'ss': '%S'}
   pf = f
   for k, v in m.items():
    pf = pf.replace(k, v)
   return datetime.now().strftime(pf)
  except:
   return datetime.now().strftime('%Y%m%d%H%M%S')

 def _t5(self, u: str):
  try:
   r = self.s1.head(u, proxies=self.p0, timeout=2, verify=False)
   if r.status_code == 200:
    self.l3.info(f"连接测试成功: {r.status_code}")
  except:
   pass

 def stop(self):
  if hasattr(self, 's1'):
   self.s1.close()
  self.l3.info("SOCKS5代理解析器已停止")

 def proxy(self, url: str, h: Dict[str, Any]) -> Tuple[Union[bytes, Iterable[bytes]], Dict[str, str]]:
  st = time.time()
  try:
   pu = urllib.parse.urlparse(url)
   qp = urllib.parse.parse_qs(pu.query)
   tu = qp.get('a', [''])[0]
   if not tu:
    return self._e8("缺少URL参数a")
   im = self._i9(tu, h)
   to = 3 if im else 8
   r = self.s1.get(tu, proxies=self.p0, timeout=to, verify=False, stream=not im)
   if r.status_code != 200:
    return self._e8(f"请求失败: {r.status_code}")
   if im:
    c = self._m0(r.text, tu)
    cb = c.encode('utf-8')
    rh = {
     'Content-Type': 'application/vnd.apple.mpegurl',
     'Content-Length': str(len(cb)),
     'Access-Control-Allow-Origin': '*',
     'Cache-Control': 'no-cache, max-age=0',
     'X-Processing-Time': f'{time.time() - st:.2f}s'
    }
   else:
    cb = r.content
    rh = {
     'Content-Type': 'video/mp2t',
     'Content-Length': str(len(cb)),
     'Access-Control-Allow-Origin': '*',
     'Cache-Control': 'public, max-age=7200',
     'X-Processing-Time': f'{time.time() - st:.2f}s'
    }
   tt = time.time() - st
   if tt > 2.0:
    self.l3.info(f"代理完成: {len(cb)} bytes, 耗时: {tt:.2f}s")
   return cb, rh
  except requests.exceptions.Timeout:
   return self._e8("请求超时，请检查网络或源地址")
  except requests.exceptions.ConnectionError:
   return self._e8("连接失败，请检查代理设置")
  except Exception as e:
   return self._e8(f"代理错误: {str(e)}")

 def _i9(self, url: str, h: Dict[str, Any]) -> bool:
  return '.m3u8' in url.lower()

 def _m0(self, c: str, b: str) -> str:
  if not c or not c.strip():
   return c
  ls = c.splitlines()
  pl = []
  bd = b.rsplit('/', 1)[0] + '/' if '/' in b else b
  for l in ls:
   if not l or l.startswith('#'):
    pl.append(l)
    continue
   if l.startswith(('http://', 'https://')):
    pu = f"{self.address}?a={urllib.parse.quote(l, safe='')}"
    pl.append(pu)
   else:
    if l.startswith('/'):
     p = urllib.parse.urlparse(b)
     fu = f"{p.scheme}://{p.netloc}{l}"
    else:
     fu = urllib.parse.urljoin(bd, l)
    pu = f"{self.address}?a={urllib.parse.quote(fu, safe='')}"
    pl.append(pu)
  return '\n'.join(pl)

 def _e8(self, m: str) -> Tuple[bytes, Dict[str, str]]:
  eb = m.encode('utf-8')
  return eb, {
   'Content-Type': 'text/plain',
   'Content-Length': str(len(eb)),
   'Access-Control-Allow-Origin': '*'
  }

 def __del__(self):
  self.stop()