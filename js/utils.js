const $=id=>document.getElementById(id);
const clean=v=>(v??'').toString().trim();
const low=v=>clean(v).toLowerCase();
const today=()=>new Date().toISOString().slice(0,10);
const nowTime=()=>new Date().toLocaleTimeString([], {hour:'numeric',minute:'2-digit'});
function csvEscape(v){v=clean(v);return /[",\n]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v}
function download(name, text){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type:'text/csv'}));a.download=name;document.body.appendChild(a);a.click();a.remove();}
function parseCSV(text){const rows=[];let row=[],cur='',q=false;for(let i=0;i<text.length;i++){const c=text[i],n=text[i+1];if(c==='"'){if(q&&n==='"'){cur+='"';i++;}else q=!q;}else if(c===','&&!q){row.push(cur);cur='';}else if((c==='\n'||c==='\r')&&!q){if(c==='\r'&&n==='\n')i++;row.push(cur);if(row.some(x=>clean(x)!==''))rows.push(row);row=[];cur='';}else cur+=c;}row.push(cur);if(row.some(x=>clean(x)!==''))rows.push(row);if(!rows.length)return[];const headers=rows.shift().map(h=>clean(h));return rows.map(r=>Object.fromEntries(headers.map((h,i)=>[h,r[i]??''])));}
function pick(obj,names){const keys=Object.keys(obj);for(const n of names){let k=keys.find(k=>low(k)===low(n)); if(k) return clean(obj[k]); k=keys.find(k=>low(k).includes(low(n))); if(k) return clean(obj[k]);}return'';}
function normPhone(p){return clean(p).replace(/[^0-9]/g,'');}
function makeId(p){return [p.type,p.name,p.team,p.phone].map(low).join('|').replace(/[^a-z0-9|]/g,'');}
function requiresWaiver(p){return !!(settings.ruleWaiver && ((p.type==='Public' && settings.ruleWaiverPublic) || (p.type==='Swarm' && settings.ruleWaiverSwarm) || (!['Public','Swarm'].includes(p.type) && settings.ruleWaiverPublic)));}
function needsWaiver(p){return requiresWaiver(p) && !p.waiver;}
function selectedSession(){return $('sessionFilter')?.value||'all';}
function effectiveSession(p){return p.checkinSession || p.session || '';}
function visiblePeople(){const s=$('search')?low($('search').value):'';const sess=selectedSession();const type=$('typeFilter')?.value||'all';const stat=$('statusFilter')?.value||'all';return people.filter(p=>{if(type!=='all'&&p.type!==type)return false;/* Public participants are filtered by their registered session. Swarm players are eligible for any Skills session, so the session select is used as the check-in session, not a roster filter. */if(sess!=='all'&&p.type==='Public'&&low(p.session)!==low(sess))return false;if(stat==='checked'&&!p.checked)return false;if(stat==='notchecked'&&p.checked)return false;if(stat==='waiver'&&!needsWaiver(p))return false;if(s&&!low([p.name,p.parent,p.email,p.phone,p.team,p.session,p.checkinSession,p.memberId,p.qr].join(' ')).includes(s))return false;return true;});}
