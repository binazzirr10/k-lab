#!/bin/sh
# Rebuilds public/fonts/pretendard-landing.woff2 after landing copy changes.
# Characters missing from it still load from the full dynamic subset. Needs uv (https://docs.astral.sh/uv).
set -e
cd "$(dirname "$0")/.."
chars="$(mktemp)"
node -e '
const fs = require("fs"), path = require("path");
const read = (p) => fs.statSync(p).isDirectory() ? fs.readdirSync(p).map((f) => read(path.join(p, f))).join("") : /\.tsx?$/.test(p) ? fs.readFileSync(p, "utf8") : "";
const text = ["src/app/components/landing", "src/lib/landing", "src/lib/k-scenes.ts", "src/app/(marketing)"].map(read).join("");
const hangul = [...new Set(text.match(/[ᄀ-ᇿ㄰-㆏가-힣]/g))];
let ascii = ""; for (let i = 32; i < 127; i++) ascii += String.fromCharCode(i);
process.stdout.write(ascii + " ·–—‑’“”«»…−×→←↗▷Ⅱ " + hangul.join(""));
' > "$chars"
uvx --from 'fonttools[woff]' fonttools varLib.instancer node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2 wght=300:910 -o "$chars.ttf" -q
uvx --from 'fonttools[woff]' pyftsubset "$chars.ttf" --text-file="$chars" --flavor=woff2 --layout-features='kern,liga,calt,ccmp,mark,mkmk' --output-file=public/fonts/pretendard-landing.woff2
rm -f "$chars" "$chars.ttf"
