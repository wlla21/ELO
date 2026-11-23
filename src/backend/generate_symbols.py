import json
import re
import shutil
from pathlib import Path

BASE_DIR = Path(__file__).parent

SOURCE_DIR = BASE_DIR.parent / "images" / "EN-symbols"

OUTPUT_DIR = BASE_DIR / "images" / "EN-symbols"
DATA_DIR = BASE_DIR / "data" 
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
DATA_DIR.mkdir(parents=True, exist_ok=True)

symbols = []
used_ids = set()

for image in SOURCE_DIR.rglob("*"):
    if not image.is_file() or image.suffix.lower() != ".svg":
        continue

    symbol_id = re.sub(r"[^a-zA-Z0-9]", "_", image.stem.lower()).strip("_")

    if not symbol_id:
        continue

    unique_id = symbol_id
    counter = 2

    while unique_id in used_ids:
        unique_id = f"{symbol_id}_{counter}"
        counter += 1

    used_ids.add(unique_id)

    destination = OUTPUT_DIR / f"{unique_id}.svg"
    shutil.copy(image, destination)
    symbols.append({
                    "id": unique_id,
                     "label": unique_id.replace("_", " ").title(),
                     "category": "uncategorized", 
                     "image": f"/symbols/{destination.name}", 
                     "message": "", 
                     "keywords": []
                     })

output = {
        "total": len(symbols),
        "symbols": symbols
        }
    
with open(DATA_DIR / "symbols.json", "w", encoding="utf-8") as f:
    json.dump(output, f, indent=2, ensure_ascii=False)

print(f"Generated {len(symbols)} symbols.")