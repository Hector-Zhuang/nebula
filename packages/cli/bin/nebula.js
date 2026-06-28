#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const Module = require('module');
const ts = require('typescript');

const compileTypeScriptModule = (module, filename) => {
  const source = fs.readFileSync(filename, 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
      jsx: ts.JsxEmit.React,
    },
    fileName: filename,
  });
  module._compile(compiled.outputText, filename);
};

require.extensions['.ts'] = compileTypeScriptModule;
require.extensions['.tsx'] = compileTypeScriptModule;

const entryPath = path.join(__dirname, '../src/cli.ts');
const runtimeModule = new Module(entryPath, module.parent ?? module);
runtimeModule.filename = entryPath;
runtimeModule.paths = Module._nodeModulePaths(path.dirname(entryPath));
compileTypeScriptModule(runtimeModule, entryPath);
