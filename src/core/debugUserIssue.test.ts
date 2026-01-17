import { ControllerParser } from './controllerParser';

describe('Debug User Issue', () => {
    test('should parse AuthRestController correctly', () => {
        const content = `
@RestController
@RequestMapping("/api/v1/auth")
@Slf4j
public class AuthRestController {
	@Autowired
	CcUsuarioService usuarioService;
	
	@PostMapping(value="/login")
	public ResponseEntity<?> login(@RequestBody UsuarioDTO usuarioDTO) throws Exception{
		log.debug("Request to findByUser: {}", usuarioDTO);

		return ResponseEntity.ok().body(usuarioService.login(usuarioDTO));
	}
}
    `;

        const result = ControllerParser.parseController(content, 'AuthRestController.java');

        expect(result).not.toBeNull();
        expect(result?.className).toBe('AuthRestController');
        expect(result?.basePath).toBe('/api/v1/auth');
        expect(result?.methods).toHaveLength(1);
        expect(result?.methods[0].name).toBe('login');
        expect(result?.methods[0].httpMethod).toBe('POST');
        expect(result?.methods[0].path).toBe('/login');
        expect(result?.methods[0].parameters).toHaveLength(1);
        expect(result?.methods[0].parameters[0].type).toBe('UsuarioDTO');
    });
});
