import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import type { CodeFile, MiniappSpec, Project } from './types';

/**
 * Manages project lifecycle on disk:
 * - Create project directory
 * - Write code files from LLM output
 * - Generate scaffold files (app.json, package.json, babel.config.js, tsconfig.json)
 */

export function createProject(
  projectsDir: string,
  spec: MiniappSpec,
  codeFiles: CodeFile[],
  cloudToken: string,
): Project {
  const id = uuidv4();
  const projectDir = path.join(projectsDir, id);
  fs.mkdirSync(projectDir, { recursive: true });

  const now = Date.now();

  const project: Project = {
    id,
    spec,
    codeFiles,
    cloudToken,
    status: 'created',
    createdAt: now,
    updatedAt: now,
  };

  // Write code files
  writeCodeFiles(projectDir, codeFiles);

  // Generate scaffold files
  generateScaffold(projectDir, spec);

  return project;
}

function writeCodeFiles(projectDir: string, codeFiles: CodeFile[]): void {
  for (const file of codeFiles) {
    // Normalize path: strip leading slashes, ensure relative to src/
    let filePath = file.path.replace(/^\/+/, '');

    // If path doesn't start with src/ or .nebula/, place it under src/
    if (!filePath.startsWith('src/') && !filePath.startsWith('.nebula/')) {
      filePath = `src/${filePath}`;
    }

    const fullPath = path.join(projectDir, filePath);
    const dir = path.dirname(fullPath);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(fullPath, file.content, 'utf8');
  }
}

function generateScaffold(projectDir: string, spec: MiniappSpec): void {
  // app.json
  const appJson = {
    appId: spec.appId,
    updateStrategy: 'manual',
    pages: spec.pages.map(p => p.name),
    entryPagePath: `/${spec.pages[0]?.name || 'home'}`,
    window: {
      backgroundColor: '#f8fafc',
      navigationBarBackgroundColor: '#ffffff',
      navigationBarTextColor: '#0f172a',
      visualEffectInBackground: 'none',
    },
  };
  writeJson(projectDir, 'app.json', appJson);

  // package.json
  const packageJson = {
    name: spec.appId,
    version: '0.0.1',
    private: true,
    description: `${spec.name} Nebula miniapp`,
    scripts: {
      dev: 'nebula miniapp dev',
      build: 'nebula miniapp build',
      upload: 'nebula miniapp upload',
    },
    dependencies: {
      '@nebula-rn/client': '*',
      '@nebula-rn/sdk': '*',
      react: '19.2.0',
      'react-native': '0.83.1',
    },
    devDependencies: {
      '@react-native-community/cli': '20.0.0',
      '@react-native-community/cli-platform-android': '20.0.0',
      '@react-native-community/cli-platform-ios': '20.0.0',
      '@react-native/babel-preset': '0.83.1',
      '@react-native/metro-config': '0.83.1',
      '@react-native/typescript-config': '0.83.1',
      '@types/react': '^19.2.0',
      typescript: '^5.8.3',
    },
    engines: { node: '>=20' },
  };
  writeJson(projectDir, 'package.json', packageJson);

  // babel.config.js
  writeFile(
    projectDir,
    'babel.config.js',
    `module.exports = {\n  presets: ['module:@react-native/babel-preset'],\n};\n`,
  );

  // tsconfig.json
  const tsconfig = {
    extends: '@react-native/typescript-config',
    compilerOptions: {
      jsx: 'react-jsx',
      strict: true,
    },
    include: ['src/**/*.ts', 'src/**/*.tsx'],
  };
  writeJson(projectDir, 'tsconfig.json', tsconfig);

  // Ensure page.config.ts exists for each page
  for (const page of spec.pages) {
    const pageConfigDir = `src/pages/${page.name}`;
    const pageConfigPath = path.join(
      projectDir,
      pageConfigDir,
      'page.config.ts',
    );

    // Only generate if it doesn't already exist (LLM might have created it)
    if (!fs.existsSync(pageConfigPath)) {
      fs.mkdirSync(path.dirname(pageConfigPath), { recursive: true });
      fs.writeFileSync(
        pageConfigPath,
        `export default {\n  navigationBarTitleText: '${page.description || page.name}',\n};\n`,
        'utf8',
      );
    }
  }
}

function writeFile(dir: string, filename: string, content: string): void {
  fs.writeFileSync(path.join(dir, filename), content, 'utf8');
}

function writeJson(dir: string, filename: string, data: unknown): void {
  writeFile(dir, filename, JSON.stringify(data, null, 2) + '\n');
}

export function getProjectDir(projectsDir: string, projectId: string): string {
  return path.join(projectsDir, projectId);
}
