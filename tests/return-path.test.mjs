import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import ts from 'typescript';

const source=readFileSync(new URL('../lib/return-path.ts',import.meta.url),'utf8');
const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const {safeReturnPath}=await import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'));

test('login rejects external, backslash, control and normalization destinations',()=>{
  for(const value of [null,'https://example.test','//example.test','/\\example.test','/\t/example.test','/\n/example.test','/.//example.test','/a/..//example.test','javascript:alert(1)','\\example.test']){
    assert.equal(safeReturnPath(value),'/dashboard',String(value));
  }
});
test('normal local paths preserve query/hash and encoded content',()=>{
  for(const value of ['/dashboard','/orders?status=new#today','/customers/123','/%2f%2fexample.test']){
    assert.equal(safeReturnPath(value),value);
    assert.equal(new URL(safeReturnPath(value),'https://app.local').origin,'https://app.local');
  }
  assert.equal(safeReturnPath('/orders/../dashboard'),'/dashboard');
  assert.equal(safeReturnPath('//example.test','/'),'/');
});
