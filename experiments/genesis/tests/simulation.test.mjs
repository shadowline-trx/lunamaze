import test from 'node:test';
import assert from 'node:assert/strict';
import { createWorld, tick, habitability, isComplete, targetTemperature, encodeWorld, decodeWorld, validateWorld } from '../lib/simulation.ts';

test('Mars responds to warmth, atmosphere and water, then supports life',()=>{
 let world=createWorld('mars');
 assert.ok(habitability(world)<10);
 world=tick({...world,sun:100,atmosphere:100,water:56,seeded:true},500);
 assert.ok(world.temperature>0&&world.temperature<35);
 assert.ok(world.biomass>70);
 assert.equal(isComplete(world),true);
});
test('Ice thaws when sunlight and atmosphere increase',()=>{
 const frozen=createWorld('ice');
 const thawed=tick({...frozen,sun:104,atmosphere:110,seeded:true},500);
 assert.ok(thawed.temperature>0);
 assert.ok(thawed.biomass>40);
});
test('Life cannot grow before it is seeded; hostile conditions reduce life',()=>{
 const unseeded=tick({...createWorld('mars'),sun:100,atmosphere:100,water:56},1000);
 assert.equal(unseeded.biomass,0);
 const damaged=tick({...createWorld(),sun:145,water:0},1000);
 assert.ok(damaged.biomass<1);
});
test('Time steps are deterministic, stable, and bounded',()=>{
 let a=createWorld(),b=createWorld();
 for(let i=0;i<1000;i++){a=tick(a,50);b=tick(b,50);assert.ok(a.biomass>=0&&a.biomass<=100);assert.ok(Number.isFinite(a.temperature));}
 assert.deepEqual(a,b);assert.ok(Math.abs(a.temperature-targetTemperature(a))<.01);
});
test('Shared snapshots round trip including terrain edits',()=>{
 const world={...tick(createWorld(),127),stamps:[[0,0,1,.22],[.6,.8,0,-.2]]};
 assert.deepEqual(decodeWorld(encodeWorld(world)),world);
});
test('Malformed and out-of-range world links are rejected',()=>{
 assert.equal(decodeWorld('bad%base64'),null);
 assert.equal(decodeWorld('a'.repeat(6500)),null);
 for(const override of [{scenario:'__proto__'},{sun:999},{water:-5},{biomass:NaN},{seeded:'yes'},{stamps:[[0,0,99,1]]},{stamps:Array(17).fill([0,0,1,.2])}])assert.equal(validateWorld({...createWorld(),...override}),null);
});
