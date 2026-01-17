import * as fs from 'fs';
import * as path from 'path';
import { ControllerParser } from './src/core/controllerParser';
import { HttpBuilder } from './src/core/httpBuilder';
import { HttpGenerationConfig } from './src/core/types';

// Mock Logger to avoid VS Code dependency
(global as any).Logger = {
    info: console.log,
    debug: console.log,
    warn: console.warn,
    error: console.error,
    time: () => () => { }
};

async function verify() {
    const javaFile = path.resolve(__dirname, 'examples/BitacoraRestController.java');
    const content = fs.readFileSync(javaFile, 'utf8');

    console.log('--- Parsing Controller ---');
    const controllerInfo = ControllerParser.parseController(content, javaFile);

    if (!controllerInfo) {
        console.error('Failed to parse controller');
        return;
    }

    console.log(`Class: ${controllerInfo.className}`);
    console.log(`Base Path: ${controllerInfo.basePath}`);
    console.log(`Methods: ${controllerInfo.methods.length}`);

    const config: HttpGenerationConfig = {
        baseUrl: 'http://localhost:8080',
        includeAuthHeader: true,
        outputDirectory: 'http-requests'
    };

    console.log('\n--- Generating HTTP Content ---');
    // Note: HttpBuilder uses FileSystemUtils.readFile/findDtoFile which use vscode API.
    // We need to mock those or just test the logic.
    // Since we mocked Logger, but HttpBuilder depends on imports... 
    // This script might need to be run with ts-node and some mocks.
}

// Just checking if I can run a simplified version
const content = `
@RestController
@RequestMapping("/api/v1/test")
public class TestController {
    @GetMapping("/hello")
    public String hello() { return "hi"; }
}
`;

console.log('Direct Parse Test:');
const result = ControllerParser.parseController(content, 'test.java');
console.log(JSON.stringify(result, null, 2));
