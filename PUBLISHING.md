# 🚀 Guía de Publicación en VS Code Marketplace

Esta guía detalla los pasos necesarios para publicar la extensión **Spring HTTP Generator** en la tienda oficial de Visual Studio Code para que cualquier usuario pueda instalarla fácilmente.

---

## 📋 Requisitos Previos

1.  **Cuenta de Microsoft**: Necesitas una cuenta de Microsoft (Outlook, Hotmail, etc.) para acceder a Azure DevOps.
2.  **Node.js instalado**: Para ejecutar los comandos de empaquetado.

---

## 🛡️ Etapa 1: Crear un Personal Access Token (PAT)

El Marketplace usa Azure DevOps para la autenticación.

1.  Inicia sesión en [Azure DevOps](https://dev.azure.com/).
2.  Si no tienes una organización, crea una (ej: `tu-nombre-de-usuario`).
3.  En la esquina superior derecha, haz click en **User settings** (el icono de la persona con un engranaje) y selecciona **Personal access tokens**.
4.  Haz click en **New Token**.
5.  **Configuración del Token**:
    *   **Name**: `VSCode Marketplace`
    *   **Organization**: selecciona **All accessible organizations**.
    *   **Scopes**: selecciona **Custom defined**.
    *   Haz click en **Show all scopes** al final de la lista.
    *   Busca **Marketplace** y marca **Acquire** y **Manage**.
6.  Haz click en **Create**.
7.  ⚠️ **IMPORTANTE**: Copia y guarda el token ahora. No volverá a mostrarse.

---

## 👤 Etapa 2: Crear un Publisher

Un "Publisher" es el perfil que aparecerá como autor en VS Code.

1.  Ve al [Management Portal de VS Code Marketplace](https://marketplace.visualstudio.com/manage).
2.  Si no tienes un publisher, crea uno:
    *   **Name**: Un identificador único (ej: `vortexbird`).
    *   **Display Name**: El nombre que verán los usuarios (ej: `Vortexbird`).
3.  Anota el **Name** exacto de tu publisher.

---

## 💻 Etapa 3: Publicar desde la Consola

Asegúrate de estar en la carpeta raíz del proyecto.

### 1. Instalar vsce
`vsce` es la herramienta de línea de comandos para manejar extensiones.
```powershell
npm install -g @vscode/vsce
```

### 2. Actualizar el publisher en `package.json`
Abre el archivo `package.json` y asegúrate de que el campo `"publisher"` coincida exactamente con el nombre (ID) de tu publisher en el portal.
```json
{
  "name": "spring-http-generator",
  "publisher": "TU-ID-DE-PUBLISHER",
  ...
}
```

### 3. Iniciar sesión en la consola
```powershell
vsce login TU-ID-DE-PUBLISHER
```
Te pedirá el **Personal Access Token (PAT)** que creaste en la Etapa 1. Pégalo allí.

### 4. Publicar directamente
Este comando compilará el código y lo subirá automáticamente al Marketplace:
```powershell
vsce publish
```

---

## 🔄 Actualizar la Extensión en el Futuro

Cuando quieras subir una nueva versión (por ejemplo la versión `0.1.1`), solo debes:

1.  Cambiar la versión en el `package.json`.
2.  Ejecutar el comando de publicación:
    ```powershell
    vsce publish patch
    ```
    *   `patch`: para correcciones (`0.1.0` -> `0.1.1`)
    *   `minor`: para nuevas funcionalidades (`0.1.0` -> `0.2.0`)
    *   `major`: para cambios grandes (`0.1.0` -> `1.0.0`)

---

## ✅ Verificación

Una vez publicado, puede tardar entre **5 y 10 minutos** en aparecer en la búsqueda de VS Code. Podrás ver el estado en tu [Management Portal](https://marketplace.visualstudio.com/manage).

**¡Felicidades! Tu extensión ahora es pública y accesible para todo el mundo.**
