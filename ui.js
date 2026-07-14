function normalizeRow(row,type){
  const isSwarm=type==='swarm';
  const player= isSwarm ? pick(row,['player name','name','participant','child','first name']) : pick(row,['playerOrTeamName','player/team name','participant','player name','attendee','child name']);
  const first=pick(row,['firstName','first name','player first name','userFirstName']); const last=pick(row,['lastName','last name','player last name','userLastName']);
  const name= player || [first,last].filter(Boolean).join(' ') || pick(row,['name']);
  const parent=[pick(row,['userFirstName','parent first name','guardian first name']),pick(row,['userLastName','parent last name','guardian last name'])].filter(Boolean).join(' ') || pick(row,['parent','guardian','contact']);
  const team=pick(row,['team','team name','division','group','roster']);
  const email=pick(row,['userEmailAddress','email','parent email','guardian email']);
  const phone=pick(row,['userPhoneNumber','phone','parent phone','guardian phone','mobile']);
  const className=pick(row,['name','activity','class','event','program']);
  let session=pick(row,['session','time','group']);
  if(!session && /beginner/i.test(className)) session=settings.days[0]?.sessions[0]||'Beginner 5:30-6:30';
  if(!session && /intermediate/i.test(className)) session=settings.days[0]?.sessions[1]||'Intermediate 6:30-7:30';
  if(!session) session=isSwarm?'Eligible Any Session':(className||'Registered');
  const waiverText=pick(row,['waiver','waiver status','signed waiver']);
  const paidText=pick(row,['paid','payment','paid status','status','price']);
  const p={type:isSwarm?'Swarm':'Public',name,parent,email,phone,team:team||'',session,source:isSwarm?(clean(settings.secondarySourceName)||'Other Source'):'MSS',checked:false,arrival:'',homework:false,waiver:/yes|signed|complete|true|current/i.test(waiverText),paid:isSwarm?true:!(/unpaid|failed|pending/i.test(paidText)),qr:pick(row,['qr','qr code','registration id','id','order id']),memberId:pick(row,['member id','memberId','player id','athlete id'])};
  if(!p.qr && !isSwarm) p.qr='MSS-'+makeId(p).slice(0,18).toUpperCase();
  if(!p.memberId && isSwarm) p.memberId='SWARM-'+makeId(p).slice(0,18).toUpperCase();
  p.id=makeId(p); return p;
}
function mergePeople(newOnes){const map=new Map(people.map(p=>[p.id,p]));newOnes.forEach(n=>{if(!n.name)return; if(map.has(n.id)) Object.assign(map.get(n.id),n,map.get(n.id)); else map.set(n.id,n);});people=[...map.values()].sort((a,b)=>a.name.localeCompare(b.name));save();renderAll();}
function loadCsv(kind){const inp=kind==='mss'?$('mssFile'):$('swarmFile');if(!inp.files[0]){alert('Choose a CSV first.');return;}const r=new FileReader();r.onload=()=>mergePeople(parseCSV(r.result).map(row=>normalizeRow(row,kind)));r.readAsText(inp.files[0]);}
function clearAll(){if(confirm('Clear all loaded participants and history from this browser?')){people=[];history=[];save();renderAll();}}
