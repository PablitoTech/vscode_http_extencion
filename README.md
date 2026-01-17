# Spring HTTP Generator 🚀

**La herramienta definitiva para automatizar tus pruebas de API en Spring Boot.**

`Spring HTTP Generator` es una extensión de Visual Studio Code diseñada para desarrolladores Java que utilizan Spring Boot. Su objetivo principal es **eliminar la fricción** entre el desarrollo del backend y las pruebas de API, generando automáticamente archivos `.http` listos para ser ejecutados con el [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client).

---

## 🌟 ¿Qué queremos lograr con este proyecto?

El desarrollo moderno de APIs requiere herramientas de prueba que vivan junto al código. El objetivo de este proyecto es:

1.  **Productividad Extrema**: Reducir el tiempo de creación manual de solicitudes HTTP de minutos a milisegundos.
2.  **Sincronización Total**: Asegurar que las pruebas siempre reflejen la última firma de los controladores Java.
3.  **Documentación Viva**: Proporcionar ejemplos reales de uso de la API generados directamente desde el código fuente y sus DTOs.
4.  **Simplicidad**: Ofrecer una herramienta quirúrgica que haga una sola cosa y la haga excepcionalmente bien, sin necesidad de herramientas externas pesadas (como Postman o Insomnia) para pruebas rápidas.

---

## ✨ Características Principales

-   🔍 **Detección Inteligente**: Escanea el espacio de trabajo en busca de controladores con `@RestController` o `@Controller`.
-   🎯 **Mapeo Robusto**: Soporta `@GetMapping`, `@PostMapping`, `@PutMapping`, `@DeleteMapping`, `@PatchMapping` y `@RequestMapping`.
-   🔐 **Seguridad Integrada**: Detecta automáticamente anotaciones de seguridad (`@Secured`, `@PreAuthorize`, etc.) e incluye cabeceras de `Authorization`.
-   📝 **Análisis de DTOs**: Extrae campos de clases Java (DTOs) para generar cuerpos JSON realistas y válidos.
-   🚀 **Control Granular**: Genera archivos para un controlador completo, un método individual o todos los controladores a la vez.
-   🩺 **Modo Diagnóstico**: Incluye herramientas internas para verificar que el entorno de VS Code está configurado correctamente.

---

## ⚙️ Configuración

Personaliza el comportamiento de la extensión en los ajustes de VS Code:

| Ajuste | Descripción | Valor por Defecto |
| :--- | :--- | :--- |
| `spring-http-generator.baseUrl` | URL base para las solicitudes generadas. | `http://localhost:8080` |
| `spring-http-generator.outputDirectory` | Carpeta donde se guardarán los archivos `.http`. | `http-requests` |
| `spring-http-generator.includeAuthHeader` | Incluir automáticamente cabeceras de autorización. | `true` |

---

## 🛠️ Cómo Utilizarla

1.  **Click Derecho**: En cualquier archivo Java de tipo Controller, verás la opción **"Generate .http from Controller"**.
2.  **Paleta de Comandos**: Presiona `Ctrl+Shift+P` y busca **"Generate HTTP Request File"** para elegir entre todos los controladores del proyecto.
3.  **Selección de Método**: Selecciona el nombre de un método específico, haz click derecho y elige **"Generate HTTP Request from Method"**.

---

## 📦 Instalación

Para instalar la extensión manualmente desde el archivo `.vsix`:

1.  Descarga el archivo `spring-http-generator-0.1.0.vsix`.
2.  En VS Code, ve a la pestaña de Extensiones (`Ctrl+Shift+X`).
3.  Haz click en el icono de los tres puntos (`...`) y selecciona **"Install from VSIX..."**.
4.  Selecciona el archivo descargado y ¡listo!

---

## 📝 Requisitos

-   **Visual Studio Code 1.85.0** o superior.
-   Proyecto con **Spring Boot**.
-   (Recomendado) Extensión **REST Client** de Huachao Mao para ejecutar los archivos generados.

---

## 📄 Licencia

Este proyecto se distribuye bajo la **Licencia MIT**. Esto significa que puedes usarlo, distribuirlo, modificarlo e incluso venderlo con total libertad. El autor no se hace responsable de problemas derivados del uso por parte de terceros.

---

**Desarrollado con ❤️ para agilizar el flujo de trabajo de desarrolladores Spring Boot.**
