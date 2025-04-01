"use strict";var m=Object.create;var i=Object.defineProperty;var y=Object.getOwnPropertyDescriptor;var w=Object.getOwnPropertyNames;var d=Object.getPrototypeOf,k=Object.prototype.hasOwnProperty;var h=(t,r)=>{for(var e in r)i(t,e,{get:r[e],enumerable:!0})},s=(t,r,e,o)=>{if(r&&typeof r=="object"||typeof r=="function")for(let n of w(r))!k.call(t,n)&&n!==e&&i(t,n,{get:()=>r[n],enumerable:!(o=y(r,n))||o.enumerable});return t};var N=(t,r,e)=>(e=t!=null?m(d(t)):{},s(r||!t||!t.__esModule?i(e,"default",{value:t,enumerable:!0}):e,t)),S=t=>s(i({},"__esModule",{value:!0}),t);var A={};h(A,{default:()=>g});module.exports=S(A);var c=require("@raycast/api");var p=N(require("node:process"),1),u=require("node:util"),a=require("node:child_process"),T=(0,u.promisify)(a.execFile);async function f(t,{humanReadableOutput:r=!0}={}){if(p.default.platform!=="darwin")throw new Error("macOS only");let e=r?[]:["-ss"],{stdout:o}=await T("osascript",["-e",t,e]);return o.trim()}async function l(){let t=`
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
      end if`;try{let r=await f(t);await(0,c.showHUD)("\u{1F3A7} "+r)}catch(r){console.error(r)}}var g=async()=>{await l()};
