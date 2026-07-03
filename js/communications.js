function getFilteredView(){
  let q=($('search')?.value||'').toLowerCase(),sf=$('sessionFilter')?.value||'all',tf=$('typeFilter')?.value||'all';
  return people.filter(p=>(sf==='all'||p.session===sf)&&(tf==='all'||p.type===tf)&&(`${p.name} ${p.parent} ${p.team} ${p.email}`.toLowerCase().includes(q)));
}
function commRecipients(){
  let aud=$('commAudience')?.value||'all';
  if(aud==='visible') return getFilteredView();
  if(aud==='checked') return people.filter(p=>p.checked);
  if(aud==='notchecked') return people.filter(p=>!p.checked);
  if(aud==='public') return people.filter(p=>p.type==='Public');
  if(aud==='swarm') return people.filter(p=>p.type==='Swarm');
  if(aud==='waiver') return people.filter(p=>!p.waiver);
  if(aud==='homeworkPending') return people.filter(p=>settings.homework&&!p.homework);
  return people;
}
function renderComm(){
  if(!$('commList')) return;
  let r=commRecipients();
  $('commCount').textContent=r.length;
  $('commEmailCount').textContent=r.filter(p=>p.email).length;
  $('commList').innerHTML=`<table><tr><th>Name</th><th>Type</th><th>Parent</th><th>Contact</th></tr>${r.map(p=>`<tr><td>${p.name}</td><td>${p.type}</td><td>${p.parent||''}</td><td>${p.email?`<a href="mailto:${p.email}">Email</a>`:''} ${p.phone?` · <a href="sms:${p.phone}">Text</a>`:''}</td></tr>`).join('')}</table>`;
}
function applyTemplate(){
  let t=$('commTemplate').value, name=settings.name||'MSS Attendance';
  const templates={
    custom:{s:'MSS Attendance Update',b:'Hello,\n\nThis is a quick update from MSS Attendance.\n\nThank you.'},
    cancel:{s:`${name} Cancelled`,b:`Hello,\n\nToday's ${name} has been cancelled. We apologize for the inconvenience and will follow up with any makeup information if applicable.\n\nThank you.`},
    homework:{s:`${name} Homework`,b:`Hello,\n\nAttached/below is this week's homework for ${name}. Please have your player complete it before the next session.\n\nHomework:\n\nThank you.`},
    reminder:{s:`${name} Reminder`,b:`Hello,\n\nThis is a reminder that ${name} is scheduled for today. Please arrive a few minutes early for check-in.\n\nThank you.`},
    waiver:{s:`Waiver Needed for ${name}`,b:`Hello,\n\nOur records show that your player still needs a completed waiver before participating in ${name}. Please complete it at check-in.\n\nThank you.`}
  };
  $('commSubject').value=templates[t].s; $('commBody').value=templates[t].b;
}
function emailList(){return [...new Set(commRecipients().map(p=>p.email).filter(Boolean))];}
function phoneList(){return [...new Set(commRecipients().map(p=>p.phone).filter(Boolean))];}
function openEmail(){
  let emails=emailList(); if(!emails.length) return alert('No email addresses found for this audience.');
  let subj=encodeURIComponent($('commSubject').value), body=encodeURIComponent($('commBody').value);
  window.location.href=`mailto:?bcc=${encodeURIComponent(emails.join(','))}&subject=${subj}&body=${body}`;
}
async function copyEmails(){let emails=emailList().join(', '); if(!emails)return alert('No email addresses found.'); await navigator.clipboard.writeText(emails); alert(`Copied ${emailList().length} email addresses.`);}
async function copyPhones(){let phones=phoneList().join(', '); if(!phones)return alert('No phone numbers found.'); await navigator.clipboard.writeText(phones); alert(`Copied ${phoneList().length} phone numbers.`);}
function exportCommList(){let rows=commRecipients();let header=['Name','Type','Team','Session','Parent','Email','Phone','Checked In','Waiver','Homework'];let csv=[header.join(',')].concat(rows.map(p=>[p.name,p.type,p.team,p.session,p.parent,p.email,p.phone,p.checked?'Yes':'No',p.waiver?'Yes':'No',p.homework?'Yes':'No'].map(x=>`"${(x||'').toString().replace(/"/g,'""')}"`).join(','))).join('\n');let a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download=`mss-communication-list-${new Date().toISOString().slice(0,10)}.csv`;a.click();}
function exportCsv(kind){let rows=people;if(kind==='practiceBridge')rows=people.filter(p=>p.type==='Swarm');let header=['Date','Activity','Name','Type','Team','Session','Checked In','Waiver Complete','Waiver Signer','Waiver Date','Waiver Accepted','Waiver Version','Homework Complete','QR ID','Parent','Email','Phone','Source'];let csv=[header.join(',')].concat(rows.map(p=>[new Date().toLocaleDateString(),settings.name,p.name,p.type,p.team,p.session,p.checked?'Yes':'No',p.waiver?'Yes':'No',p.waiverSigner||'',p.waiverDate||'',p.waiverAccepted||'',p.waiverVersion||'',p.homework?'Yes':'No',p.id,p.parent,p.email,p.phone,p.source].map(x=>`"${(x||'').toString().replace(/"/g,'""')}"`).join(','))).join('\n');let a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download=`mss-${kind}-${new Date().toISOString().slice(0,10)}.csv`;a.click();}
