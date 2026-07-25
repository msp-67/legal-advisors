#!/bin/bash
# Stahne originalni assety z Frameru. Spustit z korene projektu.
curl -L -o assets/img/hero.png "https://framerusercontent.com/images/3SKg5nTTLnGc2zJKiI8xKStsKU.png?width=890&height=1232"
curl -L -o assets/img/og.png "https://framerusercontent.com/images/raxoAdz6rDzEHvkD0mVdcVpzrU.png"
# Volitelne: WebP verze (vyzaduje cwebp)
command -v cwebp >/dev/null && cwebp -q 82 assets/img/hero.png -o assets/img/hero.webp || echo "cwebp neni nainstalovany, WebP preskakuji"
