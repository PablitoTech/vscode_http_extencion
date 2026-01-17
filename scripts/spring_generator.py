import os
import re
import json
import argparse
from pathlib import Path

class SpringHttpGenerator:
    def __init__(self, base_url="http://localhost:8080"):
        self.base_url = base_url
        self.controllers = []

    def find_java_files(self, directory):
        java_files = []
        for root, _, files in os.walk(directory):
            for file in files:
                if file.endswith(".java"):
                    java_files.append(os.path.join(root, file))
        return java_files

    def parse_controller(self, file_path):
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        if "@RestController" not in content and "@Controller" not in content:
            return None

        # Class Name
        class_match = re.search(r'class\s+([A-Za-z0-9_]+)', content)
        class_name = class_match.group(1) if class_match else "Unknown"

        # Base Path
        base_path = ""
        request_mapping = re.search(r'@RequestMapping\s*\(\s*(?:value|path)?\s*=?\s*["\']([^"\']+)["\']', content[:content.find('class')])
        if request_mapping:
            base_path = request_mapping.group(1)

        # Methods
        methods = []
        patterns = [
            (r'@GetMapping\s*\(\s*(?:value|path)?\s*=?\s*["\']([^"\']+)["\']', 'GET'),
            (r'@PostMapping\s*\(\s*(?:value|path)?\s*=?\s*["\']([^"\']+)["\']', 'POST'),
            (r'@PutMapping\s*\(\s*(?:value|path)?\s*=?\s*["\']([^"\']+)["\']', 'PUT'),
            (r'@DeleteMapping\s*\(\s*(?:value|path)?\s*=?\s*["\']([^"\']+)["\']', 'DELETE'),
            (r'@PatchMapping\s*\(\s*(?:value|path)?\s*=?\s*["\']([^"\']+)["\']', 'PATCH'),
            (r'@(Get|Post|Put|Delete|Patch)Mapping\s*(?!\()', 'AUTO')
        ]

        for pattern, http_method in patterns:
            for match in re.finditer(pattern, content):
                method_path = ""
                if http_method == 'AUTO':
                    actual_method = match.group(1).upper()
                else:
                    method_path = match.group(1)
                    actual_method = http_method

                # Find method name (very basic)
                after_match = content[match.end():match.end()+200]
                method_name_match = re.search(r'([A-Za-z0-9_]+)\s*\(', after_match)
                method_name = method_name_match.group(1) if method_name_match else "unknown"

                # Check for RequestBody
                has_body = "@RequestBody" in after_match

                methods.append({
                    "name": method_name,
                    "method": actual_method,
                    "path": method_path,
                    "has_body": has_body
                })

        return {
            "class_name": class_name,
            "base_path": base_path,
            "methods": methods,
            "file_path": file_path
        }

    def generate_http(self, controller):
        lines = []
        lines.append(f"### {controller['class_name']}")
        lines.append(f"# File: {controller['file_path']}")
        lines.append("")

        for m in controller['methods']:
            full_path = f"/{controller['base_path'].strip('/')}/{m['path'].strip('/')}".replace("//", "/")
            lines.append(f"# {m['name']}")
            lines.append(f"{m['method']} {self.base_url}{full_path}")
            lines.append("Authorization: Bearer {{token}}")
            
            if m['has_body']:
                lines.append("Content-Type: application/json")
                lines.append("")
                lines.append("{}") # Placeholder body
            
            lines.append("")
            lines.append("###")
            lines.append("")

        return "\n".join(lines)

def main():
    parser = argparse.ArgumentParser(description="Generate .http files from Spring Boot Controllers")
    parser.add_argument("path", help="Path to Java project or file")
    parser.add_argument("--url", default="http://localhost:8080", help="Base URL")
    parser.add_argument("--out", default="http-requests", help="Output directory")

    args = parser.parse_args()

    generator = SpringHttpGenerator(args.url)
    
    if os.path.isfile(args.path):
        files = [args.path]
    else:
        files = generator.find_java_files(args.path)

    if not os.path.exists(args.out):
        os.makedirs(args.out)

    count = 0
    for file in files:
        info = generator.parse_controller(file)
        if info:
            http_content = generator.generate_http(info)
            out_file = os.path.join(args.out, f"{info['class_name']}.http")
            with open(out_file, 'w', encoding='utf-8') as f:
                f.write(http_content)
            print(f"Generated: {out_file}")
            count += 1

    print(f"\nDone! Generated {count} .http files in '{args.out}'")

if __name__ == "__main__":
    main()
