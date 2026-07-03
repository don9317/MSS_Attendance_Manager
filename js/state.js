const LS='mss_att_mgr_v12_';
let people=JSON.parse(localStorage.getItem(LS+'people')||'[]');
let history=JSON.parse(localStorage.getItem(LS+'history')||'[]');
let settings=JSON.parse(localStorage.getItem(LS+'settings')||'null')||{activityName:'Wednesday Skills Check-In',activityType:'Skills Clinic',sessions:['Beginner 5:30-6:30','Intermediate 6:30-7:30'],srcPublic:true,srcSwarm:true,methodQR:false,methodMembership:true,methodManual:true,ruleWaiver:true,ruleHomework:true,ruleArrival:true,ruleSwarmEligible:true};
let waiverTarget=null, sigCanvas=null, sigCtx=null, sigHasInk=false, drawing=false;
function save(){localStorage.setItem(LS+'people',JSON.stringify(people));localStorage.setItem(LS+'history',JSON.stringify(history));localStorage.setItem(LS+'settings',JSON.stringify(settings));}
