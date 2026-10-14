// AzHu Labs – küçük yardımcılar (çerçeve yok)
(function(){
  // Dil tercihi: kullanıcı dil bağlantısına tıklarsa hatırla; ilk ziyaretlerde tarayıcı dili İngilizce ise /en/'e yönlendir.
  try{
    var html=document.documentElement, lang=html.lang, k='azhu-lang';
    document.querySelectorAll('a.lang').forEach(function(a){a.addEventListener('click',function(){localStorage.setItem(k,a.getAttribute('hreflang'));});});
    var saved=localStorage.getItem(k);
    if(!saved && lang==='tr' && location.pathname==='/' && !(navigator.language||'').toLowerCase().startsWith('tr')){
      var alt=document.querySelector('link[hreflang="en"]'); if(alt){localStorage.setItem(k,'en');location.replace(alt.getAttribute('href'));}
    }
  }catch(e){}
  // FAQ bağlantısı (#faq) için ilk details'i aç
  if(location.hash==='#faq'){var d=document.querySelector('details');if(d){d.open=true;d.scrollIntoView();}}
})();
