"""批量压缩 public/assets 下的 PNG，输出 WebP 并删除原 PNG。"""
from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
ASSET_DIRS = [
    ROOT / "public" / "assets" / "web_virtual_pet_assets",
    ROOT / "images" / "web_virtual_pet_assets",
]

# (路径前缀, 最大宽, 最大高, WebP 质量)
RULES: list[tuple[str, int, int | None, int]] = [
    ("backgrounds/bg_", 1920, None, 80),
    ("ui/buttons/", 256, 256, 85),
    ("pets/qilin/state/", 360, None, 85),
    ("ui/icons/", 128, 128, 85),
    ("ui/status_bars/", 480, None, 82),
    ("items/", 256, 256, 85),
    ("effects/", 256, 256, 85),
    ("share/", 1024, None, 82),
    ("outfits/", 256, 256, 85),
    ("pets/cat/", 512, None, 85),
    ("source_reference/", 1280, None, 80),
]

SKIP_FILES = {"backgrounds/1.png"}


def match_rule(rel_posix: str) -> tuple[int, int | None, int]:
    for prefix, max_w, max_h, quality in RULES:
        if rel_posix.startswith(prefix):
            return max_w, max_h, quality
    return 1024, None, 82


def resize(img: Image.Image, max_w: int, max_h: int | None) -> Image.Image:
    w, h = img.size
    if max_h is not None:
        img.thumbnail((max_w, max_h), Image.Resampling.LANCZOS)
        return img
    if w > max_w:
        ratio = max_w / w
        return img.resize((max_w, max(1, int(h * ratio))), Image.Resampling.LANCZOS)
    return img


def process_png(png_path: Path, asset_root: Path) -> tuple[int, int] | None:
    rel = png_path.relative_to(asset_root).as_posix()
    if rel in SKIP_FILES:
        print(f"  skip (unused): {rel}")
        return None

    max_w, max_h, quality = match_rule(rel)
    old_size = png_path.stat().st_size

    with Image.open(png_path) as im:
        has_alpha = im.mode in ("RGBA", "LA") or (
            im.mode == "P" and "transparency" in im.info
        )
        img = im.convert("RGBA") if has_alpha else im.convert("RGB")
        img = resize(img, max_w, max_h)

        webp_path = png_path.with_suffix(".webp")
        img.save(webp_path, "WEBP", quality=quality, method=6)

    new_size = webp_path.stat().st_size
    png_path.unlink()
    return old_size, new_size


def optimize_dir(asset_root: Path) -> tuple[int, int, int]:
    if not asset_root.exists():
        return 0, 0, 0

    total_old = 0
    total_new = 0
    count = 0

    for png_path in sorted(asset_root.rglob("*.png")):
        result = process_png(png_path, asset_root)
        if result is None:
            continue
        old_size, new_size = result
        rel = png_path.relative_to(asset_root).as_posix()
        pct = (1 - new_size / old_size) * 100 if old_size else 0
        print(
            f"  {rel}: {old_size // 1024}KB -> {new_size // 1024}KB ({pct:.0f}% smaller)"
        )
        total_old += old_size
        total_new += new_size
        count += 1

    return count, total_old, total_new


def main() -> int:
    grand_count = 0
    grand_old = 0
    grand_new = 0

    for asset_root in ASSET_DIRS:
        print(f"\n=== {asset_root.relative_to(ROOT)} ===")
        count, old, new = optimize_dir(asset_root)
        grand_count += count
        grand_old += old
        grand_new += new

    if grand_count == 0:
        print("No PNG files found.")
        return 0

    saved = grand_old - grand_new
    pct = saved / grand_old * 100 if grand_old else 0
    print(
        f"\nDone: {grand_count} files, "
        f"{grand_old / 1024 / 1024:.1f}MB -> {grand_new / 1024 / 1024:.1f}MB "
        f"(saved {saved / 1024 / 1024:.1f}MB, {pct:.0f}%)"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
