"use strict";var S=Object.create;var p=Object.defineProperty;var d=Object.getOwnPropertyDescriptor;var g=Object.getOwnPropertyNames;var w=Object.getPrototypeOf,x=Object.prototype.hasOwnProperty;var A=(t,e)=>{for(var n in e)p(t,n,{get:e[n],enumerable:!0})},a=(t,e,n,i)=>{if(e&&typeof e=="object"||typeof e=="function")for(let r of g(e))!x.call(t,r)&&r!==n&&p(t,r,{get:()=>e[r],enumerable:!(i=d(e,r))||i.enumerable});return t};var h=(t,e,n)=>(n=t!=null?S(w(t)):{},a(e||!t||!t.__esModule?p(n,"default",{value:t,enumerable:!0}):n,t)),I=t=>a(p({},"__esModule",{value:!0}),t);var C={};A(C,{default:()=>P});module.exports=I(C);var o=require("@raycast/api");var c=h(require("node:process"),1),l=require("node:util"),s=require("node:child_process"),_=(0,l.promisify)(s.execFile);async function u(t,{humanReadableOutput:e=!0}={}){if(c.default.platform!=="darwin")throw new Error("macOS only");let n=e?[]:["-ss"],{stdout:i}=await _("osascript",["-e",t,n]);return i.trim()}function f(t){return`
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
    end tell`}async function m(t){if(await(0,o.closeMainWindow)({clearRootSearch:!0}),!(await(0,o.getApplications)()).some(i=>i.name==="Spotify")){await(0,o.showHUD)("Spotify is not installed");return}await u(t)}var y=require("@raycast/api"),P=async()=>{let t=(0,y.getPreferenceValues)(),e=f(`
        if player state is playing then
            set playPos to player position + ${t.secondsToSkip}
            set player position to playPos
        end if
    `);await m(e)};
