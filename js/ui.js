function sessionMatches(personSession, filterValue){
  if(filterValue==='all') return true;
  const ps=(personSession||'').toLowerCase();
  const fv=(filterValue||'').toLowerCase();
  // Allows real MSS values like "Beginner Skills" or "Intermediate Skills" to match the display filters.
  if(fv.includes('beginner')) return ps.includes('beginner');
  if(fv.includes('intermediate')) return ps.includes('intermediate');
  return ps===fv;
}
function clearFilters(){
  if($('sessionFilter')) $('sessionFilter').value='all';
  if($('typeFilter')) $('typeFilter').value='all';
  if($('search')) $('search').value='';
  render();
}
function render(){
  $('activityTitle').textContent=settings.name;$('activityName').value=settings.name;$('activityType').value=settings.type;$('rulePaid').checked=settings.paid;$('ruleWaiver').checked=settings.waiver;$('ruleHomework').checked=settings.homework;
  let q=($('search')?.value||'').toLowerCase(),sf=$('sessionFilter')?.value||'all',tf=$('typeFilter')?.value||'all';
  let view=people.filter(p=>sessionMatches(p.session,sf)&&(tf==='all'||p.type===tf)&&(`${p.name} ${p.parent} ${p.team} ${p.email} ${p.phone} ${p.session}`.toLowerCase().includes(q)));
  // Top dashboard tiles reflect the full loaded roster, while the card list reflects current filters.
  $('kRegistered').textContent=people.length;$('kChecked').textContent=people.filter(p=>p.checked).length;$('kWaiver').textContent=people.filter(p=>!p.waiver).length;$('kHomework').textContent=people.filter(p=>p.homework).length;
  const msg=$('filterMsg');
  if(msg){
    if(people.length && view.length===0){msg.classList.remove('hidden');msg.textContent=`${people.length} participants are loaded, but none match the current filters/search. Try All Sessions / All Types or Clear Filters.`;}
    else {msg.classList.add('hidden');msg.textContent='';}
  }
  $('peopleList').innerHTML=view.map(card).join('') || (people.length?'<div class="card">No matching participants. Clear filters or search again.</div>':'<div class="card">No participants loaded yet. Go to Admin Upload and upload your real MSS / LeagueApps CSVs.</div>');
  renderTables();renderComm();renderTracker();
}
function card(p){
  let blocked=settings.waiver&&!p.waiver;
  return `<div class="person ${p.checked?'checked':''} ${blocked?'blocked':''}"><div class="name">${p.name}</div><div class="meta">${p.session}${p.team?' · '+p.team:''}</div><div class="badges"><span class="badge ${p.type.toLowerCase()}">${p.type}</span><span class="badge ${p.waiver?'good':'warn'}">Waiver ${p.waiver?'OK':'Needed'}</span><span class="badge ${p.checked?'good':'bad'}">${p.checked?'Checked In':'Not In'}</span>${settings.homework?`<span class="badge ${p.homework?'good':'warn'}">HW ${p.homework?'Done':'Pending'}</span>`:''}</div><div class="small">Parent: ${p.parent||'—'}<br>${p.phone?`<a href="sms:${p.phone}">Text</a> · `:''}${p.email?`<a href="mailto:${p.email}">Email</a>`:''}<br>QR/ID: ${p.id}<br>Source: ${p.source}</div><br><div class="row"><button class="btn ${p.checked?'secondary':'green'}" onclick="check('${p.id}')">${p.checked?'Undo':'Check In'}</button>${!p.waiver?`<button class="btn orange" onclick="openWaiver('${p.id}')">Sign Waiver</button>`:''}${settings.homework?`<button class="btn secondary" onclick="hw('${p.id}')">HW</button>`:''}</div></div>`;
}
function renderTables(){
  let rows=people.map(p=>`<tr><td>${p.name}</td><td>${p.type}</td><td>${p.session}</td><td>${p.team||''}</td><td>${p.checked?'Yes':'No'}</td><td>${p.waiver?'Yes':'No'}</td><td>${p.source||''}</td></tr>`).join('');
  $('importTable').innerHTML=`<table><tr><th>Name</th><th>Type</th><th>Session</th><th>Team</th><th>Checked</th><th>Waiver</th><th>Source</th></tr>${rows}</table>`;
  $('waiverTable').innerHTML=`<table><tr><th>Name</th><th>Type</th><th>Waiver</th><th>Action</th></tr>${people.map(p=>`<tr><td>${p.name}</td><td>${p.type}</td><td>${p.waiver?'Complete':'Needed'}</td><td>${!p.waiver?`<button class="btn orange" onclick="openWaiver('${p.id}')">Sign</button>`:''}</td></tr>`).join('')}</table>`;
  $('homeworkTable').innerHTML=`<table><tr><th>Name</th><th>Type</th><th>Session</th><th>Homework</th></tr>${people.map(p=>`<tr><td>${p.name}</td><td>${p.type}</td><td>${p.session}</td><td><button class="btn secondary" onclick="hw('${p.id}')">${p.homework?'Complete':'Pending'}</button></td></tr>`).join('')}</table>`;
  $('reportSummary').innerHTML=`<table><tr><th>Metric</th><th>Count</th></tr><tr><td>Total</td><td>${people.length}</td></tr><tr><td>Public</td><td>${people.filter(p=>p.type==='Public').length}</td></tr><tr><td>Swarm</td><td>${people.filter(p=>p.type==='Swarm').length}</td></tr><tr><td>Checked In</td><td>${people.filter(p=>p.checked).length}</td></tr><tr><td>Waivers Needed</td><td>${people.filter(p=>!p.waiver).length}</td></tr></table>`;
}
