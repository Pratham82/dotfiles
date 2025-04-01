"use strict";var S=Object.create;var p=Object.defineProperty;var d=Object.getOwnPropertyDescriptor;var y=Object.getOwnPropertyNames;var g=Object.getPrototypeOf,w=Object.prototype.hasOwnProperty;var h=(t,n)=>{for(var i in n)p(t,i,{get:n[i],enumerable:!0})},l=(t,n,i,r)=>{if(n&&typeof n=="object"||typeof n=="function")for(let e of y(n))!w.call(t,e)&&e!==i&&p(t,e,{get:()=>n[e],enumerable:!(r=d(n,e))||r.enumerable});return t};var x=(t,n,i)=>(i=t!=null?S(g(t)):{},l(n||!t||!t.__esModule?p(i,"default",{value:t,enumerable:!0}):i,t)),A=t=>l(p({},"__esModule",{value:!0}),t);var O={};h(O,{default:()=>I});module.exports=A(O);var o=require("@raycast/api");var u=x(require("node:process"),1),c=require("node:util"),s=require("node:child_process"),E=(0,c.promisify)(s.execFile);async function f(t,{humanReadableOutput:n=!0}={}){if(u.default.platform!=="darwin")throw new Error("macOS only");let i=n?[]:["-ss"],{stdout:r}=await E("osascript",["-e",t,i]);return r.trim()}var a=require("@raycast/api");function m(t){return`
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
    set shuffleEnabled to shuffling
    set shuffling to not shuffleEnabled
    return not shuffleEnabled
  `);try{let n=await f(t);await(0,o.showToast)({title:n==="true"?"Shuffle On":"Shuffle Off"})}catch{await(0,o.showToast)({style:o.Toast.Style.Failure,title:"Failed toggling shuffle"})}};
