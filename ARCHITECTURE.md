# 🏗️ Arquitectura de Spring HTTP Generator

Este documento detalla la estructura técnica, las decisiones de diseño y las tecnologías que impulsan la extensión **Spring HTTP Generator**.

---

## 🛠️ Stack Tecnológico

La extensión está construida siguiendo los estándares modernos de desarrollo para el ecosistema de Visual Studio Code:

- **Lenguaje Principal**: [TypeScript](https://www.typescriptlang.org/) (v5.3+). Elegido por su tipado fuerte que garantiza la robustez del sistema de parsado.
- **Entorno**: [Node.js](https://nodejs.org/) integrado en el Extension Host de VS Code.
- **APIs de VS Code**: Utiliza la API de `vscode` para la gestión de workspace, sistemas de archivos (`FileSystem`), comandos y menús contextuales.
- **Motor de Parsado**: Basado en **Expresiones Regulares (Regex)** avanzadas.
  - *Decisión de diseño*: Se optó por Regex sobre parsers AST (como java-parser) para maximizar la compatibilidad con diferentes versiones de Java (8-21+) y librerías de pre-procesamiento como **Lombok** sin añadir dependencias pesadas.

---

## 🧩 Componentes del Sistema

### 1. Extension Layer (`extension.ts`)
Es el punto de entrada. Se encarga de:
- Registrar los comandos.
- Gestionar la interfaz de usuario (notificaciones de progreso, diálogos de selección).
- Orquestar el flujo entre el parser y el generador.

### 2. Core Parsing Logic (`src/core/`)
- **ControllerParser**: Analiza archivos `.java` buscando anotaciones Spring (`@RestController`, `@RequestMapping`, mapeos de métodos). Limpia comentarios y normaliza rutas.
- **DtoParser**: Cuando se detecta un `@RequestBody`, este componente busca la clase Java correspondiente y extrae sus campos para generar un esquema JSON de ejemplo.
- **MappingResolver**: Resuelve las rutas finales combinando el path de la clase con el del método, manejando variables de ruta (`{id}`).

### 3. Build & Templates (`src/core/httpBuilder.ts`)
Transforma la información recolectada en el formato estándar RFC 2616 (`.http`). Gestiona:
- Inserción de cabeceras de seguridad.
- Formateo de cuerpos JSON.
- Separadores de solicitud (`###`).

---

## 🌐 Lenguajes y Frameworks Soportados

| Categoría | Soportado Actualmente | Versión / Detalle |
| :--- | :--- | :--- |
| **Lenguaje Fuente** | **Java** | 8, 11, 17, 21+ (Incluyendo soporte para Lombok) |
| **Framework Web** | **Spring Boot** | Spring Web (MVC / WebFlux básico) |
| **Formato Salida** | **REST Client (.http)** | Compatible con VS Code REST Client y JetBrains HTTP Client |
| **Seguridad** | **Spring Security** | `@PreAuthorize`, `@Secured`, `@SecurityRequirement` |

---

**Documentación técnica mantenida por PablitoTech**
