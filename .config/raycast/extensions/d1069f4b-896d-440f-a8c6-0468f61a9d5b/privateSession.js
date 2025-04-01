"use strict";var S=Object.create;var p=Object.defineProperty;var y=Object.getOwnPropertyDescriptor;var d=Object.getOwnPropertyNames;var g=Object.getPrototypeOf,w=Object.prototype.hasOwnProperty;var x=(t,e)=>{for(var i in e)p(t,i,{get:e[i],enumerable:!0})},u=(t,e,i,r)=>{if(e&&typeof e=="object"||typeof e=="function")for(let n of d(e))!w.call(t,n)&&n!==i&&p(t,n,{get:()=>e[n],enumerable:!(r=y(e,n))||r.enumerable});return t};var A=(t,e,i)=>(i=t!=null?S(g(t)):{},u(e||!t||!t.__esModule?p(i,"default",{value:t,enumerable:!0}):i,t)),h=t=>u(p({},"__esModule",{value:!0}),t);var I={};x(I,{default:()=>b});module.exports=h(I);var o=require("@raycast/api");var l=A(require("node:process"),1),c=require("node:util"),s=require("node:child_process"),v=(0,c.promisify)(s.execFile);async function m(t,{humanReadableOutput:e=!0}={}){if(l.default.platform!=="darwin")throw new Error("macOS only");let i=e?[]:["-ss"],{stdout:r}=await v("osascript",["-e",t,i]);return r.trim()}var a=require("@raycast/api");function f(t){return`
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
    end tell`}var b=async()=>{let t=f(`
  tell application "System Events"
	  tell process "Spotify"
    click menu item 5 of menu 1 of menu bar item "Spotify" of menu bar 1
    set privateSession to value of attribute "AXMenuItemMarkChar" of (menu item 5) of menu 1 of menu bar item "Spotify" of menu bar 1
	  end tell
  end tell
  return privateSession
`);try{let e=await m(t);await(0,o.showToast)({title:e==="\u2713"?"Private session turned off":"Private session turned on"})}catch{await(0,o.showToast)({style:o.Toast.Style.Failure,title:"Failed toggling private session"})}};
