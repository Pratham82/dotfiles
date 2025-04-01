"use strict";var ct=Object.create;var pe=Object.defineProperty;var mt=Object.getOwnPropertyDescriptor;var ft=Object.getOwnPropertyNames;var pt=Object.getPrototypeOf,ht=Object.prototype.hasOwnProperty;var gt=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports),yt=(e,t)=>{for(var r in t)pe(e,r,{get:t[r],enumerable:!0})},wt=(e,t,r,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let s of ft(t))!ht.call(e,s)&&s!==r&&pe(e,s,{get:()=>t[s],enumerable:!(n=mt(t,s))||n.enumerable});return e};var Tt=(e,t,r)=>(r=e!=null?ct(pt(e)):{},wt(t||!e||!e.__esModule?pe(r,"default",{value:e,enumerable:!0}):r,e));var ce=gt((exports,module)=>{var Module=typeof Module<"u"?Module:{},ENVIRONMENT_IS_WEB=typeof window=="object",ENVIRONMENT_IS_WORKER=typeof importScripts=="function",ENVIRONMENT_IS_NODE=typeof process=="object"&&typeof process.versions=="object"&&typeof process.versions.node=="string",TreeSitter=function(){var initPromise,document=typeof window=="object"?{currentScript:window.document.currentScript}:null;class Parser{constructor(){this.initialize()}initialize(){throw new Error("cannot construct a Parser before calling `init()`")}static init(moduleOptions){return initPromise||(Module=Object.assign({},Module,moduleOptions),initPromise=new Promise(resolveInitPromise=>{var moduleOverrides=Object.assign({},Module),arguments_=[],thisProgram="./this.program",quit_=(e,t)=>{throw t},scriptDirectory="";function locateFile(e){return Module.locateFile?Module.locateFile(e,scriptDirectory):scriptDirectory+e}var readAsync,readBinary;if(ENVIRONMENT_IS_NODE){var fs=require("fs"),nodePath=require("path");scriptDirectory=__dirname+"/",readBinary=e=>{e=isFileURI(e)?new URL(e):nodePath.normalize(e);var t=fs.readFileSync(e);return t},readAsync=(e,t=!0)=>(e=isFileURI(e)?new URL(e):nodePath.normalize(e),new Promise((r,n)=>{fs.readFile(e,t?void 0:"utf8",(s,o)=>{s?n(s):r(t?o.buffer:o)})})),!Module.thisProgram&&process.argv.length>1&&(thisProgram=process.argv[1].replace(/\\/g,"/")),arguments_=process.argv.slice(2),typeof module<"u"&&(module.exports=Module),quit_=(e,t)=>{throw process.exitCode=e,t}}else(ENVIRONMENT_IS_WEB||ENVIRONMENT_IS_WORKER)&&(ENVIRONMENT_IS_WORKER?scriptDirectory=self.location.href:typeof document<"u"&&document.currentScript&&(scriptDirectory=document.currentScript.src),scriptDirectory.startsWith("blob:")?scriptDirectory="":scriptDirectory=scriptDirectory.substr(0,scriptDirectory.replace(/[?#].*/,"").lastIndexOf("/")+1),ENVIRONMENT_IS_WORKER&&(readBinary=e=>{var t=new XMLHttpRequest;return t.open("GET",e,!1),t.responseType="arraybuffer",t.send(null),new Uint8Array(t.response)}),readAsync=e=>isFileURI(e)?new Promise((t,r)=>{var n=new XMLHttpRequest;n.open("GET",e,!0),n.responseType="arraybuffer",n.onload=()=>{(n.status==200||n.status==0&&n.response)&&r(n.response),t(n.status)},n.onerror=t,n.send(null)}):fetch(e,{credentials:"same-origin"}).then(t=>t.ok?t.arrayBuffer():Promise.reject(new Error(t.status+" : "+t.url))));var out=Module.print||console.log.bind(console),err=Module.printErr||console.error.bind(console);Object.assign(Module,moduleOverrides),moduleOverrides=null,Module.arguments&&(arguments_=Module.arguments),Module.thisProgram&&(thisProgram=Module.thisProgram),Module.quit&&(quit_=Module.quit);var dynamicLibraries=Module.dynamicLibraries||[],wasmBinary;Module.wasmBinary&&(wasmBinary=Module.wasmBinary);var wasmMemory,ABORT=!1,EXITSTATUS,HEAP8,HEAPU8,HEAP16,HEAPU16,HEAP32,HEAPU32,HEAPF32,HEAPF64,HEAP_DATA_VIEW;function updateMemoryViews(){var e=wasmMemory.buffer;Module.HEAP_DATA_VIEW=HEAP_DATA_VIEW=new DataView(e),Module.HEAP8=HEAP8=new Int8Array(e),Module.HEAP16=HEAP16=new Int16Array(e),Module.HEAPU8=HEAPU8=new Uint8Array(e),Module.HEAPU16=HEAPU16=new Uint16Array(e),Module.HEAP32=HEAP32=new Int32Array(e),Module.HEAPU32=HEAPU32=new Uint32Array(e),Module.HEAPF32=HEAPF32=new Float32Array(e),Module.HEAPF64=HEAPF64=new Float64Array(e)}if(Module.wasmMemory)wasmMemory=Module.wasmMemory;else{var INITIAL_MEMORY=Module.INITIAL_MEMORY||33554432;wasmMemory=new WebAssembly.Memory({initial:INITIAL_MEMORY/65536,maximum:2147483648/65536})}updateMemoryViews();var __ATPRERUN__=[],__ATINIT__=[],__ATMAIN__=[],__ATPOSTRUN__=[],__RELOC_FUNCS__=[],runtimeInitialized=!1;function preRun(){if(Module.preRun)for(typeof Module.preRun=="function"&&(Module.preRun=[Module.preRun]);Module.preRun.length;)addOnPreRun(Module.preRun.shift());callRuntimeCallbacks(__ATPRERUN__)}function initRuntime(){runtimeInitialized=!0,callRuntimeCallbacks(__RELOC_FUNCS__),callRuntimeCallbacks(__ATINIT__)}function preMain(){callRuntimeCallbacks(__ATMAIN__)}function postRun(){if(Module.postRun)for(typeof Module.postRun=="function"&&(Module.postRun=[Module.postRun]);Module.postRun.length;)addOnPostRun(Module.postRun.shift());callRuntimeCallbacks(__ATPOSTRUN__)}function addOnPreRun(e){__ATPRERUN__.unshift(e)}function addOnInit(e){__ATINIT__.unshift(e)}function addOnPostRun(e){__ATPOSTRUN__.unshift(e)}var runDependencies=0,runDependencyWatcher=null,dependenciesFulfilled=null;function getUniqueRunDependency(e){return e}function addRunDependency(e){runDependencies++,Module.monitorRunDependencies?.(runDependencies)}function removeRunDependency(e){if(runDependencies--,Module.monitorRunDependencies?.(runDependencies),runDependencies==0&&(runDependencyWatcher!==null&&(clearInterval(runDependencyWatcher),runDependencyWatcher=null),dependenciesFulfilled)){var t=dependenciesFulfilled;dependenciesFulfilled=null,t()}}function abort(e){Module.onAbort?.(e),e="Aborted("+e+")",err(e),ABORT=!0,EXITSTATUS=1,e+=". Build with -sASSERTIONS for more info.";var t=new WebAssembly.RuntimeError(e);throw t}var dataURIPrefix="data:application/octet-stream;base64,",isDataURI=e=>e.startsWith(dataURIPrefix),isFileURI=e=>e.startsWith("file://");function findWasmBinary(){var e="tree-sitter.wasm";return isDataURI(e)?e:locateFile(e)}var wasmBinaryFile;function getBinarySync(e){if(e==wasmBinaryFile&&wasmBinary)return new Uint8Array(wasmBinary);if(readBinary)return readBinary(e);throw"both async and sync fetching of the wasm failed"}function getBinaryPromise(e){return wasmBinary?Promise.resolve().then(()=>getBinarySync(e)):readAsync(e).then(t=>new Uint8Array(t),()=>getBinarySync(e))}function instantiateArrayBuffer(e,t,r){return getBinaryPromise(e).then(n=>WebAssembly.instantiate(n,t)).then(r,n=>{err(`failed to asynchronously prepare wasm: ${n}`),abort(n)})}function instantiateAsync(e,t,r,n){return!e&&typeof WebAssembly.instantiateStreaming=="function"&&!isDataURI(t)&&!isFileURI(t)&&!ENVIRONMENT_IS_NODE&&typeof fetch=="function"?fetch(t,{credentials:"same-origin"}).then(s=>{var o=WebAssembly.instantiateStreaming(s,r);return o.then(n,function(a){return err(`wasm streaming compile failed: ${a}`),err("falling back to ArrayBuffer instantiation"),instantiateArrayBuffer(t,r,n)})}):instantiateArrayBuffer(t,r,n)}function getWasmImports(){return{env:wasmImports,wasi_snapshot_preview1:wasmImports,"GOT.mem":new Proxy(wasmImports,GOTHandler),"GOT.func":new Proxy(wasmImports,GOTHandler)}}function createWasm(){var e=getWasmImports();function t(n,s){wasmExports=n.exports,wasmExports=relocateExports(wasmExports,1024);var o=getDylinkMetadata(s);return o.neededDynlibs&&(dynamicLibraries=o.neededDynlibs.concat(dynamicLibraries)),mergeLibSymbols(wasmExports,"main"),LDSO.init(),loadDylibs(),addOnInit(wasmExports.__wasm_call_ctors),__RELOC_FUNCS__.push(wasmExports.__wasm_apply_data_relocs),removeRunDependency("wasm-instantiate"),wasmExports}addRunDependency("wasm-instantiate");function r(n){t(n.instance,n.module)}if(Module.instantiateWasm)try{return Module.instantiateWasm(e,t)}catch(n){return err(`Module.instantiateWasm callback failed with error: ${n}`),!1}return wasmBinaryFile||(wasmBinaryFile=findWasmBinary()),instantiateAsync(wasmBinary,wasmBinaryFile,e,r),{}}var ASM_CONSTS={};function ExitStatus(e){this.name="ExitStatus",this.message=`Program terminated with exit(${e})`,this.status=e}var GOT={},currentModuleWeakSymbols=new Set([]),GOTHandler={get(e,t){var r=GOT[t];return r||(r=GOT[t]=new WebAssembly.Global({value:"i32",mutable:!0})),currentModuleWeakSymbols.has(t)||(r.required=!0),r}},LE_HEAP_LOAD_F32=e=>HEAP_DATA_VIEW.getFloat32(e,!0),LE_HEAP_LOAD_F64=e=>HEAP_DATA_VIEW.getFloat64(e,!0),LE_HEAP_LOAD_I16=e=>HEAP_DATA_VIEW.getInt16(e,!0),LE_HEAP_LOAD_I32=e=>HEAP_DATA_VIEW.getInt32(e,!0),LE_HEAP_LOAD_U32=e=>HEAP_DATA_VIEW.getUint32(e,!0),LE_HEAP_STORE_F32=(e,t)=>HEAP_DATA_VIEW.setFloat32(e,t,!0),LE_HEAP_STORE_F64=(e,t)=>HEAP_DATA_VIEW.setFloat64(e,t,!0),LE_HEAP_STORE_I16=(e,t)=>HEAP_DATA_VIEW.setInt16(e,t,!0),LE_HEAP_STORE_I32=(e,t)=>HEAP_DATA_VIEW.setInt32(e,t,!0),LE_HEAP_STORE_U32=(e,t)=>HEAP_DATA_VIEW.setUint32(e,t,!0),callRuntimeCallbacks=e=>{for(;e.length>0;)e.shift()(Module)},UTF8Decoder=typeof TextDecoder<"u"?new TextDecoder:void 0,UTF8ArrayToString=(e,t,r)=>{for(var n=t+r,s=t;e[s]&&!(s>=n);)++s;if(s-t>16&&e.buffer&&UTF8Decoder)return UTF8Decoder.decode(e.subarray(t,s));for(var o="";t<s;){var a=e[t++];if(!(a&128)){o+=String.fromCharCode(a);continue}var _=e[t++]&63;if((a&224)==192){o+=String.fromCharCode((a&31)<<6|_);continue}var d=e[t++]&63;if((a&240)==224?a=(a&15)<<12|_<<6|d:a=(a&7)<<18|_<<12|d<<6|e[t++]&63,a<65536)o+=String.fromCharCode(a);else{var l=a-65536;o+=String.fromCharCode(55296|l>>10,56320|l&1023)}}return o},getDylinkMetadata=e=>{var t=0,r=0;function n(){return e[t++]}function s(){for(var W=0,b=1;;){var N=e[t++];if(W+=(N&127)*b,b*=128,!(N&128))break}return W}function o(){var W=s();return t+=W,UTF8ArrayToString(e,t-W,W)}function a(W,b){if(W)throw new Error(b)}var _="dylink.0";if(e instanceof WebAssembly.Module){var d=WebAssembly.Module.customSections(e,_);d.length===0&&(_="dylink",d=WebAssembly.Module.customSections(e,_)),a(d.length===0,"need dylink section"),e=new Uint8Array(d[0]),r=e.length}else{var l=new Uint32Array(new Uint8Array(e.subarray(0,24)).buffer),c=l[0]==1836278016||l[0]==6386541;a(!c,"need to see wasm magic number"),a(e[8]!==0,"need the dylink section to be first"),t=9;var m=s();r=t+m,_=o()}var p={neededDynlibs:[],tlsExports:new Set,weakImports:new Set};if(_=="dylink"){p.memorySize=s(),p.memoryAlign=s(),p.tableSize=s(),p.tableAlign=s();for(var g=s(),T=0;T<g;++T){var f=o();p.neededDynlibs.push(f)}}else{a(_!=="dylink.0");for(var M=1,v=2,u=3,E=4,x=256,F=3,_e=1;t<r;){var S=n(),O=s();if(S===M)p.memorySize=s(),p.memoryAlign=s(),p.tableSize=s(),p.tableAlign=s();else if(S===v)for(var g=s(),T=0;T<g;++T)f=o(),p.neededDynlibs.push(f);else if(S===u)for(var H=s();H--;){var B=o(),J=s();J&x&&p.tlsExports.add(B)}else if(S===E)for(var H=s();H--;){var de=o(),B=o(),J=s();(J&F)==_e&&p.weakImports.add(B)}else t+=O}}return p};function getValue(e,t="i8"){switch(t.endsWith("*")&&(t="*"),t){case"i1":return HEAP8[e];case"i8":return HEAP8[e];case"i16":return LE_HEAP_LOAD_I16((e>>1)*2);case"i32":return LE_HEAP_LOAD_I32((e>>2)*4);case"i64":abort("to do getValue(i64) use WASM_BIGINT");case"float":return LE_HEAP_LOAD_F32((e>>2)*4);case"double":return LE_HEAP_LOAD_F64((e>>3)*8);case"*":return LE_HEAP_LOAD_U32((e>>2)*4);default:abort(`invalid type for getValue: ${t}`)}}var newDSO=(e,t,r)=>{var n={refcount:1/0,name:e,exports:r,global:!0};return LDSO.loadedLibsByName[e]=n,t!=null&&(LDSO.loadedLibsByHandle[t]=n),n},LDSO={loadedLibsByName:{},loadedLibsByHandle:{},init(){newDSO("__main__",0,wasmImports)}},___heap_base=78112,zeroMemory=(e,t)=>(HEAPU8.fill(0,e,e+t),e),alignMemory=(e,t)=>Math.ceil(e/t)*t,getMemory=e=>{if(runtimeInitialized)return zeroMemory(_malloc(e),e);var t=___heap_base,r=t+alignMemory(e,16);return ___heap_base=r,GOT.__heap_base.value=r,t},isInternalSym=e=>["__cpp_exception","__c_longjmp","__wasm_apply_data_relocs","__dso_handle","__tls_size","__tls_align","__set_stack_limits","_emscripten_tls_init","__wasm_init_tls","__wasm_call_ctors","__start_em_asm","__stop_em_asm","__start_em_js","__stop_em_js"].includes(e)||e.startsWith("__em_js__"),uleb128Encode=(e,t)=>{e<128?t.push(e):t.push(e%128|128,e>>7)},sigToWasmTypes=e=>{for(var t={i:"i32",j:"i64",f:"f32",d:"f64",e:"externref",p:"i32"},r={parameters:[],results:e[0]=="v"?[]:[t[e[0]]]},n=1;n<e.length;++n)r.parameters.push(t[e[n]]);return r},generateFuncType=(e,t)=>{var r=e.slice(0,1),n=e.slice(1),s={i:127,p:127,j:126,f:125,d:124,e:111};t.push(96),uleb128Encode(n.length,t);for(var o=0;o<n.length;++o)t.push(s[n[o]]);r=="v"?t.push(0):t.push(1,s[r])},convertJsFunctionToWasm=(e,t)=>{if(typeof WebAssembly.Function=="function")return new WebAssembly.Function(sigToWasmTypes(t),e);var r=[1];generateFuncType(t,r);var n=[0,97,115,109,1,0,0,0,1];uleb128Encode(r.length,n),n.push(...r),n.push(2,7,1,1,101,1,102,0,0,7,5,1,1,102,0,0);var s=new WebAssembly.Module(new Uint8Array(n)),o=new WebAssembly.Instance(s,{e:{f:e}}),a=o.exports.f;return a},wasmTableMirror=[],wasmTable=new WebAssembly.Table({initial:28,element:"anyfunc"}),getWasmTableEntry=e=>{var t=wasmTableMirror[e];return t||(e>=wasmTableMirror.length&&(wasmTableMirror.length=e+1),wasmTableMirror[e]=t=wasmTable.get(e)),t},updateTableMap=(e,t)=>{if(functionsInTableMap)for(var r=e;r<e+t;r++){var n=getWasmTableEntry(r);n&&functionsInTableMap.set(n,r)}},functionsInTableMap,getFunctionAddress=e=>(functionsInTableMap||(functionsInTableMap=new WeakMap,updateTableMap(0,wasmTable.length)),functionsInTableMap.get(e)||0),freeTableIndexes=[],getEmptyTableSlot=()=>{if(freeTableIndexes.length)return freeTableIndexes.pop();try{wasmTable.grow(1)}catch(e){throw e instanceof RangeError?"Unable to grow wasm table. Set ALLOW_TABLE_GROWTH.":e}return wasmTable.length-1},setWasmTableEntry=(e,t)=>{wasmTable.set(e,t),wasmTableMirror[e]=wasmTable.get(e)},addFunction=(e,t)=>{var r=getFunctionAddress(e);if(r)return r;var n=getEmptyTableSlot();try{setWasmTableEntry(n,e)}catch(o){if(!(o instanceof TypeError))throw o;var s=convertJsFunctionToWasm(e,t);setWasmTableEntry(n,s)}return functionsInTableMap.set(e,n),n},updateGOT=(e,t)=>{for(var r in e)if(!isInternalSym(r)){var n=e[r];r.startsWith("orig$")&&(r=r.split("$")[1],t=!0),GOT[r]||=new WebAssembly.Global({value:"i32",mutable:!0}),(t||GOT[r].value==0)&&(typeof n=="function"?GOT[r].value=addFunction(n):typeof n=="number"?GOT[r].value=n:err(`unhandled export type for '${r}': ${typeof n}`))}},relocateExports=(e,t,r)=>{var n={};for(var s in e){var o=e[s];typeof o=="object"&&(o=o.value),typeof o=="number"&&(o+=t),n[s]=o}return updateGOT(n,r),n},isSymbolDefined=e=>{var t=wasmImports[e];return!(!t||t.stub)},dynCallLegacy=(e,t,r)=>{e=e.replace(/p/g,"i");var n=Module["dynCall_"+e];return n(t,...r)},dynCall=(e,t,r=[])=>{if(e.includes("j"))return dynCallLegacy(e,t,r);var n=getWasmTableEntry(t)(...r);return n},stackSave=()=>_emscripten_stack_get_current(),stackRestore=e=>__emscripten_stack_restore(e),createInvokeFunction=e=>(t,...r)=>{var n=stackSave();try{return dynCall(e,t,r)}catch(s){if(stackRestore(n),s!==s+0)throw s;_setThrew(1,0)}},resolveGlobalSymbol=(e,t=!1)=>{var r;return t&&"orig$"+e in wasmImports&&(e="orig$"+e),isSymbolDefined(e)?r=wasmImports[e]:e.startsWith("invoke_")&&(r=wasmImports[e]=createInvokeFunction(e.split("_")[1])),{sym:r,name:e}},UTF8ToString=(e,t)=>e?UTF8ArrayToString(HEAPU8,e,t):"",loadWebAssemblyModule=(binary,flags,libName,localScope,handle)=>{var metadata=getDylinkMetadata(binary);currentModuleWeakSymbols=metadata.weakImports;function loadModule(){var firstLoad=!handle||!HEAP8[handle+8];if(firstLoad){var memAlign=Math.pow(2,metadata.memoryAlign),memoryBase=metadata.memorySize?alignMemory(getMemory(metadata.memorySize+memAlign),memAlign):0,tableBase=metadata.tableSize?wasmTable.length:0;handle&&(HEAP8[handle+8]=1,LE_HEAP_STORE_U32((handle+12>>2)*4,memoryBase),LE_HEAP_STORE_I32((handle+16>>2)*4,metadata.memorySize),LE_HEAP_STORE_U32((handle+20>>2)*4,tableBase),LE_HEAP_STORE_I32((handle+24>>2)*4,metadata.tableSize))}else memoryBase=LE_HEAP_LOAD_U32((handle+12>>2)*4),tableBase=LE_HEAP_LOAD_U32((handle+20>>2)*4);var tableGrowthNeeded=tableBase+metadata.tableSize-wasmTable.length;tableGrowthNeeded>0&&wasmTable.grow(tableGrowthNeeded);var moduleExports;function resolveSymbol(e){var t=resolveGlobalSymbol(e).sym;return!t&&localScope&&(t=localScope[e]),t||(t=moduleExports[e]),t}var proxyHandler={get(e,t){switch(t){case"__memory_base":return memoryBase;case"__table_base":return tableBase}if(t in wasmImports&&!wasmImports[t].stub)return wasmImports[t];if(!(t in e)){var r;e[t]=(...n)=>(r||=resolveSymbol(t),r(...n))}return e[t]}},proxy=new Proxy({},proxyHandler),info={"GOT.mem":new Proxy({},GOTHandler),"GOT.func":new Proxy({},GOTHandler),env:proxy,wasi_snapshot_preview1:proxy};function postInstantiation(module,instance){updateTableMap(tableBase,metadata.tableSize),moduleExports=relocateExports(instance.exports,memoryBase),flags.allowUndefined||reportUndefinedSymbols();function addEmAsm(addr,body){for(var args=[],arity=0;arity<16&&body.indexOf("$"+arity)!=-1;arity++)args.push("$"+arity);args=args.join(",");var func=`(${args}) => { ${body} };`;ASM_CONSTS[start]=eval(func)}if("__start_em_asm"in moduleExports)for(var start=moduleExports.__start_em_asm,stop=moduleExports.__stop_em_asm;start<stop;){var jsString=UTF8ToString(start);addEmAsm(start,jsString),start=HEAPU8.indexOf(0,start)+1}function addEmJs(name,cSig,body){var jsArgs=[];if(cSig=cSig.slice(1,-1),cSig!="void"){cSig=cSig.split(",");for(var i in cSig){var jsArg=cSig[i].split(" ").pop();jsArgs.push(jsArg.replace("*",""))}}var func=`(${jsArgs}) => ${body};`;moduleExports[name]=eval(func)}for(var name in moduleExports)if(name.startsWith("__em_js__")){var start=moduleExports[name],jsString=UTF8ToString(start),parts=jsString.split("<::>");addEmJs(name.replace("__em_js__",""),parts[0],parts[1]),delete moduleExports[name]}var applyRelocs=moduleExports.__wasm_apply_data_relocs;applyRelocs&&(runtimeInitialized?applyRelocs():__RELOC_FUNCS__.push(applyRelocs));var init=moduleExports.__wasm_call_ctors;return init&&(runtimeInitialized?init():__ATINIT__.push(init)),moduleExports}if(flags.loadAsync){if(binary instanceof WebAssembly.Module){var instance=new WebAssembly.Instance(binary,info);return Promise.resolve(postInstantiation(binary,instance))}return WebAssembly.instantiate(binary,info).then(e=>postInstantiation(e.module,e.instance))}var module=binary instanceof WebAssembly.Module?binary:new WebAssembly.Module(binary),instance=new WebAssembly.Instance(module,info);return postInstantiation(module,instance)}return flags.loadAsync?metadata.neededDynlibs.reduce((e,t)=>e.then(()=>loadDynamicLibrary(t,flags,localScope)),Promise.resolve()).then(loadModule):(metadata.neededDynlibs.forEach(e=>loadDynamicLibrary(e,flags,localScope)),loadModule())},mergeLibSymbols=(e,t)=>{for(var[r,n]of Object.entries(e)){let s=a=>{isSymbolDefined(a)||(wasmImports[a]=n)};s(r);let o="__main_argc_argv";r=="main"&&s(o),r==o&&s("main"),r.startsWith("dynCall_")&&!Module.hasOwnProperty(r)&&(Module[r]=n)}},asyncLoad=(e,t,r,n)=>{var s=n?"":`al ${e}`;readAsync(e).then(o=>{t(new Uint8Array(o)),s&&removeRunDependency(s)},o=>{if(r)r();else throw`Loading data file "${e}" failed.`}),s&&addRunDependency(s)};function loadDynamicLibrary(e,t={global:!0,nodelete:!0},r,n){var s=LDSO.loadedLibsByName[e];if(s)return t.global?s.global||(s.global=!0,mergeLibSymbols(s.exports,e)):r&&Object.assign(r,s.exports),t.nodelete&&s.refcount!==1/0&&(s.refcount=1/0),s.refcount++,n&&(LDSO.loadedLibsByHandle[n]=s),t.loadAsync?Promise.resolve(!0):!0;s=newDSO(e,n,"loading"),s.refcount=t.nodelete?1/0:1,s.global=t.global;function o(){if(n){var d=LE_HEAP_LOAD_U32((n+28>>2)*4),l=LE_HEAP_LOAD_U32((n+32>>2)*4);if(d&&l){var c=HEAP8.slice(d,d+l);return t.loadAsync?Promise.resolve(c):c}}var m=locateFile(e);if(t.loadAsync)return new Promise(function(p,g){asyncLoad(m,p,g)});if(!readBinary)throw new Error(`${m}: file not found, and synchronous loading of external files is not available`);return readBinary(m)}function a(){return t.loadAsync?o().then(d=>loadWebAssemblyModule(d,t,e,r,n)):loadWebAssemblyModule(o(),t,e,r,n)}function _(d){s.global?mergeLibSymbols(d,e):r&&Object.assign(r,d),s.exports=d}return t.loadAsync?a().then(d=>(_(d),!0)):(_(a()),!0)}var reportUndefinedSymbols=()=>{for(var[e,t]of Object.entries(GOT))if(t.value==0){var r=resolveGlobalSymbol(e,!0).sym;if(!r&&!t.required)continue;if(typeof r=="function")t.value=addFunction(r,r.sig);else if(typeof r=="number")t.value=r;else throw new Error(`bad export type for '${e}': ${typeof r}`)}},loadDylibs=()=>{if(!dynamicLibraries.length){reportUndefinedSymbols();return}addRunDependency("loadDylibs"),dynamicLibraries.reduce((e,t)=>e.then(()=>loadDynamicLibrary(t,{loadAsync:!0,global:!0,nodelete:!0,allowUndefined:!0})),Promise.resolve()).then(()=>{reportUndefinedSymbols(),removeRunDependency("loadDylibs")})},noExitRuntime=Module.noExitRuntime||!0;function setValue(e,t,r="i8"){switch(r.endsWith("*")&&(r="*"),r){case"i1":HEAP8[e]=t;break;case"i8":HEAP8[e]=t;break;case"i16":LE_HEAP_STORE_I16((e>>1)*2,t);break;case"i32":LE_HEAP_STORE_I32((e>>2)*4,t);break;case"i64":abort("to do setValue(i64) use WASM_BIGINT");case"float":LE_HEAP_STORE_F32((e>>2)*4,t);break;case"double":LE_HEAP_STORE_F64((e>>3)*8,t);break;case"*":LE_HEAP_STORE_U32((e>>2)*4,t);break;default:abort(`invalid type for setValue: ${r}`)}}var ___memory_base=new WebAssembly.Global({value:"i32",mutable:!1},1024),___stack_pointer=new WebAssembly.Global({value:"i32",mutable:!0},78112),___table_base=new WebAssembly.Global({value:"i32",mutable:!1},1),__abort_js=()=>{abort("")};__abort_js.sig="v";var nowIsMonotonic=1,__emscripten_get_now_is_monotonic=()=>nowIsMonotonic;__emscripten_get_now_is_monotonic.sig="i";var __emscripten_memcpy_js=(e,t,r)=>HEAPU8.copyWithin(e,t,t+r);__emscripten_memcpy_js.sig="vppp";var _emscripten_date_now=()=>Date.now();_emscripten_date_now.sig="d";var _emscripten_get_now;_emscripten_get_now=()=>performance.now(),_emscripten_get_now.sig="d";var getHeapMax=()=>2147483648,growMemory=e=>{var t=wasmMemory.buffer,r=(e-t.byteLength+65535)/65536;try{return wasmMemory.grow(r),updateMemoryViews(),1}catch{}},_emscripten_resize_heap=e=>{var t=HEAPU8.length;e>>>=0;var r=getHeapMax();if(e>r)return!1;for(var n=(d,l)=>d+(l-d%l)%l,s=1;s<=4;s*=2){var o=t*(1+.2/s);o=Math.min(o,e+100663296);var a=Math.min(r,n(Math.max(e,o),65536)),_=growMemory(a);if(_)return!0}return!1};_emscripten_resize_heap.sig="ip";var _fd_close=e=>52;_fd_close.sig="ii";var convertI32PairToI53Checked=(e,t)=>t+2097152>>>0<4194305-!!e?(e>>>0)+t*4294967296:NaN;function _fd_seek(e,t,r,n,s){var o=convertI32PairToI53Checked(t,r);return 70}_fd_seek.sig="iiiiip";var printCharBuffers=[null,[],[]],printChar=(e,t)=>{var r=printCharBuffers[e];t===0||t===10?((e===1?out:err)(UTF8ArrayToString(r,0)),r.length=0):r.push(t)},_fd_write=(e,t,r,n)=>{for(var s=0,o=0;o<r;o++){var a=LE_HEAP_LOAD_U32((t>>2)*4),_=LE_HEAP_LOAD_U32((t+4>>2)*4);t+=8;for(var d=0;d<_;d++)printChar(e,HEAPU8[a+d]);s+=_}return LE_HEAP_STORE_U32((n>>2)*4,s),0};_fd_write.sig="iippp";function _tree_sitter_log_callback(e,t){if(currentLogCallback){let r=UTF8ToString(t);currentLogCallback(r,e!==0)}}function _tree_sitter_parse_callback(e,t,r,n,s){let a=currentParseCallback(t,{row:r,column:n});typeof a=="string"?(setValue(s,a.length,"i32"),stringToUTF16(a,e,10240)):setValue(s,0,"i32")}var runtimeKeepaliveCounter=0,keepRuntimeAlive=()=>noExitRuntime||runtimeKeepaliveCounter>0,_proc_exit=e=>{EXITSTATUS=e,keepRuntimeAlive()||(Module.onExit?.(e),ABORT=!0),quit_(e,new ExitStatus(e))};_proc_exit.sig="vi";var exitJS=(e,t)=>{EXITSTATUS=e,_proc_exit(e)},handleException=e=>{if(e instanceof ExitStatus||e=="unwind")return EXITSTATUS;quit_(1,e)},lengthBytesUTF8=e=>{for(var t=0,r=0;r<e.length;++r){var n=e.charCodeAt(r);n<=127?t++:n<=2047?t+=2:n>=55296&&n<=57343?(t+=4,++r):t+=3}return t},stringToUTF8Array=(e,t,r,n)=>{if(!(n>0))return 0;for(var s=r,o=r+n-1,a=0;a<e.length;++a){var _=e.charCodeAt(a);if(_>=55296&&_<=57343){var d=e.charCodeAt(++a);_=65536+((_&1023)<<10)|d&1023}if(_<=127){if(r>=o)break;t[r++]=_}else if(_<=2047){if(r+1>=o)break;t[r++]=192|_>>6,t[r++]=128|_&63}else if(_<=65535){if(r+2>=o)break;t[r++]=224|_>>12,t[r++]=128|_>>6&63,t[r++]=128|_&63}else{if(r+3>=o)break;t[r++]=240|_>>18,t[r++]=128|_>>12&63,t[r++]=128|_>>6&63,t[r++]=128|_&63}}return t[r]=0,r-s},stringToUTF8=(e,t,r)=>stringToUTF8Array(e,HEAPU8,t,r),stackAlloc=e=>__emscripten_stack_alloc(e),stringToUTF8OnStack=e=>{var t=lengthBytesUTF8(e)+1,r=stackAlloc(t);return stringToUTF8(e,r,t),r},stringToUTF16=(e,t,r)=>{if(r??=2147483647,r<2)return 0;r-=2;for(var n=t,s=r<e.length*2?r/2:e.length,o=0;o<s;++o){var a=e.charCodeAt(o);LE_HEAP_STORE_I16((t>>1)*2,a),t+=2}return LE_HEAP_STORE_I16((t>>1)*2,0),t-n},AsciiToString=e=>{for(var t="";;){var r=HEAPU8[e++];if(!r)return t;t+=String.fromCharCode(r)}},wasmImports={__heap_base:___heap_base,__indirect_function_table:wasmTable,__memory_base:___memory_base,__stack_pointer:___stack_pointer,__table_base:___table_base,_abort_js:__abort_js,_emscripten_get_now_is_monotonic:__emscripten_get_now_is_monotonic,_emscripten_memcpy_js:__emscripten_memcpy_js,emscripten_get_now:_emscripten_get_now,emscripten_resize_heap:_emscripten_resize_heap,fd_close:_fd_close,fd_seek:_fd_seek,fd_write:_fd_write,memory:wasmMemory,tree_sitter_log_callback:_tree_sitter_log_callback,tree_sitter_parse_callback:_tree_sitter_parse_callback},wasmExports=createWasm(),___wasm_call_ctors=()=>(___wasm_call_ctors=wasmExports.__wasm_call_ctors)(),___wasm_apply_data_relocs=()=>(___wasm_apply_data_relocs=wasmExports.__wasm_apply_data_relocs)(),_malloc=Module._malloc=e=>(_malloc=Module._malloc=wasmExports.malloc)(e),_calloc=Module._calloc=(e,t)=>(_calloc=Module._calloc=wasmExports.calloc)(e,t),_realloc=Module._realloc=(e,t)=>(_realloc=Module._realloc=wasmExports.realloc)(e,t),_free=Module._free=e=>(_free=Module._free=wasmExports.free)(e),_ts_language_symbol_count=Module._ts_language_symbol_count=e=>(_ts_language_symbol_count=Module._ts_language_symbol_count=wasmExports.ts_language_symbol_count)(e),_ts_language_state_count=Module._ts_language_state_count=e=>(_ts_language_state_count=Module._ts_language_state_count=wasmExports.ts_language_state_count)(e),_ts_language_version=Module._ts_language_version=e=>(_ts_language_version=Module._ts_language_version=wasmExports.ts_language_version)(e),_ts_language_field_count=Module._ts_language_field_count=e=>(_ts_language_field_count=Module._ts_language_field_count=wasmExports.ts_language_field_count)(e),_ts_language_next_state=Module._ts_language_next_state=(e,t,r)=>(_ts_language_next_state=Module._ts_language_next_state=wasmExports.ts_language_next_state)(e,t,r),_ts_language_symbol_name=Module._ts_language_symbol_name=(e,t)=>(_ts_language_symbol_name=Module._ts_language_symbol_name=wasmExports.ts_language_symbol_name)(e,t),_ts_language_symbol_for_name=Module._ts_language_symbol_for_name=(e,t,r,n)=>(_ts_language_symbol_for_name=Module._ts_language_symbol_for_name=wasmExports.ts_language_symbol_for_name)(e,t,r,n),_strncmp=Module._strncmp=(e,t,r)=>(_strncmp=Module._strncmp=wasmExports.strncmp)(e,t,r),_ts_language_symbol_type=Module._ts_language_symbol_type=(e,t)=>(_ts_language_symbol_type=Module._ts_language_symbol_type=wasmExports.ts_language_symbol_type)(e,t),_ts_language_field_name_for_id=Module._ts_language_field_name_for_id=(e,t)=>(_ts_language_field_name_for_id=Module._ts_language_field_name_for_id=wasmExports.ts_language_field_name_for_id)(e,t),_ts_lookahead_iterator_new=Module._ts_lookahead_iterator_new=(e,t)=>(_ts_lookahead_iterator_new=Module._ts_lookahead_iterator_new=wasmExports.ts_lookahead_iterator_new)(e,t),_ts_lookahead_iterator_delete=Module._ts_lookahead_iterator_delete=e=>(_ts_lookahead_iterator_delete=Module._ts_lookahead_iterator_delete=wasmExports.ts_lookahead_iterator_delete)(e),_ts_lookahead_iterator_reset_state=Module._ts_lookahead_iterator_reset_state=(e,t)=>(_ts_lookahead_iterator_reset_state=Module._ts_lookahead_iterator_reset_state=wasmExports.ts_lookahead_iterator_reset_state)(e,t),_ts_lookahead_iterator_reset=Module._ts_lookahead_iterator_reset=(e,t,r)=>(_ts_lookahead_iterator_reset=Module._ts_lookahead_iterator_reset=wasmExports.ts_lookahead_iterator_reset)(e,t,r),_ts_lookahead_iterator_next=Module._ts_lookahead_iterator_next=e=>(_ts_lookahead_iterator_next=Module._ts_lookahead_iterator_next=wasmExports.ts_lookahead_iterator_next)(e),_ts_lookahead_iterator_current_symbol=Module._ts_lookahead_iterator_current_symbol=e=>(_ts_lookahead_iterator_current_symbol=Module._ts_lookahead_iterator_current_symbol=wasmExports.ts_lookahead_iterator_current_symbol)(e),_memset=Module._memset=(e,t,r)=>(_memset=Module._memset=wasmExports.memset)(e,t,r),_memcpy=Module._memcpy=(e,t,r)=>(_memcpy=Module._memcpy=wasmExports.memcpy)(e,t,r),_ts_parser_delete=Module._ts_parser_delete=e=>(_ts_parser_delete=Module._ts_parser_delete=wasmExports.ts_parser_delete)(e),_ts_parser_reset=Module._ts_parser_reset=e=>(_ts_parser_reset=Module._ts_parser_reset=wasmExports.ts_parser_reset)(e),_ts_parser_set_language=Module._ts_parser_set_language=(e,t)=>(_ts_parser_set_language=Module._ts_parser_set_language=wasmExports.ts_parser_set_language)(e,t),_ts_parser_timeout_micros=Module._ts_parser_timeout_micros=e=>(_ts_parser_timeout_micros=Module._ts_parser_timeout_micros=wasmExports.ts_parser_timeout_micros)(e),_ts_parser_set_timeout_micros=Module._ts_parser_set_timeout_micros=(e,t,r)=>(_ts_parser_set_timeout_micros=Module._ts_parser_set_timeout_micros=wasmExports.ts_parser_set_timeout_micros)(e,t,r),_ts_parser_set_included_ranges=Module._ts_parser_set_included_ranges=(e,t,r)=>(_ts_parser_set_included_ranges=Module._ts_parser_set_included_ranges=wasmExports.ts_parser_set_included_ranges)(e,t,r),_memmove=Module._memmove=(e,t,r)=>(_memmove=Module._memmove=wasmExports.memmove)(e,t,r),_memcmp=Module._memcmp=(e,t,r)=>(_memcmp=Module._memcmp=wasmExports.memcmp)(e,t,r),_ts_query_new=Module._ts_query_new=(e,t,r,n,s)=>(_ts_query_new=Module._ts_query_new=wasmExports.ts_query_new)(e,t,r,n,s),_ts_query_delete=Module._ts_query_delete=e=>(_ts_query_delete=Module._ts_query_delete=wasmExports.ts_query_delete)(e),_iswspace=Module._iswspace=e=>(_iswspace=Module._iswspace=wasmExports.iswspace)(e),_iswalnum=Module._iswalnum=e=>(_iswalnum=Module._iswalnum=wasmExports.iswalnum)(e),_ts_query_pattern_count=Module._ts_query_pattern_count=e=>(_ts_query_pattern_count=Module._ts_query_pattern_count=wasmExports.ts_query_pattern_count)(e),_ts_query_capture_count=Module._ts_query_capture_count=e=>(_ts_query_capture_count=Module._ts_query_capture_count=wasmExports.ts_query_capture_count)(e),_ts_query_string_count=Module._ts_query_string_count=e=>(_ts_query_string_count=Module._ts_query_string_count=wasmExports.ts_query_string_count)(e),_ts_query_capture_name_for_id=Module._ts_query_capture_name_for_id=(e,t,r)=>(_ts_query_capture_name_for_id=Module._ts_query_capture_name_for_id=wasmExports.ts_query_capture_name_for_id)(e,t,r),_ts_query_string_value_for_id=Module._ts_query_string_value_for_id=(e,t,r)=>(_ts_query_string_value_for_id=Module._ts_query_string_value_for_id=wasmExports.ts_query_string_value_for_id)(e,t,r),_ts_query_predicates_for_pattern=Module._ts_query_predicates_for_pattern=(e,t,r)=>(_ts_query_predicates_for_pattern=Module._ts_query_predicates_for_pattern=wasmExports.ts_query_predicates_for_pattern)(e,t,r),_ts_query_disable_capture=Module._ts_query_disable_capture=(e,t,r)=>(_ts_query_disable_capture=Module._ts_query_disable_capture=wasmExports.ts_query_disable_capture)(e,t,r),_ts_tree_copy=Module._ts_tree_copy=e=>(_ts_tree_copy=Module._ts_tree_copy=wasmExports.ts_tree_copy)(e),_ts_tree_delete=Module._ts_tree_delete=e=>(_ts_tree_delete=Module._ts_tree_delete=wasmExports.ts_tree_delete)(e),_ts_init=Module._ts_init=()=>(_ts_init=Module._ts_init=wasmExports.ts_init)(),_ts_parser_new_wasm=Module._ts_parser_new_wasm=()=>(_ts_parser_new_wasm=Module._ts_parser_new_wasm=wasmExports.ts_parser_new_wasm)(),_ts_parser_enable_logger_wasm=Module._ts_parser_enable_logger_wasm=(e,t)=>(_ts_parser_enable_logger_wasm=Module._ts_parser_enable_logger_wasm=wasmExports.ts_parser_enable_logger_wasm)(e,t),_ts_parser_parse_wasm=Module._ts_parser_parse_wasm=(e,t,r,n,s)=>(_ts_parser_parse_wasm=Module._ts_parser_parse_wasm=wasmExports.ts_parser_parse_wasm)(e,t,r,n,s),_ts_parser_included_ranges_wasm=Module._ts_parser_included_ranges_wasm=e=>(_ts_parser_included_ranges_wasm=Module._ts_parser_included_ranges_wasm=wasmExports.ts_parser_included_ranges_wasm)(e),_ts_language_type_is_named_wasm=Module._ts_language_type_is_named_wasm=(e,t)=>(_ts_language_type_is_named_wasm=Module._ts_language_type_is_named_wasm=wasmExports.ts_language_type_is_named_wasm)(e,t),_ts_language_type_is_visible_wasm=Module._ts_language_type_is_visible_wasm=(e,t)=>(_ts_language_type_is_visible_wasm=Module._ts_language_type_is_visible_wasm=wasmExports.ts_language_type_is_visible_wasm)(e,t),_ts_tree_root_node_wasm=Module._ts_tree_root_node_wasm=e=>(_ts_tree_root_node_wasm=Module._ts_tree_root_node_wasm=wasmExports.ts_tree_root_node_wasm)(e),_ts_tree_root_node_with_offset_wasm=Module._ts_tree_root_node_with_offset_wasm=e=>(_ts_tree_root_node_with_offset_wasm=Module._ts_tree_root_node_with_offset_wasm=wasmExports.ts_tree_root_node_with_offset_wasm)(e),_ts_tree_edit_wasm=Module._ts_tree_edit_wasm=e=>(_ts_tree_edit_wasm=Module._ts_tree_edit_wasm=wasmExports.ts_tree_edit_wasm)(e),_ts_tree_included_ranges_wasm=Module._ts_tree_included_ranges_wasm=e=>(_ts_tree_included_ranges_wasm=Module._ts_tree_included_ranges_wasm=wasmExports.ts_tree_included_ranges_wasm)(e),_ts_tree_get_changed_ranges_wasm=Module._ts_tree_get_changed_ranges_wasm=(e,t)=>(_ts_tree_get_changed_ranges_wasm=Module._ts_tree_get_changed_ranges_wasm=wasmExports.ts_tree_get_changed_ranges_wasm)(e,t),_ts_tree_cursor_new_wasm=Module._ts_tree_cursor_new_wasm=e=>(_ts_tree_cursor_new_wasm=Module._ts_tree_cursor_new_wasm=wasmExports.ts_tree_cursor_new_wasm)(e),_ts_tree_cursor_delete_wasm=Module._ts_tree_cursor_delete_wasm=e=>(_ts_tree_cursor_delete_wasm=Module._ts_tree_cursor_delete_wasm=wasmExports.ts_tree_cursor_delete_wasm)(e),_ts_tree_cursor_reset_wasm=Module._ts_tree_cursor_reset_wasm=e=>(_ts_tree_cursor_reset_wasm=Module._ts_tree_cursor_reset_wasm=wasmExports.ts_tree_cursor_reset_wasm)(e),_ts_tree_cursor_reset_to_wasm=Module._ts_tree_cursor_reset_to_wasm=(e,t)=>(_ts_tree_cursor_reset_to_wasm=Module._ts_tree_cursor_reset_to_wasm=wasmExports.ts_tree_cursor_reset_to_wasm)(e,t),_ts_tree_cursor_goto_first_child_wasm=Module._ts_tree_cursor_goto_first_child_wasm=e=>(_ts_tree_cursor_goto_first_child_wasm=Module._ts_tree_cursor_goto_first_child_wasm=wasmExports.ts_tree_cursor_goto_first_child_wasm)(e),_ts_tree_cursor_goto_last_child_wasm=Module._ts_tree_cursor_goto_last_child_wasm=e=>(_ts_tree_cursor_goto_last_child_wasm=Module._ts_tree_cursor_goto_last_child_wasm=wasmExports.ts_tree_cursor_goto_last_child_wasm)(e),_ts_tree_cursor_goto_first_child_for_index_wasm=Module._ts_tree_cursor_goto_first_child_for_index_wasm=e=>(_ts_tree_cursor_goto_first_child_for_index_wasm=Module._ts_tree_cursor_goto_first_child_for_index_wasm=wasmExports.ts_tree_cursor_goto_first_child_for_index_wasm)(e),_ts_tree_cursor_goto_first_child_for_position_wasm=Module._ts_tree_cursor_goto_first_child_for_position_wasm=e=>(_ts_tree_cursor_goto_first_child_for_position_wasm=Module._ts_tree_cursor_goto_first_child_for_position_wasm=wasmExports.ts_tree_cursor_goto_first_child_for_position_wasm)(e),_ts_tree_cursor_goto_next_sibling_wasm=Module._ts_tree_cursor_goto_next_sibling_wasm=e=>(_ts_tree_cursor_goto_next_sibling_wasm=Module._ts_tree_cursor_goto_next_sibling_wasm=wasmExports.ts_tree_cursor_goto_next_sibling_wasm)(e),_ts_tree_cursor_goto_previous_sibling_wasm=Module._ts_tree_cursor_goto_previous_sibling_wasm=e=>(_ts_tree_cursor_goto_previous_sibling_wasm=Module._ts_tree_cursor_goto_previous_sibling_wasm=wasmExports.ts_tree_cursor_goto_previous_sibling_wasm)(e),_ts_tree_cursor_goto_descendant_wasm=Module._ts_tree_cursor_goto_descendant_wasm=(e,t)=>(_ts_tree_cursor_goto_descendant_wasm=Module._ts_tree_cursor_goto_descendant_wasm=wasmExports.ts_tree_cursor_goto_descendant_wasm)(e,t),_ts_tree_cursor_goto_parent_wasm=Module._ts_tree_cursor_goto_parent_wasm=e=>(_ts_tree_cursor_goto_parent_wasm=Module._ts_tree_cursor_goto_parent_wasm=wasmExports.ts_tree_cursor_goto_parent_wasm)(e),_ts_tree_cursor_current_node_type_id_wasm=Module._ts_tree_cursor_current_node_type_id_wasm=e=>(_ts_tree_cursor_current_node_type_id_wasm=Module._ts_tree_cursor_current_node_type_id_wasm=wasmExports.ts_tree_cursor_current_node_type_id_wasm)(e),_ts_tree_cursor_current_node_state_id_wasm=Module._ts_tree_cursor_current_node_state_id_wasm=e=>(_ts_tree_cursor_current_node_state_id_wasm=Module._ts_tree_cursor_current_node_state_id_wasm=wasmExports.ts_tree_cursor_current_node_state_id_wasm)(e),_ts_tree_cursor_current_node_is_named_wasm=Module._ts_tree_cursor_current_node_is_named_wasm=e=>(_ts_tree_cursor_current_node_is_named_wasm=Module._ts_tree_cursor_current_node_is_named_wasm=wasmExports.ts_tree_cursor_current_node_is_named_wasm)(e),_ts_tree_cursor_current_node_is_missing_wasm=Module._ts_tree_cursor_current_node_is_missing_wasm=e=>(_ts_tree_cursor_current_node_is_missing_wasm=Module._ts_tree_cursor_current_node_is_missing_wasm=wasmExports.ts_tree_cursor_current_node_is_missing_wasm)(e),_ts_tree_cursor_current_node_id_wasm=Module._ts_tree_cursor_current_node_id_wasm=e=>(_ts_tree_cursor_current_node_id_wasm=Module._ts_tree_cursor_current_node_id_wasm=wasmExports.ts_tree_cursor_current_node_id_wasm)(e),_ts_tree_cursor_start_position_wasm=Module._ts_tree_cursor_start_position_wasm=e=>(_ts_tree_cursor_start_position_wasm=Module._ts_tree_cursor_start_position_wasm=wasmExports.ts_tree_cursor_start_position_wasm)(e),_ts_tree_cursor_end_position_wasm=Module._ts_tree_cursor_end_position_wasm=e=>(_ts_tree_cursor_end_position_wasm=Module._ts_tree_cursor_end_position_wasm=wasmExports.ts_tree_cursor_end_position_wasm)(e),_ts_tree_cursor_start_index_wasm=Module._ts_tree_cursor_start_index_wasm=e=>(_ts_tree_cursor_start_index_wasm=Module._ts_tree_cursor_start_index_wasm=wasmExports.ts_tree_cursor_start_index_wasm)(e),_ts_tree_cursor_end_index_wasm=Module._ts_tree_cursor_end_index_wasm=e=>(_ts_tree_cursor_end_index_wasm=Module._ts_tree_cursor_end_index_wasm=wasmExports.ts_tree_cursor_end_index_wasm)(e),_ts_tree_cursor_current_field_id_wasm=Module._ts_tree_cursor_current_field_id_wasm=e=>(_ts_tree_cursor_current_field_id_wasm=Module._ts_tree_cursor_current_field_id_wasm=wasmExports.ts_tree_cursor_current_field_id_wasm)(e),_ts_tree_cursor_current_depth_wasm=Module._ts_tree_cursor_current_depth_wasm=e=>(_ts_tree_cursor_current_depth_wasm=Module._ts_tree_cursor_current_depth_wasm=wasmExports.ts_tree_cursor_current_depth_wasm)(e),_ts_tree_cursor_current_descendant_index_wasm=Module._ts_tree_cursor_current_descendant_index_wasm=e=>(_ts_tree_cursor_current_descendant_index_wasm=Module._ts_tree_cursor_current_descendant_index_wasm=wasmExports.ts_tree_cursor_current_descendant_index_wasm)(e),_ts_tree_cursor_current_node_wasm=Module._ts_tree_cursor_current_node_wasm=e=>(_ts_tree_cursor_current_node_wasm=Module._ts_tree_cursor_current_node_wasm=wasmExports.ts_tree_cursor_current_node_wasm)(e),_ts_node_symbol_wasm=Module._ts_node_symbol_wasm=e=>(_ts_node_symbol_wasm=Module._ts_node_symbol_wasm=wasmExports.ts_node_symbol_wasm)(e),_ts_node_field_name_for_child_wasm=Module._ts_node_field_name_for_child_wasm=(e,t)=>(_ts_node_field_name_for_child_wasm=Module._ts_node_field_name_for_child_wasm=wasmExports.ts_node_field_name_for_child_wasm)(e,t),_ts_node_children_by_field_id_wasm=Module._ts_node_children_by_field_id_wasm=(e,t)=>(_ts_node_children_by_field_id_wasm=Module._ts_node_children_by_field_id_wasm=wasmExports.ts_node_children_by_field_id_wasm)(e,t),_ts_node_first_child_for_byte_wasm=Module._ts_node_first_child_for_byte_wasm=e=>(_ts_node_first_child_for_byte_wasm=Module._ts_node_first_child_for_byte_wasm=wasmExports.ts_node_first_child_for_byte_wasm)(e),_ts_node_first_named_child_for_byte_wasm=Module._ts_node_first_named_child_for_byte_wasm=e=>(_ts_node_first_named_child_for_byte_wasm=Module._ts_node_first_named_child_for_byte_wasm=wasmExports.ts_node_first_named_child_for_byte_wasm)(e),_ts_node_grammar_symbol_wasm=Module._ts_node_grammar_symbol_wasm=e=>(_ts_node_grammar_symbol_wasm=Module._ts_node_grammar_symbol_wasm=wasmExports.ts_node_grammar_symbol_wasm)(e),_ts_node_child_count_wasm=Module._ts_node_child_count_wasm=e=>(_ts_node_child_count_wasm=Module._ts_node_child_count_wasm=wasmExports.ts_node_child_count_wasm)(e),_ts_node_named_child_count_wasm=Module._ts_node_named_child_count_wasm=e=>(_ts_node_named_child_count_wasm=Module._ts_node_named_child_count_wasm=wasmExports.ts_node_named_child_count_wasm)(e),_ts_node_child_wasm=Module._ts_node_child_wasm=(e,t)=>(_ts_node_child_wasm=Module._ts_node_child_wasm=wasmExports.ts_node_child_wasm)(e,t),_ts_node_named_child_wasm=Module._ts_node_named_child_wasm=(e,t)=>(_ts_node_named_child_wasm=Module._ts_node_named_child_wasm=wasmExports.ts_node_named_child_wasm)(e,t),_ts_node_child_by_field_id_wasm=Module._ts_node_child_by_field_id_wasm=(e,t)=>(_ts_node_child_by_field_id_wasm=Module._ts_node_child_by_field_id_wasm=wasmExports.ts_node_child_by_field_id_wasm)(e,t),_ts_node_next_sibling_wasm=Module._ts_node_next_sibling_wasm=e=>(_ts_node_next_sibling_wasm=Module._ts_node_next_sibling_wasm=wasmExports.ts_node_next_sibling_wasm)(e),_ts_node_prev_sibling_wasm=Module._ts_node_prev_sibling_wasm=e=>(_ts_node_prev_sibling_wasm=Module._ts_node_prev_sibling_wasm=wasmExports.ts_node_prev_sibling_wasm)(e),_ts_node_next_named_sibling_wasm=Module._ts_node_next_named_sibling_wasm=e=>(_ts_node_next_named_sibling_wasm=Module._ts_node_next_named_sibling_wasm=wasmExports.ts_node_next_named_sibling_wasm)(e),_ts_node_prev_named_sibling_wasm=Module._ts_node_prev_named_sibling_wasm=e=>(_ts_node_prev_named_sibling_wasm=Module._ts_node_prev_named_sibling_wasm=wasmExports.ts_node_prev_named_sibling_wasm)(e),_ts_node_descendant_count_wasm=Module._ts_node_descendant_count_wasm=e=>(_ts_node_descendant_count_wasm=Module._ts_node_descendant_count_wasm=wasmExports.ts_node_descendant_count_wasm)(e),_ts_node_parent_wasm=Module._ts_node_parent_wasm=e=>(_ts_node_parent_wasm=Module._ts_node_parent_wasm=wasmExports.ts_node_parent_wasm)(e),_ts_node_descendant_for_index_wasm=Module._ts_node_descendant_for_index_wasm=e=>(_ts_node_descendant_for_index_wasm=Module._ts_node_descendant_for_index_wasm=wasmExports.ts_node_descendant_for_index_wasm)(e),_ts_node_named_descendant_for_index_wasm=Module._ts_node_named_descendant_for_index_wasm=e=>(_ts_node_named_descendant_for_index_wasm=Module._ts_node_named_descendant_for_index_wasm=wasmExports.ts_node_named_descendant_for_index_wasm)(e),_ts_node_descendant_for_position_wasm=Module._ts_node_descendant_for_position_wasm=e=>(_ts_node_descendant_for_position_wasm=Module._ts_node_descendant_for_position_wasm=wasmExports.ts_node_descendant_for_position_wasm)(e),_ts_node_named_descendant_for_position_wasm=Module._ts_node_named_descendant_for_position_wasm=e=>(_ts_node_named_descendant_for_position_wasm=Module._ts_node_named_descendant_for_position_wasm=wasmExports.ts_node_named_descendant_for_position_wasm)(e),_ts_node_start_point_wasm=Module._ts_node_start_point_wasm=e=>(_ts_node_start_point_wasm=Module._ts_node_start_point_wasm=wasmExports.ts_node_start_point_wasm)(e),_ts_node_end_point_wasm=Module._ts_node_end_point_wasm=e=>(_ts_node_end_point_wasm=Module._ts_node_end_point_wasm=wasmExports.ts_node_end_point_wasm)(e),_ts_node_start_index_wasm=Module._ts_node_start_index_wasm=e=>(_ts_node_start_index_wasm=Module._ts_node_start_index_wasm=wasmExports.ts_node_start_index_wasm)(e),_ts_node_end_index_wasm=Module._ts_node_end_index_wasm=e=>(_ts_node_end_index_wasm=Module._ts_node_end_index_wasm=wasmExports.ts_node_end_index_wasm)(e),_ts_node_to_string_wasm=Module._ts_node_to_string_wasm=e=>(_ts_node_to_string_wasm=Module._ts_node_to_string_wasm=wasmExports.ts_node_to_string_wasm)(e),_ts_node_children_wasm=Module._ts_node_children_wasm=e=>(_ts_node_children_wasm=Module._ts_node_children_wasm=wasmExports.ts_node_children_wasm)(e),_ts_node_named_children_wasm=Module._ts_node_named_children_wasm=e=>(_ts_node_named_children_wasm=Module._ts_node_named_children_wasm=wasmExports.ts_node_named_children_wasm)(e),_ts_node_descendants_of_type_wasm=Module._ts_node_descendants_of_type_wasm=(e,t,r,n,s,o,a)=>(_ts_node_descendants_of_type_wasm=Module._ts_node_descendants_of_type_wasm=wasmExports.ts_node_descendants_of_type_wasm)(e,t,r,n,s,o,a),_ts_node_is_named_wasm=Module._ts_node_is_named_wasm=e=>(_ts_node_is_named_wasm=Module._ts_node_is_named_wasm=wasmExports.ts_node_is_named_wasm)(e),_ts_node_has_changes_wasm=Module._ts_node_has_changes_wasm=e=>(_ts_node_has_changes_wasm=Module._ts_node_has_changes_wasm=wasmExports.ts_node_has_changes_wasm)(e),_ts_node_has_error_wasm=Module._ts_node_has_error_wasm=e=>(_ts_node_has_error_wasm=Module._ts_node_has_error_wasm=wasmExports.ts_node_has_error_wasm)(e),_ts_node_is_error_wasm=Module._ts_node_is_error_wasm=e=>(_ts_node_is_error_wasm=Module._ts_node_is_error_wasm=wasmExports.ts_node_is_error_wasm)(e),_ts_node_is_missing_wasm=Module._ts_node_is_missing_wasm=e=>(_ts_node_is_missing_wasm=Module._ts_node_is_missing_wasm=wasmExports.ts_node_is_missing_wasm)(e),_ts_node_is_extra_wasm=Module._ts_node_is_extra_wasm=e=>(_ts_node_is_extra_wasm=Module._ts_node_is_extra_wasm=wasmExports.ts_node_is_extra_wasm)(e),_ts_node_parse_state_wasm=Module._ts_node_parse_state_wasm=e=>(_ts_node_parse_state_wasm=Module._ts_node_parse_state_wasm=wasmExports.ts_node_parse_state_wasm)(e),_ts_node_next_parse_state_wasm=Module._ts_node_next_parse_state_wasm=e=>(_ts_node_next_parse_state_wasm=Module._ts_node_next_parse_state_wasm=wasmExports.ts_node_next_parse_state_wasm)(e),_ts_query_matches_wasm=Module._ts_query_matches_wasm=(e,t,r,n,s,o,a,_,d,l)=>(_ts_query_matches_wasm=Module._ts_query_matches_wasm=wasmExports.ts_query_matches_wasm)(e,t,r,n,s,o,a,_,d,l),_ts_query_captures_wasm=Module._ts_query_captures_wasm=(e,t,r,n,s,o,a,_,d,l)=>(_ts_query_captures_wasm=Module._ts_query_captures_wasm=wasmExports.ts_query_captures_wasm)(e,t,r,n,s,o,a,_,d,l),_iswalpha=Module._iswalpha=e=>(_iswalpha=Module._iswalpha=wasmExports.iswalpha)(e),_iswblank=Module._iswblank=e=>(_iswblank=Module._iswblank=wasmExports.iswblank)(e),_iswdigit=Module._iswdigit=e=>(_iswdigit=Module._iswdigit=wasmExports.iswdigit)(e),_iswlower=Module._iswlower=e=>(_iswlower=Module._iswlower=wasmExports.iswlower)(e),_iswupper=Module._iswupper=e=>(_iswupper=Module._iswupper=wasmExports.iswupper)(e),_iswxdigit=Module._iswxdigit=e=>(_iswxdigit=Module._iswxdigit=wasmExports.iswxdigit)(e),_memchr=Module._memchr=(e,t,r)=>(_memchr=Module._memchr=wasmExports.memchr)(e,t,r),_strlen=Module._strlen=e=>(_strlen=Module._strlen=wasmExports.strlen)(e),_strcmp=Module._strcmp=(e,t)=>(_strcmp=Module._strcmp=wasmExports.strcmp)(e,t),_strncat=Module._strncat=(e,t,r)=>(_strncat=Module._strncat=wasmExports.strncat)(e,t,r),_strncpy=Module._strncpy=(e,t,r)=>(_strncpy=Module._strncpy=wasmExports.strncpy)(e,t,r),_towlower=Module._towlower=e=>(_towlower=Module._towlower=wasmExports.towlower)(e),_towupper=Module._towupper=e=>(_towupper=Module._towupper=wasmExports.towupper)(e),_setThrew=(e,t)=>(_setThrew=wasmExports.setThrew)(e,t),__emscripten_stack_restore=e=>(__emscripten_stack_restore=wasmExports._emscripten_stack_restore)(e),__emscripten_stack_alloc=e=>(__emscripten_stack_alloc=wasmExports._emscripten_stack_alloc)(e),_emscripten_stack_get_current=()=>(_emscripten_stack_get_current=wasmExports.emscripten_stack_get_current)(),dynCall_jiji=Module.dynCall_jiji=(e,t,r,n,s)=>(dynCall_jiji=Module.dynCall_jiji=wasmExports.dynCall_jiji)(e,t,r,n,s),_orig$ts_parser_timeout_micros=Module._orig$ts_parser_timeout_micros=e=>(_orig$ts_parser_timeout_micros=Module._orig$ts_parser_timeout_micros=wasmExports.orig$ts_parser_timeout_micros)(e),_orig$ts_parser_set_timeout_micros=Module._orig$ts_parser_set_timeout_micros=(e,t)=>(_orig$ts_parser_set_timeout_micros=Module._orig$ts_parser_set_timeout_micros=wasmExports.orig$ts_parser_set_timeout_micros)(e,t);Module.AsciiToString=AsciiToString,Module.stringToUTF16=stringToUTF16;var calledRun;dependenciesFulfilled=function e(){calledRun||run(),calledRun||(dependenciesFulfilled=e)};function callMain(e=[]){var t=resolveGlobalSymbol("main").sym;if(t){e.unshift(thisProgram);var r=e.length,n=stackAlloc((r+1)*4),s=n;e.forEach(a=>{LE_HEAP_STORE_U32((s>>2)*4,stringToUTF8OnStack(a)),s+=4}),LE_HEAP_STORE_U32((s>>2)*4,0);try{var o=t(r,n);return exitJS(o,!0),o}catch(a){return handleException(a)}}}function run(e=arguments_){if(runDependencies>0||(preRun(),runDependencies>0))return;function t(){calledRun||(calledRun=!0,Module.calledRun=!0,!ABORT&&(initRuntime(),preMain(),Module.onRuntimeInitialized?.(),shouldRunNow&&callMain(e),postRun()))}Module.setStatus?(Module.setStatus("Running..."),setTimeout(function(){setTimeout(function(){Module.setStatus("")},1),t()},1)):t()}if(Module.preInit)for(typeof Module.preInit=="function"&&(Module.preInit=[Module.preInit]);Module.preInit.length>0;)Module.preInit.pop()();var shouldRunNow=!0;Module.noInitialRun&&(shouldRunNow=!1),run();let C=Module,INTERNAL={},SIZE_OF_INT=4,SIZE_OF_CURSOR=4*SIZE_OF_INT,SIZE_OF_NODE=5*SIZE_OF_INT,SIZE_OF_POINT=2*SIZE_OF_INT,SIZE_OF_RANGE=2*SIZE_OF_INT+2*SIZE_OF_POINT,ZERO_POINT={row:0,column:0},QUERY_WORD_REGEX=/[\w-.]*/g,PREDICATE_STEP_TYPE_CAPTURE=1,PREDICATE_STEP_TYPE_STRING=2,LANGUAGE_FUNCTION_REGEX=/^_?tree_sitter_\w+/,VERSION,MIN_COMPATIBLE_VERSION,TRANSFER_BUFFER,currentParseCallback,currentLogCallback;class ParserImpl{static init(){TRANSFER_BUFFER=C._ts_init(),VERSION=getValue(TRANSFER_BUFFER,"i32"),MIN_COMPATIBLE_VERSION=getValue(TRANSFER_BUFFER+SIZE_OF_INT,"i32")}initialize(){C._ts_parser_new_wasm(),this[0]=getValue(TRANSFER_BUFFER,"i32"),this[1]=getValue(TRANSFER_BUFFER+SIZE_OF_INT,"i32")}delete(){C._ts_parser_delete(this[0]),C._free(this[1]),this[0]=0,this[1]=0}setLanguage(t){let r;if(!t)r=0,t=null;else if(t.constructor===Language){r=t[0];let n=C._ts_language_version(r);if(n<MIN_COMPATIBLE_VERSION||VERSION<n)throw new Error(`Incompatible language version ${n}. Compatibility range ${MIN_COMPATIBLE_VERSION} through ${VERSION}.`)}else throw new Error("Argument must be a Language");return this.language=t,C._ts_parser_set_language(this[0],r),this}getLanguage(){return this.language}parse(t,r,n){if(typeof t=="string")currentParseCallback=(d,l)=>t.slice(d);else if(typeof t=="function")currentParseCallback=t;else throw new Error("Argument must be a string or a function");this.logCallback?(currentLogCallback=this.logCallback,C._ts_parser_enable_logger_wasm(this[0],1)):(currentLogCallback=null,C._ts_parser_enable_logger_wasm(this[0],0));let s=0,o=0;if(n?.includedRanges){s=n.includedRanges.length,o=C._calloc(s,SIZE_OF_RANGE);let d=o;for(let l=0;l<s;l++)marshalRange(d,n.includedRanges[l]),d+=SIZE_OF_RANGE}let a=C._ts_parser_parse_wasm(this[0],this[1],r?r[0]:0,o,s);if(!a)throw currentParseCallback=null,currentLogCallback=null,new Error("Parsing failed");let _=new Tree(INTERNAL,a,this.language,currentParseCallback);return currentParseCallback=null,currentLogCallback=null,_}reset(){C._ts_parser_reset(this[0])}getIncludedRanges(){C._ts_parser_included_ranges_wasm(this[0]);let t=getValue(TRANSFER_BUFFER,"i32"),r=getValue(TRANSFER_BUFFER+SIZE_OF_INT,"i32"),n=new Array(t);if(t>0){let s=r;for(let o=0;o<t;o++)n[o]=unmarshalRange(s),s+=SIZE_OF_RANGE;C._free(r)}return n}getTimeoutMicros(){return C._ts_parser_timeout_micros(this[0])}setTimeoutMicros(t){C._ts_parser_set_timeout_micros(this[0],t)}setLogger(t){if(!t)t=null;else if(typeof t!="function")throw new Error("Logger callback must be a function");return this.logCallback=t,this}getLogger(){return this.logCallback}}class Tree{constructor(t,r,n,s){assertInternal(t),this[0]=r,this.language=n,this.textCallback=s}copy(){let t=C._ts_tree_copy(this[0]);return new Tree(INTERNAL,t,this.language,this.textCallback)}delete(){C._ts_tree_delete(this[0]),this[0]=0}edit(t){marshalEdit(t),C._ts_tree_edit_wasm(this[0])}get rootNode(){return C._ts_tree_root_node_wasm(this[0]),unmarshalNode(this)}rootNodeWithOffset(t,r){let n=TRANSFER_BUFFER+SIZE_OF_NODE;return setValue(n,t,"i32"),marshalPoint(n+SIZE_OF_INT,r),C._ts_tree_root_node_with_offset_wasm(this[0]),unmarshalNode(this)}getLanguage(){return this.language}walk(){return this.rootNode.walk()}getChangedRanges(t){if(t.constructor!==Tree)throw new TypeError("Argument must be a Tree");C._ts_tree_get_changed_ranges_wasm(this[0],t[0]);let r=getValue(TRANSFER_BUFFER,"i32"),n=getValue(TRANSFER_BUFFER+SIZE_OF_INT,"i32"),s=new Array(r);if(r>0){let o=n;for(let a=0;a<r;a++)s[a]=unmarshalRange(o),o+=SIZE_OF_RANGE;C._free(n)}return s}getIncludedRanges(){C._ts_tree_included_ranges_wasm(this[0]);let t=getValue(TRANSFER_BUFFER,"i32"),r=getValue(TRANSFER_BUFFER+SIZE_OF_INT,"i32"),n=new Array(t);if(t>0){let s=r;for(let o=0;o<t;o++)n[o]=unmarshalRange(s),s+=SIZE_OF_RANGE;C._free(r)}return n}}class Node{constructor(t,r){assertInternal(t),this.tree=r}get typeId(){return marshalNode(this),C._ts_node_symbol_wasm(this.tree[0])}get grammarId(){return marshalNode(this),C._ts_node_grammar_symbol_wasm(this.tree[0])}get type(){return this.tree.language.types[this.typeId]||"ERROR"}get grammarType(){return this.tree.language.types[this.grammarId]||"ERROR"}get endPosition(){return marshalNode(this),C._ts_node_end_point_wasm(this.tree[0]),unmarshalPoint(TRANSFER_BUFFER)}get endIndex(){return marshalNode(this),C._ts_node_end_index_wasm(this.tree[0])}get text(){return getText(this.tree,this.startIndex,this.endIndex)}get parseState(){return marshalNode(this),C._ts_node_parse_state_wasm(this.tree[0])}get nextParseState(){return marshalNode(this),C._ts_node_next_parse_state_wasm(this.tree[0])}get isNamed(){return marshalNode(this),C._ts_node_is_named_wasm(this.tree[0])===1}get hasError(){return marshalNode(this),C._ts_node_has_error_wasm(this.tree[0])===1}get hasChanges(){return marshalNode(this),C._ts_node_has_changes_wasm(this.tree[0])===1}get isError(){return marshalNode(this),C._ts_node_is_error_wasm(this.tree[0])===1}get isMissing(){return marshalNode(this),C._ts_node_is_missing_wasm(this.tree[0])===1}get isExtra(){return marshalNode(this),C._ts_node_is_extra_wasm(this.tree[0])===1}equals(t){return this.id===t.id}child(t){return marshalNode(this),C._ts_node_child_wasm(this.tree[0],t),unmarshalNode(this.tree)}namedChild(t){return marshalNode(this),C._ts_node_named_child_wasm(this.tree[0],t),unmarshalNode(this.tree)}childForFieldId(t){return marshalNode(this),C._ts_node_child_by_field_id_wasm(this.tree[0],t),unmarshalNode(this.tree)}childForFieldName(t){let r=this.tree.language.fields.indexOf(t);return r!==-1?this.childForFieldId(r):null}fieldNameForChild(t){marshalNode(this);let r=C._ts_node_field_name_for_child_wasm(this.tree[0],t);return r?AsciiToString(r):null}childrenForFieldName(t){let r=this.tree.language.fields.indexOf(t);return r!==-1&&r!==0?this.childrenForFieldId(r):[]}childrenForFieldId(t){marshalNode(this),C._ts_node_children_by_field_id_wasm(this.tree[0],t);let r=getValue(TRANSFER_BUFFER,"i32"),n=getValue(TRANSFER_BUFFER+SIZE_OF_INT,"i32"),s=new Array(r);if(r>0){let o=n;for(let a=0;a<r;a++)s[a]=unmarshalNode(this.tree,o),o+=SIZE_OF_NODE;C._free(n)}return s}firstChildForIndex(t){marshalNode(this);let r=TRANSFER_BUFFER+SIZE_OF_NODE;return setValue(r,t,"i32"),C._ts_node_first_child_for_byte_wasm(this.tree[0]),unmarshalNode(this.tree)}firstNamedChildForIndex(t){marshalNode(this);let r=TRANSFER_BUFFER+SIZE_OF_NODE;return setValue(r,t,"i32"),C._ts_node_first_named_child_for_byte_wasm(this.tree[0]),unmarshalNode(this.tree)}get childCount(){return marshalNode(this),C._ts_node_child_count_wasm(this.tree[0])}get namedChildCount(){return marshalNode(this),C._ts_node_named_child_count_wasm(this.tree[0])}get firstChild(){return this.child(0)}get firstNamedChild(){return this.namedChild(0)}get lastChild(){return this.child(this.childCount-1)}get lastNamedChild(){return this.namedChild(this.namedChildCount-1)}get children(){if(!this._children){marshalNode(this),C._ts_node_children_wasm(this.tree[0]);let t=getValue(TRANSFER_BUFFER,"i32"),r=getValue(TRANSFER_BUFFER+SIZE_OF_INT,"i32");if(this._children=new Array(t),t>0){let n=r;for(let s=0;s<t;s++)this._children[s]=unmarshalNode(this.tree,n),n+=SIZE_OF_NODE;C._free(r)}}return this._children}get namedChildren(){if(!this._namedChildren){marshalNode(this),C._ts_node_named_children_wasm(this.tree[0]);let t=getValue(TRANSFER_BUFFER,"i32"),r=getValue(TRANSFER_BUFFER+SIZE_OF_INT,"i32");if(this._namedChildren=new Array(t),t>0){let n=r;for(let s=0;s<t;s++)this._namedChildren[s]=unmarshalNode(this.tree,n),n+=SIZE_OF_NODE;C._free(r)}}return this._namedChildren}descendantsOfType(t,r,n){Array.isArray(t)||(t=[t]),r||(r=ZERO_POINT),n||(n=ZERO_POINT);let s=[],o=this.tree.language.types;for(let c=0,m=o.length;c<m;c++)t.includes(o[c])&&s.push(c);let a=C._malloc(SIZE_OF_INT*s.length);for(let c=0,m=s.length;c<m;c++)setValue(a+c*SIZE_OF_INT,s[c],"i32");marshalNode(this),C._ts_node_descendants_of_type_wasm(this.tree[0],a,s.length,r.row,r.column,n.row,n.column);let _=getValue(TRANSFER_BUFFER,"i32"),d=getValue(TRANSFER_BUFFER+SIZE_OF_INT,"i32"),l=new Array(_);if(_>0){let c=d;for(let m=0;m<_;m++)l[m]=unmarshalNode(this.tree,c),c+=SIZE_OF_NODE}return C._free(d),C._free(a),l}get nextSibling(){return marshalNode(this),C._ts_node_next_sibling_wasm(this.tree[0]),unmarshalNode(this.tree)}get previousSibling(){return marshalNode(this),C._ts_node_prev_sibling_wasm(this.tree[0]),unmarshalNode(this.tree)}get nextNamedSibling(){return marshalNode(this),C._ts_node_next_named_sibling_wasm(this.tree[0]),unmarshalNode(this.tree)}get previousNamedSibling(){return marshalNode(this),C._ts_node_prev_named_sibling_wasm(this.tree[0]),unmarshalNode(this.tree)}get descendantCount(){return marshalNode(this),C._ts_node_descendant_count_wasm(this.tree[0])}get parent(){return marshalNode(this),C._ts_node_parent_wasm(this.tree[0]),unmarshalNode(this.tree)}descendantForIndex(t,r=t){if(typeof t!="number"||typeof r!="number")throw new Error("Arguments must be numbers");marshalNode(this);let n=TRANSFER_BUFFER+SIZE_OF_NODE;return setValue(n,t,"i32"),setValue(n+SIZE_OF_INT,r,"i32"),C._ts_node_descendant_for_index_wasm(this.tree[0]),unmarshalNode(this.tree)}namedDescendantForIndex(t,r=t){if(typeof t!="number"||typeof r!="number")throw new Error("Arguments must be numbers");marshalNode(this);let n=TRANSFER_BUFFER+SIZE_OF_NODE;return setValue(n,t,"i32"),setValue(n+SIZE_OF_INT,r,"i32"),C._ts_node_named_descendant_for_index_wasm(this.tree[0]),unmarshalNode(this.tree)}descendantForPosition(t,r=t){if(!isPoint(t)||!isPoint(r))throw new Error("Arguments must be {row, column} objects");marshalNode(this);let n=TRANSFER_BUFFER+SIZE_OF_NODE;return marshalPoint(n,t),marshalPoint(n+SIZE_OF_POINT,r),C._ts_node_descendant_for_position_wasm(this.tree[0]),unmarshalNode(this.tree)}namedDescendantForPosition(t,r=t){if(!isPoint(t)||!isPoint(r))throw new Error("Arguments must be {row, column} objects");marshalNode(this);let n=TRANSFER_BUFFER+SIZE_OF_NODE;return marshalPoint(n,t),marshalPoint(n+SIZE_OF_POINT,r),C._ts_node_named_descendant_for_position_wasm(this.tree[0]),unmarshalNode(this.tree)}walk(){return marshalNode(this),C._ts_tree_cursor_new_wasm(this.tree[0]),new TreeCursor(INTERNAL,this.tree)}toString(){marshalNode(this);let t=C._ts_node_to_string_wasm(this.tree[0]),r=AsciiToString(t);return C._free(t),r}}class TreeCursor{constructor(t,r){assertInternal(t),this.tree=r,unmarshalTreeCursor(this)}delete(){marshalTreeCursor(this),C._ts_tree_cursor_delete_wasm(this.tree[0]),this[0]=this[1]=this[2]=0}reset(t){marshalNode(t),marshalTreeCursor(this,TRANSFER_BUFFER+SIZE_OF_NODE),C._ts_tree_cursor_reset_wasm(this.tree[0]),unmarshalTreeCursor(this)}resetTo(t){marshalTreeCursor(this,TRANSFER_BUFFER),marshalTreeCursor(t,TRANSFER_BUFFER+SIZE_OF_CURSOR),C._ts_tree_cursor_reset_to_wasm(this.tree[0],t.tree[0]),unmarshalTreeCursor(this)}get nodeType(){return this.tree.language.types[this.nodeTypeId]||"ERROR"}get nodeTypeId(){return marshalTreeCursor(this),C._ts_tree_cursor_current_node_type_id_wasm(this.tree[0])}get nodeStateId(){return marshalTreeCursor(this),C._ts_tree_cursor_current_node_state_id_wasm(this.tree[0])}get nodeId(){return marshalTreeCursor(this),C._ts_tree_cursor_current_node_id_wasm(this.tree[0])}get nodeIsNamed(){return marshalTreeCursor(this),C._ts_tree_cursor_current_node_is_named_wasm(this.tree[0])===1}get nodeIsMissing(){return marshalTreeCursor(this),C._ts_tree_cursor_current_node_is_missing_wasm(this.tree[0])===1}get nodeText(){marshalTreeCursor(this);let t=C._ts_tree_cursor_start_index_wasm(this.tree[0]),r=C._ts_tree_cursor_end_index_wasm(this.tree[0]);return getText(this.tree,t,r)}get startPosition(){return marshalTreeCursor(this),C._ts_tree_cursor_start_position_wasm(this.tree[0]),unmarshalPoint(TRANSFER_BUFFER)}get endPosition(){return marshalTreeCursor(this),C._ts_tree_cursor_end_position_wasm(this.tree[0]),unmarshalPoint(TRANSFER_BUFFER)}get startIndex(){return marshalTreeCursor(this),C._ts_tree_cursor_start_index_wasm(this.tree[0])}get endIndex(){return marshalTreeCursor(this),C._ts_tree_cursor_end_index_wasm(this.tree[0])}get currentNode(){return marshalTreeCursor(this),C._ts_tree_cursor_current_node_wasm(this.tree[0]),unmarshalNode(this.tree)}get currentFieldId(){return marshalTreeCursor(this),C._ts_tree_cursor_current_field_id_wasm(this.tree[0])}get currentFieldName(){return this.tree.language.fields[this.currentFieldId]}get currentDepth(){return marshalTreeCursor(this),C._ts_tree_cursor_current_depth_wasm(this.tree[0])}get currentDescendantIndex(){return marshalTreeCursor(this),C._ts_tree_cursor_current_descendant_index_wasm(this.tree[0])}gotoFirstChild(){marshalTreeCursor(this);let t=C._ts_tree_cursor_goto_first_child_wasm(this.tree[0]);return unmarshalTreeCursor(this),t===1}gotoLastChild(){marshalTreeCursor(this);let t=C._ts_tree_cursor_goto_last_child_wasm(this.tree[0]);return unmarshalTreeCursor(this),t===1}gotoFirstChildForIndex(t){marshalTreeCursor(this),setValue(TRANSFER_BUFFER+SIZE_OF_CURSOR,t,"i32");let r=C._ts_tree_cursor_goto_first_child_for_index_wasm(this.tree[0]);return unmarshalTreeCursor(this),r===1}gotoFirstChildForPosition(t){marshalTreeCursor(this),marshalPoint(TRANSFER_BUFFER+SIZE_OF_CURSOR,t);let r=C._ts_tree_cursor_goto_first_child_for_position_wasm(this.tree[0]);return unmarshalTreeCursor(this),r===1}gotoNextSibling(){marshalTreeCursor(this);let t=C._ts_tree_cursor_goto_next_sibling_wasm(this.tree[0]);return unmarshalTreeCursor(this),t===1}gotoPreviousSibling(){marshalTreeCursor(this);let t=C._ts_tree_cursor_goto_previous_sibling_wasm(this.tree[0]);return unmarshalTreeCursor(this),t===1}gotoDescendant(t){marshalTreeCursor(this),C._ts_tree_cursor_goto_descendant_wasm(this.tree[0],t),unmarshalTreeCursor(this)}gotoParent(){marshalTreeCursor(this);let t=C._ts_tree_cursor_goto_parent_wasm(this.tree[0]);return unmarshalTreeCursor(this),t===1}}class Language{constructor(t,r){assertInternal(t),this[0]=r,this.types=new Array(C._ts_language_symbol_count(this[0]));for(let n=0,s=this.types.length;n<s;n++)C._ts_language_symbol_type(this[0],n)<2&&(this.types[n]=UTF8ToString(C._ts_language_symbol_name(this[0],n)));this.fields=new Array(C._ts_language_field_count(this[0])+1);for(let n=0,s=this.fields.length;n<s;n++){let o=C._ts_language_field_name_for_id(this[0],n);o!==0?this.fields[n]=UTF8ToString(o):this.fields[n]=null}}get version(){return C._ts_language_version(this[0])}get fieldCount(){return this.fields.length-1}get stateCount(){return C._ts_language_state_count(this[0])}fieldIdForName(t){let r=this.fields.indexOf(t);return r!==-1?r:null}fieldNameForId(t){return this.fields[t]||null}idForNodeType(t,r){let n=lengthBytesUTF8(t),s=C._malloc(n+1);stringToUTF8(t,s,n+1);let o=C._ts_language_symbol_for_name(this[0],s,n,r);return C._free(s),o||null}get nodeTypeCount(){return C._ts_language_symbol_count(this[0])}nodeTypeForId(t){let r=C._ts_language_symbol_name(this[0],t);return r?UTF8ToString(r):null}nodeTypeIsNamed(t){return!!C._ts_language_type_is_named_wasm(this[0],t)}nodeTypeIsVisible(t){return!!C._ts_language_type_is_visible_wasm(this[0],t)}nextState(t,r){return C._ts_language_next_state(this[0],t,r)}lookaheadIterator(t){let r=C._ts_lookahead_iterator_new(this[0],t);return r?new LookaheadIterable(INTERNAL,r,this):null}query(t){let r=lengthBytesUTF8(t),n=C._malloc(r+1);stringToUTF8(t,n,r+1);let s=C._ts_query_new(this[0],n,r,TRANSFER_BUFFER,TRANSFER_BUFFER+SIZE_OF_INT);if(!s){let f=getValue(TRANSFER_BUFFER+SIZE_OF_INT,"i32"),M=getValue(TRANSFER_BUFFER,"i32"),v=UTF8ToString(n,M).length,u=t.substr(v,100).split(`
`)[0],E=u.match(QUERY_WORD_REGEX)[0],x;switch(f){case 2:x=new RangeError(`Bad node name '${E}'`);break;case 3:x=new RangeError(`Bad field name '${E}'`);break;case 4:x=new RangeError(`Bad capture name @${E}`);break;case 5:x=new TypeError(`Bad pattern structure at offset ${v}: '${u}'...`),E="";break;default:x=new SyntaxError(`Bad syntax at offset ${v}: '${u}'...`),E="";break}throw x.index=v,x.length=E.length,C._free(n),x}let o=C._ts_query_string_count(s),a=C._ts_query_capture_count(s),_=C._ts_query_pattern_count(s),d=new Array(a),l=new Array(o);for(let f=0;f<a;f++){let M=C._ts_query_capture_name_for_id(s,f,TRANSFER_BUFFER),v=getValue(TRANSFER_BUFFER,"i32");d[f]=UTF8ToString(M,v)}for(let f=0;f<o;f++){let M=C._ts_query_string_value_for_id(s,f,TRANSFER_BUFFER),v=getValue(TRANSFER_BUFFER,"i32");l[f]=UTF8ToString(M,v)}let c=new Array(_),m=new Array(_),p=new Array(_),g=new Array(_),T=new Array(_);for(let f=0;f<_;f++){let M=C._ts_query_predicates_for_pattern(s,f,TRANSFER_BUFFER),v=getValue(TRANSFER_BUFFER,"i32");g[f]=[],T[f]=[];let u=[],E=M;for(let x=0;x<v;x++){let F=getValue(E,"i32");E+=SIZE_OF_INT;let _e=getValue(E,"i32");if(E+=SIZE_OF_INT,F===PREDICATE_STEP_TYPE_CAPTURE)u.push({type:"capture",name:d[_e]});else if(F===PREDICATE_STEP_TYPE_STRING)u.push({type:"string",value:l[_e]});else if(u.length>0){if(u[0].type!=="string")throw new Error("Predicates must begin with a literal value");let S=u[0].value,O=!0,H=!0,B;switch(S){case"any-not-eq?":case"not-eq?":O=!1;case"any-eq?":case"eq?":if(u.length!==3)throw new Error(`Wrong number of arguments to \`#${S}\` predicate. Expected 2, got ${u.length-1}`);if(u[1].type!=="capture")throw new Error(`First argument of \`#${S}\` predicate must be a capture. Got "${u[1].value}"`);if(H=!S.startsWith("any-"),u[2].type==="capture"){let b=u[1].name,N=u[2].name;T[f].push(U=>{let I=[],G=[];for(let A of U)A.name===b&&I.push(A.node),A.name===N&&G.push(A.node);let X=(A,z,ut)=>ut?A.text===z.text:A.text!==z.text;return H?I.every(A=>G.some(z=>X(A,z,O))):I.some(A=>G.some(z=>X(A,z,O)))})}else{B=u[1].name;let b=u[2].value,N=I=>I.text===b,U=I=>I.text!==b;T[f].push(I=>{let G=[];for(let A of I)A.name===B&&G.push(A.node);let X=O?N:U;return H?G.every(X):G.some(X)})}break;case"any-not-match?":case"not-match?":O=!1;case"any-match?":case"match?":if(u.length!==3)throw new Error(`Wrong number of arguments to \`#${S}\` predicate. Expected 2, got ${u.length-1}.`);if(u[1].type!=="capture")throw new Error(`First argument of \`#${S}\` predicate must be a capture. Got "${u[1].value}".`);if(u[2].type!=="string")throw new Error(`Second argument of \`#${S}\` predicate must be a string. Got @${u[2].value}.`);B=u[1].name;let J=new RegExp(u[2].value);H=!S.startsWith("any-"),T[f].push(b=>{let N=[];for(let I of b)I.name===B&&N.push(I.node.text);let U=(I,G)=>G?J.test(I):!J.test(I);return N.length===0?!O:H?N.every(I=>U(I,O)):N.some(I=>U(I,O))});break;case"set!":if(u.length<2||u.length>3)throw new Error(`Wrong number of arguments to \`#set!\` predicate. Expected 1 or 2. Got ${u.length-1}.`);if(u.some(b=>b.type!=="string"))throw new Error('Arguments to `#set!` predicate must be a strings.".');c[f]||(c[f]={}),c[f][u[1].value]=u[2]?u[2].value:null;break;case"is?":case"is-not?":if(u.length<2||u.length>3)throw new Error(`Wrong number of arguments to \`#${S}\` predicate. Expected 1 or 2. Got ${u.length-1}.`);if(u.some(b=>b.type!=="string"))throw new Error(`Arguments to \`#${S}\` predicate must be a strings.".`);let de=S==="is?"?m:p;de[f]||(de[f]={}),de[f][u[1].value]=u[2]?u[2].value:null;break;case"not-any-of?":O=!1;case"any-of?":if(u.length<2)throw new Error(`Wrong number of arguments to \`#${S}\` predicate. Expected at least 1. Got ${u.length-1}.`);if(u[1].type!=="capture")throw new Error(`First argument of \`#${S}\` predicate must be a capture. Got "${u[1].value}".`);for(let b=2;b<u.length;b++)if(u[b].type!=="string")throw new Error(`Arguments to \`#${S}\` predicate must be a strings.".`);B=u[1].name;let W=u.slice(2).map(b=>b.value);T[f].push(b=>{let N=[];for(let U of b)U.name===B&&N.push(U.node.text);return N.length===0?!O:N.every(U=>W.includes(U))===O});break;default:g[f].push({operator:S,operands:u.slice(1)})}u.length=0}}Object.freeze(c[f]),Object.freeze(m[f]),Object.freeze(p[f])}return C._free(n),new Query(INTERNAL,s,d,T,g,Object.freeze(c),Object.freeze(m),Object.freeze(p))}static load(t){let r;if(t instanceof Uint8Array)r=Promise.resolve(t);else{let n=t;if(typeof process<"u"&&process.versions&&process.versions.node){let s=require("fs");r=Promise.resolve(s.readFileSync(n))}else r=fetch(n).then(s=>s.arrayBuffer().then(o=>{if(s.ok)return new Uint8Array(o);{let a=new TextDecoder("utf-8").decode(o);throw new Error(`Language.load failed with status ${s.status}.

${a}`)}}))}return r.then(n=>loadWebAssemblyModule(n,{loadAsync:!0})).then(n=>{let s=Object.keys(n),o=s.find(_=>LANGUAGE_FUNCTION_REGEX.test(_)&&!_.includes("external_scanner_"));o||console.log(`Couldn't find language function in WASM file. Symbols:
${JSON.stringify(s,null,2)}`);let a=n[o]();return new Language(INTERNAL,a)})}}class LookaheadIterable{constructor(t,r,n){assertInternal(t),this[0]=r,this.language=n}get currentTypeId(){return C._ts_lookahead_iterator_current_symbol(this[0])}get currentType(){return this.language.types[this.currentTypeId]||"ERROR"}delete(){C._ts_lookahead_iterator_delete(this[0]),this[0]=0}resetState(t){return C._ts_lookahead_iterator_reset_state(this[0],t)}reset(t,r){return C._ts_lookahead_iterator_reset(this[0],t[0],r)?(this.language=t,!0):!1}[Symbol.iterator](){let t=this;return{next(){return C._ts_lookahead_iterator_next(t[0])?{done:!1,value:t.currentType}:{done:!0,value:""}}}}}class Query{constructor(t,r,n,s,o,a,_,d){assertInternal(t),this[0]=r,this.captureNames=n,this.textPredicates=s,this.predicates=o,this.setProperties=a,this.assertedProperties=_,this.refutedProperties=d,this.exceededMatchLimit=!1}delete(){C._ts_query_delete(this[0]),this[0]=0}matches(t,{startPosition:r=ZERO_POINT,endPosition:n=ZERO_POINT,startIndex:s=0,endIndex:o=0,matchLimit:a=4294967295,maxStartDepth:_=4294967295}={}){if(typeof a!="number")throw new Error("Arguments must be numbers");marshalNode(t),C._ts_query_matches_wasm(this[0],t.tree[0],r.row,r.column,n.row,n.column,s,o,a,_);let d=getValue(TRANSFER_BUFFER,"i32"),l=getValue(TRANSFER_BUFFER+SIZE_OF_INT,"i32"),c=getValue(TRANSFER_BUFFER+2*SIZE_OF_INT,"i32"),m=new Array(d);this.exceededMatchLimit=!!c;let p=0,g=l;for(let T=0;T<d;T++){let f=getValue(g,"i32");g+=SIZE_OF_INT;let M=getValue(g,"i32");g+=SIZE_OF_INT;let v=new Array(M);if(g=unmarshalCaptures(this,t.tree,g,v),this.textPredicates[f].every(u=>u(v))){m[p]={pattern:f,captures:v};let u=this.setProperties[f];u&&(m[p].setProperties=u);let E=this.assertedProperties[f];E&&(m[p].assertedProperties=E);let x=this.refutedProperties[f];x&&(m[p].refutedProperties=x),p++}}return m.length=p,C._free(l),m}captures(t,{startPosition:r=ZERO_POINT,endPosition:n=ZERO_POINT,startIndex:s=0,endIndex:o=0,matchLimit:a=4294967295,maxStartDepth:_=4294967295}={}){if(typeof a!="number")throw new Error("Arguments must be numbers");marshalNode(t),C._ts_query_captures_wasm(this[0],t.tree[0],r.row,r.column,n.row,n.column,s,o,a,_);let d=getValue(TRANSFER_BUFFER,"i32"),l=getValue(TRANSFER_BUFFER+SIZE_OF_INT,"i32"),c=getValue(TRANSFER_BUFFER+2*SIZE_OF_INT,"i32"),m=[];this.exceededMatchLimit=!!c;let p=[],g=l;for(let T=0;T<d;T++){let f=getValue(g,"i32");g+=SIZE_OF_INT;let M=getValue(g,"i32");g+=SIZE_OF_INT;let v=getValue(g,"i32");if(g+=SIZE_OF_INT,p.length=M,g=unmarshalCaptures(this,t.tree,g,p),this.textPredicates[f].every(u=>u(p))){let u=p[v],E=this.setProperties[f];E&&(u.setProperties=E);let x=this.assertedProperties[f];x&&(u.assertedProperties=x);let F=this.refutedProperties[f];F&&(u.refutedProperties=F),m.push(u)}}return C._free(l),m}predicatesForPattern(t){return this.predicates[t]}disableCapture(t){let r=lengthBytesUTF8(t),n=C._malloc(r+1);stringToUTF8(t,n,r+1),C._ts_query_disable_capture(this[0],n,r),C._free(n)}didExceedMatchLimit(){return this.exceededMatchLimit}}function getText(e,t,r){let n=r-t,s=e.textCallback(t,null,r);for(t+=s.length;t<r;){let o=e.textCallback(t,null,r);if(o&&o.length>0)t+=o.length,s+=o;else break}return t>r&&(s=s.slice(0,n)),s}function unmarshalCaptures(e,t,r,n){for(let s=0,o=n.length;s<o;s++){let a=getValue(r,"i32");r+=SIZE_OF_INT;let _=unmarshalNode(t,r);r+=SIZE_OF_NODE,n[s]={name:e.captureNames[a],node:_}}return r}function assertInternal(e){if(e!==INTERNAL)throw new Error("Illegal constructor")}function isPoint(e){return e&&typeof e.row=="number"&&typeof e.column=="number"}function marshalNode(e){let t=TRANSFER_BUFFER;setValue(t,e.id,"i32"),t+=SIZE_OF_INT,setValue(t,e.startIndex,"i32"),t+=SIZE_OF_INT,setValue(t,e.startPosition.row,"i32"),t+=SIZE_OF_INT,setValue(t,e.startPosition.column,"i32"),t+=SIZE_OF_INT,setValue(t,e[0],"i32")}function unmarshalNode(e,t=TRANSFER_BUFFER){let r=getValue(t,"i32");if(t+=SIZE_OF_INT,r===0)return null;let n=getValue(t,"i32");t+=SIZE_OF_INT;let s=getValue(t,"i32");t+=SIZE_OF_INT;let o=getValue(t,"i32");t+=SIZE_OF_INT;let a=getValue(t,"i32"),_=new Node(INTERNAL,e);return _.id=r,_.startIndex=n,_.startPosition={row:s,column:o},_[0]=a,_}function marshalTreeCursor(e,t=TRANSFER_BUFFER){setValue(t+0*SIZE_OF_INT,e[0],"i32"),setValue(t+1*SIZE_OF_INT,e[1],"i32"),setValue(t+2*SIZE_OF_INT,e[2],"i32"),setValue(t+3*SIZE_OF_INT,e[3],"i32")}function unmarshalTreeCursor(e){e[0]=getValue(TRANSFER_BUFFER+0*SIZE_OF_INT,"i32"),e[1]=getValue(TRANSFER_BUFFER+1*SIZE_OF_INT,"i32"),e[2]=getValue(TRANSFER_BUFFER+2*SIZE_OF_INT,"i32"),e[3]=getValue(TRANSFER_BUFFER+3*SIZE_OF_INT,"i32")}function marshalPoint(e,t){setValue(e,t.row,"i32"),setValue(e+SIZE_OF_INT,t.column,"i32")}function unmarshalPoint(e){return{row:getValue(e,"i32")>>>0,column:getValue(e+SIZE_OF_INT,"i32")>>>0}}function marshalRange(e,t){marshalPoint(e,t.startPosition),e+=SIZE_OF_POINT,marshalPoint(e,t.endPosition),e+=SIZE_OF_POINT,setValue(e,t.startIndex,"i32"),e+=SIZE_OF_INT,setValue(e,t.endIndex,"i32"),e+=SIZE_OF_INT}function unmarshalRange(e){let t={};return t.startPosition=unmarshalPoint(e),e+=SIZE_OF_POINT,t.endPosition=unmarshalPoint(e),e+=SIZE_OF_POINT,t.startIndex=getValue(e,"i32")>>>0,e+=SIZE_OF_INT,t.endIndex=getValue(e,"i32")>>>0,t}function marshalEdit(e){let t=TRANSFER_BUFFER;marshalPoint(t,e.startPosition),t+=SIZE_OF_POINT,marshalPoint(t,e.oldEndPosition),t+=SIZE_OF_POINT,marshalPoint(t,e.newEndPosition),t+=SIZE_OF_POINT,setValue(t,e.startIndex,"i32"),t+=SIZE_OF_INT,setValue(t,e.oldEndIndex,"i32"),t+=SIZE_OF_INT,setValue(t,e.newEndIndex,"i32"),t+=SIZE_OF_INT}for(let e of Object.getOwnPropertyNames(ParserImpl.prototype))Object.defineProperty(Parser.prototype,e,{value:ParserImpl.prototype[e],enumerable:!1,writable:!1});Parser.Language=Language,Module.onRuntimeInitialized=()=>{ParserImpl.init(),resolveInitPromise()}}))}}return Parser}();typeof exports=="object"&&(module.exports=TreeSitter)});var lt=require("worker_threads");var Ie={};yt(Ie,{_dispose:()=>Ae,_findLastTest:()=>et,_getCallExpressions:()=>Pt,_getClassDeclarations:()=>Ot,_getClassReferences:()=>Ut,_getCoarseParentScope:()=>Vt,_getDocumentableNodeIfOnIdentifier:()=>$e,_getFineScopes:()=>Gt,_getFixSelectionOfInterest:()=>Ht,_getFunctionBodies:()=>qt,_getFunctionDefinitions:()=>Ft,_getNodeMatchingSelection:()=>Q,_getNodeToDocument:()=>Ze,_getNodeToExplain:()=>jt,_getParseErrorCount:()=>rr,_getSemanticChunkNames:()=>Wt,_getSemanticChunkTree:()=>Bt,_getStructure:()=>tr,_getSymbols:()=>Dt,_getTestableNode:()=>Xe,_getTestableNodes:()=>Ye,_getTypeDeclarations:()=>kt,_getTypeReferences:()=>Lt,getBlockNameTree:()=>_t});function Me(e,t,r){let n=0,s=e.length;for(;n<s;){let o=n+s>>>1;r(e[o],t)?n=o+1:s=o}return n}function Re(e,t){if(e.length===0)return;let r=e[0];for(let n=1;n<e.length;n++){let s=e[n];t(s,r)>0&&(r=s)}return r}var he=class{constructor(){this.listeners=[],this.unexpectedErrorHandler=function(t){setTimeout(()=>{throw t.stack?le.isErrorNoTelemetry(t)?new le(t.message+`

`+t.stack):new Error(t.message+`

`+t.stack):t},0)}}addListener(t){return this.listeners.push(t),()=>{this._removeListener(t)}}emit(t){this.listeners.forEach(r=>{r(t)})}_removeListener(t){this.listeners.splice(this.listeners.indexOf(t),1)}setUnexpectedErrorHandler(t){this.unexpectedErrorHandler=t}getUnexpectedErrorHandler(){return this.unexpectedErrorHandler}onUnexpectedError(t){this.unexpectedErrorHandler(t),this.emit(t)}onUnexpectedExternalError(t){this.unexpectedErrorHandler(t)}},ir=new he;var le=class e extends Error{constructor(t){super(t),this.name="CodeExpectedError"}static fromError(t){if(t instanceof e)return t;let r=new e;return r.message=t.message,r.stack=t.stack,r}static isErrorNoTelemetry(t){return t.name==="CodeExpectedError"}},$=class e extends Error{constructor(t){super(t||"An unexpected bug occurred."),Object.setPrototypeOf(this,e.prototype)}};var y={doesContain:(e,t)=>e.startIndex<=t.startIndex&&t.endIndex<=e.endIndex,ofSyntaxNode:e=>({startIndex:e.startIndex,endIndex:e.endIndex}),compare:(e,t)=>e.startIndex-t.startIndex||t.endIndex-e.endIndex,isEqual:(e,t)=>y.compare(e,t)===0,doIntersect:(e,t)=>{let r=Math.max(e.startIndex,t.startIndex),n=Math.min(e.endIndex,t.endIndex);return r<n},len:e=>e.endIndex-e.startIndex,intersectionSize:(e,t)=>{let r=Math.max(e.startIndex,t.startIndex),n=Math.min(e.endIndex,t.endIndex);return Math.max(n-r,0)},isTreeSitterOffsetRange(e){return typeof e.startIndex=="number"&&typeof e.endIndex=="number"}},D={isEqual(e,t){return e.row===t.row&&e.column===t.column},isBefore(e,t){return e.row<t.row||e.row===t.row&&e.column<t.column},isAfter(e,t){return D.isBefore(t,e)},isBeforeOrEqual(e,t){let r=D.isBefore(e,t),n=D.isEqual(e,t);return!!(r||n)},equals(e,t){return e.column===t.column&&e.row===t.row},isAfterOrEqual(e,t){return D.isBeforeOrEqual(t,e)},ofPoint:e=>({row:e.row,column:e.column})},j={doesContain:(e,t)=>D.isBeforeOrEqual(e.startPosition,t.startPosition)&&D.isAfterOrEqual(e.endPosition,t.endPosition),equals:(e,t)=>D.equals(e.startPosition,t.startPosition)&&D.equals(e.endPosition,t.endPosition),ofSyntaxNode:e=>({startPosition:e.startPosition,endPosition:e.endPosition})},Z={ofSyntaxNode:e=>({type:e.type,startIndex:e.startIndex,endIndex:e.endIndex})},P={ofSyntaxNode:e=>({range:j.ofSyntaxNode(e),startIndex:e.startIndex,text:e.text,endIndex:e.endIndex})},Y=class{constructor(t,r,n,s){this.startIndex=t;this.endIndex=r;this.kind=n;this.children=s;if(t>r)throw new $("startIndex must be less than endIndex");let o=t;for(let a of s){if(a.startIndex<o)throw new $("Invalid child startIndex");if(a.endIndex>r)throw new $("Invalid child endIndex");o=Math.max(a.endIndex,o)}}toString(){let t=[];function r(n,s=""){t.push(`${s}${n.kind} [${n.startIndex}, ${n.endIndex}]`),n.children.forEach(o=>r(o,s+"    "))}return r(this),t.join(`
`)}};var ee=class{constructor(t,r){this.syntaxTreeRoot=r;this.roots=[];this.formTree(t)}formTree(t){t.sort((o,a)=>o.mainBlock.startIndex-a.mainBlock.startIndex||o.mainBlock.endIndex-a.mainBlock.endIndex);let r=[],n=()=>r[r.length-1],s=(o,a)=>o.mainBlock.startIndex===a.mainBlock.startIndex&&o.mainBlock.endIndex===a.mainBlock.endIndex;for(let o of t){let a={info:o,children:[]},_=n();if(!_){this.roots.push(a),r.push(a);continue}if(!s(_.info,o)){for(;_&&!y.doesContain(_.info.mainBlock,o.mainBlock);)r.pop(),_=n();_?_.children.push(a):this.roots.push(a),r.push(a)}}}};var te=class{constructor(t,r){this.prev=null;this.next=null;this.key=t,this.value=r}},K=class{constructor(t=10){if(t<1)throw new Error("Cache size must be at least 1");this._capacity=t,this._cache=new Map,this._head=new te("",null),this._tail=new te("",null),this._head.next=this._tail,this._tail.prev=this._head}_addNode(t){t.prev=this._head,t.next=this._head.next,this._head.next.prev=t,this._head.next=t}_removeNode(t){let r=t.prev,n=t.next;r.next=n,n.prev=r}_moveToHead(t){this._removeNode(t),this._addNode(t)}_popTail(){let t=this._tail.prev;return this._removeNode(t),t}clear(){this._cache.clear(),this._head.next=this._tail,this._tail.prev=this._head}deleteKey(t){let r=this._cache.get(t);if(r)return this._removeNode(r),this._cache.delete(t),r.value}get(t){let r=this._cache.get(t);if(r)return this._moveToHead(r),r.value}keys(){let t=[],r=this._head.next;for(;r!==this._tail;)t.push(r.key),r=r.next;return t}getValues(){let t=[],r=this._head.next;for(;r!==this._tail;)t.push(r.value),r=r.next;return t}put(t,r){let n=this._cache.get(t);if(n)n.value=r,this._moveToHead(n);else if(n=new te(t,r),this._cache.set(t,n),this._addNode(n),this._cache.size>this._capacity){let s=this._popTail();return this._cache.delete(s.key),[s.key,s.value]}}},ue=class{constructor(t){this.actual=new K(t)}dispose(){this.clear()}clear(){let t=this.actual.getValues();for(let r of t)r.dispose();this.actual.clear()}deleteKey(t){let r=this.actual.deleteKey(t);r&&r.dispose()}get(t){return this.actual.get(t)}keys(){return this.actual.keys()}getValues(){return this.actual.getValues()}put(t,r){let n=this.actual.put(t,r);n&&n[1].dispose()}};var re=Tt(require("path")),xt=ce(),me=class{constructor(){this.loadedLanguagesCache=new Map}loadLanguage(t){return this.loadedLanguagesCache.has(t)||this.loadedLanguagesCache.set(t,this._doLoadLanguage(t)),this.loadedLanguagesCache.get(t)}_doLoadLanguage(t){let n=`tree-sitter-${t==="csharp"?"c-sharp":t}.wasm`,s=re.basename(__dirname)==="dist"?re.resolve(__dirname,n):re.resolve(__dirname,"../../../../dist",n);return xt.Language.load(s)}};var Ne=ce(),fe=class e{static{this.INSTANCE=new e}static{this.CACHE_SIZE_PER_LANGUAGE=5}constructor(){this.caches=new Map,this.languageLoader=new me,this._parser=null}get parser(){return this._parser||(this._parser=new Ne),this._parser}async parse(t,r){await Ne.init();let n=this.getParseTreeCache(t),s=n.get(r);if(s)return s.createReference();let o=await this.languageLoader.loadLanguage(t);if(this.parser.setLanguage(o),s=n.get(r),s)return s.createReference();let a=this.parser.parse(r);return s=new ge(a),n.put(r,s),s.createReference()}dispose(){this._parser&&(this.parser.delete(),this._parser=null);for(let t of this.caches.values())t.dispose()}getParseTreeCache(t){let r=this.caches.get(t);return r||(r=new ue(e.CACHE_SIZE_PER_LANGUAGE),this.caches.set(t,r)),r}},ge=class{constructor(t){this._tree=new we(t)}dispose(){this._tree.deref()}createReference(){return new ye(this._tree)}},ye=class{constructor(t){this._parseTree=t;this._parseTree.ref()}get tree(){return this._parseTree.tree}dispose(){this._parseTree.deref()}},we=class{constructor(t){this._tree=t;this._refCount=1}get tree(){if(this._refCount===0)throw new Error("Cannot access disposed RefCountedParseTree");return this._tree}ref(){if(this._refCount===0)throw new Error("Cannot ref disposed RefCountedParseTree");this._refCount++}deref(){if(this._refCount===0)throw new Error("Cannot deref disposed RefCountedParseTree");this._refCount--,this._refCount===0&&this._tree.delete()}};function Ae(){fe.INSTANCE.dispose()}function w(e,t){return fe.INSTANCE.parse(e,t)}var Te=class{constructor(t){this.language=t;this.map=new Map}getQuery(t){return this.map.has(t)||this.map.set(t,this.language.query(t)),this.map.get(t)}},xe=class e{constructor(){this.map=new Map}static{this.INSTANCE=new e}getQuery(t,r){return this.map.has(t)||this.map.set(t,new Te(t)),this.map.get(t).getQuery(r)}};function R(e,t){let r=[];for(let n of e){let o=xe.INSTANCE.getQuery(t.tree.getLanguage(),n).matches(t);r.push(...o)}return r}function ne(e,t){switch(t){case"python":case"csharp":return e.children.find(r=>r.type.match(/identifier/))?.text;case"go":{let r=e.children.find(s=>s.type.match(/identifier/));return r?r.text:e.children.find(s=>s.type.match(/spec/))?.children.find(s=>s.type.match(/identifier/))?.text}case"javascript":case"javascriptreact":case"typescript":case"typescriptreact":case"cpp":{let r=e.children.find(s=>s.type.match(/declarator/));return r?r.children.find(s=>s.type.match(/identifier/))?.text:e.children.find(s=>s.type.match(/identifier/))?.text}case"java":return e.children.find(n=>n.type==="identifier")?.text;case"ruby":return e.children.find(r=>r.type.match(/constant|identifier/))?.text;default:return e.children.find(r=>r.type.match(/identifier/))?.text}}function se(e,t){switch(t){case"typescript":case"tsx":case"javascript":return e.type.match(/definition|declaration|declarator|export_statement/);case"go":return e.type.match(/definition|declaration|declarator|var_spec/);case"cpp":return e.type.match(/definition|declaration|class_specifier/);case"ruby":return e.type.match(/module|class|method|assignment/);default:return e.type.match(/definition|declaration|declarator/)}}function Q(e,t,r,n=se){let s=[e.rootNode],o=[];for(;;){let a=s.map(_=>[_,y.intersectionSize(_,t)]).filter(([_,d])=>d>0).sort(([_,d],[l,c])=>c-d);if(a.length===0)return o.length===0?void 0:Re(o,([_,d],[l,c])=>d-c)[0];{let _=a.map(([d,l])=>{let c=y.len(d),m=Math.abs(y.len(t)-l),g=(l-m)/c;return[d,g]});o.push(..._.filter(([d,l])=>n(d,r))),s=[],s.push(..._.flatMap(([d,l])=>d.children))}}}var h=(()=>{function e(t,...r){return t.length===1?t[0]:t.reduce((n,s,o)=>`${n}${s}${r[o]||""}`,"")}return{typescript:e,javascript:e,python:e,go:e,ruby:e,csharp:e,cpp:e,java:e,rust:e}})();function k(e,t){return Object.fromEntries(e.map(r=>[r,t]))}var bt={javascript:[],typescript:[],tsx:[],python:[],csharp:[],go:[],java:[],ruby:[],cpp:[],rust:[]};function L(e){for(let t in e){let r=e[t];bt[t].push(...r)}return e}var Ce=L({...k(["javascript","typescript","tsx"],[`[
			(call_expression
				function: (identifier) @identifier)
			(call_expression
				function: (member_expression
					(property_identifier) @identifier))
		] @call_expression`]),python:[`[
			(call
				function: (identifier) @identifier)
			(call
				function: (attribute
					attribute: (identifier) @identifier))
		] @call_expression`],csharp:[`[
			(invocation_expression
				function: (identifier) @identifier)
			(invocation_expression
				function: (member_access_expression
					name: (identifier) @identifier))
		] @call_expression`],go:[`[
			(call_expression
				((selector_expression
					(field_identifier) @identifier)))
			(call_expression
				(identifier) @identifier)
		] @call_expression`],java:[`[
			(method_invocation
				name: (identifier) @identifier)
		] @call_expression`],ruby:[`[
			(call (identifier) @identifier
				(#not-match? @identifier "new|send|public_send|method"))
			(call
				receiver: (identifier)
				method: (identifier) @method
				(#match? @method "^(send|public_send|method)")
				arguments: (argument_list
					(simple_symbol) @symbol))
		] @call_expression`],cpp:[`[
			(function_declarator
				(identifier) @identifier)
			(function_declarator
				(field_identifier) @identifier)
			(call_expression (identifier) @identifier)
			(call_expression
				(field_expression
					field: (field_identifier) @identifier))
			(call_expression
				(call_expression
					(primitive_type)
					(argument_list
						(pointer_expression
						(identifier) @identifier))))
		] @call_expression`],rust:[`[
			(call_expression (identifier) @identifier)
			(call_expression (field_expression (identifier) (field_identifier) @identifier))
			(call_expression (scoped_identifier (identifier) (identifier) @identifier (#not-match? @identifier "new")))
		] @call_expression`]}),Pe=L({...k(["javascript","typescript","tsx"],["(class_declaration) @class_declaration"]),java:["(class_declaration) @class_declaration"],csharp:["(class_declaration) @class_declaration"],python:["(class_definition) @class_declaration"],cpp:["(class_specifier) @class_declaration"],ruby:["(class) @class_declaration"],go:[`(type_declaration
			(type_spec
				(type_identifier) @type_identifier)) @class_declaration`],rust:["(impl_item (type_identifier) @type_identifier) @class_declaration"]}),Fe=L({typescript:[`[
			(interface_declaration)
			(type_alias_declaration)
		] @type_declaration`],csharp:[`(interface_declaration
			(identifier) @type_identifier) @type_declaration`],cpp:[`[
			(struct_specifier
				(type_identifier) @type_identifier)
			(union_specifier
				(type_identifier) @type_identifier)
			(enum_specifier
				(type_identifier) @type_identifier)
		] @type_declaration`],java:[`(interface_declaration
			(identifier) @type_identifier) @type_declaration`],go:[`(type_declaration
			(type_spec
				(type_identifier) @type_identifier)) @type_declaration`],ruby:["((constant) @type_identifier) @type_declaration"],python:[`(class_definition
			(identifier) @type_identifier) @type_declaration`]}),Oe=L({typescript:["(type_identifier) @type_identifier"],go:["(type_identifier) @type_identifier"],ruby:["(constant) @type_identifier"],csharp:[`[
			(base_list
				(identifier) @type_identifier)
			(variable_declaration
				(identifier) @type_identifier)
		]`],cpp:["(type_identifier) @type_identifier"],java:["(type_identifier) @type_identifier"],python:[`[
			(type (identifier) @type_identifier)
			(argument_list
				(identifier) @type_identifier)
		]`]}),ke=L({...k(["javascript","typescript","tsx"],[`(new_expression
			constructor: (identifier) @new_expression)`]),python:[`(call
			function: (identifier) @new_expression)`],csharp:[`(object_creation_expression
			(identifier) @new_expression)`],java:[`(object_creation_expression
			(type_identifier) @new_expression)`],cpp:[`[
			(declaration
				(type_identifier) @new_expression)
			(class_specifier
				(type_identifier) @new_expression)
		]`],go:["(composite_literal (type_identifier) @new_expression)"],ruby:[`((call
			receiver: ((constant) @new_expression)
			method: (identifier) @method)
				(#eq? @method "new"))`],rust:[`(call_expression
			(scoped_identifier
				(identifier) @new_expression
				(identifier) @identifier
				(#eq? @identifier "new")))`]}),Le=L({python:[`[
			(function_definition
				name: (identifier) @identifier
				body: (block
						(expression_statement (string))? @docstring) @body)
			(assignment
				left: (identifier) @identifier
				right: (lambda) @body)
		] @function`,'(ERROR ("def" (identifier) (parameters))) @function'],...k(["javascript","typescript","tsx"],[`[
			(function_expression
				name: (identifier)? @identifier
				body: (statement_block) @body)
			(function_declaration
				name: (identifier)? @identifier
				body: (statement_block) @body)
			(generator_function
				name: (identifier)? @identifier
				body: (statement_block) @body)
			(generator_function_declaration
				name: (identifier)? @identifier
				body: (statement_block) @body)
			(method_definition
				name: (property_identifier)? @identifier
				body: (statement_block) @body)
			(arrow_function
				body: (statement_block) @body)
		] @function`]),go:[`[
			(function_declaration
				name: (identifier) @identifier
				body: (block) @body)
			(method_declaration
				name: (field_identifier) @identifier
				body: (block) @body)
		] @function`],ruby:[`[
			(method
				name: (_) @identifier
				parameters: (method_parameters)? @params
				[(_)+ "end"] @body)
			(singleton_method
				name: (_) @identifier
				parameters: (method_parameters)? @params
				[(_)+ "end"] @body)
		] @function`],csharp:[`[
			(constructor_declaration
				(identifier) @identifier
				(block) @body)
			(destructor_declaration
				(identifier) @identifier
				(block) @body)
			(operator_declaration
				(block) @body)
			(method_declaration
				(identifier) @identifier
				(block) @body)
			(local_function_statement
				(identifier) @identifier
				(block) @body)
		] @function`],cpp:[`[
			(function_definition
				(_
					(identifier) @identifier)
					(compound_statement) @body)
			(function_definition
				(function_declarator
					(qualified_identifier
						(identifier) @identifier))
					(compound_statement) @body)
		] @function`],java:[`[
			(constructor_declaration
				name: (identifier) @identifier
				body: (constructor_body) @body)
			(method_declaration
				name: (_) @identifier
				body: (block) @body)
			(lambda_expression
				body: (block) @body)
		] @function`],rust:[`[
			(function_item (identifier) @identifier)
			(let_declaration (identifier) @identifier)
		] @function`]}),Mr=L({javascript:[h.javascript`((comment) @comment
			(#match? @comment "^\\\\/\\\\*\\\\*")) @docComment`],...k(["typescript","tsx"],[h.typescript`((comment) @comment
			(#match? @comment "^\\\\/\\\\*\\\\*")) @docComment`]),java:[h.java`((block_comment) @block_comment
			(#match? @block_comment "^\\\\/\\\\*\\\\*")) @docComment`],cpp:[h.cpp`((comment) @comment
			(#match? @comment "^\\\\/\\\\*\\\\*")) @docComment`],csharp:[h.csharp`(
			((comment) @c
				(#match? @c "^\\\\/\\\\/\\\\/"))+
		) @docComment`],rust:[h.rust`((line_comment) @comment
			(#match? @comment "^\/\/\/|^\/\/!"))+ @docComment`],go:[h.go`((comment)+) @docComment`],ruby:[h.ruby`((comment)+) @docComment`],python:[`(expression_statement
			(string) @docComment)`]}),Ee=L({javascript:[h.javascript`[
			(function_declaration
				(identifier) @function.identifier
			) @function

			(generator_function_declaration
				name: (identifier) @generator_function.identifier
			) @generator_function

			(class_declaration
				name: (identifier) @class.identifier ;; note: (type_identifier) in typescript
				body: (class_body
							(method_definition
								name: (property_identifier) @method.identifier
							) @method
						)
			) @class
		]`],...k(["typescript","tsx"],[h.typescript`[
				(function_declaration
					(identifier) @function.identifier
				) @function

				(generator_function_declaration
					name: (identifier) @generator_function.identifier
				) @generator_function

				(class_declaration
					name: (type_identifier) @class.identifier
					body: (class_body
								(method_definition
									(accessibility_modifier)? @method.accessibility_modifier
									name: (property_identifier) @method.identifier
									(#not-eq? @method.accessibility_modifier "private")
								) @method
							)
				) @class
			]`]),python:[h.python`[
				(function_definition
					name: (identifier) @function.identifier
				) @function
			]`],go:[h.go`[
				(function_declaration
					name: (identifier) @function.identifier
				) @function

				(method_declaration
					name: (field_identifier) @method.identifier
				) @method
			]`],ruby:[h.ruby`[
				(method
					name: (identifier) @method.identifier
				) @method

				(singleton_method
					name: (_) @singleton_method.identifier
				) @singleton_method
			]`],csharp:[h.csharp`[
				(constructor_declaration
					(identifier) @constructor.identifier
				) @constructor

				(destructor_declaration
					(identifier) @destructor.identifier
				) @destructor

				(method_declaration
					(identifier) @method.identifier
				) @method

				(local_function_statement
					(identifier) @local_function.identifier
				) @local_function
			]`],cpp:[h.cpp`[
				(function_definition
					(_
						(identifier) @identifier)
				) @function
			]`],java:[h.java`(class_declaration
			name: (_) @class.identifier
			body: (_
						[
							(constructor_declaration
								(modifiers)? @constructor.modifiers
								(#not-eq? @constructor.modifiers "private")
								name: (identifier) @constructor.identifier
							) @constructor

							(method_declaration
								(modifiers)? @method.modifiers
								(#not-eq? @method.modifiers "private")
								name: (identifier) @method.identifier
							) @method
						]
					)
		) @class`],rust:[h.rust`[
				(function_item
					(identifier) @function.identifier
				) @function
			]`]}),Ue=L({javascript:[h.javascript`[
			(identifier) @symbol
			(property_identifier) @symbol
			(private_property_identifier) @symbol
		]`],...k(["typescript","tsx"],[h.typescript`[
			(identifier) @symbol
			(type_identifier) @symbol
			(property_identifier) @symbol
			(private_property_identifier) @symbol
		]`]),cpp:[h.cpp`[
			(identifier) @symbol
			(type_identifier) @symbol
		]`],csharp:[h.csharp`[
			(identifier) @symbol
		]`],go:[h.go`[
			(identifier) @symbol
		]`],java:[h.java`[
			(identifier) @symbol
		]`],python:[h.python`[
			(identifier) @symbol
		]`],ruby:[h.ruby`[
			(identifier) @symbol
		]`],rust:[h.rust`[
			(identifier) @symbol
		]`]}),De=L({typescript:[h.typescript`
			[
				(comment) @comment ;; split into multiple comment kinds?

				(declaration) @declaration

				;; class declaration related
				(public_field_definition) @public_field_definition
				(method_definition) @method_definition
				(class_declaration (_ (method_signature) @method_signature))
				(abstract_method_signature) @abstract_method_signature

				;; enum declaration related
				(enum_assignment) @enum_assignment

				;; interface declaration related
				(interface_declaration (_ (method_signature) @method_signature))
				(interface_declaration (_ (property_signature) @property_signature))

				;; statements

				(import_statement) @import_statement
				(export_statement) @export_statement

				(expression_statement) @expression_statement

				(for_in_statement) @for_in_statement
				;; exclude any children found in the for loop condition
				(for_statement condition: (_) @for_statement.exclude_captures ) @for_statement
				(break_statement) @break_statement
				(continue_statement) @continue_statement
				(do_statement) @do_statement
				(if_statement) @if_statement
				(if_statement
					consequence: [
						(expression_statement)
						(if_statement)
					] @if_statement.exclude_captures)
				(else_clause
					[
						(expression_statement)
						(if_statement) ; for if-else chains
					] @else_clause.exclude_captures)
				(switch_statement) @switch_statement
				(switch_case) @switch_case
				(try_statement) @try_statement
				(throw_statement) @throw_statement
				(debugger_statement) @debugger_statement
				(return_statement) @return_statement
			]
		`],tsx:[h.typescript`
			[
				(comment) @comment ;; split into multiple comment kinds?

				(declaration) @declaration

				;; class declaration related
				(public_field_definition) @public_field_definition
				(method_definition) @method_definition
				(class_declaration (_ (method_signature) @method_signature))
				(abstract_method_signature) @abstract_method_signature

				;; enum declaration related
				(enum_assignment) @enum_assignment

				;; interface declaration related
				(interface_declaration (_ (method_signature) @method_signature))
				(interface_declaration (_ (property_signature) @property_signature))

				;; statements

				(import_statement) @import_statement
				(export_statement) @export_statement

				(expression_statement) @expression_statement

				(for_in_statement) @for_in_statement
				;; exclude any children found in the for loop condition
				(for_statement condition: (_) @for_statement.exclude_captures ) @for_statement
				(break_statement) @break_statement
				(continue_statement) @continue_statement
				(do_statement) @do_statement
				(if_statement) @if_statement
				(if_statement
					consequence: [
						(expression_statement)
						(if_statement)
					] @if_statement.exclude_captures)
				(else_clause
					[
						(expression_statement)
						(if_statement) ; for if-else chains
					] @else_clause.exclude_captures)
				(switch_statement) @switch_statement
				(switch_case) @switch_case
				(try_statement) @try_statement
				(throw_statement) @throw_statement
				(debugger_statement) @debugger_statement
				(return_statement) @return_statement

				;; jsx
				(jsx_element) @jsx_element
				(jsx_element (_ (jsx_expression) @jsx_expression))
			]
		`],python:[h.python`
			[
				(comment) @comment

				;; simple statements
				(assert_statement) @assert_statement
				(break_statement) @break_statement
				(continue_statement) @continue_statement
				(delete_statement) @delete_statement
				(exec_statement) @exec_statement
				(expression_statement) @expression_statement
				(future_import_statement) @future_import_statement
				(global_statement) @global_statement
				(import_from_statement) @import_from_statement
				(import_statement) @import_statement
				(nonlocal_statement) @nonlocal_statement
				(pass_statement) @pass_statement
				(print_statement) @print_statement
				(raise_statement) @raise_statement
				(return_statement) @return_statement
				(type_alias_statement) @type_alias_statement


				;; compound statements

				(class_definition) @class_definition
				(decorated_definition) @decorated_definition
				(for_statement) @for_statement
				(function_definition) @function_definition
				(if_statement) @if_statement
				(try_statement) @try_statement
				(while_statement) @while_statement
				(with_statement) @with_statement


				;; expressions

				(expression_list) @expression_list
				(expression_statement) @expression_statement
			]
		`],javascript:[h.javascript`
			[
				(comment) @comment ;; split into multiple comment kinds?

				(declaration) @declaration

				;; class declaration related

				(field_definition) @field_definition
				(method_definition) @method_definition

				;; statements

				(import_statement) @import_statement
				(export_statement) @export_statement

				(expression_statement) @expression_statement

				(for_in_statement) @for_in_statement
				;; exclude any children found in the for loop condition
				(for_statement condition: (_) @for_statement.exclude_captures ) @for_statement
				(break_statement) @break_statement
				(continue_statement) @continue_statement
				(do_statement) @do_statement
				(if_statement) @if_statement
				(switch_statement) @switch_statement
				(switch_case) @switch_case
				(try_statement) @try_statement
				(throw_statement) @throw_statement
				(debugger_statement) @debugger_statement
				(return_statement) @return_statement
			]`],go:[h.go`
		[
			(_statement) @statement
			(function_declaration) @function_declaration
			(import_declaration) @import_declaration
			(method_declaration) @method_declaration
			(package_clause) @package_clause

			(if_statement
				initializer: (_) @for_statement.exclude_captures) @for_statement

			(expression_case) @expression_case ;; e.g., case 0:
		]
		`],ruby:[h.ruby`
			[
				(comment) @comment

				(assignment) @assignment

				(if) @if

				(call) @call

				(case) @case

				(when) @when

				(while) @while

				(for) @for

				(method) @method

				(class) @class

				(module) @module

				(begin) @begin
			]
		`],csharp:[h.csharp`
			[
				(comment) @comment

				(class_declaration) @class_declaration
				(constructor_declaration) @constructor_declaration
				(method_declaration) @method_declaration
				(delegate_declaration) @delegate_declaration
				(enum_declaration) @enum_declaration
				(extern_alias_directive) @extern_alias_directive
				(file_scoped_namespace_declaration) @file_scoped_namespace_declaration
				(global_attribute) @global_attribute
				(global_statement) @global_statement
				(interface_declaration) @interface_declaration
				(namespace_declaration) @namespace_declaration
				(record_declaration) @record_declaration
				(struct_declaration) @struct_declaration
				(using_directive) @using_directive

				(local_declaration_statement) @local_declaration_statement
				(expression_statement) @expression_statement
				(for_statement) @for_statement
				(foreach_statement) @foreach_statement
				(continue_statement) @continue_statement
				(break_statement) @break_statement
				(throw_statement) @throw_statement
				(return_statement) @return_statement
				(try_statement) @try_statement
			]
		`],cpp:[h.cpp`
			[
				(declaration) @declaration

				(expression_statement) @expression_statement

				(comment) @comment

				(preproc_include) @preproc_include

				(namespace_definition) @namespace_definition

				(enum_specifier) @enum_specifier

				(struct_specifier) @struct_specifier

				(template_declaration) @template_declaration

				(function_definition) @function_definition

				(return_statement) @return_statement

				(class_specifier) @class_specifier

				(try_statement) @try_statement

				(throw_statement) @throw_statement

				(for_statement) @for_statement
				(for_statement
					initializer:(_) @for_statement.exclude_captures) @for_statement

				(for_range_loop) @for_range_loop
			]
		`],java:[h.java`
		[
			(statement) @statement ;; @ulugbekna: this includes (declaration); but somehow it can't capture inner classes

			(line_comment) @line_comment
			(block_comment) @block_comment

			(for_statement
				init: (_) @for_statement.exclude_captures)

			(block) @block.exclude_captures

			(field_declaration) @field_declaration
		]
		`],rust:[]}),Be={...k(["typescript","tsx"],["program","interface_declaration","class_declaration","function_declaration","function_expression","type_alias_declaration","method_definition"]),javascript:["program","class_declaration","function_declaration","function_expression","method_definition"],java:["program","class_declaration","interface_declaration","method_declaration"],cpp:["translation_unit","class_specifier","function_definition"],csharp:["compilation_unit","class_declaration","interface_declaration","method_declaration"],python:["module","class_definition","function_definition"],go:["source_file","type_declaration","function_declaration","method_declaration"],ruby:["program","method","class","method"],rust:["source_file","function_item","impl_item","let_declaration"]},We=L({typescript:[q("typescript")],tsx:[q("tsx")],javascript:[q("javascript")],java:[q("java")],cpp:[q("cpp")],csharp:[q("csharp")],python:[q("python")],go:[q("go")],ruby:[q("ruby")],rust:[q("rust")]}),qe={...k(["typescript","tsx","javascript"],["for_in_statement","for_statement","if_statement","while_statement","do_statement","try_statement","switch_statement"]),java:["for_statement","enhanced_for_statement","if_statement","while_statement","do_statement","try_statement","switch_expression"],cpp:["for_statement","for_range_loop","if_statement","while_statement","do_statement","try_statement","switch_statement"],csharp:["for_statement","for_each_statement","if_statement","while_statement","do_statement","try_statement","switch_expression"],python:["for_statement","if_statement","while_statement","try_statement"],go:["for_statement","if_statement","type_switch_statement"],ruby:["while","for","if","case"],rust:["for_statement","if_statement","while_statement","loop_statement","match_expression"]},Et={...k(["typescript","tsx"],["lexical_declaration","expression_statement","public_field_definition"]),javascript:["call_expression","expression_statement","variable_declaration","public_field_definition"],java:["expression_statement","local_variable_declaration","field_declaration"],cpp:["field_declaration","expression_statement","declaration"],csharp:["field_declaration","expression_statement"],python:["expression_statement"],go:["short_var_declaration","call_expression"],ruby:["call","assignment"],rust:["expression_statement","let_declaration","use_declaration","assignment_expression","macro_definition","extern_crate_declaration"]},vt={...k(["typescript","tsx"],["class_declaration","function_declaration","generator_function_declaration","interface_declaration","internal_module","method_definition","abstract_class_declaration","abstract_method_signature","enum_declaration"]),javascript:["class_declaration","function_declaration","generator_function_declaration","method_definition"],java:["class_declaration","constructor_declaration","enum_declaration","interface_declaration","method_declaration","module_declaration"],cpp:["class_specifier","function_definition","namespace_definition","struct_specifier"],csharp:["class_declaration","constructor_declaration","destructor_declaration","enum_declaration","interface_declaration","method_declaration","namespace_declaration","struct_declaration"],python:["function_definition","class_definition"],go:["function_declaration","method_declaration"],ruby:["class","method","module"],rust:["function_item","impl_item","mod_item","struct_item","trait_item","union_item"]},Ve=L({typescript:[V("typescript")],tsx:[V("tsx")],javascript:[V("javascript")],java:[V("java")],cpp:[V("cpp")],csharp:[V("csharp")],python:[V("python")],go:[V("go")],rust:[V("rust")],ruby:[V("ruby")]});function q(e){return Be[e].map(t=>`(${t}) @scope`).join(`
`)}function V(e){return`[
		${vt[e].map(r=>`(${r})`).join(`
`)}
	] @definition`}function oe(e,t){return Be[e].includes(t.type)||qe[e].includes(t.type)}function He(e,t){return qe[e].includes(t.type)}function ve(e,t){return Et[e].includes(t.type)}var Ge={...k(["typescript","tsx"],[h.typescript`[
			(expression_statement
				(call_expression
					function: (identifier) @fn
					(#any-of? @fn "test" "it")
				)
			) @test
		]`]),javascript:[h.javascript`[
			(call_expression
				function: (identifier) @fn
				(#any-of? @fn "test" "it")
			) @test
		]`],python:[h.python`[
			(function_definition
				name: (identifier) @fn
				(#match? @fn "^test_")
			) @test
		]`],java:[h.java`[
			(method_declaration
				name: (identifier) @fn
				(#match? @fn "^test")
			) @test
		]`],go:[h.go`[
			(function_declaration
				name: (identifier) @fn
				(#match? @fn "^Test")
			) @test
		]`],ruby:[],csharp:[],cpp:[],rust:[]};var Se=class{constructor(){this._cache=new K(5)}setCacheSize(t){this._cache=new K(t)}async getStructure(t,r){let n=`${t}:${r}`,s=this._cache.get(n);return s||(s=await this._getStructure(t,r),this._cache.put(n,s)),s}async _getStructure(t,r){let n=De[t];if(n.length===0)return;let s=await w(t,r);try{let o=R(n,s.tree.rootNode).flatMap(l=>l.captures).sort((l,c)=>y.compare(l.node,c.node)),a=[];for(let l of o)l.name.endsWith(".exclude_captures")&&a.push(y.ofSyntaxNode(l.node));let _=new Y(0,r.length,"root",[]),d=[_];for(let l=0;l<o.length;++l){let m=o[l].node;if(a.some(T=>y.isEqual(T,m)))continue;let p;do p=d.pop();while(p&&!y.doesContain(p,m));if(new Set(["export_statement","ambient_declaration"]).has(p.kind))p.kind=m.type,d.push(p);else{let T=m.type;(t==="typescript"||t==="tsx"||t==="javascript")&&T==="method_definition"&&m.namedChildren.some(x=>x.type==="property_identifier"&&x.text==="constructor")&&(T="constructor");let f=m.startIndex,M=m.previousSibling;if(M!==null){let F=r.substring(M.endIndex,m.startIndex).indexOf(`
`);F===-1?f=M.endIndex:f=M.endIndex+F+1}let v=m.endIndex,u=m.nextSibling;if(t==="typescript"&&u!==null&&(u.type===";"||u.type===",")&&(u=u.nextSibling),u!==null){let F=r.substring(m.endIndex,u.startIndex).indexOf(`
`);F!==-1&&(v=m.endIndex+F+1)}let E=new Y(f,v,T,[]);p.children.push(E),d.push(p,E)}}return _}catch(o){console.error(o instanceof Error?o:new Error(o))}finally{s.dispose()}}},je=new Se;async function Ze(e,t,r){let n=await w(e,t);try{let o=r.startIndex===r.endIndex?void 0:Q(n.tree,r,e);if(o)return{nodeIdentifier:ne(o,e),nodeToDocument:Z.ofSyntaxNode(o),nodeSelectionBy:"matchingSelection"};let _=n.tree.rootNode.descendantForIndex(r.startIndex,r.endIndex),d=0;for(;!se(_,e)&&_.parent!==null;)_=_.parent,++d;return{nodeIdentifier:ne(_,e),nodeToDocument:Z.ofSyntaxNode(_),nodeSelectionBy:"expanding"}}finally{n.dispose()}}async function $e(e,t,r){let n=await w(e,t);try{let s=n.tree.rootNode.descendantForIndex(r.startIndex,r.endIndex);if(s.type.match(/identifier/)&&(s.parent===null||se(s.parent,e))){let o=s.parent,a=o===null?void 0:{startIndex:o.startIndex,endIndex:o.endIndex};return{identifier:s.text,nodeRange:a}}}finally{n.dispose()}}function St(e,t,r=0,n=e.length){let s=r,o=n;for(;s<o;){let a=Math.floor((s+o)/2);t(e[a])?s=a+1:o=a}return s-1}var Qe=class e{constructor(t){this._array=t;this._findLastMonotonousLastIdx=0}static{this.assertInvariants=!1}findLastMonotonous(t){if(e.assertInvariants){if(this._prevFindLastPredicate){for(let n of this._array)if(this._prevFindLastPredicate(n)&&!t(n))throw new Error("MonotonousArray: current predicate must be weaker than (or equal to) the previous predicate.")}this._prevFindLastPredicate=t}let r=St(this._array,t,this._findLastMonotonousLastIdx);return this._findLastMonotonousLastIdx=r+1,r===-1?void 0:this._array[r]}};function ze(e){let t=new Set;return r=>{let n=e(r);return t.has(n)?!1:(t.add(n),!0)}}var Ke;(_=>{function e(d){return d<0}_.isLessThan=e;function t(d){return d<=0}_.isLessThanOrEqual=t;function r(d){return d>0}_.isGreaterThan=r;function n(d){return d===0}_.isNeitherLessOrGreaterThan=n,_.greaterThan=1,_.lessThan=-1,_.neitherLessOrGreaterThan=0})(Ke||={});var Je=class e{constructor(t){this.iterate=t}static{this.empty=new e(t=>{})}forEach(t){this.iterate(r=>(t(r),!0))}toArray(){let t=[];return this.iterate(r=>(t.push(r),!0)),t}filter(t){return new e(r=>this.iterate(n=>t(n)?r(n):!0))}map(t){return new e(r=>this.iterate(n=>r(t(n))))}some(t){let r=!1;return this.iterate(n=>(r=t(n),!r)),r}findFirst(t){let r;return this.iterate(n=>t(n)?(r=n,!1):!0),r}findLast(t){let r;return this.iterate(n=>(t(n)&&(r=n),!0)),r}findLastMaxBy(t){let r,n=!0;return this.iterate(s=>((n||Ke.isGreaterThan(t(s,r)))&&(n=!1,r=s),!0)),r}};function ie(e,t){if(!e)throw new Error(t?`Unexpected type, expected '${t}'`:"Unexpected type")}async function Xe(e,t,r){let n=await w(e,t);try{let s=R(Ee[e],n.tree.rootNode).flatMap(({captures:_})=>_),o=new Map;for(let _ of s){let[d,l]=_.name.split(".");if(l!=="identifier")continue;let c=o.get(d)||[];c.push(_),o.set(d,c)}let a=null;for(let _ of s){let[d,l]=_.name.split(".");if(l!==void 0||!y.doesContain(_.node,r)||a!==null&&y.len(a.node)<y.len(_.node))continue;let c=o.get(d);ie(c!==void 0,`must have seen identifier for symbol kind '${d}' (lang: ${e})`);let m=c.find(p=>y.doesContain(_.node,p.node));ie(m!==void 0,`must have seen identifier for symbol '${d}' (lang: ${e})`),a={identifier:{name:m.node.text,range:y.ofSyntaxNode(m.node)},node:Z.ofSyntaxNode(_.node)}}return a}catch(s){return console.error("getTestableNode: Unexpected error",s),null}finally{n.dispose()}}async function Ye(e,t){let r=await w(e,t);try{let n=R(Ee[e],r.tree.rootNode).flatMap(({captures:a})=>a).filter(ze(a=>[a.node.startIndex,a.node.endIndex].toString())),s=new Map;for(let a of n){let[_,d]=a.name.split(".");if(d!=="identifier")continue;let l=s.get(_)||[];l.push(a),s.set(_,l)}let o=[];for(let a of n){if(a.name.includes("."))continue;let _=a.name,d=s.get(_);ie(d!==void 0,`must have seen identifier for symbol kind '${_}' (lang: ${e})`);let l=d.find(c=>y.doesContain(a.node,c.node));ie(l!==void 0,`must have seen identifier for symbol '${_}' (lang: ${e})`),o.push({identifier:{name:l.node.text,range:y.ofSyntaxNode(l.node)},node:Z.ofSyntaxNode(a.node)})}return o}catch(n){return console.error("getTestableNodes: Unexpected error",n),null}finally{r.dispose()}}async function et(e,t){let r=await w(e,t);try{let s=R(Ge[e],r.tree.rootNode).flatMap(a=>a.captures).sort((a,_)=>a.node.endIndex-_.node.endIndex).filter(a=>a.name==="test");if(s.length===0)return null;let o=s[s.length-1].node;return{startIndex:o.startIndex,endIndex:o.endIndex}}finally{r.dispose()}}var Sn=ce();function It(e,t){let r=We[e];return R(r,t)}function nt(e,t){let r=Le[e];return R(r,t)}function Mt(e,t){let r=Ce[e];return r?R(r,t):[]}function Rt(e,t){let r=Pe[e];return r?R(r,t):[]}function Nt(e,t){let r=Fe[e];return r?R(r,t):[]}function At(e,t){let r=Oe[e];return r?R(r,t):[]}function Ct(e,t){let r=ke[e];return r?R(r,t):[]}function st(e,t){let r=Ve[e];return R(r,t)}async function Pt(e,t,r){let n=await w(e,t);try{return Mt(e,n.tree.rootNode).reduce((a,_)=>{let d=_.captures.find(l=>l.name==="call_expression").node;if(y.doIntersect(r,d)){let l,c;e==="ruby"&&(c=_.captures.find(m=>m.name==="symbol")?.node,l=c?.text?.slice(1)),c??=_.captures.find(m=>m.name==="identifier")?.node,l??=c?.text,a.push({identifier:l??"",text:d.text,startIndex:(c??d).startIndex,endIndex:(c??d).endIndex})}return a},[])}finally{n.dispose()}}async function Ft(e,t){let r=await w(e,t);try{return nt(e,r.tree.rootNode).map(o=>{let a=o.captures.find(d=>d.name==="function").node;return{identifier:o.captures.find(d=>d.name==="identifier")?.node.text??"",text:a.text,startIndex:a.startIndex,endIndex:a.endIndex}})}finally{r.dispose()}}async function Ot(e,t){let r=await w(e,t);try{return Rt(e,r.tree.rootNode).map(o=>{let a=o.captures.find(d=>d.name==="class_declaration").node;return{identifier:a?.children.find(d=>d.type==="type_identifier"||d.type==="identifier"||d.type==="constant")?.text??"",text:a.text,startIndex:a.startIndex,endIndex:a.endIndex}})}finally{r.dispose()}}async function kt(e,t){let r=await w(e,t);try{return Nt(e,r.tree.rootNode).map(o=>{let a=o.captures.find(d=>d.name==="type_declaration").node,_=o.captures.find(d=>d.name==="type_identifier")?.node.text;return _||(_=a?.children.find(d=>d.type==="type_identifier")?.text),{identifier:_??"",text:a.text,startIndex:a.startIndex,endIndex:a.endIndex}})}finally{r.dispose()}}async function Lt(e,t,r){let n=await w(e,t);try{return At(e,n.tree.rootNode).reduce((a,_)=>{let d=_.captures.find(l=>l.name==="type_identifier").node;return y.doIntersect(r,d)&&a.push({identifier:d.text,text:d.text,startIndex:d.startIndex,endIndex:d.endIndex}),a},[])}finally{n.dispose()}}async function Ut(e,t,r){let n=await w(e,t);try{return Ct(e,n.tree.rootNode).reduce((a,_)=>{let d=_.captures.find(l=>l.name==="new_expression").node;return y.doIntersect(r,d)&&a.push({identifier:d.text,text:d.text,startIndex:d.startIndex,endIndex:d.endIndex}),a},[])}finally{n.dispose()}}async function Dt(e,t,r){let n=await w(e,t);try{let s=Ue[e];return R(s,n.tree.rootNode).reduce((_,d)=>{let l=d.captures.find(c=>c.name==="symbol").node;return y.doIntersect(r,l)&&_.push({identifier:l.text,text:l.text,startIndex:l.startIndex,endIndex:l.endIndex}),_},[])}finally{n.dispose()}}async function Bt(e,t){let r=await w(e,t);try{let n=st(e,r.tree.rootNode);return $t(e,n,r.tree.rootNode)}finally{r.dispose()}}async function Wt(e,t){let r=await w(e,t);try{let n=st(e,r.tree.rootNode);return _t(e,n,r.tree.rootNode)}finally{r.dispose()}}async function qt(e,t){let r=await w(e,t);try{return nt(e,r.tree.rootNode).map(o=>{let a=o.captures.find(_=>_.name==="body").node;return{startIndex:a.startIndex,endIndex:a.endIndex}})}finally{r.dispose()}}async function Vt(e,t,r){let n=await w(e,t);try{let s=It(e,n.tree.rootNode),o;for(let a of s){let _=a.captures[0].node,d=j.ofSyntaxNode(_);if(j.doesContain(d,r)&&(o=_),D.isBefore(r.endPosition,d.startPosition))break}if(o)return j.ofSyntaxNode(o);throw new Error("No parent node found")}finally{n.dispose()}}async function Ht(e,t,r,n){let s=await w(e,t);try{let o=s.tree.rootNode.descendantForPosition(r.startPosition,r.endPosition),a={startPosition:o.startPosition,endPosition:o.endPosition},_=it(e,o,n,r,!0);return j.equals(a,_)?ot(e,o):_}finally{s.dispose()}}function ot(e,t){let r=t.parent,n={startPosition:t.startPosition,endPosition:t.endPosition};if(oe(e,t)||!r)return n;let{filteredRanges:s,indexOfInterest:o}=at(e,r.children,n,!1);if(o-1>=0&&o+1<=s.length-1){let a=s[o-1],_=s[o+1];return{startPosition:a.startPosition,endPosition:_.endPosition}}return ot(e,r)}function it(e,t,r,n,s){let o=t.children;if(t.endPosition.row-t.startPosition.row+1<=r){let _=oe(e,t)?{startPosition:t.startPosition,endPosition:t.endPosition}:rt(e,o,r,n,s),d=t.parent;return d?it(e,d,r,_,!1):_}return rt(e,o,r,n,s)}function tt(e,t){return t.endPosition.row-e.startPosition.row+1}function rt(e,t,r,n,s){if(t.length===0)return n;let{filteredRanges:o,indexOfInterest:a}=at(e,t,n,s),_=0,d=o.length-1,l=o[_],c=o[d];for(;tt(l,c)>r&&_!==d;)a-_<d-a?(d--,c=o[d]):(_++,l=o[_]);return tt(l,c)<=r?{startPosition:l.startPosition,endPosition:c.endPosition}:n}function at(e,t,r,n){let s,o;if(n?(s=t.filter(a=>oe(e,a)||ve(e,a)),o=Me(s,r,(a,_)=>D.isBefore(a.startPosition,_.startPosition)),s.splice(o,0,r)):(s=t.filter(a=>j.doesContain(a,r)||oe(e,a)||ve(e,a)),o=s.findIndex(a=>j.doesContain(a,r))),o===-1)throw new Error("Valid index not found");return{filteredRanges:s,indexOfInterest:o}}async function Gt(e,t,r){let n=[],a=(await w(e,t)).tree.rootNode.descendantForIndex(r.startIndex,r.endIndex);for(;a!==null;)He(e,a)&&n.push({startIndex:a.startIndex,endIndex:a.endIndex}),a=a.parent;return n}async function jt(e,t,r){let n=await w(e,t);try{let s=r.startIndex===r.endIndex;if(s)return;let o=s?void 0:Q(n.tree,r,e),a=s?void 0:Q(n.tree,r,e,Zt);if(a&&o)return{nodeIdentifier:ne(o,e),nodeToExplain:Z.ofSyntaxNode(a)}}finally{n.dispose()}}function Zt(e,t){return e.type.match(/definition/)}function _t(e,t,r){let n=new Map;t.forEach(o=>{let _=o.captures.find(c=>c.name==="definition")?.node,d;e==="cpp"&&_?.type==="function_definition"?d=_?.childForFieldName("declarator")?.childForFieldName("declarator"):e==="rust"&&_?.type==="impl_item"?d=_?.childForFieldName("trait"):d=_?.childForFieldName("name");let l=_?.childForFieldName("body");if(_&&l){switch(e){case"typescript":case"javascript":{let{definition:m}=dt(_);_=m;break}}n.get(_.id)||n.set(_.id,{mainBlock:P.ofSyntaxNode(_),detailBlocks:{body:P.ofSyntaxNode(l),name:d?.text}})}});let s=Array.from(n.values());return new ee(s,P.ofSyntaxNode(r))}function $t(e,t,r){let n;switch(e){case"python":n=Kt(t);break;case"ruby":n=zt(t);break;default:{n=Qt(t,e);break}}return new ee(n,P.ofSyntaxNode(r))}function Qt(e,t){let r=new Map;return e.forEach(n=>{let o=n.captures.find(_=>_.name==="definition")?.node,a=o?.childForFieldName("body");if(o&&a){let _;switch(t){case"typescript":case"javascript":{let{definition:l,comments:c}=dt(o);o=l,_=c;break}case"java":case"rust":_=Xt(o);break;default:{_=ae(o);break}}r.get(o.id)||r.set(o.id,{mainBlock:P.ofSyntaxNode(o),detailBlocks:{comments:_.map(l=>P.ofSyntaxNode(l)),body:P.ofSyntaxNode(a)}})}}),Array.from(r.values())}function Jt(e){if(!(e.length<2))for(let t=1;t<e.length;t++){let r=e[t];if(!r.type.includes("parameters"))return r}}function zt(e){let t=new Map;return e.forEach(r=>{let s=r.captures.find(o=>o.name==="definition")?.node;if(s){let o=s.namedChildren,a=Jt(o);if(a){let _=o[o.length-1],d=s.text.substring(a.startIndex-s.startIndex,_.endIndex-s.startIndex),l=ae(s);t.get(s.id)||t.set(s.id,{mainBlock:P.ofSyntaxNode(s),detailBlocks:{comments:l.map(m=>P.ofSyntaxNode(m)),body:{range:{startPosition:{row:a.startPosition.row,column:a.startPosition.column},endPosition:{row:_.endPosition.row,column:_.endPosition.column}},startIndex:a.startIndex,text:d,endIndex:_.endIndex}}})}}}),Array.from(t.values())}function Kt(e){let t=new Map;return e.forEach(r=>{let s=r.captures.find(a=>a.name==="definition")?.node,o=s?.childForFieldName("body");if(s&&o){let a=er(o),_=Yt(s);t.set(s.id,{mainBlock:P.ofSyntaxNode(s),detailBlocks:{docstring:a?P.ofSyntaxNode(a):void 0,decorator:_?P.ofSyntaxNode(_):void 0,body:P.ofSyntaxNode(o)}});return}}),Array.from(t.values())}function ae(e,t=["comment"]){let r=[],n=e.previousNamedSibling;for(;n&&t.some(s=>s===n?.type);)r.push(n),n=n.previousNamedSibling;return r.reverse()}function dt(e){let t=e.parent;return t?.type==="export_statement"?{definition:t,comments:ae(t)}:{definition:e,comments:ae(e)}}function Xt(e){return ae(e,["block_comment","line_comment"])}function Yt(e){let t=e.previousNamedSibling;return t?.type==="decorator"?t:void 0}function er(e){let t=e.firstChild;if(!t||t.type!=="expression_statement")return;let r=t.firstChild;return r?.type==="string"?r:void 0}function tr(e,t){return je.getStructure(e,t)}async function rr(e,t){let r=await w(e,t);try{let s=function(o){let a=o.type==="ERROR"?1:0;for(let _ of o.children)a+=s(_);return a};var n=s;return r.tree.rootNode.hasError?s(r.tree.rootNode):0}finally{r.dispose()}}function nr(){let e=lt.parentPort;if(!e)throw new Error("This module should only be used in a worker thread.");e.on("message",async({id:t,fn:r,args:n})=>{try{let s=await Ie[r](...n);e.postMessage({id:t,res:s})}catch(s){e.postMessage({id:t,err:s})}})}nr();
//!!! DO NOT modify, this file was COPIED from 'microsoft/vscode'
