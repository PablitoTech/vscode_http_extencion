# 🚀 Installation & Quick Start Guide

## Prerequisites

- **Visual Studio Code** 1.85.0 or higher
- **Node.js** 16.x or higher
- **npm** 7.x or higher
- A Spring Boot Java project

## Option 1: Install from VSIX (Recommended)

### Step 1: Build the Extension

```powershell
# Navigate to project directory
cd d:\vscode_http_extencion

# Run the packaging script
.\scripts\package.ps1
```

This will:
- Install dependencies
- Compile TypeScript
- Create a `.vsix` file

### Step 2: Install in VS Code

```bash
# Install the extension
code --install-extension spring-http-generator-0.1.0.vsix
```

Or manually:
1. Open VS Code
2. Press `Ctrl+Shift+X` (Extensions view)
3. Click the `...` menu → "Install from VSIX..."
4. Select `spring-http-generator-0.1.0.vsix`

### Step 3: Reload VS Code

Press `Ctrl+Shift+P` → "Reload Window"

## Option 2: Development Mode

### Step 1: Clone and Setup

```bash
cd d:\vscode_http_extencion
npm install
npm run compile
```

### Step 2: Debug in VS Code

1. Open the project in VS Code
2. Press `F5` to launch Extension Development Host
3. A new VS Code window will open with the extension loaded

## 🎯 Quick Start

### 1. Open a Spring Boot Project

Open any Java Spring Boot project in VS Code.

### 2. Generate HTTP Requests

**Method A: From Command Palette**
1. Press `Ctrl+Shift+P`
2. Type "Generate HTTP Request File"
3. Select a controller from the list

**Method B: From Context Menu**
1. Right-click on a controller file (e.g., `UserController.java`)
2. Select "Generate .http from Controller"

**Method C: Single Method**
1. Place cursor inside a method
2. Right-click
3. Select "Generate HTTP Request from Method"

### 3. View Generated File

The `.http` file will be created in the `http-requests/` folder.

### 4. Test Your API

1. Install the [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) extension
2. Open the generated `.http` file
3. Click "Send Request" above any request
4. Replace placeholders like `{{token}}` and `{{id}}` with actual values

## ⚙️ Configuration

Open VS Code settings (`Ctrl+,`) and search for "Spring HTTP Generator":

```json
{
  // Base URL for all requests
  "spring-http-generator.baseUrl": "http://localhost:8080",
  
  // Output directory for .http files
  "spring-http-generator.outputDirectory": "http-requests",
  
  // Auto-add Authorization header for secured endpoints
  "spring-http-generator.includeAuthHeader": true
}
```

## 📝 Example Workflow

### 1. You have this controller:

```java
@SecurityRequirement(name = "token")
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody UserDTO dto) {
        // ...
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        // ...
    }
}
```

### 2. Right-click on the file → "Generate .http from Controller"

### 3. Extension generates:

```http
### UserController
# Generated from: controllers/UserController.java

# createUser
POST http://localhost:8080/api/users
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "name": "",
  "email": "",
  "age": 0
}

###

# getUser
GET http://localhost:8080/api/users/{{id}}
Authorization: Bearer {{token}}

###
```

### 4. Test immediately!

Replace `{{token}}` with your actual JWT token and click "Send Request".

## 🔧 Troubleshooting

### Extension not appearing in Command Palette

- Reload VS Code: `Ctrl+Shift+P` → "Reload Window"
- Check if extension is enabled: Extensions view → Search "Spring HTTP Generator"

### No controllers found

- Ensure your Java files contain `@RestController` or `@Controller`
- Check that files are in the workspace folder

### DTO not found / Empty JSON body

- Ensure DTO class is in the same workspace
- DTO file must be named exactly as the class (e.g., `UserDTO.java`)

### Generated file not opening

- Check the output directory setting
- Look in the workspace root for `http-requests/` folder

## 📊 Viewing Logs

To see detailed logs:
1. Press `Ctrl+Shift+P`
2. Type "Output"
3. Select "Spring HTTP Generator" from the dropdown

## 🎓 Tips

1. **Use variables**: Define variables in a `.http` file:
   ```http
   @token = your-jwt-token-here
   @baseUrl = http://localhost:8080
   
   GET {{baseUrl}}/api/users
   Authorization: Bearer {{token}}
   ```

2. **Multiple environments**: Create separate `.http` files for dev, staging, prod

3. **Version control**: Commit `.http` files but use `.gitignore` for sensitive tokens

## 🚀 Next Steps

- Explore the [README](README.md) for full feature list
- Check [CHANGELOG](CHANGELOG.md) for version history
- Report issues or suggest features on GitHub

## 📦 Publishing Your Own Version

If you want to customize and publish:

1. Update `package.json`:
   ```json
   {
     "publisher": "your-publisher-name",
     "name": "your-extension-name"
   }
   ```

2. Get a [Personal Access Token](https://dev.azure.com/)

3. Publish:
   ```bash
   vsce login your-publisher-name
   vsce publish
   ```

---

**Happy API Testing! 🎉**
