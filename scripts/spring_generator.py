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

                # Look ahead to capture the method signature (up to 600 chars)
                after_match = content[match.end():match.end()+600]
                method_name_match = re.search(r'([A-Za-z0-9_]+)\s*\(', after_match)
                method_name = method_name_match.group(1) if method_name_match else "unknown"

                # Check for RequestBody
                has_body = "@RequestBody" in after_match

                # Extract @RequestParam parameters with example values
                query_params = []
                # Match each @Parameter(...) @RequestParam(...) pair
                param_pattern = re.compile(
                    r'@Parameter\s*\([^)]*\bexample\s*=\s*["\']([^"\']+)["\'][^)]*\)\s*@RequestParam\s*(?:\([^)]*\))?\s*\w+\s+(\w+)'
                    r'|@RequestParam\s*(?:\(\s*(?:name|value)\s*=\s*["\']([^"\']+)["\']\s*(?:,[^)]*)?\)|(?:\([^)]*\))?)\s*\w+\s+(\w+)'
                )
                # Simpler: find all @RequestParam in after_match and pair with @Parameter example
                rp_pattern = re.compile(
                    r'(?:@Parameter\s*\([^)]*\bexample\s*=\s*["\']([^"\']+)["\'][^)]*\)\s*)?'
                    r'@RequestParam\s*(?:\(\s*(?:(?:name|value)\s*=\s*["\']([^"\']+)["\']|[^)]*)\s*\))?\s*\w+\s+(\w+)'
                )
                for rp in rp_pattern.finditer(after_match):
                    example_val = rp.group(1) or 'value'
                    param_name = rp.group(2) or rp.group(3)
                    if param_name and param_name not in ('int', 'long', 'String', 'boolean', 'page', 'size'):
                        query_params.append({"name": param_name, "example": example_val})

                methods.append({
                    "name": method_name,
                    "method": actual_method,
                    "path": method_path,
                    "has_body": has_body,
                    "query_params": query_params
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
        lines.append(f"# Generated from: {controller['file_path']}")
        lines.append("")
        lines.append(f"@baseUrl = {self.base_url}")
        lines.append("@token = ")
        lines.append("")

        for m in controller['methods']:
            base = controller['base_path'].strip('/')
            method_path = m['path'].strip('/')
            full_path = f"/{base}/{method_path}".replace("//", "/") if method_path else f"/{base}"

            # Build query string from @RequestParam with example values
            query_string = ""
            if m.get('query_params'):
                qs_parts = [f"{p['name']}={p['example']}" for p in m['query_params']]
                query_string = "?" + "&".join(qs_parts)

            lines.append(f"# {m['name']}")
            lines.append(f"{m['method']} {{{{baseUrl}}}}{full_path}{query_string}")
            lines.append("Authorization: Bearer {{token}}")

            if m['has_body']:
                lines.append("Content-Type: application/json")
                lines.append("")
                lines.append("{}")

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
