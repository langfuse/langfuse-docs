import os
import re

SMALL_WORDS = {
    'a', 'an', 'the', 'and', 'but', 'or', 'nor', 'for', 'so', 'yet', 'at', 'by',
    'in', 'of', 'on', 'to', 'up', 'via', 'with', 'from', 'into', 'onto', 'off', 'per'
}


def title_case(text: str) -> str:
    words = re.split(r'(\s+|-)', text)
    # Count real words (exclude spaces/hyphens)
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


def fix_file(path: str):
    with open(path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    in_code = False
    changed = False

    for i, line in enumerate(lines):
        stripped = line.strip()
        if stripped.startswith('```') or stripped.startswith('~~~'):
            in_code = not in_code
            continue
        if not in_code and line.startswith('# '):
            title = line[2:].rstrip('\n')
            new_title = title_case(title)
            if new_title != title:
                lines[i] = '# ' + new_title + '\n'
                changed = True
            break

    if changed:
        with open(path, 'w', encoding='utf-8') as f:
            f.writelines(lines)
        print(f'Updated {path}')


def main():
    root = 'pages/docs'
    for dirpath, dirnames, filenames in os.walk(root):
        for name in filenames:
            if name.endswith('.mdx'):
                fix_file(os.path.join(dirpath, name))

if __name__ == '__main__':
    main()
