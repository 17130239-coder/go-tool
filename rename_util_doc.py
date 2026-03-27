import os
import re
import shutil
from pathlib import Path

src = Path('/Users/andynguyen/go-tool/src')
features = src / 'features'

# Step 1: Rename files on disk
for feature_dir in features.iterdir():
    if not feature_dir.is_dir():
        continue
    for f in feature_dir.iterdir():
        if not f.is_file():
            continue
        # Utils -> Util
        if f.name.endswith('Utils.ts'):
            new_name = f.name.replace('Utils.ts', 'Util.ts')
            shutil.move(str(f), str(feature_dir / new_name))
            print(f"Renamed {f.name} -> {new_name}")
        # Docs.md -> Doc.md
        elif f.name.endswith('Docs.md'):
            new_name = f.name.replace('Docs.md', 'Doc.md')
            shutil.move(str(f), str(feature_dir / new_name))
            print(f"Renamed {f.name} -> {new_name}")

# Step 2: Update all import references in .ts/.tsx files
for root, dirs, files in os.walk(src):
    for fname in files:
        if not (fname.endswith('.ts') or fname.endswith('.tsx')):
            continue
        fpath = Path(root) / fname
        content = fpath.read_text()
        new_content = content.replace('Utils\'', 'Util\'').replace('Utils"', 'Util"')
        if new_content != content:
            fpath.write_text(new_content)
            print(f"Updated imports in {fpath.relative_to(src)}")

print("Done!")
