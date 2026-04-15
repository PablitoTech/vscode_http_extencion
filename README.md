<p align="center">
  <img src="resources/architecture.png" width="600" alt="Spring HTTP Generator Architecture">
</p>

# 🚀 Spring HTTP Generator (0.0.3)

**¡Bienvenidos a la nueva era de las pruebas de APIs en Spring Boot!**

`Spring HTTP Generator` es una extensión diseñada quirúrgicamente por **PablitoTech** para desarrolladores que buscan velocidad y precisión. Transforma tus controladores de Java en archivos coleccionables de solicitudes HTTP en segundos.

---

## 🔥 ¿Por qué usar Spring HTTP Generator?

En el desarrollo moderno, cada segundo cuenta. Esta extensión nace para eliminar la tarea aburrida de escribir manualmente solicitudes en Postman o archivos .http. 

- **Detección Automática**: Encuentra tus controladores sin que muevas un dedo.
- **Análisis de DTOs Profundo**: Genera objetos JSON reales basados en tus clases Java.
- **Soporte Swagger/OpenAPI**: Lee automáticamente ejemplos de `@Schema(example = "...")` para poblar tus JSONs con datos útiles.
- **Seguridad Nativa**: ¿Usas `@PreAuthorize` o `@Secured`? Nosotros también. Las cabeceras de autorización se añaden solas.
- **Versión 0.0.3**: Optimizada con nuevo motor de análisis de metadatos.

---

## 📖 Ejemplo de Uso

### 🕹️ Tu Controlador Java
Imagina que tienes este controlador para gestionar productos:

```java
@RestController
@RequestMapping("/api/v1/inventory")
public class ProductRestController {

    @PostMapping("/create")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductDTO> createProduct(@RequestBody ProductDTO product) {
        return ResponseEntity.ok(product);
    }

    @GetMapping("/find/{sku}")
    public ResponseEntity<ProductDTO> findBySku(@PathVariable String sku) {
        return ResponseEntity.ok(new ProductDTO());
    }
}
```

### 📦 Tu DTO
```java
public class ProductDTO {
    private String sku;
    private String name;
    private Double price;
    private Integer stock;
}
```

### ✨ Resultado Generado (.http)
```http
### ProductRestController
# Generated from: src/main/java/com/example/inventory/ProductRestController.java

# createProduct
POST http://localhost:8080/api/v1/inventory/create
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "sku": "",
  "name": "",
  "price": 0.0,
  "stock": 0
}

###

# findBySku
GET http://localhost:8080/api/v1/inventory/find/{{sku}}
```

---

**Made with ❤️ for PablitoTech**
