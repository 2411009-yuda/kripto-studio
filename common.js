(function(){
var PAGES=[['index.html','Home'],['transposisi.html','Transposisi'],['rot13.html','ROT13'],['caesar.html','Caesar'],['atbash.html','Atbash'],['vigenere.html','Vigenère']];
var WHO='Yuda Pratama, NIM 2411009, Kriptografi IFB5J, Universitas Mulia';
var $=function(i){return document.getElementById(i)};
function nav(cur){return PAGES.map(function(p){return '<a href="'+p[0]+'"'+(p[0]===cur?' aria-current="page"':'')+'>'+p[1]+'</a>'}).join('')}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function m(a){return((a%26)+26)%26}
function letters(t,keep,fn){return t.replace(/[a-z]/gi,function(ch){var lo=ch>='a',r=String.fromCharCode(fn(ch.charCodeAt(0)-(lo?97:65))+65);return keep&&lo?r.toLowerCase():r})}
function steps(t,fn,calc,d,note){
  var L=t.replace(/[^a-z]/gi,'').toUpperCase().slice(0,8),rows=[];
  for(var i=0;i<L.length;i++){var p=L.charCodeAt(i)-65,r=fn(p);rows.push([L[i],p,calc(p,r),String.fromCharCode(r+65)])}
  return {title:d?'Langkah dekripsi per huruf (8 huruf pertama)':'Langkah enkripsi per huruf (8 huruf pertama)',note:note,head:d?['Huruf cipher','Posisi c','Hitungan','Huruf plain']:['Huruf plain','Posisi p','Hitungan','Huruf cipher'],rows:rows};
}
function table(t){
  if(t&&t.err)return '<h2>Langkah</h2><p class="s">'+esc(t.err)+'</p>';
  if(!t||!t.rows.length)return '<h2>Langkah</h2><p class="s">Ketik pesan untuk melihat langkah perhitungannya.</p>';
  return '<h2>'+esc(t.title)+'</h2>'+(t.note?'<p class="s" style="margin-bottom:12px">Rumus: <code>'+esc(t.note)+'</code></p>':'')+'<div class="tbl"><table><thead><tr>'+t.head.map(function(h){return '<th>'+esc(h)+'</th>'}).join('')+'</tr></thead><tbody>'+
    t.rows.map(function(r){return '<tr>'+r.map(function(d){return '<td>'+esc(d)+'</td>'}).join('')+'</tr>'}).join('')+'</tbody></table></div>';
}
function mount(c){
  var dec=false;
  document.title=c.title+' | Kripto Studio';
  var opts=(c.opts||[]).map(function(o){return '<label class="o">'+o.label+' <input class="in" id="o_'+o.id+'" type="'+o.type+'" value="'+o.value+'"'+(o.type==='number'?' step="1"':' spellcheck="false"')+'></label>'}).join('');
  var notes=c.notes.map(function(n){return '<div class="note"><h3>'+n[0]+'</h3><p>'+n[1]+'</p></div>'}).join('');
  $('app').innerHTML=
   '<nav class="nav">'+nav(c.id+'.html')+'</nav>'+
   '<header class="top bx"><h1>'+c.title+'</h1><p class="lead">'+c.lead+'</p><p class="who">'+WHO+'</p></header>'+
   '<div class="bar"><span class="seg" role="group" aria-label="Mode"><button id="mE" aria-pressed="true">Enkripsi</button><button id="mD" aria-pressed="false">Dekripsi</button></span>'+opts+
   (c.keep?'<label class="o"><input type="checkbox" class="cb" id="keep" checked> Pertahankan huruf besar dan kecil</label>':'')+'</div>'+
   '<div class="io"><div class="box bx"><div class="head"><span id="lblIn">Plaintext</span><span class="btns"><button id="sample">Contoh</button><button id="paste">Tempel</button><button id="clear">Hapus</button></span></div>'+
   '<textarea id="inp" placeholder="Ketik atau tempel pesan di sini" spellcheck="false" aria-label="Teks masukan"></textarea><div class="foot">Karakter: <span id="n1">0</span></div></div>'+
   '<div class="box bx out"><div class="head"><span id="lblOut">Ciphertext</span><button id="copy">Salin</button></div>'+
   '<textarea id="out" readonly placeholder="Hasil muncul di sini" spellcheck="false" aria-label="Hasil"></textarea><div class="foot">Karakter: <span id="n2">0</span></div></div></div>'+
   '<section class="key bx" id="tbl"></section><section class="notes bx">'+notes+'</section><p class="f">Tugas Kriptografi, Universitas Mulia</p>';

  var inp=$('inp'),out=$('out');
  function getOpts(){var o={};(c.opts||[]).forEach(function(x){var v=$('o_'+x.id).value;o[x.id]=x.type==='number'?(parseInt(v,10)||0):v});return o}
  function keepVal(){return c.keep?$('keep').checked:true}
  function run(){
    var r=c.run(inp.value,getOpts(),dec,keepVal());
    out.value=r.out;
    $('n1').textContent=inp.value.length;$('n2').textContent=out.value.length;
    $('tbl').innerHTML=table(r.table);
  }
  function sample(){inp.value=dec?c.run(c.sample,getOpts(),false,keepVal()).out:c.sample;run()}
  function setMode(d,fill){
    dec=d;
    $('mE').setAttribute('aria-pressed',String(!d));$('mD').setAttribute('aria-pressed',String(d));
    $('lblIn').textContent=d?'Ciphertext':'Plaintext';
    $('lblOut').textContent=d?'Plaintext':'Ciphertext';
    inp.placeholder=d?'Ketik atau tempel ciphertext di sini':'Ketik atau tempel pesan di sini';
    if(fill)sample();else run();
  }
  $('mE').onclick=function(){if(dec)setMode(false,true)};
  $('mD').onclick=function(){if(!dec)setMode(true,true)};
  inp.addEventListener('input',run);
  (c.opts||[]).forEach(function(x){$('o_'+x.id).addEventListener('input',run)});
  if(c.keep)$('keep').addEventListener('change',run);
  $('clear').onclick=function(){inp.value='';run();inp.focus()};
  $('sample').onclick=sample;
  $('paste').onclick=function(){
    if(!navigator.clipboard||!navigator.clipboard.readText){inp.focus();return}
    navigator.clipboard.readText().then(function(t){inp.value=t;run()}).catch(function(){inp.focus()});
  };
  $('copy').onclick=function(){
    if(!out.value)return;
    var b=$('copy');
    function done(){b.textContent='Tersalin';setTimeout(function(){b.textContent='Salin'},1400)}
    function old(){out.select();document.execCommand('copy');done()}
    if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(out.value).then(done).catch(old);else old();
  };
  sample();
}
window.K={nav:nav,mount:mount,letters:letters,steps:steps,m:m,WHO:WHO};
})();