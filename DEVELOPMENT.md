# 🛠️ Guía de Desarrollo - PablitoTech

Esta guía explica cómo configurar el entorno, compilar y empaquetar la extensión **Spring HTTP Generator** desde el código fuente.

---

## 📋 Requisitos Previos

- [Node.js](https://nodejs.org/) (Versión 18 o superior).
- [Visual Studio Code](https://code.visualstudio.com/).
- [Git](https://git-scm.com/).

---

## � Estructura del Proyecto

Entender cómo está organizado el código te ayudará a ubicarte rápidamente:

- `.vscode/`: Configuraciones de desarrollo para el propio proyecto.
- `src/`: **Código fuente** principal de la extensión.
- `test/`: Archivos de prueba (Unitarias e Integración).
- `scripts/`: Scripts de utilidad (como `package.ps1`).
- `out/`: Código compilado (generado por `npm run compile`).
- `dist/`: Paquetes `.vsix` generados (generado por `vsce package`).

---

## �🚀 Configuración del Entorno

1. **Clonar el repositorio**:
   ```bash
   git clone <repository-url>
   cd vscode_http_extencion
   ```

2. **Instalar dependencias**:
   Este paso descarga todas las librerías necesarias y las herramientas de desarrollo.
   ```bash
   npm install
   ```

---

## 🏗️ Proceso de Compilación

La extensión está escrita en TypeScript y necesita ser transpilada a JavaScript para que VS Code pueda ejecutarla.

### 1. Compilar el código
Ejecuta el siguiente comando para generar la versión ejecutable:
```bash
npm run compile
```
- **¿Dónde queda el compilado?**: Los archivos generados se guardan en la carpeta `/out`. VS Code lee esta carpeta para arrancar la extensión.

### 2. Modo Observador (Opcional)
Si estás haciendo cambios constantes, puedes dejar la compilación en modo automático:
```bash
npm run watch
```

---

## 🧹 Calidad de Código y Pruebas

Para mantener el código limpio y libre de errores, utilizamos herramientas estándar.

### Linting (Análisis Estático)
Usamos **ESLint** para asegurar buenas prácticas y estilo consistente. Ejecuta:
```bash
npm run lint
```
*Tip: Si hay errores corregibles automáticamente, ESLint te avisará.*

### Pruebas Unitarias
El proyecto utiliza **Jest** para las pruebas automáticas. Es importante ejecutar las pruebas antes de enviar cambios.
```bash
npm test
```
*Esto compilará el proyecto primero (`pretest`) y luego ejecutará todos los casos de prueba definidos.*

---

## 🧪 Pruebas en Vivo

Para probar tus cambios sin empaquetar:
1. Abre el proyecto en VS Code.
2. Presiona `F5`.
3. Se abrirá una nueva ventana ("Extension Development Host") con la extensión cargada.

---

## 📦 Empaquetado (Generar .vsix)

Para generar el archivo instalable (`.vsix`), utiliza el comando correspondiente a tu sistema operativo. El archivo se generará en la carpeta `dist/`.

### Windows (PowerShell)
El script `package.ps1` se encarga de limpiar, instalar dependencias y compilar todo automáticamente.
```powershell
.\scripts\package.ps1
```

### Mac / Linux
Puedes usar `npm` y `vsce` directamente desde la terminal:
```bash
# 1. Instalar dependencias (si no lo has hecho)
npm install

# 2. Asegurar directorio de salida
mkdir -p dist

# 3. Empaquetar
npx vsce package --out ./dist
```

> **Nota**: El archivo generado tendrá un nombre similar a `spring-http-generator-0.0.2.vsix` dentro de la carpeta `dist`.

---

## 💿 Instalación Manual

Una vez generado el archivo `.vsix`, puedes instalarlo en tu editor preferido usando la línea de comandos. Asegúrate de estar en la raíz del proyecto.

---

### Visual Studio Code

**Windows:**
```powershell
code --install-extension "dist\spring-http-generator-0.0.2.vsix" --force
```
**Mac:**
```bash
code --install-extension dist/spring-http-generator-0.0.2.vsix --force
```
**Linux:**
```bash
code --install-extension dist/spring-http-generator-0.0.2.vsix --force
```

> [!TIP]
> Si `code` no se reconoce, abre VS Code → `Cmd/Ctrl+Shift+P` → **"Shell Command: Install 'code' command in PATH"**.

---

### Cursor

**Windows:**
```powershell
cursor --install-extension "dist\spring-http-generator-0.0.2.vsix" --force
```
**Mac:**
```bash
cursor --install-extension dist/spring-http-generator-0.0.2.vsix --force
```
**Linux:**
```bash
cursor --install-extension dist/spring-http-generator-0.0.2.vsix --force
```

> [!TIP]
> Si `cursor` no se reconoce, abre Cursor → `Cmd/Ctrl+Shift+P` → **"Shell Command: Install 'cursor' command in PATH"**.

---

### Antigravity

**Windows:**
```powershell
antigravity --install-extension "dist\spring-http-generator-0.0.2.vsix" --force
```
**Mac:**
```bash
antigravity --install-extension dist/spring-http-generator-0.0.2.vsix --force
```
**Linux:**
```bash
antigravity --install-extension dist/spring-http-generator-0.0.2.vsix --force
```

> [!TIP]
> Si `antigravity` no se reconoce, abre Antigravity → `Cmd/Ctrl+Shift+P` → **"Shell Command: Install 'antigravity' command in PATH"**.

---

### Kiro

**Windows:**
```powershell
kiro --install-extension "dist\spring-http-generator-0.0.2.vsix" --force
```
**Mac:**
```bash
kiro --install-extension dist/spring-http-generator-0.0.2.vsix --force
```
**Linux:**
```bash
kiro --install-extension dist/spring-http-generator-0.0.2.vsix --force
```

> [!TIP]
> Si `kiro` no se reconoce, abre Kiro → `Cmd/Ctrl+Shift+P` → **"Shell Command: Install 'kiro' command in PATH"**.