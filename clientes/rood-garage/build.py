"""Gera assets/rood.css, assets/rood.js e publicar.html a partir do index.html.
Uso: python3 build.py <sha-das-imagens> <sha-dos-assets>"""
import re, sys
IMG, ASSETS = sys.argv[1], sys.argv[2]
CDN = 'https://cdn.jsdelivr.net/gh/matheusmouraco/prospecsionnn@{}/clientes/rood-garage/'
s = open('index.html').read()
css = re.search(r'<style>(.*?)</style>', s, re.S).group(1)
css = re.sub(r'/\*.*?\*/', '', css, flags=re.S)
css = re.sub(r'\s*\n\s*', '', css).replace('url(img/', 'url(../img/')
js = re.search(r'<script>\n(\(function \(\) \{.*\}\)\(\);)\n</script>', s, re.S).group(1)
if len(sys.argv) > 3 and sys.argv[3] == 'assets':
    open('assets/rood.css', 'w').write(css); open('assets/rood.js', 'w').write(js + '\n'); sys.exit()
s = re.sub(r'<style>.*?</style>', f'<link rel="stylesheet" href="{CDN.format(ASSETS)}assets/rood.css">', s, flags=re.S)
s = re.sub(r'<script>\n\(function \(\) \{.*\}\)\(\);\n</script>', f'<script src="{CDN.format(ASSETS)}assets/rood.js"></script>', s, flags=re.S)
s = s.replace('"img/', '"' + CDN.format(IMG) + 'img/')
s = re.sub(r'\n\s+', '\n', s)
s = s.replace('<meta name="theme-color"', '<meta name="robots" content="noindex, nofollow">\n<meta name="theme-color"')
open('publicar.html', 'w').write(s)
