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

## 📦 Empaquetado (Generar .vsix)

Para generar el archivo instalable que se puede compartir (`.vsix`), utiliza el script de PowerShell optimizado:

```powershell
.\scripts\package.ps1
```

- **¿Qué hace este script?**: Limpia compilaciones anteriores, instala dependencias limpias, compila el código y empaqueta todo.
- **¿Donde queda el instalable?**: El archivo final se genera en la carpeta `/dist/` con el nombre `spring-http-generator-0.0.1.vsix`.

---

## 🧪 Pruebas en Vivo

Para probar tus cambios sin empaquetar:
1. Abre el proyecto en VS Code.
2. Presiona `F5`.
3. Se abrirá una nueva ventana de VS Code ("Extension Development Host") con tu versión de la extensión cargada para probarla en tiempo real.

---
**Documentación para desarrolladores de PablitoTech**
code --install-extension "d:\vscode_http_extencion\spring-http-generator-0.0.1.vsix" --force