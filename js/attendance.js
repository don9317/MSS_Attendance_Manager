function check(id){let p=people.find(x=>x.id===id);if(!p)return;if(settings.waiver&&!p.waiver&&!p.checked){openWaiver(id);return;}p.checked=!p.checked;if(p.checked)recordAttendance(p);else removeTodayAttendance(p);save();render();}
function hw(id){let p=people.find(x=>x.id===id);p.homework=!p.homework;save();render();}
function scanCode(){let v=$('scanInput').value.trim().toLowerCase();let p=people.find(x=>x.id.toLowerCase()===v||x.name.toLowerCase()===v);let msg=$('scanMsg');msg.classList.remove('hidden');if(!p){msg.textContent='No matching participant found.';return;} if(settings.waiver&&!p.waiver){msg.textContent=`${p.name} found — waiver required before final check-in.`;openWaiver(p.id);return;}p.checked=true;recordAttendance(p);save();msg.textContent=`✓ ${p.name} checked in.`;$('scanInput').value='';render();}
function todayKey(){return new Date().toISOString().slice(0,10)}
function recordAttendance(p){
  const date=todayKey();
  const exists=attendanceHistory.some(r=>r.date===date && r.id===p.id && r.activity===(settings.name||''));
  if(!exists) attendanceHistory.push({date,activity:settings.name||'',activityType:settings.type||'',id:p.id,name:p.name,type:p.type,team:p.team||'',session:p.session||'',homework:p.homework?'Yes':'No',waiver:p.waiver?'Yes':'No'});
}
function removeTodayAttendance(p){
  const date=todayKey();
  attendanceHistory=attendanceHistory.filter(r=>!(r.date===date && r.id===p.id && r.activity===(settings.name||'')));
}
function attendanceFor(p){return attendanceHistory.filter(r=>r.id===p.id || (r.name||'').toLowerCase()===p.name.toLowerCase())}
