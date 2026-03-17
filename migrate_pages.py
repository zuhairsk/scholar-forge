import os
import shutil
import re

MAPPING = {
    r"src\pages\AuthorDashboard.tsx": r"app\(app)\dashboard\author\page.tsx",
    r"src\pages\ReviewerDashboard.tsx": r"app\(app)\dashboard\reviewer\page.tsx",
    r"src\pages\Admin.tsx": r"app\(app)\admin\page.tsx",
    r"src\pages\Badges.tsx": r"app\(app)\dashboard\reviewer\badges\page.tsx",
    r"src\pages\Explore.tsx": r"app\(app)\explore\page.tsx",
    r"src\pages\Leaderboard.tsx": r"app\(app)\leaderboard\page.tsx",
    r"src\pages\Submit.tsx": r"app\(app)\dashboard\author\submit\page.tsx",
    r"src\pages\PaperDetail.tsx": r"app\(app)\paper\[id]\page.tsx",
    r"src\pages\ReviewRoom.tsx": r"app\(app)\dashboard\reviewer\active\[id]\page.tsx",
    r"src\pages\Login.tsx": r"app\(auth)\login\page.tsx",
    r"src\pages\Register.tsx": r"app\(auth)\register\page.tsx",
    r"src\pages\Landing.tsx": r"app\page.tsx",
}

def migrate_pages():
    for src, dest in MAPPING.items():
        if os.path.exists(src):
            with open(src, "r", encoding="utf-8") as f:
                content = f.read()
            
            # Make sure to remove any remaining AppLayout elements if any
            content = re.sub(r'import\s*\{\s*AppLayout\s*\}\s*from\s*[\'"]@/components/layout/AppLayout[\'"];?\n?', '', content)
            content = re.sub(r'<AppLayout[^>]*>', '<>', content)
            content = re.sub(r'</AppLayout>', '</>', content)

            # Add 'use client' if not present
            if "'use client'" not in content and '"use client"' not in content:
                content = "'use client'\n\n" + content

            # Prepend export const dynamic = 'force-dynamic' for app/(app) pages
            if r"app\(app)" in dest:
                # Add it right after the 'use client' directive
                content = re.sub(r"(['\"]use client['\"][;\n]*)", r"\1\nexport const dynamic = 'force-dynamic';\n\n", content)

            if os.path.exists(dest):
                with open(dest, "w", encoding="utf-8") as f:
                    f.write(content)
                print(f"Migrated {src} to {dest}")
            else:
                print(f"Destination {dest} not found!")
        else:
            print(f"Source {src} not found!")

if __name__ == "__main__":
    migrate_pages()
