"use strict";var d=Object.create;var a=Object.defineProperty;var w=Object.getOwnPropertyDescriptor;var g=Object.getOwnPropertyNames;var k=Object.getPrototypeOf,h=Object.prototype.hasOwnProperty;var x=(t,e)=>{for(var r in e)a(t,r,{get:e[r],enumerable:!0})},u=(t,e,r,n)=>{if(e&&typeof e=="object"||typeof e=="function")for(let o of g(e))!h.call(t,o)&&o!==r&&a(t,o,{get:()=>e[o],enumerable:!(n=w(e,o))||n.enumerable});return t};var A=(t,e,r)=>(r=t!=null?d(k(t)):{},u(e||!t||!t.__esModule?a(r,"default",{value:t,enumerable:!0}):r,t)),T=t=>u(a({},"__esModule",{value:!0}),t);var E={};x(E,{default:()=>b});module.exports=T(E);var i=require("@raycast/api");var l=A(require("node:process"),1),f=require("node:util"),c=require("node:child_process"),N=(0,f.promisify)(c.execFile);async function p(t,{humanReadableOutput:e=!0}={}){if(l.default.platform!=="darwin")throw new Error("macOS only");let r=e?[]:["-ss"],{stdout:n}=await N("osascript",["-e",t,r]);return n.trim()}function m(t){return`
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
    end tell`}async function y(t){if(await(0,i.closeMainWindow)({clearRootSearch:!0}),!(await(0,i.getApplications)()).some(n=>n.name==="Spotify")){await(0,i.showHUD)("Spotify is not installed");return}await p(t)}var s=require("@raycast/api");async function S(){(0,s.getPreferenceValues)().previousTrackNotificationEnabled!==!1&&await P()}async function P(){let t=`
      if application "Spotify" is not running then
          return "Not playing"
      end if

      property currentTrackName : "Unknown Track"
      property currentTrackArtist : "Unknown Artist"
      property playerState : "stopped"

      tell application "Spotify"
          try
              set currentTrackName to name of the current track
              set currentTrackArtist to artist of the current track
              set playerState to player state as string
          end try
      end tell

      if playerState is "playing" then
        return currentTrackName & " by " & currentTrackArtist
      else if playerState is "paused" then
          return currentTrackName & " by " & currentTrackArtist & " (Paused)"
      else
          return "Not playing"
      end if`;try{let e=await p(t);await(0,s.showHUD)("\u{1F3A7} "+e)}catch(e){console.error(e)}}var b=async()=>{let t=m("previous track");await y(t),await S()};
