"use strict";var d=Object.create;var p=Object.defineProperty;var y=Object.getOwnPropertyDescriptor;var S=Object.getOwnPropertyNames;var g=Object.getPrototypeOf,w=Object.prototype.hasOwnProperty;var x=(t,i)=>{for(var o in i)p(t,o,{get:i[o],enumerable:!0})},c=(t,i,o,r)=>{if(i&&typeof i=="object"||typeof i=="function")for(let e of S(i))!w.call(t,e)&&e!==o&&p(t,e,{get:()=>i[e],enumerable:!(r=y(i,e))||r.enumerable});return t};var h=(t,i,o)=>(o=t!=null?d(g(t)):{},c(i||!t||!t.__esModule?p(o,"default",{value:t,enumerable:!0}):o,t)),A=t=>c(p({},"__esModule",{value:!0}),t);var _={};x(_,{default:()=>I});module.exports=A(_);var n=require("@raycast/api");var l=h(require("node:process"),1),u=require("node:util"),s=require("node:child_process"),R=(0,u.promisify)(s.execFile);async function f(t,{humanReadableOutput:i=!0}={}){if(l.default.platform!=="darwin")throw new Error("macOS only");let o=i?[]:["-ss"],{stdout:r}=await R("osascript",["-e",t,o]);return r.trim()}var a=require("@raycast/api");function m(t){return`
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
    set spotifyURL to spotify url of the current track

    set AppleScript's text item delimiters to ":"
    set idPart to third text item of spotifyURL

    set the clipboard to ("https://open.spotify.com/track/" & idPart)
  `);try{await f(t),await(0,n.showToast)({title:"Copied URL to clipboard"})}catch{await(0,n.showToast)({style:n.Toast.Style.Failure,title:"Failed copying URL"})}};
