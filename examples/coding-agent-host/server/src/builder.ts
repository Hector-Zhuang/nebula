import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import archiver from 'archiver';
import type { BuildArtifacts } from './types';

const execAsync = promisify(exec);

/**
 * Build a miniapp project:
 * 1. npm install
 * 2. npx nebula miniapp build (generates iOS + Android bundles)
 * 3. zip assets directories
 */
export async function buildProject(
  projectDir: string,
): Promise<BuildArtifacts> {
  console.log(`[builder] Installing dependencies in ${projectDir}...`);

  // Step 1: npm install
  await runCommand('npm install --legacy-peer-deps', projectDir);

  console.log(`[builder] Building miniapp bundles...`);

  // Step 2: nebula miniapp build
  // The CLI's `nebula miniapp build` runs react-native bundle for both platforms
  // It reads app.json and generates bundles in build/
  await runCommand('npx nebula miniapp build', projectDir);

  // Step 3: Locate build artifacts
  const buildDir = path.join(projectDir, 'build');

  const iosBundlePath = path.join(buildDir, 'main.ios.jsbundle');
  const androidBundlePath = path.join(buildDir, 'main.android.bundle');
  const manifestPath = path.join(buildDir, 'app.json');
  const iosAssetsDir = path.join(buildDir, 'ios-assets');
  const androidAssetsDir = path.join(buildDir, 'android-assets');

  // Validate artifacts exist
  for (const [label, filePath] of [
    ['iOS bundle', iosBundlePath],
    ['Android bundle', androidBundlePath],
    ['Manifest', manifestPath],
  ] as const) {
    if (!fs.existsSync(filePath)) {
      throw new Error(
        `${label} not found at ${filePath}. Build may have failed.`,
      );
    }
  }

  // Step 4: Zip assets directories
  const iosAssetsZipPath = path.join(buildDir, 'assets-ios.zip');
  const androidAssetsZipPath = path.join(buildDir, 'assets-android.zip');

  if (fs.existsSync(iosAssetsDir)) {
    await zipDirectory(iosAssetsDir, iosAssetsZipPath);
  } else {
    // Create empty zip if no assets dir
    await createEmptyZip(iosAssetsZipPath);
  }

  if (fs.existsSync(androidAssetsDir)) {
    await zipDirectory(androidAssetsDir, androidAssetsZipPath);
  } else {
    await createEmptyZip(androidAssetsZipPath);
  }

  console.log(`[builder] Build complete for ${projectDir}`);

  return {
    iosBundlePath,
    androidBundlePath,
    manifestPath,
    iosAssetsZipPath,
    androidAssetsZipPath,
    projectDir,
  };
}

async function runCommand(
  command: string,
  cwd: string,
): Promise<{ stdout: string; stderr: string }> {
  try {
    const result = await execAsync(command, {
      cwd,
      maxBuffer: 50 * 1024 * 1024, // 50MB buffer
      timeout: 600_000, // 10 minutes timeout
      env: {
        ...process.env,
        NODE_ENV: 'production',
      },
    });
    return result;
  } catch (error: any) {
    const message = error.stderr || error.stdout || error.message;
    throw new Error(`Command failed: ${command}\n${message}`);
  }
}

function zipDirectory(sourceDir: string, outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => resolve());
    archive.on('error', (err: Error) => reject(err));

    archive.pipe(output);
    archive.directory(sourceDir, false);
    archive.finalize();
  });
}

function createEmptyZip(outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => resolve());
    archive.on('error', (err: Error) => reject(err));

    archive.pipe(output);
    archive.finalize();
  });
}
