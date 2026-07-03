function openWaiver(id){currentWaiverId=id;let p=people.find(x=>x.id===id);$('waiverTitle').textContent=(settings.name||'MSS Activity')+' Electronic Waiver';$('waiverFor').innerHTML=`<b>Participant:</b> ${p.name}<br><span class="small">Activity: ${settings.name||''}${p.session?' · '+p.session:''}</span>`;$('guardianName').value=p.parent||'';$('waiverAgree').checked=false;signatureHasInk=false;$('waiverModal').classList.add('show');setTimeout(()=>{setupSignaturePad();updateWaiverReady();},50)}
function closeWaiver(){$('waiverModal').classList.remove('show')}
function completeWaiver(){let p=people.find(x=>x.id===currentWaiverId);let signer=$('guardianName').value.trim();if(!signer){alert('Please enter the parent/guardian name.');return;}if(!$('waiverAgree').checked){alert('Please check the agreement box before signing.');return;}if(!signatureHasInk){alert('Please sign in the signature box before completing the waiver.');return;}if(p){p.waiver=true;p.checked=true;p.waiverSigner=signer;p.waiverDate=new Date().toISOString();p.waiverAccepted='Yes';p.waiverVersion='MSS Electronic Waiver v4.5';p.waiverSignature=getSignatureImage();recordAttendance(p)}save();closeWaiver();render();}
let sigCanvas=null,sigCtx=null,signatureDrawing=false,signatureHasInk=false;
function setupSignaturePad(){sigCanvas=$('signaturePad');if(!sigCanvas)return;let rect=sigCanvas.getBoundingClientRect();let ratio=window.devicePixelRatio||1;sigCanvas.width=Math.max(1,Math.floor(rect.width*ratio));sigCanvas.height=Math.max(1,Math.floor(rect.height*ratio));sigCtx=sigCanvas.getContext('2d');sigCtx.setTransform(ratio,0,0,ratio,0,0);sigCtx.lineWidth=3;sigCtx.lineCap='round';sigCtx.lineJoin='round';sigCtx.strokeStyle='#0f2742';clearSignature(false);sigCanvas.onpointerdown=startSignature;sigCanvas.onpointermove=moveSignature;sigCanvas.onpointerup=endSignature;sigCanvas.onpointercancel=endSignature;sigCanvas.onpointerleave=endSignature;}
function sigPoint(e){let r=sigCanvas.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top};}
function startSignature(e){if(!$('waiverAgree') || !$('waiverAgree').checked){alert('Please check the agreement box before signing.');return;}e.preventDefault();signatureDrawing=true;signatureHasInk=true;sigCanvas.setPointerCapture&&sigCanvas.setPointerCapture(e.pointerId);let pt=sigPoint(e);sigCtx.beginPath();sigCtx.moveTo(pt.x,pt.y);updateWaiverReady();}
function moveSignature(e){if(!signatureDrawing)return;e.preventDefault();let pt=sigPoint(e);sigCtx.lineTo(pt.x,pt.y);sigCtx.stroke();updateWaiverReady();}
function endSignature(e){signatureDrawing=false;}
function clearSignature(reset=true){if(!sigCtx||!sigCanvas)return;let rect=sigCanvas.getBoundingClientRect();sigCtx.clearRect(0,0,rect.width,rect.height);sigCtx.fillStyle='#ffffff';sigCtx.fillRect(0,0,rect.width,rect.height);sigCtx.fillStyle='#98a2b3';sigCtx.font='14px Segoe UI, Arial';sigCtx.fillText(($('waiverAgree')&&$('waiverAgree').checked)?'Sign here':'Check agreement box first',14,28);if(reset)signatureHasInk=false;updateWaiverReady();}
function updateWaiverReady(){
  let signer=($('guardianName')?.value||'').trim();
  let agreed=!!($('waiverAgree')&&$('waiverAgree').checked);
  let ready=signer&&agreed&&signatureHasInk;
  if($('signaturePad')) $('signaturePad').classList.toggle('disabled',!agreed);
  if($('sigHint')) $('sigHint').textContent=agreed?'Parent/guardian signs here with finger, stylus, or mouse.':'Check the agreement box, then sign here with finger or mouse.';
  if($('waiverCompleteBtn')) $('waiverCompleteBtn').disabled=!ready;
  if($('waiverStatus')) { $('waiverStatus').className='readyBox '+(ready?'green':'yellow'); $('waiverStatus').textContent=ready?'Ready to Check In: waiver complete.':'Action Required: parent name, agreement checkbox, and signature are required.'; }
}
function getSignatureImage(){try{return sigCanvas?sigCanvas.toDataURL('image/png'):'';}catch(e){return '';}}
