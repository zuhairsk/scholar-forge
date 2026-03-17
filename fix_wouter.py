import os
import re

def fix_wouter_in_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    
    # Check if wouter is used
    if 'wouter' in content:
        # Replace imports
        # Case 1: import { Link, useLocation } from 'wouter'
        if 'useLocation' in content and 'Link' in content:
            content = re.sub(
                r"import\s*\{\s*Link,\s*useLocation\s*\}\s*from\s*['\"]wouter['\"];?",
                "import Link from 'next/link';\nimport { useRouter } from 'next/navigation';",
                content
            )
        # Case 2: import { Link } from 'wouter'
        elif 'Link' in content:
            content = re.sub(
                r"import\s*\{\s*Link\s*\}\s*from\s*['\"]wouter['\"];?",
                "import Link from 'next/link';",
                content
            )
        # Case 3: import { useLocation } from 'wouter'
        elif 'useLocation' in content:
            content = re.sub(
                r"import\s*\{\s*useLocation\s*\}\s*from\s*['\"]wouter['\"];?",
                "import { useRouter } from 'next/navigation';",
                content
            )

        # Fix useLocation usage: const [, setLocation] = useLocation(); -> const router = useRouter();
        content = re.sub(
            r"const\s*\[\s*,\s*setLocation\s*\]\s*=\s*useLocation\(\);?",
            "const router = useRouter();",
            content
        )
        
        # We might have `const [location, setLocation] = useLocation();` 
        # But looking at previous files, they usually did `const [, setLocation]`

        # Fix setLocation('/path') -> router.push('/path')
        content = re.sub(
            r"setLocation\(",
            "router.push(",
            content
        )

    # We also need to add dynamic = 'force-dynamic' to ALL pages in app/(app) if missing.
    if 'app\\(app)' in filepath or 'app/(app)' in filepath or 'app\\(auth)' in filepath or 'app/(auth)' in filepath or filepath.endswith('app\\page.tsx') or filepath.endswith('app/page.tsx'):
        if "export const dynamic = 'force-dynamic'" not in content:
            content = re.sub(r"(['\"]use client['\"][;\n]*)", r"\1\nexport const dynamic = 'force-dynamic';\n\n", content)

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Fixed {filepath}")

def main():
    app_dir = os.path.join(os.getcwd(), 'app')
    for root, dirs, files in os.walk(app_dir):
        for file in files:
            if file.endswith('.tsx') or file.endswith('.ts') or file.endswith('.jsx') or file.endswith('.js'):
                fix_wouter_in_file(os.path.join(root, file))

if __name__ == '__main__':
    main()
