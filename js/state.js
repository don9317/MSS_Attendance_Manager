let people=JSON.parse(localStorage.getItem('mss_people_v2')||'[]');
let attendanceHistory=JSON.parse(localStorage.getItem('mss_attendance_history_v4')||'[]');
let settings=JSON.parse(localStorage.getItem('mss_settings_v2')||'{"name":"MSS Attendance & Arrival Manager","type":"Skills Clinic","paid":true,"waiver":true,"homework":true}');
let currentWaiverId=null;
const $=id=>document.getElementById(id);
$('datePill').textContent=new Date().toLocaleDateString(undefined,{weekday:'long',month:'short',day:'numeric',year:'numeric'});
document.querySelectorAll('.nav button').forEach(b=>b.onclick=()=>{document.querySelectorAll('.nav button').forEach(x=>x.classList.remove('active'));b.classList.add('active');document.querySelectorAll('.tab').forEach(t=>t.classList.add('hidden'));$(b.dataset.tab).classList.remove('hidden');render();});
