"use strict";var S=Object.create;var p=Object.defineProperty;var d=Object.getOwnPropertyDescriptor;var y=Object.getOwnPropertyNames;var g=Object.getPrototypeOf,w=Object.prototype.hasOwnProperty;var x=(t,e)=>{for(var n in e)p(t,n,{get:e[n],enumerable:!0})},c=(t,e,n,r)=>{if(e&&typeof e=="object"||typeof e=="function")for(let i of y(e))!w.call(t,i)&&i!==n&&p(t,i,{get:()=>e[i],enumerable:!(r=d(e,i))||r.enumerable});return t};var A=(t,e,n)=>(n=t!=null?S(g(t)):{},c(e||!t||!t.__esModule?p(n,"default",{value:t,enumerable:!0}):n,t)),h=t=>c(p({},"__esModule",{value:!0}),t);var O={};x(O,{default:()=>I});module.exports=h(O);var o=require("@raycast/api");var l=A(require("node:process"),1),u=require("node:util"),a=require("node:child_process"),E=(0,u.promisify)(a.execFile);async function f(t,{humanReadableOutput:e=!0}={}){if(l.default.platform!=="darwin")throw new Error("macOS only");let n=e?[]:["-ss"],{stdout:r}=await E("osascript",["-e",t,n]);return r.trim()}var s=require("@raycast/api");function m(t){return`
    tell application "Spotify"
      if not application "Spotify" is running then
        activate

        set _maxOpenWaitTimeInSeconds to 5
        set _openCounter to 1
        repeat until application "Spotify" is running
          delay 1
          set _openCounter to _openCounter + 1
          if _openCounter > _maxOpenWaitTimeInSeconds then exit repeat
        end repeat
      end if
      ${t}
    end tell`}var I=async()=>{let t=m(`
    set repeatEnabled to repeating
    set repeating to not repeatEnabled
    return not repeatEnabled
  `);try{let e=await f(t);await(0,o.showToast)({title:e==="true"?"Repeat On":"Repeat Off"})}catch{await(0,o.showToast)({style:o.Toast.Style.Failure,title:"Failed toggling repeat"})}};
