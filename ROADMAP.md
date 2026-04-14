# 🗺️ Roadmap - Spring HTTP Generator

Este documento describe la visión a futuro de la extensión y las funcionalidades planeadas para maximizar su valor en el ecosistema de desarrollo Java/Spring Boot.

---

## 🟢 Fase 1: Inteligencia de Datos (Q2 2026)
*Objetivo: Que los datos generados sean lo más reales posible sin intervención manual.*

- [ ] **Generación de Datos con IA (Local)**:
    - Integración con modelos pequeños (como Faker.js o modelos locales) para detectar campos como `email`, `phone`, `address` por nombre y rellenarlos con datos lógicos.
- [ ] **Soporte Avanzado de Lombok**:
    - Análisis profundo de `@Builder` y constructores estáticos para DTOs inmutables complejos.
- [ ] **Detección de Enums**:
    - Leer los valores posibles de un `Enum` Java y rotar entre ellos o usar el primero como defecto, en lugar de poner `""`.

## 🟡 Fase 2: Automatización de Calidad (Q3 2026)
*Objetivo: Que el archivo .http no solo sirva para ejecutar, sino para validar.*

- [ ] **Generación de Assertions**:
    - Generar automáticamente bloques `client.test(...)` en el archivo `.http` para validar que la respuesta sea 200 OK.
    - Ejemplo:
      ```javascript
      client.test("Request executed successfully", function() {
          client.assert(response.status === 200, "Response status is not 200");
      });
      ```
- [ ] **Chained Requests (Flujos)**:
    - Detectar relaciones (ej: `create` devuelve un ID, `get` usa ese ID) y usar variables de entorno `{{variable}}` para encadenar llamadas automáticamente.

## 🔴 Fase 3: Integración Profunda (Q4 2026)
*Objetivo: Ser el compañero inseparable de VS Code para Spring.*

- [ ] **Importar desde cURL**:
    - Capacidad de pegar un cURL y que genere el DTO Java y el controlador (ingeniería inversa básica).
- [ ] **Soporte para WebFlux / Reactive**:
    - Manejo especial para endpoints que devuelven `Mono<>` o `Flux<>`, configurando cabeceras de `Stream` si es necesario.
- [ ] **Gestión de Entornos (.env)**:
    - UI gráfica dentro de la extensión para gestionar perfiles (Dev, QA, Prod) y generar el archivo `http-client.env.json` automáticamente.

---

## 💡 Ideas en Evaluación (Backlog)
- **Integración con Testcontainers**: Generar configuraciones de prueba para integración.
- **Exportación a Postman Collection**: Convertir todos los `.http` generados a un JSON importable en Postman.
