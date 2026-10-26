const PRESETS=[["Custom",0,0],["EcoFlow River 3 Plus",286,220],["EcoFlow Delta 3 Plus",1024,500],["EcoFlow Delta 2 Max",2048,1000],["EcoFlow Delta Pro 3",4096,2600],["Jackery Explorer 1000 v2",1070,400],["Jackery Explorer 2000 Plus",2042,1400],["Anker SOLIX C1000",1056,600],["Anker SOLIX F3800",3840,2400],["Bluetti AC180",1152,500],["Bluetti AC200L",2048,1200]];
const CITIES=[["Houston, TX",4.5],["Houston, TX (winter)",3.3],["Dallas, TX",5.0],["Phoenix, AZ",6.5],["Miami, FL",5.2],["Denver, CO",5.5],["Atlanta, GA",4.7],["Chicago, IL",4.0],["Seattle, WA",3.2],["New York, NY",4.0],["Cloudy day (any)",1.5]];
const $=id=>document.getElementById(id);
PRESETS.forEach((p,i)=>$("preset").add(new Option(p[0],i)));$("preset").value=2;
CITIES.forEach((c,i)=>$("city").add(new Option(`${c[0]} – ${c[1]} h`,c[1])));
function calc(){const cap=+$("cap").value||0,maxin=+$("maxin").value||Infinity,pw=+$("pw").value||0,pn=+$("pn").value||0,sun=+$("city").value,eff=(+$("eff").value||75)/100,load=+$("load").value||0;
const raw=pw*pn,clipped=Math.min(raw,maxin),realW=clipped*eff,daily=realW*sun,hrs=realW>0?cap/realW:Infinity;
const net=daily-load,needW=load/(sun*eff),needPanels=pw>0?Math.ceil(needW/pw):0,autonomy=load>0?cap/load:Infinity;
let verdict=net>=0?`<p class="ok">✅ Sustainable: solar covers your load with ${Math.round(net)} Wh/day to spare.</p>`:`<p class="warn">⚠️ Short ${Math.round(-net)} Wh/day — battery drains; lasts ~${(cap/(-net)).toFixed(1)} days.</p>`;
if(raw>maxin)verdict+=`<p class="warn">Panels (${raw} W) exceed max input ${maxin} W — ${raw-maxin} W clipped.</p>`;
if(needW>maxin)verdict+=`<p class="warn">Your load needs ~${Math.round(needW)} W of solar, above this station's input limit. Consider a bigger station or reducing load.</p>`;
$("out").innerHTML=`<h2>Results</h2><p>Full recharge (0→100%) in good sun:</p><p class="big">${isFinite(hrs)?hrs.toFixed(1)+" sun-hours":"—"} ≈ ${isFinite(hrs)?(hrs/sun).toFixed(1):"—"} days</p>
<p>Solar harvest: <b>${Math.round(daily)} Wh/day</b> (effective ${Math.round(realW)} W)</p><p>Battery-only runtime at your load: <b>${isFinite(autonomy)?autonomy.toFixed(1):"∞"} days</b></p>
<p>To break even you need ~<b>${Math.round(needW)} W</b> of panels (${needPanels} × ${pw} W).</p>${verdict}`;
const g=[["Portable 200W folding panel","solar+panel+200w+portable"],["Station with ≥"+Math.max(cap,Math.ceil(load*2/256)*256)+" Wh","portable+power+station+"+Math.max(cap,load*2)+"wh"],["MC4 extension cable 20ft","mc4+extension+cable"],["Kill-A-Watt power meter","kill+a+watt+meter"]];
$("gear").innerHTML=g.map(x=>`<li><a rel="sponsored nofollow" href="https://www.amazon.com/s?k=${x[1]}&tag=YOURTAG-20" target="_blank">${x[0]}</a></li>`).join("");}
$("preset").onchange=()=>{const p=PRESETS[$("preset").value];if(p[1]){$("cap").value=p[1];$("maxin").value=p[2];}calc();};
document.querySelectorAll("input,select").forEach(e=>e.addEventListener("input",calc));calc();
