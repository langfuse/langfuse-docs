from pathlib import Path
import re
import sys

SMALL_WORDS = {
    "a", "an", "the", "and", "but", "or", "nor", "for", "so", "yet", "at", "by",
    "in", "of", "on", "to", "up", "via", "with", "from", "into", "onto", "off", "per",
}

DOCS_ROOT = Path("pages/docs")

def title_case(text: str) -> str:
    words = re.split(r'(\s+|-)', text)
    real_words = [w for w in words if w and not re.match(r'(\s+|-)', w)]
    total = len(real_words)
    result = []
    index = 0
    for part in words:
        if re.match(r'(\s+|-)', part):
            result.append(part)
            continue
        word = part
        is_first = index == 0
        is_last = index == total - 1
        lower = word.lower()
        if word.isupper() or any(c.isupper() for c in word[1:]):
            result.append(word)
        elif not is_first and not is_last and lower in SMALL_WORDS:
            result.append(lower)
        else:
            result.append(word.capitalize())
        index += 1
    return ''.join(result)

def check_file(path: Path) -> bool:
    with path.open('r', encoding='utf-8') as f:
        lines = f.readlines()

    in_code = False
    for line in lines:
        stripped = line.strip()
        if stripped.startswith('```') or stripped.startswith('~~~'):
            in_code = not in_code
            continue
        if not in_code and line.startswith('# '):
            title = line[2:].rstrip('\n')
            expected = title_case(title)
            if expected != title:
                print(f'Incorrect title case in {path.relative_to(Path.cwd())}: "{title}" -> "{expected}"')
                return False
            break
    return True

def main() -> None:
    all_ok = True
    for path in DOCS_ROOT.rglob('*.mdx'):
        file_ok = check_file(path)
        if not file_ok:
            all_ok = False
    if not all_ok:
        sys.exit(1)

if __name__ == '__main__':
    main()
