"use strict";var g=Object.create;var p=Object.defineProperty;var y=Object.getOwnPropertyDescriptor;var w=Object.getOwnPropertyNames;var A=Object.getPrototypeOf,x=Object.prototype.hasOwnProperty;var I=(t,e)=>{for(var n in e)p(t,n,{get:e[n],enumerable:!0})},a=(t,e,n,o)=>{if(e&&typeof e=="object"||typeof e=="function")for(let r of w(e))!x.call(t,r)&&r!==n&&p(t,r,{get:()=>e[r],enumerable:!(o=y(e,r))||o.enumerable});return t};var C=(t,e,n)=>(n=t!=null?g(A(t)):{},a(e||!t||!t.__esModule?p(n,"default",{value:t,enumerable:!0}):n,t)),h=t=>a(p({},"__esModule",{value:!0}),t);var _={};I(_,{default:()=>d});module.exports=h(_);var i=require("@raycast/api");var u=C(require("node:process"),1),c=require("node:util"),s=require("node:child_process"),v=(0,c.promisify)(s.execFile);async function m(t,{humanReadableOutput:e=!0}={}){if(u.default.platform!=="darwin")throw new Error("macOS only");let n=e?[]:["-ss"],{stdout:o}=await v("osascript",["-e",t,n]);return o.trim()}function l(t){return`
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
    end tell`}async function f(t){if(await(0,i.closeMainWindow)({clearRootSearch:!0}),!(await(0,i.getApplications)()).some(o=>o.name==="Spotify")){await(0,i.showHUD)("Spotify is not installed");return}await m(t)}var S=require("@raycast/api");async function d(t){let e=(0,S.getPreferenceValues)(),n=t.arguments.step?parseInt(t.arguments.step):isNaN(parseInt(e.volumeStep))?10:parseInt(e.volumeStep),o=l(`set sound volume to sound volume - ${n}`);await f(o)}
