# 🚀 Guía de Ejecución y Diagnóstico

Esta versión incluye herramientas para saber exactamente por qué la extensión podría no estar funcionando en tu PC.

## 🛠️ Cómo Ver Por Qué Falla (MODO DIAGNÓSTICO)

Si la extensión "no hace nada", usa el comando de diagnóstico:
1. Presiona **Ctrl+Shift+P**.
2. Escribe: **"Run Extension Diagnostics"**.
3. Se abrirá una pestaña con un reporte detallado. **¡Por favor pásame lo que diga ese reporte!**

---

## Opción 2: Script de Python (Standalone) 🐍
Si la extensión sigue fallando, usa este script que es más directo:

1. Abre una terminal.
2. Ejecuta:
```bash
py "d:\vscode_http_extencion\scripts\spring_generator.py" "RUTA_DE_TU_PROYECTO_JAVA" --out "./http-requests"
```

---

## Opción 3: Instalación Permanente 📦
Si ya confirmaste que funciona:

```powershell
# 1. Empaquetar
.\scripts\package.ps1

# 2. Instalar
code --install-extension spring-http-generator-0.1.0.vsix --force
```

---

## 🔧 Dónde revisar si algo falla

1. **Pestaña Output:**
   - Ve a la pestaña **Output** (Salida).
   - Cambia a **Spring HTTP Generator**.

2. **Developer Tools:**
   - Menú **Help** -> **Toggle Developer Tools**.
   - Pestaña **Console**.

---
© 2025 Antigravity - Herramientas de Desarrollo
