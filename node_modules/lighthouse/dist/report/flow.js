"use strict";(()=>{var Be,x,on,ni,ke,rn,en,sn,He={},ln=[],ai=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;function ne(t,e){for(var n in e)t[n]=e[n];return t}function pn(t){var e=t.parentNode;e&&e.removeChild(t)}function yt(t,e,n){var a,i,o,r={};for(o in e)o=="key"?a=e[o]:o=="ref"?i=e[o]:r[o]=e[o];if(arguments.length>2&&(r.children=arguments.length>3?Be.call(arguments,2):n),typeof t=="function"&&t.defaultProps!=null)for(o in t.defaultProps)r[o]===void 0&&(r[o]=t.defaultProps[o]);return je(t,r,a,i,null)}function je(t,e,n,a,i){var o={type:t,props:e,key:n,ref:a,__k:null,__:null,__b:0,__e:null,__d:void 0,__c:null,__h:null,constructor:void 0,__v:i??++on};return i==null&&x.vnode!=null&&x.vnode(o),o}function N(t){return t.children}function Me(t,e){this.props=t,this.context=e}function ge(t,e){if(e==null)return t.__?ge(t.__,t.__.__k.indexOf(t)+1):null;for(var n;e<t.__k.length;e++)if((n=t.__k[e])!=null&&n.__e!=null)return n.__e;return typeof t.type=="function"?ge(t):null}function un(t){var e,n;if((t=t.__)!=null&&t.__c!=null){for(t.__e=t.__c.base=null,e=0;e<t.__k.length;e++)if((n=t.__k[e])!=null&&n.__e!=null){t.__e=t.__c.base=n.__e;break}return un(t)}}function bt(t){(!t.__d&&(t.__d=!0)&&ke.push(t)&&!Fe.__r++||en!==x.debounceRendering)&&((en=x.debounceRendering)||rn)(Fe)}function Fe(){for(var t;Fe.__r=ke.length;)t=ke.sort(function(e,n){return e.__v.__b-n.__v.__b}),ke=[],t.some(function(e){var n,a,i,o,r,s;e.__d&&(r=(o=(n=e).__v).__e,(s=n.__P)&&(a=[],(i=ne({},o)).__v=o.__v+1,_t(s,o,i,n.__n,s.ownerSVGElement!==void 0,o.__h!=null?[r]:null,a,r??ge(o),o.__h),hn(a,o),o.__e!=r&&un(o)))})}function cn(t,e,n,a,i,o,r,s,p,c){var l,d,m,h,f,C,g,_=a&&a.__k||ln,v=_.length;for(n.__k=[],l=0;l<e.length;l++)if((h=n.__k[l]=(h=e[l])==null||typeof h=="boolean"?null:typeof h=="string"||typeof h=="number"||typeof h=="bigint"?je(null,h,null,null,h):Array.isArray(h)?je(N,{children:h},null,null,null):h.__b>0?je(h.type,h.props,h.key,null,h.__v):h)!=null){if(h.__=n,h.__b=n.__b+1,(m=_[l])===null||m&&h.key==m.key&&h.type===m.type)_[l]=void 0;else for(d=0;d<v;d++){if((m=_[d])&&h.key==m.key&&h.type===m.type){_[d]=void 0;break}m=null}_t(t,h,m=m||He,i,o,r,s,p,c),f=h.__e,(d=h.ref)&&m.ref!=d&&(g||(g=[]),m.ref&&g.push(m.ref,null,h),g.push(d,h.__c||f,h)),f!=null?(C==null&&(C=f),typeof h.type=="function"&&h.__k===m.__k?h.__d=p=mn(h,p,t):p=dn(t,h,m,_,f,p),typeof n.type=="function"&&(n.__d=p)):p&&m.__e==p&&p.parentNode!=t&&(p=ge(m))}for(n.__e=C,l=v;l--;)_[l]!=null&&(typeof n.type=="function"&&_[l].__e!=null&&_[l].__e==n.__d&&(n.__d=ge(a,l+1)),fn(_[l],_[l]));if(g)for(l=0;l<g.length;l++)gn(g[l],g[++l],g[++l])}function mn(t,e,n){for(var a,i=t.__k,o=0;i&&o<i.length;o++)(a=i[o])&&(a.__=t,e=typeof a.type=="function"?mn(a,e,n):dn(n,a,a,i,a.__e,e));return e}function dn(t,e,n,a,i,o){var r,s,p;if(e.__d!==void 0)r=e.__d,e.__d=void 0;else if(n==null||i!=o||i.parentNode==null)e:if(o==null||o.parentNode!==t)t.appendChild(i),r=null;else{for(s=o,p=0;(s=s.nextSibling)&&p<a.length;p+=2)if(s==i)break e;t.insertBefore(i,o),r=o}return r!==void 0?r:i.nextSibling}function ii(t,e,n,a,i){var o;for(o in n)o==="children"||o==="key"||o in e||Oe(t,o,null,n[o],a);for(o in e)i&&typeof e[o]!="function"||o==="children"||o==="key"||o==="value"||o==="checked"||n[o]===e[o]||Oe(t,o,e[o],n[o],a)}function tn(t,e,n){e[0]==="-"?t.setProperty(e,n):t[e]=n==null?"":typeof n!="number"||ai.test(e)?n:n+"px"}function Oe(t,e,n,a,i){var o;e:if(e==="style")if(typeof n=="string")t.style.cssText=n;else{if(typeof a=="string"&&(t.style.cssText=a=""),a)for(e in a)n&&e in n||tn(t.style,e,"");if(n)for(e in n)a&&n[e]===a[e]||tn(t.style,e,n[e])}else if(e[0]==="o"&&e[1]==="n")o=e!==(e=e.replace(/Capture$/,"")),e=e.toLowerCase()in t?e.toLowerCase().slice(2):e.slice(2),t.l||(t.l={}),t.l[e+o]=n,n?a||t.addEventListener(e,o?an:nn,o):t.removeEventListener(e,o?an:nn,o);else if(e!=="dangerouslySetInnerHTML"){if(i)e=e.replace(/xlink(H|:h)/,"h").replace(/sName$/,"s");else if(e!=="href"&&e!=="list"&&e!=="form"&&e!=="tabIndex"&&e!=="download"&&e in t)try{t[e]=n??"";break e}catch{}typeof n=="function"||(n!=null&&(n!==!1||e[0]==="a"&&e[1]==="r")?t.setAttribute(e,n):t.removeAttribute(e))}}function nn(t){this.l[t.type+!1](x.event?x.event(t):t)}function an(t){this.l[t.type+!0](x.event?x.event(t):t)}function _t(t,e,n,a,i,o,r,s,p){var c,l,d,m,h,f,C,g,_,v,y,w=e.type;if(e.constructor!==void 0)return null;n.__h!=null&&(p=n.__h,s=e.__e=n.__e,e.__h=null,o=[s]),(c=x.__b)&&c(e);try{e:if(typeof w=="function"){if(g=e.props,_=(c=w.contextType)&&a[c.__c],v=c?_?_.props.value:c.__:a,n.__c?C=(l=e.__c=n.__c).__=l.__E:("prototype"in w&&w.prototype.render?e.__c=l=new w(g,v):(e.__c=l=new Me(g,v),l.constructor=w,l.render=ri),_&&_.sub(l),l.props=g,l.state||(l.state={}),l.context=v,l.__n=a,d=l.__d=!0,l.__h=[]),l.__s==null&&(l.__s=l.state),w.getDerivedStateFromProps!=null&&(l.__s==l.state&&(l.__s=ne({},l.__s)),ne(l.__s,w.getDerivedStateFromProps(g,l.__s))),m=l.props,h=l.state,d)w.getDerivedStateFromProps==null&&l.componentWillMount!=null&&l.componentWillMount(),l.componentDidMount!=null&&l.__h.push(l.componentDidMount);else{if(w.getDerivedStateFromProps==null&&g!==m&&l.componentWillReceiveProps!=null&&l.componentWillReceiveProps(g,v),!l.__e&&l.shouldComponentUpdate!=null&&l.shouldComponentUpdate(g,l.__s,v)===!1||e.__v===n.__v){l.props=g,l.state=l.__s,e.__v!==n.__v&&(l.__d=!1),l.__v=e,e.__e=n.__e,e.__k=n.__k,e.__k.forEach(function(P){P&&(P.__=e)}),l.__h.length&&r.push(l);break e}l.componentWillUpdate!=null&&l.componentWillUpdate(g,l.__s,v),l.componentDidUpdate!=null&&l.__h.push(function(){l.componentDidUpdate(m,h,f)})}l.context=v,l.props=g,l.state=l.__s,(c=x.__r)&&c(e),l.__d=!1,l.__v=e,l.__P=t,c=l.render(l.props,l.state,l.context),l.state=l.__s,l.getChildContext!=null&&(a=ne(ne({},a),l.getChildContext())),d||l.getSnapshotBeforeUpdate==null||(f=l.getSnapshotBeforeUpdate(m,h)),y=c!=null&&c.type===N&&c.key==null?c.props.children:c,cn(t,Array.isArray(y)?y:[y],e,n,a,i,o,r,s,p),l.base=e.__e,e.__h=null,l.__h.length&&r.push(l),C&&(l.__E=l.__=null),l.__e=!1}else o==null&&e.__v===n.__v?(e.__k=n.__k,e.__e=n.__e):e.__e=oi(n.__e,e,n,a,i,o,r,p);(c=x.diffed)&&c(e)}catch(P){e.__v=null,(p||o!=null)&&(e.__e=s,e.__h=!!p,o[o.indexOf(s)]=null),x.__e(P,e,n)}}function hn(t,e){x.__c&&x.__c(e,t),t.some(function(n){try{t=n.__h,n.__h=[],t.some(function(a){a.call(n)})}catch(a){x.__e(a,n.__v)}})}function oi(t,e,n,a,i,o,r,s){var p,c,l,d=n.props,m=e.props,h=e.type,f=0;if(h==="svg"&&(i=!0),o!=null){for(;f<o.length;f++)if((p=o[f])&&"setAttribute"in p==!!h&&(h?p.localName===h:p.nodeType===3)){t=p,o[f]=null;break}}if(t==null){if(h===null)return document.createTextNode(m);t=i?document.createElementNS("http://www.w3.org/2000/svg",h):document.createElement(h,m.is&&m),o=null,s=!1}if(h===null)d===m||s&&t.data===m||(t.data=m);else{if(o=o&&Be.call(t.childNodes),c=(d=n.props||He).dangerouslySetInnerHTML,l=m.dangerouslySetInnerHTML,!s){if(o!=null)for(d={},f=0;f<t.attributes.length;f++)d[t.attributes[f].name]=t.attributes[f].value;(l||c)&&(l&&(c&&l.__html==c.__html||l.__html===t.innerHTML)||(t.innerHTML=l&&l.__html||""))}if(ii(t,m,d,i,s),l)e.__k=[];else if(f=e.props.children,cn(t,Array.isArray(f)?f:[f],e,n,a,i&&h!=="foreignObject",o,r,o?o[0]:n.__k&&ge(n,0),s),o!=null)for(f=o.length;f--;)o[f]!=null&&pn(o[f]);s||("value"in m&&(f=m.value)!==void 0&&(f!==t.value||h==="progress"&&!f||h==="option"&&f!==d.value)&&Oe(t,"value",f,d.value,!1),"checked"in m&&(f=m.checked)!==void 0&&f!==t.checked&&Oe(t,"checked",f,d.checked,!1))}return t}function gn(t,e,n){try{typeof t=="function"?t(e):t.current=e}catch(a){x.__e(a,n)}}function fn(t,e,n){var a,i;if(x.unmount&&x.unmount(t),(a=t.ref)&&(a.current&&a.current!==t.__e||gn(a,null,e)),(a=t.__c)!=null){if(a.componentWillUnmount)try{a.componentWillUnmount()}catch(o){x.__e(o,e)}a.base=a.__P=null}if(a=t.__k)for(i=0;i<a.length;i++)a[i]&&fn(a[i],e,typeof t.type!="function");n||t.__e==null||pn(t.__e),t.__e=t.__d=void 0}function ri(t,e,n){return this.constructor(t,n)}function vn(t,e,n){var a,i,o;x.__&&x.__(t,e),i=(a=typeof n=="function")?null:n&&n.__k||e.__k,o=[],_t(e,t=(!a&&n||e).__k=yt(N,null,[t]),i||He,He,e.ownerSVGElement!==void 0,!a&&n?[n]:i?null:e.firstChild?Be.call(e.childNodes):null,o,!a&&n?n:i?i.__e:e.firstChild,a),hn(o,t)}function Pe(t,e){var n={__c:e="__cC"+sn++,__:t,Consumer:function(a,i){return a.children(i)},Provider:function(a){var i,o;return this.getChildContext||(i=[],(o={})[e]=this,this.getChildContext=function(){return o},this.shouldComponentUpdate=function(r){this.props.value!==r.value&&i.some(bt)},this.sub=function(r){i.push(r);var s=r.componentWillUnmount;r.componentWillUnmount=function(){i.splice(i.indexOf(r),1),s&&s.call(r)}}),a.children}};return n.Provider.__=n.Consumer.contextType=n}Be=ln.slice,x={__e:function(t,e,n,a){for(var i,o,r;e=e.__;)if((i=e.__c)&&!i.__)try{if((o=i.constructor)&&o.getDerivedStateFromError!=null&&(i.setState(o.getDerivedStateFromError(t)),r=i.__d),i.componentDidCatch!=null&&(i.componentDidCatch(t,a||{}),r=i.__d),r)return i.__E=i}catch(s){t=s}throw t}},on=0,ni=function(t){return t!=null&&t.constructor===void 0},Me.prototype.setState=function(t,e){var n;n=this.__s!=null&&this.__s!==this.state?this.__s:this.__s=ne({},this.state),typeof t=="function"&&(t=t(ne({},n),this.props)),t&&ne(n,t),t!=null&&this.__v&&(e&&this.__h.push(e),bt(this))},Me.prototype.forceUpdate=function(t){this.__v&&(this.__e=!0,t&&this.__h.push(t),bt(this))},Me.prototype.render=N,ke=[],rn=typeof Promise=="function"?Promise.prototype.then.bind(Promise.resolve()):setTimeout,Fe.__r=0,sn=0;var fe,F,bn,Ve=0,kn=[],yn=x.__b,_n=x.__r,Cn=x.diffed,wn=x.__c,xn=x.unmount;function Ae(t,e){x.__h&&x.__h(F,t,Ve||e),Ve=0;var n=F.__H||(F.__H={__:[],__h:[]});return t>=n.__.length&&n.__.push({}),n.__[t]}function ae(t){return Ve=1,si(Pn,t)}function si(t,e,n){var a=Ae(fe++,2);return a.t=t,a.__c||(a.__=[n?n(e):Pn(void 0,e),function(i){var o=a.t(a.__[0],i);a.__[0]!==o&&(a.__=[o,a.__[1]],a.__c.setState({}))}],a.__c=F),a.__}function $e(t,e){var n=Ae(fe++,3);!x.__s&&wt(n.__H,e)&&(n.__=t,n.__H=e,F.__H.__h.push(n))}function qe(t,e){var n=Ae(fe++,4);!x.__s&&wt(n.__H,e)&&(n.__=t,n.__H=e,F.__h.push(n))}function We(t){return Ve=5,Q(function(){return{current:t}},[])}function Q(t,e){var n=Ae(fe++,7);return wt(n.__H,e)&&(n.__=t(),n.__H=e,n.__h=t),n.__}function Ee(t){var e=F.context[t.__c],n=Ae(fe++,9);return n.c=t,e?(n.__==null&&(n.__=!0,e.sub(F)),e.props.value):t.__}function li(){for(var t;t=kn.shift();)if(t.__P)try{t.__H.__h.forEach(Ge),t.__H.__h.forEach(Ct),t.__H.__h=[]}catch(e){t.__H.__h=[],x.__e(e,t.__v)}}x.__b=function(t){F=null,yn&&yn(t)},x.__r=function(t){_n&&_n(t),fe=0;var e=(F=t.__c).__H;e&&(e.__h.forEach(Ge),e.__h.forEach(Ct),e.__h=[])},x.diffed=function(t){Cn&&Cn(t);var e=t.__c;e&&e.__H&&e.__H.__h.length&&(kn.push(e)!==1&&bn===x.requestAnimationFrame||((bn=x.requestAnimationFrame)||function(n){var a,i=function(){clearTimeout(o),Sn&&cancelAnimationFrame(a),setTimeout(n)},o=setTimeout(i,100);Sn&&(a=requestAnimationFrame(i))})(li)),F=null},x.__c=function(t,e){e.some(function(n){try{n.__h.forEach(Ge),n.__h=n.__h.filter(function(a){return!a.__||Ct(a)})}catch(a){e.some(function(i){i.__h&&(i.__h=[])}),e=[],x.__e(a,n.__v)}}),wn&&wn(t,e)},x.unmount=function(t){xn&&xn(t);var e,n=t.__c;n&&n.__H&&(n.__H.__.forEach(function(a){try{Ge(a)}catch(i){e=i}}),e&&x.__e(e,n.__v))};var Sn=typeof requestAnimationFrame=="function";function Ge(t){var e=F,n=t.__c;typeof n=="function"&&(t.__c=void 0,n()),F=e}function Ct(t){var e=F;t.__c=t.__(),F=e}function wt(t,e){return!t||t.length!==e.length||e.some(function(n,a){return n!==t[a]})}function Pn(t,e){return typeof e=="function"?e(t):e}var pi=.8999999999999999,ui=.5,ci=.49999999999999994;function mi(t){let e=Math.sign(t);t=Math.abs(t);let n=.254829592,a=-.284496736,i=1.421413741,o=-1.453152027,r=1.061405429,p=1/(1+.3275911*t),c=p*(n+p*(a+p*(i+p*(o+p*r))));return e*(1-c*Math.exp(-t*t))}function An({median:t,p10:e},n){if(t<=0)throw new Error("median must be greater than zero");if(e<=0)throw new Error("p10 must be greater than zero");if(e>=t)throw new Error("p10 must be less than the median");if(n<=0)return 1;let a=.9061938024368232,i=Math.max(Number.MIN_VALUE,n/t),o=Math.log(i),r=Math.max(Number.MIN_VALUE,e/t),s=-Math.log(r),p=o*a/s,c=(1-mi(p))/2,l;return n<=e?l=Math.max(.9,Math.min(1,c)):n<=t?l=Math.max(ui,Math.min(pi,c)):l=Math.max(0,Math.min(ci,c)),l}var ee="…",hi=" ",En=.9,gi={PASS:{label:"pass",minScore:En},AVERAGE:{label:"average",minScore:.5},FAIL:{label:"fail"},ERROR:{label:"error"}},fi=["com","co","gov","edu","ac","org","go","gob","or","net","in","ne","nic","gouv","web","spb","blog","jus","kiev","mil","wi","qc","ca","bel","on"],U=class t{static get RATINGS(){return gi}static get PASS_THRESHOLD(){return En}static get MS_DISPLAY_VALUE(){return`%10d${hi}ms`}static getFinalDisplayedUrl(e){if(e.finalDisplayedUrl)return e.finalDisplayedUrl;if(e.finalUrl)return e.finalUrl;throw new Error("Could not determine final displayed URL")}static getMainDocumentUrl(e){return e.mainDocumentUrl||e.finalUrl}static getFullPageScreenshot(e){return e.fullPageScreenshot?e.fullPageScreenshot:e.audits["full-page-screenshot"]?.details}static getEntityFromUrl(e,n){return n&&n.find(i=>i.origins.find(o=>e.startsWith(o)))||t.getPseudoRootDomain(e)}static splitMarkdownCodeSpans(e){let n=[],a=e.split(/`(.*?)`/g);for(let i=0;i<a.length;i++){let o=a[i];if(!o)continue;let r=i%2!==0;n.push({isCode:r,text:o})}return n}static splitMarkdownLink(e){let n=[],a=e.split(/\[([^\]]+?)\]\((https?:\/\/.*?)\)/g);for(;a.length;){let[i,o,r]=a.splice(0,3);i&&n.push({isLink:!1,text:i}),o&&r&&n.push({isLink:!0,text:o,linkHref:r})}return n}static truncate(e,n,a="…"){if(e.length<=n)return e;let o=new Intl.Segmenter(void 0,{granularity:"grapheme"}).segment(e)[Symbol.iterator](),r=0;for(let s=0;s<=n-a.length;s++){let p=o.next();if(p.done)return e;r=p.value.index}for(let s=0;s<a.length;s++)if(o.next().done)return e;return e.slice(0,r)+a}static getURLDisplayName(e,n){n=n||{numPathParts:void 0,preserveQuery:void 0,preserveHost:void 0};let a=n.numPathParts!==void 0?n.numPathParts:2,i=n.preserveQuery!==void 0?n.preserveQuery:!0,o=n.preserveHost||!1,r;if(e.protocol==="about:"||e.protocol==="data:")r=e.href;else{r=e.pathname;let p=r.split("/").filter(c=>c.length);a&&p.length>a&&(r=ee+p.slice(-1*a).join("/")),o&&(r=`${e.host}/${r.replace(/^\//,"")}`),i&&(r=`${r}${e.search}`)}let s=64;if(e.protocol!=="data:"&&(r=r.slice(0,200),r=r.replace(/([a-f0-9]{7})[a-f0-9]{13}[a-f0-9]*/g,`$1${ee}`),r=r.replace(/([a-zA-Z0-9-_]{9})(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9-_]{10,}/g,`$1${ee}`),r=r.replace(/(\d{3})\d{6,}/g,`$1${ee}`),r=r.replace(/\u2026+/g,ee),r.length>s&&r.includes("?")&&(r=r.replace(/\?([^=]*)(=)?.*/,`?$1$2${ee}`),r.length>s&&(r=r.replace(/\?.*/,`?${ee}`)))),r.length>s){let p=r.lastIndexOf(".");p>=0?r=r.slice(0,s-1-(r.length-p))+`${ee}${r.slice(p)}`:r=r.slice(0,s-1)+ee}return r}static getChromeExtensionOrigin(e){let n=new URL(e);return n.protocol+"//"+n.host}static parseURL(e){let n=new URL(e);return{file:t.getURLDisplayName(n),hostname:n.hostname,origin:n.protocol==="chrome-extension:"?t.getChromeExtensionOrigin(e):n.origin}}static createOrReturnURL(e){return e instanceof URL?e:new URL(e)}static getPseudoTld(e){let n=e.split(".").slice(-2);return fi.includes(n[0])?`.${n.join(".")}`:`.${n[n.length-1]}`}static getPseudoRootDomain(e){let n=t.createOrReturnURL(e).hostname,i=t.getPseudoTld(n).split(".");return n.split(".").slice(-i.length).join(".")}static filterRelevantLines(e,n,a){if(n.length===0)return e.slice(0,a*2+1);let i=3,o=new Set;return n=n.sort((r,s)=>(r.lineNumber||0)-(s.lineNumber||0)),n.forEach(({lineNumber:r})=>{let s=r-a,p=r+a;for(;s<1;)s++,p++;o.has(s-i-1)&&(s-=i);for(let c=s;c<=p;c++){let l=c;o.add(l)}}),e.filter(r=>o.has(r.lineNumber))}static computeLogNormalScore(e,n){let a=An(e,n);return a>.9&&(a+=.05*(a-.9)),Math.floor(a*100)/100}};var Ln=0,b=class t{static i18n=null;static strings={};static reportJson=null;static apply(e){t.strings={...Je,...e.providedStrings},t.i18n=e.i18n,t.reportJson=e.reportJson}static getUniqueSuffix(){return Ln++}static resetUniqueSuffix(){Ln=0}};var Tn="data:image/jpeg;base64,";function Un(t){t.configSettings.locale||(t.configSettings.locale="en"),t.configSettings.formFactor||(t.configSettings.formFactor=t.configSettings.emulatedFormFactor),t.finalDisplayedUrl=U.getFinalDisplayedUrl(t),t.mainDocumentUrl=U.getMainDocumentUrl(t);for(let a of Object.values(t.audits))if((a.scoreDisplayMode==="not_applicable"||a.scoreDisplayMode==="not-applicable")&&(a.scoreDisplayMode="notApplicable"),a.scoreDisplayMode==="informative"&&(a.score=1),a.details){if((a.details.type===void 0||a.details.type==="diagnostic")&&(a.details.type="debugdata"),a.details.type==="filmstrip")for(let i of a.details.items)i.data.startsWith(Tn)||(i.data=Tn+i.data);if(a.details.type==="table")for(let i of a.details.headings){let{itemType:o,text:r}=i;o!==void 0&&(i.valueType=o,delete i.itemType),r!==void 0&&(i.label=r,delete i.text);let s=i.subItemsHeading?.itemType;i.subItemsHeading&&s!==void 0&&(i.subItemsHeading.valueType=s,delete i.subItemsHeading.itemType)}if(a.id==="third-party-summary"&&(a.details.type==="opportunity"||a.details.type==="table")){let{headings:i,items:o}=a.details;if(i[0].valueType==="link"){i[0].valueType="text";for(let r of o)typeof r.entity=="object"&&r.entity.type==="link"&&(r.entity=r.entity.text);a.details.isEntityGrouped=!0}}}let[e]=t.lighthouseVersion.split(".").map(Number),n=t.categories.performance;if(n){if(e<9){t.categoryGroups||(t.categoryGroups={}),t.categoryGroups.hidden={title:""};for(let a of n.auditRefs)a.group?a.group==="load-opportunities"&&(a.group="diagnostics"):a.group="hidden"}else if(e<12)for(let a of n.auditRefs)a.group||(a.group="diagnostics")}if(e<12&&n){let a=new Map;for(let i of n.auditRefs){let o=i.relevantAudits;if(!(!o||!i.acronym))for(let r of o){let s=a.get(r)||[];s.push(i.acronym),a.set(r,s)}}for(let[i,o]of a){if(!o.length)continue;let r=t.audits[i];if(r&&!r.metricSavings){r.metricSavings={};for(let s of o)r.metricSavings[s]=0}}}if(t.environment||(t.environment={benchmarkIndex:0,networkUserAgent:t.userAgent,hostUserAgent:t.userAgent}),t.configSettings.screenEmulation||(t.configSettings.screenEmulation={width:-1,height:-1,deviceScaleFactor:-1,mobile:/mobile/i.test(t.environment.hostUserAgent),disabled:!1}),t.i18n||(t.i18n={}),t.audits["full-page-screenshot"]){let a=t.audits["full-page-screenshot"].details;a?t.fullPageScreenshot={screenshot:a.screenshot,nodes:a.nodes}:t.fullPageScreenshot=null,delete t.audits["full-page-screenshot"]}}var te=U.RATINGS,A=class t{static prepareReportResult(e){let n=JSON.parse(JSON.stringify(e));Un(n);for(let i of Object.values(n.audits))i.details&&(i.details.type==="opportunity"||i.details.type==="table")&&!i.details.isEntityGrouped&&n.entities&&t.classifyEntities(n.entities,i.details);if(typeof n.categories!="object")throw new Error("No categories provided.");let a=new Map;for(let i of Object.values(n.categories))i.auditRefs.forEach(o=>{o.acronym&&a.set(o.acronym,o)}),i.auditRefs.forEach(o=>{let r=n.audits[o.id];o.result=r;let s=Object.keys(o.result.metricSavings||{});if(s.length){o.relevantMetrics=[];for(let p of s){let c=a.get(p);c&&o.relevantMetrics.push(c)}}if(n.stackPacks){let p=[o.id,...o.result.replacesAudits??[]];n.stackPacks.forEach(c=>{let l=p.find(d=>c.descriptions[d]);l&&c.descriptions[l]&&(o.stackPacks=o.stackPacks||[],o.stackPacks.push({title:c.title,iconDataURL:c.iconDataURL,description:c.descriptions[l]}))})}});return n}static getUrlLocatorFn(e){let n=e.find(i=>i.valueType==="url")?.key;if(n&&typeof n=="string")return i=>{let o=i[n];if(typeof o=="string")return o};let a=e.find(i=>i.valueType==="source-location")?.key;if(a)return i=>{let o=i[a];if(typeof o=="object"&&o.type==="source-location")return o.url}}static classifyEntities(e,n){let{items:a,headings:i}=n;if(!a.length||a.some(r=>r.entity))return;let o=t.getUrlLocatorFn(i);if(o)for(let r of a){let s=o(r);if(!s)continue;let p="";try{p=U.parseURL(s).origin}catch{}if(!p)continue;let c=e.find(l=>l.origins.includes(p));c&&(r.entity=c.name)}}static getTableItemSortComparator(e){return(n,a)=>{for(let i of e){let o=n[i],r=a[i];if((typeof o!=typeof r||!["number","string"].includes(typeof o))&&console.warn(`Warning: Attempting to sort unsupported value type: ${i}.`),typeof o=="number"&&typeof r=="number"&&o!==r)return r-o;if(typeof o=="string"&&typeof r=="string"&&o!==r)return o.localeCompare(r)}return 0}}static getEmulationDescriptions(e){let n,a,i,o=e.throttling,r=b.i18n,s=b.strings;switch(e.throttlingMethod){case"provided":i=a=n=s.throttlingProvided;break;case"devtools":{let{cpuSlowdownMultiplier:m,requestLatencyMs:h}=o;n=`${r.formatNumber(m)}x slowdown (DevTools)`,a=`${r.formatMilliseconds(h)} HTTP RTT, ${r.formatKbps(o.downloadThroughputKbps)} down, ${r.formatKbps(o.uploadThroughputKbps)} up (DevTools)`,i=h===150*3.75&&o.downloadThroughputKbps===1.6*1024*.9&&o.uploadThroughputKbps===750*.9?s.runtimeSlow4g:s.runtimeCustom;break}case"simulate":{let{cpuSlowdownMultiplier:m,rttMs:h,throughputKbps:f}=o;n=`${r.formatNumber(m)}x slowdown (Simulated)`,a=`${r.formatMilliseconds(h)} TCP RTT, ${r.formatKbps(f)} throughput (Simulated)`,i=h===150&&f===1.6*1024?s.runtimeSlow4g:s.runtimeCustom;break}default:i=n=a=s.runtimeUnknown}let p=e.channel==="devtools"?!1:e.screenEmulation.disabled,c=e.channel==="devtools"?e.formFactor==="mobile":e.screenEmulation.mobile,l=s.runtimeMobileEmulation;p?l=s.runtimeNoEmulation:c||(l=s.runtimeDesktopEmulation);let d=p?void 0:`${e.screenEmulation.width}x${e.screenEmulation.height}, DPR ${e.screenEmulation.deviceScaleFactor}`;return{deviceEmulation:l,screenEmulation:d,cpuThrottling:n,networkThrottling:a,summary:i}}static showAsPassed(e){switch(e.scoreDisplayMode){case"manual":case"notApplicable":return!0;case"error":case"informative":return!1;case"numeric":case"binary":default:return Number(e.score)>=te.PASS.minScore}}static calculateRating(e,n){if(n==="manual"||n==="notApplicable")return te.PASS.label;if(n==="error")return te.ERROR.label;if(e===null)return te.FAIL.label;let a=te.FAIL.label;return e>=te.PASS.minScore?a=te.PASS.label:e>=te.AVERAGE.minScore&&(a=te.AVERAGE.label),a}static calculateCategoryFraction(e){let n=0,a=0,i=0,o=0;for(let r of e.auditRefs){let s=t.showAsPassed(r.result);if(!(r.group==="hidden"||r.result.scoreDisplayMode==="manual"||r.result.scoreDisplayMode==="notApplicable")){if(r.result.scoreDisplayMode==="informative"){s||++i;continue}++n,o+=r.weight,s&&a++}}return{numPassed:a,numPassableAudits:n,numInformative:i,totalWeight:o}}static isPluginCategory(e){return e.startsWith("lighthouse-plugin-")}static shouldDisplayAsFraction(e){return e==="timespan"||e==="snapshot"}},Je={varianceDisclaimer:"Values are estimated and may vary. The [performance score is calculated](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring/) directly from these metrics.",calculatorLink:"See calculator.",showRelevantAudits:"Show audits relevant to:",opportunityResourceColumnLabel:"Opportunity",opportunitySavingsColumnLabel:"Estimated Savings",errorMissingAuditInfo:"Report error: no audit information",errorLabel:"Error!",warningHeader:"Warnings: ",warningAuditsGroupTitle:"Passed audits but with warnings",passedAuditsGroupTitle:"Passed audits",notApplicableAuditsGroupTitle:"Not applicable",manualAuditsGroupTitle:"Additional items to manually check",toplevelWarningsMessage:"There were issues affecting this run of Lighthouse:",crcInitialNavigation:"Initial Navigation",crcLongestDurationLabel:"Maximum critical path latency:",snippetExpandButtonLabel:"Expand snippet",snippetCollapseButtonLabel:"Collapse snippet",lsPerformanceCategoryDescription:"[Lighthouse](https://developers.google.com/web/tools/lighthouse/) analysis of the current page on an emulated mobile network. Values are estimated and may vary.",labDataTitle:"Lab Data",thirdPartyResourcesLabel:"Show 3rd-party resources",viewTreemapLabel:"View Treemap",viewTraceLabel:"View Trace",dropdownPrintSummary:"Print Summary",dropdownPrintExpanded:"Print Expanded",dropdownCopyJSON:"Copy JSON",dropdownSaveHTML:"Save as HTML",dropdownSaveJSON:"Save as JSON",dropdownViewer:"Open in Viewer",dropdownSaveGist:"Save as Gist",dropdownDarkTheme:"Toggle Dark Theme",dropdownViewUnthrottledTrace:"View Unthrottled Trace",runtimeSettingsDevice:"Device",runtimeSettingsNetworkThrottling:"Network throttling",runtimeSettingsCPUThrottling:"CPU throttling",runtimeSettingsUANetwork:"User agent (network)",runtimeSettingsBenchmark:"Unthrottled CPU/Memory Power",runtimeSettingsAxeVersion:"Axe version",runtimeSettingsScreenEmulation:"Screen emulation",footerIssue:"File an issue",runtimeNoEmulation:"No emulation",runtimeMobileEmulation:"Emulated Moto G Power",runtimeDesktopEmulation:"Emulated Desktop",runtimeUnknown:"Unknown",runtimeSingleLoad:"Single page session",runtimeAnalysisWindow:"Initial page load",runtimeAnalysisWindowTimespan:"User interactions timespan",runtimeAnalysisWindowSnapshot:"Point-in-time snapshot",runtimeSingleLoadTooltip:"This data is taken from a single page session, as opposed to field data summarizing many sessions.",throttlingProvided:"Provided by environment",show:"Show",hide:"Hide",expandView:"Expand view",collapseView:"Collapse view",runtimeSlow4g:"Slow 4G throttling",runtimeCustom:"Custom throttling",firstPartyChipLabel:"1st party",openInANewTabTooltip:"Open in a new tab",unattributable:"Unattributable",insightsNotice:"Later this year, insights will replace performance audits. [Learn more and provide feedback here](https://github.com/GoogleChrome/lighthouse/discussions/16462).",tryInsights:"Try insights",goBackToAudits:"Go back to audits"};var vi=0;function u(t,e,n,a,i){var o,r,s={};for(r in e)r=="ref"?o=e[r]:s[r]=e[r];var p={type:t,props:s,key:n,ref:o,__k:null,__:null,__b:0,__e:null,__d:void 0,__c:null,__h:null,constructor:void 0,__v:--vi,__source:i,__self:a};if(typeof t=="function"&&(o=t.defaultProps))for(r in o)s[r]===void 0&&(s[r]=o[r]);return x.vnode&&x.vnode(p),p}var In=()=>u("svg",{width:"14",viewBox:"0 0 18 16",fill:"none",role:"img",children:u("path",{"fill-rule":"evenodd","clip-rule":"evenodd",d:"M0 2C0 1.17 0.67 0.5 1.5 0.5C2.33 0.5 3 1.17 3 2C3 2.83 2.33 3.5 1.5 3.5C0.67 3.5 0 2.83 0 2ZM0 8C0 7.17 0.67 6.5 1.5 6.5C2.33 6.5 3 7.17 3 8C3 8.83 2.33 9.5 1.5 9.5C0.67 9.5 0 8.83 0 8ZM1.5 12.5C0.67 12.5 0 13.18 0 14C0 14.82 0.68 15.5 1.5 15.5C2.32 15.5 3 14.82 3 14C3 13.18 2.33 12.5 1.5 12.5ZM18 15H5V13H18V15ZM5 9H18V7H5V9ZM5 3V1H18V3H5Z",fill:"currentColor"})}),Ze=()=>u("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none",role:"img","aria-label":"Icon representing a navigation report",children:u("circle",{cx:"8",cy:"8",r:"7",fill:"none",stroke:"currentColor","stroke-width":"2"})}),Ke=()=>u("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none",role:"img","aria-label":"Icon representing a timespan report",children:[u("circle",{cx:"8",cy:"8",r:"7",fill:"none",stroke:"currentColor","stroke-width":"2"}),u("path",{d:"m 8,4 v 4 l 4,1.9999998",stroke:"currentColor","stroke-width":"1.5"})]}),Xe=()=>u("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 16 16",fill:"none",role:"img","aria-label":"Icon representing a snapshot report",children:u("path",{"fill-rule":"evenodd","clip-rule":"evenodd",d:"M 12.2038,12.2812 C 11.1212,13.3443 9.6372,14 8,14 7.81038,14 7.62281,13.9912 7.43768,13.974 L 10.3094,9 Z M 12.8925,11.4741 10.0207,6.5 H 13.811 C 13.9344,6.97943 14,7.48205 14,8 c 0,1.2947 -0.4101,2.4937 -1.1075,3.4741 z M 13.456,5.5 H 7.71135 L 9.6065,2.21749 C 11.3203,2.69259 12.7258,3.90911 13.456,5.5 Z M 8.5624,2.02601 C 8.3772,2.0088 8.1896,2 8,2 6.36282,2 4.8788,2.65572 3.79622,3.71885 L 5.69061,7.00002 Z M 3.10749,4.52594 C 2.4101,5.5063 2,6.70526 2,8 2,8.5179 2.06563,9.0206 2.18903,9.5 H 5.97927 Z M 2.54404,10.5 c 0.73017,1.5909 2.1357,2.8074 3.84949,3.2825 L 8.2887,10.5 Z M 16,8 c 0,4.4183 -3.5817,8 -8,8 C 3.58172,16 0,12.4183 0,8 0,3.58172 3.58172,0 8,0 c 4.4183,0 8,3.58172 8,8 z",fill:"currentColor"})}),Rn=()=>u("svg",{xmlns:"http://www.w3.org/2000/svg",height:"24px",viewBox:"0 0 24 24",width:"24px",fill:"currentColor",role:"img","aria-label":"Icon representing a close action",children:[u("path",{d:"M0 0h24v24H0V0z",fill:"none"}),u("path",{d:"M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"})]}),Nn=()=>u("svg",{width:"15",height:"12",viewBox:"0 0 15 12",fill:"none",role:"img",children:u("path",{"fill-rule":"evenodd","clip-rule":"evenodd",d:"M3.33317 2.00008H13.9998V0.666748H3.33317C2.59984 0.666748 1.99984 1.26675 1.99984 2.00008V9.33341H0.666504V11.3334H7.99984V9.33341H3.33317V2.00008ZM13.9998 3.33341H9.99984C9.63317 3.33341 9.33317 3.63341 9.33317 4.00008V10.6667C9.33317 11.0334 9.63317 11.3334 9.99984 11.3334H13.9998C14.3665 11.3334 14.6665 11.0334 14.6665 10.6667V4.00008C14.6665 3.63341 14.3665 3.33341 13.9998 3.33341ZM10.6665 9.33341H13.3332V4.66675H10.6665V9.33341Z",fill:"currentColor"})}),Dn=()=>u("svg",{width:"16",height:"11",viewBox:"0 0 16 11",fill:"none",role:"img",children:u("path",{"fill-rule":"evenodd","clip-rule":"evenodd",d:"M0.666687 3.26663L2.00002 4.59997C3.92002 2.67997 6.52669 1.87997 9.02002 2.18663L9.81335 0.399966C6.59335 -0.173367 3.16002 0.779966 0.666687 3.26663ZM10.6 0.599966C10.4867 0.599966 10.3867 0.659966 10.3267 0.753299L10.28 0.853299L6.82669 8.61996C6.72002 8.8133 6.65335 9.02663 6.65335 9.25996C6.65335 9.99996 7.25335 10.6 7.99335 10.6C8.63335 10.6 9.17335 10.1466 9.30002 9.53996L9.30669 9.51997L10.9334 0.933299C10.9334 0.746633 10.7867 0.599966 10.6 0.599966ZM15.3334 3.26663L14 4.59997C13.1867 3.78663 12.2534 3.17997 11.2534 2.76663L11.6067 0.886633C12.9667 1.38663 14.24 2.1733 15.3334 3.26663ZM11.3334 7.26663L12.6667 5.9333C12.1334 5.39997 11.5334 4.98663 10.8934 4.6733L10.5267 6.61997C10.8067 6.79997 11.08 7.0133 11.3334 7.26663ZM4.66669 7.26663L3.33335 5.9333C4.67335 4.5933 6.45335 3.95997 8.20669 4.0133L7.35335 5.9333C6.37335 6.0733 5.42002 6.5133 4.66669 7.26663Z",fill:"currentColor"})}),zn=()=>u("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none",role:"img",children:u("path",{"fill-rule":"evenodd","clip-rule":"evenodd",d:"M15.5 7.16667V5.5H13.8333V3.83333C13.8333 2.91667 13.0833 2.16667 12.1667 2.16667H10.5V0.5H8.83333V2.16667H7.16667V0.5H5.5V2.16667H3.83333C2.91667 2.16667 2.16667 2.91667 2.16667 3.83333V5.5H0.5V7.16667H2.16667V8.83333H0.5V10.5H2.16667V12.1667C2.16667 13.0833 2.91667 13.8333 3.83333 13.8333H5.5V15.5H7.16667V13.8333H8.83333V15.5H10.5V13.8333H12.1667C13.0833 13.8333 13.8333 13.0833 13.8333 12.1667V10.5H15.5V8.83333H13.8333V7.16667H15.5ZM10.5 5.5H5.5V10.5H10.5V5.5ZM3.83333 12.1667H12.1667V3.83333H3.83333V12.1667Z",fill:"currentColor"})}),jn=()=>u("svg",{viewBox:"0 0 18 12",width:"18",height:"12",role:"img",children:[u("rect",{width:"18",height:"2",fill:"currentColor"}),u("rect",{y:"5",width:"18",height:"2",fill:"currentColor"}),u("rect",{y:"10",width:"18",height:"2",fill:"currentColor"})]}),Mn=()=>u("svg",{width:"14",height:"14",viewBox:"0 0 14 14",fill:"none",children:u("path",{"fill-rule":"evenodd","clip-rule":"evenodd",d:"M13 7C13 10.3137 10.3137 13 7 13C3.68629 13 1 10.3137 1 7C1 3.68629 3.68629 1 7 1C10.3137 1 13 3.68629 13 7ZM14 7C14 10.866 10.866 14 7 14C3.13401 14 0 10.866 0 7C0 3.13401 3.13401 0 7 0C10.866 0 14 3.13401 14 7ZM7.66658 11H6.33325V9.66667H7.66658V11ZM4.33325 5.66667C4.33325 4.19333 5.52659 3 6.99992 3C8.47325 3 9.66658 4.19333 9.66658 5.66667C9.66658 6.52194 9.1399 6.98221 8.62709 7.43036C8.1406 7.85551 7.66658 8.26975 7.66658 9H6.33325C6.33325 7.78582 6.96133 7.30439 7.51355 6.88112C7.94674 6.54907 8.33325 6.25281 8.33325 5.66667C8.33325 4.93333 7.73325 4.33333 6.99992 4.33333C6.26658 4.33333 5.66658 4.93333 5.66658 5.66667H4.33325Z",fill:"currentColor"})});var xt=Pe(void 0),St=Pe({});function Hn(t){return new URLSearchParams(location.hash.replace("#","?")).get(t)}function ve(...t){let e=[];for(let n of t){if(!n)continue;if(typeof n=="string"){e.push(n);continue}let a=Object.entries(n).filter(([i,o])=>o).map(([i])=>i);e.push(...a)}return e.join(" ")}function Fn(t){let{width:e,height:n}=t.configSettings.screenEmulation;return{width:e,height:n}}function On(t){let e=t.audits["screenshot-thumbnails"];return e&&e.details&&e.details.type==="filmstrip"&&e.details.items||void 0}function Ye(t,e){switch(t){case"navigation":return e.navigationDescription;case"timespan":return e.timespanDescription;case"snapshot":return e.snapshotDescription}}function B(){let t=Ee(xt);if(!t)throw Error("useFlowResult must be called in the FlowResultContext");return t}function bi(...t){let[e,n]=ae(t.map(Hn));return $e(()=>{function a(){let i=t.map(Hn);i.every((o,r)=>o===e[r])||n(i)}return window.addEventListener("hashchange",a),()=>window.removeEventListener("hashchange",a)},[e]),e}function be(){let t=B(),[e,n]=bi("index","anchor");return Q(()=>{if(!e)return null;let a=Number(e);if(!Number.isFinite(a))return console.warn(`Invalid hash index: ${e}`),null;let i=t.steps[a];return i?{currentLhr:i.lhr,index:a,anchor:n}:(console.warn(`No flow step at index ${a}`),null)},[e,t,n])}function ie(t,e){let n=We(null);return qe(()=>{if(!n.current)return;let a=t();return n.current.append(a),()=>{n.current?.contains(a)&&n.current.removeChild(a)}},e),n}function Bn(){return Ee(St)}var yi=500,$=()=>u("div",{className:"Separator",role:"separator"}),kt=({mode:t})=>u(N,{children:[t==="navigation"&&u(Ze,{}),t==="timespan"&&u(Ke,{}),t==="snapshot"&&u(Xe,{})]}),oe=({mode:t})=>u("div",{className:"FlowSegment",children:[u("div",{className:"FlowSegment__top-line"}),t&&u(kt,{mode:t}),u("div",{className:"FlowSegment__bottom-line"})]}),_i=({frames:t,width:e,height:n})=>{let[a,i]=ae(0),o=a%t.length;return $e(()=>{let r=setInterval(()=>i(s=>(s+1)%t.length),yi);return()=>clearInterval(r)},[t.length]),u("img",{className:"FlowStepThumbnail","data-testid":"FlowStepAnimatedThumbnail",src:t[o].data,style:{width:e,height:n},alt:"Animated screenshots of a page tested by Lighthouse"})},Qe=({lhr:t,width:e,height:n})=>{let a=On(t),i=Fn(t);if(e&&n===void 0?n=i.height*e/i.width:n&&e===void 0&&(e=i.width*n/i.height),!e||!n)return console.warn(new Error("FlowStepThumbnail requested without any dimensions").stack),u(N,{});let o;if(a?.length){if(o=a[a.length-1].data,t.gatherMode==="timespan")return u(_i,{frames:a,width:e,height:n})}else o=U.getFullPageScreenshot(t)?.screenshot.data;return u(N,{children:o&&u("img",{className:"FlowStepThumbnail",src:o,style:{width:e,height:n},alt:"Screenshot of a page tested by Lighthouse"})})};var Pt=function(t,e){return Pt=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(n,a){n.__proto__=a}||function(n,a){for(var i in a)Object.prototype.hasOwnProperty.call(a,i)&&(n[i]=a[i])},Pt(t,e)};function Le(t,e){if(typeof e!="function"&&e!==null)throw new TypeError("Class extends value "+String(e)+" is not a constructor or null");Pt(t,e);function n(){this.constructor=t}t.prototype=e===null?Object.create(e):(n.prototype=e.prototype,new n)}var J=function(){return J=Object.assign||function(e){for(var n,a=1,i=arguments.length;a<i;a++){n=arguments[a];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e},J.apply(this,arguments)};function Gn(t,e){var n={};for(var a in t)Object.prototype.hasOwnProperty.call(t,a)&&e.indexOf(a)<0&&(n[a]=t[a]);if(t!=null&&typeof Object.getOwnPropertySymbols=="function")for(var i=0,a=Object.getOwnPropertySymbols(t);i<a.length;i++)e.indexOf(a[i])<0&&Object.prototype.propertyIsEnumerable.call(t,a[i])&&(n[a[i]]=t[a[i]]);return n}function et(t,e,n){if(n||arguments.length===2)for(var a=0,i=e.length,o;a<i;a++)(o||!(a in e))&&(o||(o=Array.prototype.slice.call(e,0,a)),o[a]=e[a]);return t.concat(o||Array.prototype.slice.call(e))}var ye=function(){return ye=Object.assign||function(e){for(var n,a=1,i=arguments.length;a<i;a++){n=arguments[a];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e},ye.apply(this,arguments)};var S;(function(t){t[t.EXPECT_ARGUMENT_CLOSING_BRACE=1]="EXPECT_ARGUMENT_CLOSING_BRACE",t[t.EMPTY_ARGUMENT=2]="EMPTY_ARGUMENT",t[t.MALFORMED_ARGUMENT=3]="MALFORMED_ARGUMENT",t[t.EXPECT_ARGUMENT_TYPE=4]="EXPECT_ARGUMENT_TYPE",t[t.INVALID_ARGUMENT_TYPE=5]="INVALID_ARGUMENT_TYPE",t[t.EXPECT_ARGUMENT_STYLE=6]="EXPECT_ARGUMENT_STYLE",t[t.INVALID_NUMBER_SKELETON=7]="INVALID_NUMBER_SKELETON",t[t.INVALID_DATE_TIME_SKELETON=8]="INVALID_DATE_TIME_SKELETON",t[t.EXPECT_NUMBER_SKELETON=9]="EXPECT_NUMBER_SKELETON",t[t.EXPECT_DATE_TIME_SKELETON=10]="EXPECT_DATE_TIME_SKELETON",t[t.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE=11]="UNCLOSED_QUOTE_IN_ARGUMENT_STYLE",t[t.EXPECT_SELECT_ARGUMENT_OPTIONS=12]="EXPECT_SELECT_ARGUMENT_OPTIONS",t[t.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE=13]="EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE",t[t.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE=14]="INVALID_PLURAL_ARGUMENT_OFFSET_VALUE",t[t.EXPECT_SELECT_ARGUMENT_SELECTOR=15]="EXPECT_SELECT_ARGUMENT_SELECTOR",t[t.EXPECT_PLURAL_ARGUMENT_SELECTOR=16]="EXPECT_PLURAL_ARGUMENT_SELECTOR",t[t.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT=17]="EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT",t[t.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT=18]="EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT",t[t.INVALID_PLURAL_ARGUMENT_SELECTOR=19]="INVALID_PLURAL_ARGUMENT_SELECTOR",t[t.DUPLICATE_PLURAL_ARGUMENT_SELECTOR=20]="DUPLICATE_PLURAL_ARGUMENT_SELECTOR",t[t.DUPLICATE_SELECT_ARGUMENT_SELECTOR=21]="DUPLICATE_SELECT_ARGUMENT_SELECTOR",t[t.MISSING_OTHER_CLAUSE=22]="MISSING_OTHER_CLAUSE",t[t.INVALID_TAG=23]="INVALID_TAG",t[t.INVALID_TAG_NAME=25]="INVALID_TAG_NAME",t[t.UNMATCHED_CLOSING_TAG=26]="UNMATCHED_CLOSING_TAG",t[t.UNCLOSED_TAG=27]="UNCLOSED_TAG"})(S||(S={}));var T;(function(t){t[t.literal=0]="literal",t[t.argument=1]="argument",t[t.number=2]="number",t[t.date=3]="date",t[t.time=4]="time",t[t.select=5]="select",t[t.plural=6]="plural",t[t.pound=7]="pound",t[t.tag=8]="tag"})(T||(T={}));var pe;(function(t){t[t.number=0]="number",t[t.dateTime=1]="dateTime"})(pe||(pe={}));function At(t){return t.type===T.literal}function Vn(t){return t.type===T.argument}function tt(t){return t.type===T.number}function nt(t){return t.type===T.date}function at(t){return t.type===T.time}function it(t){return t.type===T.select}function ot(t){return t.type===T.plural}function $n(t){return t.type===T.pound}function rt(t){return t.type===T.tag}function st(t){return!!(t&&typeof t=="object"&&t.type===pe.number)}function Te(t){return!!(t&&typeof t=="object"&&t.type===pe.dateTime)}var Et=/[ \xA0\u1680\u2000-\u200A\u202F\u205F\u3000]/;var Ci=/(?:[Eec]{1,6}|G{1,5}|[Qq]{1,5}|(?:[yYur]+|U{1,5})|[ML]{1,5}|d{1,2}|D{1,3}|F{1}|[abB]{1,5}|[hkHK]{1,2}|w{1,2}|W{1}|m{1,2}|s{1,2}|[zZOvVxX]{1,4})(?=([^']*'[^']*')*[^']*$)/g;function qn(t){var e={};return t.replace(Ci,function(n){var a=n.length;switch(n[0]){case"G":e.era=a===4?"long":a===5?"narrow":"short";break;case"y":e.year=a===2?"2-digit":"numeric";break;case"Y":case"u":case"U":case"r":throw new RangeError("`Y/u/U/r` (year) patterns are not supported, use `y` instead");case"q":case"Q":throw new RangeError("`q/Q` (quarter) patterns are not supported");case"M":case"L":e.month=["numeric","2-digit","short","long","narrow"][a-1];break;case"w":case"W":throw new RangeError("`w/W` (week) patterns are not supported");case"d":e.day=["numeric","2-digit"][a-1];break;case"D":case"F":case"g":throw new RangeError("`D/F/g` (day) patterns are not supported, use `d` instead");case"E":e.weekday=a===4?"short":a===5?"narrow":"short";break;case"e":if(a<4)throw new RangeError("`e..eee` (weekday) patterns are not supported");e.weekday=["short","long","narrow","short"][a-4];break;case"c":if(a<4)throw new RangeError("`c..ccc` (weekday) patterns are not supported");e.weekday=["short","long","narrow","short"][a-4];break;case"a":e.hour12=!0;break;case"b":case"B":throw new RangeError("`b/B` (period) patterns are not supported, use `a` instead");case"h":e.hourCycle="h12",e.hour=["numeric","2-digit"][a-1];break;case"H":e.hourCycle="h23",e.hour=["numeric","2-digit"][a-1];break;case"K":e.hourCycle="h11",e.hour=["numeric","2-digit"][a-1];break;case"k":e.hourCycle="h24",e.hour=["numeric","2-digit"][a-1];break;case"j":case"J":case"C":throw new RangeError("`j/J/C` (hour) patterns are not supported, use `h/H/K/k` instead");case"m":e.minute=["numeric","2-digit"][a-1];break;case"s":e.second=["numeric","2-digit"][a-1];break;case"S":case"A":throw new RangeError("`S/A` (second) patterns are not supported, use `s` instead");case"z":e.timeZoneName=a<4?"short":"long";break;case"Z":case"O":case"v":case"V":case"X":case"x":throw new RangeError("`Z/O/v/V/X/x` (timeZone) patterns are not supported, use `z` instead")}return""}),e}var I=function(){return I=Object.assign||function(e){for(var n,a=1,i=arguments.length;a<i;a++){n=arguments[a];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e},I.apply(this,arguments)};var Wn=/[\t-\r \x85\u200E\u200F\u2028\u2029]/i;function Xn(t){if(t.length===0)throw new Error("Number skeleton cannot be empty");for(var e=t.split(Wn).filter(function(m){return m.length>0}),n=[],a=0,i=e;a<i.length;a++){var o=i[a],r=o.split("/");if(r.length===0)throw new Error("Invalid number skeleton");for(var s=r[0],p=r.slice(1),c=0,l=p;c<l.length;c++){var d=l[c];if(d.length===0)throw new Error("Invalid number skeleton")}n.push({stem:s,options:p})}return n}function wi(t){return t.replace(/^(.*?)-/,"")}var Jn=/^\.(?:(0+)(\*)?|(#+)|(0+)(#+))$/g,Yn=/^(@+)?(\+|#+)?[rs]?$/g,xi=/(\*)(0+)|(#+)(0+)|(0+)/g,Qn=/^(0+)$/;function Zn(t){var e={};return t[t.length-1]==="r"?e.roundingPriority="morePrecision":t[t.length-1]==="s"&&(e.roundingPriority="lessPrecision"),t.replace(Yn,function(n,a,i){return typeof i!="string"?(e.minimumSignificantDigits=a.length,e.maximumSignificantDigits=a.length):i==="+"?e.minimumSignificantDigits=a.length:a[0]==="#"?e.maximumSignificantDigits=a.length:(e.minimumSignificantDigits=a.length,e.maximumSignificantDigits=a.length+(typeof i=="string"?i.length:0)),""}),e}function ea(t){switch(t){case"sign-auto":return{signDisplay:"auto"};case"sign-accounting":case"()":return{currencySign:"accounting"};case"sign-always":case"+!":return{signDisplay:"always"};case"sign-accounting-always":case"()!":return{signDisplay:"always",currencySign:"accounting"};case"sign-except-zero":case"+?":return{signDisplay:"exceptZero"};case"sign-accounting-except-zero":case"()?":return{signDisplay:"exceptZero",currencySign:"accounting"};case"sign-never":case"+_":return{signDisplay:"never"}}}function Si(t){var e;if(t[0]==="E"&&t[1]==="E"?(e={notation:"engineering"},t=t.slice(2)):t[0]==="E"&&(e={notation:"scientific"},t=t.slice(1)),e){var n=t.slice(0,2);if(n==="+!"?(e.signDisplay="always",t=t.slice(2)):n==="+?"&&(e.signDisplay="exceptZero",t=t.slice(2)),!Qn.test(t))throw new Error("Malformed concise eng/scientific notation");e.minimumIntegerDigits=t.length}return e}function Kn(t){var e={},n=ea(t);return n||e}function ta(t){for(var e={},n=0,a=t;n<a.length;n++){var i=a[n];switch(i.stem){case"percent":case"%":e.style="percent";continue;case"%x100":e.style="percent",e.scale=100;continue;case"currency":e.style="currency",e.currency=i.options[0];continue;case"group-off":case",_":e.useGrouping=!1;continue;case"precision-integer":case".":e.maximumFractionDigits=0;continue;case"measure-unit":case"unit":e.style="unit",e.unit=wi(i.options[0]);continue;case"compact-short":case"K":e.notation="compact",e.compactDisplay="short";continue;case"compact-long":case"KK":e.notation="compact",e.compactDisplay="long";continue;case"scientific":e=I(I(I({},e),{notation:"scientific"}),i.options.reduce(function(p,c){return I(I({},p),Kn(c))},{}));continue;case"engineering":e=I(I(I({},e),{notation:"engineering"}),i.options.reduce(function(p,c){return I(I({},p),Kn(c))},{}));continue;case"notation-simple":e.notation="standard";continue;case"unit-width-narrow":e.currencyDisplay="narrowSymbol",e.unitDisplay="narrow";continue;case"unit-width-short":e.currencyDisplay="code",e.unitDisplay="short";continue;case"unit-width-full-name":e.currencyDisplay="name",e.unitDisplay="long";continue;case"unit-width-iso-code":e.currencyDisplay="symbol";continue;case"scale":e.scale=parseFloat(i.options[0]);continue;case"integer-width":if(i.options.length>1)throw new RangeError("integer-width stems only accept a single optional option");i.options[0].replace(xi,function(p,c,l,d,m,h){if(c)e.minimumIntegerDigits=l.length;else{if(d&&m)throw new Error("We currently do not support maximum integer digits");if(h)throw new Error("We currently do not support exact integer digits")}return""});continue}if(Qn.test(i.stem)){e.minimumIntegerDigits=i.stem.length;continue}if(Jn.test(i.stem)){if(i.options.length>1)throw new RangeError("Fraction-precision stems only accept a single optional option");i.stem.replace(Jn,function(p,c,l,d,m,h){return l==="*"?e.minimumFractionDigits=c.length:d&&d[0]==="#"?e.maximumFractionDigits=d.length:m&&h?(e.minimumFractionDigits=m.length,e.maximumFractionDigits=m.length+h.length):(e.minimumFractionDigits=c.length,e.maximumFractionDigits=c.length),""});var o=i.options[0];o==="w"?e=I(I({},e),{trailingZeroDisplay:"stripIfInteger"}):o&&(e=I(I({},e),Zn(o)));continue}if(Yn.test(i.stem)){e=I(I({},e),Zn(i.stem));continue}var r=ea(i.stem);r&&(e=I(I({},e),r));var s=Si(i.stem);s&&(e=I(I({},e),s))}return e}var Ue={"001":["H","h"],AC:["H","h","hb","hB"],AD:["H","hB"],AE:["h","hB","hb","H"],AF:["H","hb","hB","h"],AG:["h","hb","H","hB"],AI:["H","h","hb","hB"],AL:["h","H","hB"],AM:["H","hB"],AO:["H","hB"],AR:["H","h","hB","hb"],AS:["h","H"],AT:["H","hB"],AU:["h","hb","H","hB"],AW:["H","hB"],AX:["H"],AZ:["H","hB","h"],BA:["H","hB","h"],BB:["h","hb","H","hB"],BD:["h","hB","H"],BE:["H","hB"],BF:["H","hB"],BG:["H","hB","h"],BH:["h","hB","hb","H"],BJ:["H","hB"],BL:["H","hB"],BM:["h","hb","H","hB"],BN:["hb","hB","h","H"],BO:["H","hB","h","hb"],BQ:["H"],BR:["H","hB"],BS:["h","hb","H","hB"],BT:["h","H"],BW:["H","h","hb","hB"],BZ:["H","h","hb","hB"],CA:["h","hb","H","hB"],CC:["H","h","hb","hB"],CD:["hB","H"],CF:["H","h","hB"],CG:["H","hB"],CH:["H","hB","h"],CI:["H","hB"],CK:["H","h","hb","hB"],CL:["H","h","hB","hb"],CM:["H","h","hB"],CN:["H","hB","hb","h"],CO:["h","H","hB","hb"],CP:["H"],CR:["H","h","hB","hb"],CU:["H","h","hB","hb"],CV:["H","hB"],CX:["H","h","hb","hB"],CY:["h","H","hb","hB"],CZ:["H"],DE:["H","hB"],DG:["H","h","hb","hB"],DJ:["h","H"],DK:["H"],DM:["h","hb","H","hB"],DO:["h","H","hB","hb"],DZ:["h","hB","hb","H"],EA:["H","h","hB","hb"],EC:["H","hB","h","hb"],EE:["H","hB"],EG:["h","hB","hb","H"],EH:["h","hB","hb","H"],ER:["h","H"],ES:["H","hB","h","hb"],ET:["hB","hb","h","H"],FI:["H"],FJ:["h","hb","H","hB"],FK:["H","h","hb","hB"],FM:["h","hb","H","hB"],FR:["H","hB"],GA:["H","hB"],GB:["H","h","hb","hB"],GD:["h","hb","H","hB"],GE:["H","hB","h"],GF:["H","hB"],GG:["H","h","hb","hB"],GH:["h","H"],GI:["H","h","hb","hB"],GM:["h","hb","H","hB"],GN:["H","hB"],GP:["H","hB"],GQ:["H","hB","h","hb"],GR:["h","H","hb","hB"],GT:["H","h","hB","hb"],GU:["h","hb","H","hB"],GW:["H","hB"],GY:["h","hb","H","hB"],HK:["h","hB","hb","H"],HN:["H","h","hB","hb"],HR:["H","hB"],IC:["H","h","hB","hb"],ID:["H"],IE:["H","h","hb","hB"],IL:["H","hB"],IM:["H","h","hb","hB"],IN:["h","H"],IO:["H","h","hb","hB"],IQ:["h","hB","hb","H"],IR:["hB","H"],IS:["H"],IT:["H","hB"],JE:["H","h","hb","hB"],JM:["h","hb","H","hB"],JO:["h","hB","hb","H"],JP:["H","h","K"],KE:["hB","hb","H","h"],KG:["H","h","hB","hb"],KH:["hB","h","H","hb"],KI:["h","hb","H","hB"],KM:["H","h","hB","hb"],KN:["h","hb","H","hB"],KP:["h","H","hB","hb"],KR:["h","H","hB","hb"],KW:["h","hB","hb","H"],KY:["h","hb","H","hB"],KZ:["H","hB"],LA:["H","hb","hB","h"],LB:["h","hB","hb","H"],LC:["h","hb","H","hB"],LI:["H","hB","h"],LK:["H","h","hB","hb"],LR:["h","hb","H","hB"],LS:["h","H"],LT:["H","h","hb","hB"],LU:["H","h","hB"],LV:["H","hB","hb","h"],LY:["h","hB","hb","H"],MA:["H","h","hB","hb"],MC:["H","hB"],MD:["H","hB"],ME:["H","hB","h"],MF:["H","hB"],MH:["h","hb","H","hB"],MK:["H","h","hb","hB"],ML:["H"],MM:["hB","hb","H","h"],MN:["H","h","hb","hB"],MO:["h","hB","hb","H"],MP:["h","hb","H","hB"],MQ:["H","hB"],MR:["h","hB","hb","H"],MS:["H","h","hb","hB"],MW:["h","hb","H","hB"],MX:["H","h","hB","hb"],MY:["hb","hB","h","H"],MZ:["H","hB"],NA:["h","H","hB","hb"],NC:["H","hB"],NE:["H"],NF:["H","h","hb","hB"],NG:["H","h","hb","hB"],NI:["H","h","hB","hb"],NL:["H","hB"],NP:["H","h","hB"],NR:["H","h","hb","hB"],NU:["H","h","hb","hB"],NZ:["h","hb","H","hB"],OM:["h","hB","hb","H"],PA:["h","H","hB","hb"],PE:["H","hB","h","hb"],PF:["H","h","hB"],PG:["h","H"],PH:["h","hB","hb","H"],PK:["h","hB","H"],PM:["H","hB"],PN:["H","h","hb","hB"],PR:["h","H","hB","hb"],PS:["h","hB","hb","H"],PT:["H","hB"],PW:["h","H"],PY:["H","h","hB","hb"],QA:["h","hB","hb","H"],RE:["H","hB"],RO:["H","hB"],RS:["H","hB","h"],RU:["H"],SA:["h","hB","hb","H"],SB:["h","hb","H","hB"],SC:["H","h","hB"],SD:["h","hB","hb","H"],SE:["H"],SG:["h","hb","H","hB"],SH:["H","h","hb","hB"],SI:["H","hB"],SJ:["H"],SK:["H"],SL:["h","hb","H","hB"],SM:["H","h","hB"],SN:["H","h","hB"],SO:["h","H"],SR:["H","hB"],SS:["h","hb","H","hB"],ST:["H","hB"],SV:["H","h","hB","hb"],SX:["H","h","hb","hB"],SY:["h","hB","hb","H"],SZ:["h","hb","H","hB"],TA:["H","h","hb","hB"],TC:["h","hb","H","hB"],TD:["h","H","hB"],TF:["H","h","hB"],TG:["H","hB"],TL:["H","hB","hb","h"],TN:["h","hB","hb","H"],TO:["h","H"],TR:["H","hB"],TT:["h","hb","H","hB"],TW:["hB","hb","h","H"],TZ:["hB","hb","H","h"],UA:["H","hB","h"],UG:["hB","hb","H","h"],UM:["h","hb","H","hB"],US:["h","hb","H","hB"],UY:["H","h","hB","hb"],UZ:["H","hB","h"],VA:["H","h","hB"],VC:["h","hb","H","hB"],VE:["h","H","hB","hb"],VG:["h","hb","H","hB"],VI:["h","hb","H","hB"],VU:["h","H"],WF:["H","hB"],WS:["h","H"],XK:["H","hB","h"],YE:["h","hB","hb","H"],YT:["H","hB"],ZA:["H","h","hb","hB"],ZM:["h","hb","H","hB"],"af-ZA":["H","h","hB","hb"],"ar-001":["h","hB","hb","H"],"ca-ES":["H","h","hB"],"en-001":["h","hb","H","hB"],"es-BO":["H","h","hB","hb"],"es-BR":["H","h","hB","hb"],"es-EC":["H","h","hB","hb"],"es-ES":["H","h","hB","hb"],"es-GQ":["H","h","hB","hb"],"es-PE":["H","h","hB","hb"],"fr-CA":["H","h","hB"],"gl-ES":["H","h","hB"],"gu-IN":["hB","hb","h","H"],"hi-IN":["hB","h","H"],"it-CH":["H","h","hB"],"it-IT":["H","h","hB"],"kn-IN":["hB","h","H"],"ml-IN":["hB","h","H"],"mr-IN":["hB","hb","h","H"],"pa-IN":["hB","hb","h","H"],"ta-IN":["hB","h","hb","H"],"te-IN":["hB","h","H"],"zu-ZA":["H","hB","hb","h"]};function na(t,e){for(var n="",a=0;a<t.length;a++){var i=t.charAt(a);if(i==="j"){for(var o=0;a+1<t.length&&t.charAt(a+1)===i;)o++,a++;var r=1+(o&1),s=o<2?1:3+(o>>1),p="a",c=ki(e);for((c=="H"||c=="k")&&(s=0);s-- >0;)n+=p;for(;r-- >0;)n=c+n}else i==="J"?n+="H":n+=i}return n}function ki(t){var e=t.hourCycle;if(e===void 0&&t.hourCycles&&t.hourCycles.length&&(e=t.hourCycles[0]),e)switch(e){case"h24":return"k";case"h23":return"H";case"h12":return"h";case"h11":return"K";default:throw new Error("Invalid hourCycle")}var n=t.language,a;n!=="root"&&(a=t.maximize().region);var i=Ue[a||""]||Ue[n||""]||Ue["".concat(n,"-001")]||Ue["001"];return i[0]}var Lt,Pi=new RegExp("^".concat(Et.source,"*")),Ai=new RegExp("".concat(Et.source,"*$"));function k(t,e){return{start:t,end:e}}var Ei=!!String.prototype.startsWith&&"_a".startsWith("a",1),Li=!!String.fromCodePoint,Ti=!!Object.fromEntries,Ui=!!String.prototype.codePointAt,Ii=!!String.prototype.trimStart,Ri=!!String.prototype.trimEnd,Ni=!!Number.isSafeInteger,Di=Ni?Number.isSafeInteger:function(t){return typeof t=="number"&&isFinite(t)&&Math.floor(t)===t&&Math.abs(t)<=9007199254740991},Ut=!0;try{aa=sa("([^\\p{White_Space}\\p{Pattern_Syntax}]*)","yu"),Ut=((Lt=aa.exec("a"))===null||Lt===void 0?void 0:Lt[0])==="a"}catch{Ut=!1}var aa,ia=Ei?function(e,n,a){return e.startsWith(n,a)}:function(e,n,a){return e.slice(a,a+n.length)===n},It=Li?String.fromCodePoint:function(){for(var e=[],n=0;n<arguments.length;n++)e[n]=arguments[n];for(var a="",i=e.length,o=0,r;i>o;){if(r=e[o++],r>1114111)throw RangeError(r+" is not a valid code point");a+=r<65536?String.fromCharCode(r):String.fromCharCode(((r-=65536)>>10)+55296,r%1024+56320)}return a},oa=Ti?Object.fromEntries:function(e){for(var n={},a=0,i=e;a<i.length;a++){var o=i[a],r=o[0],s=o[1];n[r]=s}return n},ra=Ui?function(e,n){return e.codePointAt(n)}:function(e,n){var a=e.length;if(!(n<0||n>=a)){var i=e.charCodeAt(n),o;return i<55296||i>56319||n+1===a||(o=e.charCodeAt(n+1))<56320||o>57343?i:(i-55296<<10)+(o-56320)+65536}},zi=Ii?function(e){return e.trimStart()}:function(e){return e.replace(Pi,"")},ji=Ri?function(e){return e.trimEnd()}:function(e){return e.replace(Ai,"")};function sa(t,e){return new RegExp(t,e)}var Rt;Ut?(Tt=sa("([^\\p{White_Space}\\p{Pattern_Syntax}]*)","yu"),Rt=function(e,n){var a;Tt.lastIndex=n;var i=Tt.exec(e);return(a=i[1])!==null&&a!==void 0?a:""}):Rt=function(e,n){for(var a=[];;){var i=ra(e,n);if(i===void 0||pa(i)||Fi(i))break;a.push(i),n+=i>=65536?2:1}return It.apply(void 0,a)};var Tt,la=function(){function t(e,n){n===void 0&&(n={}),this.message=e,this.position={offset:0,line:1,column:1},this.ignoreTag=!!n.ignoreTag,this.locale=n.locale,this.requiresOtherClause=!!n.requiresOtherClause,this.shouldParseSkeletons=!!n.shouldParseSkeletons}return t.prototype.parse=function(){if(this.offset()!==0)throw Error("parser can only be used once");return this.parseMessage(0,"",!1)},t.prototype.parseMessage=function(e,n,a){for(var i=[];!this.isEOF();){var o=this.char();if(o===123){var r=this.parseArgument(e,a);if(r.err)return r;i.push(r.val)}else{if(o===125&&e>0)break;if(o===35&&(n==="plural"||n==="selectordinal")){var s=this.clonePosition();this.bump(),i.push({type:T.pound,location:k(s,this.clonePosition())})}else if(o===60&&!this.ignoreTag&&this.peek()===47){if(a)break;return this.error(S.UNMATCHED_CLOSING_TAG,k(this.clonePosition(),this.clonePosition()))}else if(o===60&&!this.ignoreTag&&Nt(this.peek()||0)){var r=this.parseTag(e,n);if(r.err)return r;i.push(r.val)}else{var r=this.parseLiteral(e,n);if(r.err)return r;i.push(r.val)}}}return{val:i,err:null}},t.prototype.parseTag=function(e,n){var a=this.clonePosition();this.bump();var i=this.parseTagName();if(this.bumpSpace(),this.bumpIf("/>"))return{val:{type:T.literal,value:"<".concat(i,"/>"),location:k(a,this.clonePosition())},err:null};if(this.bumpIf(">")){var o=this.parseMessage(e+1,n,!0);if(o.err)return o;var r=o.val,s=this.clonePosition();if(this.bumpIf("</")){if(this.isEOF()||!Nt(this.char()))return this.error(S.INVALID_TAG,k(s,this.clonePosition()));var p=this.clonePosition(),c=this.parseTagName();return i!==c?this.error(S.UNMATCHED_CLOSING_TAG,k(p,this.clonePosition())):(this.bumpSpace(),this.bumpIf(">")?{val:{type:T.tag,value:i,children:r,location:k(a,this.clonePosition())},err:null}:this.error(S.INVALID_TAG,k(s,this.clonePosition())))}else return this.error(S.UNCLOSED_TAG,k(a,this.clonePosition()))}else return this.error(S.INVALID_TAG,k(a,this.clonePosition()))},t.prototype.parseTagName=function(){var e=this.offset();for(this.bump();!this.isEOF()&&Hi(this.char());)this.bump();return this.message.slice(e,this.offset())},t.prototype.parseLiteral=function(e,n){for(var a=this.clonePosition(),i="";;){var o=this.tryParseQuote(n);if(o){i+=o;continue}var r=this.tryParseUnquoted(e,n);if(r){i+=r;continue}var s=this.tryParseLeftAngleBracket();if(s){i+=s;continue}break}var p=k(a,this.clonePosition());return{val:{type:T.literal,value:i,location:p},err:null}},t.prototype.tryParseLeftAngleBracket=function(){return!this.isEOF()&&this.char()===60&&(this.ignoreTag||!Mi(this.peek()||0))?(this.bump(),"<"):null},t.prototype.tryParseQuote=function(e){if(this.isEOF()||this.char()!==39)return null;switch(this.peek()){case 39:return this.bump(),this.bump(),"'";case 123:case 60:case 62:case 125:break;case 35:if(e==="plural"||e==="selectordinal")break;return null;default:return null}this.bump();var n=[this.char()];for(this.bump();!this.isEOF();){var a=this.char();if(a===39)if(this.peek()===39)n.push(39),this.bump();else{this.bump();break}else n.push(a);this.bump()}return It.apply(void 0,n)},t.prototype.tryParseUnquoted=function(e,n){if(this.isEOF())return null;var a=this.char();return a===60||a===123||a===35&&(n==="plural"||n==="selectordinal")||a===125&&e>0?null:(this.bump(),It(a))},t.prototype.parseArgument=function(e,n){var a=this.clonePosition();if(this.bump(),this.bumpSpace(),this.isEOF())return this.error(S.EXPECT_ARGUMENT_CLOSING_BRACE,k(a,this.clonePosition()));if(this.char()===125)return this.bump(),this.error(S.EMPTY_ARGUMENT,k(a,this.clonePosition()));var i=this.parseIdentifierIfPossible().value;if(!i)return this.error(S.MALFORMED_ARGUMENT,k(a,this.clonePosition()));if(this.bumpSpace(),this.isEOF())return this.error(S.EXPECT_ARGUMENT_CLOSING_BRACE,k(a,this.clonePosition()));switch(this.char()){case 125:return this.bump(),{val:{type:T.argument,value:i,location:k(a,this.clonePosition())},err:null};case 44:return this.bump(),this.bumpSpace(),this.isEOF()?this.error(S.EXPECT_ARGUMENT_CLOSING_BRACE,k(a,this.clonePosition())):this.parseArgumentOptions(e,n,i,a);default:return this.error(S.MALFORMED_ARGUMENT,k(a,this.clonePosition()))}},t.prototype.parseIdentifierIfPossible=function(){var e=this.clonePosition(),n=this.offset(),a=Rt(this.message,n),i=n+a.length;this.bumpTo(i);var o=this.clonePosition(),r=k(e,o);return{value:a,location:r}},t.prototype.parseArgumentOptions=function(e,n,a,i){var o,r=this.clonePosition(),s=this.parseIdentifierIfPossible().value,p=this.clonePosition();switch(s){case"":return this.error(S.EXPECT_ARGUMENT_TYPE,k(r,p));case"number":case"date":case"time":{this.bumpSpace();var c=null;if(this.bumpIf(",")){this.bumpSpace();var l=this.clonePosition(),d=this.parseSimpleArgStyleIfPossible();if(d.err)return d;var m=ji(d.val);if(m.length===0)return this.error(S.EXPECT_ARGUMENT_STYLE,k(this.clonePosition(),this.clonePosition()));var h=k(l,this.clonePosition());c={style:m,styleLocation:h}}var f=this.tryParseArgumentClose(i);if(f.err)return f;var C=k(i,this.clonePosition());if(c&&ia(c?.style,"::",0)){var g=zi(c.style.slice(2));if(s==="number"){var d=this.parseNumberSkeletonFromString(g,c.styleLocation);return d.err?d:{val:{type:T.number,value:a,location:C,style:d.val},err:null}}else{if(g.length===0)return this.error(S.EXPECT_DATE_TIME_SKELETON,C);var _=g;this.locale&&(_=na(g,this.locale));var m={type:pe.dateTime,pattern:_,location:c.styleLocation,parsedOptions:this.shouldParseSkeletons?qn(_):{}},v=s==="date"?T.date:T.time;return{val:{type:v,value:a,location:C,style:m},err:null}}}return{val:{type:s==="number"?T.number:s==="date"?T.date:T.time,value:a,location:C,style:(o=c?.style)!==null&&o!==void 0?o:null},err:null}}case"plural":case"selectordinal":case"select":{var y=this.clonePosition();if(this.bumpSpace(),!this.bumpIf(","))return this.error(S.EXPECT_SELECT_ARGUMENT_OPTIONS,k(y,ye({},y)));this.bumpSpace();var w=this.parseIdentifierIfPossible(),P=0;if(s!=="select"&&w.value==="offset"){if(!this.bumpIf(":"))return this.error(S.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE,k(this.clonePosition(),this.clonePosition()));this.bumpSpace();var d=this.tryParseDecimalInteger(S.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE,S.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE);if(d.err)return d;this.bumpSpace(),w=this.parseIdentifierIfPossible(),P=d.val}var L=this.tryParsePluralOrSelectOptions(e,s,n,w);if(L.err)return L;var f=this.tryParseArgumentClose(i);if(f.err)return f;var R=k(i,this.clonePosition());return s==="select"?{val:{type:T.select,value:a,options:oa(L.val),location:R},err:null}:{val:{type:T.plural,value:a,options:oa(L.val),offset:P,pluralType:s==="plural"?"cardinal":"ordinal",location:R},err:null}}default:return this.error(S.INVALID_ARGUMENT_TYPE,k(r,p))}},t.prototype.tryParseArgumentClose=function(e){return this.isEOF()||this.char()!==125?this.error(S.EXPECT_ARGUMENT_CLOSING_BRACE,k(e,this.clonePosition())):(this.bump(),{val:!0,err:null})},t.prototype.parseSimpleArgStyleIfPossible=function(){for(var e=0,n=this.clonePosition();!this.isEOF();){var a=this.char();switch(a){case 39:{this.bump();var i=this.clonePosition();if(!this.bumpUntil("'"))return this.error(S.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE,k(i,this.clonePosition()));this.bump();break}case 123:{e+=1,this.bump();break}case 125:{if(e>0)e-=1;else return{val:this.message.slice(n.offset,this.offset()),err:null};break}default:this.bump();break}}return{val:this.message.slice(n.offset,this.offset()),err:null}},t.prototype.parseNumberSkeletonFromString=function(e,n){var a=[];try{a=Xn(e)}catch{return this.error(S.INVALID_NUMBER_SKELETON,n)}return{val:{type:pe.number,tokens:a,location:n,parsedOptions:this.shouldParseSkeletons?ta(a):{}},err:null}},t.prototype.tryParsePluralOrSelectOptions=function(e,n,a,i){for(var o,r=!1,s=[],p=new Set,c=i.value,l=i.location;;){if(c.length===0){var d=this.clonePosition();if(n!=="select"&&this.bumpIf("=")){var m=this.tryParseDecimalInteger(S.EXPECT_PLURAL_ARGUMENT_SELECTOR,S.INVALID_PLURAL_ARGUMENT_SELECTOR);if(m.err)return m;l=k(d,this.clonePosition()),c=this.message.slice(d.offset,this.offset())}else break}if(p.has(c))return this.error(n==="select"?S.DUPLICATE_SELECT_ARGUMENT_SELECTOR:S.DUPLICATE_PLURAL_ARGUMENT_SELECTOR,l);c==="other"&&(r=!0),this.bumpSpace();var h=this.clonePosition();if(!this.bumpIf("{"))return this.error(n==="select"?S.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT:S.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT,k(this.clonePosition(),this.clonePosition()));var f=this.parseMessage(e+1,n,a);if(f.err)return f;var C=this.tryParseArgumentClose(h);if(C.err)return C;s.push([c,{value:f.val,location:k(h,this.clonePosition())}]),p.add(c),this.bumpSpace(),o=this.parseIdentifierIfPossible(),c=o.value,l=o.location}return s.length===0?this.error(n==="select"?S.EXPECT_SELECT_ARGUMENT_SELECTOR:S.EXPECT_PLURAL_ARGUMENT_SELECTOR,k(this.clonePosition(),this.clonePosition())):this.requiresOtherClause&&!r?this.error(S.MISSING_OTHER_CLAUSE,k(this.clonePosition(),this.clonePosition())):{val:s,err:null}},t.prototype.tryParseDecimalInteger=function(e,n){var a=1,i=this.clonePosition();this.bumpIf("+")||this.bumpIf("-")&&(a=-1);for(var o=!1,r=0;!this.isEOF();){var s=this.char();if(s>=48&&s<=57)o=!0,r=r*10+(s-48),this.bump();else break}var p=k(i,this.clonePosition());return o?(r*=a,Di(r)?{val:r,err:null}:this.error(n,p)):this.error(e,p)},t.prototype.offset=function(){return this.position.offset},t.prototype.isEOF=function(){return this.offset()===this.message.length},t.prototype.clonePosition=function(){return{offset:this.position.offset,line:this.position.line,column:this.position.column}},t.prototype.char=function(){var e=this.position.offset;if(e>=this.message.length)throw Error("out of bound");var n=ra(this.message,e);if(n===void 0)throw Error("Offset ".concat(e," is at invalid UTF-16 code unit boundary"));return n},t.prototype.error=function(e,n){return{val:null,err:{kind:e,message:this.message,location:n}}},t.prototype.bump=function(){if(!this.isEOF()){var e=this.char();e===10?(this.position.line+=1,this.position.column=1,this.position.offset+=1):(this.position.column+=1,this.position.offset+=e<65536?1:2)}},t.prototype.bumpIf=function(e){if(ia(this.message,e,this.offset())){for(var n=0;n<e.length;n++)this.bump();return!0}return!1},t.prototype.bumpUntil=function(e){var n=this.offset(),a=this.message.indexOf(e,n);return a>=0?(this.bumpTo(a),!0):(this.bumpTo(this.message.length),!1)},t.prototype.bumpTo=function(e){if(this.offset()>e)throw Error("targetOffset ".concat(e," must be greater than or equal to the current offset ").concat(this.offset()));for(e=Math.min(e,this.message.length);;){var n=this.offset();if(n===e)break;if(n>e)throw Error("targetOffset ".concat(e," is at invalid UTF-16 code unit boundary"));if(this.bump(),this.isEOF())break}},t.prototype.bumpSpace=function(){for(;!this.isEOF()&&pa(this.char());)this.bump()},t.prototype.peek=function(){if(this.isEOF())return null;var e=this.char(),n=this.offset(),a=this.message.charCodeAt(n+(e>=65536?2:1));return a??null},t}();function Nt(t){return t>=97&&t<=122||t>=65&&t<=90}function Mi(t){return Nt(t)||t===47}function Hi(t){return t===45||t===46||t>=48&&t<=57||t===95||t>=97&&t<=122||t>=65&&t<=90||t==183||t>=192&&t<=214||t>=216&&t<=246||t>=248&&t<=893||t>=895&&t<=8191||t>=8204&&t<=8205||t>=8255&&t<=8256||t>=8304&&t<=8591||t>=11264&&t<=12271||t>=12289&&t<=55295||t>=63744&&t<=64975||t>=65008&&t<=65533||t>=65536&&t<=983039}function pa(t){return t>=9&&t<=13||t===32||t===133||t>=8206&&t<=8207||t===8232||t===8233}function Fi(t){return t>=33&&t<=35||t===36||t>=37&&t<=39||t===40||t===41||t===42||t===43||t===44||t===45||t>=46&&t<=47||t>=58&&t<=59||t>=60&&t<=62||t>=63&&t<=64||t===91||t===92||t===93||t===94||t===96||t===123||t===124||t===125||t===126||t===161||t>=162&&t<=165||t===166||t===167||t===169||t===171||t===172||t===174||t===176||t===177||t===182||t===187||t===191||t===215||t===247||t>=8208&&t<=8213||t>=8214&&t<=8215||t===8216||t===8217||t===8218||t>=8219&&t<=8220||t===8221||t===8222||t===8223||t>=8224&&t<=8231||t>=8240&&t<=8248||t===8249||t===8250||t>=8251&&t<=8254||t>=8257&&t<=8259||t===8260||t===8261||t===8262||t>=8263&&t<=8273||t===8274||t===8275||t>=8277&&t<=8286||t>=8592&&t<=8596||t>=8597&&t<=8601||t>=8602&&t<=8603||t>=8604&&t<=8607||t===8608||t>=8609&&t<=8610||t===8611||t>=8612&&t<=8613||t===8614||t>=8615&&t<=8621||t===8622||t>=8623&&t<=8653||t>=8654&&t<=8655||t>=8656&&t<=8657||t===8658||t===8659||t===8660||t>=8661&&t<=8691||t>=8692&&t<=8959||t>=8960&&t<=8967||t===8968||t===8969||t===8970||t===8971||t>=8972&&t<=8991||t>=8992&&t<=8993||t>=8994&&t<=9e3||t===9001||t===9002||t>=9003&&t<=9083||t===9084||t>=9085&&t<=9114||t>=9115&&t<=9139||t>=9140&&t<=9179||t>=9180&&t<=9185||t>=9186&&t<=9254||t>=9255&&t<=9279||t>=9280&&t<=9290||t>=9291&&t<=9311||t>=9472&&t<=9654||t===9655||t>=9656&&t<=9664||t===9665||t>=9666&&t<=9719||t>=9720&&t<=9727||t>=9728&&t<=9838||t===9839||t>=9840&&t<=10087||t===10088||t===10089||t===10090||t===10091||t===10092||t===10093||t===10094||t===10095||t===10096||t===10097||t===10098||t===10099||t===10100||t===10101||t>=10132&&t<=10175||t>=10176&&t<=10180||t===10181||t===10182||t>=10183&&t<=10213||t===10214||t===10215||t===10216||t===10217||t===10218||t===10219||t===10220||t===10221||t===10222||t===10223||t>=10224&&t<=10239||t>=10240&&t<=10495||t>=10496&&t<=10626||t===10627||t===10628||t===10629||t===10630||t===10631||t===10632||t===10633||t===10634||t===10635||t===10636||t===10637||t===10638||t===10639||t===10640||t===10641||t===10642||t===10643||t===10644||t===10645||t===10646||t===10647||t===10648||t>=10649&&t<=10711||t===10712||t===10713||t===10714||t===10715||t>=10716&&t<=10747||t===10748||t===10749||t>=10750&&t<=11007||t>=11008&&t<=11055||t>=11056&&t<=11076||t>=11077&&t<=11078||t>=11079&&t<=11084||t>=11085&&t<=11123||t>=11124&&t<=11125||t>=11126&&t<=11157||t===11158||t>=11159&&t<=11263||t>=11776&&t<=11777||t===11778||t===11779||t===11780||t===11781||t>=11782&&t<=11784||t===11785||t===11786||t===11787||t===11788||t===11789||t>=11790&&t<=11798||t===11799||t>=11800&&t<=11801||t===11802||t===11803||t===11804||t===11805||t>=11806&&t<=11807||t===11808||t===11809||t===11810||t===11811||t===11812||t===11813||t===11814||t===11815||t===11816||t===11817||t>=11818&&t<=11822||t===11823||t>=11824&&t<=11833||t>=11834&&t<=11835||t>=11836&&t<=11839||t===11840||t===11841||t===11842||t>=11843&&t<=11855||t>=11856&&t<=11857||t===11858||t>=11859&&t<=11903||t>=12289&&t<=12291||t===12296||t===12297||t===12298||t===12299||t===12300||t===12301||t===12302||t===12303||t===12304||t===12305||t>=12306&&t<=12307||t===12308||t===12309||t===12310||t===12311||t===12312||t===12313||t===12314||t===12315||t===12316||t===12317||t>=12318&&t<=12319||t===12320||t===12336||t===64830||t===64831||t>=65093&&t<=65094}function Dt(t){t.forEach(function(e){if(delete e.location,it(e)||ot(e))for(var n in e.options)delete e.options[n].location,Dt(e.options[n].value);else tt(e)&&st(e.style)||(nt(e)||at(e))&&Te(e.style)?delete e.style.location:rt(e)&&Dt(e.children)})}function ua(t,e){e===void 0&&(e={}),e=ye({shouldParseSkeletons:!0,requiresOtherClause:!0},e);var n=new la(t,e).parse();if(n.err){var a=SyntaxError(S[n.err.kind]);throw a.location=n.err.location,a.originalMessage=n.err.message,a}return e?.captureLocation||Dt(n.val),n.val}function lt(t,e){var n=e&&e.cache?e.cache:qi,a=e&&e.serializer?e.serializer:$i,i=e&&e.strategy?e.strategy:Bi;return i(t,{cache:n,serializer:a})}function Oi(t){return t==null||typeof t=="number"||typeof t=="boolean"}function ca(t,e,n,a){var i=Oi(a)?a:n(a),o=e.get(i);return typeof o>"u"&&(o=t.call(this,a),e.set(i,o)),o}function ma(t,e,n){var a=Array.prototype.slice.call(arguments,3),i=n(a),o=e.get(i);return typeof o>"u"&&(o=t.apply(this,a),e.set(i,o)),o}function zt(t,e,n,a,i){return n.bind(e,t,a,i)}function Bi(t,e){var n=t.length===1?ca:ma;return zt(t,this,n,e.cache.create(),e.serializer)}function Gi(t,e){return zt(t,this,ma,e.cache.create(),e.serializer)}function Vi(t,e){return zt(t,this,ca,e.cache.create(),e.serializer)}var $i=function(){return JSON.stringify(arguments)};function jt(){this.cache=Object.create(null)}jt.prototype.get=function(t){return this.cache[t]};jt.prototype.set=function(t,e){this.cache[t]=e};var qi={create:function(){return new jt}},pt={variadic:Gi,monadic:Vi};var ue;(function(t){t.MISSING_VALUE="MISSING_VALUE",t.INVALID_VALUE="INVALID_VALUE",t.MISSING_INTL_API="MISSING_INTL_API"})(ue||(ue={}));var Ie=function(t){Le(e,t);function e(n,a,i){var o=t.call(this,n)||this;return o.code=a,o.originalMessage=i,o}return e.prototype.toString=function(){return"[formatjs Error: ".concat(this.code,"] ").concat(this.message)},e}(Error);var Mt=function(t){Le(e,t);function e(n,a,i,o){return t.call(this,'Invalid values for "'.concat(n,'": "').concat(a,'". Options are "').concat(Object.keys(i).join('", "'),'"'),ue.INVALID_VALUE,o)||this}return e}(Ie);var da=function(t){Le(e,t);function e(n,a,i){return t.call(this,'Value for "'.concat(n,'" must be of type ').concat(a),ue.INVALID_VALUE,i)||this}return e}(Ie);var ha=function(t){Le(e,t);function e(n,a){return t.call(this,'The intl string context variable "'.concat(n,'" was not provided to the string "').concat(a,'"'),ue.MISSING_VALUE,a)||this}return e}(Ie);var j;(function(t){t[t.literal=0]="literal",t[t.object=1]="object"})(j||(j={}));function Wi(t){return t.length<2?t:t.reduce(function(e,n){var a=e[e.length-1];return!a||a.type!==j.literal||n.type!==j.literal?e.push(n):a.value+=n.value,e},[])}function Ji(t){return typeof t=="function"}function Re(t,e,n,a,i,o,r){if(t.length===1&&At(t[0]))return[{type:j.literal,value:t[0].value}];for(var s=[],p=0,c=t;p<c.length;p++){var l=c[p];if(At(l)){s.push({type:j.literal,value:l.value});continue}if($n(l)){typeof o=="number"&&s.push({type:j.literal,value:n.getNumberFormat(e).format(o)});continue}var d=l.value;if(!(i&&d in i))throw new ha(d,r);var m=i[d];if(Vn(l)){(!m||typeof m=="string"||typeof m=="number")&&(m=typeof m=="string"||typeof m=="number"?String(m):""),s.push({type:typeof m=="string"?j.literal:j.object,value:m});continue}if(nt(l)){var h=typeof l.style=="string"?a.date[l.style]:Te(l.style)?l.style.parsedOptions:void 0;s.push({type:j.literal,value:n.getDateTimeFormat(e,h).format(m)});continue}if(at(l)){var h=typeof l.style=="string"?a.time[l.style]:Te(l.style)?l.style.parsedOptions:a.time.medium;s.push({type:j.literal,value:n.getDateTimeFormat(e,h).format(m)});continue}if(tt(l)){var h=typeof l.style=="string"?a.number[l.style]:st(l.style)?l.style.parsedOptions:void 0;h&&h.scale&&(m=m*(h.scale||1)),s.push({type:j.literal,value:n.getNumberFormat(e,h).format(m)});continue}if(rt(l)){var f=l.children,C=l.value,g=i[C];if(!Ji(g))throw new da(C,"function",r);var _=Re(f,e,n,a,i,o),v=g(_.map(function(P){return P.value}));Array.isArray(v)||(v=[v]),s.push.apply(s,v.map(function(P){return{type:typeof P=="string"?j.literal:j.object,value:P}}))}if(it(l)){var y=l.options[m]||l.options.other;if(!y)throw new Mt(l.value,m,Object.keys(l.options),r);s.push.apply(s,Re(y.value,e,n,a,i));continue}if(ot(l)){var y=l.options["=".concat(m)];if(!y){if(!Intl.PluralRules)throw new Ie(`Intl.PluralRules is not available in this environment.
Try polyfilling it using "@formatjs/intl-pluralrules"
`,ue.MISSING_INTL_API,r);var w=n.getPluralRules(e,{type:l.pluralType}).select(m-(l.offset||0));y=l.options[w]||l.options.other}if(!y)throw new Mt(l.value,m,Object.keys(l.options),r);s.push.apply(s,Re(y.value,e,n,a,i,m-(l.offset||0)));continue}}return Wi(s)}function Zi(t,e){return e?J(J(J({},t||{}),e||{}),Object.keys(t).reduce(function(n,a){return n[a]=J(J({},t[a]),e[a]||{}),n},{})):t}function Ki(t,e){return e?Object.keys(t).reduce(function(n,a){return n[a]=Zi(t[a],e[a]),n},J({},t)):t}function Ht(t){return{create:function(){return{get:function(e){return t[e]},set:function(e,n){t[e]=n}}}}}function Xi(t){return t===void 0&&(t={number:{},dateTime:{},pluralRules:{}}),{getNumberFormat:lt(function(){for(var e,n=[],a=0;a<arguments.length;a++)n[a]=arguments[a];return new((e=Intl.NumberFormat).bind.apply(e,et([void 0],n,!1)))},{cache:Ht(t.number),strategy:pt.variadic}),getDateTimeFormat:lt(function(){for(var e,n=[],a=0;a<arguments.length;a++)n[a]=arguments[a];return new((e=Intl.DateTimeFormat).bind.apply(e,et([void 0],n,!1)))},{cache:Ht(t.dateTime),strategy:pt.variadic}),getPluralRules:lt(function(){for(var e,n=[],a=0;a<arguments.length;a++)n[a]=arguments[a];return new((e=Intl.PluralRules).bind.apply(e,et([void 0],n,!1)))},{cache:Ht(t.pluralRules),strategy:pt.variadic})}}var ga=function(){function t(e,n,a,i){n===void 0&&(n=t.defaultLocale);var o=this;if(this.formatterCache={number:{},dateTime:{},pluralRules:{}},this.format=function(c){var l=o.formatToParts(c);if(l.length===1)return l[0].value;var d=l.reduce(function(m,h){return!m.length||h.type!==j.literal||typeof m[m.length-1]!="string"?m.push(h.value):m[m.length-1]+=h.value,m},[]);return d.length<=1?d[0]||"":d},this.formatToParts=function(c){return Re(o.ast,o.locales,o.formatters,o.formats,c,void 0,o.message)},this.resolvedOptions=function(){var c;return{locale:((c=o.resolvedLocale)===null||c===void 0?void 0:c.toString())||Intl.NumberFormat.supportedLocalesOf(o.locales)[0]}},this.getAst=function(){return o.ast},this.locales=n,this.resolvedLocale=t.resolveLocale(n),typeof e=="string"){if(this.message=e,!t.__parse)throw new TypeError("IntlMessageFormat.__parse must be set to process `message` of type `string`");var r=i||{},s=r.formatters,p=Gn(r,["formatters"]);this.ast=t.__parse(e,J(J({},p),{locale:this.resolvedLocale}))}else this.ast=e;if(!Array.isArray(this.ast))throw new TypeError("A message must be provided as a String or AST.");this.formats=Ki(t.formats,a),this.formatters=i&&i.formatters||Xi(this.formatterCache)}return Object.defineProperty(t,"defaultLocale",{get:function(){return t.memoizedDefaultLocale||(t.memoizedDefaultLocale=new Intl.NumberFormat().resolvedOptions().locale),t.memoizedDefaultLocale},enumerable:!1,configurable:!0}),t.memoizedDefaultLocale=null,t.resolveLocale=function(e){if(!(typeof Intl.Locale>"u")){var n=Intl.NumberFormat.supportedLocalesOf(e);return n.length>0?new Intl.Locale(n[0]):new Intl.Locale(typeof e=="string"?e:e[0])}},t.__parse=ua,t.formats={number:{integer:{maximumFractionDigits:0},currency:{style:"currency"},percent:{style:"percent"}},date:{short:{month:"numeric",day:"numeric",year:"2-digit"},medium:{month:"short",day:"numeric",year:"numeric"},long:{month:"long",day:"numeric",year:"numeric"},full:{weekday:"long",month:"long",day:"numeric",year:"numeric"}},time:{short:{hour:"numeric",minute:"numeric"},medium:{hour:"numeric",minute:"numeric",second:"numeric"},long:{hour:"numeric",minute:"numeric",second:"numeric",timeZoneName:"short"},full:{hour:"numeric",minute:"numeric",second:"numeric",timeZoneName:"short"}}},t}();var Ft=ga;var ut={literal:0,argument:1,number:2,date:3,time:4,select:5,plural:6,pound:7,tag:8};var Ms=["ar-XB.json","ar.json","bg.json","ca.json","cs.json","da.json","de.json","el.json","en-GB.json","en-US.json","en-XA.json","en-XL.json","es-419.json","es.json","fi.json","fil.json","fr.json","he.json","hi.json","hr.json","hu.json","id.json","it.json","ja.json","ko.json","lt.json","lv.json","nl.json","no.json","pl.json","pt-PT.json","pt.json","ro.json","ru.json","sk.json","sl.json","sr-Latn.json","sr.json","sv.json","ta.json","te.json","th.json","tr.json","uk.json","vi.json","zh-HK.json","zh-TW.json","zh.json"].filter(t=>t.endsWith(".json")&&!t.endsWith(".ctc.json")).map(t=>t.replace(".json","")).sort();var Yi={number:{bytes:{maximumFractionDigits:0},milliseconds:{maximumFractionDigits:0},seconds:{minimumFractionDigits:1,maximumFractionDigits:1},extendedPercent:{maximumFractionDigits:2,style:"percent"}}};function fa(t,e=new Map){for(let n of t)if(!(n.type===ut.literal||n.type===ut.pound)&&(e.set(n.value,n),n.type===ut.plural))for(let a of Object.values(n.options))fa(a.value,e);return e}function Qi(t,e={},n){let a=fa(t.getAst()),i={};for(let[o,r]of a){if(!(o in e))throw new Error(`ICU Message "${n}" contains a value reference ("${o}") that wasn't provided`);let s=e[o];if(r.type!==ut.number){i[o]=s;continue}if(typeof s!="number")throw new Error(`ICU Message "${n}" contains a numeric reference ("${o}") but provided value was not a number`);r.style==="milliseconds"?i[o]=Math.round(s/10)*10:r.style==="seconds"&&o==="timeInMs"?i[o]=Math.round(s/100)/10:r.style==="bytes"?i[o]=s/1024:i[o]=s}for(let o of Object.keys(e))if(!(o in i)){if(o==="errorCode"){i.errorCode=e.errorCode;continue}throw new Error(`Provided value "${o}" does not match any placeholder in ICU message "${n}"`)}return i}function eo(t){return t.replace(/'/g,"''").replace(/\\{/g,"'{").replace(/\\}/g,"'}")}function va(t,e,n){t=eo(t);let a=n==="en-XA"||n==="en-XL"?"de-DE":n,i=Ft.IntlMessageFormat||Ft,o=new i(t,a,Yi,{ignoreTag:!0}),r=Qi(o,e,t),s=o.format(r);if(typeof s!="string")throw new Error("unexpected formatted result");return s}var Ot=" ";var ce=class{constructor(e){e==="en-XA"&&(e="de"),this._locale=e,this._cachedNumberFormatters=new Map}_formatNumberWithGranularity(e,n,a={}){if(n!==void 0){let r=-Math.log10(n);Number.isInteger(r)||(console.warn(`granularity of ${n} is invalid. Using 1 instead`),n=1),n<1&&(a={...a},a.minimumFractionDigits=a.maximumFractionDigits=Math.ceil(r)),e=Math.round(e/n)*n,Object.is(e,-0)&&(e=0)}else Math.abs(e)<5e-4&&(e=0);let i,o=[a.minimumFractionDigits,a.maximumFractionDigits,a.style,a.unit,a.unitDisplay,this._locale].join("");return i=this._cachedNumberFormatters.get(o),i||(i=new Intl.NumberFormat(this._locale,a),this._cachedNumberFormatters.set(o,i)),i.format(e).replace(" ",Ot)}formatNumber(e,n){return this._formatNumberWithGranularity(e,n)}formatInteger(e){return this._formatNumberWithGranularity(e,1)}formatPercent(e){return new Intl.NumberFormat(this._locale,{style:"percent"}).format(e)}formatBytesToKiB(e,n=void 0){return this._formatNumberWithGranularity(e/1024,n)+`${Ot}KiB`}formatBytesToMiB(e,n=void 0){return this._formatNumberWithGranularity(e/1048576,n)+`${Ot}MiB`}formatBytes(e,n=1){return this._formatNumberWithGranularity(e,n,{style:"unit",unit:"byte",unitDisplay:"long"})}formatBytesWithBestUnit(e,n=.1){return e>=1048576?this.formatBytesToMiB(e,n):e>=1024?this.formatBytesToKiB(e,n):this._formatNumberWithGranularity(e,n,{style:"unit",unit:"byte",unitDisplay:"narrow"})}formatKbps(e,n=void 0){return this._formatNumberWithGranularity(e,n,{style:"unit",unit:"kilobit-per-second",unitDisplay:"short"})}formatMilliseconds(e,n=void 0){return this._formatNumberWithGranularity(e,n,{style:"unit",unit:"millisecond",unitDisplay:"short"})}formatSeconds(e,n=void 0){return this._formatNumberWithGranularity(e/1e3,n,{style:"unit",unit:"second",unitDisplay:"narrow"})}formatDateTime(e){let n={month:"short",day:"numeric",year:"numeric",hour:"numeric",minute:"numeric",timeZoneName:"short"},a;try{a=new Intl.DateTimeFormat(this._locale,n)}catch{n.timeZone="UTC",a=new Intl.DateTimeFormat(this._locale,n)}return a.format(new Date(e))}formatDuration(e){let n=e/1e3;if(Math.round(n)===0)return"None";let a=[],i={day:60*60*24,hour:60*60,minute:60,second:1};return Object.keys(i).forEach(o=>{let r=i[o],s=Math.floor(n/r);if(s>0){n-=s*r;let p=this._formatNumberWithGranularity(s,1,{style:"unit",unit:o,unitDisplay:"narrow"});a.push(p)}}),a.join(" ")}};var Bt={navigationDescription:"Page load",timespanDescription:"User interactions",snapshotDescription:"Captured state of page",navigationLongDescription:"Navigation reports analyze a single page load, exactly like the original Lighthouse reports.",timespanLongDescription:"Timespan reports analyze an arbitrary period of time, typically containing user interactions.",snapshotLongDescription:"Snapshot reports analyze the page in a particular state, typically after user interactions.",navigationReport:"Navigation report",timespanReport:"Timespan report",snapshotReport:"Snapshot report",summary:"Summary",allReports:"All Reports",title:"Lighthouse User Flow Report",categories:"Categories",categoryPerformance:"Performance",categoryAccessibility:"Accessibility",categoryBestPractices:"Best Practices",categorySeo:"SEO",desktop:"Desktop",mobile:"Mobile",ratingPass:"Good",ratingAverage:"Average",ratingFail:"Poor",ratingError:"Error",navigationReportCount:`{numNavigation, plural,
    =1 {{numNavigation} navigation report}
    other {{numNavigation} navigation reports}
  }`,timespanReportCount:`{numTimespan, plural,
    =1 {{numTimespan} timespan report}
    other {{numTimespan} timespan reports}
  }`,snapshotReportCount:`{numSnapshot, plural,
    =1 {{numSnapshot} snapshot report}
    other {{numSnapshot} snapshot reports}
  }`,save:"Save",helpLabel:"Understanding Flows",helpDialogTitle:"Understanding the Lighthouse Flow Report",helpUseCaseInstructionNavigation:"Use Navigation reports to...",helpUseCaseInstructionTimespan:"Use Timespan reports to...",helpUseCaseInstructionSnapshot:"Use Snapshot reports to...",helpUseCaseNavigation1:"Obtain a Lighthouse Performance score.",helpUseCaseNavigation2:"Measure page load Performance metrics such as Largest Contentful Paint and Speed Index.",helpUseCaseNavigation3:"Assess Progressive Web App capabilities.",helpUseCaseTimespan1:"Measure layout shifts and JavaScript execution time on a series of interactions.",helpUseCaseTimespan2:"Discover performance opportunities to improve the experience for long-lived pages and single-page applications.",helpUseCaseSnapshot1:"Find accessibility issues in single page applications or complex forms.",helpUseCaseSnapshot2:"Evaluate best practices of menus and UI elements hidden behind interaction.",passedAuditCount:`{numPassed, plural,
    =1 {{numPassed} audit passed}
    other {{numPassed} audits passed}
  }`,passableAuditCount:`{numPassableAudits, plural,
    =1 {{numPassableAudits} passable audit}
    other {{numPassableAudits} passable audits}
  }`,informativeAuditCount:`{numInformative, plural,
    =1 {{numInformative} informative audit}
    other {{numInformative} informative audits}
  }`,highestImpact:"Highest impact"};var ba={"en-US":{allReports:"All Reports",categories:"Categories",categoryAccessibility:"Accessibility",categoryBestPractices:"Best Practices",categoryPerformance:"Performance",categorySeo:"SEO",desktop:"Desktop",helpDialogTitle:"Understanding the Lighthouse Flow Report",helpLabel:"Understanding Flows",helpUseCaseInstructionNavigation:"Use Navigation reports to...",helpUseCaseInstructionSnapshot:"Use Snapshot reports to...",helpUseCaseInstructionTimespan:"Use Timespan reports to...",helpUseCaseNavigation1:"Obtain a Lighthouse Performance score.",helpUseCaseNavigation2:"Measure page load Performance metrics such as Largest Contentful Paint and Speed Index.",helpUseCaseNavigation3:"Assess Progressive Web App capabilities.",helpUseCaseSnapshot1:"Find accessibility issues in single page applications or complex forms.",helpUseCaseSnapshot2:"Evaluate best practices of menus and UI elements hidden behind interaction.",helpUseCaseTimespan1:"Measure layout shifts and JavaScript execution time on a series of interactions.",helpUseCaseTimespan2:"Discover performance opportunities to improve the experience for long-lived pages and single-page applications.",highestImpact:"Highest impact",informativeAuditCount:`{numInformative, plural,
    =1 {{numInformative} informative audit}
    other {{numInformative} informative audits}
  }`,mobile:"Mobile",navigationDescription:"Page load",navigationLongDescription:"Navigation reports analyze a single page load, exactly like the original Lighthouse reports.",navigationReport:"Navigation report",navigationReportCount:`{numNavigation, plural,
    =1 {{numNavigation} navigation report}
    other {{numNavigation} navigation reports}
  }`,passableAuditCount:`{numPassableAudits, plural,
    =1 {{numPassableAudits} passable audit}
    other {{numPassableAudits} passable audits}
  }`,passedAuditCount:`{numPassed, plural,
    =1 {{numPassed} audit passed}
    other {{numPassed} audits passed}
  }`,ratingAverage:"Average",ratingError:"Error",ratingFail:"Poor",ratingPass:"Good",save:"Save",snapshotDescription:"Captured state of page",snapshotLongDescription:"Snapshot reports analyze the page in a particular state, typically after user interactions.",snapshotReport:"Snapshot report",snapshotReportCount:`{numSnapshot, plural,
    =1 {{numSnapshot} snapshot report}
    other {{numSnapshot} snapshot reports}
  }`,summary:"Summary",timespanDescription:"User interactions",timespanLongDescription:"Timespan reports analyze an arbitrary period of time, typically containing user interactions.",timespanReport:"Timespan report",timespanReportCount:`{numTimespan, plural,
    =1 {{numTimespan} timespan report}
    other {{numTimespan} timespan reports}
  }`,title:"Lighthouse User Flow Report"},en:{allReports:"All Reports",categories:"Categories",categoryAccessibility:"Accessibility",categoryBestPractices:"Best Practices",categoryPerformance:"Performance",categorySeo:"SEO",desktop:"Desktop",helpDialogTitle:"Understanding the Lighthouse Flow Report",helpLabel:"Understanding Flows",helpUseCaseInstructionNavigation:"Use Navigation reports to...",helpUseCaseInstructionSnapshot:"Use Snapshot reports to...",helpUseCaseInstructionTimespan:"Use Timespan reports to...",helpUseCaseNavigation1:"Obtain a Lighthouse Performance score.",helpUseCaseNavigation2:"Measure page load Performance metrics such as Largest Contentful Paint and Speed Index.",helpUseCaseNavigation3:"Assess Progressive Web App capabilities.",helpUseCaseSnapshot1:"Find accessibility issues in single page applications or complex forms.",helpUseCaseSnapshot2:"Evaluate best practices of menus and UI elements hidden behind interaction.",helpUseCaseTimespan1:"Measure layout shifts and JavaScript execution time on a series of interactions.",helpUseCaseTimespan2:"Discover performance opportunities to improve the experience for long-lived pages and single-page applications.",highestImpact:"Highest impact",informativeAuditCount:`{numInformative, plural,
    =1 {{numInformative} informative audit}
    other {{numInformative} informative audits}
  }`,mobile:"Mobile",navigationDescription:"Page load",navigationLongDescription:"Navigation reports analyze a single page load, exactly like the original Lighthouse reports.",navigationReport:"Navigation report",navigationReportCount:`{numNavigation, plural,
    =1 {{numNavigation} navigation report}
    other {{numNavigation} navigation reports}
  }`,passableAuditCount:`{numPassableAudits, plural,
    =1 {{numPassableAudits} passable audit}
    other {{numPassableAudits} passable audits}
  }`,passedAuditCount:`{numPassed, plural,
    =1 {{numPassed} audit passed}
    other {{numPassed} audits passed}
  }`,ratingAverage:"Average",ratingError:"Error",ratingFail:"Poor",ratingPass:"Good",save:"Save",snapshotDescription:"Captured state of page",snapshotLongDescription:"Snapshot reports analyze the page in a particular state, typically after user interactions.",snapshotReport:"Snapshot report",snapshotReportCount:`{numSnapshot, plural,
    =1 {{numSnapshot} snapshot report}
    other {{numSnapshot} snapshot reports}
  }`,summary:"Summary",timespanDescription:"User interactions",timespanLongDescription:"Timespan reports analyze an arbitrary period of time, typically containing user interactions.",timespanReport:"Timespan report",timespanReportCount:`{numTimespan, plural,
    =1 {{numTimespan} timespan report}
    other {{numTimespan} timespan reports}
  }`,title:"Lighthouse User Flow Report"},"en-AU":{allReports:"All reports",categories:"Categories",categoryAccessibility:"Accessibility",categoryBestPractices:"Best Practices",categoryPerformance:"Performance",categorySeo:"SEO",desktop:"Desktop",helpDialogTitle:"Understanding the Lighthouse flow report",helpLabel:"Understanding flows",helpUseCaseInstructionNavigation:"Use Navigation reports to…",helpUseCaseInstructionSnapshot:"Use Snapshot reports to…",helpUseCaseInstructionTimespan:"Use Timespan reports to…",helpUseCaseNavigation1:"Obtain a Lighthouse performance score.",helpUseCaseNavigation2:"Measure page load performance metrics, such as largest contentful paint and speed index.",helpUseCaseNavigation3:"Assess progressive web app capabilities.",helpUseCaseSnapshot1:"Find accessibility issues in single-page applications or complex forms.",helpUseCaseSnapshot2:"Evaluate best practices of menus and UI elements hidden behind interaction.",helpUseCaseTimespan1:"Measure layout shifts and JavaScript execution time on a series of interactions.",helpUseCaseTimespan2:"Discover performance opportunities to improve the experience for long-lived pages and single-page applications.",highestImpact:"Highest impact",informativeAuditCount:"{numInformative,plural, =1{{numInformative} informative audit}other{{numInformative} informative audits}}",mobile:"Mobile",navigationDescription:"Page load",navigationLongDescription:"Navigation reports analyse a single page load, exactly like the original Lighthouse reports.",navigationReport:"Navigation report",navigationReportCount:"{numNavigation,plural, =1{{numNavigation} navigation report}other{{numNavigation} navigation reports}}",passableAuditCount:"{numPassableAudits,plural, =1{{numPassableAudits} passable audit}other{{numPassableAudits} passable audits}}",passedAuditCount:"{numPassed,plural, =1{{numPassed} audit passed}other{{numPassed} audits passed}}",ratingAverage:"Average",ratingError:"Error",ratingFail:"Poor",ratingPass:"Good",save:"Save",snapshotDescription:"Captured state of page",snapshotLongDescription:"Snapshot reports analyse the page in a particular state, typically after user interactions.",snapshotReport:"Snapshot report",snapshotReportCount:"{numSnapshot,plural, =1{{numSnapshot} snapshot report}other{{numSnapshot} snapshot reports}}",summary:"Summary",timespanDescription:"User interactions",timespanLongDescription:"Timespan reports analyse an arbitrary period of time, typically containing user interactions.",timespanReport:"Timespan report",timespanReportCount:"{numTimespan,plural, =1{{numTimespan} timespan report}other{{numTimespan} timespan reports}}",title:"Lighthouse user flow report"},"en-GB":{allReports:"All reports",categories:"Categories",categoryAccessibility:"Accessibility",categoryBestPractices:"Best Practices",categoryPerformance:"Performance",categorySeo:"SEO",desktop:"Desktop",helpDialogTitle:"Understanding the Lighthouse flow report",helpLabel:"Understanding flows",helpUseCaseInstructionNavigation:"Use Navigation reports to…",helpUseCaseInstructionSnapshot:"Use Snapshot reports to…",helpUseCaseInstructionTimespan:"Use Timespan reports to…",helpUseCaseNavigation1:"Obtain a Lighthouse performance score.",helpUseCaseNavigation2:"Measure page load performance metrics, such as largest contentful paint and speed index.",helpUseCaseNavigation3:"Assess progressive web app capabilities.",helpUseCaseSnapshot1:"Find accessibility issues in single-page applications or complex forms.",helpUseCaseSnapshot2:"Evaluate best practices of menus and UI elements hidden behind interaction.",helpUseCaseTimespan1:"Measure layout shifts and JavaScript execution time on a series of interactions.",helpUseCaseTimespan2:"Discover performance opportunities to improve the experience for long-lived pages and single-page applications.",highestImpact:"Highest impact",informativeAuditCount:"{numInformative,plural, =1{{numInformative} informative audit}other{{numInformative} informative audits}}",mobile:"Mobile",navigationDescription:"Page load",navigationLongDescription:"Navigation reports analyse a single page load, exactly like the original Lighthouse reports.",navigationReport:"Navigation report",navigationReportCount:"{numNavigation,plural, =1{{numNavigation} navigation report}other{{numNavigation} navigation reports}}",passableAuditCount:"{numPassableAudits,plural, =1{{numPassableAudits} passable audit}other{{numPassableAudits} passable audits}}",passedAuditCount:"{numPassed,plural, =1{{numPassed} audit passed}other{{numPassed} audits passed}}",ratingAverage:"Average",ratingError:"Error",ratingFail:"Poor",ratingPass:"Good",save:"Save",snapshotDescription:"Captured state of page",snapshotLongDescription:"Snapshot reports analyse the page in a particular state, typically after user interactions.",snapshotReport:"Snapshot report",snapshotReportCount:"{numSnapshot,plural, =1{{numSnapshot} snapshot report}other{{numSnapshot} snapshot reports}}",summary:"Summary",timespanDescription:"User interactions",timespanLongDescription:"Timespan reports analyse an arbitrary period of time, typically containing user interactions.",timespanReport:"Timespan report",timespanReportCount:"{numTimespan,plural, =1{{numTimespan} timespan report}other{{numTimespan} timespan reports}}",title:"Lighthouse user flow report"},"en-IE":{allReports:"All reports",categories:"Categories",categoryAccessibility:"Accessibility",categoryBestPractices:"Best Practices",categoryPerformance:"Performance",categorySeo:"SEO",desktop:"Desktop",helpDialogTitle:"Understanding the Lighthouse flow report",helpLabel:"Understanding flows",helpUseCaseInstructionNavigation:"Use Navigation reports to…",helpUseCaseInstructionSnapshot:"Use Snapshot reports to…",helpUseCaseInstructionTimespan:"Use Timespan reports to…",helpUseCaseNavigation1:"Obtain a Lighthouse performance score.",helpUseCaseNavigation2:"Measure page load performance metrics, such as largest contentful paint and speed index.",helpUseCaseNavigation3:"Assess progressive web app capabilities.",helpUseCaseSnapshot1:"Find accessibility issues in single-page applications or complex forms.",helpUseCaseSnapshot2:"Evaluate best practices of menus and UI elements hidden behind interaction.",helpUseCaseTimespan1:"Measure layout shifts and JavaScript execution time on a series of interactions.",helpUseCaseTimespan2:"Discover performance opportunities to improve the experience for long-lived pages and single-page applications.",highestImpact:"Highest impact",informativeAuditCount:"{numInformative,plural, =1{{numInformative} informative audit}other{{numInformative} informative audits}}",mobile:"Mobile",navigationDescription:"Page load",navigationLongDescription:"Navigation reports analyse a single page load, exactly like the original Lighthouse reports.",navigationReport:"Navigation report",navigationReportCount:"{numNavigation,plural, =1{{numNavigation} navigation report}other{{numNavigation} navigation reports}}",passableAuditCount:"{numPassableAudits,plural, =1{{numPassableAudits} passable audit}other{{numPassableAudits} passable audits}}",passedAuditCount:"{numPassed,plural, =1{{numPassed} audit passed}other{{numPassed} audits passed}}",ratingAverage:"Average",ratingError:"Error",ratingFail:"Poor",ratingPass:"Good",save:"Save",snapshotDescription:"Captured state of page",snapshotLongDescription:"Snapshot reports analyse the page in a particular state, typically after user interactions.",snapshotReport:"Snapshot report",snapshotReportCount:"{numSnapshot,plural, =1{{numSnapshot} snapshot report}other{{numSnapshot} snapshot reports}}",summary:"Summary",timespanDescription:"User interactions",timespanLongDescription:"Timespan reports analyse an arbitrary period of time, typically containing user interactions.",timespanReport:"Timespan report",timespanReportCount:"{numTimespan,plural, =1{{numTimespan} timespan report}other{{numTimespan} timespan reports}}",title:"Lighthouse user flow report"},"en-SG":{allReports:"All reports",categories:"Categories",categoryAccessibility:"Accessibility",categoryBestPractices:"Best Practices",categoryPerformance:"Performance",categorySeo:"SEO",desktop:"Desktop",helpDialogTitle:"Understanding the Lighthouse flow report",helpLabel:"Understanding flows",helpUseCaseInstructionNavigation:"Use Navigation reports to…",helpUseCaseInstructionSnapshot:"Use Snapshot reports to…",helpUseCaseInstructionTimespan:"Use Timespan reports to…",helpUseCaseNavigation1:"Obtain a Lighthouse performance score.",helpUseCaseNavigation2:"Measure page load performance metrics, such as largest contentful paint and speed index.",helpUseCaseNavigation3:"Assess progressive web app capabilities.",helpUseCaseSnapshot1:"Find accessibility issues in single-page applications or complex forms.",helpUseCaseSnapshot2:"Evaluate best practices of menus and UI elements hidden behind interaction.",helpUseCaseTimespan1:"Measure layout shifts and JavaScript execution time on a series of interactions.",helpUseCaseTimespan2:"Discover performance opportunities to improve the experience for long-lived pages and single-page applications.",highestImpact:"Highest impact",informativeAuditCount:"{numInformative,plural, =1{{numInformative} informative audit}other{{numInformative} informative audits}}",mobile:"Mobile",navigationDescription:"Page load",navigationLongDescription:"Navigation reports analyse a single page load, exactly like the original Lighthouse reports.",navigationReport:"Navigation report",navigationReportCount:"{numNavigation,plural, =1{{numNavigation} navigation report}other{{numNavigation} navigation reports}}",passableAuditCount:"{numPassableAudits,plural, =1{{numPassableAudits} passable audit}other{{numPassableAudits} passable audits}}",passedAuditCount:"{numPassed,plural, =1{{numPassed} audit passed}other{{numPassed} audits passed}}",ratingAverage:"Average",ratingError:"Error",ratingFail:"Poor",ratingPass:"Good",save:"Save",snapshotDescription:"Captured state of page",snapshotLongDescription:"Snapshot reports analyse the page in a particular state, typically after user interactions.",snapshotReport:"Snapshot report",snapshotReportCount:"{numSnapshot,plural, =1{{numSnapshot} snapshot report}other{{numSnapshot} snapshot reports}}",summary:"Summary",timespanDescription:"User interactions",timespanLongDescription:"Timespan reports analyse an arbitrary period of time, typically containing user interactions.",timespanReport:"Timespan report",timespanReportCount:"{numTimespan,plural, =1{{numTimespan} timespan report}other{{numTimespan} timespan reports}}",title:"Lighthouse user flow report"},"en-ZA":{allReports:"All reports",categories:"Categories",categoryAccessibility:"Accessibility",categoryBestPractices:"Best Practices",categoryPerformance:"Performance",categorySeo:"SEO",desktop:"Desktop",helpDialogTitle:"Understanding the Lighthouse flow report",helpLabel:"Understanding flows",helpUseCaseInstructionNavigation:"Use Navigation reports to…",helpUseCaseInstructionSnapshot:"Use Snapshot reports to…",helpUseCaseInstructionTimespan:"Use Timespan reports to…",helpUseCaseNavigation1:"Obtain a Lighthouse performance score.",helpUseCaseNavigation2:"Measure page load performance metrics, such as largest contentful paint and speed index.",helpUseCaseNavigation3:"Assess progressive web app capabilities.",helpUseCaseSnapshot1:"Find accessibility issues in single-page applications or complex forms.",helpUseCaseSnapshot2:"Evaluate best practices of menus and UI elements hidden behind interaction.",helpUseCaseTimespan1:"Measure layout shifts and JavaScript execution time on a series of interactions.",helpUseCaseTimespan2:"Discover performance opportunities to improve the experience for long-lived pages and single-page applications.",highestImpact:"Highest impact",informativeAuditCount:"{numInformative,plural, =1{{numInformative} informative audit}other{{numInformative} informative audits}}",mobile:"Mobile",navigationDescription:"Page load",navigationLongDescription:"Navigation reports analyse a single page load, exactly like the original Lighthouse reports.",navigationReport:"Navigation report",navigationReportCount:"{numNavigation,plural, =1{{numNavigation} navigation report}other{{numNavigation} navigation reports}}",passableAuditCount:"{numPassableAudits,plural, =1{{numPassableAudits} passable audit}other{{numPassableAudits} passable audits}}",passedAuditCount:"{numPassed,plural, =1{{numPassed} audit passed}other{{numPassed} audits passed}}",ratingAverage:"Average",ratingError:"Error",ratingFail:"Poor",ratingPass:"Good",save:"Save",snapshotDescription:"Captured state of page",snapshotLongDescription:"Snapshot reports analyse the page in a particular state, typically after user interactions.",snapshotReport:"Snapshot report",snapshotReportCount:"{numSnapshot,plural, =1{{numSnapshot} snapshot report}other{{numSnapshot} snapshot reports}}",summary:"Summary",timespanDescription:"User interactions",timespanLongDescription:"Timespan reports analyse an arbitrary period of time, typically containing user interactions.",timespanReport:"Timespan report",timespanReportCount:"{numTimespan,plural, =1{{numTimespan} timespan report}other{{numTimespan} timespan reports}}",title:"Lighthouse user flow report"},"en-IN":{allReports:"All reports",categories:"Categories",categoryAccessibility:"Accessibility",categoryBestPractices:"Best Practices",categoryPerformance:"Performance",categorySeo:"SEO",desktop:"Desktop",helpDialogTitle:"Understanding the Lighthouse flow report",helpLabel:"Understanding flows",helpUseCaseInstructionNavigation:"Use Navigation reports to…",helpUseCaseInstructionSnapshot:"Use Snapshot reports to…",helpUseCaseInstructionTimespan:"Use Timespan reports to…",helpUseCaseNavigation1:"Obtain a Lighthouse performance score.",helpUseCaseNavigation2:"Measure page load performance metrics, such as largest contentful paint and speed index.",helpUseCaseNavigation3:"Assess progressive web app capabilities.",helpUseCaseSnapshot1:"Find accessibility issues in single-page applications or complex forms.",helpUseCaseSnapshot2:"Evaluate best practices of menus and UI elements hidden behind interaction.",helpUseCaseTimespan1:"Measure layout shifts and JavaScript execution time on a series of interactions.",helpUseCaseTimespan2:"Discover performance opportunities to improve the experience for long-lived pages and single-page applications.",highestImpact:"Highest impact",informativeAuditCount:"{numInformative,plural, =1{{numInformative} informative audit}other{{numInformative} informative audits}}",mobile:"Mobile",navigationDescription:"Page load",navigationLongDescription:"Navigation reports analyse a single page load, exactly like the original Lighthouse reports.",navigationReport:"Navigation report",navigationReportCount:"{numNavigation,plural, =1{{numNavigation} navigation report}other{{numNavigation} navigation reports}}",passableAuditCount:"{numPassableAudits,plural, =1{{numPassableAudits} passable audit}other{{numPassableAudits} passable audits}}",passedAuditCount:"{numPassed,plural, =1{{numPassed} audit passed}other{{numPassed} audits passed}}",ratingAverage:"Average",ratingError:"Error",ratingFail:"Poor",ratingPass:"Good",save:"Save",snapshotDescription:"Captured state of page",snapshotLongDescription:"Snapshot reports analyse the page in a particular state, typically after user interactions.",snapshotReport:"Snapshot report",snapshotReportCount:"{numSnapshot,plural, =1{{numSnapshot} snapshot report}other{{numSnapshot} snapshot reports}}",summary:"Summary",timespanDescription:"User interactions",timespanLongDescription:"Timespan reports analyse an arbitrary period of time, typically containing user interactions.",timespanReport:"Timespan report",timespanReportCount:"{numTimespan,plural, =1{{numTimespan} timespan report}other{{numTimespan} timespan reports}}",title:"Lighthouse user flow report"},"ar-XB":{allReports:"‏‮All‬‏ ‏‮Reports‬‏",categories:"‏‮Categories‬‏",categoryAccessibility:"‏‮Accessibility‬‏",categoryBestPractices:"‏‮Best‬‏ ‏‮Practices‬‏",categoryPerformance:"‏‮Performance‬‏",categorySeo:"‏‮SEO‬‏",desktop:"‏‮Desktop‬‏",helpDialogTitle:"‏‮Understanding‬‏ ‏‮the‬‏ ‏‮Lighthouse‬‏ ‏‮Flow‬‏ ‏‮Report‬‏",helpLabel:"‏‮Understanding‬‏ ‏‮Flows‬‏",helpUseCaseInstructionNavigation:"‏‮Use‬‏ ‏‮Navigation‬‏ ‏‮reports‬‏ ‏‮to‬‏...",helpUseCaseInstructionSnapshot:"‏‮Use‬‏ ‏‮Snapshot‬‏ ‏‮reports‬‏ ‏‮to‬‏...",helpUseCaseInstructionTimespan:"‏‮Use‬‏ ‏‮Timespan‬‏ ‏‮reports‬‏ ‏‮to‬‏...",helpUseCaseNavigation1:"‏‮Obtain‬‏ ‏‮a‬‏ ‏‮Lighthouse‬‏ ‏‮Performance‬‏ ‏‮score‬‏.",helpUseCaseNavigation2:"‏‮Measure‬‏ ‏‮page‬‏ ‏‮load‬‏ ‏‮Performance‬‏ ‏‮metrics‬‏ ‏‮such‬‏ ‏‮as‬‏ ‏‮Largest‬‏ ‏‮Contentful‬‏ ‏‮Paint‬‏ ‏‮and‬‏ ‏‮Speed‬‏ ‏‮Index‬‏.",helpUseCaseNavigation3:"‏‮Assess‬‏ ‏‮Progressive‬‏ ‏‮Web‬‏ ‏‮App‬‏ ‏‮capabilities‬‏.",helpUseCaseSnapshot1:"‏‮Find‬‏ ‏‮accessibility‬‏ ‏‮issues‬‏ ‏‮in‬‏ ‏‮single‬‏ ‏‮page‬‏ ‏‮applications‬‏ ‏‮or‬‏ ‏‮complex‬‏ ‏‮forms‬‏.",helpUseCaseSnapshot2:"‏‮Evaluate‬‏ ‏‮best‬‏ ‏‮practices‬‏ ‏‮of‬‏ ‏‮menus‬‏ ‏‮and‬‏ ‏‮UI‬‏ ‏‮elements‬‏ ‏‮hidden‬‏ ‏‮behind‬‏ ‏‮interaction‬‏.",helpUseCaseTimespan1:"‏‮Measure‬‏ ‏‮layout‬‏ ‏‮shifts‬‏ ‏‮and‬‏ ‏‮JavaScript‬‏ ‏‮execution‬‏ ‏‮time‬‏ ‏‮on‬‏ ‏‮a‬‏ ‏‮series‬‏ ‏‮of‬‏ ‏‮interactions‬‏.",helpUseCaseTimespan2:"‏‮Discover‬‏ ‏‮performance‬‏ ‏‮opportunities‬‏ ‏‮to‬‏ ‏‮improve‬‏ ‏‮the‬‏ ‏‮experience‬‏ ‏‮for‬‏ ‏‮long‬‏-‏‮lived‬‏ ‏‮pages‬‏ ‏‮and‬‏ ‏‮single‬‏-‏‮page‬‏ ‏‮applications‬‏.",highestImpact:"‏‮Highest‬‏ ‏‮impact‬‏",informativeAuditCount:"{numInformative,plural, =1{{numInformative} ‏‮informative‬‏ ‏‮audit‬‏}zero{{numInformative} ‏‮informative‬‏ ‏‮audits‬‏}two{{numInformative} ‏‮informative‬‏ ‏‮audits‬‏}few{{numInformative} ‏‮informative‬‏ ‏‮audits‬‏}many{{numInformative} ‏‮informative‬‏ ‏‮audits‬‏}other{{numInformative} ‏‮informative‬‏ ‏‮audits‬‏}}",mobile:"‏‮Mobile‬‏",navigationDescription:"‏‮Page‬‏ ‏‮load‬‏",navigationLongDescription:"‏‮Navigation‬‏ ‏‮reports‬‏ ‏‮analyze‬‏ ‏‮a‬‏ ‏‮single‬‏ ‏‮page‬‏ ‏‮load‬‏, ‏‮exactly‬‏ ‏‮like‬‏ ‏‮the‬‏ ‏‮original‬‏ ‏‮Lighthouse‬‏ ‏‮reports‬‏.",navigationReport:"‏‮Navigation‬‏ ‏‮report‬‏",navigationReportCount:"{numNavigation,plural, =1{{numNavigation} ‏‮navigation‬‏ ‏‮report‬‏}zero{{numNavigation} ‏‮navigation‬‏ ‏‮reports‬‏}two{{numNavigation} ‏‮navigation‬‏ ‏‮reports‬‏}few{{numNavigation} ‏‮navigation‬‏ ‏‮reports‬‏}many{{numNavigation} ‏‮navigation‬‏ ‏‮reports‬‏}other{{numNavigation} ‏‮navigation‬‏ ‏‮reports‬‏}}",passableAuditCount:"{numPassableAudits,plural, =1{{numPassableAudits} ‏‮passable‬‏ ‏‮audit‬‏}zero{{numPassableAudits} ‏‮passable‬‏ ‏‮audits‬‏}two{{numPassableAudits} ‏‮passable‬‏ ‏‮audits‬‏}few{{numPassableAudits} ‏‮passable‬‏ ‏‮audits‬‏}many{{numPassableAudits} ‏‮passable‬‏ ‏‮audits‬‏}other{{numPassableAudits} ‏‮passable‬‏ ‏‮audits‬‏}}",passedAuditCount:"{numPassed,plural, =1{{numPassed} ‏‮audit‬‏ ‏‮passed‬‏}zero{{numPassed} ‏‮audits‬‏ ‏‮passed‬‏}two{{numPassed} ‏‮audits‬‏ ‏‮passed‬‏}few{{numPassed} ‏‮audits‬‏ ‏‮passed‬‏}many{{numPassed} ‏‮audits‬‏ ‏‮passed‬‏}other{{numPassed} ‏‮audits‬‏ ‏‮passed‬‏}}",ratingAverage:"‏‮Average‬‏",ratingError:"‏‮Error‬‏",ratingFail:"‏‮Poor‬‏",ratingPass:"‏‮Good‬‏",save:"‏‮Save‬‏",snapshotDescription:"‏‮Captured‬‏ ‏‮state‬‏ ‏‮of‬‏ ‏‮page‬‏",snapshotLongDescription:"‏‮Snapshot‬‏ ‏‮reports‬‏ ‏‮analyze‬‏ ‏‮the‬‏ ‏‮page‬‏ ‏‮in‬‏ ‏‮a‬‏ ‏‮particular‬‏ ‏‮state‬‏, ‏‮typically‬‏ ‏‮after‬‏ ‏‮user‬‏ ‏‮interactions‬‏.",snapshotReport:"‏‮Snapshot‬‏ ‏‮report‬‏",snapshotReportCount:"{numSnapshot,plural, =1{{numSnapshot} ‏‮snapshot‬‏ ‏‮report‬‏}zero{{numSnapshot} ‏‮snapshot‬‏ ‏‮reports‬‏}two{{numSnapshot} ‏‮snapshot‬‏ ‏‮reports‬‏}few{{numSnapshot} ‏‮snapshot‬‏ ‏‮reports‬‏}many{{numSnapshot} ‏‮snapshot‬‏ ‏‮reports‬‏}other{{numSnapshot} ‏‮snapshot‬‏ ‏‮reports‬‏}}",summary:"‏‮Summary‬‏",timespanDescription:"‏‮User‬‏ ‏‮interactions‬‏",timespanLongDescription:"‏‮Timespan‬‏ ‏‮reports‬‏ ‏‮analyze‬‏ ‏‮an‬‏ ‏‮arbitrary‬‏ ‏‮period‬‏ ‏‮of‬‏ ‏‮time‬‏, ‏‮typically‬‏ ‏‮containing‬‏ ‏‮user‬‏ ‏‮interactions‬‏.",timespanReport:"‏‮Timespan‬‏ ‏‮report‬‏",timespanReportCount:"{numTimespan,plural, =1{{numTimespan} ‏‮timespan‬‏ ‏‮report‬‏}zero{{numTimespan} ‏‮timespan‬‏ ‏‮reports‬‏}two{{numTimespan} ‏‮timespan‬‏ ‏‮reports‬‏}few{{numTimespan} ‏‮timespan‬‏ ‏‮reports‬‏}many{{numTimespan} ‏‮timespan‬‏ ‏‮reports‬‏}other{{numTimespan} ‏‮timespan‬‏ ‏‮reports‬‏}}",title:"‏‮Lighthouse‬‏ ‏‮User‬‏ ‏‮Flow‬‏ ‏‮Report‬‏"},ar:{allReports:"كل التقارير",categories:"الفئات",categoryAccessibility:"إمكانية الوصول",categoryBestPractices:"أفضل الممارسات",categoryPerformance:"الأداء",categorySeo:"تحسين محركات البحث",desktop:"سطح المكتب",helpDialogTitle:"فهم تقرير مسار Lighthouse",helpLabel:"فهم المسارات",helpUseCaseInstructionNavigation:"يمكنك استخدام تقارير التنقُّل من أجل...",helpUseCaseInstructionSnapshot:"يمكنك استخدام التقارير الخاصة بلحظات معيّنة من أجل...",helpUseCaseInstructionTimespan:"يمكنك استخدام تقارير الفترات الزمنية من أجل...",helpUseCaseNavigation1:"الحصول على نتيجة أداء أداة Lighthouse",helpUseCaseNavigation2:"التعرّف على قيم مقاييس أداء تحميل الصفحة، مثل سرعة عرض أكبر جزء من المحتوى على الصفحة ومؤشر السرعة",helpUseCaseNavigation3:"تقييم إمكانات تطبيقات الويب التقدّمية",helpUseCaseSnapshot1:"التعرّف على المشاكل التي تحول دون سهولة الاستخدام في التطبيقات المكوّنة من صفحة واحدة أو النماذج المُعقَّدة",helpUseCaseSnapshot2:"تقييم أفضل الممارسات المتعلّقة بالقوائم وعناصر واجهة المستخدم المخفية خلف التفاعلات",helpUseCaseTimespan1:"قياس متغيّرات التصميم ووقت تنفيذ JavaScript على سلسلة من التفاعلات",helpUseCaseTimespan2:"التعرّف على فرص تحسين الأداء من أجل تحسين تجربة استخدام الصفحات التي يفتحها المستخدم لمدة طويلة والتطبيقات المكوّنة من صفحة واحدة",highestImpact:"عمليات التدقيق الأعلى تأثيرًا",informativeAuditCount:"{numInformative,plural, =1{عملية تدقيق واحدة ({numInformative}) مفيدة}zero{‫{numInformative} عملية تدقيق مفيدة}two{عمليتا تدقيق ({numInformative}) مفيدتان}few{‫{numInformative} عمليات تدقيق مفيدة}many{‫{numInformative} عملية تدقيق مفيدة}other{‫{numInformative} عملية تدقيق مفيدة}}",mobile:"الأجهزة الجوّالة",navigationDescription:"تحميل الصفحة",navigationLongDescription:"تحلِّل تقارير التنقُّل أداء تحميل صفحة واحدة، تمامًا مثل تقارير Lighthouse الأصلية.",navigationReport:"تقرير التنقُّل في الصفحة",navigationReportCount:"{numNavigation,plural, =1{تقرير تنقُّل واحد ({numNavigation}) في الصفحة}zero{‫{numNavigation} تقرير تنقُّل في الصفحة}two{تقريرا تنقُّل ({numNavigation}) في الصفحة}few{‫{numNavigation} تقارير تنقُّل في الصفحة}many{‫{numNavigation} تقرير تنقُّل في الصفحة}other{‫{numNavigation} تقرير تنقُّل في الصفحة}}",passableAuditCount:"{numPassableAudits,plural, =1{عملية تدقيق واحدة ({numPassableAudits}) يمكن اجتيازها}zero{‫{numPassableAudits} عملية تدقيق يمكن اجتيازها}two{عمليتَا تدقيق ({numPassableAudits}) يمكن اجتيازهما}few{‫{numPassableAudits} عمليات تدقيق يمكن اجتيازها}many{‫{numPassableAudits} عملية تدقيق يمكن اجتيازها}other{‫{numPassableAudits} عملية تدقيق يمكن اجتيازها}}",passedAuditCount:"{numPassed,plural, =1{تمّ اجتياز عملية تدقيق واحدة ({numPassed})}zero{تمّ اجتياز {numPassed} عملية تدقيق}two{تمّ اجتياز عمليتَي تدقيق ({numPassed})}few{تمّ اجتياز {numPassed} عمليات تدقيق}many{تمّ اجتياز {numPassed} عملية تدقيق}other{تمّ اجتياز {numPassed} عملية تدقيق}}",ratingAverage:"متوسط",ratingError:"حدث خطأ",ratingFail:"غير جيد",ratingPass:"جيد",save:"حفظ",snapshotDescription:"الحالة التي تم تسجيلها للصفحة",snapshotLongDescription:"تُجري التقارير الخاصة بلحظات معيّنة تحليلاً للصفحة في حالة مُحدَّدة، عادةً ما بعد تفاعلات المستخدم.",snapshotReport:"التقرير الخاص بالصفحة في لحظة معيَّنة",snapshotReportCount:"{numSnapshot,plural, =1{تقرير واحد ({numSnapshot}) لتقييم الصفحة في لحظة معيَّنة}zero{‫{numSnapshot} تقرير لتقييم الصفحة في لحظة معيَّنة}two{تقريران ({numSnapshot}) لتقييم الصفحة في لحظة معيَّنة}few{‫{numSnapshot} تقارير لتقييم الصفحة في لحظة معيَّنة}many{‫{numSnapshot} تقريرًا لتقييم الصفحة في لحظة معيَّنة}other{‫{numSnapshot} تقرير لتقييم الصفحة في لحظة معيَّنة}}",summary:"ملخّص",timespanDescription:"تفاعلات المستخدمين",timespanLongDescription:"تحلِّل تقارير الفترات الزمنية أداء صفحة خلال فترات زمنية عشوائية، وعادةً ما تتضمّن تفاعلات المستخدم.",timespanReport:"تقرير الإطار الزمني",timespanReportCount:"{numTimespan,plural, =1{تقرير واحد ({numTimespan}) لتقييم الصفحة خلال فترة زمنية}zero{‫{numTimespan} تقرير لتقييم الصفحة خلال فترة زمنية}two{تقريران ({numTimespan}) لتقييم الصفحة خلال فترة زمنية}few{‫{numTimespan} تقارير لتقييم الصفحة خلال فترة زمنية}many{‫{numTimespan} تقريرًا لتقييم الصفحة خلال فترة زمنية}other{‫{numTimespan} تقرير لتقييم الصفحة خلال فترة زمنية}}",title:"تقرير تدفق المستخدمين في أداة Lighthouse"},bg:{allReports:"Всички отчети",categories:"Категории",categoryAccessibility:"Достъпност",categoryBestPractices:"Най-добри практики",categoryPerformance:"Ефективност",categorySeo:"SEO",desktop:"Настолни компютри",helpDialogTitle:"Тълкуване на отчета на Lighthouse за навигацията",helpLabel:"Информация за навигацията",helpUseCaseInstructionNavigation:"Използване на отчетите за навигирането за...",helpUseCaseInstructionSnapshot:"Използвайте отчетите за моментната снимка за...",helpUseCaseInstructionTimespan:"Използване на отчетите за периода от време за...",helpUseCaseNavigation1:"Получаване на резултат за ефективността от Lighthouse.",helpUseCaseNavigation2:"Измерване на показатели за ефективността при зареждане на страниците, като например изобразяване на най-голямото съдържание (LCP) и индекс на скоростта.",helpUseCaseNavigation3:"Тестване на възможностите на прогресивни уеб приложения.",helpUseCaseSnapshot1:"Намиране на проблеми с достъпността в приложения от една страница и сложни формуляри.",helpUseCaseSnapshot2:"Анализ на най-добрите практики, свързани с взаимодействията с менюта и елементи на ПИ.",helpUseCaseTimespan1:"Измерване на структурните промени и времето за изпълнение на JavaScript за поредица от взаимодействия.",helpUseCaseTimespan2:"Откриване на възможности за подобряване на ефективността на продължително отворените страници и приложенията от една страница.",highestImpact:"С най-голямо въздействие",informativeAuditCount:"{numInformative,plural, =1{{numInformative} информативна проверка}other{{numInformative} информативни проверки}}",mobile:"Мобилни устройства",navigationDescription:"Зареждане на страницата",navigationLongDescription:"Отчетите за навигацията анализират зареждането на отделни страници, точно както първоначалните отчети на Lighthouse.",navigationReport:"Отчет за навигирането",navigationReportCount:"{numNavigation,plural, =1{{numNavigation} отчет за навигирането}other{{numNavigation} отчета за навигирането}}",passableAuditCount:"{numPassableAudits,plural, =1{{numPassableAudits} проверка, която може да бъде премината успешно}other{{numPassableAudits} проверки, които могат да бъдат преминати успешно}}",passedAuditCount:"{numPassed,plural, =1{{numPassed} успешна проверка}other{{numPassed} успешни проверки}}",ratingAverage:"Средна",ratingError:"Грешка",ratingFail:"Лоша",ratingPass:"Добра",save:"Запазване",snapshotDescription:"Моментно състояние на страницата",snapshotLongDescription:"Отчетите за моментната снимка анализират страницата в определено състояние, обикновено след потребителски взаимодействия.",snapshotReport:"Отчет за моментното състояние",snapshotReportCount:"{numSnapshot,plural, =1{{numSnapshot} отчет за моментната снимка}other{{numSnapshot} отчета за моментната снимка}}",summary:"Обобщена информация",timespanDescription:"Потребителски взаимодействия",timespanLongDescription:"Отчетите за периода от време анализират произволен времеви интервал, който обикновено съдържа потребителски взаимодействия.",timespanReport:"Отчет за периода от време",timespanReportCount:"{numTimespan,plural, =1{{numTimespan} отчет за периода от време}other{{numTimespan} отчета за периода от време}}",title:"Отчет на Lighthouse за потребителската навигация"},ca:{allReports:"Tots els informes",categories:"Categories",categoryAccessibility:"Accessibilitat",categoryBestPractices:"Pràctiques recomanades",categoryPerformance:"Rendiment",categorySeo:"SEO",desktop:"Escriptori",helpDialogTitle:"Explicació de l'informe de fluxos de Lighthouse",helpLabel:"Explicació dels fluxos",helpUseCaseInstructionNavigation:"Utilitza els informes de navegació per...",helpUseCaseInstructionSnapshot:"Utilitza els informes d'una instantània per...",helpUseCaseInstructionTimespan:"Utilitza els informes d'un període de temps per...",helpUseCaseNavigation1:"Obtén una puntuació del rendiment de Lighthouse.",helpUseCaseNavigation2:"Mesura les mètriques de rendiment de la càrrega de pàgines, com ara la renderització de l'element més gran amb contingut i l'índex de velocitat.",helpUseCaseNavigation3:"Avalua les funcions d'una aplicació web progressiva.",helpUseCaseSnapshot1:"Cerca problemes d'accessibilitat en aplicacions d'una sola pàgina o en formularis complexos.",helpUseCaseSnapshot2:"Avalua les pràctiques recomanades dels menús i dels elements de la interfície d'usuari amagats darrere de la interacció.",helpUseCaseTimespan1:"Mesura els canvis de disseny i el temps d'execució de JavaScript en una sèrie d'interaccions.",helpUseCaseTimespan2:"Descobreix oportunitats de rendiment per millorar l'experiència en pàgines de llarga durada i en aplicacions d'una sola pàgina.",highestImpact:"Millor impacte",informativeAuditCount:"{numInformative,plural, =1{{numInformative} auditoria informativa}other{{numInformative} auditories informatives}}",mobile:"Mòbil",navigationDescription:"Càrrega de la pàgina",navigationLongDescription:"Els informes de navegació analitzen la càrrega d'una sola pàgina, exactament igual que els informes originals de Lighthouse.",navigationReport:"Informe de navegació",navigationReportCount:"{numNavigation,plural, =1{{numNavigation} informe de navegació}other{{numNavigation} informes de navegació}}",passableAuditCount:"{numPassableAudits,plural, =1{{numPassableAudits} auditoria aprovable}other{{numPassableAudits} auditories aprovables}}",passedAuditCount:"{numPassed,plural, =1{{numPassed} auditoria aprovada}other{{numPassed} auditories aprovades}}",ratingAverage:"Normal",ratingError:"Error",ratingFail:"Deficient",ratingPass:"Bo",save:"Desa",snapshotDescription:"Estat capturat de la pàgina",snapshotLongDescription:"Els informes d'una instantània analitzen la pàgina en un estat concret, normalment després de les interaccions dels usuaris.",snapshotReport:"Informe d'una instantània",snapshotReportCount:"{numSnapshot,plural, =1{{numSnapshot} informe d'una instantània}other{{numSnapshot} informes d'una instantània}}",summary:"Resum",timespanDescription:"Interaccions dels usuaris",timespanLongDescription:"Els informes d'un període de temps analitzen un període de temps arbitrari, que sol contenir interaccions dels usuaris.",timespanReport:"Informe d'un període de temps",timespanReportCount:"{numTimespan,plural, =1{{numTimespan} informe d'un període de temps}other{{numTimespan} informes d'un període de temps}}",title:"Informe del flux d'usuaris de Lighthouse"},cs:{allReports:"Všechny přehledy",categories:"Kategorie",categoryAccessibility:"Přístupnost",categoryBestPractices:"Doporučené postupy",categoryPerformance:"Výkon",categorySeo:"SEO",desktop:"Počítač",helpDialogTitle:"Vysvětlení přehledu procesu Lighthouse",helpLabel:"Vysvětlení procesů",helpUseCaseInstructionNavigation:"Pomocí přehledů navigace můžete…",helpUseCaseInstructionSnapshot:"Pomocí přehledů v konkrétním okamžiku můžete…",helpUseCaseInstructionTimespan:"Pomocí přehledů časového rozpětí můžete…",helpUseCaseNavigation1:"Získat skóre výkonu Lighthouse.",helpUseCaseNavigation2:"Měřit metriky načítání stránek, jako jsou vykreslení největšího obsahu a index rychlosti.",helpUseCaseNavigation3:"Vyhodnotit funkce progresivních webových aplikací.",helpUseCaseSnapshot1:"Odhalit problémy s přístupností v jednostránkových aplikacích nebo složitých formulářích.",helpUseCaseSnapshot2:"Vyhodnotit doporučené postupy týkající se nabídek a prvků uživatelského rozhraní skryté za interakcí.",helpUseCaseTimespan1:"Měřit změny rozvržení a dobu běhu JavaScriptu v sériích interakcí.",helpUseCaseTimespan2:"Objevit příležitosti ke zlepšení výkonu, které vám umožní vylepšit výkon dlouho používaných stránek a jednostránkových aplikací.",highestImpact:"Nejvyšší dopad",informativeAuditCount:"{numInformative,plural, =1{{numInformative} informativní audit}few{{numInformative} informativní audity}many{{numInformative} informativního auditu}other{{numInformative} informativních auditů}}",mobile:"Mobil",navigationDescription:"Načtení stránky",navigationLongDescription:"Přehledy navigace analyzují jedno načtení stránky, stejně jako původní přehledy Lighthouse.",navigationReport:"Přehled navigace",navigationReportCount:"{numNavigation,plural, =1{{numNavigation} přehled navigace}few{{numNavigation} přehledy navigace}many{{numNavigation} přehledu navigace}other{{numNavigation} přehledů navigace}}",passableAuditCount:"{numPassableAudits,plural, =1{{numPassableAudits} splnitelný audit}few{{numPassableAudits} splnitelné audity}many{{numPassableAudits} splnitelného auditu}other{{numPassableAudits} splnitelných auditů}}",passedAuditCount:"{numPassed,plural, =1{{numPassed} splněný audit}few{{numPassed} splněné audity}many{{numPassed} splněného auditu}other{{numPassed} splněných auditů}}",ratingAverage:"Průměr",ratingError:"Chyba",ratingFail:"Slabé",ratingPass:"Dobré",save:"Uložit",snapshotDescription:"Zachycený stav stránky",snapshotLongDescription:"Přehledy v konkrétním okamžiku analyzují stránku v konkrétním stavu, obvykle po interakcích uživatelů.",snapshotReport:"Přehled v konkrétním okamžiku",snapshotReportCount:"{numSnapshot,plural, =1{{numSnapshot} přehled v konkrétním okamžiku}few{{numSnapshot} přehledy v konkrétním okamžiku}many{{numSnapshot} přehledu v konkrétním okamžiku}other{{numSnapshot} přehledů v konkrétním okamžiku}}",summary:"Souhrn",timespanDescription:"Interakce uživatelů",timespanLongDescription:"Přehledy časového rozpětí analyzují libovolné období, které obvykle zahrnuje interakce uživatelů.",timespanReport:"Přehled časového rozpětí",timespanReportCount:"{numTimespan,plural, =1{{numTimespan} přehled časového rozpětí}few{{numTimespan} přehledy časového rozpětí}many{{numTimespan} přehledu časového rozpětí}other{{numTimespan} přehledů časového rozpětí}}",title:"Přehled toku uživatelů služby Lighthouse"},da:{allReports:"Alle rapporter",categories:"Kategorier",categoryAccessibility:"Hjælpefunktioner",categoryBestPractices:"Optimale løsninger",categoryPerformance:"Effektivitet",categorySeo:"SEO",desktop:"Computer",helpDialogTitle:"Sådan skal rapporten over flow i Lighthouse forstås",helpLabel:"Sådan skal flow forstås",helpUseCaseInstructionNavigation:"Brug rapporter over navigation til...",helpUseCaseInstructionSnapshot:"Brug øjebliksbillederapporter til...",helpUseCaseInstructionTimespan:"Brug rapporter over tidsperioder til...",helpUseCaseNavigation1:"Få en Lighthouse-ydeevnescore.",helpUseCaseNavigation2:"Mål metrics for sideindlæsning såsom største udfyldning af indhold og Speed Index.",helpUseCaseNavigation3:"Vurder mulighederne med progressive webapps.",helpUseCaseSnapshot1:"Find tilgængelighedsproblemer i enkeltsideapps og komplekse formularer.",helpUseCaseSnapshot2:"Evaluer optimale løsninger til menuer og brugerfladeelementer, der er skjult bag interaktioner.",helpUseCaseTimespan1:"Mål layoutskift og tid for JavaScript-udførelse på en række interaktioner.",helpUseCaseTimespan2:"Se ydeevnemuligheder, der kan forbedre oplevelsen af langvarige sider og enkeltssideapps.",highestImpact:"Størst indflydelse",informativeAuditCount:"{numInformative,plural, =1{{numInformative} informativ gennemgang}one{{numInformative} informativ gennemgang}other{{numInformative} informative gennemgange}}",mobile:"Mobil",navigationDescription:"Sideindlæsning",navigationLongDescription:"Rapporter over navigation analyserer indlæsning af en enkelt side, præcis som de oprindelige Lighthouse-rapporter.",navigationReport:"Rapport over navigation",navigationReportCount:"{numNavigation,plural, =1{{numNavigation} navigationsrapportering}one{{numNavigation} navigationsrapportering}other{{numNavigation} navigationsrapporteringer}}",passableAuditCount:"{numPassableAudits,plural, =1{{numPassableAudits} gennemgang, der kan godkendes}one{{numPassableAudits} gennemgang, der kan godkendes}other{{numPassableAudits} gennemgange, der kan godkendes}}",passedAuditCount:"{numPassed,plural, =1{{numPassed} gennemgang er blevet godkendt}one{{numPassed} gennemgang er blevet godkendt}other{{numPassed} gennemgange er blevet godkendt}}",ratingAverage:"Gennemsnit",ratingError:"Fejl",ratingFail:"Dårlig",ratingPass:"God",save:"Gem",snapshotDescription:"En sides tilstand på et specifikt tidspunkt",snapshotLongDescription:"Øjebliksbillederapporter analyserer siden i en specifik tilstand, typisk efter brugerinteraktioner.",snapshotReport:"Rapport med øjebliksbillede",snapshotReportCount:"{numSnapshot,plural, =1{{numSnapshot} rapportering af øjebliksbillede}one{{numSnapshot} rapportering af øjebliksbillede}other{{numSnapshot} rapporteringer af øjebliksbillede}}",summary:"Oversigt",timespanDescription:"Brugerinteraktioner",timespanLongDescription:"Rapporter over tidsperioder analyserer en tilfældig periode, typisk med brugerinteraktioner.",timespanReport:"Rapport over tidsperiode",timespanReportCount:"{numTimespan,plural, =1{{numTimespan} tidsperioderapportering}one{{numTimespan} tidsperioderapportering}other{{numTimespan} tidsperioderapporteringer}}",title:"Rapport over brugerflow i Lighthouse"},de:{allReports:"Alle Berichte",categories:"Kategorien",categoryAccessibility:"Barrierefreiheit",categoryBestPractices:"Best Practices",categoryPerformance:"Leistung",categorySeo:"SEO",desktop:"Computer",helpDialogTitle:"Informationen über den Lighthouse-Bericht zur Aufrufabfolge",helpLabel:"Informationen über Aufrufabfolgen",helpUseCaseInstructionNavigation:"Navigationsberichte können für Folgendes verwendet werden:",helpUseCaseInstructionSnapshot:"Snapshot-Berichte können für Folgendes verwendet werden:",helpUseCaseInstructionTimespan:"Zeitspannenberichte können für Folgendes verwendet werden:",helpUseCaseNavigation1:"Eine Lighthouse-Leistungsbewertung erhalten.",helpUseCaseNavigation2:"Messwerte zur Leistung beim Seitenaufbau erfassen, z. B. Largest Contentful Paint oder Speed Index.",helpUseCaseNavigation3:"Funktionen progressiver Web-Apps bewerten.",helpUseCaseSnapshot1:"Probleme mit der Barrierefreiheit in Single-Page-Anwendungen oder komplexen Formularen finden.",helpUseCaseSnapshot2:"Best Practices für hinter einer Interaktion versteckte Menüs und UI-Elemente bewerten.",helpUseCaseTimespan1:"Layoutverschiebungen und JavaScript-Ausführungszeit bei einer Reihe von Interaktionen messen.",helpUseCaseTimespan2:"Leistungsmöglichkeiten finden, um die Nutzung für langlebige Seiten und Single-Page-Anwendungen zu verbessern.",highestImpact:"Größte Wirkung",informativeAuditCount:"{numInformative,plural, =1{{numInformative} informative Prüfung}other{{numInformative} informative Prüfungen}}",mobile:"Mobil",navigationDescription:"Seitenaufbau",navigationLongDescription:"Mit Navigationsberichten wird der Aufbau einer einzelnen Seite analysiert, genau wie mit den ursprünglichen Lighthouse-Berichten.",navigationReport:"Navigationsbericht",navigationReportCount:"{numNavigation,plural, =1{{numNavigation} Navigationsbericht}other{{numNavigation} Navigationsberichte}}",passableAuditCount:"{numPassableAudits,plural, =1{{numPassableAudits} bestehbare Prüfung}other{{numPassableAudits} bestehbare Prüfungen}}",passedAuditCount:"{numPassed,plural, =1{{numPassed} Prüfung bestanden}other{{numPassed} Prüfungen bestanden}}",ratingAverage:"Durchschnittlich",ratingError:"Fehler",ratingFail:"Schlecht",ratingPass:"Gut",save:"Speichern",snapshotDescription:"Erfasster Seitenstatus",snapshotLongDescription:"Mit Snapshot-Berichten werden Seiten in einem bestimmten Zustand analysiert, in der Regel nach Nutzerinteraktionen.",snapshotReport:"Snapshot-Bericht",snapshotReportCount:"{numSnapshot,plural, =1{{numSnapshot} Snapshot-Bericht}other{{numSnapshot} Snapshot-Berichte}}",summary:"Zusammenfassung",timespanDescription:"Nutzerinteraktionen",timespanLongDescription:"Mit Zeitspannenberichten wird ein beliebiger Zeitraum analysiert, normalerweise einer, der Nutzerinteraktionen enthält.",timespanReport:"Zeitspannenbericht",timespanReportCount:"{numTimespan,plural, =1{{numTimespan} Zeitspannenbericht}other{{numTimespan} Zeitspannenberichte}}",title:"Lighthouse-Bericht zur Aufrufabfolge"},el:{allReports:"Όλες οι αναφορές",categories:"Κατηγορίες",categoryAccessibility:"Προσβασιμότητα",categoryBestPractices:"Βέλτιστες πρακτικές",categoryPerformance:"Απόδοση",categorySeo:"SEO",desktop:"Υπολογιστής",helpDialogTitle:"Κατανόηση της αναφοράς ροής του Lighthouse",helpLabel:"Κατανόηση των ροών",helpUseCaseInstructionNavigation:"Χρησιμοποιήστε τις αναφορές των αναφορών πλοήγησης για να...",helpUseCaseInstructionSnapshot:"Χρησιμοποιήστε τις αναφορές Snapshot για να...",helpUseCaseInstructionTimespan:"Χρησιμοποιήστε τις αναφορές χρονικού διαστήματος για να...",helpUseCaseNavigation1:"Λάβετε μια βαθμολογία απόδοσης του Lighthouse.",helpUseCaseNavigation2:"Υπολογίσετε τις μετρήσεις απόδοσης φόρτωσης σελίδας, όπως Μεγαλύτερη σχεδίαση με περιεχόμενο και Ευρετήριο ταχύτητας.",helpUseCaseNavigation3:"Αξιολογήσετε τις δυνατότητες προηγμένων εφαρμογών ιστού.",helpUseCaseSnapshot1:"Εντοπίσετε ζητήματα προσβασιμότητας σε εφαρμογές μίας σελίδας ή σύνθετες φόρμες.",helpUseCaseSnapshot2:"Αξιολογήσετε τις βέλτιστες πρακτικές των μενού και στοιχείων διεπαφής χρήστη που κρύβονται πίσω από αλληλεπιδράσεις.",helpUseCaseTimespan1:"Μετρήσετε τις αλλαγές διάταξης και τον χρόνο εκτέλεσης JavaScript σε μια σειρά αλληλεπιδράσεων.",helpUseCaseTimespan2:"Ανακαλύψετε ευκαιρίες απόδοσης για να βελτιώσετε την εμπειρία για σελίδες μεγάλης διάρκειας και εφαρμογές μίας σελίδας.",highestImpact:"Υψηλότερος αντίκτυπος",informativeAuditCount:"{numInformative,plural, =1{{numInformative} πληροφοριακός έλεγχος}other{{numInformative} πληροφοριακοί έλεγχοι}}",mobile:"Κινητό",navigationDescription:"Φόρτωση σελίδας",navigationLongDescription:"Οι αναφορές πλοήγησης αναλύουν τη φόρτωση μίας σελίδας, ακριβώς όπως οι πρωτότυπες αναφορές του Lighthouse.",navigationReport:"Αναφορά πλοήγησης",navigationReportCount:"{numNavigation,plural, =1{{numNavigation} αναφορά πλοήγησης}other{{numNavigation} αναφορές πλοήγησης}}",passableAuditCount:"{numPassableAudits,plural, =1{{numPassableAudits} έλεγχος που μπορεί να ολοκληρωθεί}other{{numPassableAudits} έλεγχοι που μπορούν να ολοκληρωθούν}}",passedAuditCount:"{numPassed,plural, =1{{numPassed} έλεγχος ολοκληρώθηκε}other{{numPassed} έλεγχοι ολοκληρώθηκαν}}",ratingAverage:"Μέτρια",ratingError:"Σφάλμα",ratingFail:"Χαμηλή",ratingPass:"Καλή",save:"Αποθήκευση",snapshotDescription:"Καταγεγραμμένη κατάσταση σελίδας",snapshotLongDescription:"Οι αναφορές Snapshot αναλύουν τη σελίδα σε μια συγκεκριμένη κατάσταση, συνήθως μετά από αλληλεπιδράσεις χρηστών.",snapshotReport:"Αναφορά σύνοψης",snapshotReportCount:"{numSnapshot,plural, =1{{numSnapshot} αναφορά σύνοψης}other{{numSnapshot} αναφορές σύνοψης}}",summary:"Σύνοψη",timespanDescription:"Αλληλεπιδράσεις χρήστη",timespanLongDescription:"Οι αναφορές χρονικού διαστήματος αναλύουν μια τυχαία χρονική περίοδο, η οποία συνήθως περιέχει αλληλεπιδράσεις χρηστών.",timespanReport:"Αναφορά χρονικού διαστήματος",timespanReportCount:"{numTimespan,plural, =1{{numTimespan} αναφορά χρονικού διαστήματος}other{{numTimespan} αναφορές χρονικού διαστήματος}}",title:"Αναφορά ροής χρήστη Lighthouse"},"en-XA":{allReports:"[Åļļ Ŕéþöŕţš one two]",categories:"[Çåţéĝöŕîéš one two]",categoryAccessibility:"[Åççéššîбîļîţý one two]",categoryBestPractices:"[Бéšţ Þŕåçţîçéš one two]",categoryPerformance:"[Þéŕƒöŕmåñçé one two]",categorySeo:"[ŠÉÖ one]",desktop:"[Ðéšķţöþ one]",helpDialogTitle:"[Ûñðéŕšţåñðîñĝ ţĥé Ļîĝĥţĥöûšé Fļöŵ Ŕéþöŕţ one two three four five six seven eight]",helpLabel:"[Ûñðéŕšţåñðîñĝ Fļöŵš one two three]",helpUseCaseInstructionNavigation:"[Ûšé Ñåvîĝåţîöñ ŕéþöŕţš ţö... one two three four five six]",helpUseCaseInstructionSnapshot:"[Ûšé Šñåþšĥöţ ŕéþöŕţš ţö... one two three four five six]",helpUseCaseInstructionTimespan:"[Ûšé Ţîméšþåñ ŕéþöŕţš ţö... one two three four five six]",helpUseCaseNavigation1:"[Öбţåîñ å Ļîĝĥţĥöûšé Þéŕƒöŕmåñçé šçöŕé. one two three four five six seven eight]",helpUseCaseNavigation2:"[Méåšûŕé þåĝé ļöåð Þéŕƒöŕmåñçé méţŕîçš šûçĥ åš Ļåŕĝéšţ Çöñţéñţƒûļ Þåîñţ åñð Šþééð Îñðéx. one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen]",helpUseCaseNavigation3:"[Åššéšš Þŕöĝŕéššîvé Ŵéб Åþþ çåþåбîļîţîéš. one two three four five six seven eight]",helpUseCaseSnapshot1:"[Fîñð åççéššîбîļîţý îššûéš îñ šîñĝļé þåĝé åþþļîçåţîöñš öŕ çömþļéx ƒöŕmš. one two three four five six seven eight nine ten eleven twelve thirteen]",helpUseCaseSnapshot2:"[Évåļûåţé бéšţ þŕåçţîçéš öƒ méñûš åñð ÛÎ éļéméñţš ĥîððéñ бéĥîñð îñţéŕåçţîöñ. one two three four five six seven eight nine ten eleven twelve thirteen fourteen]",helpUseCaseTimespan1:"[Méåšûŕé ļåýöûţ šĥîƒţš åñð ĴåvåŠçŕîþţ éxéçûţîöñ ţîmé öñ å šéŕîéš öƒ îñţéŕåçţîöñš. one two three four five six seven eight nine ten eleven twelve thirteen fourteen]",helpUseCaseTimespan2:"[Ðîšçövéŕ þéŕƒöŕmåñçé öþþöŕţûñîţîéš ţö îmþŕövé ţĥé éxþéŕîéñçé ƒöŕ ļöñĝ-ļîvéð þåĝéš åñð šîñĝļé-þåĝé åþþļîçåţîöñš. one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen]",highestImpact:"[Ĥîĝĥéšţ îmþåçţ one two]",informativeAuditCount:"{numInformative,plural, =1{[ᐅ{numInformative}ᐊ îñƒöŕmåţîvé åûðîţ one two three four five]}other{[ᐅ{numInformative}ᐊ îñƒöŕmåţîvé åûðîţš one two three four five]}}",mobile:"[Möбîļé one]",navigationDescription:"[Þåĝé ļöåð one two]",navigationLongDescription:"[Ñåvîĝåţîöñ ŕéþöŕţš åñåļýžé å šîñĝļé þåĝé ļöåð, éxåçţļý ļîķé ţĥé öŕîĝîñåļ Ļîĝĥţĥöûšé ŕéþöŕţš. one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen]",navigationReport:"[Ñåvîĝåţîöñ ŕéþöŕţ one two three]",navigationReportCount:"{numNavigation,plural, =1{[ᐅ{numNavigation}ᐊ ñåvîĝåţîöñ ŕéþöŕţ one two three four five]}other{[ᐅ{numNavigation}ᐊ ñåvîĝåţîöñ ŕéþöŕţš one two three four five]}}",passableAuditCount:"{numPassableAudits,plural, =1{[ᐅ{numPassableAudits}ᐊ þåššåбļé åûðîţ one two three four]}other{[ᐅ{numPassableAudits}ᐊ þåššåбļé åûðîţš one two three four]}}",passedAuditCount:"{numPassed,plural, =1{[ᐅ{numPassed}ᐊ åûðîţ þåššéð one two three four]}other{[ᐅ{numPassed}ᐊ åûðîţš þåššéð one two three four]}}",ratingAverage:"[Åvéŕåĝé one]",ratingError:"[Éŕŕöŕ one]",ratingFail:"[Þööŕ one]",ratingPass:"[Ĝööð one]",save:"[Šåvé one]",snapshotDescription:"[Çåþţûŕéð šţåţé öƒ þåĝé one two three four five]",snapshotLongDescription:"[Šñåþšĥöţ ŕéþöŕţš åñåļýžé ţĥé þåĝé îñ å þåŕţîçûļåŕ šţåţé, ţýþîçåļļý åƒţéŕ ûšéŕ îñţéŕåçţîöñš. one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen]",snapshotReport:"[Šñåþšĥöţ ŕéþöŕţ one two]",snapshotReportCount:"{numSnapshot,plural, =1{[ᐅ{numSnapshot}ᐊ šñåþšĥöţ ŕéþöŕţ one two three four]}other{[ᐅ{numSnapshot}ᐊ šñåþšĥöţ ŕéþöŕţš one two three four five]}}",summary:"[Šûmmåŕý one]",timespanDescription:"[Ûšéŕ îñţéŕåçţîöñš one two three]",timespanLongDescription:"[Ţîméšþåñ ŕéþöŕţš åñåļýžé åñ åŕбîţŕåŕý þéŕîöð öƒ ţîmé, ţýþîçåļļý çöñţåîñîñĝ ûšéŕ îñţéŕåçţîöñš. one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen]",timespanReport:"[Ţîméšþåñ ŕéþöŕţ one two]",timespanReportCount:"{numTimespan,plural, =1{[ᐅ{numTimespan}ᐊ ţîméšþåñ ŕéþöŕţ one two three four]}other{[ᐅ{numTimespan}ᐊ ţîméšþåñ ŕéþöŕţš one two three four five]}}",title:"[Ļîĝĥţĥöûšé Ûšéŕ Fļöŵ Ŕéþöŕţ one two three four five six]"},"en-XL":{allReports:"Âĺl̂ Ŕêṕôŕt̂ś",categories:"Ĉát̂éĝór̂íêś",categoryAccessibility:"Âćĉéŝśîb́îĺît́ŷ",categoryBestPractices:"B̂éŝt́ P̂ŕâćt̂íĉéŝ",categoryPerformance:"P̂ér̂f́ôŕm̂án̂ćê",categorySeo:"ŜÉÔ",desktop:"D̂éŝḱt̂óp̂",helpDialogTitle:"Ûńd̂ér̂śt̂án̂d́îńĝ t́ĥé L̂íĝh́t̂h́ôúŝé F̂ĺôẃ R̂ép̂ór̂t́",helpLabel:"Ûńd̂ér̂śt̂án̂d́îńĝ F́l̂óŵś",helpUseCaseInstructionNavigation:"Ûśê Ńâv́îǵât́îón̂ ŕêṕôŕt̂ś t̂ó...",helpUseCaseInstructionSnapshot:"Ûśê Śn̂áp̂śĥót̂ ŕêṕôŕt̂ś t̂ó...",helpUseCaseInstructionTimespan:"Ûśê T́îḿêśp̂án̂ ŕêṕôŕt̂ś t̂ó...",helpUseCaseNavigation1:"Ôb́t̂áîń â Ĺîǵĥt́ĥóûśê Ṕêŕf̂ór̂ḿâńĉé ŝćôŕê.",helpUseCaseNavigation2:"M̂éâśûŕê ṕâǵê ĺôád̂ Ṕêŕf̂ór̂ḿâńĉé m̂ét̂ŕîćŝ śûćĥ áŝ Ĺâŕĝéŝt́ Ĉón̂t́êńt̂f́ûĺ P̂áîńt̂ án̂d́ Ŝṕêéd̂ Ín̂d́êx́.",helpUseCaseNavigation3:"Âśŝéŝś P̂ŕôǵr̂éŝśîv́ê Ẃêb́ Âṕp̂ ćâṕâb́îĺît́îéŝ.",helpUseCaseSnapshot1:"F̂ín̂d́ âćĉéŝśîb́îĺît́ŷ íŝśûéŝ ín̂ śîńĝĺê ṕâǵê áp̂ṕl̂íĉát̂íôńŝ ór̂ ćôḿp̂ĺêx́ f̂ór̂ḿŝ.",helpUseCaseSnapshot2:"Êv́âĺûát̂é b̂éŝt́ p̂ŕâćt̂íĉéŝ óf̂ ḿêńûś âńd̂ ÚÎ él̂ém̂én̂t́ŝ h́îd́d̂én̂ b́êh́îńd̂ ín̂t́êŕâćt̂íôń.",helpUseCaseTimespan1:"M̂éâśûŕê ĺâýôút̂ śĥíf̂t́ŝ án̂d́ Ĵáv̂áŜćr̂íp̂t́ êx́êćût́îón̂ t́îḿê ón̂ á ŝér̂íêś ôf́ îńt̂ér̂áĉt́îón̂ś.",helpUseCaseTimespan2:"D̂íŝćôv́êŕ p̂ér̂f́ôŕm̂án̂ćê óp̂ṕôŕt̂ún̂ít̂íêś t̂ó îḿp̂ŕôv́ê t́ĥé êx́p̂ér̂íêńĉé f̂ór̂ ĺôńĝ-ĺîv́êd́ p̂áĝéŝ án̂d́ ŝín̂ǵl̂é-p̂áĝé âṕp̂ĺîćât́îón̂ś.",highestImpact:"Ĥíĝh́êśt̂ ím̂ṕâćt̂",informativeAuditCount:`{numInformative, plural,
    =1 {{numInformative} îńf̂ór̂ḿât́îv́ê áûd́ît́}
    other {{numInformative} îńf̂ór̂ḿât́îv́ê áûd́ît́ŝ}
  }`,mobile:"M̂ób̂íl̂é",navigationDescription:"P̂áĝé l̂óâd́",navigationLongDescription:"N̂áv̂íĝát̂íôń r̂ép̂ór̂t́ŝ án̂ál̂ýẑé â śîńĝĺê ṕâǵê ĺôád̂, éx̂áĉt́l̂ý l̂ík̂é t̂h́ê ór̂íĝín̂ál̂ Ĺîǵĥt́ĥóûśê ŕêṕôŕt̂ś.",navigationReport:"N̂áv̂íĝát̂íôń r̂ép̂ór̂t́",navigationReportCount:`{numNavigation, plural,
    =1 {{numNavigation} n̂áv̂íĝát̂íôń r̂ép̂ór̂t́}
    other {{numNavigation} n̂áv̂íĝát̂íôń r̂ép̂ór̂t́ŝ}
  }`,passableAuditCount:`{numPassableAudits, plural,
    =1 {{numPassableAudits} p̂áŝśâb́l̂é âúd̂ít̂}
    other {{numPassableAudits} ṕâśŝáb̂ĺê áûd́ît́ŝ}
  }`,passedAuditCount:`{numPassed, plural,
    =1 {{numPassed} âúd̂ít̂ ṕâśŝéd̂}
    other {{numPassed} áûd́ît́ŝ ṕâśŝéd̂}
  }`,ratingAverage:"Âv́êŕâǵê",ratingError:"Êŕr̂ór̂",ratingFail:"P̂óôŕ",ratingPass:"Ĝóôd́",save:"Ŝáv̂é",snapshotDescription:"Ĉáp̂t́ûŕêd́ ŝt́ât́ê óf̂ ṕâǵê",snapshotLongDescription:"Ŝńâṕŝh́ôt́ r̂ép̂ór̂t́ŝ án̂ál̂ýẑé t̂h́ê ṕâǵê ín̂ á p̂ár̂t́îćûĺâŕ ŝt́ât́ê, t́ŷṕîćâĺl̂ý âf́t̂ér̂ úŝér̂ ín̂t́êŕâćt̂íôńŝ.",snapshotReport:"Ŝńâṕŝh́ôt́ r̂ép̂ór̂t́",snapshotReportCount:`{numSnapshot, plural,
    =1 {{numSnapshot} ŝńâṕŝh́ôt́ r̂ép̂ór̂t́}
    other {{numSnapshot} ŝńâṕŝh́ôt́ r̂ép̂ór̂t́ŝ}
  }`,summary:"Ŝúm̂ḿâŕŷ",timespanDescription:"Ûśêŕ îńt̂ér̂áĉt́îón̂ś",timespanLongDescription:"T̂ím̂éŝṕâń r̂ép̂ór̂t́ŝ án̂ál̂ýẑé âń âŕb̂ít̂ŕâŕŷ ṕêŕîód̂ óf̂ t́îḿê, t́ŷṕîćâĺl̂ý ĉón̂t́âín̂ín̂ǵ ûśêŕ îńt̂ér̂áĉt́îón̂ś.",timespanReport:"T̂ím̂éŝṕâń r̂ép̂ór̂t́",timespanReportCount:`{numTimespan, plural,
    =1 {{numTimespan} t̂ím̂éŝṕâń r̂ép̂ór̂t́}
    other {{numTimespan} t̂ím̂éŝṕâń r̂ép̂ór̂t́ŝ}
  }`,title:"L̂íĝh́t̂h́ôúŝé Ûśêŕ F̂ĺôẃ R̂ép̂ór̂t́"},es:{allReports:"Todos los informes",categories:"Categorías",categoryAccessibility:"Accesibilidad",categoryBestPractices:"Prácticas recomendadas",categoryPerformance:"Rendimiento",categorySeo:"SEO",desktop:"Ordenador",helpDialogTitle:"Interpretar los informes de flujo de Lighthouse",helpLabel:"Interpretar flujos",helpUseCaseInstructionNavigation:"Usa los informes de navegación para...",helpUseCaseInstructionSnapshot:"Usa los informes de un instante para...",helpUseCaseInstructionTimespan:"Usa los informes de tiempo para...",helpUseCaseNavigation1:"Obtener una puntuación del rendimiento de Lighthouse.",helpUseCaseNavigation2:"Medir métricas de rendimiento de carga de la página, como el renderizado del mayor elemento con contenido y el Speed Index.",helpUseCaseNavigation3:"Evaluar las funciones de una aplicación web progresiva.",helpUseCaseSnapshot1:"Detectar problemas de accesibilidad en aplicaciones de página única o formularios complejos.",helpUseCaseSnapshot2:"Evaluar las prácticas recomendadas para los menús y los elementos de interfaz de usuario ocultos tras las interacciones.",helpUseCaseTimespan1:"Medir los cambios de diseño y el tiempo de ejecución de JavaScript en una serie de interacciones.",helpUseCaseTimespan2:"Descubrir oportunidades de rendimiento para mejorar la experiencia en páginas de larga duración y en aplicaciones de página única.",highestImpact:"Mayor impacto",informativeAuditCount:"{numInformative,plural, =1{{numInformative} auditoría informativa}other{{numInformative} auditorías informativas}}",mobile:"Móvil",navigationDescription:"Carga de la página",navigationLongDescription:"Los informes de navegación analizan la carga de una sola página, exactamente igual que los informes originales de Lighthouse.",navigationReport:"Informe de navegación",navigationReportCount:"{numNavigation,plural, =1{{numNavigation} informe de navegación}other{{numNavigation} informes de navegación}}",passableAuditCount:"{numPassableAudits,plural, =1{{numPassableAudits} auditoría aceptable}other{{numPassableAudits} auditorías aceptables}}",passedAuditCount:"{numPassed,plural, =1{{numPassed} auditoría superada}other{{numPassed} auditorías superadas}}",ratingAverage:"Ni buena ni mala",ratingError:"Error",ratingFail:"Mala",ratingPass:"Buena",save:"Guardar",snapshotDescription:"Captura del estado de la página",snapshotLongDescription:"Los informes de un instante analizan la página en un estado concreto, normalmente tras las interacciones de los usuarios.",snapshotReport:"Informe de un instante",snapshotReportCount:"{numSnapshot,plural, =1{{numSnapshot} informe de un instante}other{{numSnapshot} informes de un instante}}",summary:"Resumen",timespanDescription:"Interacciones del usuario",timespanLongDescription:"Los informes de tiempo analizan un periodo de tiempo arbitrario, que normalmente contiene interacciones de usuario.",timespanReport:"Informe de tiempo",timespanReportCount:"{numTimespan,plural, =1{{numTimespan} informe de tiempo}other{{numTimespan} informes de tiempo}}",title:"Informe de flujo de usuarios de Lighthouse"},"es-419":{allReports:"Todos los informes",categories:"Categorías",categoryAccessibility:"Accesibilidad",categoryBestPractices:"Recomendaciones",categoryPerformance:"Rendimiento",categorySeo:"SEO",desktop:"Escritorio",helpDialogTitle:"Explicación del informe de flujos de Lighthouse",helpLabel:"Explicación de flujos",helpUseCaseInstructionNavigation:"Utilizar los informes de navegación para…",helpUseCaseInstructionSnapshot:"Utilizar los informes de instantáneas para…",helpUseCaseInstructionTimespan:"Utilizar los informes de períodos para…",helpUseCaseNavigation1:"Obtener una puntuación de rendimiento de Lighthouse.",helpUseCaseNavigation2:"Obtener métricas de rendimiento de carga de páginas, como el Procesamiento de imagen con contenido más grande y el índice de velocidad.",helpUseCaseNavigation3:"Evaluar las capacidades de las apps web progresivas.",helpUseCaseSnapshot1:"Encontrar problemas de accesibilidad en aplicaciones de página única o formularios complejos.",helpUseCaseSnapshot2:"Evaluar prácticas recomendadas de menús y elementos de la IU ocultos detrás de la interacción.",helpUseCaseTimespan1:"Medir los cambios de diseño y el tiempo de ejecución de JavaScript en una serie de interacciones.",helpUseCaseTimespan2:"Descubrir oportunidades de rendimiento para mejorar la experiencia en aplicaciones de página única y en páginas abiertas por largo tiempo.",highestImpact:"Mayor impacto",informativeAuditCount:"{numInformative,plural, =1{{numInformative} auditoría informativa}other{{numInformative} auditorías informativas}}",mobile:"Para dispositivos móviles",navigationDescription:"Carga de página",navigationLongDescription:"Los informes de navegación analizan la carga de una sola página, de la misma manera que los informes originales de Lighthouse.",navigationReport:"Informe de navegación",navigationReportCount:"{numNavigation,plural, =1{{numNavigation} informe de navegación}other{{numNavigation} informes de navegación}}",passableAuditCount:"{numPassableAudits,plural, =1{{numPassableAudits} auditoría con posibilidades de aprobar}other{{numPassableAudits} auditorías con posibilidades de aprobar}}",passedAuditCount:"{numPassed,plural, =1{{numPassed} auditoría aprobada}other{{numPassed} auditorías aprobadas}}",ratingAverage:"Promedio",ratingError:"Error",ratingFail:"Deficiente",ratingPass:"Bueno",save:"Guardar",snapshotDescription:"Estado de la página en un momento específico",snapshotLongDescription:"Los informes de instantáneas analizan la página en un estado particular, por lo general, después de las interacciones de un usuario.",snapshotReport:"Informe de un momento específico",snapshotReportCount:"{numSnapshot,plural, =1{{numSnapshot} informe de un momento específico}other{{numSnapshot} informes de un momento específico}}",summary:"Resumen",timespanDescription:"Interacciones del usuario",timespanLongDescription:"Los informes de períodos analizan un período arbitrario, el cual por lo general incluye interacciones de los usuarios.",timespanReport:"Informe del período",timespanReportCount:"{numTimespan,plural, =1{{numTimespan} informe del período}other{{numTimespan} informes del período}}",title:"Informe del flujo de usuarios de Lighthouse"},"es-AR":{allReports:"Todos los informes",categories:"Categorías",categoryAccessibility:"Accesibilidad",categoryBestPractices:"Recomendaciones",categoryPerformance:"Rendimiento",categorySeo:"SEO",desktop:"Escritorio",helpDialogTitle:"Explicación del informe de flujos de Lighthouse",helpLabel:"Explicación de flujos",helpUseCaseInstructionNavigation:"Utilizar los informes de navegación para…",helpUseCaseInstructionSnapshot:"Utilizar los informes de instantáneas para…",helpUseCaseInstructionTimespan:"Utilizar los informes de períodos para…",helpUseCaseNavigation1:"Obtener una puntuación de rendimiento de Lighthouse.",helpUseCaseNavigation2:"Obtener métricas de rendimiento de carga de páginas, como el Procesamiento de imagen con contenido más grande y el índice de velocidad.",helpUseCaseNavigation3:"Evaluar las capacidades de las apps web progresivas.",helpUseCaseSnapshot1:"Encontrar problemas de accesibilidad en aplicaciones de página única o formularios complejos.",helpUseCaseSnapshot2:"Evaluar prácticas recomendadas de menús y elementos de la IU ocultos detrás de la interacción.",helpUseCaseTimespan1:"Medir los cambios de diseño y el tiempo de ejecución de JavaScript en una serie de interacciones.",helpUseCaseTimespan2:"Descubrir oportunidades de rendimiento para mejorar la experiencia en aplicaciones de página única y en páginas abiertas por largo tiempo.",highestImpact:"Mayor impacto",informativeAuditCount:"{numInformative,plural, =1{{numInformative} auditoría informativa}other{{numInformative} auditorías informativas}}",mobile:"Para dispositivos móviles",navigationDescription:"Carga de página",navigationLongDescription:"Los informes de navegación analizan la carga de una sola página, de la misma manera que los informes originales de Lighthouse.",navigationReport:"Informe de navegación",navigationReportCount:"{numNavigation,plural, =1{{numNavigation} informe de navegación}other{{numNavigation} informes de navegación}}",passableAuditCount:"{numPassableAudits,plural, =1{{numPassableAudits} auditoría con posibilidades de aprobar}other{{numPassableAudits} auditorías con posibilidades de aprobar}}",passedAuditCount:"{numPassed,plural, =1{{numPassed} auditoría aprobada}other{{numPassed} auditorías aprobadas}}",ratingAverage:"Promedio",ratingError:"Error",ratingFail:"Deficiente",ratingPass:"Bueno",save:"Guardar",snapshotDescription:"Estado de la página en un momento específico",snapshotLongDescription:"Los informes de instantáneas analizan la página en un estado particular, por lo general, después de las interacciones de un usuario.",snapshotReport:"Informe de un momento específico",snapshotReportCount:"{numSnapshot,plural, =1{{numSnapshot} informe de un momento específico}other{{numSnapshot} informes de un momento específico}}",summary:"Resumen",timespanDescription:"Interacciones del usuario",timespanLongDescription:"Los informes de períodos analizan un período arbitrario, el cual por lo general incluye interacciones de los usuarios.",timespanReport:"Informe del período",timespanReportCount:"{numTimespan,plural, =1{{numTimespan} informe del período}other{{numTimespan} informes del período}}",title:"Informe del flujo de usuarios de Lighthouse"},"es-BO":{allReports:"Todos los informes",categories:"Categorías",categoryAccessibility:"Accesibilidad",categoryBestPractices:"Recomendaciones",categoryPerformance:"Rendimiento",categorySeo:"SEO",desktop:"Escritorio",helpDialogTitle:"Explicación del informe de flujos de Lighthouse",helpLabel:"Explicación de flujos",helpUseCaseInstructionNavigation:"Utilizar los informes de navegación para…",helpUseCaseInstructionSnapshot:"Utilizar los informes de instantáneas para…",helpUseCaseInstructionTimespan:"Utilizar los informes de períodos para…",helpUseCaseNavigation1:"Obtener una puntuación de rendimiento de Lighthouse.",helpUseCaseNavigation2:"Obtener métricas de rendimiento de carga de páginas, como el Procesamiento de imagen con contenido más grande y el índice de velocidad.",helpUseCaseNavigation3:"Evaluar las capacidades de las apps web progresivas.",helpUseCaseSnapshot1:"Encontrar problemas de accesibilidad en aplicaciones de página única o formularios complejos.",helpUseCaseSnapshot2:"Evaluar prácticas recomendadas de menús y elementos de la IU ocultos detrás de la interacción.",helpUseCaseTimespan1:"Medir los cambios de diseño y el tiempo de ejecución de JavaScript en una serie de interacciones.",helpUseCaseTimespan2:"Descubrir oportunidades de rendimiento para mejorar la experiencia en aplicaciones de página única y en páginas abiertas por largo tiempo.",highestImpact:"Mayor impacto",informativeAuditCount:"{numInformative,plural, =1{{numInformative} auditoría informativa}other{{numInformative} auditorías informativas}}",mobile:"Para dispositivos móviles",navigationDescription:"Carga de página",navigationLongDescription:"Los informes de navegación analizan la carga de una sola página, de la misma manera que los informes originales de Lighthouse.",navigationReport:"Informe de navegación",navigationReportCount:"{numNavigation,plural, =1{{numNavigation} informe de navegación}other{{numNavigation} informes de navegación}}",passableAuditCount:"{numPassableAudits,plural, =1{{numPassableAudits} auditoría con posibilidades de aprobar}other{{numPassableAudits} auditorías con posibilidades de aprobar}}",passedAuditCount:"{numPassed,plural, =1{{numPassed} auditoría aprobada}other{{numPassed} auditorías aprobadas}}",ratingAverage:"Promedio",ratingError:"Error",ratingFail:"Deficiente",ratingPass:"Bueno",save:"Guardar",snapshotDescription:"Estado de la página en un momento específico",snapshotLongDescription:"Los informes de instantáneas analizan la página en un estado particular, por lo general, después de las interacciones de un usuario.",snapshotReport:"Informe de un momento específico",snapshotReportCount:"{numSnapshot,plural, =1{{numSnapshot} informe de un momento específico}other{{numSnapshot} informes de un momento específico}}",summary:"Resumen",timespanDescription:"Interacciones del usuario",timespanLongDescription:"Los informes de períodos analizan un período arbitrario, el cual por lo general incluye interacciones de los usuarios.",timespanReport:"Informe del período",timespanReportCount:"{numTimespan,plural, =1{{numTimespan} informe del período}other{{numTimespan} informes del período}}",title:"Informe del flujo de usuarios de Lighthouse"},"es-BR":{allReports:"Todos los informes",categories:"Categorías",categoryAccessibility:"Accesibilidad",categoryBestPractices:"Recomendaciones",categoryPerformance:"Rendimiento",categorySeo:"SEO",desktop:"Escritorio",helpDialogTitle:"Explicación del informe de flujos de Lighthouse",helpLabel:"Explicación de flujos",helpUseCaseInstructionNavigation:"Utilizar los informes de navegación para…",helpUseCaseInstructionSnapshot:"Utilizar los informes de instantáneas para…",helpUseCaseInstructionTimespan:"Utilizar los informes de períodos para…",helpUseCaseNavigation1:"Obtener una puntuación de rendimiento de Lighthouse.",helpUseCaseNavigation2:"Obtener métricas de rendimiento de carga de páginas, como el Procesamiento de imagen con contenido más grande y el índice de velocidad.",helpUseCaseNavigation3:"Evaluar las capacidades de las apps web progresivas.",helpUseCaseSnapshot1:"Encontrar problemas de accesibilidad en aplicaciones de página única o formularios complejos.",helpUseCaseSnapshot2:"Evaluar prácticas recomendadas de menús y elementos de la IU ocultos detrás de la interacción.",helpUseCaseTimespan1:"Medir los cambios de diseño y el tiempo de ejecución de JavaScript en una serie de interacciones.",helpUseCaseTimespan2:"Descubrir oportunidades de rendimiento para mejorar la experiencia en aplicaciones de página única y en páginas abiertas por largo tiempo.",highestImpact:"Mayor impacto",informativeAuditCount:"{numInformative,plural, =1{{numInformative} auditoría informativa}other{{numInformative} auditorías informativas}}",mobile:"Para dispositivos móviles",navigationDescription:"Carga de página",navigationLongDescription:"Los informes de navegación analizan la carga de una sola página, de la misma manera que los informes originales de Lighthouse.",navigationReport:"Informe de navegación",navigationReportCount:"{numNavigation,plural, =1{{numNavigation} informe de navegación}other{{numNavigation} informes de navegación}}",passableAuditCount:"{numPassableAudits,plural, =1{{numPassableAudits} auditoría con posibilidades de aprobar}other{{numPassableAudits} auditorías con posibilidades de aprobar}}",passedAuditCount:"{numPassed,plural, =1{{numPassed} auditoría aprobada}other{{numPassed} auditorías aprobadas}}",ratingAverage:"Promedio",ratingError:"Error",ratingFail:"Deficiente",ratingPass:"Bueno",save:"Guardar",snapshotDescription:"Estado de la página en un momento específico",snapshotLongDescription:"Los informes de instantáneas analizan la página en un estado particular, por lo general, después de las interacciones de un usuario.",snapshotReport:"Informe de un momento específico",snapshotReportCount:"{numSnapshot,plural, =1{{numSnapshot} informe de un momento específico}other{{numSnapshot} informes de un momento específico}}",summary:"Resumen",timespanDescription:"Interacciones del usuario",timespanLongDescription:"Los informes de períodos analizan un período arbitrario, el cual por lo general incluye interacciones de los usuarios.",timespanReport:"Informe del período",timespanReportCount:"{numTimespan,plural, =1{{numTimespan} informe del período}other{{numTimespan} informes del período}}",title:"Informe del flujo de usuarios de Lighthouse"},"es-BZ":{allReports:"Todos los informes",categories:"Categorías",categoryAccessibility:"Accesibilidad",categoryBestPractices:"Recomendaciones",categoryPerformance:"Rendimiento",categorySeo:"SEO",desktop:"Escritorio",helpDialogTitle:"Explicación del informe de flujos de Lighthouse",helpLabel:"Explicación de flujos",helpUseCaseInstructionNavigation:"Utilizar los informes de navegación para…",helpUseCaseInstructionSnapshot:"Utilizar los informes de instantáneas para…",helpUseCaseInstructionTimespan:"Utilizar los informes de períodos para…",helpUseCaseNavigation1:"Obtener una puntuación de rendimiento de Lighthouse.",helpUseCaseNavigation2:"Obtener métricas de rendimiento de carga de páginas, como el Procesamiento de imagen con contenido más grande y el índice de velocidad.",helpUseCaseNavigation3:"Evaluar las capacidades de las apps web progresivas.",helpUseCaseSnapshot1:"Encontrar problemas de accesibilidad en aplicaciones de página única o formularios complejos.",helpUseCaseSnapshot2:"Evaluar prácticas recomendadas de menús y elementos de la IU ocultos detrás de la interacción.",helpUseCaseTimespan1:"Medir los cambios de diseño y el tiempo de ejecución de JavaScript en una serie de interacciones.",helpUseCaseTimespan2:"Descubrir oportunidades de rendimiento para mejorar la experiencia en aplicaciones de página única y en páginas abiertas por largo tiempo.",highestImpact:"Mayor impacto",informativeAuditCount:"{numInformative,plural, =1{{numInformative} auditoría informativa}other{{numInformative} auditorías informativas}}",mobile:"Para dispositivos móviles",navigationDescription:"Carga de página",navigationLongDescription:"Los informes de navegación analizan la carga de una sola página, de la misma manera que los informes originales de Lighthouse.",navigationReport:"Informe de navegación",navigationReportCount:"{numNavigation,plural, =1{{numNavigation} informe de navegación}other{{numNavigation} informes de navegación}}",passableAuditCount:"{numPassableAudits,plural, =1{{numPassableAudits} auditoría con posibilidades de aprobar}other{{numPassableAudits} auditorías con posibilidades de aprobar}}",passedAuditCount:"{numPassed,plural, =1{{numPassed} auditoría aprobada}other{{numPassed} auditorías aprobadas}}",ratingAverage:"Promedio",ratingError:"Error",ratingFail:"Deficiente",ratingPass:"Bueno",save:"Guardar",snapshotDescription:"Estado de la página en un momento específico",snapshotLongDescription:"Los informes de instantáneas analizan la página en un estado particular, por lo general, después de las interacciones de un usuario.",snapshotReport:"Informe de un momento específico",snapshotReportCount:"{numSnapshot,plural, =1{{numSnapshot} informe de un momento específico}other{{numSnapshot} informes de un momento específico}}",summary:"Resumen",timespanDescription:"Interacciones del usuario",timespanLongDescription:"Los informes de períodos analizan un período arbitrario, el cual por lo general incluye interacciones de los usuarios.",timespanReport:"Informe del período",timespanReportCount:"{numTimespan,plural, =1{{numTimespan} informe del período}other{{numTimespan} informes del período}}",title:"Informe del flujo de usuarios de Lighthouse"},"es-CL":{allReports:"Todos los informes",categories:"Categorías",categoryAccessibility:"Accesibilidad",categoryBestPractices:"Recomendaciones",categoryPerformance:"Rendimiento",categorySeo:"SEO",desktop:"Escritorio",helpDialogTitle:"Explicación del informe de flujos de Lighthouse",helpLabel:"Explicación de flujos",helpUseCaseInstructionNavigation:"Utilizar los informes de navegación para…",helpUseCaseInstructionSnapshot:"Utilizar los informes de instantáneas para…",helpUseCaseInstructionTimespan:"Utilizar los informes de períodos para…",helpUseCaseNavigation1:"Obtener una puntuación de rendimiento de Lighthouse.",helpUseCaseNavigation2:"Obtener métricas de rendimiento de carga de páginas, como el Procesamiento de imagen con contenido más grande y el índice de velocidad.",helpUseCaseNavigation3:"Evaluar las capacidades de las apps web progresivas.",helpUseCaseSnapshot1:"Encontrar problemas de accesibilidad en aplicaciones de página única o formularios complejos.",helpUseCaseSnapshot2:"Evaluar prácticas recomendadas de menús y elementos de la IU ocultos detrás de la interacción.",helpUseCaseTimespan1:"Medir los cambios de diseño y el tiempo de ejecución de JavaScript en una serie de interacciones.",helpUseCaseTimespan2:"Descubrir oportunidades de rendimiento para mejorar la experiencia en aplicaciones de página única y en páginas abiertas por largo tiempo.",highestImpact:"Mayor impacto",informativeAuditCount:"{numInformative,plural, =1{{numInformative} auditoría informativa}other{{numInformative} auditorías informativas}}",mobile:"Para dispositivos móviles",navigationDescription:"Carga de página",navigationLongDescription:"Los informes de navegación analizan la carga de una sola página, de la misma manera que los informes originales de Lighthouse.",navigationReport:"Informe de navegación",navigationReportCount:"{numNavigation,plural, =1{{numNavigation} informe de navegación}other{{numNavigation} informes de navegación}}",passableAuditCount:"{numPassableAudits,plural, =1{{numPassableAudits} auditoría con posibilidades de aprobar}other{{numPassableAudits} auditorías con posibilidades de aprobar}}",passedAuditCount:"{numPassed,plural, =1{{numPassed} auditoría aprobada}other{{numPassed} auditorías aprobadas}}",ratingAverage:"Promedio",ratingError:"Error",ratingFail:"Deficiente",ratingPass:"Bueno",save:"Guardar",snapshotDescription:"Estado de la página en un momento específico",snapshotLongDescription:"Los informes de instantáneas analizan la página en un estado particular, por lo general, después de las interacciones de un usuario.",snapshotReport:"Informe de un momento específico",snapshotReportCount:"{numSnapshot,plural, =1{{numSnapshot} informe de un momento específico}other{{numSnapshot} informes de un momento específico}}",summary:"Resumen",timespanDescription:"Interacciones del usuario",timespanLongDescription:"Los informes de períodos analizan un período arbitrario, el cual por lo general incluye interacciones de los usuarios.",timespanReport:"Informe del período",timespanReportCount:"{numTimespan,plural, =1{{numTimespan} informe del período}other{{numTimespan} informes del período}}",title:"Informe del flujo de usuarios de Lighthouse"},"es-CO":{allReports:"Todos los informes",categories:"Categorías",categoryAccessibility:"Accesibilidad",categoryBestPractices:"Recomendaciones",categoryPerformance:"Rendimiento",categorySeo:"SEO",desktop:"Escritorio",helpDialogTitle:"Explicación del informe de flujos de Lighthouse",helpLabel:"Explicación de flujos",helpUseCaseInstructionNavigation:"Utilizar los informes de navegación para…",helpUseCaseInstructionSnapshot:"Utilizar los informes de instantáneas para…",helpUseCaseInstructionTimespan:"Utilizar los informes de períodos para…",helpUseCaseNavigation1:"Obtener una puntuación de rendimiento de Lighthouse.",helpUseCaseNavigation2:"Obtener métricas de rendimiento de carga de páginas, como el Procesamiento de imagen con contenido más grande y el índice de velocidad.",helpUseCaseNavigation3:"Evaluar las capacidades de las apps web progresivas.",helpUseCaseSnapshot1:"Encontrar problemas de accesibilidad en aplicaciones de página única o formularios complejos.",helpUseCaseSnapshot2:"Evaluar prácticas recomendadas de menús y elementos de la IU ocultos detrás de la interacción.",helpUseCaseTimespan1:"Medir los cambios de diseño y el tiempo de ejecución de JavaScript en una serie de interacciones.",helpUseCaseTimespan2:"Descubrir oportunidades de rendimiento para mejorar la experiencia en aplicaciones de página única y en páginas abiertas por largo tiempo.",highestImpact:"Mayor impacto",informativeAuditCount:"{numInformative,plural, =1{{numInformative} auditoría informativa}other{{numInformative} auditorías informativas}}",mobile:"Para dispositivos móviles",navigationDescription:"Carga de página",navigationLongDescription:"Los informes de navegación analizan la carga de una sola página, de la misma manera que los informes originales de Lighthouse.",navigationReport:"Informe de navegación",navigationReportCount:"{numNavigation,plural, =1{{numNavigation} informe de navegación}other{{numNavigation} informes de navegación}}",passableAuditCount:"{numPassableAudits,plural, =1{{numPassableAudits} auditoría con posibilidades de aprobar}other{{numPassableAudits} auditorías con posibilidades de aprobar}}",passedAuditCount:"{numPassed,plural, =1{{numPassed} auditoría aprobada}other{{numPassed} auditorías aprobadas}}",ratingAverage:"Promedio",ratingError:"Error",ratingFail:"Deficiente",ratingPass:"Bueno",save:"Guardar",snapshotDescription:"Estado de la página en un momento específico",snapshotLongDescription:"Los informes de instantáneas analizan la página en un estado particular, por lo general, después de las interacciones de un usuario.",snapshotReport:"Informe de un momento específico",snapshotReportCount:"{numSnapshot,plural, =1{{numSnapshot} informe de un momento específico}other{{numSnapshot} informes de un momento específico}}",summary:"Resumen",timespanDescription:"Interacciones del usuario",timespanLongDescription:"Los informes de períodos analizan un período arbitrario, el cual por lo general incluye interacciones de los usuarios.",timespanReport:"Informe del período",timespanReportCount:"{numTimespan,plural, =1{{numTimespan} informe del período}other{{numTimespan} informes del período}}",title:"Informe del flujo de usuarios de Lighthouse"},"es-CR":{allReports:"Todos los informes",categories:"Categorías",categoryAccessibility:"Accesibilidad",categoryBestPractices:"Recomendaciones",categoryPerformance:"Rendimiento",categorySeo:"SEO",desktop:"Escritorio",helpDialogTitle:"Explicación del informe de flujos de Lighthouse",helpLabel:"Explicación de flujos",helpUseCaseInstructionNavigation:"Utilizar los informes de navegación para…",helpUseCaseInstructionSnapshot:"Utilizar los informes de instantáneas para…",helpUseCaseInstructionTimespan:"Utilizar los informes de períodos para…",helpUseCaseNavigation1:"Obtener una puntuación de rendimiento de Lighthouse.",helpUseCaseNavigation2:"Obtener métricas de rendimiento de carga de páginas, como el Procesamiento de imagen con contenido más grande y el índice de velocidad.",helpUseCaseNavigation3:"Evaluar las capacidades de las apps web progresivas.",helpUseCaseSnapshot1:"Encontrar problemas de accesibilidad en aplicaciones de página única o formularios complejos.",helpUseCaseSnapshot2:"Evaluar prácticas recomendadas de menús y elementos de la IU ocultos detrás de la interacción.",helpUseCaseTimespan1:"Medir los cambios de diseño y el tiempo de ejecución de JavaScript en una serie de interacciones.",helpUseCaseTimespan2:"Descubrir oportunidades de rendimiento para mejorar la experiencia en aplicaciones de página única y en páginas abiertas por largo tiempo.",highestImpact:"Mayor impacto",informativeAuditCount:"{numInformative,plural, =1{{numInformative} auditoría informativa}other{{numInformative} auditorías informativas}}",mobile:"Para dispositivos móviles",navigationDescription:"Carga de página",navigationLongDescription:"Los informes de navegación analizan la carga de una sola página, de la misma manera que los informes originales de Lighthouse.",navigationReport:"Informe de navegación",navigationReportCount:"{numNavigation,plural, =1{{numNavigation} informe de navegación}other{{numNavigation} informes de navegación}}",passableAuditCount:"{numPassableAudits,plural, =1{{numPassableAudits} auditoría con posibilidades de aprobar}other{{numPassableAudits} auditorías con posibilidades de aprobar}}",passedAuditCount:"{numPassed,plural, =1{{numPassed} auditoría aprobada}other{{numPassed} auditorías aprobadas}}",ratingAverage:"Promedio",ratingError:"Error",ratingFail:"Deficiente",ratingPass:"Bueno",save:"Guardar",snapshotDescription:"Estado de la página en un momento específico",snapshotLongDescription:"Los informes de instantáneas analizan la página en un estado particular, por lo general, después de las interacciones de un usuario.",snapshotReport:"Informe de un momento específico",snapshotReportCount:"{numSnapshot,plural, =1{{numSnapshot} informe de un momento específico}other{{numSnapshot} informes de un momento específico}}",summary:"Resumen",timespanDescription:"Interacciones del usuario",timespanLongDescription:"Los informes de períodos analizan un período arbitrario, el cual por lo general incluye interacciones de los usuarios.",timespanReport:"Informe del período",timespanReportCount:"{numTimespan,plural, =1{{numTimespan} informe del período}other{{numTimespan} informes del período}}",title:"Informe del flujo de usuarios de Lighthouse"},"es-CU":{allReports:"Todos los informes",categories:"Categorías",categoryAccessibility:"Accesibilidad",categoryBestPractices:"Recomendaciones",categoryPerformance:"Rendimiento",categorySeo:"SEO",desktop:"Escritorio",helpDialogTitle:"Explicación del informe de flujos de Lighthouse",helpLabel:"Explicación de flujos",helpUseCaseInstructionNavigation:"Utilizar los informes de navegación para…",helpUseCaseInstructionSnapshot:"Utilizar los informes de instantáneas para…",helpUseCaseInstructionTimespan:"Utilizar los informes de períodos para…",helpUseCaseNavigation1:"Obtener una puntuación de rendimiento de Lighthouse.",helpUseCaseNavigation2:"Obtener métricas de rendimiento de carga de páginas, como el Procesamiento de imagen con contenido más grande y el índice de velocidad.",helpUseCaseNavigation3:"Evaluar las capacidades de las apps web progresivas.",helpUseCaseSnapshot1:"Encontrar problemas de accesibilidad en aplicaciones de página única o formularios complejos.",helpUseCaseSnapshot2:"Evaluar prácticas recomendadas de menús y elementos de la IU ocultos detrás de la interacción.",helpUseCaseTimespan1:"Medir los cambios de diseño y el tiempo de ejecución de JavaScript en una serie de interacciones.",helpUseCaseTimespan2:"Descubrir oportunidades de rendimiento para mejorar la experiencia en aplicaciones de página única y en páginas abiertas por largo tiempo.",highestImpact:"Mayor impacto",informativeAuditCount:"{numInformative,plural, =1{{numInformative} auditoría informativa}other{{numInformative} auditorías informativas}}",mobile:"Para dispositivos móviles",navigationDescription:"Carga de página",navigationLongDescription:"Los informes de navegación analizan la carga de una sola página, de la misma manera que los informes originales de Lighthouse.",navigationReport:"Informe de navegación",navigationReportCount:"{numNavigation,plural, =1{{numNavigation} informe de navegación}other{{numNavigation} informes de navegación}}",passableAuditCount:"{numPassableAudits,plural, =1{{numPassableAudits} auditoría con posibilidades de aprobar}other{{numPassableAudits} auditorías con posibilidades de aprobar}}",passedAuditCount:"{numPassed,plural, =1{{numPassed} auditoría aprobada}other{{numPassed} auditorías aprobadas}}",ratingAverage:"Promedio",ratingError:"Error",ratingFail:"Deficiente",ratingPass:"Bueno",save:"Guardar",snapshotDescription:"Estado de la página en un momento específico",snapshotLongDescription:"Los informes de instantáneas analizan la página en un estado particular, por lo general, después de las interacciones de un usuario.",snapshotReport:"Informe de un momento específico",snapshotReportCount:"{numSnapshot,plural, =1{{numSnapshot} informe de un momento específico}other{{numSnapshot} informes de un momento específico}}",summary:"Resumen",timespanDescription:"Interacciones del usuario",timespanLongDescription:"Los informes de períodos analizan un período arbitrario, el cual por lo general incluye interacciones de los usuarios.",timespanReport:"Informe del período",timespanReportCount:"{numTimespan,plural, =1{{numTimespan} informe del período}other{{numTimespan} informes del período}}",title:"Informe del flujo de usuarios de Lighthouse"},"es-DO":{allReports:"Todos los informes",categories:"Categorías",categoryAccessibility:"Accesibilidad",categoryBestPractices:"Recomendaciones",categoryPerformance:"Rendimiento",categorySeo:"SEO",desktop:"Escritorio",helpDialogTitle:"Explicación del informe de flujos de Lighthouse",helpLabel:"Explicación de flujos",helpUseCaseInstructionNavigation:"Utilizar los informes de navegación para…",helpUseCaseInstructionSnapshot:"Utilizar los informes de instantáneas para…",helpUseCaseInstructionTimespan:"Utilizar los informes de períodos para…",helpUseCaseNavigation1:"Obtener una puntuación de rendimiento de Lighthouse.",helpUseCaseNavigation2:"Obtener métricas de rendimiento de carga de páginas, como el Procesamiento de imagen con contenido más grande y el índice de velocidad.",helpUseCaseNavigation3:"Evaluar las capacidades de las apps web progresivas.",helpUseCaseSnapshot1:"Encontrar problemas de accesibilidad en aplicaciones de página única o formularios complejos.",helpUseCaseSnapshot2:"Evaluar prácticas recomendadas de menús y elementos de la IU ocultos detrás de la interacción.",helpUseCaseTimespan1:"Medir los cambios de diseño y el tiempo de ejecución de JavaScript en una serie de interacciones.",helpUseCaseTimespan2:"Descubrir oportunidades de rendimiento para mejorar la experiencia en aplicaciones de página única y en páginas abiertas por largo tiempo.",highestImpact:"Mayor impacto",informativeAuditCount:"{numInformative,plural, =1{{numInformative} auditoría informativa}other{{numInformative} auditorías informativas}}",mobile:"Para dispositivos móviles",navigationDescription:"Carga de página",navigationLongDescription:"Los informes de navegación analizan la carga de una sola página, de la misma manera que los informes originales de Lighthouse.",navigationReport:"Informe de navegación",navigationReportCount:"{numNavigation,plural, =1{{numNavigation} informe de navegación}other{{numNavigation} informes de navegación}}",passableAuditCount:"{numPassableAudits,plural, =1{{numPassableAudits} auditoría con posibilidades de aprobar}other{{numPassableAudits} auditorías con posibilidades de aprobar}}",passedAuditCount:"{numPassed,plural, =1{{numPassed} auditoría aprobada}other{{numPassed} auditorías aprobadas}}",ratingAverage:"Promedio",ratingError:"Error",ratingFail:"Deficiente",ratingPass:"Bueno",save:"Guardar",snapshotDescription:"Estado de la página en un momento específico",snapshotLongDescription:"Los informes de instantáneas analizan la página en un estado particular, por lo general, después de las interacciones de un usuario.",snapshotReport:"Informe de un momento específico",snapshotReportCount:"{numSnapshot,plural, =1{{numSnapshot} informe de un momento específico}other{{numSnapshot} informes de un momento específico}}",summary:"Resumen",timespanDescription:"Interacciones del usuario",timespanLongDescription:"Los informes de períodos analizan un período arbitrario, el cual por lo general incluye interacciones de los usuarios.",timespanReport:"Informe del período",timespanReportCount:"{numTimespan,plural, =1{{numTimespan} informe del período}other{{numTimespan} informes del período}}",title:"Informe del flujo de usuarios de Lighthouse"},"es-EC":{allReports:"Todos los informes",categories:"Categorías",categoryAccessibility:"Accesibilidad",categoryBestPractices:"Recomendaciones",categoryPerformance:"Rendimiento",categorySeo:"SEO",desktop:"Escritorio",helpDialogTitle:"Explicación del informe de flujos de Lighthouse",helpLabel:"Explicación de flujos",helpUseCaseInstructionNavigation:"Utilizar los informes de navegación para…",helpUseCaseInstructionSnapshot:"Utilizar los informes de instantáneas para…",helpUseCaseInstructionTimespan:"Utilizar los informes de períodos para…",helpUseCaseNavigation1:"Obtener una puntuación de rendimiento de Lighthouse.",helpUseCaseNavigation2:"Obtener métricas de rendimiento de carga de páginas, como el Procesamiento de imagen con contenido más grande y el índice de velocidad.",helpUseCaseNavigation3:"Evaluar las capacidades de las apps web progresivas.",helpUseCaseSnapshot1:"Encontrar problemas de accesibilidad en aplicaciones de página única o formularios complejos.",helpUseCaseSnapshot2:"Evaluar prácticas recomendadas de menús y elementos de la IU ocultos detrás de la interacción.",helpUseCaseTimespan1:"Medir los cambios de diseño y el tiempo de ejecución de JavaScript en una serie de interacciones.",helpUseCaseTimespan2:"Descubrir oportunidades de rendimiento para mejorar la experiencia en aplicaciones de página única y en páginas abiertas por largo tiempo.",highestImpact:"Mayor impacto",informativeAuditCount:"{numInformative,plural, =1{{numInformative} auditoría informativa}other{{numInformative} auditorías informativas}}",mobile:"Para dispositivos móviles",navigationDescription:"Carga de página",navigationLongDescription:"Los informes de navegación analizan la carga de una sola página, de la misma manera que los informes originales de Lighthouse.",navigationReport:"Informe de navegación",navigationReportCount:"{numNavigation,plural, =1{{numNavigation} informe de navegación}other{{numNavigation} informes de navegación}}",passableAuditCount:"{numPassableAudits,plural, =1{{numPassableAudits} auditoría con posibilidades de aprobar}other{{numPassableAudits} auditorías con posibilidades de aprobar}}",passedAuditCount:"{numPassed,plural, =1{{numPassed} auditoría aprobada}other{{numPassed} auditorías aprobadas}}",ratingAverage:"Promedio",ratingError:"Error",ratingFail:"Deficiente",ratingPass:"Bueno",save:"Guardar",snapshotDescription:"Estado de la página en un momento específico",snapshotLongDescription:"Los informes de instantáneas analizan la página en un estado particular, por lo general, después de las interacciones de un usuario.",snapshotReport:"Informe de un momento específico",snapshotReportCount:"{numSnapshot,plural, =1{{numSnapshot} informe de un momento específico}other{{numSnapshot} informes de un momento específico}}",summary:"Resumen",timespanDescription:"Interacciones del usuario",timespanLongDescription:"Los informes de períodos analizan un período arbitrario, el cual por lo general incluye interacciones de los usuarios.",timespanReport:"Informe del período",timespanReportCount:"{numTimespan,plural, =1{{numTimespan} informe del período}other{{numTimespan} informes del período}}",title:"Informe del flujo de usuarios de Lighthouse"},"es-GT":{allReports:"Todos los informes",categories:"Categorías",categoryAccessibility:"Accesibilidad",categoryBestPractices:"Recomendaciones",categoryPerformance:"Rendimiento",categorySeo:"SEO",desktop:"Escritorio",helpDialogTitle:"Explicación del informe de flujos de Lighthouse",helpLabel:"Explicación de flujos",helpUseCaseInstructionNavigation:"Utilizar los informes de navegación para…",helpUseCaseInstructionSnapshot:"Utilizar los informes de instantáneas para…",helpUseCaseInstructionTimespan:"Utilizar los informes de períodos para…",helpUseCaseNavigation1:"Obtener una puntuación de rendimiento de Lighthouse.",helpUseCaseNavigation2:"Obtener métricas de rendimiento de carga de páginas, como el Procesamiento de imagen con contenido más grande y el índice de velocidad.",helpUseCaseNavigation3:"Evaluar las capacidades de las apps web progresivas.",helpUseCaseSnapshot1:"Encontrar problemas de accesibilidad en aplicaciones de página única o formularios complejos.",helpUseCaseSnapshot2:"Evaluar prácticas recomendadas de menús y elementos de la IU ocultos detrás de la interacción.",helpUseCaseTimespan1:"Medir los cambios de diseño y el tiempo de ejecución de JavaScript en una serie de interacciones.",helpUseCaseTimespan2:"Descubrir oportunidades de rendimiento para mejorar la experiencia en aplicaciones de página única y en páginas abiertas por largo tiempo.",highestImpact:"Mayor impacto",informativeAuditCount:"{numInformative,plural, =1{{numInformative} auditoría informativa}other{{numInformative} auditorías informativas}}",mobile:"Para dispositivos móviles",navigationDescription:"Carga de página",navigationLongDescription:"Los informes de navegación analizan la carga de una sola página, de la misma manera que los informes originales de Lighthouse.",navigationReport:"Informe de navegación",navigationReportCount:"{numNavigation,plural, =1{{numNavigation} informe de navegación}other{{numNavigation} informes de navegación}}",passableAuditCount:"{numPassableAudits,plural, =1{{numPassableAudits} auditoría con posibilidades de aprobar}other{{numPassableAudits} auditorías con posibilidades de aprobar}}",passedAuditCount:"{numPassed,plural, =1{{numPassed} auditoría aprobada}other{{numPassed} auditorías aprobadas}}",ratingAverage:"Promedio",ratingError:"Error",ratingFail:"Deficiente",ratingPass:"Bueno",save:"Guardar",snapshotDescription:"Estado de la página en un momento específico",snapshotLongDescription:"Los informes de instantáneas analizan la página en un estado particular, por lo general, después de las interacciones de un usuario.",snapshotReport:"Informe de un momento específico",snapshotReportCount:"{numSnapshot,plural, =1{{numSnapshot} informe de un momento específico}other{{numSnapshot} informes de un momento específico}}",summary:"Resumen",timespanDescription:"Interacciones del usuario",timespanLongDescription:"Los informes de períodos analizan un período arbitrario, el cual por lo general incluye interacciones de los usuarios.",timespanReport:"Informe del período",timespanReportCount:"{numTimespan,plural, =1{{numTimespan} informe del período}other{{numTimespan} informes del período}}",title:"Informe del flujo de usuarios de Lighthouse"},"es-HN":{allReports:"Todos los informes",categories:"Categorías",categoryAccessibility:"Accesibilidad",categoryBestPractices:"Recomendaciones",categoryPerformance:"Rendimiento",categorySeo:"SEO",desktop:"Escritorio",helpDialogTitle:"Explicación del informe de flujos de Lighthouse",helpLabel:"Explicación de flujos",helpUseCaseInstructionNavigation:"Utilizar los informes de navegación para…",helpUseCaseInstructionSnapshot:"Utilizar los informes de instantáneas para…",helpUseCaseInstructionTimespan:"Utilizar los informes de períodos para…",helpUseCaseNavigation1:"Obtener una puntuación de rendimiento de Lighthouse.",helpUseCaseNavigation2:"Obtener métricas de rendimiento de carga de páginas, como el Procesamiento de imagen con contenido más grande y el índice de velocidad.",helpUseCaseNavigation3:"Evaluar las capacidades de las apps web progresivas.",helpUseCaseSnapshot1:"Encontrar problemas de accesibilidad en aplicaciones de página única o formularios complejos.",helpUseCaseSnapshot2:"Evaluar prácticas recomendadas de menús y elementos de la IU ocultos detrás de la interacción.",helpUseCaseTimespan1:"Medir los cambios de diseño y el tiempo de ejecución de JavaScript en una serie de interacciones.",helpUseCaseTimespan2:"Descubrir oportunidades de rendimiento para mejorar la experiencia en aplicaciones de página única y en páginas abiertas por largo tiempo.",highestImpact:"Mayor impacto",informativeAuditCount:"{numInformative,plural, =1{{numInformative} auditoría informativa}other{{numInformative} auditorías informativas}}",mobile:"Para dispositivos móviles",navigationDescription:"Carga de página",navigationLongDescription:"Los informes de navegación analizan la carga de una sola página, de la misma manera que los informes originales de Lighthouse.",navigationReport:"Informe de navegación",navigationReportCount:"{numNavigation,plural, =1{{numNavigation} informe de navegación}other{{numNavigation} informes de navegación}}",passableAuditCount:"{numPassableAudits,plural, =1{{numPassableAudits} auditoría con posibilidades de aprobar}other{{numPassableAudits} auditorías con posibilidades de aprobar}}",passedAuditCount:"{numPassed,plural, =1{{numPassed} auditoría aprobada}other{{numPassed} auditorías aprobadas}}",ratingAverage:"Promedio",ratingError:"Error",ratingFail:"Deficiente",ratingPass:"Bueno",save:"Guardar",snapshotDescription:"Estado de la página en un momento específico",snapshotLongDescription:"Los informes de instantáneas analizan la página en un estado particular, por lo general, después de las interacciones de un usuario.",snapshotReport:"Informe de un momento específico",snapshotReportCount:"{numSnapshot,plural, =1{{numSnapshot} informe de un momento específico}other{{numSnapshot} informes de un momento específico}}",summary:"Resumen",timespanDescription:"Interacciones del usuario",timespanLongDescription:"Los informes de períodos analizan un período arbitrario, el cual por lo general incluye interacciones de los usuarios.",timespanReport:"Informe del período",timespanReportCount:"{numTimespan,plural, =1{{numTimespan} informe del período}other{{numTimespan} informes del período}}",title:"Informe del flujo de usuarios de Lighthouse"},"es-MX":{allReports:"Todos los informes",categories:"Categorías",categoryAccessibility:"Accesibilidad",categoryBestPractices:"Recomendaciones",categoryPerformance:"Rendimiento",categorySeo:"SEO",desktop:"Escritorio",helpDialogTitle:"Explicación del informe de flujos de Lighthouse",helpLabel:"Explicación de flujos",helpUseCaseInstructionNavigation:"Utilizar los informes de navegación para…",helpUseCaseInstructionSnapshot:"Utilizar los informes de instantáneas para…",helpUseCaseInstructionTimespan:"Utilizar los informes de períodos para…",helpUseCaseNavigation1:"Obtener una puntuación de rendimiento de Lighthouse.",helpUseCaseNavigation2:"Obtener métricas de rendimiento de carga de páginas, como el Procesamiento de imagen con contenido más grande y el índice de velocidad.",helpUseCaseNavigation3:"Evaluar las capacidades de las apps web progresivas.",helpUseCaseSnapshot1:"Encontrar problemas de accesibilidad en aplicaciones de página única o formularios complejos.",helpUseCaseSnapshot2:"Evaluar prácticas recomendadas de menús y elementos de la IU ocultos detrás de la interacción.",helpUseCaseTimespan1:"Medir los cambios de diseño y el tiempo de ejecución de JavaScript en una serie de interacciones.",helpUseCaseTimespan2:"Descubrir oportunidades de rendimiento para mejorar la experiencia en aplicaciones de página única y en páginas abiertas por largo tiempo.",highestImpact:"Mayor impacto",informativeAuditCount:"{numInformative,plural, =1{{numInformative} auditoría informativa}other{{numInformative} auditorías informativas}}",mobile:"Para dispositivos móviles",navigationDescription:"Carga de página",navigationLongDescription:"Los informes de navegación analizan la carga de una sola página, de la misma manera que los informes originales de Lighthouse.",navigationReport:"Informe de navegación",navigationReportCount:"{numNavigation,plural, =1{{numNavigation} informe de navegación}other{{numNavigation} informes de navegación}}",passableAuditCount:"{numPassableAudits,plural, =1{{numPassableAudits} auditoría con posibilidades de aprobar}other{{numPassableAudits} auditorías con posibilidades de aprobar}}",passedAuditCount:"{numPassed,plural, =1{{numPassed} auditoría aprobada}other{{numPassed} auditorías aprobadas}}",ratingAverage:"Promedio",ratingError:"Error",ratingFail:"Deficiente",ratingPass:"Bueno",save:"Guardar",snapshotDescription:"Estado de la página en un momento específico",snapshotLongDescription:"Los informes de instantáneas analizan la página en un estado particular, por lo general, después de las interacciones de un usuario.",snapshotReport:"Informe de un momento específico",snapshotReportCount:"{numSnapshot,plural, =1{{numSnapshot} informe de un momento específico}other{{numSnapshot} informes de un momento específico}}",summary:"Resumen",timespanDescription:"Interacciones del usuario",timespanLongDescription:"Los informes de períodos analizan un período arbitrario, el cual por lo general incluye interacciones de los usuarios.",timespanReport:"Informe del período",timespanReportCount:"{numTimespan,plural, =1{{numTimespan} informe del período}other{{numTimespan} informes del período}}",title:"Informe del flujo de usuarios de Lighthouse"},"es-NI":{allReports:"Todos los informes",categories:"Categorías",categoryAccessibility:"Accesibilidad",categoryBestPractices:"Recomendaciones",categoryPerformance:"Rendimiento",categorySeo:"SEO",desktop:"Escritorio",helpDialogTitle:"Explicación del informe de flujos de Lighthouse",helpLabel:"Explicación de flujos",helpUseCaseInstructionNavigation:"Utilizar los informes de navegación para…",helpUseCaseInstructionSnapshot:"Utilizar los informes de instantáneas para…",helpUseCaseInstructionTimespan:"Utilizar los informes de períodos para…",helpUseCaseNavigation1:"Obtener una puntuación de rendimiento de Lighthouse.",helpUseCaseNavigation2:"Obtener métricas de rendimiento de carga de páginas, como el Procesamiento de imagen con contenido más grande y el índice de velocidad.",helpUseCaseNavigation3:"Evaluar las capacidades de las apps web progresivas.",helpUseCaseSnapshot1:"Encontrar problemas de accesibilidad en aplicaciones de página única o formularios complejos.",helpUseCaseSnapshot2:"Evaluar prácticas recomendadas de menús y elementos de la IU ocultos detrás de la interacción.",helpUseCaseTimespan1:"Medir los cambios de diseño y el tiempo de ejecución de JavaScript en una serie de interacciones.",helpUseCaseTimespan2:"Descubrir oportunidades de rendimiento para mejorar la experiencia en aplicaciones de página única y en páginas abiertas por largo tiempo.",highestImpact:"Mayor impacto",informativeAuditCount:"{numInformative,plural, =1{{numInformative} auditoría informativa}other{{numInformative} auditorías informativas}}",mobile:"Para dispositivos móviles",navigationDescription:"Carga de página",navigationLongDescription:"Los informes de navegación analizan la carga de una sola página, de la misma manera que los informes originales de Lighthouse.",navigationReport:"Informe de navegación",navigationReportCount:"{numNavigation,plural, =1{{numNavigation} informe de navegación}other{{numNavigation} informes de navegación}}",passableAuditCount:"{numPassableAudits,plural, =1{{numPassableAudits} auditoría con posibilidades de aprobar}other{{numPassableAudits} auditorías con posibilidades de aprobar}}",passedAuditCount:"{numPassed,plural, =1{{numPassed} auditoría aprobada}other{{numPassed} auditorías aprobadas}}",ratingAverage:"Promedio",ratingError:"Error",ratingFail:"Deficiente",ratingPass:"Bueno",save:"Guardar",snapshotDescription:"Estado de la página en un momento específico",snapshotLongDescription:"Los informes de instantáneas analizan la página en un estado particular, por lo general, después de las interacciones de un usuario.",snapshotReport:"Informe de un momento específico",snapshotReportCount:"{numSnapshot,plural, =1{{numSnapshot} informe de un momento específico}other{{numSnapshot} informes de un momento específico}}",summary:"Resumen",timespanDescription:"Interacciones del usuario",timespanLongDescription:"Los informes de períodos analizan un período arbitrario, el cual por lo general incluye interacciones de los usuarios.",timespanReport:"Informe del período",timespanReportCount:"{numTimespan,plural, =1{{numTimespan} informe del período}other{{numTimespan} informes del período}}",title:"Informe del flujo de usuarios de Lighthouse"},"es-PA":{allReports:"Todos los informes",categories:"Categorías",categoryAccessibility:"Accesibilidad",categoryBestPractices:"Recomendaciones",categoryPerformance:"Rendimiento",categorySeo:"SEO",desktop:"Escritorio",helpDialogTitle:"Explicación del informe de flujos de Lighthouse",helpLabel:"Explicación de flujos",helpUseCaseInstructionNavigation:"Utilizar los informes de navegación para…",helpUseCaseInstructionSnapshot:"Utilizar los informes de instantáneas para…",helpUseCaseInstructionTimespan:"Utilizar los informes de períodos para…",helpUseCaseNavigation1:"Obtener una puntuación de rendimiento de Lighthouse.",helpUseCaseNavigation2:"Obtener métricas de rendimiento de carga de páginas, como el Procesamiento de imagen con contenido más grande y el índice de velocidad.",helpUseCaseNavigation3:"Evaluar las capacidades de las apps web progresivas.",helpUseCaseSnapshot1:"Encontrar problemas de accesibilidad en aplicaciones de página única o formularios complejos.",helpUseCaseSnapshot2:"Evaluar prácticas recomendadas de menús y elementos de la IU ocultos detrás de la interacción.",helpUseCaseTimespan1:"Medir los cambios de diseño y el tiempo de ejecución de JavaScript en una serie de interacciones.",helpUseCaseTimespan2:"Descubrir oportunidades de rendimiento para mejorar la experiencia en aplicaciones de página única y en páginas abiertas por largo tiempo.",highestImpact:"Mayor impacto",informativeAuditCount:"{numInformative,plural, =1{{numInformative} auditoría informativa}other{{numInformative} auditorías informativas}}",mobile:"Para dispositivos móviles",navigationDescription:"Carga de página",navigationLongDescription:"Los informes de navegación analizan la carga de una sola página, de la misma manera que los informes originales de Lighthouse.",navigationReport:"Informe de navegación",navigationReportCount:"{numNavigation,plural, =1{{numNavigation} informe de navegación}other{{numNavigation} informes de navegación}}",passableAuditCount:"{numPassableAudits,plural, =1{{numPassableAudits} auditoría con posibilidades de aprobar}other{{numPassableAudits} auditorías con posibilidades de aprobar}}",passedAuditCount:"{numPassed,plural, =1{{numPassed} auditoría aprobada}other{{numPassed} auditorías aprobadas}}",ratingAverage:"Promedio",ratingError:"Error",ratingFail:"Deficiente",ratingPass:"Bueno",save:"Guardar",snapshotDescription:"Estado de la página en un momento específico",snapshotLongDescription:"Los informes de instantáneas analizan la página en un estado particular, por lo general, después de las interacciones de un usuario.",snapshotReport:"Informe de un momento específico",snapshotReportCount:"{numSnapshot,plural, =1{{numSnapshot} informe de un momento específico}other{{numSnapshot} informes de un momento específico}}",summary:"Resumen",timespanDescription:"Interacciones del usuario",timespanLongDescription:"Los informes de períodos analizan un período arbitrario, el cual por lo general incluye interacciones de los usuarios.",timespanReport:"Informe del período",timespanReportCount:"{numTimespan,plural, =1{{numTimespan} informe del período}other{{numTimespan} informes del período}}",title:"Informe del flujo de usuarios de Lighthouse"},"es-PE":{allReports:"Todos los informes",categories:"Categorías",categoryAccessibility:"Accesibilidad",categoryBestPractices:"Recomendaciones",categoryPerformance:"Rendimiento",categorySeo:"SEO",desktop:"Escritorio",helpDialogTitle:"Explicación del informe de flujos de Lighthouse",helpLabel:"Explicación de flujos",helpUseCaseInstructionNavigation:"Utilizar los informes de navegación para…",helpUseCaseInstructionSnapshot:"Utilizar los informes de instantáneas para…",helpUseCaseInstructionTimespan:"Utilizar los informes de períodos para…",helpUseCaseNavigation1:"Obtener una puntuación de rendimiento de Lighthouse.",helpUseCaseNavigation2:"Obtener métricas de rendimiento de carga de páginas, como el Procesamiento de imagen con contenido más grande y el índice de velocidad.",helpUseCaseNavigation3:"Evaluar las capacidades de las apps web progresivas.",helpUseCaseSnapshot1:"Encontrar problemas de accesibilidad en aplicaciones de página única o formularios complejos.",helpUseCaseSnapshot2:"Evaluar prácticas recomendadas de menús y elementos de la IU ocultos detrás de la interacción.",helpUseCaseTimespan1:"Medir los cambios de diseño y el tiempo de ejecución de JavaScript en una serie de interacciones.",helpUseCaseTimespan2:"Descubrir oportunidades de rendimiento para mejorar la experiencia en aplicaciones de página única y en páginas abiertas por largo tiempo.",highestImpact:"Mayor impacto",informativeAuditCount:"{numInformative,plural, =1{{numInformative} auditoría informativa}other{{numInformative} auditorías informativas}}",mobile:"Para dispositivos móviles",navigationDescription:"Carga de página",navigationLongDescription:"Los informes de navegación analizan la carga de una sola página, de la misma manera que los informes originales de Lighthouse.",navigationReport:"Informe de navegación",navigationReportCount:"{numNavigation,plural, =1{{numNavigation} informe de navegación}other{{numNavigation} informes de navegación}}",passableAuditCount:"{numPassableAudits,plural, =1{{numPassableAudits} auditoría con posibilidades de aprobar}other{{numPassableAudits} auditorías con posibilidades de aprobar}}",passedAuditCount:"{numPassed,plural, =1{{numPassed} auditoría aprobada}other{{numPassed} auditorías aprobadas}}",ratingAverage:"Promedio",ratingError:"Error",ratingFail:"Deficiente",ratingPass:"Bueno",save:"Guardar",snapshotDescription:"Estado de la página en un momento específico",snapshotLongDescription:"Los informes de instantáneas analizan la página en un estado particular, por lo general, después de las interacciones de un usuario.",snapshotReport:"Informe de un momento específico",snapshotReportCount:"{numSnapshot,plural, =1{{numSnapshot} informe de un momento específico}other{{numSnapshot} informes de un momento específico}}",summary:"Resumen",timespanDescription:"Interacciones del usuario",timespanLongDescription:"Los informes de períodos analizan un período arbitrario, el cual por lo general incluye interacciones de los usuarios.",timespanReport:"Informe del período",timespanReportCount:"{numTimespan,plural, =1{{numTimespan} informe del período}other{{numTimespan} informes del período}}",title:"Informe del flujo de usuarios de Lighthouse"},"es-PR":{allReports:"Todos los informes",categories:"Categorías",categoryAccessibility:"Accesibilidad",categoryBestPractices:"Recomendaciones",categoryPerformance:"Rendimiento",categorySeo:"SEO",desktop:"Escritorio",helpDialogTitle:"Explicación del informe de flujos de Lighthouse",helpLabel:"Explicación de flujos",helpUseCaseInstructionNavigation:"Utilizar los informes de navegación para…",helpUseCaseInstructionSnapshot:"Utilizar los informes de instantáneas para…",helpUseCaseInstructionTimespan:"Utilizar los informes de períodos para…",helpUseCaseNavigation1:"Obtener una puntuación de rendimiento de Lighthouse.",helpUseCaseNavigation2:"Obtener métricas de rendimiento de carga de páginas, como el Procesamiento de imagen con contenido más grande y el índice de velocidad.",helpUseCaseNavigation3:"Evaluar las capacidades de las apps web progresivas.",helpUseCaseSnapshot1:"Encontrar problemas de accesibilidad en aplicaciones de página única o formularios complejos.",helpUseCaseSnapshot2:"Evaluar prácticas recomendadas de menús y elementos de la IU ocultos detrás de la interacción.",helpUseCaseTimespan1:"Medir los cambios de diseño y el tiempo de ejecución de JavaScript en una serie de interacciones.",helpUseCaseTimespan2:"Descubrir oportunidades de rendimiento para mejorar la experiencia en aplicaciones de página única y en páginas abiertas por largo tiempo.",highestImpact:"Mayor impacto",informativeAuditCount:"{numInformative,plural, =1{{numInformative} auditoría informativa}other{{numInformative} auditorías informativas}}",mobile:"Para dispositivos móviles",navigationDescription:"Carga de página",navigationLongDescription:"Los informes de navegación analizan la carga de una sola página, de la misma manera que los informes originales de Lighthouse.",navigationReport:"Informe de navegación",navigationReportCount:"{numNavigation,plural, =1{{numNavigation} informe de navegación}other{{numNavigation} informes de navegación}}",passableAuditCount:"{numPassableAudits,plural, =1{{numPassableAudits} auditoría con posibilidades de aprobar}other{{numPassableAudits} auditorías con posibilidades de aprobar}}",passedAuditCount:"{numPassed,plural, =1{{numPassed} auditoría aprobada}other{{numPassed} auditorías aprobadas}}",ratingAverage:"Promedio",ratingError:"Error",ratingFail:"Deficiente",ratingPass:"Bueno",save:"Guardar",snapshotDescription:"Estado de la página en un momento específico",snapshotLongDescription:"Los informes de instantáneas analizan la página en un estado particular, por lo general, después de las interacciones de un usuario.",snapshotReport:"Informe de un momento específico",snapshotReportCount:"{numSnapshot,plural, =1{{numSnapshot} informe de un momento específico}other{{numSnapshot} informes de un momento específico}}",summary:"Resumen",timespanDescription:"Interacciones del usuario",timespanLongDescription:"Los informes de períodos analizan un período arbitrario, el cual por lo general incluye interacciones de los usuarios.",timespanReport:"Informe del período",timespanReportCount:"{numTimespan,plural, =1{{numTimespan} informe del período}other{{numTimespan} informes del período}}",title:"Informe del flujo de usuarios de Lighthouse"},"es-PY":{allReports:"Todos los informes",categories:"Categorías",categoryAccessibility:"Accesibilidad",categoryBestPractices:"Recomendaciones",categoryPerformance:"Rendimiento",categorySeo:"SEO",desktop:"Escritorio",helpDialogTitle:"Explicación del informe de flujos de Lighthouse",helpLabel:"Explicación de flujos",helpUseCaseInstructionNavigation:"Utilizar los informes de navegación para…",helpUseCaseInstructionSnapshot:"Utilizar los informes de instantáneas para…",helpUseCaseInstructionTimespan:"Utilizar los informes de períodos para…",helpUseCaseNavigation1:"Obtener una puntuación de rendimiento de Lighthouse.",helpUseCaseNavigation2:"Obtener métricas de rendimiento de carga de páginas, como el Procesamiento de imagen con contenido más grande y el índice de velocidad.",helpUseCaseNavigation3:"Evaluar las capacidades de las apps web progresivas.",helpUseCaseSnapshot1:"Encontrar problemas de accesibilidad en aplicaciones de página única o formularios complejos.",helpUseCaseSnapshot2:"Evaluar prácticas recomendadas de menús y elementos de la IU ocultos detrás de la interacción.",helpUseCaseTimespan1:"Medir los cambios de diseño y el tiempo de ejecución de JavaScript en una serie de interacciones.",helpUseCaseTimespan2:"Descubrir oportunidades de rendimiento para mejorar la experiencia en aplicaciones de página única y en páginas abiertas por largo tiempo.",highestImpact:"Mayor impacto",informativeAuditCount:"{numInformative,plural, =1{{numInformative} auditoría informativa}other{{numInformative} auditorías informativas}}",mobile:"Para dispositivos móviles",navigationDescription:"Carga de página",navigationLongDescription:"Los informes de navegación analizan la carga de una sola página, de la misma manera que los informes originales de Lighthouse.",navigationReport:"Informe de navegación",navigationReportCount:"{numNavigation,plural, =1{{numNavigation} informe de navegación}other{{numNavigation} informes de navegación}}",passableAuditCount:"{numPassableAudits,plural, =1{{numPassableAudits} auditoría con posibilidades de aprobar}other{{numPassableAudits} auditorías con posibilidades de aprobar}}",passedAuditCount:"{numPassed,plural, =1{{numPassed} auditoría aprobada}other{{numPassed} auditorías aprobadas}}",ratingAverage:"Promedio",ratingError:"Error",ratingFail:"Deficiente",ratingPass:"Bueno",save:"Guardar",snapshotDescription:"Estado de la página en un momento específico",snapshotLongDescription:"Los informes de instantáneas analizan la página en un estado particular, por lo general, después de las interacciones de un usuario.",snapshotReport:"Informe de un momento específico",snapshotReportCount:"{numSnapshot,plural, =1{{numSnapshot} informe de un momento específico}other{{numSnapshot} informes de un momento específico}}",summary:"Resumen",timespanDescription:"Interacciones del usuario",timespanLongDescription:"Los informes de períodos analizan un período arbitrario, el cual por lo general incluye interacciones de los usuarios.",timespanReport:"Informe del período",timespanReportCount:"{numTimespan,plural, =1{{numTimespan} informe del período}other{{numTimespan} informes del período}}",title:"Informe del flujo de usuarios de Lighthouse"},"es-SV":{allReports:"Todos los informes",categories:"Categorías",categoryAccessibility:"Accesibilidad",categoryBestPractices:"Recomendaciones",categoryPerformance:"Rendimiento",categorySeo:"SEO",desktop:"Escritorio",helpDialogTitle:"Explicación del informe de flujos de Lighthouse",helpLabel:"Explicación de flujos",helpUseCaseInstructionNavigation:"Utilizar los informes de navegación para…",helpUseCaseInstructionSnapshot:"Utilizar los informes de instantáneas para…",helpUseCaseInstructionTimespan:"Utilizar los informes de períodos para…",helpUseCaseNavigation1:"Obtener una puntuación de rendimiento de Lighthouse.",helpUseCaseNavigation2:"Obtener métricas de rendimiento de carga de páginas, como el Procesamiento de imagen con contenido más grande y el índice de velocidad.",helpUseCaseNavigation3:"Evaluar las capacidades de las apps web progresivas.",helpUseCaseSnapshot1:"Encontrar problemas de accesibilidad en aplicaciones de página única o formularios complejos.",helpUseCaseSnapshot2:"Evaluar prácticas recomendadas de menús y elementos de la IU ocultos detrás de la interacción.",helpUseCaseTimespan1:"Medir los cambios de diseño y el tiempo de ejecución de JavaScript en una serie de interacciones.",helpUseCaseTimespan2:"Descubrir oportunidades de rendimiento para mejorar la experiencia en aplicaciones de página única y en páginas abiertas por largo tiempo.",highestImpact:"Mayor impacto",informativeAuditCount:"{numInformative,plural, =1{{numInformative} auditoría informativa}other{{numInformative} auditorías informativas}}",mobile:"Para dispositivos móviles",navigationDescription:"Carga de página",navigationLongDescription:"Los informes de navegación analizan la carga de una sola página, de la misma manera que los informes originales de Lighthouse.",navigationReport:"Informe de navegación",navigationReportCount:"{numNavigation,plural, =1{{numNavigation} informe de navegación}other{{numNavigation} informes de navegación}}",passableAuditCount:"{numPassableAudits,plural, =1{{numPassableAudits} auditoría con posibilidades de aprobar}other{{numPassableAudits} auditorías con posibilidades de aprobar}}",passedAuditCount:"{numPassed,plural, =1{{numPassed} auditoría aprobada}other{{numPassed} auditorías aprobadas}}",ratingAverage:"Promedio",ratingError:"Error",ratingFail:"Deficiente",ratingPass:"Bueno",save:"Guardar",snapshotDescription:"Estado de la página en un momento específico",snapshotLongDescription:"Los informes de instantáneas analizan la página en un estado particular, por lo general, después de las interacciones de un usuario.",snapshotReport:"Informe de un momento específico",snapshotReportCount:"{numSnapshot,plural, =1{{numSnapshot} informe de un momento específico}other{{numSnapshot} informes de un momento específico}}",summary:"Resumen",timespanDescription:"Interacciones del usuario",timespanLongDescription:"Los informes de períodos analizan un período arbitrario, el cual por lo general incluye interacciones de los usuarios.",timespanReport:"Informe del período",timespanReportCount:"{numTimespan,plural, =1{{numTimespan} informe del período}other{{numTimespan} informes del período}}",title:"Informe del flujo de usuarios de Lighthouse"},"es-US":{allReports:"Todos los informes",categories:"Categorías",categoryAccessibility:"Accesibilidad",categoryBestPractices:"Recomendaciones",categoryPerformance:"Rendimiento",categorySeo:"SEO",desktop:"Escritorio",helpDialogTitle:"Explicación del informe de flujos de Lighthouse",helpLabel:"Explicación de flujos",helpUseCaseInstructionNavigation:"Utilizar los informes de navegación para…",helpUseCaseInstructionSnapshot:"Utilizar los informes de instantáneas para…",helpUseCaseInstructionTimespan:"Utilizar los informes de períodos para…",helpUseCaseNavigation1:"Obtener una puntuación de rendimiento de Lighthouse.",helpUseCaseNavigation2:"Obtener métricas de rendimiento de carga de páginas, como el Procesamiento de imagen con contenido más grande y el índice de velocidad.",helpUseCaseNavigation3:"Evaluar las capacidades de las apps web progresivas.",helpUseCaseSnapshot1:"Encontrar problemas de accesibilidad en aplicaciones de página única o formularios complejos.",helpUseCaseSnapshot2:"Evaluar prácticas recomendadas de menús y elementos de la IU ocultos detrás de la interacción.",helpUseCaseTimespan1:"Medir los cambios de diseño y el tiempo de ejecución de JavaScript en una serie de interacciones.",helpUseCaseTimespan2:"Descubrir oportunidades de rendimiento para mejorar la experiencia en aplicaciones de página única y en páginas abiertas por largo tiempo.",highestImpact:"Mayor impacto",informativeAuditCount:"{numInformative,plural, =1{{numInformative} auditoría informativa}other{{numInformative} auditorías informativas}}",mobile:"Para dispositivos móviles",navigationDescription:"Carga de página",navigationLongDescription:"Los informes de navegación analizan la carga de una sola página, de la misma manera que los informes originales de Lighthouse.",navigationReport:"Informe de navegación",navigationReportCount:"{numNavigation,plural, =1{{numNavigation} informe de navegación}other{{numNavigation} informes de navegación}}",passableAuditCount:"{numPassableAudits,plural, =1{{numPassableAudits} auditoría con posibilidades de aprobar}other{{numPassableAudits} auditorías con posibilidades de aprobar}}",passedAuditCount:"{numPassed,plural, =1{{numPassed} auditoría aprobada}other{{numPassed} auditorías aprobadas}}",ratingAverage:"Promedio",ratingError:"Error",ratingFail:"Deficiente",ratingPass:"Bueno",save:"Guardar",snapshotDescription:"Estado de la página en un momento específico",snapshotLongDescription:"Los informes de instantáneas analizan la página en un estado particular, por lo general, después de las interacciones de un usuario.",snapshotReport:"Informe de un momento específico",snapshotReportCount:"{numSnapshot,plural, =1{{numSnapshot} informe de un momento específico}other{{numSnapshot} informes de un momento específico}}",summary:"Resumen",timespanDescription:"Interacciones del usuario",timespanLongDescription:"Los informes de períodos analizan un período arbitrario, el cual por lo general incluye interacciones de los usuarios.",timespanReport:"Informe del período",timespanReportCount:"{numTimespan,plural, =1{{numTimespan} informe del período}other{{numTimespan} informes del período}}",title:"Informe del flujo de usuarios de Lighthouse"},"es-UY":{allReports:"Todos los informes",categories:"Categorías",categoryAccessibility:"Accesibilidad",categoryBestPractices:"Recomendaciones",categoryPerformance:"Rendimiento",categorySeo:"SEO",desktop:"Escritorio",helpDialogTitle:"Explicación del informe de flujos de Lighthouse",helpLabel:"Explicación de flujos",helpUseCaseInstructionNavigation:"Utilizar los informes de navegación para…",helpUseCaseInstructionSnapshot:"Utilizar los informes de instantáneas para…",helpUseCaseInstructionTimespan:"Utilizar los informes de períodos para…",helpUseCaseNavigation1:"Obtener una puntuación de rendimiento de Lighthouse.",helpUseCaseNavigation2:"Obtener métricas de rendimiento de carga de páginas, como el Procesamiento de imagen con contenido más grande y el índice de velocidad.",helpUseCaseNavigation3:"Evaluar las capacidades de las apps web progresivas.",helpUseCaseSnapshot1:"Encontrar problemas de accesibilidad en aplicaciones de página única o formularios complejos.",helpUseCaseSnapshot2:"Evaluar prácticas recomendadas de menús y elementos de la IU ocultos detrás de la interacción.",helpUseCaseTimespan1:"Medir los cambios de diseño y el tiempo de ejecución de JavaScript en una serie de interacciones.",helpUseCaseTimespan2:"Descubrir oportunidades de rendimiento para mejorar la experiencia en aplicaciones de página única y en páginas abiertas por largo tiempo.",highestImpact:"Mayor impacto",informativeAuditCount:"{numInformative,plural, =1{{numInformative} auditoría informativa}other{{numInformative} auditorías informativas}}",mobile:"Para dispositivos móviles",navigationDescription:"Carga de página",navigationLongDescription:"Los informes de navegación analizan la carga de una sola página, de la misma manera que los informes originales de Lighthouse.",navigationReport:"Informe de navegación",navigationReportCount:"{numNavigation,plural, =1{{numNavigation} informe de navegación}other{{numNavigation} informes de navegación}}",passableAuditCount:"{numPassableAudits,plural, =1{{numPassableAudits} auditoría con posibilidades de aprobar}other{{numPassableAudits} auditorías con posibilidades de aprobar}}",passedAuditCount:"{numPassed,plural, =1{{numPassed} auditoría aprobada}other{{numPassed} auditorías aprobadas}}",ratingAverage:"Promedio",ratingError:"Error",ratingFail:"Deficiente",ratingPass:"Bueno",save:"Guardar",snapshotDescription:"Estado de la página en un momento específico",snapshotLongDescription:"Los informes de instantáneas analizan la página en un estado particular, por lo general, después de las interacciones de un usuario.",snapshotReport:"Informe de un momento específico",snapshotReportCount:"{numSnapshot,plural, =1{{numSnapshot} informe de un momento específico}other{{numSnapshot} informes de un momento específico}}",summary:"Resumen",timespanDescription:"Interacciones del usuario",timespanLongDescription:"Los informes de períodos analizan un período arbitrario, el cual por lo general incluye interacciones de los usuarios.",timespanReport:"Informe del período",timespanReportCount:"{numTimespan,plural, =1{{numTimespan} informe del período}other{{numTimespan} informes del período}}",title:"Informe del flujo de usuarios de Lighthouse"},"es-VE":{allReports:"Todos los informes",categories:"Categorías",categoryAccessibility:"Accesibilidad",categoryBestPractices:"Recomendaciones",categoryPerformance:"Rendimiento",categorySeo:"SEO",desktop:"Escritorio",helpDialogTitle:"Explicación del informe de flujos de Lighthouse",helpLabel:"Explicación de flujos",helpUseCaseInstructionNavigation:"Utilizar los informes de navegación para…",helpUseCaseInstructionSnapshot:"Utilizar los informes de instantáneas para…",helpUseCaseInstructionTimespan:"Utilizar los informes de períodos para…",helpUseCaseNavigation1:"Obtener una puntuación de rendimiento de Lighthouse.",helpUseCaseNavigation2:"Obtener métricas de rendimiento de carga de páginas, como el Procesamiento de imagen con contenido más grande y el índice de velocidad.",helpUseCaseNavigation3:"Evaluar las capacidades de las apps web progresivas.",helpUseCaseSnapshot1:"Encontrar problemas de accesibilidad en aplicaciones de página única o formularios complejos.",helpUseCaseSnapshot2:"Evaluar prácticas recomendadas de menús y elementos de la IU ocultos detrás de la interacción.",helpUseCaseTimespan1:"Medir los cambios de diseño y el tiempo de ejecución de JavaScript en una serie de interacciones.",helpUseCaseTimespan2:"Descubrir oportunidades de rendimiento para mejorar la experiencia en aplicaciones de página única y en páginas abiertas por largo tiempo.",highestImpact:"Mayor impacto",informativeAuditCount:"{numInformative,plural, =1{{numInformative} auditoría informativa}other{{numInformative} auditorías informativas}}",mobile:"Para dispositivos móviles",navigationDescription:"Carga de página",navigationLongDescription:"Los informes de navegación analizan la carga de una sola página, de la misma manera que los informes originales de Lighthouse.",navigationReport:"Informe de navegación",navigationReportCount:"{numNavigation,plural, =1{{numNavigation} informe de navegación}other{{numNavigation} informes de navegación}}",passableAuditCount:"{numPassableAudits,plural, =1{{numPassableAudits} auditoría con posibilidades de aprobar}other{{numPassableAudits} auditorías con posibilidades de aprobar}}",passedAuditCount:"{numPassed,plural, =1{{numPassed} auditoría aprobada}other{{numPassed} auditorías aprobadas}}",ratingAverage:"Promedio",ratingError:"Error",ratingFail:"Deficiente",ratingPass:"Bueno",save:"Guardar",snapshotDescription:"Estado de la página en un momento específico",snapshotLongDescription:"Los informes de instantáneas analizan la página en un estado particular, por lo general, después de las interacciones de un usuario.",snapshotReport:"Informe de un momento específico",snapshotReportCount:"{numSnapshot,plural, =1{{numSnapshot} informe de un momento específico}other{{numSnapshot} informes de un momento específico}}",summary:"Resumen",timespanDescription:"Interacciones del usuario",timespanLongDescription:"Los informes de períodos analizan un período arbitrario, el cual por lo general incluye interacciones de los usuarios.",timespanReport:"Informe del período",timespanReportCount:"{numTimespan,plural, =1{{numTimespan} informe del período}other{{numTimespan} informes del período}}",title:"Informe del flujo de usuarios de Lighthouse"},fi:{allReports:"Kaikki raportit",categories:"Kategoriat",categoryAccessibility:"Esteettömyys",categoryBestPractices:"Parhaat käytännöt",categoryPerformance:"Tehokkuus",categorySeo:"Hakukoneoptimointi",desktop:"Tietokone",helpDialogTitle:"Lighthousen käyttökulkuraportin tulkitseminen",helpLabel:"Tietoja käyttökuluista",helpUseCaseInstructionNavigation:"Käytä navigointiraportteja näihin tarkoituksiin:",helpUseCaseInstructionSnapshot:"Käytä Snapshotia näihin tarkoituksiin:",helpUseCaseInstructionTimespan:"Käytä aikajanaraportteja näihin tarkoituksiin:",helpUseCaseNavigation1:"Nouda Lighthouse-suorituskykyprosentti.",helpUseCaseNavigation2:"Mittaa sivulatauksia sivun latautumisajan ja nopeusindeksin kaltaisilla mittareilla.",helpUseCaseNavigation3:"Arvioi progressiivisten web-sovellusten ominaisuuksia.",helpUseCaseSnapshot1:"Löydä esteettömyysongelmia yhden sivun sovelluksista tai monimutkaisista muodoista.",helpUseCaseSnapshot2:"Arvioi toiminnan taakse piilotettujen valikoiden ja UI-elementtien parhaita käytäntöjä.",helpUseCaseTimespan1:"Mittaa asettelun muutoksia ja JavaScriptin suoritusaikoja toimintasarjoissa.",helpUseCaseTimespan2:"Tutustu tapoihin, joilla voit parantaa pitkäaikaisten sivujen ja yhden sivun sovellusten käyttökokemusta.",highestImpact:"Suurin vaikutus",informativeAuditCount:"{numInformative,plural, =1{{numInformative} informatiivinen tarkastus}other{{numInformative} informatiivista tarkastusta}}",mobile:"Mobiili",navigationDescription:"Sivun lataaminen",navigationLongDescription:"Navigointiraporteissa analysoidaan yksi sivun lataus, aivan kuten alkuperäisissä Lighthouse-raporteissa.",navigationReport:"Navigointiraportti",navigationReportCount:"{numNavigation,plural, =1{{numNavigation} navigointiraportti}other{{numNavigation} navigointiraporttia}}",passableAuditCount:"{numPassableAudits,plural, =1{{numPassableAudits} läpäistävissä oleva tarkastus}other{{numPassableAudits} läpäistävissä olevaa tarkastusta}}",passedAuditCount:"{numPassed,plural, =1{{numPassed} tarkastus läpäisty}other{{numPassed} tarkastusta läpäisty}}",ratingAverage:"Keskimääräinen",ratingError:"Virhe",ratingFail:"Huono",ratingPass:"Hyvä",save:"Tallenna",snapshotDescription:"Sivun kuvakaappaustila",snapshotLongDescription:"Snapshot-raporteissa analysoidaan sivua tietyssä tilassa, yleensä käyttäjien toiminnan jälkeen.",snapshotReport:"Tilannekuvaraportti",snapshotReportCount:"{numSnapshot,plural, =1{{numSnapshot} tilannekuvaraportti}other{{numSnapshot} tilannekuvaraporttia}}",summary:"Yhteenveto",timespanDescription:"Käyttäjän toiminta",timespanLongDescription:"Aikaväliraporteissa analysoidaan satunnainen ajanjakso, joka yleensä sisältää käyttäjien toimintaa.",timespanReport:"Aikaväliraportti",timespanReportCount:"{numTimespan,plural, =1{{numTimespan} aikajanaraportti}other{{numTimespan} aikajanaraporttia}}",title:"Lighthousen käyttökulkuraportti"},fil:{allReports:"Lahat ng Ulat",categories:"Mga Kategorya",categoryAccessibility:"Pagiging accessible",categoryBestPractices:"Pinakamahuhusay na Kagawian",categoryPerformance:"Performance",categorySeo:"SEO",desktop:"Desktop",helpDialogTitle:"Pag-unawa sa Ulat ng Daloy ng Lighthouse",helpLabel:"Pag-unawa sa Mga Daloy",helpUseCaseInstructionNavigation:"Gamitin ang Mga ulat ng pag-navigate para...",helpUseCaseInstructionSnapshot:"Gamitin ang Mga ulat ng snapshot para...",helpUseCaseInstructionTimespan:"Gamitin ang Mga ulat ng tagal ng panahon para...",helpUseCaseNavigation1:"Makakuha ng score sa Performance sa Lighthouse.",helpUseCaseNavigation2:"Sukatin ang mga sukatan ng Performance ng pag-load ng page gaya ng Largest Contentful Paint at Speed Index.",helpUseCaseNavigation3:"Suriin ang mga kakayahan ng Progressive Web App.",helpUseCaseSnapshot1:"Maghanap ng mga isyu sa accessibility sa mga single page application o kumplikadong form.",helpUseCaseSnapshot2:"Suriin ang mga pinakamahuhusay na kagawian ng mga menu at element ng UI na nakatago sa likod ng pakikipag-ugnayan.",helpUseCaseTimespan1:"Sukatin ang mga pagbabago sa layout at tagal ng pag-execute sa JavaScript sa isang serye ng mga pakikipag-ugnayan.",helpUseCaseTimespan2:"Tumuklas ng mga pagkakataon sa performance para pagandahin ang karanasan para sa mga long-lived na page at single-page application.",highestImpact:"Pinakamalaking epekto",informativeAuditCount:"{numInformative,plural, =1{{numInformative} audit na nagbibigay ng impormasyon}one{{numInformative} audit na nagbibigay ng impormasyon}other{{numInformative} na audit na nagbibigay ng impormasyon}}",mobile:"Mobile",navigationDescription:"Pag-load ng page",navigationLongDescription:"Nagsusuri ang mga ulat ng pag-navigate ng isang pag-load ng page, na eksaktong kagaya ng mga orihinal na ulat ng Lighthouse.",navigationReport:"Ulat ng pag-navigate",navigationReportCount:"{numNavigation,plural, =1{{numNavigation} ulat ng pag-navigate}one{{numNavigation} ulat ng pag-navigate}other{{numNavigation} na ulat ng pag-navigate}}",passableAuditCount:"{numPassableAudits,plural, =1{{numPassableAudits} maipapasang audit}one{{numPassableAudits} maipapasang audit}other{{numPassableAudits} na maipapasang audit}}",passedAuditCount:"{numPassed,plural, =1{{numPassed} audit ang pumasa}one{{numPassed} audit ang pumasa}other{{numPassed} na audit ang pumasa}}",ratingAverage:"Average",ratingError:"Error",ratingFail:"Pangit",ratingPass:"Maganda",save:"I-save",snapshotDescription:"Na-capture na status ng page",snapshotLongDescription:"Sinusuri ng mga ulat ng snapshot ang page sa isang partikular na status, na karaniwang pagkatapos ng mga pakikipag-ugnayan ng user.",snapshotReport:"Ulat ng snapshot",snapshotReportCount:"{numSnapshot,plural, =1{{numSnapshot} ulat ng snapshot}one{{numSnapshot} ulat ng snapshot}other{{numSnapshot} na ulat ng snapshot}}",summary:"Buod",timespanDescription:"Mga pakikipag-ugnayan ng user",timespanLongDescription:"Nagsusuri ang mga ulat ng tagal ng panahon ng abitrary na yugto ng panahon, na karaniwang naglalaman ng mga pakikipag-ugnayan ng user.",timespanReport:"Ulat ng tagal ng panahon",timespanReportCount:"{numTimespan,plural, =1{{numTimespan} ulat ng tagal ng panahon}one{{numTimespan} ulat ng tagal ng panahon}other{{numTimespan} na ulat ng tagal ng panahon}}",title:"Ulat ng Daloy ng User ng Lighthouse"},fr:{allReports:"Tous les rapports",categories:"Catégories",categoryAccessibility:"Accessibilité",categoryBestPractices:"Bonnes pratiques",categoryPerformance:"Performances",categorySeo:"SEO",desktop:"Bureau",helpDialogTitle:"Comprendre le rapport Lighthouse sur les flux",helpLabel:"Comprendre les flux",helpUseCaseInstructionNavigation:"Utiliser les rapports sur la navigation pour…",helpUseCaseInstructionSnapshot:"Utiliser les rapports sur un instantané pour…",helpUseCaseInstructionTimespan:"Utiliser les rapports sur la période pour…",helpUseCaseNavigation1:"Obtenir un score de performances Lighthouse.",helpUseCaseNavigation2:"Mesurer les métriques liées aux performances de chargement des pages comme Largest Contentful Paint et Speed Index.",helpUseCaseNavigation3:"Évaluer les fonctionnalités des progressive web apps.",helpUseCaseSnapshot1:"Identifier des problèmes d'accessibilité dans les applis monopages ou les formulaires complexes.",helpUseCaseSnapshot2:"Évaluer les bonnes pratiques concernant les menus et les éléments d'UI cachés derrière l'interaction.",helpUseCaseTimespan1:"Mesurer les décalages de mise en page et le délai d'exécution de JavaScript dans une série d'interactions.",helpUseCaseTimespan2:"Découvrir des opportunités de performances pour améliorer l'expérience utilisateur concernant les pages de longue durée et les applis Web monopages.",highestImpact:"Impact maximal",informativeAuditCount:"{numInformative,plural, =1{{numInformative} audit informatif}one{{numInformative} audit informatif}other{{numInformative} audits informatifs}}",mobile:"Mobile",navigationDescription:"Chargement de page",navigationLongDescription:"À l'instar des rapports Lighthouse d'origine, les rapports sur la navigation analysent le chargement d'une seule page.",navigationReport:"Rapport sur la navigation",navigationReportCount:"{numNavigation,plural, =1{{numNavigation} rapport sur la navigation}one{{numNavigation} rapport sur la navigation}other{{numNavigation} rapports sur la navigation}}",passableAuditCount:"{numPassableAudits,plural, =1{{numPassableAudits} audit réalisable}one{{numPassableAudits} audit réalisable}other{{numPassableAudits} audits réalisables}}",passedAuditCount:"{numPassed,plural, =1{{numPassed} audit réussi}one{{numPassed} audit réussi}other{{numPassed} audits réussis}}",ratingAverage:"Moyenne",ratingError:"Erreur",ratingFail:"Mauvaise",ratingPass:"Bonne",save:"Enregistrer",snapshotDescription:"État capturé de la page",snapshotLongDescription:"Les rapports sur un instantané analysent la page à un moment donné, généralement après des interactions d'utilisateurs.",snapshotReport:"Rapport sur un instantané",snapshotReportCount:"{numSnapshot,plural, =1{{numSnapshot} rapport sur un instantané}one{{numSnapshot} rapport sur un instantané}other{{numSnapshot} rapports sur un instantané}}",summary:"Résumé",timespanDescription:"Interactions des utilisateurs",timespanLongDescription:"Les rapports sur la période analysent une période arbitraire, contenant généralement des interactions d'utilisateurs.",timespanReport:"Rapport sur la période",timespanReportCount:"{numTimespan,plural, =1{{numTimespan} rapport sur la période}one{{numTimespan} rapport sur la période}other{{numTimespan} rapports sur la période}}",title:"Rapport sur le flux d'utilisateurs Lighthouse"},he:{allReports:"כל הדוחות",categories:"קטגוריות",categoryAccessibility:"נגישות",categoryBestPractices:"שיטות מומלצות",categoryPerformance:"ביצועים",categorySeo:"אופטימיזציה למנועי חיפוש",desktop:"מחשבים",helpDialogTitle:"הסבר על דוח התהליכים של Lighthouse",helpLabel:"הסבר על תהליכים",helpUseCaseInstructionNavigation:"שימוש בדוחות ניווט לצורך...",helpUseCaseInstructionSnapshot:"שימוש בדוחות של תמונת מצב לצורך...",helpUseCaseInstructionTimespan:"שימוש בדוחות של טווח זמן לצורך...",helpUseCaseNavigation1:"קבלת ציון לגבי ביצועי Lighthouse.",helpUseCaseNavigation2:"בדיקת מדדי ביצועים של טעינת דפים כמו Largest Contentful Paint ‏(LCP) ו-Speed Index.",helpUseCaseNavigation3:"הערכת יכולות של Progressive Web App.",helpUseCaseSnapshot1:"איתור של בעיות נגישות באפליקציות שכוללות דף יחיד או בטפסים מורכבים.",helpUseCaseSnapshot2:"הערכת שיטות מומלצות הקשורות לתפריטים ולרכיבים בממשק המשתמש שמוסתרים עקב ביצוע אינטראקציה.",helpUseCaseTimespan1:"מדידה של שינויי פריסה וזמן ריצה של JavaScript במסגרת סדרת אינטראקציות.",helpUseCaseTimespan2:"גילוי הזדמנויות הקשורות לביצועים כדי לשפר את חוויית המשתמש בדפים שפתוחים זמן רב ובאפליקציות שכוללות דף יחיד.",highestImpact:"הכי הרבה השפעה",informativeAuditCount:"{numInformative,plural, =1{ביקורת אינפורמטיבית אחת ({numInformative})}one{‫{numInformative} ביקורות אינפורמטיביות}two{‫{numInformative} ביקורות אינפורמטיביות}other{‫{numInformative} ביקורות אינפורמטיביות}}",mobile:"ניידים",navigationDescription:"טעינת דף",navigationLongDescription:"דוחות ניווט מיועדים לניתוח של טעינת דף יחידה, בדיוק כמו דוחות Lighthouse המקוריים.",navigationReport:"דוח לגבי ניווט",navigationReportCount:"{numNavigation,plural, =1{דוח אחד ({numNavigation}) לגבי ניווט}one{‫{numNavigation} דוחות לגבי ניווט}two{‫{numNavigation} דוחות לגבי ניווט}other{‫{numNavigation} דוחות לגבי ניווט}}",passableAuditCount:"{numPassableAudits,plural, =1{ביקורת עוברת אחת ({numPassableAudits})}one{‫{numPassableAudits} ביקורות עוברות}two{‫{numPassableAudits} ביקורות עוברות}other{‫{numPassableAudits} ביקורות עוברות}}",passedAuditCount:"{numPassed,plural, =1{ביקורת אחת ({numPassed}) עברה}one{‫{numPassed} ביקורות עברו}two{‫{numPassed} ביקורות עברו}other{‫{numPassed} ביקורות עברו}}",ratingAverage:"ממוצעת",ratingError:"שגיאה",ratingFail:"גרועה",ratingPass:"טובה",save:"שמירה",snapshotDescription:"מצב דף בנקודת זמן",snapshotLongDescription:"דוחות של תמונת מצב מיועדים לניתוח הדף במצב מסוים. לרוב, הניתוח מתבצע לאחר אינטראקציות של משתמשים.",snapshotReport:"דוח תמונת מצב",snapshotReportCount:"{numSnapshot,plural, =1{דוח תמונת מצב אחד ({numSnapshot})}one{‫{numSnapshot} דוחות תמונת מצב}two{‫{numSnapshot} דוחות תמונת מצב}other{‫{numSnapshot} דוחות תמונת מצב}}",summary:"סיכום",timespanDescription:"אינטראקציות של משתמשים",timespanLongDescription:"דוחות של טווח זמן מיועדים לניתוח של משך זמן אקראי, שלרוב מתרחשות בו אינטראקציות של משתמש.",timespanReport:"דוח על טווח זמן",timespanReportCount:"{numTimespan,plural, =1{דוח אחד ({numTimespan}) על טווח זמן}one{‫{numTimespan} דוחות על טווח זמן}two{‫{numTimespan} דוחות על טווח זמן}other{‫{numTimespan} דוחות על טווח זמן}}",title:"דוח Lighthouse על מסלולי משתמשים בדף"},hi:{allReports:"सभी रिपोर्ट",categories:"कैटगरी",categoryAccessibility:"सुलभता",categoryBestPractices:"सबसे अच्छे तरीके",categoryPerformance:"परफ़ॉर्मेंस",categorySeo:"SEO",desktop:"डेस्कटॉप",helpDialogTitle:"लाइटहाउस फ़्लो रिपोर्ट को समझें",helpLabel:"फ़्लो रिपोर्ट को समझें",helpUseCaseInstructionNavigation:"इसके लिए नेविगेशन रिपोर्ट का इस्तेमाल करें...",helpUseCaseInstructionSnapshot:"इसके लिए स्नैपशॉट रिपोर्ट का इस्तेमाल करें...",helpUseCaseInstructionTimespan:"इसके लिए टाइमस्पैन रिपोर्ट का इस्तेमाल करें...",helpUseCaseNavigation1:"लाइटहाउस परफ़ॉर्मेंस स्कोर हासिल करें.",helpUseCaseNavigation2:"सबसे बड़ा कॉन्टेंटफ़ुल पेंट और स्पीड इंडेक्स जैसी पेज लोड की परफ़ॉर्मेंस मेट्रिक का आकलन करें.",helpUseCaseNavigation3:"प्रोग्रेसिव वेब ऐप्लिकेशन की क्षमताओं का आकलन करें.",helpUseCaseSnapshot1:"एक पेज के ऐप्लिकेशन या जटिल फ़ॉर्म में, सुलभता से जुड़ी समस्याएं ढूंढें.",helpUseCaseSnapshot2:"इंटरैक्शन के पीछे छिपे हुए मेन्यू और यूज़र इंटरफ़ेस (यूआई) एलिमेंट के सबसे सही तरीकों का आकलन करें.",helpUseCaseTimespan1:"कई इंटरैक्शन पर, लेआउट में हुए बदलाव और JavaScript लागू होने का समय मापें.",helpUseCaseTimespan2:"लंबे समय तक इस्तेमाल किए वाले पेजों और एक पेज के ऐप्लिकेशन के अनुभव को बेहतर बनाने के लिए, परफ़ॉर्मेंस से जुड़े अवसरों के बारे में जानें.",highestImpact:"सबसे असरदार ऑडिट",informativeAuditCount:"{numInformative,plural, =1{जानकारी देने वाला {numInformative} ऑडिट}one{जानकारी देने वाला {numInformative} ऑडिट}other{जानकारी देने वाले {numInformative} ऑडिट}}",mobile:"मोबाइल",navigationDescription:"पेज लोड",navigationLongDescription:"नेविगेशन रिपोर्ट, मूल लाइटहाउस रिपोर्ट की तरह ही एक पेज लोड का विश्लेषण करती है.",navigationReport:"नेविगेशन रिपोर्ट",navigationReportCount:"{numNavigation,plural, =1{{numNavigation} नेविगेशन रिपोर्ट}one{{numNavigation} नेविगेशन रिपोर्ट}other{{numNavigation} नेविगेशन रिपोर्ट}}",passableAuditCount:"{numPassableAudits,plural, =1{{numPassableAudits} पासेबल ऑडिट}one{{numPassableAudits} पासेबल ऑडिट}other{{numPassableAudits} पासेबल ऑडिट}}",passedAuditCount:"{numPassed,plural, =1{{numPassed} ऑडिट पास किया गया}one{{numPassed} ऑडिट पास किया गया}other{{numPassed} ऑडिट पास किए गए}}",ratingAverage:"ठीक-ठाक",ratingError:"गड़बड़ी",ratingFail:"खराब",ratingPass:"अच्छी",save:"सेव करें",snapshotDescription:"पेज की कैप्चर की गई स्थिति",snapshotLongDescription:"स्नैपशॉट रिपोर्ट किसी खास स्थिति में, खास तौर पर उपयोगकर्ता इंटरैक्शन के बाद पेज का विश्लेषण करती है.",snapshotReport:"किसी खास समय पर, वेब पेज की स्थिति बताने वाली रिपोर्ट",snapshotReportCount:"{numSnapshot,plural, =1{{numSnapshot} स्नैपशॉट रिपोर्ट}one{{numSnapshot} स्नैपशॉट रिपोर्ट}other{{numSnapshot} स्नैपशॉट रिपोर्ट}}",summary:"खास जानकारी",timespanDescription:"उपयोगकर्ता के इंटरैक्शन",timespanLongDescription:"टाइमस्पैन रिपोर्ट किसी भी समय अवधि का, खास तौर पर उपयोगकर्ता इंटरैक्शन वाली समय अवधि का विश्लेषण करती है.",timespanReport:"पेज पर उपयोगकर्ता के इंटरैक्शन की जानकारी देने वाली रिपोर्ट",timespanReportCount:"{numTimespan,plural, =1{{numTimespan} टाइमस्पैन रिपोर्ट}one{{numTimespan} टाइमस्पैन रिपोर्ट}other{{numTimespan} टाइमस्पैन रिपोर्ट}}",title:"Lighthouse की यूज़र फ़्लो रिपोर्ट"},hr:{allReports:"Sva izvješća",categories:"Kategorije",categoryAccessibility:"Pristupačnost",categoryBestPractices:"Najbolji primjeri iz prakse",categoryPerformance:"Izvedba",categorySeo:"SEO",desktop:"Računalo",helpDialogTitle:"Razumijevanje Lighthouseovog izvješća o putovima",helpLabel:"Razumijevanje putova",helpUseCaseInstructionNavigation:"Upotrijebite izvješća o kretanju za...",helpUseCaseInstructionSnapshot:"Upotrijebite izvješća o snimkama za...",helpUseCaseInstructionTimespan:"Upotrijebite izvješća o razdoblju za...",helpUseCaseNavigation1:"dobivanje rezultata izvedbe za Lighthouse",helpUseCaseNavigation2:"mjerenje pokazatelja izvedbe učitavanja stranica kao što su najveće renderiranje sadržaja i indeks brzine",helpUseCaseNavigation3:"procjenu mogućnosti progresivne web-aplikacije",helpUseCaseSnapshot1:"pronalaženje problema s pristupačnošću u jednostraničnim aplikacijama ili složenim obrascima",helpUseCaseSnapshot2:"procjenu najboljih primjera iz prakse za izbornike i elemente korisničkog sučelja skrivene iza interakcije",helpUseCaseTimespan1:"mjerenje pomaka izgleda i vremena izvršavanja JavaScripta u nizu interakcija",helpUseCaseTimespan2:"otkrivanje prilika za izvedbu radi poboljšanja doživljaja za dugotrajne stranice i jednostranične aplikacije",highestImpact:"Najviši utjecaj",informativeAuditCount:"{numInformative,plural, =1{{numInformative} informativna revizija}one{{numInformative} informativna revizija}few{{numInformative} informativne revizije}other{{numInformative} informativnih revizija}}",mobile:"Mobilna verzija",navigationDescription:"Učitavanje stranice",navigationLongDescription:"Izvješća o kretanju analiziraju učitavanje jedne stranice, jednako kao i izvorna Lighthouseova izvješća.",navigationReport:"Izvješće o kretanju",navigationReportCount:"{numNavigation,plural, =1{{numNavigation} izvješće o kretanju}one{{numNavigation} izvješće o kretanju}few{{numNavigation} izvješća o kretanju}other{{numNavigation} izvješća o kretanju}}",passableAuditCount:"{numPassableAudits,plural, =1{{numPassableAudits} prolazna revizija}one{{numPassableAudits} prolazna revizija}few{{numPassableAudits} prolazne revizije}other{{numPassableAudits} prolaznih revizija}}",passedAuditCount:"{numPassed,plural, =1{{numPassed} uspješna revizija}one{{numPassed} uspješna revizija}few{{numPassed} uspješne revizije}other{{numPassed} uspješnih revizija}}",ratingAverage:"Prosječno",ratingError:"Pogreška",ratingFail:"Loše",ratingPass:"Dobro",save:"Spremi",snapshotDescription:"Snimljeno stanje stranice",snapshotLongDescription:"Izvješća o snimkama analiziraju stranicu u određenom stanju, obično nakon interakcija korisnika.",snapshotReport:"Izvješće o snimci",snapshotReportCount:"{numSnapshot,plural, =1{{numSnapshot} izvješće o snimci}one{{numSnapshot} izvješće o snimci}few{{numSnapshot} izvješća o snimci}other{{numSnapshot} izvješća o snimci}}",summary:"Sažetak",timespanDescription:"Korisničke interakcije",timespanLongDescription:"Izvješća o razdoblju analiziraju proizvoljno razdoblje, koje obično obuhvaća korisničke interakcije.",timespanReport:"Izvješće o razdoblju",timespanReportCount:"{numTimespan,plural, =1{{numTimespan} izvješće o razdoblju}one{{numTimespan} izvješće o razdoblju}few{{numTimespan} izvješća o razdoblju}other{{numTimespan} izvješća o razdoblju}}",title:"Lighthouseovo izvješće o putovima korisnika"},hu:{allReports:"Az összes jelentés",categories:"Kategóriák",categoryAccessibility:"Kisegítő lehetőségek",categoryBestPractices:"Bevált módszerek",categoryPerformance:"Teljesítmény",categorySeo:"Keresőoptimalizálás",desktop:"Asztali",helpDialogTitle:"A Lighthouse-folyamatjelentés értelmezése",helpLabel:"A folyamatok értelmezése",helpUseCaseInstructionNavigation:"A navigációs jelentések használatával a következőket teheti:…",helpUseCaseInstructionSnapshot:"A pillanatkép-jelentések használatával a következőket teheti:…",helpUseCaseInstructionTimespan:"Az időtartam-jelentések használatával a következőket teheti:…",helpUseCaseNavigation1:"pontszámot kaphat a Lighthouse-teljesítményre vonatkozóan;",helpUseCaseNavigation2:"mérheti az oldalbetöltési teljesítménnyel kapcsolatos mutatókat (például a legnagyobb vizuális tartalomválaszt és a sebességindexet).",helpUseCaseNavigation3:"értékelheti a progresszív webes alkalmazások képességeit;",helpUseCaseSnapshot1:"megtalálhatja a kisegítő lehetőségekkel kapcsolatos problémákat az egyoldalas alkalmazásokban vagy az összetettebb űrlapokon",helpUseCaseSnapshot2:"értékelheti az interakciók mögötti rejtett menükkel és UI-elemekkel kapcsolatos bevált módszereket;",helpUseCaseTimespan1:"különböző interakciók esetében mérheti az elrendezésmozgást és a JavaScript végrehajtási idejét.",helpUseCaseTimespan2:"teljesítményre vonatkozó lehetőségeket fedezhet fel a hosszú életű oldalak és az egyoldalas alkalmazásokkal kapcsolatos élmények javítása érdekében;",highestImpact:"Legnagyobb hatás",informativeAuditCount:"{numInformative,plural, =1{{numInformative} tájékoztató ellenőrzés}other{{numInformative} tájékoztató ellenőrzés}}",mobile:"Mobil",navigationDescription:"Oldalbetöltés",navigationLongDescription:"A navigációs jelentések (pontosan úgy, ahogy az eredeti Lighthouse-jelentések is) az egyes oldalak betöltését elemzik.",navigationReport:"Navigációs jelentés",navigationReportCount:"{numNavigation,plural, =1{{numNavigation} navigációs jelentés}other{{numNavigation} navigációs jelentés}}",passableAuditCount:"{numPassableAudits,plural, =1{{numPassableAudits} teljesíthető ellenőrzés}other{{numPassableAudits} teljesíthető ellenőrzés}}",passedAuditCount:"{numPassed,plural, =1{{numPassed} sikeres ellenőrzés}other{{numPassed} sikeres ellenőrzés}}",ratingAverage:"Átlagos",ratingError:"Hiba",ratingFail:"Gyenge",ratingPass:"Jó",save:"mentés;",snapshotDescription:"Az oldal rögzített állapota",snapshotLongDescription:"A pillanatkép-jelentés az oldalt adott állapotában, jellemzően a felhasználói interakciókat követően elemzi.",snapshotReport:"Pillanatkép-jelentés",snapshotReportCount:"{numSnapshot,plural, =1{{numSnapshot} pillanatkép-jelentés}other{{numSnapshot} pillanatkép-jelentés}}",summary:"Összegzés",timespanDescription:"Felhasználói interakciók",timespanLongDescription:"Az időtartam-jelentések a tetszőleges, jellemzően felhasználó interakciókat tartalmazó időtartamokat elemzik.",timespanReport:"Időtartam-jelentés",timespanReportCount:"{numTimespan,plural, =1{{numTimespan} időtartam-jelentés}other{{numTimespan} időtartam-jelentés}}",title:"Lighthouse felhasználóimunkafolyamat-jelentés"},gsw:{allReports:"Alle Berichte",categories:"Kategorien",categoryAccessibility:"Barrierefreiheit",categoryBestPractices:"Best Practices",categoryPerformance:"Leistung",categorySeo:"SEO",desktop:"Computer",helpDialogTitle:"Informationen über den Lighthouse-Bericht zur Aufrufabfolge",helpLabel:"Informationen über Aufrufabfolgen",helpUseCaseInstructionNavigation:"Navigationsberichte können für Folgendes verwendet werden:",helpUseCaseInstructionSnapshot:"Snapshot-Berichte können für Folgendes verwendet werden:",helpUseCaseInstructionTimespan:"Zeitspannenberichte können für Folgendes verwendet werden:",helpUseCaseNavigation1:"Eine Lighthouse-Leistungsbewertung erhalten.",helpUseCaseNavigation2:"Messwerte zur Leistung beim Seitenaufbau erfassen, z. B. Largest Contentful Paint oder Speed Index.",helpUseCaseNavigation3:"Funktionen progressiver Web-Apps bewerten.",helpUseCaseSnapshot1:"Probleme mit der Barrierefreiheit in Single-Page-Anwendungen oder komplexen Formularen finden.",helpUseCaseSnapshot2:"Best Practices für hinter einer Interaktion versteckte Menüs und UI-Elemente bewerten.",helpUseCaseTimespan1:"Layoutverschiebungen und JavaScript-Ausführungszeit bei einer Reihe von Interaktionen messen.",helpUseCaseTimespan2:"Leistungsmöglichkeiten finden, um die Nutzung für langlebige Seiten und Single-Page-Anwendungen zu verbessern.",highestImpact:"Größte Wirkung",informativeAuditCount:"{numInformative,plural, =1{{numInformative} informative Prüfung}other{{numInformative} informative Prüfungen}}",mobile:"Mobil",navigationDescription:"Seitenaufbau",navigationLongDescription:"Mit Navigationsberichten wird der Aufbau einer einzelnen Seite analysiert, genau wie mit den ursprünglichen Lighthouse-Berichten.",navigationReport:"Navigationsbericht",navigationReportCount:"{numNavigation,plural, =1{{numNavigation} Navigationsbericht}other{{numNavigation} Navigationsberichte}}",passableAuditCount:"{numPassableAudits,plural, =1{{numPassableAudits} bestehbare Prüfung}other{{numPassableAudits} bestehbare Prüfungen}}",passedAuditCount:"{numPassed,plural, =1{{numPassed} Prüfung bestanden}other{{numPassed} Prüfungen bestanden}}",ratingAverage:"Durchschnittlich",ratingError:"Fehler",ratingFail:"Schlecht",ratingPass:"Gut",save:"Speichern",snapshotDescription:"Erfasster Seitenstatus",snapshotLongDescription:"Mit Snapshot-Berichten werden Seiten in einem bestimmten Zustand analysiert, in der Regel nach Nutzerinteraktionen.",snapshotReport:"Snapshot-Bericht",snapshotReportCount:"{numSnapshot,plural, =1{{numSnapshot} Snapshot-Bericht}other{{numSnapshot} Snapshot-Berichte}}",summary:"Zusammenfassung",timespanDescription:"Nutzerinteraktionen",timespanLongDescription:"Mit Zeitspannenberichten wird ein beliebiger Zeitraum analysiert, normalerweise einer, der Nutzerinteraktionen enthält.",timespanReport:"Zeitspannenbericht",timespanReportCount:"{numTimespan,plural, =1{{numTimespan} Zeitspannenbericht}other{{numTimespan} Zeitspannenberichte}}",title:"Lighthouse-Bericht zur Aufrufabfolge"},id:{allReports:"Semua Laporan",categories:"Kategori",categoryAccessibility:"Aksesibilitas",categoryBestPractices:"Praktik Terbaik",categoryPerformance:"Performa",categorySeo:"SEO",desktop:"Desktop",helpDialogTitle:"Memahami Laporan Alur Lighthouse",helpLabel:"Memahami Alur",helpUseCaseInstructionNavigation:"Gunakan laporan Navigasi untuk ...",helpUseCaseInstructionSnapshot:"Gunakan laporan Snapshot untuk ...",helpUseCaseInstructionTimespan:"Gunakan laporan Rentang Waktu untuk ...",helpUseCaseNavigation1:"Mendapatkan skor Performa Lighthouse.",helpUseCaseNavigation2:"Mengukur metrik Performa pemuatan halaman seperti Largest Contentful Paint dan Speed Index.",helpUseCaseNavigation3:"Menilai kemampuan Progressive Web App.",helpUseCaseSnapshot1:"Menemukan masalah aksesibilitas dalam aplikasi web satu halaman atau formulir yang rumit.",helpUseCaseSnapshot2:"Mengevaluasi praktik terbaik menu dan elemen UI yang tersembunyi di balik interaksi.",helpUseCaseTimespan1:"Mengukur pergeseran tata letak dan waktu eksekusi JavaScript pada serangkaian interaksi.",helpUseCaseTimespan2:"Menemukan peluang performa guna meningkatkan pengalaman untuk halaman yang dibuka dalam waktu lama dan aplikasi web satu halaman.",highestImpact:"Dampak tertinggi",informativeAuditCount:"{numInformative,plural, =1{{numInformative} audit informatif}other{{numInformative} audit informatif}}",mobile:"Seluler",navigationDescription:"Pemuatan halaman",navigationLongDescription:"Laporan Navigasi menganalisis pemuatan satu halaman, persis seperti laporan Lighthouse asli.",navigationReport:"Laporan navigasi",navigationReportCount:"{numNavigation,plural, =1{{numNavigation} laporan navigasi}other{{numNavigation} laporan navigasi}}",passableAuditCount:"{numPassableAudits,plural, =1{{numPassableAudits} audit yang dapat diluluskan}other{{numPassableAudits} audit yang dapat diluluskan}}",passedAuditCount:"{numPassed,plural, =1{{numPassed} audit lulus}other{{numPassed} audit lulus}}",ratingAverage:"Biasa",ratingError:"Error",ratingFail:"Buruk",ratingPass:"Baik",save:"Simpan",snapshotDescription:"Status halaman yang ditangkap",snapshotLongDescription:"Laporan Snapshot menganalisis halaman dalam status tertentu, biasanya setelah interaksi pengguna.",snapshotReport:"Laporan snapshot",snapshotReportCount:"{numSnapshot,plural, =1{{numSnapshot} laporan snapshot}other{{numSnapshot} laporan snapshot}}",summary:"Ringkasan",timespanDescription:"Interaksi pengguna",timespanLongDescription:"Laporan Rentang Waktu menganalisis periode waktu yang arbitrer, biasanya yang berisi interaksi pengguna.",timespanReport:"Laporan rentang waktu",timespanReportCount:"{numTimespan,plural, =1{{numTimespan} laporan rentang waktu}other{{numTimespan} laporan rentang waktu}}",title:"Laporan Alur Pengguna Lighthouse"},in:{allReports:"Semua Laporan",categories:"Kategori",categoryAccessibility:"Aksesibilitas",categoryBestPractices:"Praktik Terbaik",categoryPerformance:"Performa",categorySeo:"SEO",desktop:"Desktop",helpDialogTitle:"Memahami Laporan Alur Lighthouse",helpLabel:"Memahami Alur",helpUseCaseInstructionNavigation:"Gunakan laporan Navigasi untuk ...",helpUseCaseInstructionSnapshot:"Gunakan laporan Snapshot untuk ...",helpUseCaseInstructionTimespan:"Gunakan laporan Rentang Waktu untuk ...",helpUseCaseNavigation1:"Mendapatkan skor Performa Lighthouse.",helpUseCaseNavigation2:"Mengukur metrik Performa pemuatan halaman seperti Largest Contentful Paint dan Speed Index.",helpUseCaseNavigation3:"Menilai kemampuan Progressive Web App.",helpUseCaseSnapshot1:"Menemukan masalah aksesibilitas dalam aplikasi web satu halaman atau formulir yang rumit.",helpUseCaseSnapshot2:"Mengevaluasi praktik terbaik menu dan elemen UI yang tersembunyi di balik interaksi.",helpUseCaseTimespan1:"Mengukur pergeseran tata letak dan waktu eksekusi JavaScript pada serangkaian interaksi.",helpUseCaseTimespan2:"Menemukan peluang performa guna meningkatkan pengalaman untuk halaman yang dibuka dalam waktu lama dan aplikasi web satu halaman.",highestImpact:"Dampak tertinggi",informativeAuditCount:"{numInformative,plural, =1{{numInformative} audit informatif}other{{numInformative} audit informatif}}",mobile:"Seluler",navigationDescription:"Pemuatan halaman",navigationLongDescription:"Laporan Navigasi menganalisis pemuatan satu halaman, persis seperti laporan Lighthouse asli.",navigationReport:"Laporan navigasi",navigationReportCount:"{numNavigation,plural, =1{{numNavigation} laporan navigasi}other{{numNavigation} laporan navigasi}}",passableAuditCount:"{numPassableAudits,plural, =1{{numPassableAudits} audit yang dapat diluluskan}other{{numPassableAudits} audit yang dapat diluluskan}}",passedAuditCount:"{numPassed,plural, =1{{numPassed} audit lulus}other{{numPassed} audit lulus}}",ratingAverage:"Biasa",ratingError:"Error",ratingFail:"Buruk",ratingPass:"Baik",save:"Simpan",snapshotDescription:"Status halaman yang ditangkap",snapshotLongDescription:"Laporan Snapshot menganalisis halaman dalam status tertentu, biasanya setelah interaksi pengguna.",snapshotReport:"Laporan snapshot",snapshotReportCount:"{numSnapshot,plural, =1{{numSnapshot} laporan snapshot}other{{numSnapshot} laporan snapshot}}",summary:"Ringkasan",timespanDescription:"Interaksi pengguna",timespanLongDescription:"Laporan Rentang Waktu menganalisis periode waktu yang arbitrer, biasanya yang berisi interaksi pengguna.",timespanReport:"Laporan rentang waktu",timespanReportCount:"{numTimespan,plural, =1{{numTimespan} laporan rentang waktu}other{{numTimespan} laporan rentang waktu}}",title:"Laporan Alur Pengguna Lighthouse"},it:{allReports:"Tutti i report",categories:"Categorie",categoryAccessibility:"Accessibilità",categoryBestPractices:"Best practice",categoryPerformance:"Prestazioni",categorySeo:"SEO",desktop:"Desktop",helpDialogTitle:"Informazioni sul report flusso di Lighthouse",helpLabel:"Informazioni sui flussi",helpUseCaseInstructionNavigation:"Usa i report relativi alla navigazione per…",helpUseCaseInstructionSnapshot:"Usa i report relativi a un momento specifico per…",helpUseCaseInstructionTimespan:"Usa i report relativi al periodo di tempo per…",helpUseCaseNavigation1:"Ottenere un punteggio Lighthouse relativo alle prestazioni.",helpUseCaseNavigation2:"Misurare le metriche relative alle prestazioni di caricamento pagina quali Largest Contentful Paint e Speed Index.",helpUseCaseNavigation3:"Valutare le funzionalità delle app web progressive.",helpUseCaseSnapshot1:"Trovare problemi di accessibilità nelle applicazioni a pagina singola o in moduli complessi.",helpUseCaseSnapshot2:"Valutare best practice di menu ed elementi UI nascosti dietro l'interazione.",helpUseCaseTimespan1:"Misurare le variazioni di layout e il tempo di esecuzione di JavaScript per una serie di interazioni.",helpUseCaseTimespan2:"Scoprire opportunità legate alle prestazioni per migliorare l'esperienza relativa alle pagine di lunga durata e alle applicazioni a pagina singola.",highestImpact:"Massimo impatto",informativeAuditCount:"{numInformative,plural, =1{{numInformative} controllo informativo}other{{numInformative} controlli informativi}}",mobile:"Dispositivi mobili",navigationDescription:"Caricamento della pagina",navigationLongDescription:"I report relativi alla navigazione consentono di analizzare il caricamento di una singola pagina, esattamente come i report Lighthouse originali.",navigationReport:"Report relativo alla navigazione",navigationReportCount:"{numNavigation,plural, =1{{numNavigation} report relativo alla navigazione}other{{numNavigation} report relativi alla navigazione}}",passableAuditCount:"{numPassableAudits,plural, =1{{numPassableAudits} controllo superabile}other{{numPassableAudits} controlli superabili}}",passedAuditCount:"{numPassed,plural, =1{{numPassed} controllo superato}other{{numPassed} controlli superati}}",ratingAverage:"Nella media",ratingError:"Errore",ratingFail:"Scadente",ratingPass:"Buona",save:"Salva",snapshotDescription:"Stato acquisito della pagina",snapshotLongDescription:"I report relativi a un momento specifico consentono di analizzare la pagina in uno stato specifico, generalmente dopo le interazioni degli utenti.",snapshotReport:"Report relativo a un momento specifico",snapshotReportCount:"{numSnapshot,plural, =1{{numSnapshot} report relativo a un momento specifico}other{{numSnapshot} report relativi a un momento specifico}}",summary:"Riepilogo",timespanDescription:"Interazioni dell'utente",timespanLongDescription:"I report relativi al periodo di tempo consentono di analizzare un periodo di tempo arbitrario, generalmente durante il quale ci sono state interazioni degli utenti.",timespanReport:"Report relativo al periodo di tempo",timespanReportCount:"{numTimespan,plural, =1{{numTimespan} report relativo al periodo di tempo}other{{numTimespan} report relativi al periodo di tempo}}",title:"Report Lighthouse sulla procedura"},iw:{allReports:"כל הדוחות",categories:"קטגוריות",categoryAccessibility:"נגישות",categoryBestPractices:"שיטות מומלצות",categoryPerformance:"ביצועים",categorySeo:"אופטימיזציה למנועי חיפוש",desktop:"מחשבים",helpDialogTitle:"הסבר על דוח התהליכים של Lighthouse",helpLabel:"הסבר על תהליכים",helpUseCaseInstructionNavigation:"שימוש בדוחות ניווט לצורך...",helpUseCaseInstructionSnapshot:"שימוש בדוחות של תמונת מצב לצורך...",helpUseCaseInstructionTimespan:"שימוש בדוחות של טווח זמן לצורך...",helpUseCaseNavigation1:"קבלת ציון לגבי ביצועי Lighthouse.",helpUseCaseNavigation2:"בדיקת מדדי ביצועים של טעינת דפים כמו Largest Contentful Paint ‏(LCP) ו-Speed Index.",helpUseCaseNavigation3:"הערכת יכולות של Progressive Web App.",helpUseCaseSnapshot1:"איתור של בעיות נגישות באפליקציות שכוללות דף יחיד או בטפסים מורכבים.",helpUseCaseSnapshot2:"הערכת שיטות מומלצות הקשורות לתפריטים ולרכיבים בממשק המשתמש שמוסתרים עקב ביצוע אינטראקציה.",helpUseCaseTimespan1:"מדידה של שינויי פריסה וזמן ריצה של JavaScript במסגרת סדרת אינטראקציות.",helpUseCaseTimespan2:"גילוי הזדמנויות הקשורות לביצועים כדי לשפר את חוויית המשתמש בדפים שפתוחים זמן רב ובאפליקציות שכוללות דף יחיד.",highestImpact:"הכי הרבה השפעה",informativeAuditCount:"{numInformative,plural, =1{ביקורת אינפורמטיבית אחת ({numInformative})}one{‫{numInformative} ביקורות אינפורמטיביות}two{‫{numInformative} ביקורות אינפורמטיביות}other{‫{numInformative} ביקורות אינפורמטיביות}}",mobile:"ניידים",navigationDescription:"טעינת דף",navigationLongDescription:"דוחות ניווט מיועדים לניתוח של טעינת דף יחידה, בדיוק כמו דוחות Lighthouse המקוריים.",navigationReport:"דוח לגבי ניווט",navigationReportCount:"{numNavigation,plural, =1{דוח אחד ({numNavigation}) לגבי ניווט}one{‫{numNavigation} דוחות לגבי ניווט}two{‫{numNavigation} דוחות לגבי ניווט}other{‫{numNavigation} דוחות לגבי ניווט}}",passableAuditCount:"{numPassableAudits,plural, =1{ביקורת עוברת אחת ({numPassableAudits})}one{‫{numPassableAudits} ביקורות עוברות}two{‫{numPassableAudits} ביקורות עוברות}other{‫{numPassableAudits} ביקורות עוברות}}",passedAuditCount:"{numPassed,plural, =1{ביקורת אחת ({numPassed}) עברה}one{‫{numPassed} ביקורות עברו}two{‫{numPassed} ביקורות עברו}other{‫{numPassed} ביקורות עברו}}",ratingAverage:"ממוצעת",ratingError:"שגיאה",ratingFail:"גרועה",ratingPass:"טובה",save:"שמירה",snapshotDescription:"מצב דף בנקודת זמן",snapshotLongDescription:"דוחות של תמונת מצב מיועדים לניתוח הדף במצב מסוים. לרוב, הניתוח מתבצע לאחר אינטראקציות של משתמשים.",snapshotReport:"דוח תמונת מצב",snapshotReportCount:"{numSnapshot,plural, =1{דוח תמונת מצב אחד ({numSnapshot})}one{‫{numSnapshot} דוחות תמונת מצב}two{‫{numSnapshot} דוחות תמונת מצב}other{‫{numSnapshot} דוחות תמונת מצב}}",summary:"סיכום",timespanDescription:"אינטראקציות של משתמשים",timespanLongDescription:"דוחות של טווח זמן מיועדים לניתוח של משך זמן אקראי, שלרוב מתרחשות בו אינטראקציות של משתמש.",timespanReport:"דוח על טווח זמן",timespanReportCount:"{numTimespan,plural, =1{דוח אחד ({numTimespan}) על טווח זמן}one{‫{numTimespan} דוחות על טווח זמן}two{‫{numTimespan} דוחות על טווח זמן}other{‫{numTimespan} דוחות על טווח זמן}}",title:"דוח Lighthouse על מסלולי משתמשים בדף"},ja:{allReports:"すべてのレポート",categories:"カテゴリ",categoryAccessibility:"ユーザー補助",categoryBestPractices:"おすすめの方法",categoryPerformance:"パフォーマンス",categorySeo:"SEO",desktop:"パソコン",helpDialogTitle:"Lighthouse フローレポートについて",helpLabel:"フローの詳細",helpUseCaseInstructionNavigation:"ナビゲーション レポートの使用例",helpUseCaseInstructionSnapshot:"スナップショット レポートの使用例",helpUseCaseInstructionTimespan:"期間レポートの使用例",helpUseCaseNavigation1:"Lighthouse のパフォーマンス スコアを取得する。",helpUseCaseNavigation2:"Largest Contentful Paint（最大コンテンツの描画時間）、Speed Index（速度インデックス）などのページ読み込みに関するパフォーマンス指標を測定する。",helpUseCaseNavigation3:"プログレッシブ ウェブアプリの機能を評価する。",helpUseCaseSnapshot1:"シングルページ アプリケーションや複雑なフォームでユーザー補助機能の問題がないか調べる。",helpUseCaseSnapshot2:"操作の背後に隠れてしまうメニューや UI 要素のおすすめの方法を検討する。",helpUseCaseTimespan1:"一連の操作におけるレイアウトの移動と JavaScript の実行時間を測定する。",helpUseCaseTimespan2:"長期使用のページやシングルページ アプリケーションでパフォーマンスの利便性を改善できる余地を見つける。",highestImpact:"最も影響が大きい",informativeAuditCount:"{numInformative,plural, =1{{numInformative} 件の監査で情報が提供されました}other{{numInformative} 件の監査で情報が提供されました}}",mobile:"モバイル",navigationDescription:"ページの読み込み",navigationLongDescription:"ナビゲーション レポートでは、Lighthouse のオリジナルのレポートとまったく同じように単一ページの読み込みについて分析できます。",navigationReport:"ナビゲーション レポート",navigationReportCount:"{numNavigation,plural, =1{{numNavigation} 件のナビゲーション レポート}other{{numNavigation} 件のナビゲーション レポート}}",passableAuditCount:"{numPassableAudits,plural, =1{{numPassableAudits} 件の監査にパスする可能性があります}other{{numPassableAudits} 件の監査にパスする可能性があります}}",passedAuditCount:"{numPassed,plural, =1{{numPassed} 件の監査をパスしました}other{{numPassed} 件の監査をパスしました}}",ratingAverage:"普通",ratingError:"エラー",ratingFail:"低",ratingPass:"高",save:"保存",snapshotDescription:"取得したページの状態",snapshotLongDescription:"スナップショット レポートでは、特定の状態（通常はユーザー操作後）のページを分析できます。",snapshotReport:"スナップショット レポート",snapshotReportCount:"{numSnapshot,plural, =1{{numSnapshot} 件のスナップショット レポート}other{{numSnapshot} 件のスナップショット レポート}}",summary:"概要",timespanDescription:"ユーザー操作",timespanLongDescription:"期間レポートでは、任意の期間（ユーザーの操作が見込まれる期間など）を分析できます。",timespanReport:"期間レポート",timespanReportCount:"{numTimespan,plural, =1{{numTimespan} 件の期間レポート}other{{numTimespan} 件の期間レポート}}",title:"Lighthouse ユーザーフロー レポート"},ko:{allReports:"모든 보고서",categories:"카테고리",categoryAccessibility:"접근성",categoryBestPractices:"권장사항",categoryPerformance:"성능",categorySeo:"검색엔진 최적화",desktop:"데스크톱",helpDialogTitle:"Lighthouse 플로우 보고서 이해",helpLabel:"플로우 이해",helpUseCaseInstructionNavigation:"탐색 보고서 사용 용도…",helpUseCaseInstructionSnapshot:"스냅샷 보고서 사용 용도…",helpUseCaseInstructionTimespan:"기간 보고서 사용 용도…",helpUseCaseNavigation1:"Lighthouse 성능 점수를 받습니다.",helpUseCaseNavigation2:"최대 콘텐츠 렌더링 시간 및 속도 색인과 같은 페이지 로드 성능 측정항목을 측정합니다.",helpUseCaseNavigation3:"프로그레시브 웹 앱 기능을 평가합니다.",helpUseCaseSnapshot1:"단일 페이지 애플리케이션 또는 복잡한 양식에서 접근성 문제를 찾습니다.",helpUseCaseSnapshot2:"상호작용 뒤에 숨겨진 메뉴 및 UI 요소 관련 권장사항을 평가합니다.",helpUseCaseTimespan1:"일련의 상호작용에서 레이아웃 이동 및 자바스크립트 실행 시간을 측정합니다.",helpUseCaseTimespan2:"장기 지속되는 페이지 및 단일 페이지 애플리케이션 관련 경험을 개선할 수 있는 성능 기회를 탐색합니다.",highestImpact:"가장 큰 효과",informativeAuditCount:"{numInformative,plural, =1{정보 감사 {numInformative}개}other{정보 감사 {numInformative}개}}",mobile:"모바일",navigationDescription:"페이지 로드",navigationLongDescription:"탐색 보고서는 기존 Lighthouse 보고서와 완전히 동일하게 단일 페이지 로드를 분석합니다.",navigationReport:"탐색 보고서",navigationReportCount:"{numNavigation,plural, =1{탐색 보고서 {numNavigation}개}other{탐색 보고서 {numNavigation}개}}",passableAuditCount:"{numPassableAudits,plural, =1{통과 가능한 감사 {numPassableAudits}개}other{통과 가능한 감사 {numPassableAudits}개}}",passedAuditCount:"{numPassed,plural, =1{통과한 감사 {numPassed}개}other{통과한 감사 {numPassed}개}}",ratingAverage:"평균",ratingError:"오류",ratingFail:"나쁨",ratingPass:"좋음",save:"저장",snapshotDescription:"캡처된 페이지 상태",snapshotLongDescription:"스냅샷 보고서는 특정 상태의 페이지, 특히 사용자 상호작용 후 페이지를 분석합니다.",snapshotReport:"스냅샷 보고서",snapshotReportCount:"{numSnapshot,plural, =1{스냅샷 보고서 {numSnapshot}개}other{스냅샷 보고서 {numSnapshot}개}}",summary:"요약",timespanDescription:"사용자 상호작용",timespanLongDescription:"기간 보고서는 일반적으로 사용자 상호작용을 포함하는 임의 기간을 분석합니다.",timespanReport:"기간 보고서",timespanReportCount:"{numTimespan,plural, =1{기간 보고서 {numTimespan}개}other{기간 보고서 {numTimespan}개}}",title:"Lighthouse 사용자 플로우 보고서"},lt:{allReports:"Visos ataskaitos",categories:"Kategorijos",categoryAccessibility:"Pritaikomumas",categoryBestPractices:"Geriausios praktikos pavyzdžiai",categoryPerformance:"Našumas",categorySeo:"PVO",desktop:"Staliniams kompiuteriams",helpDialogTitle:"Apie „Lighthouse“ srauto ataskaitą",helpLabel:"Apie srautus",helpUseCaseInstructionNavigation:"Naudokite naršymo ataskaitas, kad galėtumėte…",helpUseCaseInstructionSnapshot:"Naudokite dienos apžvalgos ataskaitas, kad galėtumėte…",helpUseCaseInstructionTimespan:"Naudokite laikotarpio ataskaitas, kad galėtumėte…",helpUseCaseNavigation1:"Gauti „Lighthouse“ našumo balą.",helpUseCaseNavigation2:"Įvertinti puslapio įkėlimo našumo metriką, pavyzdžiui, didžiausio turiningo žymėjimo ir spartos rodiklio.",helpUseCaseNavigation3:"Įvertinti laipsniškųjų žiniatinklio programų galimybes.",helpUseCaseSnapshot1:"Aptikti pritaikomumo problemas atskiro puslapio programose ar sudėtingose formose.",helpUseCaseSnapshot2:"Įvertinti už sąveikų slypinčių meniu ir NS elementų geriausią praktiką.",helpUseCaseTimespan1:"Įvertinti išdėstymo poslinkius ir „JavaScript“ sąveikų serijų vykdymo laiką.",helpUseCaseTimespan2:"Atrasti našumo galimybes ir pagerinti ilgai veikiančių puslapių bei atskiro puslapio programų funkcijas.",highestImpact:"Svarbiausios",informativeAuditCount:"{numInformative,plural, =1{{numInformative} informatyvi patikra}one{{numInformative} informatyvi patikra}few{{numInformative} informatyvios patikros}many{{numInformative} informatyvios patikros}other{{numInformative} informatyvių patikrų}}",mobile:"Mobiliesiems",navigationDescription:"Puslapio įkėlimas",navigationLongDescription:"Naršymo ataskaitose analizuojamas kiekvienas puslapio įkėlimas, visiškai taip pat, kaip ir originaliose „Lighthouse“ ataskaitose.",navigationReport:"Naršymo ataskaita",navigationReportCount:"{numNavigation,plural, =1{{numNavigation} naršymo ataskaita}one{{numNavigation} naršymo ataskaita}few{{numNavigation} naršymo ataskaitos}many{{numNavigation} naršymo ataskaitos}other{{numNavigation} naršymo ataskaitų}}",passableAuditCount:"{numPassableAudits,plural, =1{{numPassableAudits} patikra, kuri gali būti atlikta sėkmingai}one{{numPassableAudits} patikra, kuri gali būti atlikta sėkmingai}few{{numPassableAudits} patikros, kurios gali būti atliktos sėkmingai}many{{numPassableAudits} patikros, kuri gali būti atlikta sėkmingai}other{{numPassableAudits} patikrų, kurios gali būti atliktos sėkmingai}}",passedAuditCount:"{numPassed,plural, =1{{numPassed} sėkmingai atlikta patikra}one{{numPassed} sėkmingai atlikta patikra}few{{numPassed} sėkmingai atliktos patikros}many{{numPassed} sėkmingos atliktos patikros}other{{numPassed} sėkmingai atliktų patikrų}}",ratingAverage:"Vidutiniška",ratingError:"Klaida",ratingFail:"Prasta",ratingPass:"Gera",save:"Išsaugoti",snapshotDescription:"Užfiksuota puslapio būsena",snapshotLongDescription:"Dienos apžvalgos ataskaitose analizuojamas tam tikros būsenos puslapis, paprastai po naudotojų sąveikų.",snapshotReport:"Momentinė ataskaita",snapshotReportCount:"{numSnapshot,plural, =1{{numSnapshot} konkretaus momento ataskaita}one{{numSnapshot} konkretaus momento ataskaita}few{{numSnapshot} konkretaus momento ataskaitos}many{{numSnapshot} konkretaus momento ataskaitos}other{{numSnapshot} konkretaus momento ataskaitų}}",summary:"Suvestinė",timespanDescription:"Naudotojo sąveikos",timespanLongDescription:"Laikotarpio ataskaitose analizuojamas tam tikras laikotarpis, paprastai tas, per kurį vyko sąveikų.",timespanReport:"Laikotarpio ataskaita",timespanReportCount:"{numTimespan,plural, =1{{numTimespan} laikotarpio ataskaita}one{{numTimespan} laikotarpio ataskaita}few{{numTimespan} laikotarpio ataskaitos}many{{numTimespan} laikotarpio ataskaitos}other{{numTimespan} laikotarpio ataskaitų}}",title:"„Lighthouse“ naudotojų srauto ataskaita"},lv:{allReports:"Visi pārskati",categories:"Kategorijas",categoryAccessibility:"Pieejamība",categoryBestPractices:"Paraugprakse",categoryPerformance:"Veiktspēja",categorySeo:"MPO",desktop:"Datoriem",helpDialogTitle:"Par Lighthouse plūsmas pārskatu",helpLabel:"Par plūsmām",helpUseCaseInstructionNavigation:"Izmantojiet navigācijas pārskatus, lai…",helpUseCaseInstructionSnapshot:"Izmantojiet momentuzņēmumu pārskatus, lai…",helpUseCaseInstructionTimespan:"Izmantojiet laika posma pārskatus, lai…",helpUseCaseNavigation1:"Iegūstiet Lighthouse veiktspējas rādītāju.",helpUseCaseNavigation2:"Nosakiet tādus lapas ielādes veiktspējas rādītājus kā Largest Contentful Paint un ātruma indekss.",helpUseCaseNavigation3:"Izvērtējiet progresīvo tīmekļa lietotņu iespējas.",helpUseCaseSnapshot1:"Atrodiet pieejamības problēmas vienas lapas lietojumprogrammās vai sarežģītās veidlapās.",helpUseCaseSnapshot2:"Izvērtējiet paraugprakses principus izvēlnēm un lietotāja saskarnes elementiem, kas atkarīgi no mijiedarbības.",helpUseCaseTimespan1:"Izmēriet izkārtojuma nobīdes un JavaScript izpildes laiku vairāku mijiedarbību virknei.",helpUseCaseTimespan2:"Atklājiet veiktspējas iespējas, lai uzlabotu pieredzi ilgi atvērtās lapās un vienas lapas lietojumprogrammās.",highestImpact:"Vislielākā ietekme",informativeAuditCount:"{numInformative,plural, =1{{numInformative} informatīva pārbaude}zero{{numInformative} informatīvu pārbaužu}one{{numInformative} informatīva pārbaude}other{{numInformative} informatīvas pārbaudes}}",mobile:"Mobilajām ierīcēm",navigationDescription:"Lapas ielāde",navigationLongDescription:"Navigācijas pārskatos tiek analizēta vienas lapas ielāde, tieši tāpat kā sākotnējos Lighthouse pārskatos.",navigationReport:"Navigācijas pārskats",navigationReportCount:"{numNavigation,plural, =1{{numNavigation} navigācijas pārskats}zero{{numNavigation} navigācijas pārskatu}one{{numNavigation} navigācijas pārskats}other{{numNavigation} navigācijas pārskati}}",passableAuditCount:"{numPassableAudits,plural, =1{{numPassableAudits} izpildāma pārbaude}zero{{numPassableAudits} izpildāmu pārbaužu}one{{numPassableAudits} izpildāma pārbaude}other{{numPassableAudits} izpildāmas pārbaudes}}",passedAuditCount:"{numPassed,plural, =1{Izpildīta {numPassed} pārbaude}zero{Izpildītas {numPassed} pārbaudes}one{Izpildīta {numPassed} pārbaude}other{Izpildītas {numPassed} pārbaudes}}",ratingAverage:"Viduvējs līmenis",ratingError:"Kļūda",ratingFail:"Vājš līmenis",ratingPass:"Labs līmenis",save:"Saglabāt",snapshotDescription:"Lapas tvertais statuss",snapshotLongDescription:"Momentuzņēmumu pārskatos tiek analizēts konkrēts lapas stāvoklis (parasti pēc lietotāju veiktas mijiedarbības).",snapshotReport:"Momentuzņēmuma pārskats",snapshotReportCount:"{numSnapshot,plural, =1{{numSnapshot} momentuzņēmuma pārskats}zero{{numSnapshot} momentuzņēmumu pārskatu}one{{numSnapshot} momentuzņēmumu pārskats}other{{numSnapshot} momentuzņēmumu pārskati}}",summary:"Kopsavilkums",timespanDescription:"Lietotāju mijiedarbība",timespanLongDescription:"Laika posma pārskatos tiek analizēti jebkādi laika periodi, kas parasti ietver lietotāja mijiedarbību.",timespanReport:"Laika posma pārskats",timespanReportCount:"{numTimespan,plural, =1{{numTimespan} laika posma pārskats}zero{{numTimespan} laika posmu pārskatu}one{{numTimespan} laika posmu pārskats}other{{numTimespan} laika posmu pārskati}}",title:"Lighthouse lietotāju plūsmas pārskats"},mo:{allReports:"Toate rapoartele",categories:"Categorii",categoryAccessibility:"Accesibilitate",categoryBestPractices:"Cele mai bune practici",categoryPerformance:"Performanță",categorySeo:"SEO",desktop:"Computer",helpDialogTitle:"Înțelegerea Raportului privind fluxul Lighthouse",helpLabel:"Înțelegerea fluxurilor",helpUseCaseInstructionNavigation:"Folosește Rapoartele privind navigarea pentru...",helpUseCaseInstructionSnapshot:"Folosește Rapoartele privind instantaneele pentru...",helpUseCaseInstructionTimespan:"Folosește Rapoartele privind perioada pentru...",helpUseCaseNavigation1:"Obține un scor de performanță pentru Lighthouse.",helpUseCaseNavigation2:"Măsoară valorile de performanță pentru încărcarea paginii, cum ar fi Largest Contentful Paint și indicele de viteză.",helpUseCaseNavigation3:"Evaluează funcțiile aplicațiilor web progresive.",helpUseCaseSnapshot1:"Identifică problemele legate de accesibilitate în aplicații cu o singură pagină sau formulare complexe.",helpUseCaseSnapshot2:"Evaluează recomandările pentru meniuri și elemente IU din spatele interacțiunilor.",helpUseCaseTimespan1:"Măsoară modificările de aspect și timpul de execuție JavaScript pentru o serie de interacțiuni.",helpUseCaseTimespan2:"Descoperă oportunități de performanță pentru a îmbunătăți experiența în paginile vechi și aplicațiile cu o singură pagină.",highestImpact:"Cel mai mare impact",informativeAuditCount:"{numInformative,plural, =1{{numInformative} verificare informativă}few{{numInformative} verificări informative}other{{numInformative} de verificări informative}}",mobile:"Mobil",navigationDescription:"Încărcarea paginii",navigationLongDescription:"Rapoartele privind navigarea analizează încărcarea unei singure pagini, exact ca rapoartele Lighthouse inițiale.",navigationReport:"Raport privind navigarea",navigationReportCount:"{numNavigation,plural, =1{{numNavigation} raport privind navigarea}few{{numNavigation} rapoarte privind navigarea}other{{numNavigation} de rapoarte privind navigarea}}",passableAuditCount:"{numPassableAudits,plural, =1{{numPassableAudits} verificare care poate reuși}few{{numPassableAudits} verificări care pot reuși}other{{numPassableAudits} de verificări care pot reuși}}",passedAuditCount:"{numPassed,plural, =1{{numPassed} verificare reușită}few{{numPassed} verificări reușite}other{{numPassed} de verificări reușite}}",ratingAverage:"Medie",ratingError:"Eroare",ratingFail:"Slabă",ratingPass:"Bună",save:"Salvează",snapshotDescription:"Starea înregistrată a paginii",snapshotLongDescription:"Rapoartele privind instantaneele analizează pagina într-o anumită stare, de obicei după interacțiunile cu utilizatorul.",snapshotReport:"Raport instantaneu",snapshotReportCount:"{numSnapshot,plural, =1{{numSnapshot} raport instantaneu}few{{numSnapshot} rapoarte instantanee}other{{numSnapshot} de rapoarte instantanee}}",summary:"Rezumat",timespanDescription:"Interacțiunile utilizatorilor",timespanLongDescription:"Rapoartele privind perioada analizează o perioadă arbitrară, care conține de obicei interacțiuni cu utilizatorul.",timespanReport:"Raport privind perioada de timp",timespanReportCount:"{numTimespan,plural, =1{{numTimespan} raport privind intervalul de timp}few{{numTimespan} rapoarte privind intervalul de timp}other{{numTimespan} de rapoarte privind intervalul de timp}}",title:"Raport privind fluxul pentru utilizatori Lighthouse"},nl:{allReports:"Alle rapporten",categories:"Categorieën",categoryAccessibility:"Toegankelijkheid",categoryBestPractices:"Praktische tips",categoryPerformance:"Prestaties",categorySeo:"SEO",desktop:"Desktop",helpDialogTitle:"Het rapport van de Lighthouse-stroom begrijpen",helpLabel:"Begrijpen hoe stromen werken",helpUseCaseInstructionNavigation:"Navigatierapporten gebruiken…",helpUseCaseInstructionSnapshot:"Momentopnamerapporten gebruiken…",helpUseCaseInstructionTimespan:"Tijdsduurrapporten gebruiken…",helpUseCaseNavigation1:"Lighthouse-prestatiescore ophalen.",helpUseCaseNavigation2:"Prestatiestatistieken voor het laden van de pagina meten, zoals de Grootste weergave met content (LCP) en de snelheidsindex.",helpUseCaseNavigation3:"Mogelijkheden van progressive web-apps evalueren.",helpUseCaseSnapshot1:"Toegankelijkheidsproblemen opsporen in apps met één pagina of in complexe formulieren.",helpUseCaseSnapshot2:"Praktische tips evalueren voor menu's en UI-elementen die achter interactie verborgen zijn.",helpUseCaseTimespan1:"Indelingsverschuivingen en de JavaScript-uitvoeringstijd meten voor verschillende interacties.",helpUseCaseTimespan2:"Ontdek mogelijkheden om de functionaliteit van langdurige pagina's en apps met één pagina te verbeteren.",highestImpact:"Hoogste impact",informativeAuditCount:"{numInformative,plural, =1{{numInformative} informatieve controle}other{{numInformative} informatieve controles}}",mobile:"Mobiel",navigationDescription:"Laden van pagina",navigationLongDescription:"In navigatierapporten wordt het laden van één pagina geanalyseerd, net als in de oorspronkelijke Lighthouse-rapporten.",navigationReport:"Navigatierapport",navigationReportCount:"{numNavigation,plural, =1{{numNavigation} navigatierapport}other{{numNavigation} navigatierapporten}}",passableAuditCount:"{numPassableAudits,plural, =1{{numPassableAudits} controle die kan worden doorstaan}other{{numPassableAudits} controles die kunnen worden doorstaan}}",passedAuditCount:"{numPassed,plural, =1{{numPassed} controle doorstaan}other{{numPassed} controles doorstaan}}",ratingAverage:"Gemiddeld",ratingError:"Fout",ratingFail:"Slecht",ratingPass:"Goed",save:"Opslaan",snapshotDescription:"Vastgelegde staat van pagina",snapshotLongDescription:"In momentopnamerapporten worden pagina's in een bepaalde situatie geanalyseerd, doorgaans na interactie van de gebruiker.",snapshotReport:"Momentopnamerapport",snapshotReportCount:"{numSnapshot,plural, =1{{numSnapshot} momentopnamerapport}other{{numSnapshot} momentopnamerapporten}}",summary:"Overzicht",timespanDescription:"Gebruikersinteracties",timespanLongDescription:"In tijdsduurrapporten wordt een bepaalde tijdsduur geanalyseerd die meestal gebruikersinteracties omvat.",timespanReport:"Perioderapport",timespanReportCount:"{numTimespan,plural, =1{{numTimespan} perioderapport}other{{numTimespan} perioderapporten}}",title:"Lighthouse-rapport over gebruikersstroom"},nb:{allReports:"Alle rapporter",categories:"Kategorier",categoryAccessibility:"Tilgjengelighet",categoryBestPractices:"Gode fremgangsmåter",categoryPerformance:"Resultater",categorySeo:"SEO",desktop:"Datamaskin",helpDialogTitle:"Forstå Lighthouse-flytrapporten",helpLabel:"Forstå flyter",helpUseCaseInstructionNavigation:"Bruk navigasjonsrapporter for å …",helpUseCaseInstructionSnapshot:"Bruk oversiktsrapporter for å …",helpUseCaseInstructionTimespan:"Bruk tidsromrapporter for å …",helpUseCaseNavigation1:"skaffe en Lighthouse-ytelsespoengsum",helpUseCaseNavigation2:"måle ytelsesverdier knyttet til sideinnlasting, for eksempel Største innholdsrike opptegning (LCP) og Hastighetsindeks",helpUseCaseNavigation3:"vurdere egenskapene til progressive nettprogrammer",helpUseCaseSnapshot1:"finne tilgjengelighetsproblemer i enkeltsideapper (SPA-er) og komplekse skjemaer",helpUseCaseSnapshot2:"evaluere anbefalte fremgangsmåter for menyer og elementer i brukergrensesnittet som er skjult bak interaksjon",helpUseCaseTimespan1:"måle utseendeforskyvninger og JavaScript-kjøretid for en interaksjonsserie",helpUseCaseTimespan2:"oppdage muligheter til å oppnå bedre ytelse og brukeropplevelse for sider og enkeltsideapper (SPA-er) med lang levetid",highestImpact:"Høyest effekt",informativeAuditCount:"{numInformative,plural, =1{{numInformative} informativ revisjon}other{{numInformative} informative revisjoner}}",mobile:"Mobil",navigationDescription:"Sideinnlasting",navigationLongDescription:"Navigasjonsrapporter analyserer en enkelt sideinnlasting, akkurat som de opprinnelige Lighthouse-rapportene.",navigationReport:"Navigasjonsrapport",navigationReportCount:"{numNavigation,plural, =1{{numNavigation} navigasjonsrapport}other{{numNavigation} navigasjonsrapporter}}",passableAuditCount:"{numPassableAudits,plural, =1{{numPassableAudits} revisjon som kan bestås}other{{numPassableAudits} revisjoner som kan bestås}}",passedAuditCount:"{numPassed,plural, =1{{numPassed} revisjon er bestått}other{{numPassed} revisjoner er bestått}}",ratingAverage:"Gjennomsnitt",ratingError:"Feil",ratingFail:"Dårlig",ratingPass:"God",save:"Lagre",snapshotDescription:"Registrert sidetilstand",snapshotLongDescription:"Oversiktsrapporter analyserer siden i bestemte tilstander, vanligvis etter brukerinteraksjoner.",snapshotReport:"Øyeblikksbilde-rapport",snapshotReportCount:"{numSnapshot,plural, =1{{numSnapshot} øyeblikksbilderapport}other{{numSnapshot} øyeblikksbilderapporter}}",summary:"Sammendrag",timespanDescription:"Brukerinteraksjoner",timespanLongDescription:"Tidsromrapporter analyserer en vilkårlig tidsperiode, vanligvis med brukerinteraksjoner.",timespanReport:"Tidsspennrapport",timespanReportCount:"{numTimespan,plural, =1{{numTimespan} tidsspennrapport}other{{numTimespan} tidsspennrapporter}}",title:"Lighthouse-rapport over brukerflyt"},no:{allReports:"Alle rapporter",categories:"Kategorier",categoryAccessibility:"Tilgjengelighet",categoryBestPractices:"Gode fremgangsmåter",categoryPerformance:"Resultater",categorySeo:"SEO",desktop:"Datamaskin",helpDialogTitle:"Forstå Lighthouse-flytrapporten",helpLabel:"Forstå flyter",helpUseCaseInstructionNavigation:"Bruk navigasjonsrapporter for å …",helpUseCaseInstructionSnapshot:"Bruk oversiktsrapporter for å …",helpUseCaseInstructionTimespan:"Bruk tidsromrapporter for å …",helpUseCaseNavigation1:"skaffe en Lighthouse-ytelsespoengsum",helpUseCaseNavigation2:"måle ytelsesverdier knyttet til sideinnlasting, for eksempel Største innholdsrike opptegning (LCP) og Hastighetsindeks",helpUseCaseNavigation3:"vurdere egenskapene til progressive nettprogrammer",helpUseCaseSnapshot1:"finne tilgjengelighetsproblemer i enkeltsideapper (SPA-er) og komplekse skjemaer",helpUseCaseSnapshot2:"evaluere anbefalte fremgangsmåter for menyer og elementer i brukergrensesnittet som er skjult bak interaksjon",helpUseCaseTimespan1:"måle utseendeforskyvninger og JavaScript-kjøretid for en interaksjonsserie",helpUseCaseTimespan2:"oppdage muligheter til å oppnå bedre ytelse og brukeropplevelse for sider og enkeltsideapper (SPA-er) med lang levetid",highestImpact:"Høyest effekt",informativeAuditCount:"{numInformative,plural, =1{{numInformative} informativ revisjon}other{{numInformative} informative revisjoner}}",mobile:"Mobil",navigationDescription:"Sideinnlasting",navigationLongDescription:"Navigasjonsrapporter analyserer en enkelt sideinnlasting, akkurat som de opprinnelige Lighthouse-rapportene.",navigationReport:"Navigasjonsrapport",navigationReportCount:"{numNavigation,plural, =1{{numNavigation} navigasjonsrapport}other{{numNavigation} navigasjonsrapporter}}",passableAuditCount:"{numPassableAudits,plural, =1{{numPassableAudits} revisjon som kan bestås}other{{numPassableAudits} revisjoner som kan bestås}}",passedAuditCount:"{numPassed,plural, =1{{numPassed} revisjon er bestått}other{{numPassed} revisjoner er bestått}}",ratingAverage:"Gjennomsnitt",ratingError:"Feil",ratingFail:"Dårlig",ratingPass:"God",save:"Lagre",snapshotDescription:"Registrert sidetilstand",snapshotLongDescription:"Oversiktsrapporter analyserer siden i bestemte tilstander, vanligvis etter brukerinteraksjoner.",snapshotReport:"Øyeblikksbilde-rapport",snapshotReportCount:"{numSnapshot,plural, =1{{numSnapshot} øyeblikksbilderapport}other{{numSnapshot} øyeblikksbilderapporter}}",summary:"Sammendrag",timespanDescription:"Brukerinteraksjoner",timespanLongDescription:"Tidsromrapporter analyserer en vilkårlig tidsperiode, vanligvis med brukerinteraksjoner.",timespanReport:"Tidsspennrapport",timespanReportCount:"{numTimespan,plural, =1{{numTimespan} tidsspennrapport}other{{numTimespan} tidsspennrapporter}}",title:"Lighthouse-rapport over brukerflyt"},pl:{allReports:"Wszystkie raporty",categories:"Kategorie",categoryAccessibility:"Ułatwienia dostępu",categoryBestPractices:"Sprawdzone metody",categoryPerformance:"Wydajność",categorySeo:"SEO",desktop:"Wersja komputerowa",helpDialogTitle:"Omówienie raportu dotyczącego procesu Lighthouse",helpLabel:"Omówienie procesów",helpUseCaseInstructionNavigation:"Używaj raportów dotyczących nawigacji do tych celów:",helpUseCaseInstructionSnapshot:"Używaj raportów dotyczących określonego momentu do tych celów:",helpUseCaseInstructionTimespan:"Używaj raportów dotyczących okresu do tych celów:",helpUseCaseNavigation1:"uzyskiwanie danych o wydajności Lighthouse",helpUseCaseNavigation2:"sprawdzanie parametrów szybkości ładowania strony, takich jak wyrenderowanie największej części treści czy indeks szybkości",helpUseCaseNavigation3:"ocena możliwości progresywnej aplikacji internetowej",helpUseCaseSnapshot1:"znajdowanie problemów dotyczących ułatwień dostępu w aplikacjach jednostronicowych lub złożonych formularzach",helpUseCaseSnapshot2:"ocena sprawdzonych metod dotyczących elementów menu i interfejsu ukrytych za interakcją",helpUseCaseTimespan1:"pomiar czasu wykonywania przesunięć układu i JavaScriptu w serii interakcji",helpUseCaseTimespan2:"odkrywanie możliwości poprawy wydajności w celu usprawnienia działania istniejących od dawna stron i aplikacji jednostronicowych",highestImpact:"Największy wpływ",informativeAuditCount:"{numInformative,plural, =1{{numInformative} audyt informacyjny}few{{numInformative} audyty informacyjne}many{{numInformative} audytów informacyjnych}other{{numInformative} audytu informacyjnego}}",mobile:"Wersja mobilna",navigationDescription:"Wczytywanie strony",navigationLongDescription:"Raporty dotyczące nawigacji analizują ładowanie pojedynczej strony – dokładnie tak jak oryginalne raporty Lighthouse.",navigationReport:"Raport dotyczący nawigacji",navigationReportCount:"{numNavigation,plural, =1{{numNavigation} raport dotyczący nawigacji}few{{numNavigation} raporty dotyczące nawigacji}many{{numNavigation} raportów dotyczących nawigacji}other{{numNavigation} raportu dotyczącego nawigacji}}",passableAuditCount:"{numPassableAudits,plural, =1{{numPassableAudits} audyt zadowalający}few{{numPassableAudits} audyty zadowalające}many{{numPassableAudits} audytów zadowalających}other{{numPassableAudits} audytu zadowalającego}}",passedAuditCount:"{numPassed,plural, =1{{numPassed} audyt zaliczony}few{{numPassed} audyty zaliczone}many{{numPassed} audytów zaliczonych}other{{numPassed} audytu zaliczone}}",ratingAverage:"Średnia",ratingError:"Błąd",ratingFail:"Słaba",ratingPass:"Dobra",save:"Zapisz",snapshotDescription:"Zarejestrowany stan strony",snapshotLongDescription:"Raporty dotyczące określonego momentu analizują strony w konkretnym stanie, zwykle po interakcji z użytkownikiem.",snapshotReport:"Raport dotyczący określonego momentu",snapshotReportCount:"{numSnapshot,plural, =1{{numSnapshot} raport dotyczący określonego momentu}few{{numSnapshot} raporty dotyczące określonego momentu}many{{numSnapshot} raportów dotyczących określonego momentu}other{{numSnapshot} raportu dotyczącego określonego momentu}}",summary:"Podsumowanie",timespanDescription:"Interakcje użytkownika",timespanLongDescription:"Raporty dotyczące okresu analizują dowolne okresy, zwykle obejmujące interakcje z użytkownikiem.",timespanReport:"Raport dotyczący okresu",timespanReportCount:"{numTimespan,plural, =1{{numTimespan} raport dotyczący okresu}few{{numTimespan} raporty dotyczące okresu}many{{numTimespan} raportów dotyczących okresu}other{{numTimespan} raportu dotyczącego okresu}}",title:"Raport Lighthouse dotyczący przepływu użytkowników"},pt:{allReports:"Todos os relatórios",categories:"Categorias",categoryAccessibility:"Acessibilidade",categoryBestPractices:"Práticas recomendadas",categoryPerformance:"Desempenho",categorySeo:"SEO",desktop:"Computador",helpDialogTitle:"Como o relatório de fluxos do Lighthouse funciona",helpLabel:"Como os fluxos funcionam",helpUseCaseInstructionNavigation:"Use os relatórios de navegação para...",helpUseCaseInstructionSnapshot:"Use os relatórios instantâneos para...",helpUseCaseInstructionTimespan:"Use os relatórios de período para...",helpUseCaseNavigation1:"Obter uma pontuação de desempenho do Lighthouse.",helpUseCaseNavigation2:"Medir o desempenho de carregamento de página, como, por exemplo, Maior exibição de conteúdo e Índice de velocidade.",helpUseCaseNavigation3:"Avaliar os recursos do App Web Progressivo.",helpUseCaseSnapshot1:"Localizar problemas de acessibilidade em aplicativos de página única ou formulários complexos.",helpUseCaseSnapshot2:"Avaliar práticas recomendadas de menus e elementos da interface ocultos nas interações.",helpUseCaseTimespan1:"Medir as mudanças de layout e o tempo de execução em JavaScript em uma série de interações.",helpUseCaseTimespan2:"Descobrir oportunidades de desempenho para melhorar a experiência de páginas de longa duração e aplicativos de página única.",highestImpact:"Maior impacto",informativeAuditCount:"{numInformative,plural, =1{{numInformative} auditoria informativa}one{{numInformative} auditoria informativa}other{{numInformative} auditorias informativas}}",mobile:"Dispositivo móvel",navigationDescription:"Carregamento de página",navigationLongDescription:"Os relatórios de navegação analisam o carregamento de uma única página, exatamente como os relatórios originais do Lighthouse.",navigationReport:"Relatório de navegação",navigationReportCount:"{numNavigation,plural, =1{{numNavigation} relatório de navegação}one{{numNavigation} relatório de navegação}other{{numNavigation} relatórios de navegação}}",passableAuditCount:"{numPassableAudits,plural, =1{{numPassableAudits} auditoria com possibilidade de aprovação}one{{numPassableAudits} auditoria com possibilidade de aprovação}other{{numPassableAudits} auditorias com possibilidade de aprovação}}",passedAuditCount:"{numPassed,plural, =1{{numPassed} auditoria aprovada}one{{numPassed} auditoria aprovada}other{{numPassed} auditorias aprovadas}}",ratingAverage:"Média",ratingError:"Erro",ratingFail:"Ruim",ratingPass:"Bom",save:"Salvar",snapshotDescription:"Estado capturado da página",snapshotLongDescription:"Os relatórios instantâneos analisam a página em um estado específico, normalmente após interações do usuário.",snapshotReport:"Relatório instantâneo",snapshotReportCount:"{numSnapshot,plural, =1{{numSnapshot} relatório de snapshot}one{{numSnapshot} relatório de snapshot}other{{numSnapshot} relatórios de snapshot}}",summary:"Resumo",timespanDescription:"Interações do usuário",timespanLongDescription:"Os relatórios de período analisam um período arbitrário de tempo, que normalmente contém interações do usuário.",timespanReport:"Relatório de período",timespanReportCount:"{numTimespan,plural, =1{{numTimespan} relatório de período}one{{numTimespan} relatório de período}other{{numTimespan} relatórios de período}}",title:"Relatório de fluxo de usuários do Lighthouse"},"pt-PT":{allReports:"Todos os relatórios",categories:"Categorias",categoryAccessibility:"Acessibilidade",categoryBestPractices:"Práticas recomendadas",categoryPerformance:"Desempenho",categorySeo:"SEO",desktop:"Computador",helpDialogTitle:"Compreender o relatório do fluxo do Lighthouse",helpLabel:"Compreender os fluxos",helpUseCaseInstructionNavigation:"Usar relatórios de navegação para…",helpUseCaseInstructionSnapshot:"Usar relatórios de resumo para…",helpUseCaseInstructionTimespan:"Usar relatórios de período para…",helpUseCaseNavigation1:"Obter uma pontuação de desempenho do Lighthouse.",helpUseCaseNavigation2:"Medir métricas de desempenho de carregamento de página como Maior preenchimento com conteúdo e Índice de velocidade.",helpUseCaseNavigation3:"Avaliar capacidades de apps Web progressivas.",helpUseCaseSnapshot1:"Detetar problemas de acessibilidade em aplicações de página única ou formulários complexos.",helpUseCaseSnapshot2:"Avaliar as práticas recomendadas de menus e elementos da UI ocultos atrás da interação.",helpUseCaseTimespan1:"Medir as mudanças de esquema e o tempo de execução de JavaScript numa série de interações.",helpUseCaseTimespan2:"Descobrir oportunidades de desempenho para melhorar a experiência de páginas de longa duração e aplicações de página única.",highestImpact:"Maior impacto",informativeAuditCount:"{numInformative,plural, =1{{numInformative} auditoria informativa}other{{numInformative} auditorias informativas}}",mobile:"Dispositivos móveis",navigationDescription:"Carregamento de página",navigationLongDescription:"Os relatórios de navegação analisam um carregamento de página único, exatamente como os relatórios originais do Lighthouse.",navigationReport:"Relatório de navegação",navigationReportCount:"{numNavigation,plural, =1{{numNavigation} relatório de navegação}other{{numNavigation} relatórios de navegação}}",passableAuditCount:"{numPassableAudits,plural, =1{{numPassableAudits} auditoria que pode ser aprovada}other{{numPassableAudits} auditorias que podem ser aprovadas}}",passedAuditCount:"{numPassed,plural, =1{{numPassed} auditoria aprovada}other{{numPassed} auditorias aprovadas}}",ratingAverage:"Média",ratingError:"Erro",ratingFail:"Fraca",ratingPass:"Boa",save:"Guardar",snapshotDescription:"Estado da página capturado",snapshotLongDescription:"Os relatórios de resumo analisam a página num estado específico, normalmente após interações do utilizador.",snapshotReport:"Relatório de resumo",snapshotReportCount:"{numSnapshot,plural, =1{{numSnapshot} relatório de resumo}other{{numSnapshot} relatórios de resumo}}",summary:"Resumo",timespanDescription:"Interações do utilizador",timespanLongDescription:"Os relatórios de período analisam um período arbitrário que, normalmente, contém interações do utilizador.",timespanReport:"Relatório de período",timespanReportCount:"{numTimespan,plural, =1{{numTimespan} relatório de período}other{{numTimespan} relatórios de período}}",title:"Relatório do fluxo do utilizador do Lighthouse"},ro:{allReports:"Toate rapoartele",categories:"Categorii",categoryAccessibility:"Accesibilitate",categoryBestPractices:"Cele mai bune practici",categoryPerformance:"Performanță",categorySeo:"SEO",desktop:"Computer",helpDialogTitle:"Înțelegerea Raportului privind fluxul Lighthouse",helpLabel:"Înțelegerea fluxurilor",helpUseCaseInstructionNavigation:"Folosește Rapoartele privind navigarea pentru...",helpUseCaseInstructionSnapshot:"Folosește Rapoartele privind instantaneele pentru...",helpUseCaseInstructionTimespan:"Folosește Rapoartele privind perioada pentru...",helpUseCaseNavigation1:"Obține un scor de performanță pentru Lighthouse.",helpUseCaseNavigation2:"Măsoară valorile de performanță pentru încărcarea paginii, cum ar fi Largest Contentful Paint și indicele de viteză.",helpUseCaseNavigation3:"Evaluează funcțiile aplicațiilor web progresive.",helpUseCaseSnapshot1:"Identifică problemele legate de accesibilitate în aplicații cu o singură pagină sau formulare complexe.",helpUseCaseSnapshot2:"Evaluează recomandările pentru meniuri și elemente IU din spatele interacțiunilor.",helpUseCaseTimespan1:"Măsoară modificările de aspect și timpul de execuție JavaScript pentru o serie de interacțiuni.",helpUseCaseTimespan2:"Descoperă oportunități de performanță pentru a îmbunătăți experiența în paginile vechi și aplicațiile cu o singură pagină.",highestImpact:"Cel mai mare impact",informativeAuditCount:"{numInformative,plural, =1{{numInformative} verificare informativă}few{{numInformative} verificări informative}other{{numInformative} de verificări informative}}",mobile:"Mobil",navigationDescription:"Încărcarea paginii",navigationLongDescription:"Rapoartele privind navigarea analizează încărcarea unei singure pagini, exact ca rapoartele Lighthouse inițiale.",navigationReport:"Raport privind navigarea",navigationReportCount:"{numNavigation,plural, =1{{numNavigation} raport privind navigarea}few{{numNavigation} rapoarte privind navigarea}other{{numNavigation} de rapoarte privind navigarea}}",passableAuditCount:"{numPassableAudits,plural, =1{{numPassableAudits} verificare care poate reuși}few{{numPassableAudits} verificări care pot reuși}other{{numPassableAudits} de verificări care pot reuși}}",passedAuditCount:"{numPassed,plural, =1{{numPassed} verificare reușită}few{{numPassed} verificări reușite}other{{numPassed} de verificări reușite}}",ratingAverage:"Medie",ratingError:"Eroare",ratingFail:"Slabă",ratingPass:"Bună",save:"Salvează",snapshotDescription:"Starea înregistrată a paginii",snapshotLongDescription:"Rapoartele privind instantaneele analizează pagina într-o anumită stare, de obicei după interacțiunile cu utilizatorul.",snapshotReport:"Raport instantaneu",snapshotReportCount:"{numSnapshot,plural, =1{{numSnapshot} raport instantaneu}few{{numSnapshot} rapoarte instantanee}other{{numSnapshot} de rapoarte instantanee}}",summary:"Rezumat",timespanDescription:"Interacțiunile utilizatorilor",timespanLongDescription:"Rapoartele privind perioada analizează o perioadă arbitrară, care conține de obicei interacțiuni cu utilizatorul.",timespanReport:"Raport privind perioada de timp",timespanReportCount:"{numTimespan,plural, =1{{numTimespan} raport privind intervalul de timp}few{{numTimespan} rapoarte privind intervalul de timp}other{{numTimespan} de rapoarte privind intervalul de timp}}",title:"Raport privind fluxul pentru utilizatori Lighthouse"},ru:{allReports:"Все отчеты",categories:"Категории",categoryAccessibility:"Специальные возможности",categoryBestPractices:"Рекомендации",categoryPerformance:"Производительность",categorySeo:"Поисковая оптимизация",desktop:"Версия для компьютера",helpDialogTitle:"Интерпретация отчета Lighthouse о пути пользователя",helpLabel:"Узнать о путях",helpUseCaseInstructionNavigation:"Использовать отчеты о навигации, чтобы…",helpUseCaseInstructionSnapshot:"Использовать отчеты о состоянии страницы на определенный момент времени, чтобы…",helpUseCaseInstructionTimespan:"Использовать отчеты об анализе временного диапазона, чтобы…",helpUseCaseNavigation1:"Получить показатель производительности Lighthouse.",helpUseCaseNavigation2:"Измерить показатели загрузки страницы, например время отрисовки самого крупного контента и индекс скорости загрузки.",helpUseCaseNavigation3:"Оценить возможности современного веб-приложения.",helpUseCaseSnapshot1:"Обнаружить проблемы доступности в одностраничных приложениях и сложных формах.",helpUseCaseSnapshot2:"Оценить рекомендации в отношении меню и элементов интерфейса, участвующих во взаимодействии.",helpUseCaseTimespan1:"Измерить смещения макета и время выполнения JavaScript в ходе серии взаимодействий.",helpUseCaseTimespan2:"Узнать возможности для улучшения взаимодействия со страницами, которые используются в течение длительного времени, и одностраничными приложениями.",highestImpact:"С наибольшим влиянием",informativeAuditCount:"{numInformative,plural, =1{{numInformative} информационная проверка}one{{numInformative} информационная проверка}few{{numInformative} информационные проверки}many{{numInformative} информационных проверок}other{{numInformative} информационной проверки}}",mobile:"Мобильная версия",navigationDescription:"Загрузка страницы",navigationLongDescription:"В отчетах о навигации представлен анализ загрузки одной страницы, в точности как в исходных отчетах Lighthouse.",navigationReport:"Отчет о навигации",navigationReportCount:"{numNavigation,plural, =1{{numNavigation} отчет о переходе на страницу}one{{numNavigation} отчет о переходе на страницу}few{{numNavigation} отчета о переходе на страницу}many{{numNavigation} отчетов о переходе на страницу}other{{numNavigation} отчета о переходе на страницу}}",passableAuditCount:"{numPassableAudits,plural, =1{Можно пройти {numPassableAudits} проверку}one{Можно пройти {numPassableAudits} проверку}few{Можно пройти {numPassableAudits} проверки}many{Можно пройти {numPassableAudits} проверок}other{Можно пройти {numPassableAudits} проверки}}",passedAuditCount:"{numPassed,plural, =1{Пройдена {numPassed} проверка}one{Пройдена {numPassed} проверка}few{Пройдено {numPassed} проверки}many{Пройдено {numPassed} проверок}other{Пройдено {numPassed} проверки}}",ratingAverage:"Средне",ratingError:"Ошибка",ratingFail:"Плохо",ratingPass:"Хорошо",save:"Сохранить",snapshotDescription:"Зарегистрированное состояние страницы",snapshotLongDescription:"В отчетах о состоянии страницы на определенный момент времени представлен анализ конкретного состояния страницы (обычно после взаимодействия с пользователем).",snapshotReport:"Отчет о состоянии страницы на определенный момент времени",snapshotReportCount:"{numSnapshot,plural, =1{{numSnapshot} отчет о состоянии страницы на определенный момент времени}one{{numSnapshot} отчет о состоянии страницы на определенный момент времени}few{{numSnapshot} отчета о состоянии страницы на определенный момент времени}many{{numSnapshot} отчетов о состоянии страницы на определенный момент времени}other{{numSnapshot} отчета о состоянии страницы на определенный момент времени}}",summary:"Сводка",timespanDescription:"Взаимодействие пользователя",timespanLongDescription:"В отчетах об анализе временного диапазона приводятся данные за произвольный период, чаще всего о взаимодействии пользователя со страницей.",timespanReport:"Отчет об анализе временного диапазона",timespanReportCount:"{numTimespan,plural, =1{{numTimespan} отчет об анализе временного диапазона}one{{numTimespan} отчет об анализе временного диапазона}few{{numTimespan} отчета об анализе временного диапазона}many{{numTimespan} отчетов об анализе временного диапазона}other{{numTimespan} отчета об анализе временного диапазона}}",title:"Отчет Lighthouse о пути пользователя"},sk:{allReports:"Všetky prehľady",categories:"Kategórie",categoryAccessibility:"Dostupnosť",categoryBestPractices:"Osvedčené postupy",categoryPerformance:"Výkonnosť",categorySeo:"SEO",desktop:"Počítač",helpDialogTitle:"Vysvetlenie prehľadu cesty používateľov v službe Lighthouse",helpLabel:"Vysvetlenie cesty používateľov",helpUseCaseInstructionNavigation:"Pomocou prehľadov navigácie môžete...",helpUseCaseInstructionSnapshot:"Pomocou prehľadov stavu môžete…",helpUseCaseInstructionTimespan:"Pomocou prehľadov časového rozsahu môžete...",helpUseCaseNavigation1:"Získať skóre výkonnosti v nástroji Lighthouse",helpUseCaseNavigation2:"Merať metriky výkonnosti načítania stránok, ako sú vykreslenie najväčšieho obsahu a index rýchlosti.",helpUseCaseNavigation3:"Získať prístup k možnostiam progresívnych webových aplikácií.",helpUseCaseSnapshot1:"Nájsť problémy s dostupnosťou v jednostránkových aplikáciách alebo zložitých formulároch.",helpUseCaseSnapshot2:"Ohodnotiť osvedčené postupy ponúk a prvkov používateľského rozhrania skrytých za interakciou.",helpUseCaseTimespan1:"Merať posuny rozloženia a čas spustenia kódu JavaScript v rámci radu interakcií.",helpUseCaseTimespan2:"Objaviť príležitosti na zvýšenie výkonnosti s cieľom zlepšiť prostredie dlhodobých stránok a jednostránkových aplikácií.",highestImpact:"Najvyšší vplyv",informativeAuditCount:"{numInformative,plural, =1{{numInformative} informatívna kontrola}few{{numInformative} informatívne kontroly}many{{numInformative} informative audits}other{{numInformative} informatívnych kontrol}}",mobile:"Mobilná verzia",navigationDescription:"Načítanie stránky",navigationLongDescription:"Prehľady navigácie analyzujú jedno načítanie stránky rovnako ako pôvodné prehľady nástroja Lighthouse.",navigationReport:"Prehľad navigácie",navigationReportCount:"{numNavigation,plural, =1{{numNavigation} prehľad navigácie}few{{numNavigation} prehľady navigácie}many{{numNavigation} navigation reports}other{{numNavigation} prehľadov navigácie}}",passableAuditCount:"{numPassableAudits,plural, =1{{numPassableAudits} kontrola, ktorá môže byť úspešná}few{{numPassableAudits} kontroly, ktoré môžu byť úspešné}many{{numPassableAudits} passable audits}other{{numPassableAudits} kontrol, ktoré môže byť úspešné}}",passedAuditCount:"{numPassed,plural, =1{{numPassed} úspešná kontrola}few{{numPassed} úspešné kontroly}many{{numPassed} audits passed}other{{numPassed} úspešných kontrol}}",ratingAverage:"Priemer",ratingError:"Chyba",ratingFail:"Slabé",ratingPass:"Dobré",save:"Uložiť",snapshotDescription:"Zachytený stav stránky",snapshotLongDescription:"Prehľady stavu analyzujú stránku v konkrétnom stave, zvyčajne po interakciách používateľov.",snapshotReport:"Prehľad stavu",snapshotReportCount:"{numSnapshot,plural, =1{{numSnapshot} prehľad stavu}few{{numSnapshot} prehľady stavu}many{{numSnapshot} snapshot reports}other{{numSnapshot} prehľadov stavu}}",summary:"Súhrn",timespanDescription:"Interakcie používateľov",timespanLongDescription:"Prehľady časového rozsahu analyzujú ľubovoľné obdobie zvyčajne obsahujúce interakcie používateľov.",timespanReport:"Prehľad časového rozsahu",timespanReportCount:"{numTimespan,plural, =1{{numTimespan} prehľad časového rozsahu}few{{numTimespan} prehľady časového rozsahu}many{{numTimespan} timespan reports}other{{numTimespan} prehľadov časového rozsahu}}",title:"Prehľad cesty používateľov v službe Lighthouse"},sl:{allReports:"Vsa poročila",categories:"Kategorije",categoryAccessibility:"Dostopnost",categoryBestPractices:"Najboljši postopki",categoryPerformance:"Delovanje",categorySeo:"SEO",desktop:"Namizna različica",helpDialogTitle:"Razumevanje poročila o toku orodja Lighthouse",helpLabel:"Razumevanje tokov",helpUseCaseInstructionNavigation:"Uporaba poročil o pomikanju za …",helpUseCaseInstructionSnapshot:"Uporaba poročil o povzetku za …",helpUseCaseInstructionTimespan:"Uporaba poročil o časovnem obdobju za …",helpUseCaseNavigation1:"Pridobivanje rezultata uspešnosti orodja Lighthouse.",helpUseCaseNavigation2:"Izvajanje meritev uspešnosti nalaganja strani, kot sta največji vsebinski izris in indeks hitrosti.",helpUseCaseNavigation3:"Ocenjevanje zmožnosti modernih spletnih aplikacij.",helpUseCaseSnapshot1:"Iskanje težav z dostopnostjo v enostranskih aplikacijah ali kompleksnih obrazcih.",helpUseCaseSnapshot2:"Ovrednotenje najboljših postopkov menijev in elementov uporabniškega vmesnika, skritimi za interakcijo.",helpUseCaseTimespan1:"Merjenje pomikov postavitev in časa izvajanja JavaScripta v seriji interakcij.",helpUseCaseTimespan2:"Odkrivanje priložnosti za uspešnost zaradi izboljšanja izkušnje pri dolgotrajnih straneh in enostranskih aplikacijah.",highestImpact:"Največji vpliv",informativeAuditCount:"{numInformative,plural, =1{{numInformative} informativna revizija}one{{numInformative} informativna revizija}two{{numInformative} informativni reviziji}few{{numInformative} informativne revizije}other{{numInformative} informativnih revizij}}",mobile:"Mobilna različica",navigationDescription:"Nalaganje strani",navigationLongDescription:"Poročila o pomikanju analizirajo nalaganje ene strani, enako kot izvirna poročila orodja Lighthouse.",navigationReport:"Poročilo o pomikanju",navigationReportCount:"{numNavigation,plural, =1{{numNavigation} poročilo o premikanju}one{{numNavigation} poročilo o premikanju}two{{numNavigation} poročili o premikanju}few{{numNavigation} poročila o premikanju}other{{numNavigation} poročil o premikanju}}",passableAuditCount:"{numPassableAudits,plural, =1{{numPassableAudits} morebitno uspešna revizija}one{{numPassableAudits} morebitno uspešna revizija}two{{numPassableAudits} morebitno uspešni reviziji}few{{numPassableAudits} morebitno uspešne revizije}other{{numPassableAudits} morebitno uspešnih revizij}}",passedAuditCount:"{numPassed,plural, =1{Uspešno je bila opravljena {numPassed} revizija}one{Uspešno je bila opravljena {numPassed} revizija}two{Uspešno sta bili opravljeni {numPassed} reviziji}few{Uspešno so bile opravljene {numPassed} revizije}other{Uspešno je bilo opravljenih {numPassed} revizij}}",ratingAverage:"Povprečno",ratingError:"Napaka",ratingFail:"Šibko",ratingPass:"Dobro",save:"Shrani",snapshotDescription:"Zajeto stanje strani",snapshotLongDescription:"Poročila o povzetku analizirajo stran v določenem stanju, običajno po uporabniških interakcijah.",snapshotReport:"Poročilo o povzetku",snapshotReportCount:"{numSnapshot,plural, =1{{numSnapshot} poročilo o povzetku}one{{numSnapshot} poročilo o povzetku}two{{numSnapshot} poročili o povzetku}few{{numSnapshot} poročila o povzetku}other{{numSnapshot} poročil o povzetku}}",summary:"Povzetek",timespanDescription:"Uporabniške interakcije",timespanLongDescription:"Poročila o časovnem obdobju analizirajo poljubno časovno obdobje, ki običajno vsebuje uporabniške interakcije.",timespanReport:"Poročilo o časovnem obdobju",timespanReportCount:"{numTimespan,plural, =1{{numTimespan} poročilo o časovnem razponu}one{{numTimespan} poročilo o časovnem razponu}two{{numTimespan} poročili o časovnem razponu}few{{numTimespan} poročila o časovnem razponu}other{{numTimespan} poročil o časovnem razponu}}",title:"Poročilo o toku uporabnikov orodja Lighthouse"},sr:{allReports:"Сви извештаји",categories:"Категорије",categoryAccessibility:"Приступачност",categoryBestPractices:"Најбоље праксе",categoryPerformance:"Учинак",categorySeo:"Оптимизација за претраживаче",desktop:"Рачунар",helpDialogTitle:"Разумевање извештаја о току за Lighthouse",helpLabel:"Разумевање токова",helpUseCaseInstructionNavigation:"Користите извештаје о навигацији за...",helpUseCaseInstructionSnapshot:"Користите извештаје са прегледом за...",helpUseCaseInstructionTimespan:"Користите извештаје за период за...",helpUseCaseNavigation1:"Преузмите Lighthouse оцену учинка.",helpUseCaseNavigation2:"Измерите показатеље учинка за учитавање странице, као што су највеће приказивање садржаја и индекс брзине.",helpUseCaseNavigation3:"Приступите могућностима прогресивних веб-апликација.",helpUseCaseSnapshot1:"Пронађите проблеме са приступачношћу у апликацијама са једном страницом или комплексним формама.",helpUseCaseSnapshot2:"Процените најбоље праксе за меније и елементе корисничког интерфејса сакривене иза интеракције.",helpUseCaseTimespan1:"Измерите време извршавања прелаза изгледа и JavaScript-а за серију интеракција.",helpUseCaseTimespan2:"Откријте прилике за учинак да бисте побољшали доживљај за дугорочне странице и апликације са једном страницом.",highestImpact:"Највећи утицај",informativeAuditCount:"{numInformative,plural, =1{{numInformative} информативна провера}one{{numInformative} информативна провера}few{{numInformative} информативне провере}other{{numInformative} информативних провера}}",mobile:"Мобилни уређај",navigationDescription:"Учитавање странице",navigationLongDescription:"Извештаји о навигацији анализирају учитавање појединачне странице, потпуно исто као оригинални Lighthouse извештаји.",navigationReport:"Извештај о навигацији",navigationReportCount:"{numNavigation,plural, =1{{numNavigation} извештај о навигацији}one{{numNavigation} извештај о навигацији}few{{numNavigation} извештаја о навигацији}other{{numNavigation} извештаја о навигацији}}",passableAuditCount:"{numPassableAudits,plural, =1{{numPassableAudits} провера која може да се прође}one{{numPassableAudits} провера која може да се прође}few{{numPassableAudits} провере које могу да се прођу}other{{numPassableAudits} провера које могу да се прођу}}",passedAuditCount:"{numPassed,plural, =1{Прошли сте {numPassed} проверу}one{Прошли сте{numPassed} проверу}few{Прошли сте{numPassed} провере}other{Прошли сте{numPassed} провера}}",ratingAverage:"Просек",ratingError:"Грешка",ratingFail:"Слабо",ratingPass:"Добро",save:"Сачувај",snapshotDescription:"Снимљено стање странице",snapshotLongDescription:"Извештаји са прегледом анализирају страницу у посебном стању, обично после интеракције са корисницима.",snapshotReport:"Извештај са прегледом",snapshotReportCount:"{numSnapshot,plural, =1{{numSnapshot} извештај са прегледом}one{{numSnapshot} извештај са прегледом}few{{numSnapshot} извештаја са прегледом}other{{numSnapshot} извештаја са прегледом}}",summary:"Резиме",timespanDescription:"Корисничке интеракције",timespanLongDescription:"Извештаји за период анализирају насумични период, који обично садржи интеракције корисника.",timespanReport:"Извештај за период",timespanReportCount:"{numTimespan,plural, =1{{numTimespan} извештај за период}one{{numTimespan} извештај за период}few{{numTimespan} извештаја за период}other{{numTimespan} извештаја за период}}",title:"Извештај о корисничком току за Lighthouse"},"sr-Latn":{allReports:"Svi izveštaji",categories:"Kategorije",categoryAccessibility:"Pristupačnost",categoryBestPractices:"Najbolje prakse",categoryPerformance:"Učinak",categorySeo:"Optimizacija za pretraživače",desktop:"Računar",helpDialogTitle:"Razumevanje izveštaja o toku za Lighthouse",helpLabel:"Razumevanje tokova",helpUseCaseInstructionNavigation:"Koristite izveštaje o navigaciji za...",helpUseCaseInstructionSnapshot:"Koristite izveštaje sa pregledom za...",helpUseCaseInstructionTimespan:"Koristite izveštaje za period za...",helpUseCaseNavigation1:"Preuzmite Lighthouse ocenu učinka.",helpUseCaseNavigation2:"Izmerite pokazatelje učinka za učitavanje stranice, kao što su najveće prikazivanje sadržaja i indeks brzine.",helpUseCaseNavigation3:"Pristupite mogućnostima progresivnih veb-aplikacija.",helpUseCaseSnapshot1:"Pronađite probleme sa pristupačnošću u aplikacijama sa jednom stranicom ili kompleksnim formama.",helpUseCaseSnapshot2:"Procenite najbolje prakse za menije i elemente korisničkog interfejsa sakrivene iza interakcije.",helpUseCaseTimespan1:"Izmerite vreme izvršavanja prelaza izgleda i JavaScript-a za seriju interakcija.",helpUseCaseTimespan2:"Otkrijte prilike za učinak da biste poboljšali doživljaj za dugoročne stranice i aplikacije sa jednom stranicom.",highestImpact:"Najveći uticaj",informativeAuditCount:"{numInformative,plural, =1{{numInformative} informativna provera}one{{numInformative} informativna provera}few{{numInformative} informativne provere}other{{numInformative} informativnih provera}}",mobile:"Mobilni uređaj",navigationDescription:"Učitavanje stranice",navigationLongDescription:"Izveštaji o navigaciji analiziraju učitavanje pojedinačne stranice, potpuno isto kao originalni Lighthouse izveštaji.",navigationReport:"Izveštaj o navigaciji",navigationReportCount:"{numNavigation,plural, =1{{numNavigation} izveštaj o navigaciji}one{{numNavigation} izveštaj o navigaciji}few{{numNavigation} izveštaja o navigaciji}other{{numNavigation} izveštaja o navigaciji}}",passableAuditCount:"{numPassableAudits,plural, =1{{numPassableAudits} provera koja može da se prođe}one{{numPassableAudits} provera koja može da se prođe}few{{numPassableAudits} provere koje mogu da se prođu}other{{numPassableAudits} provera koje mogu da se prođu}}",passedAuditCount:"{numPassed,plural, =1{Prošli ste {numPassed} proveru}one{Prošli ste{numPassed} proveru}few{Prošli ste{numPassed} provere}other{Prošli ste{numPassed} provera}}",ratingAverage:"Prosek",ratingError:"Greška",ratingFail:"Slabo",ratingPass:"Dobro",save:"Sačuvaj",snapshotDescription:"Snimljeno stanje stranice",snapshotLongDescription:"Izveštaji sa pregledom analiziraju stranicu u posebnom stanju, obično posle interakcije sa korisnicima.",snapshotReport:"Izveštaj sa pregledom",snapshotReportCount:"{numSnapshot,plural, =1{{numSnapshot} izveštaj sa pregledom}one{{numSnapshot} izveštaj sa pregledom}few{{numSnapshot} izveštaja sa pregledom}other{{numSnapshot} izveštaja sa pregledom}}",summary:"Rezime",timespanDescription:"Korisničke interakcije",timespanLongDescription:"Izveštaji za period analiziraju nasumični period, koji obično sadrži interakcije korisnika.",timespanReport:"Izveštaj za period",timespanReportCount:"{numTimespan,plural, =1{{numTimespan} izveštaj za period}one{{numTimespan} izveštaj za period}few{{numTimespan} izveštaja za period}other{{numTimespan} izveštaja za period}}",title:"Izveštaj o korisničkom toku za Lighthouse"},sv:{allReports:"Alla rapporter",categories:"Kategorier",categoryAccessibility:"Tillgänglighet",categoryBestPractices:"Bästa metoder",categoryPerformance:"Prestanda",categorySeo:"SEO",desktop:"Dator",helpDialogTitle:"Information om rapporten över flöde i Lighthouse",helpLabel:"Information om flöden",helpUseCaseInstructionNavigation:"Du kan använda rapporter över navigering till följande:",helpUseCaseInstructionSnapshot:"Du kan använda rapporter med ögonblicksbilder till följande:",helpUseCaseInstructionTimespan:"Du kan använda rapporter över tidsperiod till följande:",helpUseCaseNavigation1:"Hämta ett prestandavärde för Lighthouse.",helpUseCaseNavigation2:"Mät resultatmätvärden för sidhämtningar, t.ex. Största uppritningen av innehåll och hastighetsindex.",helpUseCaseNavigation3:"Testa funktioner för progressiva webbappar.",helpUseCaseSnapshot1:"Hitta tillgänglighetsproblem i appar för en sida eller komplexa formulär.",helpUseCaseSnapshot2:"Utvärdera rekommenderade metoder för menyer och UI-element som döljs bakom interaktioner.",helpUseCaseTimespan1:"Mäta layoutförskjutningar och körningstider för JavaScript i en serie interaktioner.",helpUseCaseTimespan2:"Upptäck prestandamöjligheter och förbättra upplevelsen på långlivade sidor och appar för en sida.",highestImpact:"Störst effekt",informativeAuditCount:"{numInformative,plural, =1{{numInformative} informativ granskning}other{{numInformative} informativa granskningar}}",mobile:"Mobil",navigationDescription:"Sidhämtning",navigationLongDescription:"Med rapporter över navigering kan du analysera en enskild sidhämtning, precis som med de ursprungliga Lighthouse-rapporterna.",navigationReport:"Rapport över navigering",navigationReportCount:"{numNavigation,plural, =1{{numNavigation} rapport över navigering}other{{numNavigation} rapporter över navigering}}",passableAuditCount:"{numPassableAudits,plural, =1{{numPassableAudits} granskning som kan godkännas}other{{numPassableAudits} granskningar som kan godkännas}}",passedAuditCount:"{numPassed,plural, =1{{numPassed} godkänd granskning}other{{numPassed} godkända granskningar}}",ratingAverage:"Genomsnittlig",ratingError:"Fel",ratingFail:"Dålig",ratingPass:"Bra",save:"Spara",snapshotDescription:"Sidans status vid en viss tidpunkt",snapshotLongDescription:"Med rapporter med ögonblicksbilder går det att analysera en sida i ett visst läge, vanligtvis efter interaktioner från användare.",snapshotReport:"Rapport med ögonblicksbild",snapshotReportCount:"{numSnapshot,plural, =1{{numSnapshot} rapport över översiktsbild}other{{numSnapshot} rapporter över översiktsbilder}}",summary:"Översikt",timespanDescription:"Användarinteraktioner",timespanLongDescription:"Med rapporter över tidsintervall kan du analysera en slumpmässig tidsperiod som oftast innehåller användarinteraktioner.",timespanReport:"Rapport över tidsperiod",timespanReportCount:"{numTimespan,plural, =1{{numTimespan} rapport över tidsintervall}other{{numTimespan} rapporter över tidsintervaller}}",title:"Rapport över användarflöde i Lighthouse"},ta:{allReports:"அனைத்து அறிக்கைகளும்",categories:"வகைகள்",categoryAccessibility:"மாற்றுத்திறன் வசதி",categoryBestPractices:"சிறந்த நடைமுறைகள்",categoryPerformance:"இணையச் செயல்திறன்",categorySeo:"SEO",desktop:"டெஸ்க்டாப்",helpDialogTitle:"Lighthouse செயல்முறை அறிக்கையை அறிந்துகொள்ளுதல்",helpLabel:"செயல்முறைகளை அறிந்துகொள்க",helpUseCaseInstructionNavigation:"வழிசெலுத்துதல் குறித்த அறிக்கைகளை இவற்றுக்குப் பயன்படுத்து...",helpUseCaseInstructionSnapshot:"ஸ்னாப்ஷாட் குறித்த அறிக்கைகளை இவற்றுக்குப் பயன்படுத்து...",helpUseCaseInstructionTimespan:"கால அளவு குறித்த அறிக்கைகளை இவற்றுக்குப் பயன்படுத்து...",helpUseCaseNavigation1:"Lighthouseஸின் செயல்திறன் ஸ்கோரைப் பெறுதல்.",helpUseCaseNavigation2:"பெரிய பகுதியைக் காண்பிக்கும் நேரம், ஸ்பீடு இண்டெக்ஸ் போன்ற ‘பக்க ஏற்றச் செயல்திறன் அளவீடுகளை’ அளவிடுதல்.",helpUseCaseNavigation3:"மேம்பட்ட இணைய ஆப்ஸின் திறன்களை மதிப்பாய்வு செய்தல்.",helpUseCaseSnapshot1:"ஒற்றைப் பக்க ஆப்ஸ், சிக்கலான படிவங்கள் போன்றவற்றில் உள்ள அணுகல்தன்மைச் சிக்கல்களைக் கண்டறிதல்.",helpUseCaseSnapshot2:"செயல்பாட்டிற்குப் பின்னால் மறைக்கப்பட்டுள்ள மெனுக்கள், UI உறுப்புகள் ஆகியவற்றின் சிறந்த நடைமுறைகளை மதிப்பாய்வு செய்தல்.",helpUseCaseTimespan1:"தொடர் செயல்பாடுகளில் தளவமைப்பு மாற்றங்கள், JavaScript செயல்பாட்டு நேரம் ஆகியவற்றை அளவிடுதல்.",helpUseCaseTimespan2:"நீண்ட நேரம் திறந்திருக்கும் பக்கங்கள், ஒற்றைப் பக்க ஆப்ஸ் ஆகியவை தரும் பயனர் அனுபவத்தை மேம்படுத்தும் வகையில் செயல்திறன் வாய்ப்புகளைக் கண்டறிதல்.",highestImpact:"அதிகளவு தாக்கத்தை ஏற்படுத்தியவை",informativeAuditCount:"{numInformative,plural, =1{தகவல்கள் நிறைந்த சோதனை: {numInformative}}other{தகவல்கள் நிறைந்த சோதனைகள்: {numInformative}}}",mobile:"மொபைல்",navigationDescription:"பக்க ஏற்றம்",navigationLongDescription:"அசல் Lighthouse அறிக்கைகளைப் போலவே வழிசெலுத்துதல் அறிக்கைகளும் ஒற்றைப் பக்க ஏற்றத்தைப் பகுப்பாய்வு செய்யும்.",navigationReport:"வழிசெலுத்துதல் அறிக்கை",navigationReportCount:"{numNavigation,plural, =1{வழிசெலுத்துதல் அறிக்கை: {numNavigation}}other{வழிசெலுத்துதல் அறிக்கைகள்: {numNavigation}}}",passableAuditCount:"{numPassableAudits,plural, =1{தேர்ச்சி பெறக்கூடிய சோதனை: {numPassableAudits}}other{தேர்ச்சி பெறக்கூடிய சோதனைகள்: {numPassableAudits}}}",passedAuditCount:"{numPassed,plural, =1{தேர்ச்சி பெற்ற சோதனை: {numPassed}}other{தேர்ச்சி பெற்ற சோதனைகள்: {numPassed}}}",ratingAverage:"சராசரி",ratingError:"பிழை",ratingFail:"மோசம்",ratingPass:"நன்று",save:"சேமி",snapshotDescription:"படமெடுக்கப்பட்ட பக்கத்தின் நிலை",snapshotLongDescription:"ஸ்னாப்ஷாட் அறிக்கைகள் ஒரு குறிப்பிட்ட நிலையில் பக்கத்தைப் பகுப்பாய்வு செய்யும். பெரும்பாலும் பயனரின் செயல்பாடுகளுக்குப் பிறகே பகுப்பாய்வு செய்யும்.",snapshotReport:"ஸ்னாப்ஷாட் அறிக்கை",snapshotReportCount:"{numSnapshot,plural, =1{ஸ்னாப்ஷாட் அறிக்கை: {numSnapshot}}other{ஸ்னாப்ஷாட் அறிக்கைகள்: {numSnapshot}}}",summary:"சுருக்க விவரம்",timespanDescription:"பயனர் செயல்பாடுகள்",timespanLongDescription:"கால அளவு குறித்த அறிக்கைகள் தன்னிச்சையான கால அளவைப் பகுப்பாய்வு செய்யும். பெரும்பாலும், இந்தக் கால அளவில் பயனரின் செயல்பாடுகள் இடம்பெற்றிருக்கும்.",timespanReport:"கால அளவு குறித்த அறிக்கை",timespanReportCount:"{numTimespan,plural, =1{கால அளவு அறிக்கை: {numTimespan}}other{கால அளவு அறிக்கைகள்: {numTimespan}}}",title:"Lighthouseஸில் பயனர் செல்லும் பக்கங்களின் வரிசை குறித்த அறிக்கை"},te:{allReports:"అన్ని రిపోర్ట్‌లు",categories:"కేటగిరీలు",categoryAccessibility:"యాక్సెసిబిలిటీ",categoryBestPractices:"ఉత్తమ అభ్యాసాలు",categoryPerformance:"పనితీరు",categorySeo:"SEO",desktop:"డెస్క్‌టాప్",helpDialogTitle:"Lighthouse ఫ్లో రిపోర్ట్‌ను అర్థం చేసుకోవడం",helpLabel:"ఫ్లో రిపోర్ట్‌లను అర్థం చేసుకోవడం",helpUseCaseInstructionNavigation:"నావిగేషన్ రిపోర్ట్‌లను ఉపయోగించి...",helpUseCaseInstructionSnapshot:"స్నాప్‌షాట్ రిపోర్ట్‌లను ఉపయోగించి...",helpUseCaseInstructionTimespan:"కాలవ్యవధి రిపోర్ట్‌లను ఉపయోగించి...",helpUseCaseNavigation1:"Lighthouse పనితీరు స్కోర్‌ను పొందండి.",helpUseCaseNavigation2:"కంటెంట్ కలిగి ఉండే అతిపెద్ద పెయింట్, వేగం ఇండెక్స్ వంటి పేజీ లోడ్ పనితీరు కొలమానాలను లెక్కించండి.",helpUseCaseNavigation3:"ప్రోగ్రెసివ్ వెబ్ యాప్ సామర్థ్యాలను అంచనా వేయండి.",helpUseCaseSnapshot1:"సింగిల్ పేజీ యాప్‌లు లేదా సంక్లిష్ట ఫారమ్‌లలో ఉన్న యాక్సెసిబిలిటీ సమస్యలను కనుగొనండి.",helpUseCaseSnapshot2:"ఇంటరాక్షన్ లోపల ఉన్న మెనూలు, UI ఎలిమెంట్‌ల బెస్ట్ ప్రాక్టీసులను పరిశీలించండి.",helpUseCaseTimespan1:"వివిధ ఇంటరాక్షన్‌లకు సంబంధించిన లేఅవుట్ షిఫ్ట్‌లను, JavaScript అమలయ్యే సమయాన్ని లెక్కించండి.",helpUseCaseTimespan2:"దీర్ఘకాలిక పేజీలు, సింగిల్-పేజీ యాప్‌ల అనుభవాన్ని మెరుగుపరచడానికి పనితీరు అవకాశాలను కనుగొనండి.",highestImpact:"అత్యంత ప్రభావవంతమైనవి",informativeAuditCount:"{numInformative,plural, =1{{numInformative} సమాచారాత్మక ఆడిట్}other{{numInformative} సమాచారాత్మక ఆడిట్‌లు}}",mobile:"మొబైల్",navigationDescription:"పేజీ లోడ్",navigationLongDescription:"నావిగేషన్ రిపోర్ట్‌లు, ఒరిజినల్ Lighthouse రిపోర్ట్‌ల మాదిరిగానే సింగిల్ పేజీ లోడ్‌ను విశ్లేషిస్తాయి.",navigationReport:"నావిగేషన్ రిపోర్ట్",navigationReportCount:"{numNavigation,plural, =1{{numNavigation} నావిగేషన్ రిపోర్ట్}other{{numNavigation} నావిగేషన్ రిపోర్ట్‌లు}}",passableAuditCount:"{numPassableAudits,plural, =1{పాస్ అయ్యే అవకాశం ఉన్న {numPassableAudits} ఆడిట్}other{పాస్ అయ్యే అవకాశం ఉన్న {numPassableAudits} ఆడిట్‌లు}}",passedAuditCount:"{numPassed,plural, =1{{numPassed} ఆడిట్ పాస్ అయ్యింది}other{{numPassed} ఆడిట్‌లు పాస్ అయ్యాయి}}",ratingAverage:"ఓ మోస్తరుగా ఉంది",ratingError:"ఎర్రర్",ratingFail:"బాగా లేదు",ratingPass:"బాగుంది",save:"సేవ్ చేయండి",snapshotDescription:"పేజీ తాలూకు క్యాప్చర్ చేయబడిన స్టేట్",snapshotLongDescription:"స్నాప్‌షాట్ రిపోర్ట్‌లు, ఒక నిర్దిష్ట స్థితిలో ఉన్న పేజీని విశ్లేషిస్తాయి, సాధారణంగా ఈ విశ్లేషణ అనేది యూజర్ ఇంటరాక్షన్‌ల తర్వాత జరుగుతుంది.",snapshotReport:"స్నాప్‌షాట్ రిపోర్ట్",snapshotReportCount:"{numSnapshot,plural, =1{{numSnapshot} స్నాప్‌షాట్ రిపోర్ట్}other{{numSnapshot} స్నాప్‌షాట్ రిపోర్ట్‌లు}}",summary:"సారాంశం",timespanDescription:"యూజర్ ఇంటరాక్షన్‌లు",timespanLongDescription:"కాలవ్యవధి రిపోర్ట్‌లు ఒక యాదృచ్ఛిక సమయ వ్యవధిని విశ్లేషిస్తాయి, సాధారణంగా ఈ వ్యవధి యూజర్ ఇంటరాక్షన్‌లను కలిగి ఉంటుంది.",timespanReport:"పేజీలో యూజర్ ఇంటరాక్టివిటీకి సంబంధించిన రిపోర్ట్",timespanReportCount:"{numTimespan,plural, =1{{numTimespan} కాల వ్యవధి రిపోర్ట్}other{{numTimespan} కాల వ్యవధి రిపోర్ట్‌లు}}",title:"Lighthouse యూజర్ ఫ్లో రిపోర్ట్"},th:{allReports:"รายงานทั้งหมด",categories:"หมวดหมู่",categoryAccessibility:"การช่วยเหลือพิเศษ",categoryBestPractices:"แนวทางปฏิบัติที่ดีที่สุด",categoryPerformance:"ประสิทธิภาพ",categorySeo:"SEO",desktop:"เดสก์ท็อป",helpDialogTitle:"ทำความเข้าใจรายงานโฟลว์ของ Lighthouse",helpLabel:"ทำความเข้าใจโฟลว์",helpUseCaseInstructionNavigation:"ใช้รายงานการไปยังส่วนต่างๆ เพื่อ...",helpUseCaseInstructionSnapshot:"ใช้รายงานภาพรวมเพื่อ...",helpUseCaseInstructionTimespan:"ใช้รายงานระยะเวลาเพื่อ...",helpUseCaseNavigation1:"รับคะแนนประสิทธิภาพของ Lighthouse",helpUseCaseNavigation2:"วัดเมตริกประสิทธิภาพของการโหลดหน้าเว็บ เช่น Largest Contentful Paint และดัชนีความเร็ว",helpUseCaseNavigation3:"ประเมินความสามารถของ Progressive Web App",helpUseCaseSnapshot1:"ค้นหาปัญหาด้านการช่วยเหลือพิเศษในแอปพลิเคชันหน้าเว็บเดียวหรือรูปแบบที่ซับซ้อน",helpUseCaseSnapshot2:"ประเมินแนวทางปฏิบัติแนะนำของเมนูและองค์ประกอบ UI ที่ซ่อนอยู่หลังการโต้ตอบ",helpUseCaseTimespan1:"วัดการเปลี่ยนแปลงเลย์เอาต์และเวลาในการดำเนินการ JavaScript จากชุดการโต้ตอบต่างๆ",helpUseCaseTimespan2:"สำรวจโอกาสของประสิทธิภาพในการปรับปรุงประสบการณ์ของหน้าเว็บที่มีอายุยาวนานและแอปพลิเคชันหน้าเว็บเดียว",highestImpact:"มีประสิทธิภาพสูงสุด",informativeAuditCount:"{numInformative,plural, =1{การตรวจสอบที่เป็นประโยชน์ {numInformative} ครั้ง}other{การตรวจสอบที่เป็นประโยชน์ {numInformative} ครั้ง}}",mobile:"อุปกรณ์เคลื่อนที่",navigationDescription:"การโหลดหน้าเว็บ",navigationLongDescription:"รายงานการไปยังส่วนต่างๆ จะวิเคราะห์การโหลดหน้าเว็บ 1 ครั้ง เช่นเดียวกับรายงานดั้งเดิมของ Lighthouse ทุกประการ",navigationReport:"รายงานการนำทาง",navigationReportCount:"{numNavigation,plural, =1{รายงานการไปยังส่วนต่างๆ {numNavigation} ฉบับ}other{รายงานการไปยังส่วนต่างๆ {numNavigation} ฉบับ}}",passableAuditCount:"{numPassableAudits,plural, =1{การตรวจสอบที่ผ่านได้ {numPassableAudits} ครั้ง}other{การตรวจสอบที่ผ่านได้ {numPassableAudits} ครั้ง}}",passedAuditCount:"{numPassed,plural, =1{การตรวจสอบที่ผ่าน {numPassed} ครั้ง}other{การตรวจสอบที่ผ่าน {numPassed} ครั้ง}}",ratingAverage:"เฉยๆ",ratingError:"ข้อผิดพลาด",ratingFail:"แย่",ratingPass:"ดี",save:"บันทึก",snapshotDescription:"จับภาพสถานะของหน้าเว็บแล้ว",snapshotLongDescription:"รายงานภาพรวมจะวิเคราะห์หน้าเว็บในสถานะหนึ่ง โดยทั่วไปจะเกิดขึ้นหลังจากการโต้ตอบของผู้ใช้",snapshotReport:"รายงานสแนปชอต",snapshotReportCount:"{numSnapshot,plural, =1{รายงานภาพรวม {numSnapshot} ฉบับ}other{รายงานภาพรวม {numSnapshot} ฉบับ}}",summary:"สรุป",timespanDescription:"การโต้ตอบของผู้ใช้",timespanLongDescription:"รายงานระยะเวลาจะวิเคราะห์ระยะเวลาที่กำหนดเอง ซึ่งมักจะมีการโต้ตอบของผู้ใช้",timespanReport:"รายงานระยะเวลา",timespanReportCount:"{numTimespan,plural, =1{รายงานช่วงเวลา {numTimespan} ฉบับ}other{รายงานช่วงเวลา {numTimespan} ฉบับ}}",title:"รายงานโฟลว์ผู้ใช้ Lighthouse"},tl:{allReports:"Lahat ng Ulat",categories:"Mga Kategorya",categoryAccessibility:"Pagiging accessible",categoryBestPractices:"Pinakamahuhusay na Kagawian",categoryPerformance:"Performance",categorySeo:"SEO",desktop:"Desktop",helpDialogTitle:"Pag-unawa sa Ulat ng Daloy ng Lighthouse",helpLabel:"Pag-unawa sa Mga Daloy",helpUseCaseInstructionNavigation:"Gamitin ang Mga ulat ng pag-navigate para...",helpUseCaseInstructionSnapshot:"Gamitin ang Mga ulat ng snapshot para...",helpUseCaseInstructionTimespan:"Gamitin ang Mga ulat ng tagal ng panahon para...",helpUseCaseNavigation1:"Makakuha ng score sa Performance sa Lighthouse.",helpUseCaseNavigation2:"Sukatin ang mga sukatan ng Performance ng pag-load ng page gaya ng Largest Contentful Paint at Speed Index.",helpUseCaseNavigation3:"Suriin ang mga kakayahan ng Progressive Web App.",helpUseCaseSnapshot1:"Maghanap ng mga isyu sa accessibility sa mga single page application o kumplikadong form.",helpUseCaseSnapshot2:"Suriin ang mga pinakamahuhusay na kagawian ng mga menu at element ng UI na nakatago sa likod ng pakikipag-ugnayan.",helpUseCaseTimespan1:"Sukatin ang mga pagbabago sa layout at tagal ng pag-execute sa JavaScript sa isang serye ng mga pakikipag-ugnayan.",helpUseCaseTimespan2:"Tumuklas ng mga pagkakataon sa performance para pagandahin ang karanasan para sa mga long-lived na page at single-page application.",highestImpact:"Pinakamalaking epekto",informativeAuditCount:"{numInformative,plural, =1{{numInformative} audit na nagbibigay ng impormasyon}one{{numInformative} audit na nagbibigay ng impormasyon}other{{numInformative} na audit na nagbibigay ng impormasyon}}",mobile:"Mobile",navigationDescription:"Pag-load ng page",navigationLongDescription:"Nagsusuri ang mga ulat ng pag-navigate ng isang pag-load ng page, na eksaktong kagaya ng mga orihinal na ulat ng Lighthouse.",navigationReport:"Ulat ng pag-navigate",navigationReportCount:"{numNavigation,plural, =1{{numNavigation} ulat ng pag-navigate}one{{numNavigation} ulat ng pag-navigate}other{{numNavigation} na ulat ng pag-navigate}}",passableAuditCount:"{numPassableAudits,plural, =1{{numPassableAudits} maipapasang audit}one{{numPassableAudits} maipapasang audit}other{{numPassableAudits} na maipapasang audit}}",passedAuditCount:"{numPassed,plural, =1{{numPassed} audit ang pumasa}one{{numPassed} audit ang pumasa}other{{numPassed} na audit ang pumasa}}",ratingAverage:"Average",ratingError:"Error",ratingFail:"Pangit",ratingPass:"Maganda",save:"I-save",snapshotDescription:"Na-capture na status ng page",snapshotLongDescription:"Sinusuri ng mga ulat ng snapshot ang page sa isang partikular na status, na karaniwang pagkatapos ng mga pakikipag-ugnayan ng user.",snapshotReport:"Ulat ng snapshot",snapshotReportCount:"{numSnapshot,plural, =1{{numSnapshot} ulat ng snapshot}one{{numSnapshot} ulat ng snapshot}other{{numSnapshot} na ulat ng snapshot}}",summary:"Buod",timespanDescription:"Mga pakikipag-ugnayan ng user",timespanLongDescription:"Nagsusuri ang mga ulat ng tagal ng panahon ng abitrary na yugto ng panahon, na karaniwang naglalaman ng mga pakikipag-ugnayan ng user.",timespanReport:"Ulat ng tagal ng panahon",timespanReportCount:"{numTimespan,plural, =1{{numTimespan} ulat ng tagal ng panahon}one{{numTimespan} ulat ng tagal ng panahon}other{{numTimespan} na ulat ng tagal ng panahon}}",title:"Ulat ng Daloy ng User ng Lighthouse"},tr:{allReports:"Tüm Raporlar",categories:"Kategoriler",categoryAccessibility:"Erişilebilirlik",categoryBestPractices:"En İyi Uygulamalar",categoryPerformance:"Performans",categorySeo:"SEO",desktop:"Masaüstü",helpDialogTitle:"Lighthouse Akış Raporunu Anlama",helpLabel:"Akışları Anlama",helpUseCaseInstructionNavigation:"Gezinme raporlarını kullanarak..",helpUseCaseInstructionSnapshot:"Anlık görüntü raporlarını kullanarak...",helpUseCaseInstructionTimespan:"Etkileşim süresi raporlarını kullanarak...",helpUseCaseNavigation1:"Lighthouse Performans skoru elde edin.",helpUseCaseNavigation2:"Largest Contentful Paint ve Speed Index gibi sayfa yükleme performans metriklerini ölçün.",helpUseCaseNavigation3:"Progresif Web Uygulaması özelliklerini değerlendirin.",helpUseCaseSnapshot1:"Tek sayfalık uygulamalardaki veya karmaşık formlardaki erişilebilirlik sorunlarını bulun.",helpUseCaseSnapshot2:"Etkileşimin ardında yatan menülerin ve kullanıcı arayüzü öğelerinin en iyi uygulamalarını değerlendirin.",helpUseCaseTimespan1:"Bir dizi etkileşimdeki düzen kaymalarını ve JavaScript yürütme süresini ölçün.",helpUseCaseTimespan2:"Uzun ömürlü sayfalar ve tek sayfalık uygulamalar için deneyimi iyileştirecek performans fırsatlarını keşfedin.",highestImpact:"En yüksek etki",informativeAuditCount:"{numInformative,plural, =1{{numInformative} bilgilendirici denetim}other{{numInformative} bilgilendirici denetim}}",mobile:"Mobil",navigationDescription:"Sayfa yükleme",navigationLongDescription:"Gezinme raporları, orijinal Lighthouse raporlarında olduğu gibi tek bir sayfa yükleme işlemini analiz eder.",navigationReport:"Gezinme raporu",navigationReportCount:"{numNavigation,plural, =1{{numNavigation} gezinme raporu}other{{numNavigation} gezinme raporu}}",passableAuditCount:"{numPassableAudits,plural, =1{Geçme ihtimali olan {numPassableAudits} denetim}other{Geçme ihtimali olan {numPassableAudits} denetim}}",passedAuditCount:"{numPassed,plural, =1{{numPassed} denetim başarılı oldu}other{{numPassed} denetim başarılı oldu}}",ratingAverage:"Orta düzey",ratingError:"Hatalı",ratingFail:"Başarısız",ratingPass:"Başarılı",save:"Kaydet",snapshotDescription:"Sayfanın yakalanmış durumu",snapshotLongDescription:"Anlık görüntü raporları, genellikle kullanıcı etkileşimlerinden sonra olmak üzere sayfayı belirli bir durumda analiz eder.",snapshotReport:"Anlık görüntü raporu",snapshotReportCount:"{numSnapshot,plural, =1{{numSnapshot} anlık görüntü raporu}other{{numSnapshot} anlık görüntü raporu}}",summary:"Özet",timespanDescription:"Kullanıcı etkileşimleri",timespanLongDescription:"Etkileşim süresi raporları, genelde kullanıcı etkileşimlerini içeren herhangi bir zaman dilimini analiz eder.",timespanReport:"Etkileşim süresi raporu",timespanReportCount:"{numTimespan,plural, =1{{numTimespan} zaman aralığı raporu}other{{numTimespan} zaman aralığı raporu}}",title:"Lighthouse Kullanıcı İşlemleri Akışıyla İlgili Rapor"},uk:{allReports:"Усі звіти",categories:"Категорії",categoryAccessibility:"Доступність",categoryBestPractices:"Оптимальні методи",categoryPerformance:"Ефективність",categorySeo:"Оптим. пошук. систем",desktop:"Версія для комп’ютера",helpDialogTitle:"Пояснення звіту Lighthouse про послідовність переходів",helpLabel:"Пояснення звіту про переходи",helpUseCaseInstructionNavigation:"Звіти про навігацію допоможуть вам…",helpUseCaseInstructionSnapshot:"Звіти про стан на певний момент часу допоможуть вам…",helpUseCaseInstructionTimespan:"Звіти про період часу допоможуть вам…",helpUseCaseNavigation1:"Отримати оцінку ефективності в Lighthouse.",helpUseCaseNavigation2:"Вимірювати показники ефективності завантаження сторінки, такі як візуалізація великого контенту й індекс швидкості.",helpUseCaseNavigation3:"Оцінювати можливості прогресивного веб-додатка.",helpUseCaseSnapshot1:"Знаходити проблеми з доступністю в односторінкових додатках чи складних формах.",helpUseCaseSnapshot2:"Оцінювати меню й елементи інтерфейсу на відповідність оптимальним методам підтримки взаємодії.",helpUseCaseTimespan1:"Вимірювати зміщення макета й час виконання JavaScript для серії взаємодій.",helpUseCaseTimespan2:"Знаходити можливості покращити ефективність постійних сторінок і односторінкових додатків.",highestImpact:"Найвагоміші",informativeAuditCount:"{numInformative,plural, =1{{numInformative} інформативна перевірка}one{{numInformative} інформативна перевірка}few{{numInformative} інформативні перевірки}many{{numInformative} інформативних перевірок}other{{numInformative} інформативної перевірки}}",mobile:"Мобільна версія",navigationDescription:"Завантаження сторінки",navigationLongDescription:"Звіти про навігацію аналізують завантаження однієї сторінки, як і оригінальні звіти Lighthouse.",navigationReport:"Звіт про навігацію",navigationReportCount:"{numNavigation,plural, =1{{numNavigation} звіт про навігацію}one{{numNavigation} звіт про навігацію}few{{numNavigation} звіти про навігацію}many{{numNavigation} звітів про навігацію}other{{numNavigation} звіту про навігацію}}",passableAuditCount:"{numPassableAudits,plural, =1{Можна виконати {numPassableAudits} перевірку}one{Можна виконати {numPassableAudits} перевірку}few{Можна виконати {numPassableAudits} перевірки}many{Можна виконати {numPassableAudits} перевірок}other{Можна виконати {numPassableAudits} перевірки}}",passedAuditCount:"{numPassed,plural, =1{Виконано {numPassed} перевірку}one{Виконано {numPassed} перевірку}few{Виконано {numPassed} перевірки}many{Виконано {numPassed} перевірок}other{Виконано {numPassed} перевірки}}",ratingAverage:"Посередньо",ratingError:"Помилка",ratingFail:"Погано",ratingPass:"Добре",save:"Зберегти",snapshotDescription:"Зафіксований статус сторінки",snapshotLongDescription:"Звіти про стан на певний момент часу аналізують сторінку в конкретному стані, зазвичай після дій користувача.",snapshotReport:"Звіт про стан на певний момент часу",snapshotReportCount:"{numSnapshot,plural, =1{{numSnapshot} звіт про стан на певний момент часу}one{{numSnapshot} звіт про стан на певний момент часу}few{{numSnapshot} звіти про стан на певний момент часу}many{{numSnapshot} звітів про стан на певний момент часу}other{{numSnapshot} звіту про стан на певний момент часу}}",summary:"Підсумок",timespanDescription:"Взаємодії користувача",timespanLongDescription:"Звіти про період часу аналізують довільний період часу та зазвичай містять дані про дії користувачів.",timespanReport:"Звіт про період часу",timespanReportCount:"{numTimespan,plural, =1{{numTimespan} звіт про період часу}one{{numTimespan} звіт про період часу}few{{numTimespan} звіти про період часу}many{{numTimespan} звітів про період часу}other{{numTimespan} звіту про період часу}}",title:"Звіт про послідовність переходів у Lighthouse"},vi:{allReports:"Tất cả báo cáo",categories:"Danh mục",categoryAccessibility:"Hỗ trợ tiếp cận",categoryBestPractices:"Phương pháp hay nhất",categoryPerformance:"Hiệu suất",categorySeo:"SEO",desktop:"Máy tính",helpDialogTitle:"Tìm hiểu về Báo cáo luồng Lighthouse",helpLabel:"Tìm hiểu về Luồng",helpUseCaseInstructionNavigation:"Sử dụng chế độ Báo cáo di chuyển để…",helpUseCaseInstructionSnapshot:"Sử dụng chế độ Báo cáo ảnh chụp nhanh để...",helpUseCaseInstructionTimespan:"Sử dụng chế độ Báo cáo khoảng thời gian để...",helpUseCaseNavigation1:"Đạt được điểm Hiệu suất Lighthouse.",helpUseCaseNavigation2:"Đo lường các chỉ số về Hiệu suất tải trang, chẳng hạn như Thời gian hiển thị nội dung lớn nhất và Chỉ số tốc độ.",helpUseCaseNavigation3:"Đánh giá các chức năng của Ứng dụng web tiến bộ.",helpUseCaseSnapshot1:"Tìm các vấn đề về khả năng hỗ trợ tiếp cận trong các ứng dụng trang đơn hoặc các biểu mẫu phức tạp.",helpUseCaseSnapshot2:"Đánh giá các phương pháp hay nhất về trình đơn và các thành phần trên giao diện người dùng ẩn phía sau sự tương tác.",helpUseCaseTimespan1:"Đo lường mức thay đổi bố cục và thời gian thực thi JavaScript trên một chuỗi các tương tác.",helpUseCaseTimespan2:"Khám phá các cơ hội về hiệu suất để cải thiện trải nghiệm cho những trang tồn tại lâu dài và các ứng dụng trang đơn.",highestImpact:"Tác động lớn nhất",informativeAuditCount:"{numInformative,plural, =1{{numInformative} quá trình kiểm tra cung cấp nhiều thông tin}other{{numInformative} quá trình kiểm tra cung cấp nhiều thông tin}}",mobile:"Di động",navigationDescription:"Tải trang",navigationLongDescription:"Báo cáo di chuyển phân tích một lượt tải trang, giống hệt như các báo cáo Lighthouse gốc.",navigationReport:"Báo cáo di chuyển trên trang",navigationReportCount:"{numNavigation,plural, =1{{numNavigation} báo cáo điều hướng}other{{numNavigation} báo cáo điều hướng}}",passableAuditCount:"{numPassableAudits,plural, =1{{numPassableAudits} quá trình kiểm tra đạt đủ điều kiện}other{{numPassableAudits} quá trình kiểm tra đạt đủ điều kiện}}",passedAuditCount:"{numPassed,plural, =1{{numPassed} quá trình kiểm tra đã đạt}other{{numPassed} quá trình kiểm tra đã đạt}}",ratingAverage:"Trung bình",ratingError:"Lỗi",ratingFail:"Kém",ratingPass:"Tốt",save:"Lưu",snapshotDescription:"Trạng thái đã chụp của trang",snapshotLongDescription:"Báo cáo ảnh chụp nhanh phân tích trang ở một trạng thái cụ thể, thường là sau khi người dùng tương tác.",snapshotReport:"Báo cáo tổng quan",snapshotReportCount:"{numSnapshot,plural, =1{{numSnapshot} báo cáo tổng quan nhanh}other{{numSnapshot} báo cáo tổng quan nhanh}}",summary:"Tóm tắt",timespanDescription:"Sự tương tác của người dùng",timespanLongDescription:"Báo cáo khoảng thời gian phân tích một khoảng thời gian bất kỳ, thường chứa các tương tác của người dùng.",timespanReport:"Báo cáo khoảng thời gian",timespanReportCount:"{numTimespan,plural, =1{{numTimespan} báo cáo khoảng thời gian}other{{numTimespan} báo cáo khoảng thời gian}}",title:"Báo cáo luồng người dùng Lighthouse"},zh:{allReports:"所有报告",categories:"类别",categoryAccessibility:"无障碍",categoryBestPractices:"最佳做法",categoryPerformance:"性能",categorySeo:"SEO",desktop:"桌面版",helpDialogTitle:"了解 Lighthouse 流程报告",helpLabel:"了解流程",helpUseCaseInstructionNavigation:"使用导航报告可以…",helpUseCaseInstructionSnapshot:"使用快照报告可以…",helpUseCaseInstructionTimespan:"使用时间跨度报告可以…",helpUseCaseNavigation1:"获取 Lighthouse 给出的性能得分。",helpUseCaseNavigation2:"衡量网页加载性能指标，例如 Largest Contentful Paint 和 Speed Index。",helpUseCaseNavigation3:"评估渐进式 Web 应用的功能。",helpUseCaseSnapshot1:"查找单页应用或复杂表单中的无障碍功能方面的问题。",helpUseCaseSnapshot2:"评估互动背后隐藏的菜单和界面元素的最佳做法。",helpUseCaseTimespan1:"衡量一系列互动的布局偏移和 JavaScript 执行用时。",helpUseCaseTimespan2:"发掘性能提升机会，以便改进长期网页和单页应用的用户体验。",highestImpact:"影响力最大",informativeAuditCount:"{numInformative,plural, =1{{numInformative} 项参考性审核}other{{numInformative} 项参考性审核}}",mobile:"移动版",navigationDescription:"网页加载",navigationLongDescription:"导航报告旨在分析单个网页的加载情况，与最初的 Lighthouse 报告完全一样。",navigationReport:"导航报告",navigationReportCount:"{numNavigation,plural, =1{{numNavigation} 份导航报告}other{{numNavigation} 份导航报告}}",passableAuditCount:"{numPassableAudits,plural, =1{{numPassableAudits} 项有望通过的审核}other{{numPassableAudits} 项有望通过的审核}}",passedAuditCount:"{numPassed,plural, =1{通过了 {numPassed} 项审核}other{通过了 {numPassed} 项审核}}",ratingAverage:"一般",ratingError:"出错了",ratingFail:"较差",ratingPass:"良好",save:"保存",snapshotDescription:"捕获到的网页状态",snapshotLongDescription:"快照报告旨在分析处于特定状态的网页（通常是在用户互动之后）。",snapshotReport:"快照报告",snapshotReportCount:"{numSnapshot,plural, =1{{numSnapshot} 份快照报告}other{{numSnapshot} 份快照报告}}",summary:"摘要",timespanDescription:"用户互动",timespanLongDescription:"时间跨度报告旨在分析任意时间段（通常包含用户互动）。",timespanReport:"时间跨度报告",timespanReportCount:"{numTimespan,plural, =1{{numTimespan} 份时间跨度报告}other{{numTimespan} 份时间跨度报告}}",title:"Lighthouse 用户流报告"},"zh-HK":{allReports:"全部報告",categories:"類別",categoryAccessibility:"無障礙功能",categoryBestPractices:"最佳做法",categoryPerformance:"效能",categorySeo:"搜尋引擎優化 (SEO)",desktop:"桌面電腦",helpDialogTitle:"瞭解 Lighthouse 流程報告",helpLabel:"解讀流程",helpUseCaseInstructionNavigation:"使用「導覽」報告來…",helpUseCaseInstructionSnapshot:"使用「快覽」報告來…",helpUseCaseInstructionTimespan:"使用「時間範圍」報告來…",helpUseCaseNavigation1:"取得 Lighthouse 效能分數。",helpUseCaseNavigation2:"測量頁面載入效能數據，例如「最大內容繪製」和「速度指數」。",helpUseCaseNavigation3:"存取「漸進式網頁應用程式」功能。",helpUseCaseSnapshot1:"在單頁應用程式或複合式表格中尋找無障礙功能問題。",helpUseCaseSnapshot2:"評估互動背後安排選單和使用者介面元素的最佳做法。",helpUseCaseTimespan1:"測量一連串互動的版面配置轉移和 JavaScript 執行時間。",helpUseCaseTimespan2:"探索效能優化建議，以便改善永久頁面和單頁應用程式的使用體驗。",highestImpact:"最大影響",informativeAuditCount:"{numInformative,plural, =1{{numInformative} 項資訊型審核}other{{numInformative} 項資訊型審核}}",mobile:"流動裝置",navigationDescription:"網頁載入",navigationLongDescription:"「導覽」報告會分析單次網頁載入情況，方式與原來的 Lighthouse 報告完全相同。",navigationReport:"導覽報告",navigationReportCount:"{numNavigation,plural, =1{{numNavigation} 項導覽報告}other{{numNavigation} 項導覽報告}}",passableAuditCount:"{numPassableAudits,plural, =1{{numPassableAudits} 項可通過的審核}other{{numPassableAudits} 項可通過的審核}}",passedAuditCount:"{numPassed,plural, =1{已通過 {numPassed} 項審核}other{已通過 {numPassed} 項審核}}",ratingAverage:"一般",ratingError:"錯誤",ratingFail:"欠佳",ratingPass:"良好",save:"儲存",snapshotDescription:"已採集網頁狀態",snapshotLongDescription:"「快覽」報告會分析處於特定狀態 (通常是在使用者進行互動之後) 的頁面。",snapshotReport:"快覽報告",snapshotReportCount:"{numSnapshot,plural, =1{{numSnapshot} 項快覽報告}other{{numSnapshot} 項快覽報告}}",summary:"摘要",timespanDescription:"用戶的互動行為",timespanLongDescription:"「時間範圍」報告會分析任意一個時段 (通常包含使用者互動)。",timespanReport:"時間範圍報告",timespanReportCount:"{numTimespan,plural, =1{{numTimespan} 項時間範圍報告}other{{numTimespan} 項時間範圍報告}}",title:"Lighthouse 用戶流程報告"},"zh-TW":{allReports:"所有報表",categories:"類別",categoryAccessibility:"無障礙功能",categoryBestPractices:"最佳做法",categoryPerformance:"效能",categorySeo:"搜尋引擎最佳化 (SEO)",desktop:"電腦版",helpDialogTitle:"解讀 Lighthouse 流程報表",helpLabel:"解讀流程",helpUseCaseInstructionNavigation:"使用導覽報表來...",helpUseCaseInstructionSnapshot:"使用快照報表來...",helpUseCaseInstructionTimespan:"使用時間範圍報表來...",helpUseCaseNavigation1:"取得 Lighthouse 效能分數。",helpUseCaseNavigation2:"評估載入網頁的效能指標，例如最大內容繪製和速度指數。",helpUseCaseNavigation3:"評估漸進式網頁應用程式功能。",helpUseCaseSnapshot1:"針對單頁應用程式或複雜的表單尋找無障礙功能方面的問題。",helpUseCaseSnapshot2:"針對隱藏在互動背後的選單和 UI 元素評估最佳做法。",helpUseCaseTimespan1:"測量一系列互動的版面配置位移和 JavaScript 執行時間。",helpUseCaseTimespan2:"找出增進效能的機會，進而改善長期網頁和單頁應用程式的使用體驗。",highestImpact:"最大影響力",informativeAuditCount:"{numInformative,plural, =1{{numInformative} 項資訊型稽核}other{{numInformative} 項資訊型稽核}}",mobile:"行動版",navigationDescription:"載入網頁",navigationLongDescription:"導覽報表能分析單一網頁的載入作業，與原 Lighthouse 報表完全相同。",navigationReport:"導覽報表",navigationReportCount:"{numNavigation,plural, =1{{numNavigation} 份導覽報表}other{{numNavigation} 份導覽報表}}",passableAuditCount:"{numPassableAudits,plural, =1{{numPassableAudits} 項可通過的稽核}other{{numPassableAudits} 項可通過的稽核}}",passedAuditCount:"{numPassed,plural, =1{已通過 {numPassed} 項稽核}other{已通過 {numPassed} 項稽核}}",ratingAverage:"平均",ratingError:"錯誤",ratingFail:"不佳",ratingPass:"良好",save:"儲存",snapshotDescription:"網頁擷取狀態",snapshotLongDescription:"快照報表能分析特定狀態下的網頁，通常是在使用者互動之後的網頁。",snapshotReport:"快照報表",snapshotReportCount:"{numSnapshot,plural, =1{{numSnapshot} 份快照報表}other{{numSnapshot} 份快照報表}}",summary:"摘要",timespanDescription:"使用者互動",timespanLongDescription:"時間範圍報表能分析任意一段時間，通常包含使用者與網頁互動的時間。",timespanReport:"時間範圍報表",timespanReportCount:"{numTimespan,plural, =1{{numTimespan} 份時間範圍報表}other{{numTimespan} 份時間範圍報表}}",title:"Lighthouse 使用者流程報表"}};var ya=Pe({formatter:new ce("en-US"),strings:{...Je,...Bt}});function _a(){let t=B(),e=t.steps[0].lhr,n=e.configSettings.locale;return t.steps.some(a=>a.lhr.configSettings.locale!==n)&&console.warn("LHRs have inconsistent locales"),{locale:n,lhrStrings:e.i18n.rendererFormattedStrings}}function Ne(){return Ee(ya)}function D(){return Ne().strings}function ct(){let{locale:t}=_a();return(e,n)=>va(e,n,t)}var Ca=({children:t})=>{let{locale:e,lhrStrings:n}=_a(),a=Q(()=>(b.apply({providedStrings:{...n,...Bt,...ba[e]},i18n:new ce(e),reportJson:null}),{formatter:b.i18n,strings:b.strings}),[e,n]);return u(ya.Provider,{value:a,children:t})};var to=({href:t,label:e,mode:n,isCurrent:a})=>u("a",{className:ve("SidebarFlowStep",{"Sidebar--current":a}),href:t,children:[u("div",{children:u(oe,{mode:n})}),u("div",{className:`SidebarFlowStep__label SidebarFlowStep__label--${n}`,children:e})]}),no=()=>u("div",{className:"SidebarFlowSeparator",children:[u(oe,{}),u($,{}),u(oe,{})]}),wa=()=>{let t=B(),e=be();return u("div",{className:"SidebarFlow",children:t.steps.map((n,a)=>{let{lhr:i,name:o}=n;return u(N,{children:[i.gatherMode==="navigation"&&a!==0?u(no,{}):void 0,u(to,{mode:i.gatherMode,href:`#index=${a}`,label:o,isCurrent:a===e?.index},i.fetchTime)]})})})};var ao=()=>{let t=be(),e=D();return u("a",{href:"#",className:ve("SidebarSummary",{"Sidebar--current":t===null}),"data-testid":"SidebarSummary",children:[u("div",{className:"SidebarSummary__icon",children:u(In,{})}),u("div",{className:"SidebarSummary__label",children:e.summary})]})},io=({settings:t})=>{let e=D(),n=A.getEmulationDescriptions(t),a=n.screenEmulation?`${n.deviceEmulation} - ${n.screenEmulation}`:n.deviceEmulation;return u("div",{className:"SidebarRuntimeSettings",children:[u("div",{className:"SidebarRuntimeSettings__item",title:e.runtimeSettingsDevice,children:[u("div",{className:"SidebarRuntimeSettings__item--icon",children:u(Nn,{})}),a]}),u("div",{className:"SidebarRuntimeSettings__item",title:e.runtimeSettingsNetworkThrottling,children:[u("div",{className:"SidebarRuntimeSettings__item--icon",children:u(Dn,{})}),n.summary]}),u("div",{className:"SidebarRuntimeSettings__item",title:e.runtimeSettingsCPUThrottling,children:[u("div",{className:"SidebarRuntimeSettings__item--icon",children:u(zn,{})}),`${t.throttling.cpuSlowdownMultiplier}x slowdown`]})]})},oo=({title:t,date:e})=>{let n=Ne();return u("div",{className:"SidebarHeader",children:[u("div",{className:"SidebarHeader__title",children:t}),u("div",{className:"SidebarHeader__date",children:n.formatter.formatDateTime(e)})]})},xa=()=>{let t=B(),e=t.steps[0].lhr;return u("div",{className:"Sidebar",children:[u(oo,{title:t.name,date:e.fetchTime}),u($,{}),u(ao,{}),u($,{}),u(wa,{}),u($,{}),u(io,{settings:e.configSettings})]})};function ro(t){let e=t.createFragment(),n=t.createElement("style");n.append(`
    .lh-3p-filter {
      color: var(--color-gray-600);
      float: right;
      padding: 6px var(--stackpack-padding-horizontal);
    }
    .lh-3p-filter-label, .lh-3p-filter-input {
      vertical-align: middle;
      user-select: none;
    }
    .lh-3p-filter-input:disabled + .lh-3p-ui-string {
      text-decoration: line-through;
    }
  `),e.append(n);let a=t.createElement("div","lh-3p-filter"),i=t.createElement("label","lh-3p-filter-label"),o=t.createElement("input","lh-3p-filter-input");o.setAttribute("type","checkbox"),o.setAttribute("checked","");let r=t.createElement("span","lh-3p-ui-string");r.append("Show 3rd party resources");let s=t.createElement("span","lh-3p-filter-count");return i.append(" ",o," ",r," (",s,") "),a.append(" ",i," "),e.append(a),e}function so(t){let e=t.createFragment(),n=t.createElement("div","lh-audit"),a=t.createElement("details","lh-expandable-details"),i=t.createElement("summary"),o=t.createElement("div","lh-audit__header lh-expandable-details__summary"),r=t.createElement("span","lh-audit__score-icon"),s=t.createElement("span","lh-audit__title-and-text"),p=t.createElement("span","lh-audit__title"),c=t.createElement("span","lh-audit__display-text");s.append(" ",p," ",c," ");let l=t.createElement("div","lh-chevron-container");o.append(" ",r," ",s," ",l," "),i.append(" ",o," ");let d=t.createElement("div","lh-audit__description"),m=t.createElement("div","lh-audit__stackpacks");return a.append(" ",i," ",d," ",m," "),n.append(" ",a," "),e.append(n),e}function lo(t){let e=t.createFragment(),n=t.createElement("div","lh-category-header"),a=t.createElement("div","lh-score__gauge");a.setAttribute("role","heading"),a.setAttribute("aria-level","2");let i=t.createElement("div","lh-category-header__description");return n.append(" ",a," ",i," "),e.append(n),e}function po(t){let e=t.createFragment(),n=t.createElementNS("http://www.w3.org/2000/svg","svg","lh-chevron");n.setAttribute("viewBox","0 0 100 100");let a=t.createElementNS("http://www.w3.org/2000/svg","g","lh-chevron__lines"),i=t.createElementNS("http://www.w3.org/2000/svg","path","lh-chevron__line lh-chevron__line-left");i.setAttribute("d","M10 50h40");let o=t.createElementNS("http://www.w3.org/2000/svg","path","lh-chevron__line lh-chevron__line-right");return o.setAttribute("d","M90 50H50"),a.append(" ",i," ",o," "),n.append(" ",a," "),e.append(n),e}function uo(t){let e=t.createFragment(),n=t.createElement("div","lh-audit-group"),a=t.createElement("details","lh-clump"),i=t.createElement("summary"),o=t.createElement("div","lh-audit-group__summary"),r=t.createElement("div","lh-audit-group__header"),s=t.createElement("span","lh-audit-group__title"),p=t.createElement("span","lh-audit-group__itemcount");r.append(" ",s," ",p," "," "," ");let c=t.createElement("div","lh-clump-toggle"),l=t.createElement("span","lh-clump-toggletext--show"),d=t.createElement("span","lh-clump-toggletext--hide");return c.append(" ",l," ",d," "),o.append(" ",r," ",c," "),i.append(" ",o," "),a.append(" ",i," "),n.append(" "," ",a," "),e.append(n),e}function co(t){let e=t.createFragment(),n=t.createElement("div","lh-crc-container"),a=t.createElement("style");a.append(`
      .lh-crc .lh-tree-marker {
        width: 12px;
        height: 26px;
        display: block;
        float: left;
        background-position: top left;
      }
      .lh-crc .lh-horiz-down {
        background: url('data:image/svg+xml;utf8,<svg width="16" height="26" viewBox="0 0 16 26" xmlns="http://www.w3.org/2000/svg"><g fill="%23D8D8D8" fill-rule="evenodd"><path d="M16 12v2H-2v-2z"/><path d="M9 12v14H7V12z"/></g></svg>');
      }
      .lh-crc .lh-right {
        background: url('data:image/svg+xml;utf8,<svg width="16" height="26" viewBox="0 0 16 26" xmlns="http://www.w3.org/2000/svg"><path d="M16 12v2H0v-2z" fill="%23D8D8D8" fill-rule="evenodd"/></svg>');
      }
      .lh-crc .lh-up-right {
        background: url('data:image/svg+xml;utf8,<svg width="16" height="26" viewBox="0 0 16 26" xmlns="http://www.w3.org/2000/svg"><path d="M7 0h2v14H7zm2 12h7v2H9z" fill="%23D8D8D8" fill-rule="evenodd"/></svg>');
      }
      .lh-crc .lh-vert-right {
        background: url('data:image/svg+xml;utf8,<svg width="16" height="26" viewBox="0 0 16 26" xmlns="http://www.w3.org/2000/svg"><path d="M7 0h2v27H7zm2 12h7v2H9z" fill="%23D8D8D8" fill-rule="evenodd"/></svg>');
      }
      .lh-crc .lh-vert {
        background: url('data:image/svg+xml;utf8,<svg width="16" height="26" viewBox="0 0 16 26" xmlns="http://www.w3.org/2000/svg"><path d="M7 0h2v26H7z" fill="%23D8D8D8" fill-rule="evenodd"/></svg>');
      }
      .lh-crc .lh-crc-tree {
        font-size: 14px;
        width: 100%;
        overflow-x: auto;
      }
      .lh-crc .lh-crc-node {
        height: 26px;
        line-height: 26px;
        white-space: nowrap;
      }
      .lh-crc .lh-crc-node__longest {
        color: var(--color-average-secondary);
      }
      .lh-crc .lh-crc-node__tree-value {
        margin-left: 10px;
      }
      .lh-crc .lh-crc-node__tree-value div {
        display: inline;
      }
      .lh-crc .lh-crc-node__chain-duration {
        font-weight: 700;
      }
      .lh-crc .lh-crc-initial-nav {
        color: #595959;
        font-style: italic;
      }
      .lh-crc__summary-value {
        margin-bottom: 10px;
      }
    `);let i=t.createElement("div"),o=t.createElement("div","lh-crc__summary-value"),r=t.createElement("span","lh-crc__longest_duration_label"),s=t.createElement("b","lh-crc__longest_duration");o.append(" ",r," ",s," "),i.append(" ",o," ");let p=t.createElement("div","lh-crc"),c=t.createElement("div","lh-crc-initial-nav");return p.append(" ",c," "," "),n.append(" ",a," ",i," ",p," "),e.append(n),e}function mo(t){let e=t.createFragment(),n=t.createElement("div","lh-crc-node"),a=t.createElement("span","lh-crc-node__tree-marker"),i=t.createElement("span","lh-crc-node__tree-value");return n.append(" ",a," ",i," "),e.append(n),e}function ho(t){let e=t.createFragment(),n=t.createElement("div","lh-element-screenshot"),a=t.createElement("div","lh-element-screenshot__content"),i=t.createElement("div","lh-element-screenshot__image"),o=t.createElement("div","lh-element-screenshot__mask"),r=t.createElementNS("http://www.w3.org/2000/svg","svg");r.setAttribute("height","0"),r.setAttribute("width","0");let s=t.createElementNS("http://www.w3.org/2000/svg","defs"),p=t.createElementNS("http://www.w3.org/2000/svg","clipPath");p.setAttribute("clipPathUnits","objectBoundingBox"),s.append(" ",p," "," "),r.append(" ",s," "),o.append(" ",r," ");let c=t.createElement("div","lh-element-screenshot__element-marker");return i.append(" ",o," ",c," "),a.append(" ",i," "),n.append(" ",a," "),e.append(n),e}function go(t){let e=t.createFragment(),n=t.createElement("div","lh-exp-gauge-component"),a=t.createElement("div","lh-exp-gauge__wrapper");a.setAttribute("target","_blank");let i=t.createElement("div","lh-exp-gauge__svg-wrapper"),o=t.createElementNS("http://www.w3.org/2000/svg","svg","lh-exp-gauge"),r=t.createElementNS("http://www.w3.org/2000/svg","g","lh-exp-gauge__inner"),s=t.createElementNS("http://www.w3.org/2000/svg","circle","lh-exp-gauge__bg"),p=t.createElementNS("http://www.w3.org/2000/svg","circle","lh-exp-gauge__base lh-exp-gauge--faded"),c=t.createElementNS("http://www.w3.org/2000/svg","circle","lh-exp-gauge__arc"),l=t.createElementNS("http://www.w3.org/2000/svg","text","lh-exp-gauge__percentage");r.append(" ",s," ",p," ",c," ",l," ");let d=t.createElementNS("http://www.w3.org/2000/svg","g","lh-exp-gauge__outer"),m=t.createElementNS("http://www.w3.org/2000/svg","circle","lh-cover");d.append(" ",m," ");let h=t.createElementNS("http://www.w3.org/2000/svg","text","lh-exp-gauge__label");return h.setAttribute("text-anchor","middle"),h.setAttribute("x","0"),h.setAttribute("y","60"),o.append(" ",r," ",d," ",h," "),i.append(" ",o," "),a.append(" ",i," "),n.append(" ",a," "),e.append(n),e}function fo(t){let e=t.createFragment(),n=t.createElement("style");n.append(`
    .lh-footer {
      padding: var(--footer-padding-vertical) calc(var(--default-padding) * 2);
      max-width: var(--report-content-max-width);
      margin: 0 auto;
    }
    .lh-footer .lh-generated {
      text-align: center;
    }
  `),e.append(n);let a=t.createElement("footer","lh-footer"),i=t.createElement("ul","lh-meta__items");i.append(" ");let o=t.createElement("div","lh-generated"),r=t.createElement("b");r.append("Lighthouse");let s=t.createElement("span","lh-footer__version"),p=t.createElement("a","lh-footer__version_issue");return p.setAttribute("href","https://github.com/GoogleChrome/Lighthouse/issues"),p.setAttribute("target","_blank"),p.setAttribute("rel","noopener"),p.append("File an issue"),o.append(" "," Generated by ",r," ",s," | ",p," "),a.append(" ",i," ",o," "),e.append(a),e}function vo(t){let e=t.createFragment(),n=t.createElement("a","lh-fraction__wrapper"),a=t.createElement("div","lh-fraction__content-wrapper"),i=t.createElement("div","lh-fraction__content"),o=t.createElement("div","lh-fraction__background");i.append(" ",o," "),a.append(" ",i," ");let r=t.createElement("div","lh-fraction__label");return n.append(" ",a," ",r," "),e.append(n),e}function bo(t){let e=t.createFragment(),n=t.createElement("a","lh-gauge__wrapper"),a=t.createElement("div","lh-gauge__svg-wrapper"),i=t.createElementNS("http://www.w3.org/2000/svg","svg","lh-gauge");i.setAttribute("viewBox","0 0 120 120");let o=t.createElementNS("http://www.w3.org/2000/svg","circle","lh-gauge-base");o.setAttribute("r","56"),o.setAttribute("cx","60"),o.setAttribute("cy","60"),o.setAttribute("stroke-width","8");let r=t.createElementNS("http://www.w3.org/2000/svg","circle","lh-gauge-arc");r.setAttribute("r","56"),r.setAttribute("cx","60"),r.setAttribute("cy","60"),r.setAttribute("stroke-width","8"),i.append(" ",o," ",r," "),a.append(" ",i," ");let s=t.createElement("div","lh-gauge__percentage"),p=t.createElement("div","lh-gauge__label");return n.append(" "," ",a," ",s," "," ",p," "),e.append(n),e}function yo(t){let e=t.createFragment(),n=t.createElement("style");n.append(`
    /* CSS Fireworks. Originally by Eddie Lin
       https://codepen.io/paulirish/pen/yEVMbP
    */
    .lh-pyro {
      display: none;
      z-index: 1;
      pointer-events: none;
    }
    .lh-score100 .lh-pyro {
      display: block;
    }
    .lh-score100 .lh-lighthouse stop:first-child {
      stop-color: hsla(200, 12%, 95%, 0);
    }
    .lh-score100 .lh-lighthouse stop:last-child {
      stop-color: hsla(65, 81%, 76%, 1);
    }

    .lh-pyro > .lh-pyro-before, .lh-pyro > .lh-pyro-after {
      position: absolute;
      width: 5px;
      height: 5px;
      border-radius: 2.5px;
      box-shadow: 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff, 0 0 #fff;
      animation: 1s bang ease-out infinite backwards,  1s gravity ease-in infinite backwards,  5s position linear infinite backwards;
      animation-delay: 1s, 1s, 1s;
    }

    .lh-pyro > .lh-pyro-after {
      animation-delay: 2.25s, 2.25s, 2.25s;
      animation-duration: 1.25s, 1.25s, 6.25s;
    }

    @keyframes bang {
      to {
        opacity: 1;
        box-shadow: -70px -115.67px #47ebbc, -28px -99.67px #eb47a4, 58px -31.67px #7eeb47, 13px -141.67px #eb47c5, -19px 6.33px #7347eb, -2px -74.67px #ebd247, 24px -151.67px #eb47e0, 57px -138.67px #b4eb47, -51px -104.67px #479eeb, 62px 8.33px #ebcf47, -93px 0.33px #d547eb, -16px -118.67px #47bfeb, 53px -84.67px #47eb83, 66px -57.67px #eb47bf, -93px -65.67px #91eb47, 30px -13.67px #86eb47, -2px -59.67px #83eb47, -44px 1.33px #eb47eb, 61px -58.67px #47eb73, 5px -22.67px #47e8eb, -66px -28.67px #ebe247, 42px -123.67px #eb5547, -75px 26.33px #7beb47, 15px -52.67px #a147eb, 36px -51.67px #eb8347, -38px -12.67px #eb5547, -46px -59.67px #47eb81, 78px -114.67px #eb47ba, 15px -156.67px #eb47bf, -36px 1.33px #eb4783, -72px -86.67px #eba147, 31px -46.67px #ebe247, -68px 29.33px #47e2eb, -55px 19.33px #ebe047, -56px 27.33px #4776eb, -13px -91.67px #eb5547, -47px -138.67px #47ebc7, -18px -96.67px #eb47ac, 11px -88.67px #4783eb, -67px -28.67px #47baeb, 53px 10.33px #ba47eb, 11px 19.33px #5247eb, -5px -11.67px #eb4791, -68px -4.67px #47eba7, 95px -37.67px #eb478b, -67px -162.67px #eb5d47, -54px -120.67px #eb6847, 49px -12.67px #ebe047, 88px 8.33px #47ebda, 97px 33.33px #eb8147, 6px -71.67px #ebbc47;
      }
    }
    @keyframes gravity {
      from {
        opacity: 1;
      }
      to {
        transform: translateY(80px);
        opacity: 0;
      }
    }
    @keyframes position {
      0%, 19.9% {
        margin-top: 4%;
        margin-left: 47%;
      }
      20%, 39.9% {
        margin-top: 7%;
        margin-left: 30%;
      }
      40%, 59.9% {
        margin-top: 6%;
        margin-left: 70%;
      }
      60%, 79.9% {
        margin-top: 3%;
        margin-left: 20%;
      }
      80%, 99.9% {
        margin-top: 3%;
        margin-left: 80%;
      }
    }
  `),e.append(n);let a=t.createElement("div","lh-header-container"),i=t.createElement("div","lh-scores-wrapper-placeholder");return a.append(" ",i," "),e.append(a),e}function _o(t){let e=t.createFragment(),n=t.createElement("div","lh-metric"),a=t.createElement("div","lh-metric__innerwrap"),i=t.createElement("div","lh-metric__icon"),o=t.createElement("span","lh-metric__title"),r=t.createElement("div","lh-metric__value"),s=t.createElement("div","lh-metric__description");return a.append(" ",i," ",o," ",r," ",s," "),n.append(" ",a," "),e.append(n),e}function Co(t){let e=t.createFragment(),n=t.createElement("div","lh-scorescale"),a=t.createElement("span","lh-scorescale-range lh-scorescale-range--fail");a.append("0–49");let i=t.createElement("span","lh-scorescale-range lh-scorescale-range--average");i.append("50–89");let o=t.createElement("span","lh-scorescale-range lh-scorescale-range--pass");return o.append("90–100"),n.append(" ",a," ",i," ",o," "),e.append(n),e}function wo(t){let e=t.createFragment(),n=t.createElement("style");n.append(`
    .lh-scores-container {
      display: flex;
      flex-direction: column;
      padding: var(--default-padding) 0;
      position: relative;
      width: 100%;
    }

    .lh-sticky-header {
      --gauge-circle-size: var(--gauge-circle-size-sm);
      --plugin-badge-size: 16px;
      --plugin-icon-size: 75%;
      --gauge-wrapper-width: 60px;
      --gauge-percentage-font-size: 13px;
      position: fixed;
      left: 0;
      right: 0;
      top: var(--topbar-height);
      font-weight: 500;
      display: none;
      justify-content: center;
      background-color: var(--sticky-header-background-color);
      border-bottom: 1px solid var(--color-gray-200);
      padding-top: var(--score-container-padding);
      padding-bottom: 4px;
      z-index: 2;
      pointer-events: none;
    }

    .lh-devtools .lh-sticky-header {
      /* The report within DevTools is placed in a container with overflow, which changes the placement of this header unless we change \`position\` to \`sticky.\` */
      position: sticky;
    }

    .lh-sticky-header--visible {
      display: grid;
      grid-auto-flow: column;
      pointer-events: auto;
    }

    /* Disable the gauge arc animation for the sticky header, so toggling display: none
       does not play the animation. */
    .lh-sticky-header .lh-gauge-arc {
      animation: none;
    }

    .lh-sticky-header .lh-gauge__label,
    .lh-sticky-header .lh-fraction__label {
      display: none;
    }

    .lh-highlighter {
      width: var(--gauge-wrapper-width);
      height: 1px;
      background-color: var(--highlighter-background-color);
      /* Position at bottom of first gauge in sticky header. */
      position: absolute;
      grid-column: 1;
      bottom: -1px;
      left: 0px;
      right: 0px;
    }
  `),e.append(n);let a=t.createElement("div","lh-scores-wrapper"),i=t.createElement("div","lh-scores-container"),o=t.createElement("div","lh-pyro"),r=t.createElement("div","lh-pyro-before"),s=t.createElement("div","lh-pyro-after");return o.append(" ",r," ",s," "),i.append(" ",o," "),a.append(" ",i," "),e.append(a),e}function xo(t){let e=t.createFragment(),n=t.createElement("div","lh-snippet"),a=t.createElement("style");return a.append(`
          :root {
            --snippet-highlight-light: #fbf1f2;
            --snippet-highlight-dark: #ffd6d8;
          }

         .lh-snippet__header {
          position: relative;
          overflow: hidden;
          padding: 10px;
          border-bottom: none;
          color: var(--snippet-color);
          background-color: var(--snippet-background-color);
          border: 1px solid var(--report-border-color-secondary);
        }
        .lh-snippet__title {
          font-weight: bold;
          float: left;
        }
        .lh-snippet__node {
          float: left;
          margin-left: 4px;
        }
        .lh-snippet__toggle-expand {
          padding: 1px 7px;
          margin-top: -1px;
          margin-right: -7px;
          float: right;
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 14px;
          color: #0c50c7;
        }

        .lh-snippet__snippet {
          overflow: auto;
          border: 1px solid var(--report-border-color-secondary);
        }
        /* Container needed so that all children grow to the width of the scroll container */
        .lh-snippet__snippet-inner {
          display: inline-block;
          min-width: 100%;
        }

        .lh-snippet:not(.lh-snippet--expanded) .lh-snippet__show-if-expanded {
          display: none;
        }
        .lh-snippet.lh-snippet--expanded .lh-snippet__show-if-collapsed {
          display: none;
        }

        .lh-snippet__line {
          background: white;
          white-space: pre;
          display: flex;
        }
        .lh-snippet__line:not(.lh-snippet__line--message):first-child {
          padding-top: 4px;
        }
        .lh-snippet__line:not(.lh-snippet__line--message):last-child {
          padding-bottom: 4px;
        }
        .lh-snippet__line--content-highlighted {
          background: var(--snippet-highlight-dark);
        }
        .lh-snippet__line--message {
          background: var(--snippet-highlight-light);
        }
        .lh-snippet__line--message .lh-snippet__line-number {
          padding-top: 10px;
          padding-bottom: 10px;
        }
        .lh-snippet__line--message code {
          padding: 10px;
          padding-left: 5px;
          color: var(--color-fail);
          font-family: var(--report-font-family);
        }
        .lh-snippet__line--message code {
          white-space: normal;
        }
        .lh-snippet__line-icon {
          padding-top: 10px;
          display: none;
        }
        .lh-snippet__line--message .lh-snippet__line-icon {
          display: block;
        }
        .lh-snippet__line-icon:before {
          content: "";
          display: inline-block;
          vertical-align: middle;
          margin-right: 4px;
          width: var(--score-icon-size);
          height: var(--score-icon-size);
          background-image: var(--fail-icon-url);
        }
        .lh-snippet__line-number {
          flex-shrink: 0;
          width: 40px;
          text-align: right;
          font-family: monospace;
          padding-right: 5px;
          margin-right: 5px;
          color: var(--color-gray-600);
          user-select: none;
        }
    `),n.append(" ",a," "),e.append(n),e}function So(t){let e=t.createFragment(),n=t.createElement("div","lh-snippet__snippet"),a=t.createElement("div","lh-snippet__snippet-inner");return n.append(" ",a," "),e.append(n),e}function ko(t){let e=t.createFragment(),n=t.createElement("div","lh-snippet__header"),a=t.createElement("div","lh-snippet__title"),i=t.createElement("div","lh-snippet__node"),o=t.createElement("button","lh-snippet__toggle-expand"),r=t.createElement("span","lh-snippet__btn-label-collapse lh-snippet__show-if-expanded"),s=t.createElement("span","lh-snippet__btn-label-expand lh-snippet__show-if-collapsed");return o.append(" ",r," ",s," "),n.append(" ",a," ",i," ",o," "),e.append(n),e}function Po(t){let e=t.createFragment(),n=t.createElement("div","lh-snippet__line"),a=t.createElement("div","lh-snippet__line-number"),i=t.createElement("div","lh-snippet__line-icon"),o=t.createElement("code");return n.append(" ",a," ",i," ",o," "),e.append(n),e}function Ao(t){let e=t.createFragment(),n=t.createElement("style");return n.append(`/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/*
  Naming convention:

  If a variable is used for a specific component: --{component}-{property name}-{modifier}

  Both {component} and {property name} should be kebab-case. If the target is the entire page,
  use 'report' for the component. The property name should not be abbreviated. Use the
  property name the variable is intended for - if it's used for multiple, a common descriptor
  is fine (ex: 'size' for a variable applied to 'width' and 'height'). If a variable is shared
  across multiple components, either create more variables or just drop the "{component}-"
  part of the name. Append any modifiers at the end (ex: 'big', 'dark').

  For colors: --color-{hue}-{intensity}

  {intensity} is the Material Design tag - 700, A700, etc.
*/
.lh-vars {
  /* Palette using Material Design Colors
   * https://www.materialui.co/colors */
  --color-amber-50: #FFF8E1;
  --color-blue-200: #90CAF9;
  --color-blue-900: #0D47A1;
  --color-blue-A700: #2962FF;
  --color-blue-primary: #06f;
  --color-cyan-500: #00BCD4;
  --color-gray-100: #F5F5F5;
  --color-gray-300: #CFCFCF;
  --color-gray-200: #E0E0E0;
  --color-gray-400: #BDBDBD;
  --color-gray-50: #FAFAFA;
  --color-gray-500: #9E9E9E;
  --color-gray-600: #757575;
  --color-gray-700: #616161;
  --color-gray-800: #424242;
  --color-gray-900: #212121;
  --color-gray: #000000;
  --color-green-700: #080;
  --color-green: #0c6;
  --color-lime-400: #D3E156;
  --color-orange-50: #FFF3E0;
  --color-orange-700: #C33300;
  --color-orange: #fa3;
  --color-red-700: #c00;
  --color-red: #f33;
  --color-teal-600: #00897B;
  --color-white: #FFFFFF;

  /* Context-specific colors */
  --color-average-secondary: var(--color-orange-700);
  --color-average: var(--color-orange);
  --color-fail-secondary: var(--color-red-700);
  --color-fail: var(--color-red);
  --color-hover: var(--color-gray-50);
  --color-informative: var(--color-blue-900);
  --color-pass-secondary: var(--color-green-700);
  --color-pass: var(--color-green);
  --color-not-applicable: var(--color-gray-600);

  /* Component variables */
  --audit-description-padding-left: calc(var(--score-icon-size) + var(--score-icon-margin-left) + var(--score-icon-margin-right));
  --audit-explanation-line-height: 16px;
  --audit-group-margin-bottom: calc(var(--default-padding) * 6);
  --audit-group-padding-vertical: 8px;
  --audit-margin-horizontal: 5px;
  --audit-padding-vertical: 8px;
  --category-padding: calc(var(--default-padding) * 6) var(--edge-gap-padding) calc(var(--default-padding) * 4);
  --chevron-line-stroke: var(--color-gray-600);
  --chevron-size: 12px;
  --default-padding: 8px;
  --edge-gap-padding: calc(var(--default-padding) * 4);
  --env-item-background-color: var(--color-gray-100);
  --env-item-font-size: 28px;
  --env-item-line-height: 36px;
  --env-item-padding: 10px 0px;
  --env-name-min-width: 220px;
  --footer-padding-vertical: 16px;
  --gauge-circle-size-big: 96px;
  --gauge-circle-size: 48px;
  --gauge-circle-size-sm: 32px;
  --gauge-label-font-size-big: 18px;
  --gauge-label-font-size: var(--report-font-size-secondary);
  --gauge-label-line-height-big: 24px;
  --gauge-label-line-height: var(--report-line-height-secondary);
  --gauge-percentage-font-size-big: 38px;
  --gauge-percentage-font-size: var(--report-font-size-secondary);
  --gauge-wrapper-width: 120px;
  --header-line-height: 24px;
  --highlighter-background-color: var(--report-text-color);
  --icon-square-size: calc(var(--score-icon-size) * 0.88);
  --image-preview-size: 48px;
  --link-color: var(--color-blue-primary);
  --locale-selector-background-color: var(--color-white);
  --metric-toggle-lines-fill: #7F7F7F;
  --metric-value-font-size: calc(var(--report-font-size) * 1.8);
  --metrics-toggle-background-color: var(--color-gray-200);
  --plugin-badge-background-color: var(--color-white);
  --plugin-badge-size-big: calc(var(--gauge-circle-size-big) / 2.7);
  --plugin-badge-size: calc(var(--gauge-circle-size) / 2.7);
  --plugin-icon-size: 65%;
  --report-background-color: #fff;
  --report-border-color-secondary: #ebebeb;
  --report-font-family-monospace: monospace, 'Roboto Mono', 'Menlo', 'dejavu sans mono', 'Consolas', 'Lucida Console';
  --report-font-family: system-ui, Roboto, Helvetica, Arial, sans-serif;
  --report-font-size: 14px;
  --report-font-size-secondary: 12px;
  --report-icon-size: var(--score-icon-background-size);
  --report-line-height: 24px;
  --report-line-height-secondary: 20px;
  --report-monospace-font-size: calc(var(--report-font-size) * 0.85);
  --report-text-color-secondary: var(--color-gray-800);
  --report-text-color: var(--color-gray-900);
  --report-content-max-width: calc(60 * var(--report-font-size)); /* defaults to 840px */
  --report-content-min-width: 360px;
  --report-content-max-width-minus-edge-gap: calc(var(--report-content-max-width) - var(--edge-gap-padding) * 2);
  --score-container-padding: 8px;
  --score-icon-background-size: 24px;
  --score-icon-margin-left: 6px;
  --score-icon-margin-right: 14px;
  --score-icon-margin: 0 var(--score-icon-margin-right) 0 var(--score-icon-margin-left);
  --score-icon-size: 12px;
  --score-icon-size-big: 16px;
  --screenshot-overlay-background: rgba(0, 0, 0, 0.3);
  --section-padding-vertical: calc(var(--default-padding) * 6);
  --snippet-background-color: var(--color-gray-50);
  --snippet-color: #0938C2;
  --stackpack-padding-horizontal: 10px;
  --sticky-header-background-color: var(--report-background-color);
  --sticky-header-buffer: var(--topbar-height);
  --sticky-header-height: calc(var(--gauge-circle-size-sm) + var(--score-container-padding) * 2 + 1em);
  --table-group-header-background-color: #EEF1F4;
  --table-group-header-text-color: var(--color-gray-700);
  --table-higlight-background-color: #F5F7FA;
  --tools-icon-color: var(--color-gray-600);
  --topbar-background-color: var(--color-white);
  --topbar-height: 32px;
  --topbar-logo-size: 24px;
  --topbar-padding: 0 8px;
  --toplevel-warning-background-color: hsla(30, 100%, 75%, 10%);
  --toplevel-warning-message-text-color: var(--color-average-secondary);
  --toplevel-warning-padding: 18px;
  --toplevel-warning-text-color: var(--report-text-color);

  /* SVGs */
  --plugin-icon-url-dark: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="%23FFFFFF"><path d="M0 0h24v24H0z" fill="none"/><path d="M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5C13 2.12 11.88 1 10.5 1S8 2.12 8 3.5V5H4c-1.1 0-1.99.9-1.99 2v3.8H3.5c1.49 0 2.7 1.21 2.7 2.7s-1.21 2.7-2.7 2.7H2V20c0 1.1.9 2 2 2h3.8v-1.5c0-1.49 1.21-2.7 2.7-2.7 1.49 0 2.7 1.21 2.7 2.7V22H17c1.1 0 2-.9 2-2v-4h1.5c1.38 0 2.5-1.12 2.5-2.5S21.88 11 20.5 11z"/></svg>');
  --plugin-icon-url: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="%23757575"><path d="M0 0h24v24H0z" fill="none"/><path d="M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5C13 2.12 11.88 1 10.5 1S8 2.12 8 3.5V5H4c-1.1 0-1.99.9-1.99 2v3.8H3.5c1.49 0 2.7 1.21 2.7 2.7s-1.21 2.7-2.7 2.7H2V20c0 1.1.9 2 2 2h3.8v-1.5c0-1.49 1.21-2.7 2.7-2.7 1.49 0 2.7 1.21 2.7 2.7V22H17c1.1 0 2-.9 2-2v-4h1.5c1.38 0 2.5-1.12 2.5-2.5S21.88 11 20.5 11z"/></svg>');

  --pass-icon-url: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><title>check</title><path fill="%23178239" d="M24 4C12.95 4 4 12.95 4 24c0 11.04 8.95 20 20 20 11.04 0 20-8.96 20-20 0-11.05-8.96-20-20-20zm-4 30L10 24l2.83-2.83L20 28.34l15.17-15.17L38 16 20 34z"/></svg>');
  --average-icon-url: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><title>info</title><path fill="%23E67700" d="M24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4zm2 30h-4V22h4v12zm0-16h-4v-4h4v4z"/></svg>');
  --fail-icon-url: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><title>warn</title><path fill="%23C7221F" d="M2 42h44L24 4 2 42zm24-6h-4v-4h4v4zm0-8h-4v-8h4v8z"/></svg>');
  --error-icon-url: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 15"><title>error</title><path d="M0 15H 3V 12H 0V" fill="%23FF4E42"/><path d="M0 9H 3V 0H 0V" fill="%23FF4E42"/></svg>');

  --swap-locale-icon-url: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="%23000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/></svg>');

  --insights-icon-url: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="%23000000"><path d="M18 13V11H22V13H18ZM19.2 20L16 17.6L17.2 16L20.4 18.4L19.2 20ZM17.2 8L16 6.4L19.2 4L20.4 5.6L17.2 8ZM5 19V15H4C3.45 15 2.975 14.8083 2.575 14.425C2.19167 14.025 2 13.55 2 13V11C2 10.45 2.19167 9.98333 2.575 9.6C2.975 9.2 3.45 9 4 9H8L13 6V18L8 15H7V19H5ZM11 14.45V9.55L8.55 11H4V13H8.55L11 14.45ZM14 15.35V8.65C14.45 9.05 14.8083 9.54167 15.075 10.125C15.3583 10.6917 15.5 11.3167 15.5 12C15.5 12.6833 15.3583 13.3167 15.075 13.9C14.8083 14.4667 14.45 14.95 14 15.35Z"/></svg>');
  --insights-icon-url-dark: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="%239e9e9e"><path d="M18 13V11H22V13H18ZM19.2 20L16 17.6L17.2 16L20.4 18.4L19.2 20ZM17.2 8L16 6.4L19.2 4L20.4 5.6L17.2 8ZM5 19V15H4C3.45 15 2.975 14.8083 2.575 14.425C2.19167 14.025 2 13.55 2 13V11C2 10.45 2.19167 9.98333 2.575 9.6C2.975 9.2 3.45 9 4 9H8L13 6V18L8 15H7V19H5ZM11 14.45V9.55L8.55 11H4V13H8.55L11 14.45ZM14 15.35V8.65C14.45 9.05 14.8083 9.54167 15.075 10.125C15.3583 10.6917 15.5 11.3167 15.5 12C15.5 12.6833 15.3583 13.3167 15.075 13.9C14.8083 14.4667 14.45 14.95 14 15.35Z"/></svg>');
}

@media not print {
  .lh-dark {
    /* Pallete */
    --color-gray-200: var(--color-gray-800);
    --color-gray-300: #616161;
    --color-gray-400: var(--color-gray-600);
    --color-gray-700: var(--color-gray-400);
    --color-gray-50: #757575;
    --color-gray-600: var(--color-gray-500);
    --color-green-700: var(--color-green);
    --color-orange-700: var(--color-orange);
    --color-red-700: var(--color-red);
    --color-teal-600: var(--color-cyan-500);

    /* Context-specific colors */
    --color-hover: rgba(0, 0, 0, 0.2);
    --color-informative: var(--color-blue-200);

    /* Component variables */
    --env-item-background-color: #393535;
    --link-color: var(--color-blue-200);
    --locale-selector-background-color: var(--color-gray-200);
    --plugin-badge-background-color: var(--color-gray-800);
    --report-background-color: var(--color-gray-900);
    --report-border-color-secondary: var(--color-gray-200);
    --report-text-color-secondary: var(--color-gray-400);
    --report-text-color: var(--color-gray-100);
    --snippet-color: var(--color-cyan-500);
    --topbar-background-color: var(--color-gray);
    --toplevel-warning-background-color: hsl(33deg 14% 18%);
    --toplevel-warning-message-text-color: var(--color-orange-700);
    --toplevel-warning-text-color: var(--color-gray-100);
    --table-group-header-background-color: rgba(186, 196, 206, 0.15);
    --table-group-header-text-color: var(--color-gray-100);
    --table-higlight-background-color: rgba(186, 196, 206, 0.09);

    /* SVGs */
    --plugin-icon-url: var(--plugin-icon-url-dark);
  }
}

/**
* This media query is a temporary fallback for browsers that do not support \`@container query\`.
* TODO: remove this media query when \`@container query\` is fully supported by browsers
* See https://github.com/GoogleChrome/lighthouse/pull/16332
*/
@media only screen and (max-width: 480px) {
  .lh-vars {
    --audit-group-margin-bottom: 20px;
    --edge-gap-padding: var(--default-padding);
    --env-name-min-width: 120px;
    --gauge-circle-size-big: 96px;
    --gauge-circle-size: 72px;
    --gauge-label-font-size-big: 22px;
    --gauge-label-font-size: 14px;
    --gauge-label-line-height-big: 26px;
    --gauge-label-line-height: 20px;
    --gauge-percentage-font-size-big: 34px;
    --gauge-percentage-font-size: 26px;
    --gauge-wrapper-width: 112px;
    --header-padding: 16px 0 16px 0;
    --image-preview-size: 24px;
    --plugin-icon-size: 75%;
    --report-font-size: 14px;
    --report-line-height: 20px;
    --score-icon-margin-left: 2px;
    --score-icon-size: 10px;
    --topbar-height: 28px;
    --topbar-logo-size: 20px;
  }
}

@container lh-container (max-width: 480px) {
  .lh-vars {
    --audit-group-margin-bottom: 20px;
    --edge-gap-padding: var(--default-padding);
    --env-name-min-width: 120px;
    --gauge-circle-size-big: 96px;
    --gauge-circle-size: 72px;
    --gauge-label-font-size-big: 22px;
    --gauge-label-font-size: 14px;
    --gauge-label-line-height-big: 26px;
    --gauge-label-line-height: 20px;
    --gauge-percentage-font-size-big: 34px;
    --gauge-percentage-font-size: 26px;
    --gauge-wrapper-width: 112px;
    --header-padding: 16px 0 16px 0;
    --image-preview-size: 24px;
    --plugin-icon-size: 75%;
    --report-font-size: 14px;
    --report-line-height: 20px;
    --score-icon-margin-left: 2px;
    --score-icon-size: 10px;
    --topbar-height: 28px;
    --topbar-logo-size: 20px;
  }
}

.lh-vars.lh-devtools {
  --audit-explanation-line-height: 14px;
  --audit-group-margin-bottom: 20px;
  --audit-group-padding-vertical: 12px;
  --audit-padding-vertical: 4px;
  --category-padding: 12px;
  --default-padding: 12px;
  --env-name-min-width: 120px;
  --footer-padding-vertical: 8px;
  --gauge-circle-size-big: 72px;
  --gauge-circle-size: 64px;
  --gauge-label-font-size-big: 22px;
  --gauge-label-font-size: 14px;
  --gauge-label-line-height-big: 26px;
  --gauge-label-line-height: 20px;
  --gauge-percentage-font-size-big: 34px;
  --gauge-percentage-font-size: 26px;
  --gauge-wrapper-width: 97px;
  --header-line-height: 20px;
  --header-padding: 16px 0 16px 0;
  --screenshot-overlay-background: transparent;
  --plugin-icon-size: 75%;
  --report-font-size: 12px;
  --report-line-height: 20px;
  --score-icon-margin-left: 2px;
  --score-icon-size: 10px;
  --section-padding-vertical: 8px;
}

.lh-container:has(.lh-sticky-header) {
  --sticky-header-buffer: calc(var(--topbar-height) + var(--sticky-header-height));
}

.lh-container:not(.lh-topbar + .lh-container) {
  --topbar-height: 0;
  --sticky-header-height: 0;
  --sticky-header-buffer: 0;
}

.lh-max-viewport {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
}

.lh-devtools.lh-root {
  height: 100%;
}
.lh-devtools.lh-root img {
  /* Override devtools default 'min-width: 0' so svg without size in a flexbox isn't collapsed. */
  min-width: auto;
}
.lh-devtools .lh-container {
  overflow-y: scroll;
  height: calc(100% - var(--topbar-height));
  /** The .lh-container is the scroll parent in DevTools so we exclude the topbar from the sticky header buffer. */
  --sticky-header-buffer: 0;
}
.lh-devtools .lh-container:has(.lh-sticky-header) {
  /** The .lh-container is the scroll parent in DevTools so we exclude the topbar from the sticky header buffer. */
  --sticky-header-buffer: var(--sticky-header-height);
}
@media print {
  .lh-devtools .lh-container {
    overflow: unset;
  }
}
.lh-devtools .lh-sticky-header {
  /* This is normally the height of the topbar, but we want it to stick to the top of our scroll container .lh-container\` */
  top: 0;
}
.lh-devtools .lh-element-screenshot__overlay {
  position: absolute;
}

@keyframes fadeIn {
  0% { opacity: 0;}
  100% { opacity: 0.6;}
}

.lh-root *, .lh-root *::before, .lh-root *::after {
  box-sizing: border-box;
}

.lh-root {
  font-family: var(--report-font-family);
  font-size: var(--report-font-size);
  margin: 0;
  line-height: var(--report-line-height);
  background: var(--report-background-color);
  color: var(--report-text-color);
}

.lh-root :focus-visible {
    outline: -webkit-focus-ring-color auto 3px;
}
.lh-root summary:focus {
    outline: none;
    box-shadow: 0 0 0 1px hsl(217, 89%, 61%);
}

.lh-root [hidden] {
  display: none !important;
}

.lh-root pre {
  margin: 0;
}

.lh-root pre,
.lh-root code {
  font-family: var(--report-font-family-monospace);
}

.lh-root details > summary {
  cursor: pointer;
}

.lh-hidden {
  display: none !important;
}

.lh-container {
  /*
  Text wrapping in the report is so much FUN!
  We have a \`word-break: break-word;\` globally here to prevent a few common scenarios, namely
  long non-breakable text (usually URLs) found in:
    1. The footer
    2. .lh-node (outerHTML)
    3. .lh-code

  With that sorted, the next challenge is appropriate column sizing and text wrapping inside our
  .lh-details tables. Even more fun.
    * We don't want table headers ("Est Savings (ms)") to wrap or their column values, but
      we'd be happy for the URL column to wrap if the URLs are particularly long.
    * We want the narrow columns to remain narrow, providing the most column width for URL
    * We don't want the table to extend past 100% width.
    * Long URLs in the URL column can wrap. Util.getURLDisplayName maxes them out at 64 characters,
      but they do not get any overflow:ellipsis treatment.
  */
  word-break: break-word;

  container-name: lh-container;
  container-type: inline-size;
}

.lh-audit-group a,
.lh-category-header__description a,
.lh-audit__description a,
.lh-warnings a,
.lh-footer a,
.lh-table-column--link a {
  color: var(--link-color);
}

.lh-audit__description, .lh-audit__stackpack {
  --inner-audit-padding-right: var(--stackpack-padding-horizontal);
  padding-left: var(--audit-description-padding-left);
  padding-right: var(--inner-audit-padding-right);
  padding-top: 8px;
  padding-bottom: 8px;
}

.lh-details {
  margin-top: var(--default-padding);
  margin-bottom: var(--default-padding);
  margin-left: var(--audit-description-padding-left);
}

.lh-audit__stackpack {
  display: flex;
  align-items: center;
}

.lh-audit__stackpack__img {
  max-width: 30px;
  margin-right: var(--default-padding)
}

/* Report header */

.lh-report-icon {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  cursor: pointer;
}
.lh-report-icon[disabled] {
  opacity: 0.3;
  pointer-events: none;
}

.lh-report-icon::before {
  content: "";
  margin: 4px;
  background-repeat: no-repeat;
  width: var(--report-icon-size);
  height: var(--report-icon-size);
  opacity: 0.7;
  display: inline-block;
  vertical-align: middle;
}
.lh-report-icon:hover::before {
  opacity: 1;
}
.lh-dark .lh-report-icon::before {
  filter: invert(1);
}
.lh-report-icon--print::before {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/><path fill="none" d="M0 0h24v24H0z"/></svg>');
}
.lh-report-icon--copy::before {
  background-image: url('data:image/svg+xml;utf8,<svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"/><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>');
}
.lh-report-icon--open::before {
  background-image: url('data:image/svg+xml;utf8,<svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 4H5c-1.11 0-2 .9-2 2v12c0 1.1.89 2 2 2h4v-2H5V8h14v10h-4v2h4c1.1 0 2-.9 2-2V6c0-1.1-.89-2-2-2zm-7 6l-4 4h3v6h2v-6h3l-4-4z"/></svg>');
}
.lh-report-icon--download::before {
  background-image: url('data:image/svg+xml;utf8,<svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>');
}
.lh-report-icon--dark::before {
  background-image:url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 100 125"><path d="M50 23.587c-16.27 0-22.799 12.574-22.799 21.417 0 12.917 10.117 22.451 12.436 32.471h20.726c2.32-10.02 12.436-19.554 12.436-32.471 0-8.843-6.528-21.417-22.799-21.417zM39.637 87.161c0 3.001 1.18 4.181 4.181 4.181h.426l.41 1.231C45.278 94.449 46.042 95 48.019 95h3.963c1.978 0 2.74-.551 3.365-2.427l.409-1.231h.427c3.002 0 4.18-1.18 4.18-4.181V80.91H39.637v6.251zM50 18.265c1.26 0 2.072-.814 2.072-2.073v-9.12C52.072 5.813 51.26 5 50 5c-1.259 0-2.072.813-2.072 2.073v9.12c0 1.259.813 2.072 2.072 2.072zM68.313 23.727c.994.774 2.135.634 2.91-.357l5.614-7.187c.776-.992.636-2.135-.356-2.909-.992-.776-2.135-.636-2.91.357l-5.613 7.186c-.778.993-.636 2.135.355 2.91zM91.157 36.373c-.306-1.222-1.291-1.815-2.513-1.51l-8.85 2.207c-1.222.305-1.814 1.29-1.51 2.512.305 1.223 1.291 1.814 2.513 1.51l8.849-2.206c1.223-.305 1.816-1.291 1.511-2.513zM86.757 60.48l-8.331-3.709c-1.15-.512-2.225-.099-2.736 1.052-.512 1.151-.1 2.224 1.051 2.737l8.33 3.707c1.15.514 2.225.101 2.736-1.05.513-1.149.1-2.223-1.05-2.737zM28.779 23.37c.775.992 1.917 1.131 2.909.357.992-.776 1.132-1.917.357-2.91l-5.615-7.186c-.775-.992-1.917-1.132-2.909-.357s-1.131 1.917-.356 2.909l5.614 7.187zM21.715 39.583c.305-1.223-.288-2.208-1.51-2.513l-8.849-2.207c-1.222-.303-2.208.289-2.513 1.511-.303 1.222.288 2.207 1.511 2.512l8.848 2.206c1.222.304 2.208-.287 2.513-1.509zM21.575 56.771l-8.331 3.711c-1.151.511-1.563 1.586-1.05 2.735.511 1.151 1.586 1.563 2.736 1.052l8.331-3.711c1.151-.511 1.563-1.586 1.05-2.735-.512-1.15-1.585-1.562-2.736-1.052z"/></svg>');
}
.lh-report-icon--treemap::before {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="black"><path d="M3 5v14h19V5H3zm2 2h15v4H5V7zm0 10v-4h4v4H5zm6 0v-4h9v4h-9z"/></svg>');
}

.lh-report-icon--date::before {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M7 11h2v2H7v-2zm14-5v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6c0-1.1.9-2 2-2h1V2h2v2h8V2h2v2h1a2 2 0 012 2zM5 8h14V6H5v2zm14 12V10H5v10h14zm-4-7h2v-2h-2v2zm-4 0h2v-2h-2v2z"/></svg>');
}
.lh-report-icon--devices::before {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M4 6h18V4H4a2 2 0 00-2 2v11H0v3h14v-3H4V6zm19 2h-6a1 1 0 00-1 1v10c0 .6.5 1 1 1h6c.6 0 1-.5 1-1V9c0-.6-.5-1-1-1zm-1 9h-4v-7h4v7z"/></svg>');
}
.lh-report-icon--world::before {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm7 6h-3c-.3-1.3-.8-2.5-1.4-3.6A8 8 0 0 1 18.9 8zm-7-4a14 14 0 0 1 2 4h-4a14 14 0 0 1 2-4zM4.3 14a8.2 8.2 0 0 1 0-4h3.3a16.5 16.5 0 0 0 0 4H4.3zm.8 2h3a14 14 0 0 0 1.3 3.6A8 8 0 0 1 5.1 16zm3-8H5a8 8 0 0 1 4.3-3.6L8 8zM12 20a14 14 0 0 1-2-4h4a14 14 0 0 1-2 4zm2.3-6H9.7a14.7 14.7 0 0 1 0-4h4.6a14.6 14.6 0 0 1 0 4zm.3 5.6c.6-1.2 1-2.4 1.4-3.6h3a8 8 0 0 1-4.4 3.6zm1.8-5.6a16.5 16.5 0 0 0 0-4h3.3a8.2 8.2 0 0 1 0 4h-3.3z"/></svg>');
}
.lh-report-icon--stopwatch::before {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.1-6.6L20.5 6l-1.4-1.4L17.7 6A9 9 0 0 0 3 13a9 9 0 1 0 16-5.6zm-7 12.6a7 7 0 1 1 0-14 7 7 0 0 1 0 14z"/></svg>');
}
.lh-report-icon--networkspeed::before {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.9 5c-.2 0-.3 0-.4.2v.2L10.1 17a2 2 0 0 0-.2 1 2 2 0 0 0 4 .4l2.4-12.9c0-.3-.2-.5-.5-.5zM1 9l2 2c2.9-2.9 6.8-4 10.5-3.6l1.2-2.7C10 3.8 4.7 5.3 1 9zm20 2 2-2a15.4 15.4 0 0 0-5.6-3.6L17 8.2c1.5.7 2.9 1.6 4.1 2.8zm-4 4 2-2a9.9 9.9 0 0 0-2.7-1.9l-.5 3 1.2.9zM5 13l2 2a7.1 7.1 0 0 1 4-2l1.3-2.9C9.7 10.1 7 11 5 13z"/></svg>');
}
.lh-report-icon--samples-one::before {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="7" cy="14" r="3"/><path d="M7 18a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm4-2a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm5.6 17.6a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>');
}
.lh-report-icon--samples-many::before {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M7 18a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm4-2a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm5.6 17.6a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/><circle cx="7" cy="14" r="3"/><circle cx="11" cy="6" r="3"/></svg>');
}
.lh-report-icon--chrome::before {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="-50 -50 562 562"><path d="M256 25.6v25.6a204 204 0 0 1 144.8 60 204 204 0 0 1 60 144.8 204 204 0 0 1-60 144.8 204 204 0 0 1-144.8 60 204 204 0 0 1-144.8-60 204 204 0 0 1-60-144.8 204 204 0 0 1 60-144.8 204 204 0 0 1 144.8-60V0a256 256 0 1 0 0 512 256 256 0 0 0 0-512v25.6z"/><path d="M256 179.2v25.6a51.3 51.3 0 0 1 0 102.4 51.3 51.3 0 0 1 0-102.4v-51.2a102.3 102.3 0 1 0-.1 204.7 102.3 102.3 0 0 0 .1-204.7v25.6z"/><path d="M256 204.8h217.6a25.6 25.6 0 0 0 0-51.2H256a25.6 25.6 0 0 0 0 51.2m44.3 76.8L191.5 470.1a25.6 25.6 0 1 0 44.4 25.6l108.8-188.5a25.6 25.6 0 1 0-44.4-25.6m-88.6 0L102.9 93.2a25.7 25.7 0 0 0-35-9.4 25.7 25.7 0 0 0-9.4 35l108.8 188.5a25.7 25.7 0 0 0 35 9.4 25.9 25.9 0 0 0 9.4-35.1"/></svg>');
}
.lh-report-icon--external::before {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"><path d="M3.15 11.9a1.01 1.01 0 0 1-.743-.307 1.01 1.01 0 0 1-.306-.743v-7.7c0-.292.102-.54.306-.744a1.01 1.01 0 0 1 .744-.306H7v1.05H3.15v7.7h7.7V7h1.05v3.85c0 .291-.103.54-.307.743a1.01 1.01 0 0 1-.743.307h-7.7Zm2.494-2.8-.743-.744 5.206-5.206H8.401V2.1h3.5v3.5h-1.05V3.893L5.644 9.1Z"/></svg>');
}
.lh-report-icon--experiment::before {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none"><path d="M4.50002 17C3.86136 17 3.40302 16.7187 3.12502 16.156C2.84702 15.5933 2.90936 15.069 3.31202 14.583L7.50002 9.5V4.5H6.75002C6.54202 4.5 6.36502 4.427 6.21902 4.281C6.07302 4.135 6.00002 3.958 6.00002 3.75C6.00002 3.542 6.07302 3.365 6.21902 3.219C6.36502 3.073 6.54202 3 6.75002 3H13.25C13.458 3 13.635 3.073 13.781 3.219C13.927 3.365 14 3.542 14 3.75C14 3.958 13.927 4.135 13.781 4.281C13.635 4.427 13.458 4.5 13.25 4.5H12.5V9.5L16.688 14.583C17.0767 15.069 17.132 15.5933 16.854 16.156C16.5767 16.7187 16.1254 17 15.5 17H4.50002ZM4.50002 15.5H15.5L11 10V4.5H9.00002V10L4.50002 15.5Z" fill="black"/></svg>');
}

/** These are still icons, but w/o the auto-color invert / opacity / etc. that come with .lh-report-icon */

.lh-report-plain-icon {
  display: flex;
  align-items: center;
}
.lh-report-plain-icon::before {
  content: "";
  background-repeat: no-repeat;
  width: var(--report-icon-size);
  height: var(--report-icon-size);
  display: inline-block;
  margin-right: 5px;
}

.lh-report-plain-icon--checklist-pass::before {
  --icon-url: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M8.938 13L13.896 8.062L12.833 7L8.938 10.875L7.167 9.125L6.104 10.188L8.938 13ZM10 18C8.90267 18 7.868 17.7917 6.896 17.375C5.924 16.9583 5.07333 16.3853 4.344 15.656C3.61467 14.9267 3.04167 14.076 2.625 13.104C2.20833 12.132 2 11.0973 2 10C2 8.88867 2.20833 7.85033 2.625 6.885C3.04167 5.92033 3.61467 5.07333 4.344 4.344C5.07333 3.61467 5.924 3.04167 6.896 2.625C7.868 2.20833 8.90267 2 10 2C11.1113 2 12.1497 2.20833 13.115 2.625C14.0797 3.04167 14.9267 3.61467 15.656 4.344C16.3853 5.07333 16.9583 5.92033 17.375 6.885C17.7917 7.85033 18 8.88867 18 10C18 11.0973 17.7917 12.132 17.375 13.104C16.9583 14.076 16.3853 14.9267 15.656 15.656C14.9267 16.3853 14.0797 16.9583 13.115 17.375C12.1497 17.7917 11.1113 18 10 18ZM10 16.5C11.8053 16.5 13.34 15.868 14.604 14.604C15.868 13.34 16.5 11.8053 16.5 10C16.5 8.19467 15.868 6.66 14.604 5.396C13.34 4.132 11.8053 3.5 10 3.5C8.19467 3.5 6.66 4.132 5.396 5.396C4.132 6.66 3.5 8.19467 3.5 10C3.5 11.8053 4.132 13.34 5.396 14.604C6.66 15.868 8.19467 16.5 10 16.5Z" fill="black"/></svg>');
  background-color: var(--color-pass);
  mask: var(--icon-url) center / contain no-repeat;
}
.lh-report-plain-icon--checklist-fail::before {
  --icon-url: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C5.85786 17.5 2.5 14.1421 2.5 10C2.5 5.85786 5.85786 2.5 10 2.5C14.1421 2.5 17.5 5.85786 17.5 10ZM16 10C16 13.3137 13.3137 16 10 16C8.6135 16 7.33683 15.5297 6.32083 14.7399L14.7399 6.32083C15.5297 7.33683 16 8.6135 16 10ZM5.26016 13.6793L13.6793 5.26016C12.6633 4.47033 11.3866 4 10 4C6.68629 4 4 6.68629 4 10C4 11.3866 4.47033 12.6633 5.26016 13.6793Z" fill="black"/></svg>');
  background-color: var(--color-fail);
  mask: var(--icon-url) center / contain no-repeat;
}

.lh-buttons {
  display: flex;
  flex-wrap: wrap;
  margin: var(--default-padding) 0;
}
.lh-button {
  height: 32px;
  border: 1px solid var(--report-border-color-secondary);
  border-radius: 3px;
  color: var(--link-color);
  background-color: var(--report-background-color);
  margin: 5px;
}

.lh-button:first-of-type {
  margin-left: 0;
}

/* Node */
.lh-node {
  display: flow-root;
}

.lh-node__snippet {
  font-family: var(--report-font-family-monospace);
  color: var(--snippet-color);
  font-size: var(--report-monospace-font-size);
  line-height: 20px;
}

.lh-checklist {
  list-style: none;
  padding: 0;
}

.lh-checklist-item {
  margin: 10px 0 10px 0;
}

/* Score */

.lh-audit__score-icon {
  width: var(--score-icon-size);
  height: var(--score-icon-size);
  margin: var(--score-icon-margin);
}

.lh-audit--pass .lh-audit__display-text {
  color: var(--color-pass-secondary);
}
.lh-audit--pass .lh-audit__score-icon,
.lh-scorescale-range--pass::before {
  border-radius: 100%;
  background: var(--color-pass);
}

.lh-audit--average .lh-audit__display-text {
  color: var(--color-average-secondary);
}
.lh-audit--average .lh-audit__score-icon,
.lh-scorescale-range--average::before {
  background: var(--color-average);
  width: var(--icon-square-size);
  height: var(--icon-square-size);
}

.lh-audit--fail .lh-audit__display-text {
  color: var(--color-fail-secondary);
}
.lh-audit--fail .lh-audit__score-icon,
.lh-audit--error .lh-audit__score-icon,
.lh-scorescale-range--fail::before {
  border-left: calc(var(--score-icon-size) / 2) solid transparent;
  border-right: calc(var(--score-icon-size) / 2) solid transparent;
  border-bottom: var(--score-icon-size) solid var(--color-fail);
}

.lh-audit--error .lh-audit__score-icon,
.lh-metric--error .lh-metric__icon {
  background-image: var(--error-icon-url);
  background-repeat: no-repeat;
  background-position: center;
  border: none;
}

.lh-gauge__wrapper--fail .lh-gauge--error {
  background-image: var(--error-icon-url);
  background-repeat: no-repeat;
  background-position: center;
  transform: scale(0.5);
  top: var(--score-container-padding);
}

.lh-audit--manual .lh-audit__display-text,
.lh-audit--notapplicable .lh-audit__display-text {
  color: var(--color-gray-600);
}
.lh-audit--manual .lh-audit__score-icon,
.lh-audit--notapplicable .lh-audit__score-icon {
  border: calc(0.2 * var(--score-icon-size)) solid var(--color-gray-400);
  border-radius: 100%;
  background: none;
}

.lh-audit--informative .lh-audit__display-text {
  color: var(--color-gray-600);
}

.lh-audit--informative .lh-audit__score-icon {
  border: calc(0.2 * var(--score-icon-size)) solid var(--color-gray-400);
  border-radius: 100%;
}

.lh-audit__description,
.lh-audit__stackpack {
  color: var(--report-text-color-secondary);
}
.lh-audit__adorn {
  border: 1px solid var(--color-gray-500);
  border-radius: 3px;
  margin: 0 3px;
  padding: 0 2px;
  line-height: 1.1;
  display: inline-block;
  font-size: 90%;
  color: var(--report-text-color-secondary);
}

.lh-category-header__description  {
  text-align: center;
  color: var(--color-gray-700);
  margin: 0px auto;
  max-width: 400px;
}


.lh-audit__display-text,
.lh-chevron-container {
  margin: 0 var(--audit-margin-horizontal);
}
.lh-chevron-container {
  margin-right: 0;
}

.lh-audit__title-and-text {
  flex: 1;
}

.lh-audit__title-and-text code {
  color: var(--snippet-color);
  font-size: var(--report-monospace-font-size);
}

/* Prepend display text with em dash separator. */
.lh-audit__display-text:not(:empty):before {
  content: '—';
  margin-right: var(--audit-margin-horizontal);
}

/* Expandable Details (Audit Groups, Audits) */
.lh-audit__header {
  display: flex;
  align-items: center;
  padding: var(--default-padding);
}


.lh-metricfilter {
  display: grid;
  justify-content: end;
  align-items: center;
  grid-auto-flow: column;
  gap: 4px;
  color: var(--color-gray-700);
}

.lh-metricfilter__radio {
  /*
   * Instead of hiding, position offscreen so it's still accessible to screen readers
   * https://bugs.chromium.org/p/chromium/issues/detail?id=1439785
   */
  position: fixed;
  left: -9999px;
}
.lh-metricfilter input[type='radio']:focus-visible + label {
  outline: -webkit-focus-ring-color auto 1px;
}

.lh-metricfilter__label {
  display: inline-flex;
  padding: 0 4px;
  height: 16px;
  text-decoration: underline;
  align-items: center;
  cursor: pointer;
  font-size: 90%;
}

.lh-metricfilter__label--active {
  background: var(--color-blue-primary);
  color: var(--color-white);
  border-radius: 3px;
  text-decoration: none;
}
/* Give the 'All' choice a more muted display */
.lh-metricfilter__label--active[for="metric-All"] {
  background-color: var(--color-blue-200) !important;
  color: black !important;
}

.lh-metricfilter__text {
  margin-right: 8px;
}

/* If audits are filtered, hide the itemcount for Passed Audits… */
.lh-category--filtered .lh-audit-group .lh-audit-group__itemcount {
  display: none;
}


.lh-audit__header:hover {
  background-color: var(--color-hover);
}

/* We want to hide the browser's default arrow marker on summary elements. Admittedly, it's complicated. */
.lh-root details > summary {
  /* Blink 89+ and Firefox will hide the arrow when display is changed from (new) default of \`list-item\` to block.  https://chromestatus.com/feature/6730096436051968*/
  display: block;
}
/* Safari and Blink <=88 require using the -webkit-details-marker selector */
.lh-root details > summary::-webkit-details-marker {
  display: none;
}

/* Perf Metric */

.lh-metrics-container {
  display: grid;
  grid-auto-rows: 1fr;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: var(--report-line-height);
  margin-bottom: var(--default-padding);
}

.lh-metric {
  border-top: 1px solid var(--report-border-color-secondary);
}

.lh-category:not(.lh--hoisted-meta) .lh-metric:nth-last-child(-n+2) {
  border-bottom: 1px solid var(--report-border-color-secondary);
}

.lh-metric__innerwrap {
  display: grid;
  /**
   * Icon -- Metric Name
   *      -- Metric Value
   */
  grid-template-columns: calc(var(--score-icon-size) + var(--score-icon-margin-left) + var(--score-icon-margin-right)) 1fr;
  align-items: center;
  padding: var(--default-padding);
}

.lh-metric__details {
  order: -1;
}

.lh-metric__title {
  flex: 1;
}

.lh-calclink {
  padding-left: calc(1ex / 3);
}

.lh-metric__description {
  display: none;
  grid-column-start: 2;
  grid-column-end: 4;
  color: var(--report-text-color-secondary);
}

.lh-metric__value {
  font-size: var(--metric-value-font-size);
  margin: calc(var(--default-padding) / 2) 0;
  white-space: nowrap; /* No wrapping between metric value and the icon */
  grid-column-start: 2;
}

/**
* This media query is a temporary fallback for browsers that do not support \`@container query\`.
* TODO: remove this media query when \`@container query\` is fully supported by browsers
* See https://github.com/GoogleChrome/lighthouse/pull/16332
*/
@media screen and (max-width: 535px) {
  .lh-metrics-container {
    display: block;
  }

  .lh-metric {
    border-bottom: none !important;
  }
  .lh-category:not(.lh--hoisted-meta) .lh-metric:nth-last-child(1) {
    border-bottom: 1px solid var(--report-border-color-secondary) !important;
  }

  /* Change the grid to 3 columns for narrow viewport. */
  .lh-metric__innerwrap {
  /**
   * Icon -- Metric Name -- Metric Value
   */
    grid-template-columns: calc(var(--score-icon-size) + var(--score-icon-margin-left) + var(--score-icon-margin-right)) 2fr 1fr;
  }
  .lh-metric__value {
    justify-self: end;
    grid-column-start: unset;
  }
}

@container lh-container (max-width: 535px) {
  .lh-metrics-container {
    display: block;
  }

  .lh-metric {
    border-bottom: none !important;
  }
  .lh-category:not(.lh--hoisted-meta) .lh-metric:nth-last-child(1) {
    border-bottom: 1px solid var(--report-border-color-secondary) !important;
  }

  /* Change the grid to 3 columns for narrow viewport. */
  .lh-metric__innerwrap {
  /**
   * Icon -- Metric Name -- Metric Value
   */
    grid-template-columns: calc(var(--score-icon-size) + var(--score-icon-margin-left) + var(--score-icon-margin-right)) 2fr 1fr;
  }
  .lh-metric__value {
    justify-self: end;
    grid-column-start: unset;
  }
}

/* No-JS toggle switch */
/* Keep this selector sync'd w/ \`magicSelector\` in report-ui-features-test.js */
 .lh-metrics-toggle__input:checked ~ .lh-metrics-container .lh-metric__description {
  display: block;
}

/* TODO get rid of the SVGS and clean up these some more */
.lh-metrics-toggle__input {
  opacity: 0;
  position: absolute;
  right: 0;
  top: 0px;
}

.lh-metrics-toggle__input + div > label > .lh-metrics-toggle__labeltext--hide,
.lh-metrics-toggle__input:checked + div > label > .lh-metrics-toggle__labeltext--show {
  display: none;
}
.lh-metrics-toggle__input:checked + div > label > .lh-metrics-toggle__labeltext--hide {
  display: inline;
}
.lh-metrics-toggle__input:focus + div > label {
  outline: -webkit-focus-ring-color auto 3px;
}

.lh-metrics-toggle__label {
  cursor: pointer;
  font-size: var(--report-font-size-secondary);
  line-height: var(--report-line-height-secondary);
  color: var(--color-gray-700);
}

/* Pushes the metric description toggle button to the right. */
.lh-audit-group--metrics .lh-audit-group__header {
  display: flex;
  justify-content: space-between;
}

.lh-metric__icon,
.lh-scorescale-range::before {
  content: '';
  width: var(--score-icon-size);
  height: var(--score-icon-size);
  display: inline-block;
  margin: var(--score-icon-margin);
}

.lh-metric--pass .lh-metric__value {
  color: var(--color-pass-secondary);
}
.lh-metric--pass .lh-metric__icon {
  border-radius: 100%;
  background: var(--color-pass);
}

.lh-metric--average .lh-metric__value {
  color: var(--color-average-secondary);
}
.lh-metric--average .lh-metric__icon {
  background: var(--color-average);
  width: var(--icon-square-size);
  height: var(--icon-square-size);
}

.lh-metric--fail .lh-metric__value {
  color: var(--color-fail-secondary);
}
.lh-metric--fail .lh-metric__icon {
  border-left: calc(var(--score-icon-size) / 2) solid transparent;
  border-right: calc(var(--score-icon-size) / 2) solid transparent;
  border-bottom: var(--score-icon-size) solid var(--color-fail);
}

.lh-metric--error .lh-metric__value,
.lh-metric--error .lh-metric__description {
  color: var(--color-fail-secondary);
}

/* Filmstrip */

.lh-filmstrip-container {
  /* smaller gap between metrics and filmstrip */
  margin: -8px auto 0 auto;
}

.lh-filmstrip {
  display: flex;
  justify-content: space-between;
  justify-items: center;
  margin-bottom: var(--default-padding);
  width: 100%;
}

.lh-filmstrip__frame {
  overflow: hidden;
  line-height: 0;
}

.lh-filmstrip__thumbnail {
  border: 1px solid var(--report-border-color-secondary);
  max-height: 150px;
  max-width: 120px;
}

/* Toggle Insights banner */
.lh-perf-insights-toggle {
  margin: calc(var(--default-padding) * 2) 0 var(--default-padding);
  display: flex;
  gap: var(--default-padding);
  align-items: center;
  background-color: rgba(30, 164, 70, 0.08);

  padding: var(--toplevel-warning-padding);
  border-radius: 8px;
}

.lh-perf-insights-toggle button {
  cursor: pointer;
  margin: 0;
  flex: 1;
}

.lh-perf-toggle-text {
  align-items: center;
  flex: 5;
}
.lh-dark .lh-perf-toggle-text {
  color: rgba(30, 164, 70, 1);
}

.lh-perf-toggle-text a {
  color: var(--link-color);
}

.lh-perf-insights-icon {
  margin: 4px;
  background-repeat: no-repeat;
  background-image: var(--insights-icon-url);
  width: var(--report-icon-size);
  height: var(--report-icon-size);
  display: inline-block;
  vertical-align: middle;
}

.lh-dark .lh-perf-insights-icon {
  background-image: var(--insights-icon-url-dark);
}

/* Audit */

.lh-audit {
  border-bottom: 1px solid var(--report-border-color-secondary);
}

/* Apply border-top to just the first audit. */
.lh-audit {
  border-top: 1px solid var(--report-border-color-secondary);
}
.lh-audit ~ .lh-audit {
  border-top: none;
}


.lh-audit--error .lh-audit__display-text {
  color: var(--color-fail-secondary);
}

/* Audit Group */

.lh-audit-group {
  margin-bottom: var(--audit-group-margin-bottom);
  position: relative;
}
.lh-audit-group--metrics {
  margin-bottom: calc(var(--audit-group-margin-bottom) / 2);
}

.lh-audit-group--metrics .lh-audit-group__summary {
  margin-top: 0;
  margin-bottom: 0;
}

.lh-audit-group__summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.lh-audit-group__header .lh-chevron {
  margin-top: calc((var(--report-line-height) - 5px) / 2);
}

.lh-audit-group__header {
  letter-spacing: 0.8px;
  padding: var(--default-padding);
  padding-left: 0;
}

.lh-audit-group__header, .lh-audit-group__summary {
  font-size: var(--report-font-size-secondary);
  line-height: var(--report-line-height-secondary);
  color: var(--color-gray-700);
}

.lh-audit-group__title {
  text-transform: uppercase;
  font-weight: 500;
}

.lh-audit-group__itemcount {
  color: var(--color-gray-600);
}

.lh-audit-group__footer {
  color: var(--color-gray-600);
  display: block;
  margin-top: var(--default-padding);
}

.lh-details,
.lh-category-header__description,
.lh-audit-group__footer {
  font-size: var(--report-font-size-secondary);
  line-height: var(--report-line-height-secondary);
}

.lh-audit-explanation {
  margin: var(--audit-padding-vertical) 0 calc(var(--audit-padding-vertical) / 2) var(--audit-margin-horizontal);
  line-height: var(--audit-explanation-line-height);
  display: inline-block;
}

.lh-audit--fail .lh-audit-explanation {
  color: var(--color-fail-secondary);
}

/* Report */
.lh-list {
  margin-right: calc(var(--default-padding) * 2);
}
.lh-list > :not(:last-child) {
  margin-bottom: calc(var(--default-padding) * 2);
  border-bottom: 1px solid #A8C7FA;
}

.lh-header-container {
  display: block;
  margin: 0 auto;
  position: relative;
  word-wrap: break-word;
}

.lh-header-container .lh-scores-wrapper {
  border-bottom: 1px solid var(--color-gray-200);
}


.lh-report {
  min-width: var(--report-content-min-width);
}

.lh-exception {
  font-size: large;
}

.lh-code {
  white-space: normal;
  margin-top: 0;
  font-size: var(--report-monospace-font-size);
}

.lh-warnings {
  --item-margin: calc(var(--report-line-height) / 6);
  color: var(--color-average-secondary);
  margin: var(--audit-padding-vertical) 0;
  padding: var(--default-padding)
    var(--default-padding)
    var(--default-padding)
    calc(var(--audit-description-padding-left));
  background-color: var(--toplevel-warning-background-color);
}
.lh-warnings span {
  font-weight: bold;
}

.lh-warnings--toplevel {
  --item-margin: calc(var(--header-line-height) / 4);
  color: var(--toplevel-warning-text-color);
  margin-left: auto;
  margin-right: auto;
  max-width: var(--report-content-max-width-minus-edge-gap);
  padding: var(--toplevel-warning-padding);
  border-radius: 8px;
}

.lh-warnings__msg {
  color: var(--toplevel-warning-message-text-color);
  margin: 0;
}

.lh-warnings ul {
  margin: 0;
}
.lh-warnings li {
  margin: var(--item-margin) 0;
}
.lh-warnings li:last-of-type {
  margin-bottom: 0;
}

.lh-scores-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.lh-scores-header__solo {
  padding: 0;
  border: 0;
}

/* Gauge */

.lh-gauge__wrapper--pass {
  color: var(--color-pass-secondary);
  fill: var(--color-pass);
  stroke: var(--color-pass);
}

.lh-gauge__wrapper--average {
  color: var(--color-average-secondary);
  fill: var(--color-average);
  stroke: var(--color-average);
}

.lh-gauge__wrapper--fail {
  color: var(--color-fail-secondary);
  fill: var(--color-fail);
  stroke: var(--color-fail);
}

.lh-gauge__wrapper--not-applicable {
  color: var(--color-not-applicable);
  fill: var(--color-not-applicable);
  stroke: var(--color-not-applicable);
}

.lh-fraction__wrapper .lh-fraction__content::before {
  content: '';
  height: var(--score-icon-size);
  width: var(--score-icon-size);
  margin: var(--score-icon-margin);
  display: inline-block;
}
.lh-fraction__wrapper--pass .lh-fraction__content {
  color: var(--color-pass-secondary);
}
.lh-fraction__wrapper--pass .lh-fraction__background {
  background-color: var(--color-pass);
}
.lh-fraction__wrapper--pass .lh-fraction__content::before {
  background-color: var(--color-pass);
  border-radius: 50%;
}
.lh-fraction__wrapper--average .lh-fraction__content {
  color: var(--color-average-secondary);
}
.lh-fraction__wrapper--average .lh-fraction__background,
.lh-fraction__wrapper--average .lh-fraction__content::before {
  background-color: var(--color-average);
}
.lh-fraction__wrapper--fail .lh-fraction__content {
  color: var(--color-fail);
}
.lh-fraction__wrapper--fail .lh-fraction__background {
  background-color: var(--color-fail);
}
.lh-fraction__wrapper--fail .lh-fraction__content::before {
  border-left: calc(var(--score-icon-size) / 2) solid transparent;
  border-right: calc(var(--score-icon-size) / 2) solid transparent;
  border-bottom: var(--score-icon-size) solid var(--color-fail);
}
.lh-fraction__wrapper--null .lh-fraction__content {
  color: var(--color-gray-700);
}
.lh-fraction__wrapper--null .lh-fraction__background {
  background-color: var(--color-gray-700);
}
.lh-fraction__wrapper--null .lh-fraction__content::before {
  border-radius: 50%;
  border: calc(0.2 * var(--score-icon-size)) solid var(--color-gray-700);
}

.lh-fraction__background {
  position: absolute;
  height: 100%;
  width: 100%;
  border-radius: calc(var(--gauge-circle-size) / 2);
  opacity: 0.1;
  z-index: -1;
}

.lh-fraction__content-wrapper {
  height: var(--gauge-circle-size);
  display: flex;
  align-items: center;
}

.lh-fraction__content {
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  font-size: calc(0.3 * var(--gauge-circle-size));
  line-height: calc(0.4 * var(--gauge-circle-size));
  width: max-content;
  min-width: calc(1.5 * var(--gauge-circle-size));
  padding: calc(0.1 * var(--gauge-circle-size)) calc(0.2 * var(--gauge-circle-size));
  --score-icon-size: calc(0.21 * var(--gauge-circle-size));
  --score-icon-margin: 0 calc(0.15 * var(--gauge-circle-size)) 0 0;
}

.lh-gauge {
  stroke-linecap: round;
  width: var(--gauge-circle-size);
  height: var(--gauge-circle-size);
}

.lh-category .lh-gauge {
  --gauge-circle-size: var(--gauge-circle-size-big);
}

.lh-gauge-base {
  opacity: 0.1;
}

.lh-gauge-arc {
  fill: none;
  transform-origin: 50% 50%;
  animation: load-gauge var(--transition-length) ease both;
  animation-delay: 250ms;
}

.lh-gauge__svg-wrapper {
  position: relative;
  height: var(--gauge-circle-size);
}
.lh-category .lh-gauge__svg-wrapper,
.lh-category .lh-fraction__wrapper {
  --gauge-circle-size: var(--gauge-circle-size-big);
}

/* The plugin badge overlay */
.lh-gauge__wrapper--plugin .lh-gauge__svg-wrapper::before {
  width: var(--plugin-badge-size);
  height: var(--plugin-badge-size);
  background-color: var(--plugin-badge-background-color);
  background-image: var(--plugin-icon-url);
  background-repeat: no-repeat;
  background-size: var(--plugin-icon-size);
  background-position: 58% 50%;
  content: "";
  position: absolute;
  right: -6px;
  bottom: 0px;
  display: block;
  z-index: 100;
  box-shadow: 0 0 4px rgba(0,0,0,.2);
  border-radius: 25%;
}
.lh-category .lh-gauge__wrapper--plugin .lh-gauge__svg-wrapper::before {
  width: var(--plugin-badge-size-big);
  height: var(--plugin-badge-size-big);
}

@keyframes load-gauge {
  from { stroke-dasharray: 0 352; }
}

.lh-gauge__percentage {
  width: 100%;
  height: var(--gauge-circle-size);
  line-height: var(--gauge-circle-size);
  position: absolute;
  font-family: var(--report-font-family-monospace);
  font-size: calc(var(--gauge-circle-size) * 0.34 + 1.3px);
  text-align: center;
  top: var(--score-container-padding);
}

.lh-category .lh-gauge__percentage {
  --gauge-circle-size: var(--gauge-circle-size-big);
  --gauge-percentage-font-size: var(--gauge-percentage-font-size-big);
}

.lh-gauge__wrapper,
.lh-fraction__wrapper {
  position: relative;
  display: flex;
  align-items: center;
  flex-direction: column;
  text-decoration: none;
  padding: var(--score-container-padding);

  --transition-length: 1s;

  /* Contain the layout style paint & layers during animation*/
  contain: content;
  will-change: opacity; /* Only using for layer promotion */
}

.lh-gauge__label,
.lh-fraction__label {
  font-size: var(--gauge-label-font-size);
  font-weight: 500;
  line-height: var(--gauge-label-line-height);
  margin-top: 10px;
  text-align: center;
  color: var(--report-text-color);
  word-break: keep-all;
}

/* TODO(#8185) use more BEM (.lh-gauge__label--big) instead of relying on descendant selector */
.lh-category .lh-gauge__label,
.lh-category .lh-fraction__label {
  --gauge-label-font-size: var(--gauge-label-font-size-big);
  --gauge-label-line-height: var(--gauge-label-line-height-big);
  margin-top: 14px;
}

.lh-scores-header .lh-gauge__wrapper,
.lh-scores-header .lh-fraction__wrapper,
.lh-sticky-header .lh-gauge__wrapper,
.lh-sticky-header .lh-fraction__wrapper {
  width: var(--gauge-wrapper-width);
}

.lh-scorescale {
  display: inline-flex;

  gap: calc(var(--default-padding) * 4);
  margin: 16px auto 0 auto;
  font-size: var(--report-font-size-secondary);
  color: var(--color-gray-700);

}

.lh-scorescale-range {
  display: flex;
  align-items: center;
  font-family: var(--report-font-family-monospace);
  white-space: nowrap;
}

.lh-category-header__finalscreenshot .lh-scorescale {
  border: 0;
  display: flex;
  justify-content: center;
}

.lh-category-header__finalscreenshot .lh-scorescale-range {
  font-family: unset;
  font-size: 12px;
}

.lh-scorescale-wrap {
  display: contents;
}

/* Hide category score gauages if it's a single category report */
.lh-header--solo-category .lh-scores-wrapper {
  display: none;
}


.lh-categories {
  width: 100%;
}

.lh-category {
  padding: var(--category-padding);
  max-width: var(--report-content-max-width);
  margin: 0 auto;

  scroll-margin-top: calc(var(--sticky-header-buffer) - 1em);
}

.lh-category-wrapper {
  border-bottom: 1px solid var(--color-gray-200);
}
.lh-category-wrapper:last-of-type {
  border-bottom: 0;
}

.lh-category-header {
  margin-bottom: var(--section-padding-vertical);
}

.lh-category-header .lh-score__gauge {
  max-width: 400px;
  width: auto;
  margin: 0px auto;
}

.lh-category-header__finalscreenshot {
  display: grid;
  grid-template: none / 1fr 1px 1fr;
  justify-items: center;
  align-items: center;
  gap: var(--report-line-height);
  min-height: 288px;
  margin-bottom: var(--default-padding);
}

.lh-final-ss-image {
  /* constrain the size of the image to not be too large */
  max-height: calc(var(--gauge-circle-size-big) * 2.8);
  max-width: calc(var(--gauge-circle-size-big) * 3.5);
  border: 1px solid var(--color-gray-200);
  padding: 4px;
  border-radius: 3px;
  display: block;
}

.lh-category-headercol--separator {
  background: var(--color-gray-200);
  width: 1px;
  height: var(--gauge-circle-size-big);
}

/**
* This media query is a temporary fallback for browsers that do not support \`@container query\`.
* TODO: remove this media query when \`@container query\` is fully supported by browsers
* See https://github.com/GoogleChrome/lighthouse/pull/16332
*/
@media screen and (max-width: 780px) {
  .lh-category-header__finalscreenshot {
    grid-template: 1fr 1fr / none
  }
  .lh-category-headercol--separator {
    display: none;
  }
}

@container lh-container (max-width: 780px) {
  .lh-category-header__finalscreenshot {
    grid-template: 1fr 1fr / none
  }
  .lh-category-headercol--separator {
    display: none;
  }
}

/**
* This media query is a temporary fallback for browsers that do not support \`@container query\`.
* TODO: remove this media query when \`@container query\` is fully supported by browsers
* See https://github.com/GoogleChrome/lighthouse/pull/16332
*/
@media screen and (max-width: 964px) {
  .lh-report {
    margin-left: 0;
    width: 100%;
  }
}

/* 964 fits the min-width of the filmstrip */
@container lh-container (max-width: 964px) {
  .lh-report {
    margin-left: 0;
    width: 100%;
  }
}

@media print {
  body {
    -webkit-print-color-adjust: exact; /* print background colors */
  }
  .lh-container {
    display: block;
  }
  .lh-report {
    margin-left: 0;
    padding-top: 0;
  }
  .lh-categories {
    margin-top: 0;
  }
}

.lh-table {
  position: relative;
  border-collapse: separate;
  border-spacing: 0;
  /* Can't assign padding to table, so shorten the width instead. */
  width: calc(100% - var(--audit-description-padding-left) - var(--stackpack-padding-horizontal));
  border: 1px solid var(--report-border-color-secondary);
}

.lh-table thead th {
  position: sticky;
  top: var(--sticky-header-buffer);
  z-index: 1;
  background-color: var(--report-background-color);
  border-bottom: 1px solid var(--report-border-color-secondary);
  font-weight: normal;
  color: var(--color-gray-600);
  /* See text-wrapping comment on .lh-container. */
  word-break: normal;
}

.lh-row--group {
  background-color: var(--table-group-header-background-color);
}

.lh-row--group td {
  font-weight: bold;
  font-size: 1.05em;
  color: var(--table-group-header-text-color);
}

.lh-row--group td:first-child {
  display: block;
  min-width: max-content;
  font-weight: normal;
}

.lh-row--group .lh-text {
  color: inherit;
  text-decoration: none;
  display: inline-block;
}

.lh-row--group a.lh-link:hover {
  text-decoration: underline;
}

.lh-row--group .lh-audit__adorn {
  text-transform: capitalize;
  font-weight: normal;
  padding: 2px 3px 1px 3px;
}

.lh-row--group .lh-audit__adorn1p {
  color: var(--link-color);
  border-color: var(--link-color);
}

.lh-row--group .lh-report-icon--external::before {
  content: "";
  background-repeat: no-repeat;
  width: 14px;
  height: 16px;
  opacity: 0.7;
  display: inline-block;
  vertical-align: middle;
}

.lh-row--group .lh-report-icon--external {
  visibility: hidden;
}

.lh-row--group:hover .lh-report-icon--external {
  visibility: visible;
}

.lh-dark .lh-report-icon--external::before {
  filter: invert(1);
}

/** Manages indentation of two-level and three-level nested adjacent rows */

.lh-row--group ~ [data-entity]:not(.lh-row--group) td:first-child {
  padding-left: 20px;
}

.lh-row--group ~ [data-entity]:not(.lh-row--group) ~ .lh-sub-item-row td:first-child {
  margin-left: 20px;
  padding-left: 10px;
  border-left: 1px solid #A8C7FA;
  display: block;
}

.lh-row--even {
  background-color: var(--table-group-header-background-color);
}
.lh-row--hidden {
  display: none;
}

.lh-table th,
.lh-table td {
  padding: var(--default-padding);
}

.lh-table tr {
  vertical-align: middle;
}

.lh-table tr:hover {
  background-color: var(--table-higlight-background-color);
}

/* Looks unnecessary, but mostly for keeping the <th>s left-aligned */
.lh-table-column--text,
.lh-table-column--source-location,
.lh-table-column--url,
/* .lh-table-column--thumbnail, */
/* .lh-table-column--empty,*/
.lh-table-column--code,
.lh-table-column--node {
  text-align: left;
}

.lh-table-column--code {
  min-width: 100px;
}

.lh-table-column--bytes,
.lh-table-column--timespanMs,
.lh-table-column--ms,
.lh-table-column--numeric {
  text-align: right;
  word-break: normal;
}



.lh-table .lh-table-column--thumbnail {
  width: var(--image-preview-size);
}

.lh-table-column--url {
  min-width: 250px;
}

.lh-table-column--text {
  min-width: 80px;
}

/* Keep columns narrow if they follow the URL column */
/* 12% was determined to be a decent narrow width, but wide enough for column headings */
.lh-table-column--url + th.lh-table-column--bytes,
.lh-table-column--url + .lh-table-column--bytes + th.lh-table-column--bytes,
.lh-table-column--url + .lh-table-column--ms,
.lh-table-column--url + .lh-table-column--ms + th.lh-table-column--bytes,
.lh-table-column--url + .lh-table-column--bytes + th.lh-table-column--timespanMs {
  width: 12%;
}

/** Tweak styling for tables in insight audits. */
.lh-audit[id$="-insight"] .lh-table {
  border: none;
}

.lh-audit[id$="-insight"] .lh-table thead th {
  font-weight: bold;
  color: unset;
}

.lh-audit[id$="-insight"] .lh-table th,
.lh-audit[id$="-insight"] .lh-table td {
  padding: calc(var(--default-padding) / 2);
}

.lh-audit[id$="-insight"] .lh-table .lh-row--even,
.lh-audit[id$="-insight"] .lh-table tr:not(.lh-row--group):hover {
  background-color: unset;
}

.lh-text__url-host {
  display: inline;
}

.lh-text__url-host {
  margin-left: calc(var(--report-font-size) / 2);
  opacity: 0.6;
  font-size: 90%
}

.lh-thumbnail {
  object-fit: cover;
  width: var(--image-preview-size);
  height: var(--image-preview-size);
  display: block;
}

.lh-unknown pre {
  overflow: scroll;
  border: solid 1px var(--color-gray-200);
}

.lh-text__url > a {
  color: inherit;
  text-decoration: none;
}

.lh-text__url > a:hover {
  text-decoration: underline dotted #999;
}

.lh-sub-item-row {
  margin-left: 20px;
  margin-bottom: 0;
  color: var(--color-gray-700);
}

.lh-sub-item-row td {
  padding-top: 4px;
  padding-bottom: 4px;
  padding-left: 20px;
}

.lh-sub-item-row .lh-element-screenshot {
  zoom: 0.6;
}

/* Chevron
   https://codepen.io/paulirish/pen/LmzEmK
 */
.lh-chevron {
  --chevron-angle: 42deg;
  /* Edge doesn't support transform: rotate(calc(...)), so we define it here */
  --chevron-angle-right: -42deg;
  width: var(--chevron-size);
  height: var(--chevron-size);
  margin-top: calc((var(--report-line-height) - 12px) / 2);
}

.lh-chevron__lines {
  transition: transform 0.4s;
  transform: translateY(var(--report-line-height));
}
.lh-chevron__line {
 stroke: var(--chevron-line-stroke);
 stroke-width: var(--chevron-size);
 stroke-linecap: square;
 transform-origin: 50%;
 transform: rotate(var(--chevron-angle));
 transition: transform 300ms, stroke 300ms;
}

.lh-expandable-details .lh-chevron__line-right,
.lh-expandable-details[open] .lh-chevron__line-left {
 transform: rotate(var(--chevron-angle-right));
}

.lh-expandable-details[open] .lh-chevron__line-right {
  transform: rotate(var(--chevron-angle));
}


.lh-expandable-details[open]  .lh-chevron__lines {
 transform: translateY(calc(var(--chevron-size) * -1));
}

.lh-expandable-details[open] {
  animation: 300ms openDetails forwards;
  padding-bottom: var(--default-padding);
}

@keyframes openDetails {
  from {
    outline: 1px solid var(--report-background-color);
  }
  to {
   outline: 1px solid;
   box-shadow: 0 2px 4px rgba(0, 0, 0, .24);
  }
}

/**
* This media query is a temporary fallback for browsers that do not support \`@container query\`.
* TODO: remove this media query when \`@container query\` is fully supported by browsers
* See https://github.com/GoogleChrome/lighthouse/pull/16332
*/
@media screen and (max-width: 780px) {
  /* no black outline if we're not confident the entire table can be displayed within bounds */
  .lh-expandable-details[open] {
    animation: none;
  }
}

@container lh-container (max-width: 780px) {
  /* no black outline if we're not confident the entire table can be displayed within bounds */
  .lh-expandable-details[open] {
    animation: none;
  }
}

.lh-expandable-details[open] summary, details.lh-clump > summary {
  border-bottom: 1px solid var(--report-border-color-secondary);
}
details.lh-clump[open] > summary {
  border-bottom-width: 0;
}



details .lh-clump-toggletext--hide,
details[open] .lh-clump-toggletext--show { display: none; }
details[open] .lh-clump-toggletext--hide { display: block;}


/* Tooltip */
.lh-tooltip-boundary {
  position: relative;
}

.lh-tooltip {
  position: absolute;
  display: none; /* Don't retain these layers when not needed */
  opacity: 0;
  background: #ffffff;
  white-space: pre-line; /* Render newlines in the text */
  min-width: 246px;
  max-width: 275px;
  padding: 15px;
  border-radius: 5px;
  text-align: initial;
  line-height: 1.4;
}

/**
* This media query is a temporary fallback for browsers that do not support \`@container query\`.
* TODO: remove this media query when \`@container query\` is fully supported by browsers
* See https://github.com/GoogleChrome/lighthouse/pull/16332
*/
@media screen and (max-width: 535px) {
  .lh-tooltip {
    min-width: 45vw;
    padding: 3vw;
  }
}

/* shrink tooltips to not be cutoff on left edge of narrow container
   45vw is chosen to be ~= width of the left column of metrics
*/
@container lh-container (max-width: 535px) {
  .lh-tooltip {
    min-width: 45vw;
    padding: 3vw;
  }
}

.lh-tooltip-boundary:hover .lh-tooltip {
  display: block;
  animation: fadeInTooltip 250ms;
  animation-fill-mode: forwards;
  animation-delay: 850ms;
  bottom: 100%;
  z-index: 1;
  will-change: opacity;
  right: 0;
  pointer-events: none;
}

.lh-tooltip::before {
  content: "";
  border: solid transparent;
  border-bottom-color: #fff;
  border-width: 10px;
  position: absolute;
  bottom: -20px;
  right: 6px;
  transform: rotate(180deg);
  pointer-events: none;
}

@keyframes fadeInTooltip {
  0% { opacity: 0; }
  75% { opacity: 1; }
  100% { opacity: 1;  filter: drop-shadow(1px 0px 1px #aaa) drop-shadow(0px 2px 4px hsla(206, 6%, 25%, 0.15)); pointer-events: auto; }
}

/* Element screenshot */
.lh-element-screenshot {
  float: left;
  margin-right: 20px;
}
.lh-element-screenshot__content {
  overflow: hidden;
  min-width: 110px;
  display: flex;
  justify-content: center;
  background-color: var(--report-background-color);
}
.lh-element-screenshot__image {
  position: relative;
  /* Set by ElementScreenshotRenderer.installFullPageScreenshotCssVariable */
  background-image: var(--element-screenshot-url);
  outline: 2px solid #777;
  background-color: white;
  background-repeat: no-repeat;
}
.lh-element-screenshot__mask {
  position: absolute;
  background: #555;
  opacity: 0.8;
}
.lh-element-screenshot__element-marker {
  position: absolute;
  outline: 2px solid var(--color-lime-400);
}
.lh-element-screenshot__overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2000; /* .lh-topbar is 1000 */
  background: var(--screenshot-overlay-background);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: zoom-out;
}

.lh-element-screenshot__overlay .lh-element-screenshot {
  margin-right: 0; /* clearing margin used in thumbnail case */
  outline: 1px solid var(--color-gray-700);
}

.lh-screenshot-overlay--enabled .lh-element-screenshot {
  cursor: zoom-out;
}
.lh-screenshot-overlay--enabled .lh-node .lh-element-screenshot {
  cursor: zoom-in;
}


.lh-meta__items {
  --meta-icon-size: calc(var(--report-icon-size) * 0.667);
  padding: var(--default-padding);
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  background-color: var(--env-item-background-color);
  border-radius: 3px;
  margin: 0 0 var(--default-padding) 0;
  font-size: 12px;
  column-gap: var(--default-padding);
  color: var(--color-gray-700);
}

.lh-meta__item {
  display: block;
  list-style-type: none;
  position: relative;
  padding: 0 0 0 calc(var(--meta-icon-size) + var(--default-padding) * 2);
  cursor: unset; /* disable pointer cursor from report-icon */
}

.lh-meta__item.lh-tooltip-boundary {
  text-decoration: dotted underline var(--color-gray-500);
  cursor: help;
}

.lh-meta__item.lh-report-icon::before {
  position: absolute;
  left: var(--default-padding);
  width: var(--meta-icon-size);
  height: var(--meta-icon-size);
}

.lh-meta__item.lh-report-icon:hover::before {
  opacity: 0.7;
}

.lh-meta__item .lh-tooltip {
  color: var(--color-gray-800);
}

.lh-meta__item .lh-tooltip::before {
  right: auto; /* Set the tooltip arrow to the leftside */
  left: 6px;
}

/**
* This media query is a temporary fallback for browsers that do not support \`@container query\`.
* TODO: remove this media query when \`@container query\` is fully supported by browsers
* See https://github.com/GoogleChrome/lighthouse/pull/16332
*/
@media screen and (max-width: 640px) {
  .lh-meta__items {
    grid-template-columns: 1fr 1fr;
  }
}

/* Change the grid for narrow container */
@container lh-container (max-width: 640px) {
  .lh-meta__items {
    grid-template-columns: 1fr 1fr;
  }
}

/**
* This media query is a temporary fallback for browsers that do not support \`@container query\`.
* TODO: remove this media query when \`@container query\` is fully supported by browsers
* See https://github.com/GoogleChrome/lighthouse/pull/16332
*/
@media screen and (max-width: 535px) {
  .lh-meta__items {
    display: block;
  }
}

@container lh-container (max-width: 535px) {
  .lh-meta__items {
    display: block;
  }
}

/* Explodey gauge */

.lh-exp-gauge-component {
  margin-bottom: 10px;
}

.lh-exp-gauge-component circle {
  stroke: currentcolor;
  r: var(--radius);
}

.lh-exp-gauge-component text {
  font-size: calc(var(--radius) * 0.2);
}

.lh-exp-gauge-component .lh-exp-gauge {
  margin: 0 auto;
  width: 225px;
  stroke-width: var(--stroke-width);
  stroke-linecap: round;

  /* for better rendering perf */
  contain: strict;
  height: 225px;
  will-change: transform;
}
.lh-exp-gauge-component .lh-exp-gauge--faded {
  opacity: 0.1;
}
.lh-exp-gauge-component .lh-exp-gauge__wrapper {
  font-family: var(--report-font-family-monospace);
  text-align: center;
  text-decoration: none;
  transition: .3s;
}
.lh-exp-gauge-component .lh-exp-gauge__wrapper--pass {
  color: var(--color-pass);
}
.lh-exp-gauge-component .lh-exp-gauge__wrapper--average {
  color: var(--color-average);
}
.lh-exp-gauge-component .lh-exp-gauge__wrapper--fail {
  color: var(--color-fail);
}
.lh-exp-gauge-component .state--expanded {
  transition: color .3s;
}
.lh-exp-gauge-component .state--highlight {
  color: var(--color-highlight);
}
.lh-exp-gauge-component .lh-exp-gauge__svg-wrapper {
  display: flex;
  flex-direction: column-reverse;
}

.lh-exp-gauge-component .lh-exp-gauge__label {
  fill: var(--report-text-color);
  font-family: var(--report-font-family);
  font-size: 12px;
}

.lh-exp-gauge-component .lh-exp-gauge__cutout {
  opacity: .999;
  transition: opacity .3s;
}
.lh-exp-gauge-component .state--highlight .lh-exp-gauge__cutout {
  opacity: 0;
}

.lh-exp-gauge-component .lh-exp-gauge__inner {
  color: inherit;
}
.lh-exp-gauge-component .lh-exp-gauge__base {
  fill: currentcolor;
}


.lh-exp-gauge-component .lh-exp-gauge__arc {
  fill: none;
  transition: opacity .3s;
}
.lh-exp-gauge-component .lh-exp-gauge__arc--metric {
  color: var(--metric-color);
  stroke-dashoffset: var(--metric-offset);
  opacity: 0.3;
}
.lh-exp-gauge-component .lh-exp-gauge-hovertarget {
  color: currentcolor;
  opacity: 0.001;
  stroke-linecap: butt;
  stroke-width: 24;
  /* hack. move the hover target out of the center. ideally i tweak the r instead but that rquires considerably more math. */
  transform: scale(1.15);
}
.lh-exp-gauge-component .lh-exp-gauge__arc--metric.lh-exp-gauge--miniarc {
  opacity: 0;
  stroke-dasharray: 0 calc(var(--circle-meas) * var(--radius));
  transition: 0s .005s;
}
.lh-exp-gauge-component .state--expanded .lh-exp-gauge__arc--metric.lh-exp-gauge--miniarc {
  opacity: .999;
  stroke-dasharray: var(--metric-array);
  transition: 0.3s; /*  calc(.005s + var(--i)*.05s); entrace animation */
}
.lh-exp-gauge-component .state--expanded .lh-exp-gauge__inner .lh-exp-gauge__arc {
  opacity: 0;
}


.lh-exp-gauge-component .lh-exp-gauge__percentage {
  text-anchor: middle;
  dominant-baseline: middle;
  opacity: .999;
  font-size: calc(var(--radius) * 0.625);
  transition: opacity .3s ease-in;
}
.lh-exp-gauge-component .state--highlight .lh-exp-gauge__percentage {
  opacity: 0;
}

.lh-exp-gauge-component .lh-exp-gauge__wrapper--fail .lh-exp-gauge__percentage {
  fill: var(--color-fail);
}
.lh-exp-gauge-component .lh-exp-gauge__wrapper--average .lh-exp-gauge__percentage {
  fill: var(--color-average);
}
.lh-exp-gauge-component .lh-exp-gauge__wrapper--pass .lh-exp-gauge__percentage {
  fill: var(--color-pass);
}

.lh-exp-gauge-component .lh-cover {
  fill: none;
  opacity: .001;
  pointer-events: none;
}
.lh-exp-gauge-component .state--expanded .lh-cover {
  pointer-events: auto;
}

.lh-exp-gauge-component .metric {
  transform: scale(var(--scale-initial));
  opacity: 0;
  transition: transform .1s .2s ease-out,  opacity .3s ease-out;
  pointer-events: none;
}
.lh-exp-gauge-component .metric text {
  pointer-events: none;
}
.lh-exp-gauge-component .metric__value {
  fill: currentcolor;
  opacity: 0;
  transition: opacity 0.2s;
}
.lh-exp-gauge-component .state--expanded .metric {
  transform: scale(1);
  opacity: .999;
  transition: transform .3s ease-out,  opacity .3s ease-in,  stroke-width .1s ease-out;
  transition-delay: calc(var(--i)*.05s);
  pointer-events: auto;
}
.lh-exp-gauge-component .state--highlight .metric {
  opacity: .3;
}
.lh-exp-gauge-component .state--highlight .metric--highlight {
  opacity: .999;
  stroke-width: calc(1.5*var(--stroke-width));
}
.lh-exp-gauge-component .state--highlight .metric--highlight .metric__value {
  opacity: 0.999;
}


/*
 the initial first load peek
*/
.lh-exp-gauge-component .lh-exp-gauge__bg {  /* needed for the use zindex stacking w/ transparency */
  fill: var(--report-background-color);
  stroke: var(--report-background-color);
}
.lh-exp-gauge-component .state--peek .metric {
  transition-delay: 0ms;
  animation: peek var(--peek-dur) cubic-bezier(0.46, 0.03, 0.52, 0.96);
  animation-fill-mode: forwards;
}
.lh-exp-gauge-component .state--peek .lh-exp-gauge__inner .lh-exp-gauge__arc {
  opacity: 1;
}
.lh-exp-gauge-component .state--peek .lh-exp-gauge__arc.lh-exp-gauge--faded {
  opacity: 0.3; /* just a tad stronger cuz its fighting with a big solid arg */
}
/* do i need to set expanded and override this? */
.lh-exp-gauge-component .state--peek .lh-exp-gauge__arc--metric.lh-exp-gauge--miniarc {
  transition: opacity 0.3s;
}
.lh-exp-gauge-component .state--peek {
  color: unset;
}
.lh-exp-gauge-component .state--peek .metric__label {
  display: none;
}

.lh-exp-gauge-component .metric__label {
  fill: var(--report-text-color);
}

@keyframes peek {
  /* biggest it should go is 0.92. smallest is 0.8 */
  0% {
    transform: scale(0.8);
    opacity: 0.8;
  }

  50% {
    transform: scale(0.92);
    opacity: 1;
  }

  100% {
    transform: scale(0.8);
    opacity: 0.8;
  }
}

.lh-exp-gauge-component .wrapper {
  width: 620px;
}

/*# sourceURL=report-styles.css */
`),e.append(n),e}function Eo(t){let e=t.createFragment(),n=t.createElement("style");n.append(`
    .lh-topbar {
      position: sticky;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      display: flex;
      align-items: center;
      height: var(--topbar-height);
      padding: var(--topbar-padding);
      font-size: var(--report-font-size-secondary);
      background-color: var(--topbar-background-color);
      border-bottom: 1px solid var(--color-gray-200);
    }

    .lh-topbar__logo {
      width: var(--topbar-logo-size);
      height: var(--topbar-logo-size);
      user-select: none;
      flex: none;
    }

    .lh-topbar__url {
      margin: var(--topbar-padding);
      text-decoration: none;
      color: var(--report-text-color);
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }

    .lh-tools {
      display: flex;
      align-items: center;
      margin-left: auto;
      will-change: transform;
      min-width: var(--report-icon-size);
    }
    .lh-tools__button {
      width: var(--report-icon-size);
      min-width: 24px;
      height: var(--report-icon-size);
      cursor: pointer;
      margin-right: 5px;
      /* This is actually a button element, but we want to style it like a transparent div. */
      display: flex;
      background: none;
      color: inherit;
      border: none;
      padding: 0;
      font: inherit;
      outline: inherit;
    }
    .lh-tools__button svg {
      fill: var(--tools-icon-color);
    }
    .lh-dark .lh-tools__button svg {
      filter: invert(1);
    }
    .lh-tools__button.lh-active + .lh-tools__dropdown {
      opacity: 1;
      clip: rect(-1px, 194px, 270px, -3px);
      visibility: visible;
    }
    .lh-tools__dropdown {
      position: absolute;
      background-color: var(--report-background-color);
      border: 1px solid var(--report-border-color);
      border-radius: 3px;
      padding: calc(var(--default-padding) / 2) 0;
      cursor: pointer;
      top: 36px;
      right: 0;
      box-shadow: 1px 1px 3px #ccc;
      min-width: 125px;
      clip: rect(0, 164px, 0, 0);
      visibility: hidden;
      opacity: 0;
      transition: all 200ms cubic-bezier(0,0,0.2,1);
    }
    .lh-tools__dropdown a {
      color: currentColor;
      text-decoration: none;
      white-space: nowrap;
      padding: 0 6px;
      line-height: 2;
    }
    .lh-tools__dropdown a:hover,
    .lh-tools__dropdown a:focus {
      background-color: var(--color-gray-200);
      outline: none;
    }
    /* save-gist option hidden in report. */
    .lh-tools__dropdown a[data-action='save-gist'] {
      display: none;
    }

    .lh-locale-selector {
      width: 100%;
      color: var(--report-text-color);
      background-color: var(--locale-selector-background-color);
      padding: 2px;
    }
    .lh-tools-locale {
      display: flex;
      align-items: center;
      flex-direction: row-reverse;
    }
    .lh-tools-locale__selector-wrapper {
      transition: opacity 0.15s;
      opacity: 0;
      max-width: 200px;
    }
    .lh-button.lh-tool-locale__button {
      height: var(--topbar-height);
      color: var(--tools-icon-color);
      padding: calc(var(--default-padding) / 2);
    }
    .lh-tool-locale__button.lh-active + .lh-tools-locale__selector-wrapper {
      opacity: 1;
      clip: rect(-1px, 194px, 242px, -3px);
      visibility: visible;
      margin: 0 4px;
    }

    /**
    * This media query is a temporary fallback for browsers that do not support \`@container query\`.
    * TODO: remove this media query when \`@container query\` is fully supported by browsers
    * See https://github.com/GoogleChrome/lighthouse/pull/16332
    */
    @media screen and (max-width: 964px) {
      .lh-tools__dropdown {
        right: 0;
        left: initial;
      }
    }

    @container lh-container (max-width: 964px) {
      .lh-tools__dropdown {
        right: 0;
        left: initial;
      }
    }

    @media print {
      .lh-topbar {
        position: static;
        margin-left: 0;
      }

      .lh-tools__dropdown {
        display: none;
      }
    }
  `),e.append(n);let a=t.createElement("div","lh-topbar"),i=t.createElementNS("http://www.w3.org/2000/svg","svg","lh-topbar__logo");i.setAttribute("role","img"),i.setAttribute("title","Lighthouse logo"),i.setAttribute("fill","none"),i.setAttribute("xmlns","http://www.w3.org/2000/svg"),i.setAttribute("viewBox","0 0 48 48");let o=t.createElementNS("http://www.w3.org/2000/svg","path");o.setAttribute("d","m14 7 10-7 10 7v10h5v7h-5l5 24H9l5-24H9v-7h5V7Z"),o.setAttribute("fill","#F63");let r=t.createElementNS("http://www.w3.org/2000/svg","path");r.setAttribute("d","M31.561 24H14l-1.689 8.105L31.561 24ZM18.983 48H9l1.022-4.907L35.723 32.27l1.663 7.98L18.983 48Z"),r.setAttribute("fill","#FFA385");let s=t.createElementNS("http://www.w3.org/2000/svg","path");s.setAttribute("fill","#FF3"),s.setAttribute("d","M20.5 10h7v7h-7z"),i.append(" ",o," ",r," ",s," ");let p=t.createElement("a","lh-topbar__url");p.setAttribute("href",""),p.setAttribute("target","_blank"),p.setAttribute("rel","noopener");let c=t.createElement("div","lh-tools"),l=t.createElement("div","lh-tools-locale lh-hidden"),d=t.createElement("button","lh-button lh-tool-locale__button");d.setAttribute("id","lh-button__swap-locales"),d.setAttribute("title","Show Language Picker"),d.setAttribute("aria-label","Toggle language picker"),d.setAttribute("aria-haspopup","menu"),d.setAttribute("aria-expanded","false"),d.setAttribute("aria-controls","lh-tools-locale__selector-wrapper");let m=t.createElementNS("http://www.w3.org/2000/svg","svg");m.setAttribute("width","20px"),m.setAttribute("height","20px"),m.setAttribute("viewBox","0 0 24 24"),m.setAttribute("fill","currentColor");let h=t.createElementNS("http://www.w3.org/2000/svg","path");h.setAttribute("d","M0 0h24v24H0V0z"),h.setAttribute("fill","none");let f=t.createElementNS("http://www.w3.org/2000/svg","path");f.setAttribute("d","M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"),m.append(h,f),d.append(" ",m," ");let C=t.createElement("div","lh-tools-locale__selector-wrapper");C.setAttribute("id","lh-tools-locale__selector-wrapper"),C.setAttribute("role","menu"),C.setAttribute("aria-labelledby","lh-button__swap-locales"),C.setAttribute("aria-hidden","true"),C.append(" "," "),l.append(" ",d," ",C," ");let g=t.createElement("button","lh-tools__button");g.setAttribute("id","lh-tools-button"),g.setAttribute("title","Tools menu"),g.setAttribute("aria-label","Toggle report tools menu"),g.setAttribute("aria-haspopup","menu"),g.setAttribute("aria-expanded","false"),g.setAttribute("aria-controls","lh-tools-dropdown");let _=t.createElementNS("http://www.w3.org/2000/svg","svg");_.setAttribute("width","100%"),_.setAttribute("height","100%"),_.setAttribute("viewBox","0 0 24 24");let v=t.createElementNS("http://www.w3.org/2000/svg","path");v.setAttribute("d","M0 0h24v24H0z"),v.setAttribute("fill","none");let y=t.createElementNS("http://www.w3.org/2000/svg","path");y.setAttribute("d","M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"),_.append(" ",v," ",y," "),g.append(" ",_," ");let w=t.createElement("div","lh-tools__dropdown");w.setAttribute("id","lh-tools-dropdown"),w.setAttribute("role","menu"),w.setAttribute("aria-labelledby","lh-tools-button");let P=t.createElement("a","lh-report-icon lh-report-icon--print");P.setAttribute("role","menuitem"),P.setAttribute("tabindex","-1"),P.setAttribute("href","#"),P.setAttribute("data-i18n","dropdownPrintSummary"),P.setAttribute("data-action","print-summary");let L=t.createElement("a","lh-report-icon lh-report-icon--print");L.setAttribute("role","menuitem"),L.setAttribute("tabindex","-1"),L.setAttribute("href","#"),L.setAttribute("data-i18n","dropdownPrintExpanded"),L.setAttribute("data-action","print-expanded");let R=t.createElement("a","lh-report-icon lh-report-icon--copy");R.setAttribute("role","menuitem"),R.setAttribute("tabindex","-1"),R.setAttribute("href","#"),R.setAttribute("data-i18n","dropdownCopyJSON"),R.setAttribute("data-action","copy");let M=t.createElement("a","lh-report-icon lh-report-icon--download lh-hidden");M.setAttribute("role","menuitem"),M.setAttribute("tabindex","-1"),M.setAttribute("href","#"),M.setAttribute("data-i18n","dropdownSaveHTML"),M.setAttribute("data-action","save-html");let G=t.createElement("a","lh-report-icon lh-report-icon--download");G.setAttribute("role","menuitem"),G.setAttribute("tabindex","-1"),G.setAttribute("href","#"),G.setAttribute("data-i18n","dropdownSaveJSON"),G.setAttribute("data-action","save-json");let Z=t.createElement("a","lh-report-icon lh-report-icon--open");Z.setAttribute("role","menuitem"),Z.setAttribute("tabindex","-1"),Z.setAttribute("href","#"),Z.setAttribute("data-i18n","dropdownViewer"),Z.setAttribute("data-action","open-viewer");let K=t.createElement("a","lh-report-icon lh-report-icon--open");K.setAttribute("role","menuitem"),K.setAttribute("tabindex","-1"),K.setAttribute("href","#"),K.setAttribute("data-i18n","dropdownSaveGist"),K.setAttribute("data-action","save-gist");let q=t.createElement("a","lh-report-icon lh-report-icon--open lh-hidden");q.setAttribute("role","menuitem"),q.setAttribute("tabindex","-1"),q.setAttribute("href","#"),q.setAttribute("data-i18n","dropdownViewUnthrottledTrace"),q.setAttribute("data-action","view-unthrottled-trace");let X=t.createElement("a","lh-report-icon lh-report-icon--dark");return X.setAttribute("role","menuitem"),X.setAttribute("tabindex","-1"),X.setAttribute("href","#"),X.setAttribute("data-i18n","dropdownDarkTheme"),X.setAttribute("data-action","toggle-dark"),w.append(" ",P," ",L," ",R," "," ",M," ",G," ",Z," ",K," "," ",q," ",X," "),c.append(" ",l," ",g," ",w," "),a.append(" "," ",i," ",p," ",c," "),e.append(a),e}function Lo(t){let e=t.createFragment(),n=t.createElement("div","lh-warnings lh-warnings--toplevel"),a=t.createElement("p","lh-warnings__msg"),i=t.createElement("ul");return n.append(" ",a," ",i," "),e.append(n),e}function Sa(t,e){switch(e){case"3pFilter":return ro(t);case"audit":return so(t);case"categoryHeader":return lo(t);case"chevron":return po(t);case"clump":return uo(t);case"crc":return co(t);case"crcChain":return mo(t);case"elementScreenshot":return ho(t);case"explodeyGauge":return go(t);case"footer":return fo(t);case"fraction":return vo(t);case"gauge":return bo(t);case"heading":return yo(t);case"metric":return _o(t);case"scorescale":return Co(t);case"scoresWrapper":return wo(t);case"snippet":return xo(t);case"snippetContent":return So(t);case"snippetHeader":return ko(t);case"snippetLine":return Po(t);case"styles":return Ao(t);case"topbar":return Eo(t);case"warningsToplevel":return Lo(t)}throw new Error("unexpected component: "+e)}var re=class{constructor(e,n){this._document=e,this._lighthouseChannel="unknown",this._componentCache=new Map,this.rootEl=n,this._swappableSections=new WeakMap}createElement(e,n){let a=this._document.createElement(e);if(n)for(let i of n.split(/\s+/))i&&a.classList.add(i);return a}createElementNS(e,n,a){let i=this._document.createElementNS(e,n);if(a)for(let o of a.split(/\s+/))o&&i.classList.add(o);return i}createSVGElement(e,n){return this._document.createElementNS("http://www.w3.org/2000/svg",e,n)}createFragment(){return this._document.createDocumentFragment()}createTextNode(e){return this._document.createTextNode(e)}createChildOf(e,n,a){let i=this.createElement(n,a);return e.append(i),i}createComponent(e){let n=this._componentCache.get(e);if(n){let i=n.cloneNode(!0);return this.findAll("style",i).forEach(o=>o.remove()),i}return n=Sa(this,e),this._componentCache.set(e,n),n.cloneNode(!0)}clearComponentCache(){this._componentCache.clear()}convertMarkdownLinkSnippets(e,n={}){let a=this.createElement("span");for(let i of U.splitMarkdownLink(e)){let o=i.text.includes("`")?this.convertMarkdownCodeSnippets(i.text):i.text;if(!i.isLink){a.append(o);continue}let r=new URL(i.linkHref);(["https://developers.google.com","https://web.dev","https://developer.chrome.com"].includes(r.origin)||n.alwaysAppendUtmSource)&&(r.searchParams.set("utm_source","lighthouse"),r.searchParams.set("utm_medium",this._lighthouseChannel));let p=this.createElement("a");p.rel="noopener",p.target="_blank",p.append(o),this.safelySetHref(p,r.href),a.append(p)}return a}safelySetHref(e,n){if(n=n||"",n.startsWith("#")){e.href=n;return}let a=["https:","http:"],i;try{i=new URL(n)}catch{}i&&a.includes(i.protocol)&&(e.href=i.href)}safelySetBlobHref(e,n){if(n.type!=="text/html"&&n.type!=="application/json")throw new Error("Unsupported blob type");let a=URL.createObjectURL(n);e.href=a}convertMarkdownCodeSnippets(e){let n=this.createElement("span");for(let a of U.splitMarkdownCodeSpans(e))if(a.isCode){let i=this.createElement("code");i.textContent=a.text,n.append(i)}else n.append(this._document.createTextNode(a.text));return n}setLighthouseChannel(e){this._lighthouseChannel=e}document(){return this._document}isDevTools(){return!!this._document.querySelector(".lh-devtools")}find(e,n=this.rootEl??this._document){let a=this.maybeFind(e,n);if(a===null)throw new Error(`query ${e} not found`);return a}maybeFind(e,n=this.rootEl??this._document){return n.querySelector(e)}findAll(e,n){return Array.from(n.querySelectorAll(e))}fireEventOn(e,n=this._document,a){let i=new CustomEvent(e,a?{detail:a}:void 0);n.dispatchEvent(i)}saveFile(e,n){let a=this.createElement("a");a.download=n,this.safelySetBlobHref(a,e),this._document.body.append(a),a.click(),this._document.body.removeChild(a),setTimeout(()=>URL.revokeObjectURL(a.href),500)}registerSwappableSections(e,n){this._swappableSections.set(e,n),this._swappableSections.set(n,e)}swapSectionIfPossible(e){let n=this._swappableSections.get(e);if(!n)return;let a=e.parentNode;if(!a)return;let i=e.querySelectorAll("style");n.append(...i),a.insertBefore(n,e),e.remove()}};var se=class{constructor(e,n){this.dom=e,this.detailsRenderer=n}get _clumpTitles(){return{warning:b.strings.warningAuditsGroupTitle,manual:b.strings.manualAuditsGroupTitle,passed:b.strings.passedAuditsGroupTitle,notApplicable:b.strings.notApplicableAuditsGroupTitle}}renderAudit(e){let n=b.strings,a=this.dom.createComponent("audit"),i=this.dom.find("div.lh-audit",a);i.id=e.result.id;let o=e.result.scoreDisplayMode;e.result.displayValue&&(this.dom.find(".lh-audit__display-text",i).textContent=e.result.displayValue);let r=this.dom.find(".lh-audit__title",i);r.append(this.dom.convertMarkdownCodeSnippets(e.result.title));let s=this.dom.find(".lh-audit__description",i);s.append(this.dom.convertMarkdownLinkSnippets(e.result.description));for(let m of e.relevantMetrics||[]){let h=this.dom.createChildOf(s,"span","lh-audit__adorn");h.title=`Relevant to ${m.result.title}`,h.textContent=m.acronym||m.id}e.stackPacks&&e.stackPacks.forEach(m=>{let h=this.dom.createElement("img","lh-audit__stackpack__img");h.src=m.iconDataURL,h.alt=m.title;let f=this.dom.convertMarkdownLinkSnippets(m.description,{alwaysAppendUtmSource:!0}),C=this.dom.createElement("div","lh-audit__stackpack");C.append(h,f),this.dom.find(".lh-audit__stackpacks",i).append(C)});let p=this.dom.find("details",i);if(e.result.details){let m=this.detailsRenderer.render(e.result.details);m&&(m.classList.add("lh-details"),p.append(m))}if(this.dom.find(".lh-chevron-container",i).append(this._createChevron()),this._setRatingClass(i,e.result.score,o),e.result.scoreDisplayMode==="error"){i.classList.add("lh-audit--error");let m=this.dom.find(".lh-audit__display-text",i);m.textContent=n.errorLabel,m.classList.add("lh-tooltip-boundary");let h=this.dom.createChildOf(m,"div","lh-tooltip lh-tooltip--error");h.textContent=e.result.errorMessage||n.errorMissingAuditInfo}else if(e.result.explanation){let m=this.dom.createChildOf(r,"div","lh-audit-explanation");m.textContent=e.result.explanation}let c=e.result.warnings;if(!c||c.length===0)return i;let l=this.dom.find("summary",p),d=this.dom.createChildOf(l,"div","lh-warnings");if(this.dom.createChildOf(d,"span").textContent=n.warningHeader,c.length===1)d.append(this.dom.createTextNode(c.join("")));else{let m=this.dom.createChildOf(d,"ul");for(let h of c){let f=this.dom.createChildOf(m,"li");f.textContent=h}}return i}injectFinalScreenshot(e,n,a){let i=n["final-screenshot"];if(!i||i.scoreDisplayMode==="error"||!i.details||i.details.type!=="screenshot")return null;let o=this.dom.createElement("img","lh-final-ss-image"),r=i.details.data;o.src=r,o.alt=i.title;let s=this.dom.find(".lh-category .lh-category-header",e),p=this.dom.createElement("div","lh-category-headercol"),c=this.dom.createElement("div","lh-category-headercol lh-category-headercol--separator"),l=this.dom.createElement("div","lh-category-headercol");p.append(...s.childNodes),p.append(a),l.append(o),s.append(p,c,l),s.classList.add("lh-category-header__finalscreenshot")}_createChevron(){let e=this.dom.createComponent("chevron");return this.dom.find("svg.lh-chevron",e)}_setRatingClass(e,n,a){let i=A.calculateRating(n,a);return e.classList.add(`lh-audit--${a.toLowerCase()}`),a!=="informative"&&e.classList.add(`lh-audit--${i}`),e}renderCategoryHeader(e,n,a){let i=this.dom.createComponent("categoryHeader"),o=this.dom.find(".lh-score__gauge",i),r=this.renderCategoryScore(e,n,a);if(o.append(r),e.description){let s=this.dom.convertMarkdownLinkSnippets(e.description);this.dom.find(".lh-category-header__description",i).append(s)}return i}renderAuditGroup(e){let n=this.dom.createElement("div","lh-audit-group"),a=this.dom.createElement("div","lh-audit-group__header");this.dom.createChildOf(a,"span","lh-audit-group__title").textContent=e.title,n.append(a);let i=null;return e.description&&(i=this.dom.convertMarkdownLinkSnippets(e.description),i.classList.add("lh-audit-group__description","lh-audit-group__footer"),n.append(i)),[n,i]}_renderGroupedAudits(e,n){let a=new Map,i="NotAGroup";a.set(i,[]);for(let r of e){let s=r.group||i,p=a.get(s)||[];p.push(r),a.set(s,p)}let o=[];for(let[r,s]of a){if(r===i){for(let d of s)o.push(this.renderAudit(d));continue}let p=n[r],[c,l]=this.renderAuditGroup(p);for(let d of s)c.insertBefore(this.renderAudit(d),l);c.classList.add(`lh-audit-group--${r}`),o.push(c)}return o}renderUnexpandableClump(e,n){let a=this.dom.createElement("div");return this._renderGroupedAudits(e,n).forEach(o=>a.append(o)),a}renderClump(e,{auditRefsOrEls:n,description:a,openByDefault:i}){let o=this.dom.createComponent("clump"),r=this.dom.find(".lh-clump",o);i&&r.setAttribute("open","");let s=this.dom.find(".lh-audit-group__header",r),p=this._clumpTitles[e];this.dom.find(".lh-audit-group__title",s).textContent=p;let c=this.dom.find(".lh-audit-group__itemcount",r);c.textContent=`(${n.length})`;let l=n.map(m=>m instanceof HTMLElement?m:this.renderAudit(m));r.append(...l);let d=this.dom.find(".lh-audit-group",o);if(a){let m=this.dom.convertMarkdownLinkSnippets(a);m.classList.add("lh-audit-group__description","lh-audit-group__footer"),d.append(m)}return this.dom.find(".lh-clump-toggletext--show",d).textContent=b.strings.show,this.dom.find(".lh-clump-toggletext--hide",d).textContent=b.strings.hide,r.classList.add(`lh-clump--${e.toLowerCase()}`),d}renderCategoryScore(e,n,a){let i;if(a&&A.shouldDisplayAsFraction(a.gatherMode)?i=this.renderCategoryFraction(e):i=this.renderScoreGauge(e,n),a?.omitLabel&&this.dom.find(".lh-gauge__label,.lh-fraction__label",i).remove(),a?.onPageAnchorRendered){let o=this.dom.find("a",i);a.onPageAnchorRendered(o)}return i}renderScoreGauge(e,n){let a=this.dom.createComponent("gauge"),i=this.dom.find("a.lh-gauge__wrapper",a);A.isPluginCategory(e.id)&&i.classList.add("lh-gauge__wrapper--plugin");let o=Number(e.score),r=this.dom.find(".lh-gauge",a),s=this.dom.find("circle.lh-gauge-arc",r);s&&this._setGaugeArc(s,o);let p=Math.round(o*100),c=this.dom.find("div.lh-gauge__percentage",a);return c.textContent=p.toString(),e.score===null&&(c.classList.add("lh-gauge--error"),c.textContent="",c.title=b.strings.errorLabel),e.auditRefs.length===0||this.hasApplicableAudits(e)?i.classList.add(`lh-gauge__wrapper--${A.calculateRating(e.score)}`):(i.classList.add("lh-gauge__wrapper--not-applicable"),c.textContent="-",c.title=b.strings.notApplicableAuditsGroupTitle),this.dom.find(".lh-gauge__label",a).textContent=e.title,a}renderCategoryFraction(e){let n=this.dom.createComponent("fraction"),a=this.dom.find("a.lh-fraction__wrapper",n),{numPassed:i,numPassableAudits:o,totalWeight:r}=A.calculateCategoryFraction(e),s=i/o,p=this.dom.find(".lh-fraction__content",n),c=this.dom.createElement("span");c.textContent=`${i}/${o}`,p.append(c);let l=A.calculateRating(s);return r===0&&(l="null"),a.classList.add(`lh-fraction__wrapper--${l}`),this.dom.find(".lh-fraction__label",n).textContent=e.title,n}hasApplicableAudits(e){return e.auditRefs.some(n=>n.result.scoreDisplayMode!=="notApplicable")}_setGaugeArc(e,n){let a=2*Math.PI*Number(e.getAttribute("r")),i=Number(e.getAttribute("stroke-width")),o=.25*i/a;e.style.transform=`rotate(${-90+o*360}deg)`;let r=n*a-i/2;n===0&&(e.style.opacity="0"),n===1&&(r=a),e.style.strokeDasharray=`${Math.max(r,0)} ${a}`}_auditHasWarning(e){return!!e.result.warnings?.length}_getClumpIdForAuditRef(e){let n=e.result.scoreDisplayMode;return n==="manual"||n==="notApplicable"?n:A.showAsPassed(e.result)?this._auditHasWarning(e)?"warning":"passed":"failed"}render(e,n={},a){let i=this.dom.createElement("div","lh-category");i.id=e.id,i.append(this.renderCategoryHeader(e,n,a));let o=new Map;o.set("failed",[]),o.set("warning",[]),o.set("manual",[]),o.set("passed",[]),o.set("notApplicable",[]);for(let s of e.auditRefs){if(s.group==="hidden")continue;let p=this._getClumpIdForAuditRef(s),c=o.get(p);c.push(s),o.set(p,c)}for(let s of o.values())s.sort((p,c)=>c.weight-p.weight);let r=o.get("failed")?.length;for(let[s,p]of o){if(p.length===0)continue;if(s==="failed"){let m=this.renderUnexpandableClump(p,n);m.classList.add("lh-clump--failed"),i.append(m);continue}let c=s==="manual"?e.manualDescription:void 0,l=s==="warning"||s==="manual"&&r===0,d=this.renderClump(s,{auditRefsOrEls:p,description:c,openByDefault:l});i.append(d)}return i}};var ze=class{static createSegment(e,n,a,i){let o=e[n],r=Object.keys(e),s=r.indexOf(n)===r.length-1,p=!!o.children&&Object.keys(o.children).length>0,c=Array.isArray(a)?a.slice(0):[];return typeof i<"u"&&c.push(!i),{node:o,isLastChild:s,hasChildren:p,treeMarkers:c}}static createChainNode(e,n,a){let i=e.createComponent("crcChain"),o,r,s,p,c;"request"in n.node?(r=n.node.request.transferSize,s=n.node.request.url,o=(n.node.request.endTime-n.node.request.startTime)*1e3,p=!1):(r=n.node.transferSize,s=n.node.url,o=n.node.navStartToEndTime,p=!0,c=n.node.isLongest);let l=e.find(".lh-crc-node",i);l.setAttribute("title",s),c&&l.classList.add("lh-crc-node__longest");let d=e.find(".lh-crc-node__tree-marker",i);n.treeMarkers.forEach(g=>{let _=g?"lh-tree-marker lh-vert":"lh-tree-marker";d.append(e.createElement("span",_),e.createElement("span","lh-tree-marker"))});let m=n.isLastChild?"lh-tree-marker lh-up-right":"lh-tree-marker lh-vert-right",h=n.hasChildren?"lh-tree-marker lh-horiz-down":"lh-tree-marker lh-right";d.append(e.createElement("span",m),e.createElement("span","lh-tree-marker lh-right"),e.createElement("span",h));let f=a.renderTextURL(s),C=e.find(".lh-crc-node__tree-value",i);if(C.append(f),!n.hasChildren||p){let g=e.createElement("span","lh-crc-node__chain-duration");g.textContent=" - "+b.i18n.formatMilliseconds(o)+", ";let _=e.createElement("span","lh-crc-node__chain-size");_.textContent=b.i18n.formatBytesToKiB(r,.01),C.append(g,_)}return i}static buildTree(e,n,a,i){if(a.append(De.createChainNode(e,n,i)),n.node.children)for(let o of Object.keys(n.node.children)){let r=De.createSegment(n.node.children,o,n.treeMarkers,n.isLastChild);De.buildTree(e,r,a,i)}}static render(e,n,a){let i=e.createComponent("crc"),o=e.find(".lh-crc",i);e.find(".lh-crc-initial-nav",i).textContent=b.strings.crcInitialNavigation,e.find(".lh-crc__longest_duration_label",i).textContent=b.strings.crcLongestDurationLabel,e.find(".lh-crc__longest_duration",i).textContent=b.i18n.formatMilliseconds(n.longestChain.duration);let r=n.chains;for(let s of Object.keys(r)){let p=De.createSegment(r,s);De.buildTree(e,p,o,a)}return e.find(".lh-crc-container",i)}},De=ze;function To(t,e){return e.left<=t.width&&0<=e.right&&e.top<=t.height&&0<=e.bottom}function ka(t,e,n){return t<e?e:t>n?n:t}function Uo(t){return{x:t.left+t.width/2,y:t.top+t.height/2}}var le=class t{static getScreenshotPositions(e,n,a){let i=Uo(e),o=ka(i.x-n.width/2,0,a.width-n.width),r=ka(i.y-n.height/2,0,a.height-n.height);return{screenshot:{left:o,top:r},clip:{left:e.left-o,top:e.top-r}}}static renderClipPathInScreenshot(e,n,a,i,o){let r=e.find("clipPath",n),s=`clip-${b.getUniqueSuffix()}`;r.id=s,n.style.clipPath=`url(#${s})`;let p=a.top/o.height,c=p+i.height/o.height,l=a.left/o.width,d=l+i.width/o.width,m=[`0,0             1,0            1,${p}          0,${p}`,`0,${c}     1,${c}    1,1               0,1`,`0,${p}        ${l},${p} ${l},${c} 0,${c}`,`${d},${p} 1,${p}       1,${c}       ${d},${c}`];for(let h of m){let f=e.createElementNS("http://www.w3.org/2000/svg","polygon");f.setAttribute("points",h),r.append(f)}}static installFullPageScreenshot(e,n){e.style.setProperty("--element-screenshot-url",`url('${n.data}')`)}static installOverlayFeature(e){let{dom:n,rootEl:a,overlayContainerEl:i,fullPageScreenshot:o}=e,r="lh-screenshot-overlay--enabled";a.classList.contains(r)||(a.classList.add(r),a.addEventListener("click",s=>{let p=s.target;if(!p)return;let c=p.closest(".lh-node > .lh-element-screenshot");if(!c)return;let l=n.createElement("div","lh-element-screenshot__overlay");i.append(l);let d={width:l.clientWidth*.95,height:l.clientHeight*.8},m={width:Number(c.dataset.rectWidth),height:Number(c.dataset.rectHeight),left:Number(c.dataset.rectLeft),right:Number(c.dataset.rectLeft)+Number(c.dataset.rectWidth),top:Number(c.dataset.rectTop),bottom:Number(c.dataset.rectTop)+Number(c.dataset.rectHeight)},h=t.render(n,o.screenshot,m,d);if(!h){l.remove();return}l.append(h),l.addEventListener("click",()=>l.remove())}))}static _computeZoomFactor(e,n){let i={x:n.width/e.width,y:n.height/e.height},o=.75*Math.min(i.x,i.y);return Math.min(1,o)}static render(e,n,a,i){if(!To(n,a))return null;let o=e.createComponent("elementScreenshot"),r=e.find("div.lh-element-screenshot",o);r.dataset.rectWidth=a.width.toString(),r.dataset.rectHeight=a.height.toString(),r.dataset.rectLeft=a.left.toString(),r.dataset.rectTop=a.top.toString();let s=this._computeZoomFactor(a,i),p={width:i.width/s,height:i.height/s};p.width=Math.min(n.width,p.width),p.height=Math.min(n.height,p.height);let c={width:p.width*s,height:p.height*s},l=t.getScreenshotPositions(a,p,{width:n.width,height:n.height}),d=e.find("div.lh-element-screenshot__image",r);d.style.width=c.width+"px",d.style.height=c.height+"px",d.style.backgroundPositionY=-(l.screenshot.top*s)+"px",d.style.backgroundPositionX=-(l.screenshot.left*s)+"px",d.style.backgroundSize=`${n.width*s}px ${n.height*s}px`;let m=e.find("div.lh-element-screenshot__element-marker",r);m.style.width=a.width*s+"px",m.style.height=a.height*s+"px",m.style.left=l.clip.left*s+"px",m.style.top=l.clip.top*s+"px";let h=e.find("div.lh-element-screenshot__mask",r);return h.style.width=c.width+"px",h.style.height=c.height+"px",t.renderClipPathInScreenshot(e,h,l.clip,a,p),r}};var Io=["http://","https://","data:"],Ro=["bytes","numeric","ms","timespanMs"],_e=class{constructor(e,n={}){this._dom=e,this._fullPageScreenshot=n.fullPageScreenshot,this._entities=n.entities}render(e){switch(e.type){case"filmstrip":return this._renderFilmstrip(e);case"list":return this._renderList(e);case"checklist":return this._renderChecklist(e);case"table":case"opportunity":return this._renderTable(e);case"network-tree":case"criticalrequestchain":return ze.render(this._dom,e,this);case"screenshot":case"debugdata":case"treemap-data":return null;default:return this._renderUnknown(e.type,e)}}_renderBytes(e){let n=b.i18n.formatBytesToKiB(e.value,e.granularity||.1),a=this._renderText(n);return a.title=b.i18n.formatBytes(e.value),a}_renderMilliseconds(e){let n;return e.displayUnit==="duration"?n=b.i18n.formatDuration(e.value):n=b.i18n.formatMilliseconds(e.value,e.granularity||10),this._renderText(n)}renderTextURL(e){let n=e,a,i,o;try{let s=U.parseURL(n);a=s.file==="/"?s.origin:s.file,i=s.file==="/"||s.hostname===""?"":`(${s.hostname})`,o=n}catch{a=n}let r=this._dom.createElement("div","lh-text__url");if(r.append(this._renderLink({text:a,url:n})),i){let s=this._renderText(i);s.classList.add("lh-text__url-host"),r.append(s)}return o&&(r.title=n,r.dataset.url=n),r}_renderLink(e){let n=this._dom.createElement("a");if(this._dom.safelySetHref(n,e.url),!n.href){let a=this._renderText(e.text);return a.classList.add("lh-link"),a}return n.rel="noopener",n.target="_blank",n.textContent=e.text,n.classList.add("lh-link"),n}_renderText(e){let n=this._dom.createElement("div","lh-text");return n.textContent=e,n}_renderNumeric(e){let n=b.i18n.formatNumber(e.value,e.granularity||.1),a=this._dom.createElement("div","lh-numeric");return a.textContent=n,a}_renderThumbnail(e){let n=this._dom.createElement("img","lh-thumbnail"),a=e;return n.src=a,n.title=a,n.alt="",n}_renderUnknown(e,n){console.error(`Unknown details type: ${e}`,n);let a=this._dom.createElement("details","lh-unknown");return this._dom.createChildOf(a,"summary").textContent=`We don't know how to render audit details of type \`${e}\`. The Lighthouse version that collected this data is likely newer than the Lighthouse version of the report renderer. Expand for the raw JSON.`,this._dom.createChildOf(a,"pre").textContent=JSON.stringify(n,null,2),a}_renderTableValue(e,n){if(e==null)return null;if(typeof e=="object")switch(e.type){case"code":return this._renderCode(e.value);case"link":return this._renderLink(e);case"node":return this.renderNode(e);case"numeric":return this._renderNumeric(e);case"text":return this._renderText(e.value);case"source-location":return this.renderSourceLocation(e);case"url":return this.renderTextURL(e.value);default:return this._renderUnknown(e.type,e)}switch(n.valueType){case"bytes":{let a=Number(e);return this._renderBytes({value:a,granularity:n.granularity})}case"code":{let a=String(e);return this._renderCode(a)}case"ms":{let a={value:Number(e),granularity:n.granularity,displayUnit:n.displayUnit};return this._renderMilliseconds(a)}case"numeric":{let a=Number(e);return this._renderNumeric({value:a,granularity:n.granularity})}case"text":{let a=String(e);return this._renderText(a)}case"thumbnail":{let a=String(e);return this._renderThumbnail(a)}case"timespanMs":{let a=Number(e);return this._renderMilliseconds({value:a})}case"url":{let a=String(e);return Io.some(i=>a.startsWith(i))?this.renderTextURL(a):this._renderCode(a)}default:return this._renderUnknown(n.valueType,e)}}_getDerivedSubItemsHeading(e){return e.subItemsHeading?{key:e.subItemsHeading.key||"",valueType:e.subItemsHeading.valueType||e.valueType,granularity:e.subItemsHeading.granularity||e.granularity,displayUnit:e.subItemsHeading.displayUnit||e.displayUnit,label:""}:null}_renderTableRow(e,n){let a=this._dom.createElement("tr");for(let i of n){if(!i||!i.key){this._dom.createChildOf(a,"td","lh-table-column--empty");continue}let o=e[i.key],r;if(o!=null&&(r=this._renderTableValue(o,i)),r){let s=`lh-table-column--${i.valueType}`;this._dom.createChildOf(a,"td",s).append(r)}else this._dom.createChildOf(a,"td","lh-table-column--empty")}return a}_renderTableRowsFromItem(e,n){let a=this._dom.createFragment();if(a.append(this._renderTableRow(e,n)),!e.subItems)return a;let i=n.map(this._getDerivedSubItemsHeading);if(!i.some(Boolean))return a;for(let o of e.subItems.items){let r=this._renderTableRow(o,i);r.classList.add("lh-sub-item-row"),a.append(r)}return a}_adornEntityGroupRow(e){let n=e.dataset.entity;if(!n)return;let a=this._entities?.find(o=>o.name===n);if(!a)return;let i=this._dom.find("td",e);if(a.category){let o=this._dom.createElement("span");o.classList.add("lh-audit__adorn"),o.textContent=a.category,i.append(" ",o)}if(a.isFirstParty){let o=this._dom.createElement("span");o.classList.add("lh-audit__adorn","lh-audit__adorn1p"),o.textContent=b.strings.firstPartyChipLabel,i.append(" ",o)}if(a.homepage){let o=this._dom.createElement("a");o.href=a.homepage,o.target="_blank",o.title=b.strings.openInANewTabTooltip,o.classList.add("lh-report-icon--external"),i.append(" ",o)}}_renderEntityGroupRow(e,n){let a={...n[0]};a.valueType="text";let i=[a,...n.slice(1)],o=this._dom.createFragment();return o.append(this._renderTableRow(e,i)),this._dom.find("tr",o).classList.add("lh-row--group"),o}_getEntityGroupItems(e){let{items:n,headings:a,sortedBy:i}=e;if(!n.length||e.isEntityGrouped||!n.some(l=>l.entity))return[];let o=new Set(e.skipSumming||[]),r=[];for(let l of a)!l.key||o.has(l.key)||Ro.includes(l.valueType)&&r.push(l.key);let s=a[0].key;if(!s)return[];let p=new Map;for(let l of n){let d=typeof l.entity=="string"?l.entity:void 0,m=p.get(d)||{[s]:d||b.strings.unattributable,entity:d};for(let h of r)m[h]=Number(m[h]||0)+Number(l[h]||0);p.set(d,m)}let c=[...p.values()];return i&&c.sort(A.getTableItemSortComparator(i)),c}_renderTable(e){if(!e.items.length)return this._dom.createElement("span");let n=this._dom.createElement("table","lh-table"),a=this._dom.createChildOf(n,"thead"),i=this._dom.createChildOf(a,"tr");for(let s of e.headings){let c=`lh-table-column--${s.valueType||"text"}`,l=this._dom.createElement("div","lh-text");l.textContent=s.label,this._dom.createChildOf(i,"th",c).append(l)}let o=this._getEntityGroupItems(e),r=this._dom.createChildOf(n,"tbody");if(o.length)for(let s of o){let p=typeof s.entity=="string"?s.entity:void 0,c=this._renderEntityGroupRow(s,e.headings);for(let d of e.items.filter(m=>m.entity===p))c.append(this._renderTableRowsFromItem(d,e.headings));let l=this._dom.findAll("tr",c);p&&l.length&&(l.forEach(d=>d.dataset.entity=p),this._adornEntityGroupRow(l[0])),r.append(c)}else{let s=!0;for(let p of e.items){let c=this._renderTableRowsFromItem(p,e.headings),l=this._dom.findAll("tr",c),d=l[0];if(typeof p.entity=="string"&&(d.dataset.entity=p.entity),e.isEntityGrouped&&p.entity)d.classList.add("lh-row--group"),this._adornEntityGroupRow(d);else for(let m of l)m.classList.add(s?"lh-row--even":"lh-row--odd");s=!s,r.append(c)}}return n}_renderList(e){let n=this._dom.createElement("div","lh-list");return e.items.forEach(a=>{if(a.type==="node"){n.append(this.renderNode(a));return}let i=this.render(a);i&&n.append(i)}),n}_renderChecklist(e){let n=this._dom.createElement("ul","lh-checklist");return Object.values(e.items).forEach(a=>{let i=this._dom.createChildOf(n,"li","lh-checklist-item"),o=a.value?"lh-report-plain-icon--checklist-pass":"lh-report-plain-icon--checklist-fail";this._dom.createChildOf(i,"span",`lh-report-plain-icon ${o}`).textContent=a.label}),n}renderNode(e){let n=this._dom.createElement("span","lh-node");if(e.nodeLabel){let r=this._dom.createElement("div");r.textContent=e.nodeLabel,n.append(r)}if(e.snippet){let r=this._dom.createElement("div");r.classList.add("lh-node__snippet"),r.textContent=e.snippet,n.append(r)}if(e.selector&&(n.title=e.selector),e.path&&n.setAttribute("data-path",e.path),e.selector&&n.setAttribute("data-selector",e.selector),e.snippet&&n.setAttribute("data-snippet",e.snippet),!this._fullPageScreenshot)return n;let a=e.lhId&&this._fullPageScreenshot.nodes[e.lhId];if(!a||a.width===0||a.height===0)return n;let i={width:147,height:100},o=le.render(this._dom,this._fullPageScreenshot.screenshot,a,i);return o&&n.prepend(o),n}renderSourceLocation(e){if(!e.url)return null;let n=`${e.url}:${e.line+1}:${e.column}`,a;e.original&&(a=`${e.original.file||"<unmapped>"}:${e.original.line+1}:${e.original.column}`);let i;if(e.urlProvider==="network"&&a)i=this._renderLink({url:e.url,text:a}),i.title=`maps to generated location ${n}`;else if(e.urlProvider==="network"&&!a)i=this.renderTextURL(e.url),this._dom.find(".lh-link",i).textContent+=`:${e.line+1}:${e.column}`;else if(e.urlProvider==="comment"&&a)i=this._renderText(`${a} (from source map)`),i.title=`${n} (from sourceURL)`;else if(e.urlProvider==="comment"&&!a)i=this._renderText(`${n} (from sourceURL)`);else return null;return i.classList.add("lh-source-location"),i.setAttribute("data-source-url",e.url),i.setAttribute("data-source-line",String(e.line)),i.setAttribute("data-source-column",String(e.column)),i}_renderFilmstrip(e){let n=this._dom.createElement("div","lh-filmstrip");for(let a of e.items){let i=this._dom.createChildOf(n,"div","lh-filmstrip__frame"),o=this._dom.createChildOf(i,"img","lh-filmstrip__thumbnail");o.src=a.data,o.alt="Screenshot"}return n}_renderCode(e){let n=this._dom.createElement("pre","lh-code");return n.textContent=e,n}};function Pa(t){let e=t.createComponent("explodeyGauge");return t.find(".lh-exp-gauge-component",e)}function Aa(t,e,n){let a=t.find("div.lh-exp-gauge__wrapper",e);a.className="",a.classList.add("lh-exp-gauge__wrapper",`lh-exp-gauge__wrapper--${A.calculateRating(n.score)}`),Do(t,a,n)}function No(t,e,n){n=n||t/32;let a=t/n,i=.5*n,o=a+i+n,r=2*Math.PI*a,s=Math.acos(1-.5*Math.pow(.5*n/a,2))*a,p=2*Math.PI*o,c=Math.acos(1-.5*Math.pow(.5*n/o,2))*o;return{radiusInner:a,radiusOuter:o,circumferenceInner:r,circumferenceOuter:p,getArcLength:()=>Math.max(0,Number(e*r)),getMetricArcLength:(l,d=!1)=>{let m=d?0:2*c;return Math.max(0,Number(l*p-i-m))},endDiffInner:s,endDiffOuter:c,strokeWidth:n,strokeGap:i}}function Do(t,e,n){let o=Number(n.score),{radiusInner:r,radiusOuter:s,circumferenceInner:p,circumferenceOuter:c,getArcLength:l,getMetricArcLength:d,endDiffInner:m,endDiffOuter:h,strokeWidth:f,strokeGap:C}=No(128,o),g=t.find("svg.lh-exp-gauge",e);t.find(".lh-exp-gauge__label",g).textContent=n.title,g.setAttribute("viewBox",[-64,-64/2,128,128/2].join(" ")),g.style.setProperty("--stroke-width",`${f}px`),g.style.setProperty("--circle-meas",(2*Math.PI).toFixed(4));let _=t.find("g.lh-exp-gauge__outer",e),v=t.find("g.lh-exp-gauge__inner",e),y=t.find("circle.lh-cover",_),w=t.find("circle.lh-exp-gauge__arc",v),P=t.find("text.lh-exp-gauge__percentage",v);_.style.setProperty("--scale-initial",String(r/s)),_.style.setProperty("--radius",`${s}px`),y.style.setProperty("--radius",`${.5*(r+s)}px`),y.setAttribute("stroke-width",String(C)),g.style.setProperty("--radius",`${r}px`),w.setAttribute("stroke-dasharray",`${l()} ${(p-l()).toFixed(4)}`),w.setAttribute("stroke-dashoffset",String(.25*p-m)),P.textContent=Math.round(o*100).toString();let L=s+f,R=s-f,M=n.auditRefs.filter(E=>E.group==="metrics"&&E.weight),G=M.reduce((E,z)=>E+=z.weight,0),Z=.25*c-h-.5*C,K=-.5*Math.PI;_.querySelectorAll(".metric").forEach(E=>{M.map(V=>`metric--${V.id}`).find(V=>E.classList.contains(V))||E.remove()}),M.forEach((E,z)=>{let H=E.acronym??E.id,V=!_.querySelector(`.metric--${H}`),O=t.maybeFind(`g.metric--${H}`,_)||t.createSVGElement("g"),me=t.maybeFind(`.metric--${H} circle.lh-exp-gauge--faded`,_)||t.createSVGElement("circle"),we=t.maybeFind(`.metric--${H} circle.lh-exp-gauge--miniarc`,_)||t.createSVGElement("circle"),de=t.maybeFind(`.metric--${H} circle.lh-exp-gauge-hovertarget`,_)||t.createSVGElement("circle"),W=t.maybeFind(`.metric--${H} text.metric__label`,_)||t.createSVGElement("text"),Y=t.maybeFind(`.metric--${H} text.metric__value`,_)||t.createSVGElement("text");O.classList.add("metric",`metric--${H}`),me.classList.add("lh-exp-gauge__arc","lh-exp-gauge__arc--metric","lh-exp-gauge--faded"),we.classList.add("lh-exp-gauge__arc","lh-exp-gauge__arc--metric","lh-exp-gauge--miniarc"),de.classList.add("lh-exp-gauge__arc","lh-exp-gauge__arc--metric","lh-exp-gauge-hovertarget");let he=E.weight/G,Jt=d(he),Zt=E.result.score?E.result.score*he:0,Kt=d(Zt),ti=he*c,Xt=d(he,!0),Yt=A.calculateRating(E.result.score,E.result.scoreDisplayMode);O.style.setProperty("--metric-rating",Yt),O.style.setProperty("--metric-color",`var(--color-${Yt})`),O.style.setProperty("--metric-offset",`${Z}`),O.style.setProperty("--i",z.toString()),me.setAttribute("stroke-dasharray",`${Jt} ${c-Jt}`),we.style.setProperty("--metric-array",`${Kt} ${c-Kt}`),de.setAttribute("stroke-dasharray",`${Xt} ${c-Xt-h}`),W.classList.add("metric__label"),Y.classList.add("metric__value"),W.textContent=H,Y.textContent=`+${Math.round(Zt*100)}`;let Qt=K+he*Math.PI,xe=Math.cos(Qt),Se=Math.sin(Qt);switch(!0){case xe>0:Y.setAttribute("text-anchor","end");break;case xe<0:W.setAttribute("text-anchor","end");break;case xe===0:W.setAttribute("text-anchor","middle"),Y.setAttribute("text-anchor","middle");break}switch(!0){case Se>0:W.setAttribute("dominant-baseline","hanging");break;case Se<0:Y.setAttribute("dominant-baseline","hanging");break;case Se===0:W.setAttribute("dominant-baseline","middle"),Y.setAttribute("dominant-baseline","middle");break}W.setAttribute("x",(L*xe).toFixed(2)),W.setAttribute("y",(L*Se).toFixed(2)),Y.setAttribute("x",(R*xe).toFixed(2)),Y.setAttribute("y",(R*Se).toFixed(2)),V&&(O.appendChild(me),O.appendChild(we),O.appendChild(de),O.appendChild(W),O.appendChild(Y),_.appendChild(O)),Z-=ti,K+=he*2*Math.PI});let q=_.querySelector(".lh-exp-gauge-underhovertarget")||t.createSVGElement("circle");q.classList.add("lh-exp-gauge__arc","lh-exp-gauge__arc--metric","lh-exp-gauge-hovertarget","lh-exp-gauge-underhovertarget");let X=d(1,!0);if(q.setAttribute("stroke-dasharray",`${X} ${c-X-h}`),q.isConnected||_.prepend(q),g.dataset.listenersSetup)return;g.dataset.listenersSetup=!0,ei(g),g.addEventListener("pointerover",E=>{if(E.target===g&&g.classList.contains("state--expanded")){g.classList.remove("state--expanded"),g.classList.contains("state--highlight")&&(g.classList.remove("state--highlight"),t.find(".metric--highlight",g).classList.remove("metric--highlight"));return}if(!(E.target instanceof Element))return;let z=E.target.parentNode;if(z instanceof SVGElement){if(z&&z===v){g.classList.contains("state--expanded")?g.classList.contains("state--highlight")&&(g.classList.remove("state--highlight"),t.find(".metric--highlight",g).classList.remove("metric--highlight")):g.classList.add("state--expanded");return}if(z&&z.classList&&z.classList.contains("metric")){let H=z.style.getPropertyValue("--metric-rating");if(e.style.setProperty("--color-highlight",`var(--color-${H}-secondary)`),!g.classList.contains("state--highlight"))g.classList.add("state--highlight"),z.classList.add("metric--highlight");else{let V=t.find(".metric--highlight",g);z!==V&&(V.classList.remove("metric--highlight"),z.classList.add("metric--highlight"))}}}}),g.addEventListener("mouseleave",()=>{g.classList.remove("state--highlight"),g.querySelector(".metric--highlight")?.classList.remove("metric--highlight")});async function ei(E){if(await new Promise(W=>setTimeout(W,1e3)),E.classList.contains("state--expanded"))return;let z=t.find(".lh-exp-gauge__inner",E),H=`uniq-${Math.random()}`;z.setAttribute("id",H);let V=t.createSVGElement("use");V.setAttribute("href",`#${H}`),E.appendChild(V);let O=2.5;E.style.setProperty("--peek-dur",`${O}s`),E.classList.add("state--peek","state--expanded");let me=()=>{E.classList.remove("state--peek","state--expanded"),V.remove()},we=setTimeout(()=>{E.removeEventListener("mouseenter",de),me()},O*1e3*1.5);function de(){clearTimeout(we),me()}E.addEventListener("mouseenter",de,{once:!0})}}var Ea="__lh__insights_audits_toggle_state",mt=class extends se{_memoryInsightToggleState="DEFAULT";_renderMetric(e){let n=this.dom.createComponent("metric"),a=this.dom.find(".lh-metric",n);a.id=e.result.id;let i=A.calculateRating(e.result.score,e.result.scoreDisplayMode);a.classList.add(`lh-metric--${i}`);let o=this.dom.find(".lh-metric__title",n);o.textContent=e.result.title;let r=this.dom.find(".lh-metric__value",n);r.textContent=e.result.displayValue||"";let s=this.dom.find(".lh-metric__description",n);if(s.append(this.dom.convertMarkdownLinkSnippets(e.result.description)),e.result.scoreDisplayMode==="error"){s.textContent="",r.textContent="Error!";let p=this.dom.createChildOf(s,"span");p.textContent=e.result.errorMessage||"Report error: no metric information"}else e.result.scoreDisplayMode==="notApplicable"&&(r.textContent="--");return a}_getScoringCalculatorHref(e){let n=e.filter(d=>d.group==="metrics"),a=e.find(d=>d.id==="interactive"),i=e.find(d=>d.id==="first-cpu-idle"),o=e.find(d=>d.id==="first-meaningful-paint");a&&n.push(a),i&&n.push(i),o&&typeof o.result.score=="number"&&n.push(o);let r=d=>Math.round(d*100)/100,p=[...n.map(d=>{let m;return typeof d.result.numericValue=="number"?(m=d.id==="cumulative-layout-shift"?r(d.result.numericValue):Math.round(d.result.numericValue),m=m.toString()):m="null",[d.acronym||d.id,m]})];b.reportJson&&(p.push(["device",b.reportJson.configSettings.formFactor]),p.push(["version",b.reportJson.lighthouseVersion]));let c=new URLSearchParams(p),l=new URL("https://googlechrome.github.io/lighthouse/scorecalc/");return l.hash=c.toString(),l.href}overallImpact(e,n){if(!e.result.metricSavings)return{overallImpact:0,overallLinearImpact:0};let a=0,i=0;for(let[o,r]of Object.entries(e.result.metricSavings)){if(r===void 0)continue;let s=n.find(h=>h.acronym===o);if(!s||s.result.score===null)continue;let p=s.result.numericValue;if(!p)continue;let c=r/p*s.weight;i+=c;let l=s.result.scoringOptions;if(!l)continue;let m=(U.computeLogNormalScore(l,p-r)-s.result.score)*s.weight;a+=m}return{overallImpact:a,overallLinearImpact:i}}_persistInsightToggleToStorage(e){try{window.localStorage.setItem(Ea,e)}finally{this._memoryInsightToggleState=e}}_getInsightToggleState(){let e=this._getRawInsightToggleState();return e==="DEFAULT"&&(e="AUDITS"),e}_getRawInsightToggleState(){try{let e=window.localStorage.getItem(Ea);if(e==="AUDITS"||e==="INSIGHTS")return e}catch{return this._memoryInsightToggleState}return"DEFAULT"}_setInsightToggleButtonText(e){let n=this._getInsightToggleState();e.innerText=n==="AUDITS"?b.strings.tryInsights:b.strings.goBackToAudits}_renderInsightsToggle(e){let n=this.dom.createChildOf(e,"div","lh-perf-insights-toggle"),a=this.dom.createChildOf(n,"span","lh-perf-toggle-text"),i=this.dom.createElement("span","lh-perf-insights-icon insights-icon-url");a.appendChild(i),a.appendChild(this.dom.convertMarkdownLinkSnippets(b.strings.insightsNotice));let r=this.dom.createChildOf(n,"button","lh-button lh-button-insight-toggle");this._setInsightToggleButtonText(r),r.addEventListener("click",s=>{s.preventDefault();let p=this.dom.maybeFind(".lh-perf-audits--swappable");p&&this.dom.swapSectionIfPossible(p);let l=this._getInsightToggleState()==="AUDITS"?"INSIGHTS":"AUDITS";this.dom.fireEventOn("lh-analytics",this.dom.document(),{name:"toggle_insights",data:{newState:l}}),this._persistInsightToggleToStorage(l),this._setInsightToggleButtonText(r)}),n.appendChild(r)}render(e,n,a){let i=b.strings,o=this.dom.createElement("div","lh-category");o.id=e.id,o.append(this.renderCategoryHeader(e,n,a));let r=e.auditRefs.filter(h=>h.group==="metrics");if(r.length){let[h,f]=this.renderAuditGroup(n.metrics),C=this.dom.createElement("input","lh-metrics-toggle__input"),g=`lh-metrics-toggle${b.getUniqueSuffix()}`;C.setAttribute("aria-label","Toggle the display of metric descriptions"),C.type="checkbox",C.id=g,h.prepend(C);let _=this.dom.find(".lh-audit-group__header",h),v=this.dom.createChildOf(_,"label","lh-metrics-toggle__label");v.htmlFor=g;let y=this.dom.createChildOf(v,"span","lh-metrics-toggle__labeltext--show"),w=this.dom.createChildOf(v,"span","lh-metrics-toggle__labeltext--hide");y.textContent=b.strings.expandView,w.textContent=b.strings.collapseView;let P=this.dom.createElement("div","lh-metrics-container");if(h.insertBefore(P,f),r.forEach(L=>{P.append(this._renderMetric(L))}),o.querySelector(".lh-gauge__wrapper")){let L=this.dom.find(".lh-category-header__description",o),R=this.dom.createChildOf(L,"div","lh-metrics__disclaimer"),M=this.dom.convertMarkdownLinkSnippets(i.varianceDisclaimer);R.append(M);let G=this.dom.createChildOf(R,"a","lh-calclink");G.target="_blank",G.textContent=i.calculatorLink,this.dom.safelySetHref(G,this._getScoringCalculatorHref(e.auditRefs))}h.classList.add("lh-audit-group--metrics"),o.append(h)}let s=this.dom.createChildOf(o,"div","lh-filmstrip-container"),c=e.auditRefs.find(h=>h.id==="screenshot-thumbnails")?.result;if(c?.details){s.id=c.id;let h=this.detailsRenderer.render(c.details);h&&s.append(h)}this._renderInsightsToggle(o);let l=this.renderFilterableSection(e,n,["diagnostics"],r);l?.classList.add("lh-perf-audits--swappable","lh-perf-audits--legacy");let d=this.renderFilterableSection(e,n,["insights","diagnostics"],r);if(d?.classList.add("lh-perf-audits--swappable","lh-perf-audits--experimental"),l&&(o.append(l),d&&this.dom.registerSwappableSections(l,d)),this._getInsightToggleState()==="INSIGHTS"&&requestAnimationFrame(()=>{let h=this.dom.maybeFind(".lh-perf-audits--swappable");h&&this.dom.swapSectionIfPossible(h)}),this.dom.fireEventOn("lh-analytics",this.dom.document(),{name:"initial_insights_state",data:{state:this._getRawInsightToggleState()}}),(!a||a?.gatherMode==="navigation")&&e.score!==null){let h=Pa(this.dom);Aa(this.dom,h,e),this.dom.find(".lh-score__gauge",o).replaceWith(h)}return o}renderFilterableSection(e,n,a,i){if(a.some(v=>!n[v]))return null;let o=this.dom.createElement("div"),r=new Set,s=v=>v.id.endsWith("-insight")?"insights":v.group??"",p=e.auditRefs.filter(v=>a.includes(s(v)));for(let v of p)v.result.replacesAudits?.forEach(y=>{r.add(y)});let c=p.filter(v=>!r.has(v.id)).map(v=>{let{overallImpact:y,overallLinearImpact:w}=this.overallImpact(v,i),P=v.result.guidanceLevel||1,L=this.renderAudit(v);return{auditRef:v,auditEl:L,overallImpact:y,overallLinearImpact:w,guidanceLevel:P}}),l=c.filter(v=>!A.showAsPassed(v.auditRef.result)),d=c.filter(v=>A.showAsPassed(v.auditRef.result)),m={};for(let v of a){let y=this.renderAuditGroup(n[v]);y[0].classList.add(`lh-audit-group--${v}`),m[v]=y}function h(v){for(let y of c)if(v==="All")y.auditEl.hidden=!1;else{let w=y.auditRef.result.metricSavings?.[v]===void 0;y.auditEl.hidden=w}l.sort((y,w)=>{let P=y.auditRef.result.score||0,L=w.auditRef.result.score||0;if(P!==L)return P-L;if(v!=="All"){let R=y.auditRef.result.metricSavings?.[v]??-1,M=w.auditRef.result.metricSavings?.[v]??-1;if(R!==M)return M-R}return y.overallImpact!==w.overallImpact?w.overallImpact*w.guidanceLevel-y.overallImpact*y.guidanceLevel:y.overallImpact===0&&w.overallImpact===0&&y.overallLinearImpact!==w.overallLinearImpact?w.overallLinearImpact*w.guidanceLevel-y.overallLinearImpact*y.guidanceLevel:w.guidanceLevel-y.guidanceLevel});for(let y of l){if(!y.auditRef.group)continue;let w=m[s(y.auditRef)];if(!w)continue;let[P,L]=w;P.insertBefore(y.auditEl,L)}}let f=new Set;for(let v of l){let y=v.auditRef.result.metricSavings||{};for(let[w,P]of Object.entries(y))typeof P=="number"&&f.add(w)}let C=i.filter(v=>v.acronym&&f.has(v.acronym));C.length&&this.renderMetricAuditFilter(C,o,h),h("All");for(let v of a)if(l.some(y=>s(y.auditRef)===v)){let y=m[v];if(!y)continue;o.append(y[0])}if(!d.length)return o;let g={auditRefsOrEls:d.map(v=>v.auditEl),groupDefinitions:n},_=this.renderClump("passed",g);return o.append(_),o}renderMetricAuditFilter(e,n,a){let i=this.dom.createElement("div","lh-metricfilter"),o=this.dom.createChildOf(i,"span","lh-metricfilter__text");o.textContent=b.strings.showRelevantAudits;let r=[{acronym:"All",id:"All"},...e],s=b.getUniqueSuffix();for(let p of r){let c=`metric-${p.acronym}-${s}`,l=this.dom.createChildOf(i,"input","lh-metricfilter__radio");l.type="radio",l.name=`metricsfilter-${s}`,l.id=c;let d=this.dom.createChildOf(i,"label","lh-metricfilter__label");d.htmlFor=c,d.title="result"in p?p.result.title:"",d.textContent=p.acronym||p.id,p.acronym==="All"&&(l.checked=!0,d.classList.add("lh-metricfilter__label--active")),n.append(i),l.addEventListener("input",m=>{for(let f of n.querySelectorAll("label.lh-metricfilter__label"))f.classList.toggle("lh-metricfilter__label--active",f.htmlFor===c);n.classList.toggle("lh-category--filtered",p.acronym!=="All"),a(p.acronym||"All");let h=n.querySelectorAll("div.lh-audit-group, details.lh-audit-group");for(let f of h){f.hidden=!1;let C=Array.from(f.querySelectorAll("div.lh-audit")),g=!!C.length&&C.every(_=>_.hidden);f.hidden=g}})}}};var dt=class{constructor(e){this._dom=e,this._opts={}}renderReport(e,n,a){if(!this._dom.rootEl&&n){console.warn("Please adopt the new report API in renderer/api.js.");let o=n.closest(".lh-root");o?this._dom.rootEl=o:(n.classList.add("lh-root","lh-vars"),this._dom.rootEl=n)}else this._dom.rootEl&&n&&(this._dom.rootEl=n);a&&(this._opts=a),this._dom.setLighthouseChannel(e.configSettings.channel||"unknown");let i=A.prepareReportResult(e);return this._dom.rootEl.textContent="",this._dom.rootEl.append(this._renderReport(i)),this._opts.occupyEntireViewport&&this._dom.rootEl.classList.add("lh-max-viewport"),this._dom.rootEl}_renderReportTopbar(e){let n=this._dom.createComponent("topbar"),a=this._dom.find("a.lh-topbar__url",n);return a.textContent=e.finalDisplayedUrl,a.title=e.finalDisplayedUrl,this._dom.safelySetHref(a,e.finalDisplayedUrl),n}_renderReportHeader(){let e=this._dom.createComponent("heading"),n=this._dom.createComponent("scoresWrapper");return this._dom.find(".lh-scores-wrapper-placeholder",e).replaceWith(n),e}_renderReportFooter(e){let n=this._dom.createComponent("footer");return this._renderMetaBlock(e,n),this._dom.find(".lh-footer__version_issue",n).textContent=b.strings.footerIssue,this._dom.find(".lh-footer__version",n).textContent=e.lighthouseVersion,n}_renderMetaBlock(e,n){let a=A.getEmulationDescriptions(e.configSettings||{}),i=e.userAgent.match(/(\w*Chrome\/[\d.]+)/),o=Array.isArray(i)?i[1].replace("/"," ").replace("Chrome","Chromium"):"Chromium",r=e.configSettings.channel,s=e.environment.benchmarkIndex.toFixed(0),p=e.environment.credits?.["axe-core"],c=[`${b.strings.runtimeSettingsBenchmark}: ${s}`,`${b.strings.runtimeSettingsCPUThrottling}: ${a.cpuThrottling}`];a.screenEmulation&&c.push(`${b.strings.runtimeSettingsScreenEmulation}: ${a.screenEmulation}`),p&&c.push(`${b.strings.runtimeSettingsAxeVersion}: ${p}`);let l=b.strings.runtimeAnalysisWindow;e.gatherMode==="timespan"?l=b.strings.runtimeAnalysisWindowTimespan:e.gatherMode==="snapshot"&&(l=b.strings.runtimeAnalysisWindowSnapshot);let d=[["date",`Captured at ${b.i18n.formatDateTime(e.fetchTime)}`],["devices",`${a.deviceEmulation} with Lighthouse ${e.lighthouseVersion}`,c.join(`
`)],["samples-one",b.strings.runtimeSingleLoad,b.strings.runtimeSingleLoadTooltip],["stopwatch",l],["networkspeed",`${a.summary}`,`${b.strings.runtimeSettingsNetworkThrottling}: ${a.networkThrottling}`],["chrome",`Using ${o}`+(r?` with ${r}`:""),`${b.strings.runtimeSettingsUANetwork}: "${e.environment.networkUserAgent}"`]],m=this._dom.find(".lh-meta__items",n);for(let[h,f,C]of d){let g=this._dom.createChildOf(m,"li","lh-meta__item");if(g.textContent=f,C){g.classList.add("lh-tooltip-boundary");let _=this._dom.createChildOf(g,"div","lh-tooltip");_.textContent=C}g.classList.add("lh-report-icon",`lh-report-icon--${h}`)}}_renderReportWarnings(e){if(!e.runWarnings||e.runWarnings.length===0)return this._dom.createElement("div");let n=this._dom.createComponent("warningsToplevel"),a=this._dom.find(".lh-warnings__msg",n);a.textContent=b.strings.toplevelWarningsMessage;let i=[];for(let o of e.runWarnings){let r=this._dom.createElement("li");r.append(this._dom.convertMarkdownLinkSnippets(o)),i.push(r)}return this._dom.find("ul",n).append(...i),n}_renderScoreGauges(e,n,a){let i=[],o=[];for(let r of Object.values(e.categories)){let p=(a[r.id]||n).renderCategoryScore(r,e.categoryGroups||{},{gatherMode:e.gatherMode}),c=this._dom.find("a.lh-gauge__wrapper, a.lh-fraction__wrapper",p);c&&(this._dom.safelySetHref(c,`#${r.id}`),c.addEventListener("click",l=>{if(!c.matches('[href^="#"]'))return;let d=c.getAttribute("href"),m=this._dom.rootEl;if(!d||!m)return;let h=this._dom.find(d,m);l.preventDefault(),h.scrollIntoView()}),this._opts.onPageAnchorRendered?.(c)),A.isPluginCategory(r.id)?o.push(p):i.push(p)}return[...i,...o]}_renderReport(e){b.apply({providedStrings:e.i18n.rendererFormattedStrings,i18n:new ce(e.configSettings.locale),reportJson:e});let n=new _e(this._dom,{fullPageScreenshot:e.fullPageScreenshot??void 0,entities:e.entities}),a=new se(this._dom,n),i={performance:new mt(this._dom,n)},o=this._dom.createElement("div");o.append(this._renderReportHeader());let r=this._dom.createElement("div","lh-container"),s=this._dom.createElement("div","lh-report");s.append(this._renderReportWarnings(e));let p;Object.keys(e.categories).length===1?o.classList.add("lh-header--solo-category"):p=this._dom.createElement("div","lh-scores-header");let l=this._dom.createElement("div");if(l.classList.add("lh-scorescale-wrap"),l.append(this._dom.createComponent("scorescale")),p){let f=this._dom.find(".lh-scores-container",o);p.append(...this._renderScoreGauges(e,a,i)),f.append(p,l);let C=this._dom.createElement("div","lh-sticky-header");C.append(...this._renderScoreGauges(e,a,i)),r.append(C)}let d=this._dom.createElement("div","lh-categories");s.append(d);let m={gatherMode:e.gatherMode};for(let f of Object.values(e.categories)){let C=i[f.id]||a;C.dom.createChildOf(d,"div","lh-category-wrapper").append(C.render(f,e.categoryGroups,m))}a.injectFinalScreenshot(d,e.audits,l);let h=this._dom.createFragment();return this._opts.omitGlobalStyles||h.append(this._dom.createComponent("styles")),this._opts.omitTopbar||h.append(this._renderReportTopbar(e)),h.append(r),s.append(this._renderReportFooter(e)),r.append(o,s),e.fullPageScreenshot&&le.installFullPageScreenshot(this._dom.rootEl,e.fullPageScreenshot.screenshot),h}};function Ce(t,e){let n=t.rootEl;typeof e>"u"?n.classList.toggle("lh-dark"):n.classList.toggle("lh-dark",e)}var zo=typeof btoa<"u"?btoa:t=>Buffer.from(t).toString("base64"),jo=typeof atob<"u"?atob:t=>Buffer.from(t,"base64").toString();async function Mo(t,e){let n=new TextEncoder().encode(t);if(e.gzip)if(typeof CompressionStream<"u"){let o=new CompressionStream("gzip"),r=o.writable.getWriter();r.write(n),r.close();let s=await new Response(o.readable).arrayBuffer();n=new Uint8Array(s)}else n=window.pako.gzip(t);let a="",i=5e3;for(let o=0;o<n.length;o+=i)a+=String.fromCharCode(...n.subarray(o,o+i));return zo(a)}function Ho(t,e){let n=jo(t),a=Uint8Array.from(n,i=>i.charCodeAt(0));return e.gzip?window.pako.ungzip(a,{to:"string"}):new TextDecoder().decode(a)}var La={toBase64:Mo,fromBase64:Ho};function Gt(){let t=window.location.host.endsWith(".vercel.app"),e=new URLSearchParams(window.location.search).has("dev");return t?`https://${window.location.host}/gh-pages`:e?"http://localhost:7333":"https://googlechrome.github.io/lighthouse"}function Vt(t){let e=t.generatedTime,n=t.fetchTime||e;return`${t.lighthouseVersion}-${t.finalDisplayedUrl}-${n}`}function Fo(t,e,n){let a=new URL(e).origin;window.addEventListener("message",function o(r){r.origin===a&&i&&r.data.opened&&(i.postMessage(t,a),window.removeEventListener("message",o))});let i=window.open(e,n)}async function Ta(t,e,n){let a=new URL(e),i=!!window.CompressionStream;a.hash=await La.toBase64(JSON.stringify(t),{gzip:i}),i&&a.searchParams.set("gzip","1"),window.open(a.toString(),n)}async function Ua(t){let e="viewer-"+Vt(t),n=Gt()+"/viewer/";await Ta({lhr:t},n,e)}async function Ia(t){let e="viewer-"+Vt(t),n=Gt()+"/viewer/";Fo({lhr:t},n,e)}function Ra(t){if(!t.audits["script-treemap-data"].details)throw new Error("no script treemap data found");let n={lhr:{mainDocumentUrl:t.mainDocumentUrl,finalUrl:t.finalUrl,finalDisplayedUrl:t.finalDisplayedUrl,audits:{"script-treemap-data":t.audits["script-treemap-data"]},configSettings:{locale:t.configSettings.locale}}},a=Gt()+"/treemap/",i="treemap-"+Vt(t);Ta(n,a,i)}var ht=class{constructor(e){this._dom=e,this._toggleEl,this._menuEl,this.onDocumentKeyDown=this.onDocumentKeyDown.bind(this),this.onToggleClick=this.onToggleClick.bind(this),this.onToggleKeydown=this.onToggleKeydown.bind(this),this.onMenuFocusOut=this.onMenuFocusOut.bind(this),this.onMenuKeydown=this.onMenuKeydown.bind(this),this._getNextMenuItem=this._getNextMenuItem.bind(this),this._getNextSelectableNode=this._getNextSelectableNode.bind(this),this._getPreviousMenuItem=this._getPreviousMenuItem.bind(this)}setup(e){this._toggleEl=this._dom.find(".lh-topbar button.lh-tools__button",this._dom.rootEl),this._toggleEl.addEventListener("click",this.onToggleClick),this._toggleEl.addEventListener("keydown",this.onToggleKeydown),this._menuEl=this._dom.find(".lh-topbar div.lh-tools__dropdown",this._dom.rootEl),this._menuEl.addEventListener("keydown",this.onMenuKeydown),this._menuEl.addEventListener("click",e)}close(){this._toggleEl.classList.remove("lh-active"),this._toggleEl.setAttribute("aria-expanded","false"),this._menuEl.contains(this._dom.document().activeElement)&&this._toggleEl.focus(),this._menuEl.removeEventListener("focusout",this.onMenuFocusOut),this._dom.document().removeEventListener("keydown",this.onDocumentKeyDown)}open(e){this._toggleEl.classList.contains("lh-active")?e.focus():this._menuEl.addEventListener("transitionend",()=>{e.focus()},{once:!0}),this._toggleEl.classList.add("lh-active"),this._toggleEl.setAttribute("aria-expanded","true"),this._menuEl.addEventListener("focusout",this.onMenuFocusOut),this._dom.document().addEventListener("keydown",this.onDocumentKeyDown)}onToggleClick(e){e.preventDefault(),e.stopImmediatePropagation(),this._toggleEl.classList.contains("lh-active")?this.close():this.open(this._getNextMenuItem())}onToggleKeydown(e){switch(e.code){case"ArrowUp":e.preventDefault(),this.open(this._getPreviousMenuItem());break;case"ArrowDown":case"Enter":case" ":e.preventDefault(),this.open(this._getNextMenuItem());break;default:}}onMenuKeydown(e){let n=e.target;switch(e.code){case"ArrowUp":e.preventDefault(),this._getPreviousMenuItem(n).focus();break;case"ArrowDown":e.preventDefault(),this._getNextMenuItem(n).focus();break;case"Home":e.preventDefault(),this._getNextMenuItem().focus();break;case"End":e.preventDefault(),this._getPreviousMenuItem().focus();break;default:}}onDocumentKeyDown(e){e.keyCode===27&&this.close()}onMenuFocusOut(e){let n=e.relatedTarget;this._menuEl.contains(n)||this.close()}_getNextSelectableNode(e,n){let a=e.filter(o=>o instanceof HTMLElement).filter(o=>!(o.hasAttribute("disabled")||window.getComputedStyle(o).display==="none")),i=n?a.indexOf(n)+1:0;return i>=a.length&&(i=0),a[i]}_getNextMenuItem(e){let n=Array.from(this._menuEl.childNodes);return this._getNextSelectableNode(n,e)}_getPreviousMenuItem(e){let n=Array.from(this._menuEl.childNodes).reverse();return this._getNextSelectableNode(n,e)}};var gt=class{constructor(e,n){this.lhr,this._reportUIFeatures=e,this._dom=n,this._dropDownMenu=new ht(this._dom),this._copyAttempt=!1,this.topbarEl,this.categoriesEl,this.stickyHeaderEl,this.highlightEl,this.onDropDownMenuClick=this.onDropDownMenuClick.bind(this),this.onKeyUp=this.onKeyUp.bind(this),this.onCopy=this.onCopy.bind(this),this.collapseAllDetails=this.collapseAllDetails.bind(this)}enable(e){this.lhr=e,this._dom.rootEl.addEventListener("keyup",this.onKeyUp),this._dom.document().addEventListener("copy",this.onCopy),this._dropDownMenu.setup(this.onDropDownMenuClick),this._setUpCollapseDetailsAfterPrinting(),this._dom.find(".lh-topbar__logo",this._dom.rootEl).addEventListener("click",()=>Ce(this._dom)),this._setupStickyHeader()}onDropDownMenuClick(e){e.preventDefault();let n=e.target;if(!(!n||!n.hasAttribute("data-action"))){switch(n.getAttribute("data-action")){case"copy":this.onCopyButtonClick();break;case"print-summary":this.collapseAllDetails(),this._print();break;case"print-expanded":this.expandAllDetails(),this._print();break;case"save-json":{let a=JSON.stringify(this.lhr,null,2);this._reportUIFeatures._saveFile(new Blob([a],{type:"application/json"}));break}case"save-html":{let a=this._reportUIFeatures.getReportHtml();try{this._reportUIFeatures._saveFile(new Blob([a],{type:"text/html"}))}catch(i){this._dom.fireEventOn("lh-log",this._dom.document(),{cmd:"error",msg:"Could not export as HTML. "+i.message})}break}case"open-viewer":{this._dom.isDevTools()?Ua(this.lhr):Ia(this.lhr);break}case"save-gist":{this._reportUIFeatures.saveAsGist();break}case"toggle-dark":{Ce(this._dom);break}case"view-unthrottled-trace":this._reportUIFeatures._opts.onViewTrace?.()}this._dropDownMenu.close()}}onCopy(e){this._copyAttempt&&e.clipboardData&&(e.preventDefault(),e.clipboardData.setData("text/plain",JSON.stringify(this.lhr,null,2)),this._dom.fireEventOn("lh-log",this._dom.document(),{cmd:"log",msg:"Report JSON copied to clipboard"})),this._copyAttempt=!1}onCopyButtonClick(){this._dom.fireEventOn("lh-analytics",this._dom.document(),{name:"copy"});try{this._dom.document().queryCommandSupported("copy")&&(this._copyAttempt=!0,this._dom.document().execCommand("copy")||(this._copyAttempt=!1,this._dom.fireEventOn("lh-log",this._dom.document(),{cmd:"warn",msg:"Your browser does not support copy to clipboard."})))}catch(e){this._copyAttempt=!1,this._dom.fireEventOn("lh-log",this._dom.document(),{cmd:"log",msg:e.message})}}onKeyUp(e){(e.ctrlKey||e.metaKey)&&e.keyCode===80&&this._dropDownMenu.close()}expandAllDetails(){this._dom.findAll(".lh-categories details",this._dom.rootEl).map(n=>n.open=!0)}collapseAllDetails(){this._dom.findAll(".lh-categories details",this._dom.rootEl).map(n=>n.open=!1)}_print(){this._reportUIFeatures._opts.onPrintOverride?this._reportUIFeatures._opts.onPrintOverride(this._dom.rootEl):self.print()}resetUIState(){this._dropDownMenu.close()}_getScrollParent(e){let{overflowY:n}=window.getComputedStyle(e);return n!=="visible"&&n!=="hidden"?e:e.parentElement?this._getScrollParent(e.parentElement):document}_setUpCollapseDetailsAfterPrinting(){"onbeforeprint"in self?self.addEventListener("afterprint",this.collapseAllDetails):self.matchMedia("print").addListener(n=>{n.matches?this.expandAllDetails():this.collapseAllDetails()})}_setupStickyHeader(){this.topbarEl=this._dom.find("div.lh-topbar",this._dom.rootEl),this.categoriesEl=this._dom.find("div.lh-categories",this._dom.rootEl),window.requestAnimationFrame(()=>window.requestAnimationFrame(()=>{try{this.stickyHeaderEl=this._dom.find("div.lh-sticky-header",this._dom.rootEl)}catch{return}this.highlightEl=this._dom.createChildOf(this.stickyHeaderEl,"div","lh-highlighter");let e=this._getScrollParent(this._dom.find(".lh-container",this._dom.rootEl));e.addEventListener("scroll",()=>this._updateStickyHeader());let n=e instanceof window.Document?document.documentElement:e;new window.ResizeObserver(()=>this._updateStickyHeader()).observe(n)}))}_updateStickyHeader(){if(!this.stickyHeaderEl)return;let e=this.topbarEl.getBoundingClientRect().bottom,n=this.categoriesEl.getBoundingClientRect().top,a=e>=n,o=Array.from(this._dom.rootEl.querySelectorAll(".lh-category")).filter(d=>d.getBoundingClientRect().top-window.innerHeight/2<0),r=o.length>0?o.length-1:0,s=this.stickyHeaderEl.querySelectorAll(".lh-gauge__wrapper, .lh-fraction__wrapper"),p=s[r],c=s[0].getBoundingClientRect().left,l=p.getBoundingClientRect().left-c;this.highlightEl.style.transform=`translate(${l}px)`,this.stickyHeaderEl.classList.toggle("lh-sticky-header--visible",a)}};function Na(t,e){let n=e?new Date(e):new Date,a=n.toLocaleTimeString("en-US",{hour12:!1}),i=n.toLocaleDateString("en-US",{year:"numeric",month:"2-digit",day:"2-digit"}).split("/");i.unshift(i.pop());let o=i.join("-");return`${t}_${o}_${a}`.replace(/[/?<>\\:*|"]/g,"-")}function Da(t){let e=new URL(t.finalDisplayedUrl).hostname;return Na(e,t.fetchTime)}function za(t){let e=t.steps[0].lhr,n=t.name.replace(/\s/g,"-");return Na(n,e.fetchTime)}function Oo(t){return Array.from(t.tBodies[0].rows)}var ft=class{constructor(e,n={}){this.json,this._dom=e,this._opts=n,this._topbar=n.omitTopbar?null:new gt(this,e),this.onMediaQueryChange=this.onMediaQueryChange.bind(this)}initFeatures(e){this.json=e,this._fullPageScreenshot=U.getFullPageScreenshot(e),this._topbar&&(this._topbar.enable(e),this._topbar.resetUIState()),this._setupMediaQueryListeners(),this._setupThirdPartyFilter(),this._setupElementScreenshotOverlay(this._dom.rootEl);let n=this._dom.isDevTools()||this._opts.disableDarkMode||this._opts.disableAutoDarkModeAndFireworks;!n&&window.matchMedia("(prefers-color-scheme: dark)").matches&&Ce(this._dom,!0);let i=["performance","accessibility","best-practices","seo"].every(p=>{let c=e.categories[p];return c&&c.score===1}),o=this._opts.disableFireworks||this._opts.disableAutoDarkModeAndFireworks;if(i&&!o&&(this._enableFireworks(),n||Ce(this._dom,!0)),e.categories.performance&&e.categories.performance.auditRefs.some(p=>!!(p.group==="metrics"&&e.audits[p.id].errorMessage))){let p=this._dom.find("input.lh-metrics-toggle__input",this._dom.rootEl);p.checked=!0}this.json.audits["script-treemap-data"]&&this.json.audits["script-treemap-data"].details&&this.addButton({text:b.strings.viewTreemapLabel,icon:"treemap",onClick:()=>Ra(this.json)}),this._opts.onViewTrace&&(e.configSettings.throttlingMethod==="simulate"?this._dom.find('a[data-action="view-unthrottled-trace"]',this._dom.rootEl).classList.remove("lh-hidden"):this.addButton({text:b.strings.viewTraceLabel,onClick:()=>this._opts.onViewTrace?.()})),this._opts.getStandaloneReportHTML&&this._dom.find('a[data-action="save-html"]',this._dom.rootEl).classList.remove("lh-hidden");for(let p of this._dom.findAll("[data-i18n]",this._dom.rootEl)){let l=p.getAttribute("data-i18n");p.textContent=b.strings[l]}}addButton(e){let n=this._dom.rootEl.querySelector(".lh-audit-group--metrics");if(!n)return;let a=n.querySelector(".lh-buttons");a||(a=this._dom.createChildOf(n,"div","lh-buttons"));let i=["lh-button"];e.icon&&(i.push("lh-report-icon"),i.push(`lh-report-icon--${e.icon}`));let o=this._dom.createChildOf(a,"button",i.join(" "));return o.textContent=e.text,o.addEventListener("click",e.onClick),o}resetUIState(){this._topbar&&this._topbar.resetUIState()}getReportHtml(){if(!this._opts.getStandaloneReportHTML)throw new Error("`getStandaloneReportHTML` is not set");return this.resetUIState(),this._opts.getStandaloneReportHTML()}saveAsGist(){throw new Error("Cannot save as gist from base report")}_enableFireworks(){this._dom.find(".lh-scores-container",this._dom.rootEl).classList.add("lh-score100")}_setupMediaQueryListeners(){let e=self.matchMedia("(max-width: 500px)");e.addListener(this.onMediaQueryChange),this.onMediaQueryChange(e)}_resetUIState(){this._topbar&&this._topbar.resetUIState()}onMediaQueryChange(e){this._dom.rootEl.classList.toggle("lh-narrow",e.matches)}_setupThirdPartyFilter(){let e=["uses-rel-preconnect","third-party-facades"],n=["legacy-javascript"];Array.from(this._dom.rootEl.querySelectorAll("table.lh-table")).filter(o=>o.querySelector("td.lh-table-column--url, td.lh-table-column--source-location")).filter(o=>{let r=o.closest(".lh-audit");if(!r)throw new Error(".lh-table not within audit");return!e.includes(r.id)}).forEach(o=>{let r=Oo(o),s=r.filter(g=>!g.classList.contains("lh-sub-item-row")),p=this._getThirdPartyRows(s,U.getFinalDisplayedUrl(this.json)),c=r.some(g=>g.classList.contains("lh-row--even")),l=this._dom.createComponent("3pFilter"),d=this._dom.find("input",l);d.addEventListener("change",g=>{let _=g.target instanceof HTMLInputElement&&!g.target.checked,v=!0,y=s[0];for(;y;){let w=_&&p.includes(y);do y.classList.toggle("lh-row--hidden",w),c&&(y.classList.toggle("lh-row--even",!w&&v),y.classList.toggle("lh-row--odd",!w&&!v)),y=y.nextElementSibling;while(y&&y.classList.contains("lh-sub-item-row"));w||(v=!v)}});let m=p.filter(g=>!g.classList.contains("lh-row--group")).length;this._dom.find(".lh-3p-filter-count",l).textContent=`${m}`,this._dom.find(".lh-3p-ui-string",l).textContent=b.strings.thirdPartyResourcesLabel;let h=p.length===s.length,f=!p.length;if((h||f)&&(this._dom.find("div.lh-3p-filter",l).hidden=!0),!o.parentNode)return;o.parentNode.insertBefore(l,o);let C=o.closest(".lh-audit");if(!C)throw new Error(".lh-table not within audit");n.includes(C.id)&&!h&&d.click()})}_setupElementScreenshotOverlay(e){this._fullPageScreenshot&&le.installOverlayFeature({dom:this._dom,rootEl:e,overlayContainerEl:e,fullPageScreenshot:this._fullPageScreenshot})}_getThirdPartyRows(e,n){let a=U.getEntityFromUrl(n,this.json.entities),i=this.json.entities?.find(r=>r.isFirstParty===!0)?.name,o=[];for(let r of e){if(i){if(!r.dataset.entity||r.dataset.entity===i)continue}else{let s=r.querySelector("div.lh-text__url");if(!s)continue;let p=s.dataset.url;if(!p||!(U.getEntityFromUrl(p,this.json.entities)!==a))continue}o.push(r)}return o}_saveFile(e){let n=e.type.match("json")?".json":".html",a=Da({finalDisplayedUrl:U.getFinalDisplayedUrl(this.json),fetchTime:this.json.fetchTime})+n;this._opts.onSaveFileOverride?this._opts.onSaveFileOverride(e,a):this._dom.saveFile(e,a)}};function ja(t,e={}){let n=document.createElement("article");n.classList.add("lh-root","lh-vars");let a=new re(n.ownerDocument,n);return new dt(a).renderReport(t,n,e),new ft(a,e).initFeatures(t),n}function Ma(t,e){let n=new re(document,document.documentElement),a=new _e(n);return new se(n,a).renderCategoryScore(t,{},e)}function Ha(t,e){new re(document,document.documentElement).saveFile(t,e)}function Fa(t){return new re(document,document.documentElement).convertMarkdownCodeSnippets(t)}function Oa(){return new re(document,document.documentElement).createComponent("styles")}var Ba=({category:t,href:e,gatherMode:n})=>{let a=ie(()=>Ma(t,{gatherMode:n,omitLabel:!0,onPageAnchorRendered:i=>i.href=e}),[t,e]);return u("div",{ref:a,"data-testid":"CategoryScore"})};var Ga=({text:t})=>{let e=ie(()=>Fa(t),[t]);return u("span",{ref:e})};var Bo=2;function Go(t,e){switch(t){case"navigation":return e.navigationReport;case"timespan":return e.timespanReport;case"snapshot":return e.snapshotReport}}function Vo(t,e){switch(t){case"pass":return e.ratingPass;case"average":return e.ratingAverage;case"fail":return e.ratingFail;case"error":return e.ratingError}}function Va(t){return t.weight*(1-t.result.score)}var $o=({audit:t})=>{let e=A.calculateRating(t.result.score,t.result.scoreDisplayMode);return u("div",{className:`SummaryTooltipAudit SummaryTooltipAudit--${e}`,children:u(Ga,{text:t.result.title})})},qo=({category:t})=>{let e=D();function n(i){return i.result.score!==null&&i.group!=="metrics"&&i.group!=="hidden"&&(i.weight>0||i.group==="diagnostics")&&!A.showAsPassed(i.result)}let a=t.auditRefs.filter(n).sort((i,o)=>{let r=Va(i),s=Va(o);if(r!==s)return s-r;if(i.result.score!==o.result.score)return i.result.score-o.result.score;let p=i.result.metricSavings?.LCP||0;return(o.result.metricSavings?.LCP||0)-p}).splice(0,Bo);return a.length?u("div",{className:"SummaryTooltipAudits",children:[u("div",{className:"SummaryTooltipAudits__title",children:e.highestImpact}),a.map(i=>u($o,{audit:i},i.id))]}):null},Wo=({category:t,gatherMode:e,url:n})=>{let a=D(),i=ct(),{numPassed:o,numPassableAudits:r,numInformative:s,totalWeight:p}=A.calculateCategoryFraction(t),c=Ne(),l=A.shouldDisplayAsFraction(e),d=l?o/r:t.score,m=d===null?"error":A.calculateRating(d);return u("div",{className:"SummaryTooltip",children:[u("div",{className:"SummaryTooltip__title",children:Go(e,a)}),u("div",{className:"SummaryTooltip__url",children:n}),u($,{}),u("div",{className:"SummaryTooltip__category",children:[u("div",{className:"SummaryTooltip__category-title",children:t.title}),p!==0&&u("div",{className:`SummaryTooltip__rating SummaryTooltip__rating--${m}`,children:[u("span",{children:Vo(m,a)}),!l&&t.score!==null&&u(N,{children:[u("span",{children:" · "}),u("span",{children:c.formatter.formatInteger(t.score*100)})]})]})]}),u("div",{className:"SummaryTooltip__fraction",children:[u("span",{children:i(a.passedAuditCount,{numPassed:o})}),u("span",{children:" / "}),u("span",{children:i(a.passableAuditCount,{numPassableAudits:r})})]}),s!==0&&u("div",{className:"SummaryTooltip__informative",children:i(a.informativeAuditCount,{numInformative:s})}),u(qo,{category:t})]})},$a=({category:t,href:e,gatherMode:n,finalDisplayedUrl:a})=>u("div",{className:"SummaryCategory",children:t?u("div",{className:"SummaryCategory__content",children:[u(Ba,{category:t,href:e,gatherMode:n}),u(Wo,{category:t,gatherMode:n,url:a})]}):u("div",{className:"SummaryCategory__null","data-testid":"SummaryCategory__null"})});var Jo=["performance","accessibility","best-practices","seo"],Zo=40,Ko=({lhr:t})=>{let e=D();return u("div",{className:"SummaryNavigationHeader","data-testid":"SummaryNavigationHeader",children:[u(oe,{}),u("div",{className:"SummaryNavigationHeader__url",children:u("a",{rel:"noopener",target:"_blank",href:t.finalDisplayedUrl,children:t.finalDisplayedUrl})}),u("div",{className:"SummaryNavigationHeader__category",children:e.categoryPerformance}),u("div",{className:"SummaryNavigationHeader__category",children:e.categoryAccessibility}),u("div",{className:"SummaryNavigationHeader__category",children:e.categoryBestPractices}),u("div",{className:"SummaryNavigationHeader__category",children:e.categorySeo})]})},Xo=({lhr:t,label:e,hashIndex:n})=>{let a=Q(()=>A.prepareReportResult(t),[t]),i=D(),o=Ye(t.gatherMode,i);return u("div",{className:"SummaryFlowStep",children:[t.gatherMode==="navigation"||n===0?u(Ko,{lhr:t}):u("div",{className:"SummaryFlowStep__separator",children:[u(oe,{}),u($,{})]}),u(Qe,{lhr:t,width:Zo}),u(oe,{mode:t.gatherMode}),u("div",{className:"SummaryFlowStep__label",children:[u("div",{className:"SummaryFlowStep__mode",children:o}),u("a",{className:"SummaryFlowStep__link",href:`#index=${n}`,children:e})]}),Jo.map(r=>u($a,{category:a.categories[r],href:`#index=${n}&anchor=${r}`,gatherMode:t.gatherMode,finalDisplayedUrl:t.finalDisplayedUrl},r))]})},Yo=()=>{let t=B();return u("div",{className:"SummaryFlow",children:t.steps.map((e,n)=>u(Xo,{lhr:e.lhr,label:e.name,hashIndex:n},e.lhr.fetchTime))})},Qo=()=>{let t=B(),e=D(),n=ct(),a=0,i=0,o=0;for(let p of t.steps)switch(p.lhr.gatherMode){case"navigation":a++;break;case"timespan":i++;break;case"snapshot":o++;break}let r=[];a&&r.push(n(e.navigationReportCount,{numNavigation:a})),i&&r.push(n(e.timespanReportCount,{numTimespan:i})),o&&r.push(n(e.snapshotReportCount,{numSnapshot:o}));let s=r.join(" · ");return u("div",{className:"SummaryHeader",children:[u("div",{className:"SummaryHeader__title",children:e.summary}),u("div",{className:"SummaryHeader__subtitle",children:s})]})},er=({children:t})=>u("div",{className:"SummarySectionHeader",children:[u("div",{className:"SummarySectionHeader__content",children:t}),u($,{})]}),qa=()=>{let t=D();return u("div",{className:"Summary","data-testid":"Summary",children:[u(Qo,{}),u($,{}),u(er,{children:t.allReports}),u(Yo,{})]})};function tr(t,e){let n=t.cloneNode(!0);if(!n.hash)return n;let a=t.hash.substr(1);n.hash=`#index=${e}&anchor=${a}`,n.onclick=i=>{i.preventDefault();let o=document.getElementById(a);o&&o.scrollIntoView()},t.replaceWith(n)}var Wa=({hashState:t})=>{let e=ie(()=>ja(t.currentLhr,{disableFireworks:!0,disableDarkMode:!0,omitTopbar:!0,omitGlobalStyles:!0,onPageAnchorRendered:n=>tr(n,t.index)}),[t]);return u("div",{ref:e,"data-testid":"Report"})};var $t=t=>{let e=D();return u("div",{className:"HelpDialogColumn",children:[u("div",{className:"HelpDialogColumn__legend",children:[u("div",{className:"HelpDialogColumnTimeline",children:[t.icon,u("div",{className:"HelpDialogColumnTimeline__line"})]}),u("div",{className:"HelpDialogColumn__legend-label",children:t.userFriendlyModeLabel})]}),u("div",{className:"HelpDialogColumn__header",children:[u("div",{className:"HelpDialogColumn__header-title",children:t.lighthouseOfficialModeLabel}),u("p",{children:t.modeDescription})]}),u("div",{className:"HelpDialogColumn__use-cases",children:[u("p",{children:t.useCaseInstruction}),u("ul",{children:t.useCases.map((n,a)=>u("li",{children:n},a))})]}),u("div",{className:"HelpDialogColumn__categories",children:[u("p",{children:e.categories}),u("ul",{children:t.availableCategories.map((n,a)=>u("li",{children:n},a))})]})]})},Ja=({onClose:t})=>{let e=D();return u("div",{className:"HelpDialog",children:[u("div",{className:"HelpDialog__title",children:[u("div",{children:e.helpDialogTitle}),u("div",{style:{flexGrow:1}}),u("button",{className:"HelpDialog__close",onClick:t,children:u(Rn,{})})]}),u("div",{className:"HelpDialog__columns",children:[u($t,{icon:u(Ze,{}),userFriendlyModeLabel:e.navigationDescription,lighthouseOfficialModeLabel:e.navigationReport,modeDescription:e.navigationLongDescription,useCaseInstruction:e.helpUseCaseInstructionNavigation,useCases:[e.helpUseCaseNavigation1,e.helpUseCaseNavigation2,e.helpUseCaseNavigation3],availableCategories:[e.categoryPerformance,e.categoryAccessibility,e.categoryBestPractices,e.categorySeo]}),u($t,{icon:u(Ke,{}),userFriendlyModeLabel:e.timespanDescription,lighthouseOfficialModeLabel:e.timespanReport,modeDescription:e.timespanLongDescription,useCaseInstruction:e.helpUseCaseInstructionTimespan,useCases:[e.helpUseCaseTimespan1,e.helpUseCaseTimespan2],availableCategories:[e.categoryPerformance,e.categoryBestPractices]}),u($t,{icon:u(Xe,{}),userFriendlyModeLabel:e.snapshotDescription,lighthouseOfficialModeLabel:e.snapshotReport,modeDescription:e.snapshotLongDescription,useCaseInstruction:e.helpUseCaseInstructionSnapshot,useCases:[e.helpUseCaseSnapshot1,e.helpUseCaseSnapshot2],availableCategories:[e.categoryPerformance,e.categoryAccessibility,e.categoryBestPractices,e.categorySeo]})]})]})};function qt(t,e){let n=new Blob([e],{type:"text/html"}),a=za(t)+".html";qt.saveFile(n,a)}qt.saveFile=Ha;var nr=()=>u("svg",{role:"img",class:"lh-topbar__logo",title:"Lighthouse logo",width:"24",height:"24",fill:"none",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 48 48",children:[u("path",{d:"m14 7 10-7 10 7v10h5v7h-5l5 24H9l5-24H9v-7h5V7Z",fill:"#F63"}),u("path",{d:"M31.561 24H14l-1.689 8.105L31.561 24ZM18.983 48H9l1.022-4.907L35.723 32.27l1.663 7.98L18.983 48Z",fill:"#FFA385"}),u("path",{fill:"#FF3",d:"M20.5 10h7v7h-7z"})]}),vt=({onClick:t,label:e,children:n})=>u("button",{className:"TopbarButton",onClick:t,"aria-label":e,children:n}),Za=({onMenuClick:t})=>{let e=B(),n=D(),[a,i]=ae(!1),{getReportHtml:o,saveAsGist:r}=Bn();return u("div",{className:"Topbar",children:[u(vt,{onClick:t,label:"Button that opens and closes the sidebar",children:u(jn,{})}),u("div",{className:"Topbar__logo",children:u(nr,{})}),u("div",{className:"Topbar__title",children:n.title}),o&&u(vt,{onClick:()=>{let s=o(e);qt(e,s)},label:"Button that saves the report as HTML",children:n.save}),r&&u(vt,{onClick:()=>r(e),label:"Button that saves the report to a gist",children:n.dropdownSaveGist}),u("div",{style:{flexGrow:1}}),u(vt,{onClick:()=>i(s=>!s),label:"Button that toggles the help dialog",children:u("div",{className:"Topbar__help-label",children:[u(Mn,{}),n.helpLabel]})}),a?u(Ja,{onClose:()=>i(!1)}):null]})};var ar=80,ir=120,Wt=({lhr:t,position:e})=>{let n=e==="main"?ir:ar;return u("div",{className:`HeaderThumbnail HeaderThumbnail--${e}`,children:[u(Qe,{lhr:t,height:n}),u("div",{className:"HeaderThumbnail__icon",children:u(kt,{mode:t.gatherMode})})]})},Ka=({hashState:t})=>{let e=B(),{index:n}=t,a=e.steps[n],i=e.steps[n-1],o=e.steps[n+1],r=D(),s=Ye(a.lhr.gatherMode,r);return u("div",{className:"Header",children:[i&&u(N,{children:[e.steps[n-2]&&u("div",{className:"Header__segment"}),u("div",{className:"Header__prev-thumbnail",children:[u(Wt,{lhr:i.lhr,position:"prev"}),u("div",{className:"Header__segment"})]}),u("a",{className:"Header__prev-title",href:`#index=${n-1}`,children:i.name})]}),u("div",{className:"Header__current-thumbnail",children:u(Wt,{lhr:a.lhr,position:"main"})}),u("div",{className:"Header__current-title",children:[a.name,u("div",{className:"Header__current-description",children:s})]}),o&&u(N,{children:[u("div",{className:"Header__next-thumbnail",children:[u("div",{className:"Header__segment"}),u(Wt,{lhr:o.lhr,position:"next"})]}),u("a",{className:"Header__next-title",href:`#index=${n+1}`,children:o.name}),e.steps[n+2]&&u("div",{className:"Header__segment"})]})]})};var Xa=()=>{let t=ie(Oa);return u("div",{ref:t})};function or(t){return!t||!t.anchor?null:document.getElementById(t.anchor)}var rr=()=>{let t=be(),e=We(null);return qe(()=>{let n=or(t);n?n.scrollIntoView():e.current&&(e.current.scrollTop=0)},[t]),u("div",{ref:e,className:"Content",children:t?u(N,{children:[u(Ka,{hashState:t}),u(Wa,{hashState:t})]}):u(qa,{})})},Ya=({flowResult:t,options:e})=>{let[n,a]=ae(!1),i=Q(()=>e||{},[e]);return u(St.Provider,{value:i,children:u(xt.Provider,{value:t,children:u(Ca,{children:[u(Xa,{}),u("div",{className:ve("App",{"App--collapsed":n}),"data-testid":"App",children:[u(Za,{onMenuClick:()=>a(o=>!o)}),u(xa,{}),u(rr,{})]})]})})})};function Qa(t,e,n){e.classList.add("flow-vars","lh-vars","lh-root"),vn(yt(Ya,{flowResult:t,options:n}),e)}function sr(){let t=document.body.querySelector("main");if(!t)throw Error("Container element not found");Qa(window.__LIGHTHOUSE_FLOW_JSON__,t,{getReportHtml:()=>document.documentElement.outerHTML})}window.__initLighthouseFlowReport__=sr;window.__initLighthouseFlowReport__();})();
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @license Copyright 2023 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 *
 * Dummy text for ensuring report robustness: <\/script> pre$`post %%LIGHTHOUSE_JSON%%
 * (this is handled by terser)
 */
