(()=>{"use strict";var e={913:()=>{try{self["workbox:core:6.1.2"]&&_()}catch(e){}},977:()=>{try{self["workbox:precaching:6.1.2"]&&_()}catch(e){}},80:()=>{try{self["workbox:routing:6.1.2"]&&_()}catch(e){}},873:()=>{try{self["workbox:strategies:6.1.2"]&&_()}catch(e){}}},t={};function s(a){var r=t[a];if(void 0!==r)return r.exports;var n=t[a]={exports:{}};return e[a](n,n.exports,s),n.exports}(()=>{s(913);class e extends Error{constructor(e,t){super(((e,...t)=>{let s=e;return t.length>0&&(s+=` :: ${JSON.stringify(t)}`),s})(e,t)),this.name=e,this.details=t}}const t={googleAnalytics:"googleAnalytics",precache:"precache-v2",prefix:"workbox",runtime:"runtime",suffix:"undefined"!=typeof registration?registration.scope:""},a=e=>[t.prefix,e,t.suffix].filter((e=>e&&e.length>0)).join("-"),r=e=>e||a(t.precache);function n(e,t){const s=t();return e.waitUntil(s),s}function i(t){if(!t)throw new e("add-to-cache-list-unexpected-type",{entry:t});if("string"==typeof t){const e=new URL(t,location.href);return{cacheKey:e.href,url:e.href}}const{revision:s,url:a}=t;if(!a)throw new e("add-to-cache-list-unexpected-type",{entry:t});if(!s){const e=new URL(a,location.href);return{cacheKey:e.href,url:e.href}}const r=new URL(a,location.href),n=new URL(a,location.href);return r.searchParams.set("__WB_REVISION__",s),{cacheKey:r.href,url:n.href}}s(977);class c{constructor(){this.updatedURLs=[],this.notUpdatedURLs=[],this.handlerWillStart=async({request:e,state:t})=>{t&&(t.originalRequest=e)},this.cachedResponseWillBeUsed=async({event:e,state:t,cachedResponse:s})=>{if("install"===e.type){const e=t.originalRequest.url;s?this.notUpdatedURLs.push(e):this.updatedURLs.push(e)}return s}}}class o{constructor({precacheController:e}){this.cacheKeyWillBeUsed=async({request:e,params:t})=>{const s=t&&t.cacheKey||this._precacheController.getCacheKeyForURL(e.url);return s?new Request(s):e},this._precacheController=e}}let h;function l(e,t){const s=new URL(e);for(const e of t)s.searchParams.delete(e);return s.href}class u{constructor(){this.promise=new Promise(((e,t)=>{this.resolve=e,this.reject=t}))}}const d=new Set;function f(e){return"string"==typeof e?new Request(e):e}s(873);class p{constructor(e,t){this._cacheKeys={},Object.assign(this,t),this.event=t.event,this._strategy=e,this._handlerDeferred=new u,this._extendLifetimePromises=[],this._plugins=[...e.plugins],this._pluginStateMap=new Map;for(const e of this._plugins)this._pluginStateMap.set(e,{});this.event.waitUntil(this._handlerDeferred.promise)}async fetch(t){const{event:s}=this;let a=f(t);if("navigate"===a.mode&&s instanceof FetchEvent&&s.preloadResponse){const e=await s.preloadResponse;if(e)return e}const r=this.hasCallback("fetchDidFail")?a.clone():null;try{for(const e of this.iterateCallbacks("requestWillFetch"))a=await e({request:a.clone(),event:s})}catch(t){throw new e("plugin-error-request-will-fetch",{thrownError:t})}const n=a.clone();try{let e;e=await fetch(a,"navigate"===a.mode?void 0:this._strategy.fetchOptions);for(const t of this.iterateCallbacks("fetchDidSucceed"))e=await t({event:s,request:n,response:e});return e}catch(e){throw r&&await this.runCallbacks("fetchDidFail",{error:e,event:s,originalRequest:r.clone(),request:n.clone()}),e}}async fetchAndCachePut(e){const t=await this.fetch(e),s=t.clone();return this.waitUntil(this.cachePut(e,s)),t}async cacheMatch(e){const t=f(e);let s;const{cacheName:a,matchOptions:r}=this._strategy,n=await this.getCacheKey(t,"read"),i={...r,cacheName:a};s=await caches.match(n,i);for(const e of this.iterateCallbacks("cachedResponseWillBeUsed"))s=await e({cacheName:a,matchOptions:r,cachedResponse:s,request:n,event:this.event})||void 0;return s}async cachePut(t,s){const a=f(t);await(0,new Promise((e=>setTimeout(e,0))));const r=await this.getCacheKey(a,"write");if(!s)throw new e("cache-put-with-no-response",{url:(n=r.url,new URL(String(n),location.href).href.replace(new RegExp(`^${location.origin}`),""))});var n;const i=await this._ensureResponseSafeToCache(s);if(!i)return!1;const{cacheName:c,matchOptions:o}=this._strategy,h=await self.caches.open(c),u=this.hasCallback("cacheDidUpdate"),p=u?await async function(e,t,s,a){const r=l(t.url,s);if(t.url===r)return e.match(t,a);const n={...a,ignoreSearch:!0},i=await e.keys(t,n);for(const t of i)if(r===l(t.url,s))return e.match(t,a)}(h,r.clone(),["__WB_REVISION__"],o):null;try{await h.put(r,u?i.clone():i)}catch(e){throw"QuotaExceededError"===e.name&&await async function(){for(const e of d)await e()}(),e}for(const e of this.iterateCallbacks("cacheDidUpdate"))await e({cacheName:c,oldResponse:p,newResponse:i.clone(),request:r,event:this.event});return!0}async getCacheKey(e,t){if(!this._cacheKeys[t]){let s=e;for(const e of this.iterateCallbacks("cacheKeyWillBeUsed"))s=f(await e({mode:t,request:s,event:this.event,params:this.params}));this._cacheKeys[t]=s}return this._cacheKeys[t]}hasCallback(e){for(const t of this._strategy.plugins)if(e in t)return!0;return!1}async runCallbacks(e,t){for(const s of this.iterateCallbacks(e))await s(t)}*iterateCallbacks(e){for(const t of this._strategy.plugins)if("function"==typeof t[e]){const s=this._pluginStateMap.get(t),a=a=>{const r={...a,state:s};return t[e](r)};yield a}}waitUntil(e){return this._extendLifetimePromises.push(e),e}async doneWaiting(){let e;for(;e=this._extendLifetimePromises.shift();)await e}destroy(){this._handlerDeferred.resolve()}async _ensureResponseSafeToCache(e){let t=e,s=!1;for(const e of this.iterateCallbacks("cacheWillUpdate"))if(t=await e({request:this.request,response:t,event:this.event})||void 0,s=!0,!t)break;return s||t&&200!==t.status&&(t=void 0),t}}class y extends class{constructor(e={}){this.cacheName=e.cacheName||a(t.runtime),this.plugins=e.plugins||[],this.fetchOptions=e.fetchOptions,this.matchOptions=e.matchOptions}handle(e){const[t]=this.handleAll(e);return t}handleAll(e){e instanceof FetchEvent&&(e={event:e,request:e.request});const t=e.event,s="string"==typeof e.request?new Request(e.request):e.request,a="params"in e?e.params:void 0,r=new p(this,{event:t,request:s,params:a}),n=this._getResponse(r,s,t);return[n,this._awaitComplete(n,r,s,t)]}async _getResponse(t,s,a){let r;await t.runCallbacks("handlerWillStart",{event:a,request:s});try{if(r=await this._handle(s,t),!r||"error"===r.type)throw new e("no-response",{url:s.url})}catch(e){for(const n of t.iterateCallbacks("handlerDidError"))if(r=await n({error:e,event:a,request:s}),r)break;if(!r)throw e}for(const e of t.iterateCallbacks("handlerWillRespond"))r=await e({event:a,request:s,response:r});return r}async _awaitComplete(e,t,s,a){let r,n;try{r=await e}catch(n){}try{await t.runCallbacks("handlerDidRespond",{event:a,request:s,response:r}),await t.doneWaiting()}catch(e){n=e}if(await t.runCallbacks("handlerDidComplete",{event:a,request:s,response:r,error:n}),t.destroy(),n)throw n}}{constructor(e={}){e.cacheName=r(e.cacheName),super(e),this._fallbackToNetwork=!1!==e.fallbackToNetwork,this.plugins.push(y.copyRedirectedCacheableResponsesPlugin)}async _handle(e,t){return await t.cacheMatch(e)||(t.event&&"install"===t.event.type?await this._handleInstall(e,t):await this._handleFetch(e,t))}async _handleFetch(t,s){let a;if(!this._fallbackToNetwork)throw new e("missing-precache-entry",{cacheName:this.cacheName,url:t.url});return a=await s.fetch(t),a}async _handleInstall(t,s){this._useDefaultCacheabilityPluginIfNeeded();const a=await s.fetch(t);if(!await s.cachePut(t,a.clone()))throw new e("bad-precaching-response",{url:t.url,status:a.status});return a}_useDefaultCacheabilityPluginIfNeeded(){let e=null,t=0;for(const[s,a]of this.plugins.entries())a!==y.copyRedirectedCacheableResponsesPlugin&&(a===y.defaultPrecacheCacheabilityPlugin&&(e=s),a.cacheWillUpdate&&t++);0===t?this.plugins.push(y.defaultPrecacheCacheabilityPlugin):t>1&&null!==e&&this.plugins.splice(e,1)}}y.defaultPrecacheCacheabilityPlugin={cacheWillUpdate:async({response:e})=>!e||e.status>=400?null:e},y.copyRedirectedCacheableResponsesPlugin={cacheWillUpdate:async({response:t})=>t.redirected?await async function(t,s){let a=null;if(t.url&&(a=new URL(t.url).origin),a!==self.location.origin)throw new e("cross-origin-copy-response",{origin:a});const r=t.clone(),n={headers:new Headers(r.headers),status:r.status,statusText:r.statusText},i=s?s(n):n,c=function(){if(void 0===h){const e=new Response("");if("body"in e)try{new Response(e.body),h=!0}catch(e){h=!1}h=!1}return h}()?r.body:await r.blob();return new Response(c,i)}(t):t};class w{constructor({cacheName:e,plugins:t=[],fallbackToNetwork:s=!0}={}){this._urlsToCacheKeys=new Map,this._urlsToCacheModes=new Map,this._cacheKeysToIntegrities=new Map,this._strategy=new y({cacheName:r(e),plugins:[...t,new o({precacheController:this})],fallbackToNetwork:s}),this.install=this.install.bind(this),this.activate=this.activate.bind(this)}get strategy(){return this._strategy}precache(e){this.addToCacheList(e),this._installAndActiveListenersAdded||(self.addEventListener("install",this.install),self.addEventListener("activate",this.activate),this._installAndActiveListenersAdded=!0)}addToCacheList(t){const s=[];for(const a of t){"string"==typeof a?s.push(a):a&&void 0===a.revision&&s.push(a.url);const{cacheKey:t,url:r}=i(a),n="string"!=typeof a&&a.revision?"reload":"default";if(this._urlsToCacheKeys.has(r)&&this._urlsToCacheKeys.get(r)!==t)throw new e("add-to-cache-list-conflicting-entries",{firstEntry:this._urlsToCacheKeys.get(r),secondEntry:t});if("string"!=typeof a&&a.integrity){if(this._cacheKeysToIntegrities.has(t)&&this._cacheKeysToIntegrities.get(t)!==a.integrity)throw new e("add-to-cache-list-conflicting-integrities",{url:r});this._cacheKeysToIntegrities.set(t,a.integrity)}if(this._urlsToCacheKeys.set(r,t),this._urlsToCacheModes.set(r,n),s.length>0){const e=`Workbox is precaching URLs without revision info: ${s.join(", ")}\nThis is generally NOT safe. Learn more at https://bit.ly/wb-precache`;console.warn(e)}}}install(e){return n(e,(async()=>{const t=new c;this.strategy.plugins.push(t);for(const[t,s]of this._urlsToCacheKeys){const a=this._cacheKeysToIntegrities.get(s),r=this._urlsToCacheModes.get(t),n=new Request(t,{integrity:a,cache:r,credentials:"same-origin"});await Promise.all(this.strategy.handleAll({params:{cacheKey:s},request:n,event:e}))}const{updatedURLs:s,notUpdatedURLs:a}=t;return{updatedURLs:s,notUpdatedURLs:a}}))}activate(e){return n(e,(async()=>{const e=await self.caches.open(this.strategy.cacheName),t=await e.keys(),s=new Set(this._urlsToCacheKeys.values()),a=[];for(const r of t)s.has(r.url)||(await e.delete(r),a.push(r.url));return{deletedURLs:a}}))}getURLsToCacheKeys(){return this._urlsToCacheKeys}getCachedURLs(){return[...this._urlsToCacheKeys.keys()]}getCacheKeyForURL(e){const t=new URL(e,location.href);return this._urlsToCacheKeys.get(t.href)}async matchPrecache(e){const t=e instanceof Request?e.url:e,s=this.getCacheKeyForURL(t);if(s)return(await self.caches.open(this.strategy.cacheName)).match(s)}createHandlerBoundToURL(t){const s=this.getCacheKeyForURL(t);if(!s)throw new e("non-precached-url",{url:t});return e=>(e.request=new Request(t),e.params={cacheKey:s,...e.params},this.strategy.handle(e))}}let g;const m=()=>(g||(g=new w),g);s(80);const _=e=>e&&"object"==typeof e?e:{handle:e};class R{constructor(e,t,s="GET"){this.handler=_(t),this.match=e,this.method=s}setCatchHandler(e){this.catchHandler=_(e)}}class v extends R{constructor(e,t,s){super((({url:t})=>{const s=e.exec(t.href);if(s&&(t.origin===location.origin||0===s.index))return s.slice(1)}),t,s)}}class C{constructor(){this._routes=new Map,this._defaultHandlerMap=new Map}get routes(){return this._routes}addFetchListener(){self.addEventListener("fetch",(e=>{const{request:t}=e,s=this.handleRequest({request:t,event:e});s&&e.respondWith(s)}))}addCacheListener(){self.addEventListener("message",(e=>{if(e.data&&"CACHE_URLS"===e.data.type){const{payload:t}=e.data,s=Promise.all(t.urlsToCache.map((t=>{"string"==typeof t&&(t=[t]);const s=new Request(...t);return this.handleRequest({request:s,event:e})})));e.waitUntil(s),e.ports&&e.ports[0]&&s.then((()=>e.ports[0].postMessage(!0)))}}))}handleRequest({request:e,event:t}){const s=new URL(e.url,location.href);if(!s.protocol.startsWith("http"))return;const a=s.origin===location.origin,{params:r,route:n}=this.findMatchingRoute({event:t,request:e,sameOrigin:a,url:s});let i=n&&n.handler;const c=e.method;if(!i&&this._defaultHandlerMap.has(c)&&(i=this._defaultHandlerMap.get(c)),!i)return;let o;try{o=i.handle({url:s,request:e,event:t,params:r})}catch(e){o=Promise.reject(e)}const h=n&&n.catchHandler;return o instanceof Promise&&(this._catchHandler||h)&&(o=o.catch((async a=>{if(h)try{return await h.handle({url:s,request:e,event:t,params:r})}catch(e){a=e}if(this._catchHandler)return this._catchHandler.handle({url:s,request:e,event:t});throw a}))),o}findMatchingRoute({url:e,sameOrigin:t,request:s,event:a}){const r=this._routes.get(s.method)||[];for(const n of r){let r;const i=n.match({url:e,sameOrigin:t,request:s,event:a});if(i)return r=i,(Array.isArray(i)&&0===i.length||i.constructor===Object&&0===Object.keys(i).length||"boolean"==typeof i)&&(r=void 0),{route:n,params:r}}return{}}setDefaultHandler(e,t="GET"){this._defaultHandlerMap.set(t,_(e))}setCatchHandler(e){this._catchHandler=_(e)}registerRoute(e){this._routes.has(e.method)||this._routes.set(e.method,[]),this._routes.get(e.method).push(e)}unregisterRoute(t){if(!this._routes.has(t.method))throw new e("unregister-route-but-not-found-with-method",{method:t.method});const s=this._routes.get(t.method).indexOf(t);if(!(s>-1))throw new e("unregister-route-route-not-registered");this._routes.get(t.method).splice(s,1)}}let b;class U extends R{constructor(e,t){super((({request:s})=>{const a=e.getURLsToCacheKeys();for(const e of function*(e,{ignoreURLParametersMatching:t=[/^utm_/,/^fbclid$/],directoryIndex:s="index.html",cleanURLs:a=!0,urlManipulation:r}={}){const n=new URL(e,location.href);n.hash="",yield n.href;const i=function(e,t=[]){for(const s of[...e.searchParams.keys()])t.some((e=>e.test(s)))&&e.searchParams.delete(s);return e}(n,t);if(yield i.href,s&&i.pathname.endsWith("/")){const e=new URL(i.href);e.pathname+=s,yield e.href}if(a){const e=new URL(i.href);e.pathname+=".html",yield e.href}if(r){const e=r({url:n});for(const t of e)yield t.href}}(s.url,t)){const t=a.get(e);if(t)return{cacheKey:t}}}),e.strategy)}}var L;L=[{'revision':'bd6437ca0347fe0e6e960ddd0dc97ce8','url':'assets/fontLoader.css'},{'revision':'402547fc0254109ae909895ef6794a0f','url':'assets/fonts/HussarMilosc.otf'},{'revision':'f08875198203069e203b5373d3d43dca','url':'assets/fonts/bubblegum/BubblegumSans-Regular.ttf'},{'revision':'2ebf4fd17ca13a6d77ffa9f3e37b6e33','url':'assets/fonts/headings/folks/Folks-Bold.ttf'},{'revision':'eafa6cbe1dd274d51d45ff27414dc68e','url':'assets/fonts/headings/folks/Folks-Heavy.ttf'},{'revision':'d045eeddeec048d7c45edf2a7ee9b0ae','url':'assets/fonts/headings/folks/Folks-Light.ttf'},{'revision':'eb372c0bf8f026a377e798bb3b335caa','url':'assets/fonts/headings/folks/Folks-Normal.ttf'},{'revision':'977d89734dc089b69f66ffc4068a2694','url':'assets/fonts/headings/folks/Manfred Klein License.txt'},{'revision':'54d4d678ba7094f29e56aa3d14166e5b','url':'assets/fonts/vertiky/info.txt'},{'revision':'153c710795d4b2fa069a629be57cdeb3','url':'assets/fonts/vertiky/vertiky.otf'},{'revision':'234d4dbb2afd450dc1b1b85eea952866','url':'assets/img/common/background0.png'},{'revision':'df74fbde473348cb97fc42168953e450','url':'assets/img/common/barra.png'},{'revision':'671d76bb56d6e10283e36a1c079182d6','url':'assets/img/common/boneco.png'},{'revision':'0d10f43bd5c4262199e47a5774adc13d','url':'assets/img/common/numeroBTBG.png'},{'revision':'342a226ef8bc836ad9ee4308335e98ac','url':'assets/img/common/refreshBT.png'},{'revision':'4f14f33c9007117f745864fadb095304','url':'assets/img/common/titulo1.png'},{'revision':'39c0923b28669f65c639fd9d8444541f','url':'assets/img/common/voltaratrasBT.png'},{'revision':'671d76bb56d6e10283e36a1c079182d6','url':'assets/img/main_menu/boneco.png'},{'revision':'947f7b2bc73fb103996142c4456457a8','url':'assets/img/main_menu/close.png'},{'revision':'937636825f419d2368c6292e5974bcb6','url':'assets/img/main_menu/closeBT.png'},{'revision':'0b4c2d1d0862a710491385869cbc605f','url':'assets/img/main_menu/creditosBT.png'},{'revision':'e8f4f8b8a46c2ad9a1d48093e856ae09','url':'assets/img/main_menu/creditosMC.png'},{'revision':'8962b7c01c0f64d11ac27d8c2ce39452','url':'assets/img/main_menu/dificilBT.png'},{'revision':'1fdef939eca34dc28b8020c66603570c','url':'assets/img/main_menu/exemploQuadro2.png'},{'revision':'ccf58721393b4414e3c44ee3528487ee','url':'assets/img/main_menu/facilBT.png'},{'revision':'4c7410ea0cc357ec9fdee6482715b054','url':'assets/img/main_menu/firstScreen.png'},{'revision':'3fa9a41e04b21ab672167a2cbe3f5e3c','url':'assets/img/main_menu/fullscreenBT-1.png'},{'revision':'6e360550a3d6a77fc320358b9c9295e7','url':'assets/img/main_menu/fullscreenBT-2.png'},{'revision':'1027ebe598a598d2d4d11670ee91fc94','url':'assets/img/main_menu/instrucoesBT.png'},{'revision':'d86e2a22d89d552d599c96670ee7f15e','url':'assets/img/main_menu/instrucoesMC.png'},{'revision':'d234032b50334d3ad7a48678b8d852c0','url':'assets/img/main_menu/login.png'},{'revision':'307f1dc351d3ca3e181ba952a43ddbb5','url':'assets/img/main_menu/loginBT.png'},{'revision':'631c07385abf4fb6777901910fa6a9d7','url':'assets/img/main_menu/medioBT.png'},{'revision':'0e6110664c996b6cc0745cf0f80c65bd','url':'assets/img/main_menu/modotabletBT.png'},{'revision':'0b5397f1779ed9c0d5ba41c41b711222','url':'assets/img/main_menu/sobreojogoBT.png'},{'revision':'a4886a248f5186954805c072cb2d85f1','url':'assets/img/main_menu/sobreojogoMC.png'},{'revision':'4f14f33c9007117f745864fadb095304','url':'assets/img/main_menu/titulo1.png'},{'revision':'bae12511c389f24bdfa19e89127b551a','url':'assets/img/main_menu/topBT.png'},{'revision':'3ce8237c0723d9762745d63fdd0c48d9','url':'assets/img/multiplayer_game/btt1.png'},{'revision':'ed551ab3b8b176aedc017588aeefe0a0','url':'assets/img/multiplayer_game/btt2.png'},{'revision':'17350650e31d4e8725484d305e104fc2','url':'assets/img/multiplayer_game/btt3.png'},{'revision':'60e7e40e4b1168dec67ad67c3bee18c5','url':'assets/img/multiplayer_game/btt4.png'},{'revision':'591523e824016f96729ad422d00b7ee7','url':'assets/img/multiplayer_game/modoTablet-exemplo-quadro-1.png'},{'revision':'a957be48ce255f7ef6082bbdbb7c8a11','url':'assets/img/multiplayer_game/modoTablet-exemplo-quadro-2.png'},{'revision':'4f6658fafbf76b46415567312b606257','url':'assets/img/multiplayer_game/modoTablet-exemplo-quadro-3.png'},{'revision':'18ffdbfb4a0131797a7aa94a25cbc20a','url':'assets/img/multiplayer_game/textoi.png'},{'revision':'2e7d02a6bbdfeab504b8dbc755ccb71f','url':'assets/img/multiplayer_game/textoi2.png'},{'revision':'420d824ab4ac3b48c38a5d60d87a480a','url':'assets/img/multiplayer_game/todosBT.png'},{'revision':'6b7d676b650d6f8bba69cd477cf1cf5e','url':'assets/img/solo_game/assinalaCertos.png'},{'revision':'95b60968792c05e39afcc560db5df699','url':'assets/img/solo_game/assinalaErrados.png'},{'revision':'024ed37cd28cb4d3d37773df5b496dc2','url':'assets/img/solo_game/cardBackground.png'},{'revision':'19c492e6cef0eabe9d66bf21f1701f08','url':'assets/img/solo_game/exemploQuadro1.png'},{'revision':'d2cab1e5fe50e0c42402414e7180e107','url':'assets/img/solo_game/finalDoJogo.png'},{'revision':'24d37ea74112dd21ee94f8a3925a3fcf','url':'assets/img/solo_game/opAdicao.png'},{'revision':'b82f29cc1771da587dbbbf38be2c6191','url':'assets/img/solo_game/opDivisao.png'},{'revision':'bb341b6fd4d00c81bb749ba3c8e6bc86','url':'assets/img/solo_game/opMultiplicacao.png'},{'revision':'582d7cd7acf098ea397e04cc7da55491','url':'assets/img/solo_game/opSubtracao.png'},{'revision':'eeedd7af73f486774cf20ae18aa140ee','url':'assets/img/solo_game/playCard.png'},{'revision':'8412a3b91121df340b4c967a411bac22','url':'assets/img/solo_game/relogio.png'},{'revision':'07f82c92779b551a56e268ac9ad99196','url':'assets/img/solo_game/relogioN.png'},{'revision':'d1b7f38ee7e8da84907cc6b09e38c587','url':'assets/img/solo_game/retmenuBT.png'},{'revision':'4acadfb6b03b84385f487ba7ee7bca56','url':'assets/img/solo_game/screenGame.png'},{'revision':'2300c2b26f39488e90b62cf9ca22128e','url':'assets/img/solo_game/titulo2-peq.png'},{'revision':'57040e5677322118f6d56a1d9e43c5c6','url':'favicon.ico'},{'revision':'2ffbc23293ee8a797bc61e9c02534206','url':'icons/icons-192.png'},{'revision':'8bdcc486cda9b423f50e886f2ddb6604','url':'icons/icons-512.png'},{'revision':'8dc6bb12f2a4c53b211caa82bfd71d08','url':'index.html'},{'revision':null,'url':'main.0877503d7adb1a3910b0.bundle.js'},{'revision':'ff0d08eca92dee1c2fc3a94297f58aeb','url':'manifest.json'},{'revision':null,'url':'vendors.30362b3ed22fb59f6d87.bundle.js'},{'revision':'dc32a1f565d8c9b7b21098880ef0b65d','url':'vendors.30362b3ed22fb59f6d87.bundle.js.LICENSE.txt'}],m().precache(L),function(t){const s=m();!function(t,s,a){let r;if("string"==typeof t){const e=new URL(t,location.href);r=new R((({url:t})=>t.href===e.href),s,a)}else if(t instanceof RegExp)r=new v(t,s,a);else if("function"==typeof t)r=new R(t,s,a);else{if(!(t instanceof R))throw new e("unsupported-route-type",{moduleName:"workbox-routing",funcName:"registerRoute",paramName:"capture"});r=t}(b||(b=new C,b.addFetchListener(),b.addCacheListener()),b).registerRoute(r)}(new U(s,t))}(undefined)})()})();