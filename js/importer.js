function personFrom(row,typeHint){
  const format=detectFormat(row,typeHint);
  let type=typeHint==='swarm'?'Swarm':'Public';
  let name='', parent='', email='', phone='', team='', session='', paid='', waiver=false, activity='', id='';
  if(format==='MSS Public Registration'){
    type='Public';
    activity=key(row,['name','activity','event','camp']);
    name=key(row,['playerOrTeamName','player team name','participant name','player name','name']);
    parent=[key(row,['userFirstName','parent first name','first name']), key(row,['userLastName','parent last name','last name'])].filter(Boolean).join(' ');
    email=key(row,['userEmailAddress','user email address','email','parent email']);
    phone=phoneClean(key(row,['userPhoneNumber','user phone number','phone','parent phone']));
    const price=key(row,['price','discountedPrice','amount']);
    paid=price!=='' ? `Paid $${price}` : 'Paid';
    session=sessionFromMssName(activity);
    waiver=/yes|complete|signed|accepted/i.test(key(row,['waiver','waiver signed','waiver status','waiver acceptance date']));
    id=key(row,['registrationId','reservationId','id','qr','code']) || `MSS-${activity}-${name}`.replace(/[^A-Z0-9]+/gi,'-').toUpperCase();
  } else if(format==='LeagueApps Swarm Roster'){
    type='Swarm';
    name=[key(row,['First Name','firstName','player first name']), key(row,['Last Name','lastName','player last name'])].filter(Boolean).join(' ');
    parent=key(row,['Parent 1 First Name','Parent First Name','Guardian First Name','parent']);
    email=key(row,['Parent 1 Email','Parent Email','Guardian Email','Email']);
    phone=phoneClean(key(row,['Parent 1 Mobile Number','Parent Mobile Number','Guardian Phone','phone']));
    team=key(row,['Team','Team Name','Division']);
    paid='Included';
    session='Swarm Skills / Team Assigned';
    waiver=!!key(row,['Waiver Acceptance Date','Waiver Accepted','Waiver Signed','Waiver']);
    id=key(row,['Member ID','Player ID','ID','QR']) || `SWARM-${team}-${name}`.replace(/[^A-Z0-9]+/gi,'-').toUpperCase();
  } else {
    type=typeHint==='swarm'?'Swarm':'Public';
    name=key(row,['name','player name','participant name']) || [key(row,['first name']),key(row,['last name'])].filter(Boolean).join(' ');
    parent=key(row,['parent','guardian','parent name']); email=key(row,['email','parent email']); phone=phoneClean(key(row,['phone','parent phone'])); team=key(row,['team']); session=key(row,['session'])||'Unassigned'; paid=key(row,['paid','payment status'])||''; waiver=/yes|complete|signed|accepted/i.test(key(row,['waiver','waiver status'])); id=key(row,['id','qr','code'])||`${type}-${name}`.replace(/[^A-Z0-9]+/gi,'-').toUpperCase();
  }
  if(!name) name='Unnamed Participant';
  return {id,name,type,team,session,parent,email,phone,paid,waiver,checked:false,homework:false,source:format,notes:''};
}
function loadCsv(type){
  let input=$(type==='mss'?'mssFile':'swarmFile');
  if(!input.files[0])return alert('Choose a CSV first.');
  let reader=new FileReader();
  reader.onload=e=>{
    let rows=parseCSV(e.target.result);
    let data=rows.map(r=>personFrom(r,type));
    mergePeople(data);
    alert(`Imported ${data.length} records from ${data[0]?.source||'CSV'}.`);
    render();
  };
  reader.readAsText(input.files[0]);
}
function mergePeople(data){
  data.forEach(p=>{
    let i=people.findIndex(x=>x.id===p.id || (x.name.toLowerCase()===p.name.toLowerCase() && x.type===p.type));
    if(i>=0) people[i]={...people[i],...p,checked:people[i].checked,homework:people[i].homework,waiver:people[i].waiver||p.waiver};
    else people.push(p);
  });
  save();
}
function save(){localStorage.setItem('mss_people_v2',JSON.stringify(people));localStorage.setItem('mss_settings_v2',JSON.stringify(settings));localStorage.setItem('mss_attendance_history_v4',JSON.stringify(attendanceHistory));}
