/* Google Analytics 4 — replace the ID below with your own if it ever changes */
const GA_MEASUREMENT_ID = "G-R0S6W6GWPF";
(function(){
  if(!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID.indexOf("XXXX")>-1) return;
  var s=document.createElement("script");
  s.async=true;
  s.src="https://www.googletagmanager.com/gtag/js?id="+GA_MEASUREMENT_ID;
  document.head.appendChild(s);
  window.dataLayer=window.dataLayer||[];
  window.gtag=function(){window.dataLayer.push(arguments)};
  window.gtag("js",new Date());
  window.gtag("config",GA_MEASUREMENT_ID);
})();
