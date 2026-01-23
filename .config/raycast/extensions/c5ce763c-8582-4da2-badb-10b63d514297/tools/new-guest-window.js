"use strict";var E=Object.create;var i=Object.defineProperty;var _=Object.getOwnPropertyDescriptor;var T=Object.getOwnPropertyNames;var A=Object.getPrototypeOf,R=Object.prototype.hasOwnProperty;var P=(e,t)=>{for(var n in t)i(e,n,{get:t[n],enumerable:!0})},h=(e,t,n,o)=>{if(t&&typeof t=="object"||typeof t=="function")for(let a of T(t))!R.call(e,a)&&a!==n&&i(e,a,{get:()=>t[a],enumerable:!(o=_(t,a))||o.enumerable});return e};var c=(e,t,n)=>(n=e!=null?E(A(e)):{},h(t||!e||!e.__esModule?i(n,"default",{value:e,enumerable:!0}):n,e)),C=e=>h(i({},"__esModule",{value:!0}),e);var M={};P(M,{default:()=>D});module.exports=C(M);var p=c(require("node:process"),1),m=require("node:util"),f=require("node:child_process"),I=(0,m.promisify)(f.execFile);async function l(e,{humanReadableOutput:t=!0,signal:n}={}){if(p.default.platform!=="darwin")throw new Error("macOS only");let o=t?[]:["-ss"],a={};n&&(a.signal=n);let{stdout:S}=await I("osascript",["-e",e,o],a);return S.trim()}var u=require("@raycast/api");var s=c(require("react")),r=require("@raycast/api");var g=require("react/jsx-runtime");var $=c(require("fs"));var d=c(require("path"));var O=require("@raycast/api"),U=()=>{if(!process.env.HOME)throw new Error("$HOME environment variable is not set.");return d.default.join(process.env.HOME,"Library")};var b=()=>d.default.join(U(),...y);var N=()=>{try{let e=b(),t=$.default.readFileSync(e,"utf-8"),n=JSON.parse(t).profile.info_cache;return n?Object.keys(n)[0]:"Default"}catch{return"Default"}};var y=["Application Support","Google","Chrome","Local State"],L=N();var w="Google Chrome not installed";var k=async()=>{if(await u.LocalStorage.getItem("is-installed"))return;if(await l(`
set isInstalled to false
try
    do shell script "osascript -e 'exists application \\"Google Chrome\\"'"
    set isInstalled to true
end try

return isInstalled`)==="false")throw new Error(w);u.LocalStorage.setItem("is-installed",!0)};async function x(){await k(),await l(`
    do shell script "open -na 'Google Chrome' --args --guest"
  `)}async function v(e){await k(),await l(`
    set link to quoted form of "${e}"
    do shell script "open -na 'Google Chrome' --args --guest " & link
  `)}async function D(e){return e.website?(await v(e.website),`Opening new guest window to ${e.website}`):(await x(),"Opening new guest window")}
