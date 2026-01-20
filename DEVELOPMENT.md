# 🛠️ Guía de Desarrollo - PablitoTech

Esta guía explica cómo configurar el entorno, compilar y empaquetar la extensión **Spring HTTP Generator** desde el código fuente.

---

## 📋 Requisitos Previos

- [Node.js](https://nodejs.org/) (Versión 18 o superior).
- [Visual Studio Code](https://code.visualstudio.com/).
- [Git](https://git-scm.com/).

---

## 🚀 Configuración del Entorno

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

# 2. Empaquetar (esto compila automáticamente)
npx vsce package --out ./dist
```

> **Nota**: El archivo generado tendrá un nombre similar a `spring-http-generator-0.0.1.vsix` dentro de la carpeta `dist`.

---

## 💿 Instalación Manual

Una vez generado el archivo `.vsix`, puedes instalarlo en tu editor preferido usando la línea de comandos. Asegúrate de estar en la raíz del proyecto.

### Visual Studio Code
**Windows:**
```powershell
code --install-extension "dist\spring-http-generator-0.0.1.vsix" --force
```

**Mac / Linux:**
```bash
code --install-extension dist/spring-http-generator-0.0.1.vsix --force
```

### Cursor
**Windows:**
```powershell
cursor --install-extension "dist\spring-http-generator-0.0.1.vsix" --force
```

**Mac / Linux:**
```bash
cursor --install-extension dist/spring-http-generator-0.0.1.vsix --force
```