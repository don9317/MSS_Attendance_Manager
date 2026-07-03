function norm(s){return (s??'').toString().trim()}
function cleanHeader(h){return norm(h).toLowerCase().replace(/[^a-z0-9]/g,'')}
function key(row,names){
  // Match columns in the priority order requested by the importer.
  // This prevents a generic column like "name" from beating a more specific
  // column like "playerOrTeamName" in MSS exports.
  const keys=Object.keys(row);
  for(const n of names){
    const wanted=cleanHeader(n);
    const found=keys.find(h=>cleanHeader(h)===wanted);
    if(found && norm(row[found])!=='') return norm(row[found]);
  }
  return '';
}
function phoneClean(v){
  v=norm(v); if(!v) return '';
  if(/e\+/i.test(v)){ const n=Number(v); if(!Number.isNaN(n)) v=Math.trunc(n).toString(); }
  v=v.replace(/\.0$/,'').replace(/[^0-9+]/g,'');
  if(v.length===10) v='1'+v;
  return v;
}
function parseCSV(text){
  text=text.replace(/^\uFEFF/,'');
  let rows=[],cur=[],val='',q=false;
  for(let i=0;i<text.length;i++){
    let c=text[i],n=text[i+1];
    if(c==='"'&&q&&n==='"'){val+='"';i++}
    else if(c==='"'){q=!q}
    else if(c===','&&!q){cur.push(val);val=''}
    else if((c==='\n'||c==='\r')&&!q){if(val!==''||cur.length){cur.push(val);rows.push(cur);cur=[];val=''} if(c==='\r'&&n==='\n')i++}
    else val+=c;
  }
  if(val!==''||cur.length){cur.push(val)}
  if(cur.length) rows.push(cur);
  if(!rows.length) return [];
  let headers=rows.shift().map(h=>h.trim());
  return rows.filter(r=>r.some(x=>norm(x))).map(r=>Object.fromEntries(headers.map((h,i)=>[h,norm(r[i]||'')])));
}
function detectFormat(row,typeHint){
  const headers=Object.keys(row).map(cleanHeader);
  if(headers.includes('playerorteamname') && headers.includes('useremailaddress')) return 'MSS Public Registration';
  if(headers.includes('firstname') && headers.includes('lastname') && (headers.includes('parent1email')||headers.includes('team'))) return 'LeagueApps Swarm Roster';
  if(typeHint==='mss') return 'MSS Public Registration';
  if(typeHint==='swarm') return 'LeagueApps Swarm Roster';
  return 'Generic CSV';
}
function sessionFromMssName(activityName){
  const n=norm(activityName).toLowerCase();
  if(n.includes('beginner')) return 'Beginner 5:30-6:30';
  if(n.includes('intermediate')) return 'Intermediate 6:30-7:30';
  return activityName || 'Unassigned';
}
