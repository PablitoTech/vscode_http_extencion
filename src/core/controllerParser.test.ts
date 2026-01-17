import { ControllerParser } from '../../core/controllerParser';

describe('ControllerParser', () => {
    describe('parseController', () => {
        test('should extract class name', () => {
            const content = `
        @RestController
        public class UserController {
        }
      `;

            const result = ControllerParser.parseController(content, 'UserController.java');

            expect(result?.className).toBe('UserController');
        });

        test('should extract base path from @RequestMapping', () => {
            const content = `
        @RestController
        @RequestMapping("/api/users")
        public class UserController {
        }
      `;

            const result = ControllerParser.parseController(content, 'UserController.java');

            expect(result?.basePath).toBe('/api/users');
        });

        test('should detect class-level security annotations', () => {
            const content = `
        @SecurityRequirement(name = "token")
        @RestController
        @RequestMapping("/api/users")
        public class UserController {
        }
      `;

            const result = ControllerParser.parseController(content, 'UserController.java');

            expect(result?.requiresAuth).toBe(true);
        });

        test('should extract GET mapping', () => {
            const content = `
        @RestController
        @RequestMapping("/api/users")
        public class UserController {
          @GetMapping("/{id}")
          public ResponseEntity<User> getUser(@PathVariable Long id) {
            return null;
          }
        }
      `;

            const result = ControllerParser.parseController(content, 'UserController.java');

            expect(result?.methods).toHaveLength(1);
            expect(result?.methods[0].httpMethod).toBe('GET');
            expect(result?.methods[0].path).toBe('/{id}');
            expect(result?.methods[0].name).toBe('getUser');
        });

        test('should extract POST mapping with RequestBody', () => {
            const content = `
        @RestController
        @RequestMapping("/api/users")
        public class UserController {
          @PostMapping
          public ResponseEntity<User> createUser(@RequestBody UserDTO dto) {
            return null;
          }
        }
      `;

            const result = ControllerParser.parseController(content, 'UserController.java');

            expect(result?.methods).toHaveLength(1);
            expect(result?.methods[0].httpMethod).toBe('POST');
            expect(result?.methods[0].parameters).toHaveLength(1);
            expect(result?.methods[0].parameters[0].annotation).toBe('RequestBody');
            expect(result?.methods[0].parameters[0].type).toBe('UserDTO');
        });

        test('should extract multiple HTTP methods', () => {
            const content = `
        @RestController
        @RequestMapping("/api/users")
        public class UserController {
          @GetMapping
          public ResponseEntity<List<User>> getAll() {
            return null;
          }
          
          @PostMapping
          public ResponseEntity<User> create(@RequestBody UserDTO dto) {
            return null;
          }
          
          @PutMapping("/{id}")
          public ResponseEntity<User> update(@PathVariable Long id, @RequestBody UserDTO dto) {
            return null;
          }
          
          @DeleteMapping("/{id}")
          public ResponseEntity<Void> delete(@PathVariable Long id) {
            return null;
          }
        }
      `;

            const result = ControllerParser.parseController(content, 'UserController.java');

            expect(result?.methods).toHaveLength(4);
            expect(result?.methods[0].httpMethod).toBe('GET');
            expect(result?.methods[1].httpMethod).toBe('POST');
            expect(result?.methods[2].httpMethod).toBe('PUT');
            expect(result?.methods[3].httpMethod).toBe('DELETE');
        });

        test('should extract RequestParam parameters', () => {
            const content = `
        @RestController
        public class SearchController {
          @GetMapping("/search")
          public ResponseEntity<List<Result>> search(
            @RequestParam String query,
            @RequestParam(required = false) Integer page
          ) {
            return null;
          }
        }
      `;

            const result = ControllerParser.parseController(content, 'SearchController.java');

            expect(result?.methods[0].parameters).toHaveLength(2);
            expect(result?.methods[0].parameters[0].annotation).toBe('RequestParam');
            expect(result?.methods[0].parameters[0].name).toBe('query');
            expect(result?.methods[0].parameters[0].required).toBe(true);
            expect(result?.methods[0].parameters[1].required).toBe(false);
        });

        test('should detect method-level security annotations', () => {
            const content = `
        @RestController
        public class AdminController {
          @PreAuthorize("hasRole('ADMIN')")
          @GetMapping("/admin")
          public ResponseEntity<String> adminOnly() {
            return null;
          }
        }
      `;

            const result = ControllerParser.parseController(content, 'AdminController.java');

            expect(result?.methods[0].requiresAuth).toBe(true);
        });
    });
});
