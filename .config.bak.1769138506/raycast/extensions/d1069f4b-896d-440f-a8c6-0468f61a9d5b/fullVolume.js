"use strict";var S=Object.create;var p=Object.defineProperty;var d=Object.getOwnPropertyDescriptor;var y=Object.getOwnPropertyNames;var g=Object.getPrototypeOf,w=Object.prototype.hasOwnProperty;var x=(t,n)=>{for(var i in n)p(t,i,{get:n[i],enumerable:!0})},a=(t,n,i,o)=>{if(n&&typeof n=="object"||typeof n=="function")for(let r of y(n))!w.call(t,r)&&r!==i&&p(t,r,{get:()=>n[r],enumerable:!(o=d(n,r))||o.enumerable});return t};var A=(t,n,i)=>(i=t!=null?S(g(t)):{},a(n||!t||!t.__esModule?p(i,"default",{value:t,enumerable:!0}):i,t)),h=t=>a(p({},"__esModule",{value:!0}),t);var C={};x(C,{default:()=>_});module.exports=h(C);var e=require("@raycast/api");var c=A(require("node:process"),1),u=require("node:util"),s=require("node:child_process"),I=(0,u.promisify)(s.execFile);async function l(t,{humanReadableOutput:n=!0}={}){if(c.default.platform!=="darwin")throw new Error("macOS only");let i=n?[]:["-ss"],{stdout:o}=await I("osascript",["-e",t,i]);return o.trim()}function f(t){return`
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
    end tell`}async function m(t){if(await(0,e.closeMainWindow)({clearRootSearch:!0}),!(await(0,e.getApplications)()).some(o=>o.name==="Spotify")){await(0,e.showHUD)("Spotify is not installed");return}await l(t)}var _=async()=>{let t=f("set sound volume to 100");await m(t)};
