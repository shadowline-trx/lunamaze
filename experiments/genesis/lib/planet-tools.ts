'use client';
import { useEffect, useRef, type Dispatch, type SetStateAction } from 'react';
import { habitability, targetTemperature, tick, type World } from './simulation';

type ToolDefinition={name:string;description:string;inputSchema:object;annotations:{readOnlyHint:boolean;untrustedContentHint:boolean};execute:(input:unknown)=>unknown};
type ModelContext={registerTool:(tool:ToolDefinition,options:{signal:AbortSignal})=>void|Promise<void>};
export function usePlanetTools(world:World,setWorld:Dispatch<SetStateAction<World>>){
 const current=useRef(world);current.current=world;
 const pending=useRef<Array<()=>void>>([]);
 useEffect(()=>{pending.current.splice(0).forEach(resolve=>resolve());},[world]);
 useEffect(()=>{
  const context=(document as Document&{modelContext?:ModelContext}).modelContext;
  if(!context?.registerTool)return;
  const lifecycle=new AbortController();
  const read=()=>({...current.current,habitability:habitability(current.current),targetTemperature:targetTemperature(current.current)});
  const update=(operation:(world:World)=>World)=>new Promise(resolve=>{pending.current.push(()=>resolve(read()));setWorld(operation);});
  function object(input:unknown){if(!input||typeof input!=='object'||Array.isArray(input))throw new Error('Expected an object.');return input as Record<string,unknown>;}
  const tools:ToolDefinition[]=[
   {name:'read_planet',description:'Read the current visible planet, climate controls, biosphere and simulation year.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true,untrustedContentHint:false},execute:input=>{if(Object.keys(object(input)).length)throw new Error('No arguments expected.');return read();}},
   {name:'configure_planet',description:'Set sunlight, atmosphere or water level on the current planet. Optionally introduce life. Changes the same simulation as the visible controls; does not save or share.',inputSchema:{type:'object',properties:{sun:{type:'number',minimum:55,maximum:145},atmosphere:{type:'number',minimum:0,maximum:200},water:{type:'number',minimum:0,maximum:95},seedLife:{type:'boolean'}},additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute:input=>{const p=object(input);if(Object.keys(p).some(k=>!['sun','atmosphere','water','seedLife'].includes(k)))throw new Error('Unknown setting.');for(const [key,min,max]of [['sun',55,145],['atmosphere',0,200],['water',0,95]]as const){if(p[key]!==undefined&&(typeof p[key]!=='number'||!Number.isFinite(p[key])||Number(p[key])<min||Number(p[key])>max))throw new Error('Setting out of range: '+key);}if(p.seedLife!==undefined&&typeof p.seedLife!=='boolean')throw new Error('seedLife must be boolean.');return update(w=>({...w,...(p.sun===undefined?{}:{sun:Number(p.sun)}),...(p.atmosphere===undefined?{}:{atmosphere:Number(p.atmosphere)}),...(p.water===undefined?{}:{water:Number(p.water)}),...(p.seedLife?{seeded:true,biomass:Math.max(2,w.biomass)}:{})}));}},
   {name:'advance_simulation',description:'Advance the visible planet by up to 100 years and return its resulting temperature, biosphere and habitability.',inputSchema:{type:'object',properties:{years:{type:'integer',minimum:1,maximum:100}},required:['years'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute:input=>{const p=object(input);if(Object.keys(p).some(k=>k!=='years')||typeof p.years!=='number'||!Number.isInteger(p.years)||p.years<1||p.years>100)throw new Error('years must be an integer from 1 to 100.');return update(w=>tick(w,Number(p.years)));}},
  ];
  for(const tool of tools){try{void Promise.resolve(context.registerTool(tool,{signal:lifecycle.signal})).catch(()=>{});}catch{}}
  return()=>{lifecycle.abort();pending.current.splice(0).forEach(resolve=>resolve());};
 },[setWorld]);
}
