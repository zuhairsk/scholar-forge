import glob
import os
import re

pages_dir = r"c:\Users\zuhai\Downloads\scholar-forge\artifacts\scholar-forge\src\pages"
files = glob.glob(os.path.join(pages_dir, "*.tsx"))

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Remove the import statement
    content = re.sub(r"import\s*\{\s*AppLayout\s*\}\s*from\s*'@/components/layout/AppLayout';\n?", "", content)
    content = re.sub(r'import\s*\{\s*AppLayout\s*\}\s*from\s*"@/components/layout/AppLayout";\n?', "", content)

    # Replace <AppLayout ...> with <>
    content = re.sub(r"<AppLayout[^>]*>", "<>", content)

    # Replace </AppLayout> with </>
    content = re.sub(r"</AppLayout>", "</>", content)

    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

print(f"Processed {len(files)} files.")
