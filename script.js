const $=id=>document.getElementById(id);
let tx=JSON.parse(localStorage.getItem('tx')||'[]'),editId=null;
$('date').valueAsDate=new Date();
const save=()=>{localStorage.setItem('tx',JSON.stringify(tx));render()};
$('form').onsubmit=e=>{e.preventDefault();
 const d=$('desc').value.trim(),a=parseFloat($('amt').value);
 if(!d||!(a>0)||!$('date').value)return $('err').textContent='Enter description, a positive amount and date.';
 $('err').textContent='';
 const o={id:editId||Date.now(),type:$('type').value,desc:d,amt:a,cat:$('cat').value,date:$('date').value};
 tx=editId?tx.map(t=>t.id===editId?o:t):[...tx,o];
 editId=null;$('btn').textContent='Add';e.target.reset();$('date').valueAsDate=new Date();save()};
const money=n=>'$'+n.toFixed(2);
function render(){
 const inc=tx.filter(t=>t.type==='income').reduce((s,t)=>s+t.amt,0),exp=tx.filter(t=>t.type==='expense').reduce((s,t)=>s+t.amt,0);
 $('inc').textContent=money(inc);$('exp').textContent=money(exp);$('bal').textContent=money(inc-exp);
 const f=$('filter').value;
 $('list').innerHTML=tx.filter(t=>f==='all'||t.cat===f).sort((a,b)=>b.date.localeCompare(a.date)).map(t=>`<li class="${t.type}">
 <div>${t.desc.replace(/</g,'&lt;')}<small>${t.cat} • ${t.date}</small></div><b>${t.type==='income'?'+':'-'}${money(t.amt)}</b>
 <button onclick="edit(${t.id})">✏️</button><button class="del" onclick="del(${t.id})">🗑</button></li>`).join('')||'<p>No transactions.</p>'}
const del=id=>{tx=tx.filter(t=>t.id!==id);save()};
const edit=id=>{const t=tx.find(x=>x.id===id);editId=id;$('type').value=t.type;$('desc').value=t.desc;$('amt').value=t.amt;$('cat').value=t.cat;$('date').value=t.date;$('btn').textContent='Update';scrollTo(0,0)};
$('filter').onchange=render;render();
