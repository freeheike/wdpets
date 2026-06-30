"""将 Qilin/state 下用户抠图素材整理为 1.png~10.png 并复制到 public。

用法: python scripts/process_qilin.py

不再做抠图，直接复制用户已处理好的 PNG。
"""
import os
import re
import shutil

SRC_DIR = os.path.normpath(os.path.join(
    os.path.dirname(__file__), '..', 'images', 'web_virtual_pet_assets', 'pets', 'Qilin', 'state'
))
OUT_DIRS = [
    os.path.normpath(os.path.join(os.path.dirname(__file__), '..', 'images', 'web_virtual_pet_assets', 'pets', 'qilin', 'state')),
    os.path.normpath(os.path.join(os.path.dirname(__file__), '..', 'public', 'assets', 'web_virtual_pet_assets', 'pets', 'qilin', 'state')),
]

CN_PATTERN = re.compile(r'水墨国风宠物动作图生成\s*\((\d+)\)\.png$', re.I)


def resolve_mapping() -> dict[int, str]:
    """解析源目录文件名 → 帧序号。"""
    mapping: dict[int, str] = {}
    if not os.path.isdir(SRC_DIR):
        raise SystemExit(f'源目录不存在: {SRC_DIR}')

    for name in os.listdir(SRC_DIR):
        path = os.path.join(SRC_DIR, name)
        if not os.path.isfile(path) or not name.lower().endswith('.png'):
            continue

        # 已是 1.png 格式
        if re.match(r'^(\d+)\.png$', name, re.I):
            mapping[int(name[:-4])] = path
            continue

        # 1 (3).png → 帧 1
        if re.match(r'^1\s*\(\d+\)\.png$', name, re.I):
            mapping[1] = path
            continue

        m = CN_PATTERN.match(name)
        if m:
            mapping[int(m.group(1))] = path

    return mapping


def main():
    mapping = resolve_mapping()
    missing = [i for i in range(1, 11) if i not in mapping]
    if missing:
        raise SystemExit(f'缺少帧: {missing}，当前找到: {sorted(mapping.keys())}')

    for out_dir in OUT_DIRS:
        os.makedirs(out_dir, exist_ok=True)

    for idx in range(1, 11):
        src = mapping[idx]
        for out_dir in OUT_DIRS:
            dst = os.path.join(out_dir, f'{idx}.png')
            shutil.copy2(src, dst)
            print(f'  {os.path.basename(src)} -> {dst}')

    # 源目录也统一为 1.png~10.png
    for name in os.listdir(SRC_DIR):
        p = os.path.join(SRC_DIR, name)
        if os.path.isfile(p) and not re.match(r'^(\d+)\.png$', name, re.I):
            os.remove(p)
    for idx in range(1, 11):
        shutil.copy2(mapping[idx], os.path.join(SRC_DIR, f'{idx}.png'))

    print('完成：10 帧已同步（用户抠图，无自动抠图）')


if __name__ == '__main__':
    main()
