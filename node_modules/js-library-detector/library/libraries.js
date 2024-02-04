function _createTimeoutHelper() {
    let timeout;
    const timeoutPromise = new Promise((_, reject) => {
        timeout = setTimeout(() => reject(new Error('Timed out')), 5000);
    });

    return {timeoutPromise, clearTimeout: () => clearTimeout(timeout)};
}

var UNKNOWN_VERSION = null;
var d41d8cd98f00b204e9800998ecf8427e_LibraryDetectorTests = {

    'GWT': {
        id: 'gwt',
        icon: 'gwt',
        url: 'http://www.gwtproject.org/',
        test: function(win) {
            // pretty complicated, many possible tell tales
            var doc = win.document,
                hasHistFrame = doc.getElementById('__gwt_historyFrame'),
                hasGwtUid = doc.gwt_uid,
                hasBodyListener = doc.body.__listener,
                hasBodyEventBits = doc.body.__eventBits,
                hasModules = win.__gwt_activeModules,
                hasJsonP = win.__gwt_jsonp__,
                hasRootWinApp = win.__gwt_scriptsLoaded || win.__gwt_stylesLoaded || win.__gwt_activeModules;

            // use the many possible indicators
            if(hasHistFrame || hasGwtUid || hasBodyListener || hasBodyEventBits || hasModules || hasJsonP || hasRootWinApp) {

                // carefully look at frames, but only if certain is GWT frame
                var frames = doc.getElementsByTagName('iframe'),
                    gwtVersion = UNKNOWN_VERSION;
                for(var n=0; n<frames.length; n++) {
                    // catch security access errors
                    try {
                        var hasNegativeTabIndex = frames[n].tabIndex < 0; // on for GWT
                        if(hasNegativeTabIndex && frames[n].contentWindow && frames[n].contentWindow.$gwt_version) {
                            gwtVersion = frames[n].contentWindow.$gwt_version;
                            break;
                        }
                    }
                    catch(e) {}
                }

                if(gwtVersion=='0.0.999') {
                  gwtVersion = 'Google Internal';
                }

                return { version: gwtVersion };
            }
            return false;
        }
    },

    'Ink': {
        id: 'ink',
        icon: 'ink',
        url: 'http://ink.sapo.pt/',
        test: function(win) {
            if (win.Ink && win.Ink.createModule) {
                return { version: UNKNOWN_VERSION };
            }
            return false;
        }
    },

    'Vaadin': {
        id: 'vaadin',
        icon: 'vaadin',
        url: 'https://vaadin.com/',
        test: function(win) {
            if (win.vaadin && win.vaadin.registerWidgetset) {
                return { version: UNKNOWN_VERSION };
            }
            return false;
        }
    },

    'Bootstrap': {
        id: 'bootstrap',
        icon: 'bootstrap',
        url: 'http://getbootstrap.com/',
        npm: 'bootstrap',
        // look for a function Boostrap has added to jQuery - regex for BS 2 & 3
        test: function(win) {
            var jQueryAvailable = win.$ && win.$.fn,
                RE_PREFIX_V2 = '\\$this\\.data\\((?:\'|")',
                RE_PREFIX_V3 = '\\$this\\.data\\((?:\'|")(?:bs\\.){1}',
                bootstrapComponents = [
                    'affix', 'alert', 'button', 'carousel', 'collapse', 'dropdown',
                    'modal', 'popover', 'scrollspy', 'tab', 'tooltip'
                ];

            if(jQueryAvailable) {
                var bootstrapVersion;

                bootstrapComponents.some(function(component) {
                    if(win.$.fn[component]) {
                        // Bootstrap >= 3.2.0 detection
                        if(win.$.fn[component].Constructor && win.$.fn[component].Constructor.VERSION) {
                            bootstrapVersion = win.$.fn[component].Constructor.VERSION;
                            return true;
                        // Bootstrap >= 2.0.0 and <= 3.1.0 detection
                        } else if(new RegExp(RE_PREFIX_V3 + component).test(win.$.fn[component].toString())) {
                            bootstrapVersion = '>= 3.0.0 & <= 3.1.1';
                            return true;
                        // Bootstrap < 3.1.0 detection
                        } else if(new RegExp(RE_PREFIX_V2 + component).test(win.$.fn[component].toString())) {
                            bootstrapVersion = '>= 2.0.0 & <= 2.3.2';
                            return true;
                        }
                    }

                    return false;
                });

                if (bootstrapVersion) {
                    return { version: bootstrapVersion };
                }
            }

            return false;
        }
    },

    'Zurb': {
        id: 'zurb',
        icon: 'zurb',
        url: 'https://foundation.zurb.com/',
        npm: 'foundation-sites',
        test: function(win) {
            if(win.Foundation && win.Foundation.Toggler) {
                return { version: win.Foundation.version || UNKNOWN_VERSION };
            }
            return false;
        }
    },

    'Polymer': {
        id: 'polymer',
        icon: 'polymer',
        url: 'https://www.polymer-project.org/',
        npm: '@polymer/polymer',
        test: function(win) {
            if(win.Polymer && win.Polymer.dom) {
                return { version: win.Polymer.version || UNKNOWN_VERSION };
            }
            return false;
        }
    },

    'LitElement': {
        id: 'litelement',
        icon: 'polymer',
        url: 'https://lit-element.polymer-project.org/',
        npm: 'lit-element',
        test: function(win) {
            if(win.litElementVersions && win.litElementVersions.length) {
                // Get latest version if multiple versions are used
                var versions = [...win.litElementVersions].sort( (a, b) => a.localeCompare(b, undefined, { numeric:true }) );
                return { version: versions[versions.length - 1] };
            }
            return false;
        }
    },

    'lit-html': {
        id: 'lit-html',
        icon: 'polymer',
        url: 'https://lit-html.polymer-project.org/',
        npm: 'lit-element',
        test: function(win) {
            if(win.litHtmlVersions && win.litHtmlVersions.length) {
                // Get latest version if multiple versions are used
                var versions = [...win.litHtmlVersions].sort( (a, b) => a.localeCompare(b, undefined, { numeric:true }) );
                return { version: versions[versions.length - 1] };
            }
            return false;
        }
    },

    'Highcharts': {
        id: 'highcharts',
        icon: 'highcharts',
        url: 'http://www.highcharts.com',
        npm: 'highcharts',
        test: function(win) {
            if(win.Highcharts && win.Highcharts.Point) {
                return { version: win.Highcharts.version || UNKNOWN_VERSION };
            }
            return false;
        }
    },

    'InfoVis': {
        id: 'jit',
        icon: 'jit',
        url: 'http://philogb.github.com/jit/',
        test: function test(win) {
            if(win.$jit && win.$jit.PieChart) {
                return { version: win.$jit.version || UNKNOWN_VERSION };
            }
            return false;
        }
    },

    'FlotCharts': {
        id: 'flotcharts',
        icon: 'flotcharts',
        url: 'http://www.flotcharts.org/',
        npm: 'flot',
        test: function(win) {
            if(win.$ && win.$.plot) {
                return { version: win.$.plot.version || UNKNOWN_VERSION};
            }
            return false;
        }
    },

    'CreateJS': {
        id: 'createjs',
        icon: 'createjs',
        url: 'https://createjs.com/',
        npm: 'createjs',
        test: function(win) {
            if(win.createjs && win.createjs.promote) {
                return { version: UNKNOWN_VERSION}; // no version info available
            }
            return false;
        }
    },

    'Google Maps': {
        id: 'gmaps',
        icon: 'gmaps',
        url: 'https://developers.google.com/maps/',
        test: function(win) {
            if (win.google && win.google.maps) {
                return { version: win.google.maps.version || UNKNOWN_VERSION };
            }
            return false;
        }
    },

    'jQuery': {
        id: 'jquery',
        icon: 'jquery',
        url: 'http://jquery.com',
        npm: 'jquery',
        test: function(win) {
            var jq = win.jQuery || win.$;
            if (jq && jq.fn && jq.fn.jquery) {
                return { version: jq.fn.jquery.replace(/[^\d+\.+]/g, '') || UNKNOWN_VERSION};
            }
            return false;
        }
    },

    'jQuery (Fast path)': {
        id: 'jquery-fast',
        icon: 'jquery',
        url: 'http://jquery.com',
        npm: 'jquery',
        test: function (win) {
            var jq = win.jQuery || win.$;
            if (jq && jq.fn) {
                return { version: UNKNOWN_VERSION };
            }
            return false;
        }
    },

    'jQuery UI': {
        id: 'jquery_ui',
        icon: 'jquery_ui',
        url: 'http://jqueryui.com',
        npm: 'jquery-ui',
        test: function(win) {
            var jq = win.jQuery || win.$ || win.$jq || win.$j;
            if(jq && jq.fn && jq.fn.jquery && jq.ui) {
                var plugins = 'accordion,datepicker,dialog,draggable,droppable,progressbar,resizable,selectable,slider,menu,grid,tabs'.split(','), concat = [];
                for (var i=0; i < plugins.length; i++) { if(jq.ui[plugins[i]]) concat.push(plugins[i].substr(0,1).toUpperCase() + plugins[i].substr(1)); }
                return { version: jq.ui.version || UNKNOWN_VERSION, details: concat.length ? 'Plugins used: '+concat.join(',') : '' };
            }
            return false;
        }
    },

    'Dojo': {
        id: 'dojo',
        icon: 'dojo',
        url: 'http://dojotoolkit.org',
        npm: 'dojo',
        test: function(win) {
            if(win.dojo && win.dojo.delegate) {
                var version = win.dojo.version ? win.dojo.version.toString() : UNKNOWN_VERSION;
                return { version: version, details: 'Details: '+(win.dijit ? 'Uses Dijit' : 'none') };
            }
            return false;
        }
    },

    'Prototype': {
        id: 'prototype',
        icon: 'prototype',
        url: 'http://prototypejs.org',
        test: function(win) {
            if(win.Prototype && win.Prototype.BrowserFeatures) {
                return { version: win.Prototype.Version || UNKNOWN_VERSION };
            }
            return false;
        }
    },

    'Scriptaculous': {
        id: 'scriptaculous',
        icon: 'scriptaculous',
        url: 'http://script.aculo.us',
        test: function(win) {
            if(win.Scriptaculous && win.Scriptaculous.load) {
                return { version: win.Scriptaculous.Version || UNKNOWN_VERSION };
            }
            return false;
        }
    },

    'MooTools': {
        id: 'mootools',
        icon: 'mootools',
        url: 'https://mootools.net/',
        test: function(win) {
            if(win.MooTools && win.MooTools.build) {
                return { version: win.MooTools.version || UNKNOWN_VERSION };
            }
            return false;
        }
    },

    'Spry': {
        id: 'spry',
        icon: 'spry',
        url: 'http://labs.adobe.com/technologies/spry',
        test: function(win) {
            if (win.Spry && win.Spry.Data) {
                return { version: UNKNOWN_VERSION };
            }
            return false;
        }
    },

    'YUI 2': {
        id: 'yui',
        icon: 'yui',
        url: 'http://developer.yahoo.com/yui/2/',
        test: function(win) {
            if (win.YAHOO && win.YAHOO.util) {
                return { version: win.YAHOO.VERSION || UNKNOWN_VERSION };
            }
            return false;
        }
    },

    'YUI 3': {
        id: 'yui3',
        icon: 'yui3',
        url: 'https://yuilibrary.com/',
        npm: 'yui',
        test: function(win) {
            if (win.YUI && win.YUI.Env) {
                return { version: win.YUI.version || UNKNOWN_VERSION };
            }
            return false;
        }
    },

    'Qooxdoo': {
        id: 'qooxdoo',
        icon: 'qooxdoo',
        url: 'http://www.qooxdoo.org/',
        npm: 'qooxdoo',
        test: function(win) {
            if(win.qx && win.qx.Bootstrap) {
                return { version: UNKNOWN_VERSION };
            }
            return false;
        }
    },

    'Ext JS': {
        id: 'extjs',
        icon: 'extjs',
        url: 'https://www.sencha.com/products/extjs/',
        test: function(win) {
            if (win.Ext && win.Ext.versions) {
                return { version: win.Ext.versions.core.version };
            }
            else if(win.Ext) {
                return { version: win.Ext.version || UNKNOWN_VERSION };
            }
            return false;
        }
    },

    'Ezoic': {
        id: 'ezoic',
        icon: 'ezoic',
        url: 'https://www.ezoic.com/',
        test: function(win) {
            if (win.__ez && win.__ez.template) {
                return { version: UNKNOWN_VERSION };
            }
            return false;
        }
    },

    'base2': {
        id: 'base2',
        icon: 'base2',
        url: 'http://code.google.com/p/base2',
        test: function(win) {
            if(win.base2 && win.base2.dom) {
                return { version: win.base2.version || UNKNOWN_VERSION };
            }
            return false;
        }
    },

    'Closure Library': {
        id: 'closure',
        icon: 'closure',
        url: 'https://developers.google.com/closure/library/',
        npm: 'google-closure-library',
        test: function(win) {
            if(win.goog && win.goog.provide) {
                return { version: UNKNOWN_VERSION };
            }
            return false;
        }
    },

    'Rapha&euml;l': {
        id: 'raphael',
        icon: 'raphael',
        url: 'http://dmitrybaranovskiy.github.io/raphael/',
        test: function(win) {
            if (win.Raphael && win.Raphael.circle) {
                return { version: win.Raphael.version || UNKNOWN_VERSION };
            }
            return false;
        }
    },

    'React': {
        id: 'react',
        icon: 'react',
        url: 'https://reactjs.org/',
        npm: 'react',
        test: function(win) {
            function isMatch(node) {
                return node!=null && node._reactRootContainer!=null;
            }
            function nodeFilter(node) {
                return isMatch(node) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
            }
            var reactRoot = document.getElementById('react-root');
            var altHasReact = document.querySelector('*[data-reactroot]');
            var bodyReactRoot = isMatch(document.body) || isMatch(document.body.firstElementChild);
            var hasReactRoot = bodyReactRoot|| document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT, nodeFilter).nextNode() != null;
            if (hasReactRoot || reactRoot && reactRoot.innerText.length > 0 || altHasReact || win.React && win.React.Component) {
                return { version: win.React && win.React.version || UNKNOWN_VERSION };
            }
            return false;
        }
    },

    'React (Fast path)': {
        id: 'react-fast',
        icon: 'react',
        url: 'https://reactjs.org/',
        npm: 'react',
        test: function (win) {
            function isMatch(node) {
                return node != null && node._reactRootContainer != null;
            }
            var reactRoot = document.getElementById('react-root');
            var altHasReact = document.querySelector('*[data-reactroot]');
            var hasReactRoot = isMatch(document.body) || isMatch(document.body.firstElementChild);
            if (hasReactRoot || reactRoot || altHasReact || win.React) {
                return { version: win.React && win.React.version || UNKNOWN_VERSION };
            }
            return false;
        }
    },

    'Next.js': {
        id: 'next',
        icon: 'next',
        url: 'https://nextjs.org/',
        npm: 'next',
        test: function(win) {
            if (win.__NEXT_DATA__ && win.__NEXT_DATA__.buildId) {
                return { version: window.next && window.next.version || UNKNOWN_VERSION };
            }
            return false;
        }
    },

    'Next.js (Fast path)': {
        id: 'next-fast',
        icon: 'next',
        url: 'https://nextjs.org/',
        npm: 'next',
        test: function (win) {
            if (win.__NEXT_DATA__) {
                return { version: UNKNOWN_VERSION };
            }
            return false;
        }
    },

    'Preact': {
        id: 'preact',
        icon: 'preact',
        url: 'https://preactjs.com/',
        npm: 'preact',
        test: function(win) {
            var expando = typeof Symbol!='undefined' && Symbol.for && Symbol.for('preactattr');
            function isMatch(node) {
                if ('__k' in node && 'props' in node.__k && 'type' in node.__k) {
                    return true;
                }
                return '_component' in node || '__preactattr_' in node || expando && node[expando]!=null;
            }
            function getMatch(node) {
                return node!=null && isMatch(node) && node;
            }
            function nodeFilter(node) {
                return isMatch(node) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
            }
            var preactRoot = getMatch(document.body) || getMatch(document.body.firstElementChild);
            if (!preactRoot) {
                preactRoot = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT, nodeFilter).nextNode();
            }
            if (preactRoot || win.preact) {
                var version = UNKNOWN_VERSION;
                if (preactRoot) {
                    if ('__k' in preactRoot) {
                        version = '10';
                    }
                    if ('__preactattr_' in preactRoot) {
                        version = '8';
                    }
                    if (expando && preactRoot[expando]!=null) {
                        version = '7';
                    }
                }
                return { version: version };
            }
            return false;
        }
    },

    'Preact (Fast path)': {
        id: 'preact-fast',
        icon: 'preact',
        url: 'https://preactjs.com/',
        npm: 'preact',
        test: function (win) {
            var version = UNKNOWN_VERSION;
            function isMatch(node) {
                if (node.__k != null) { version = '10'; return true; }
                return node._component != null || node.__preactattr_ != null;
            }
            function getMatch(node) {
                return node != null && isMatch(node);
            }
            var preactRoot = getMatch(document.body) || getMatch(document.body.firstElementChild);
            if (preactRoot || win.preact) {
                return { version: version };
            }
            return false;
        }
    },

    'Modernizr': {
        id: 'modernizr',
        icon: 'modernizr',
        url: 'https://modernizr.com/',
        npm: 'modernizr',
        test: function(win) {
            if (win.Modernizr && win.Modernizr.addTest) {
                return { version: win.Modernizr._version || UNKNOWN_VERSION };
            }
            return false;
        }
    },

    'Processing.js': {
        id: 'processingjs',
        icon: 'processingjs',
        url: 'http://processingjs.org',
        npm: 'processing-js',
        test: function(win) {
            if(win.Processing && win.Processing.box) {
                return { version: Processing.version || UNKNOWN_VERSION };
            }
            return false;
        }
    },

    'Backbone': {
        id: 'backbone',
        icon: 'backbone',
        url: 'http://backbonejs.org/',
        npm: 'backbone',
        test: function(win) {
            if (win.Backbone && win.Backbone.Model.extend) {
                return {version: win.Backbone.VERSION || UNKNOWN_VERSION};
            }
            return false;
        }
    },

    'Leaflet': {
        id: 'leaflet',
        icon: 'leaflet',
        url: 'http://leafletjs.com',
        npm: 'leaflet',
        test: function(win) {
            // Leaflet 3.1 uses L.Marker and L.VERSION; later versions use L.marker and L.version
            if (win.L && win.L.GeoJSON && (win.L.marker || win.L.Marker)) {
                return { version: win.L.version || win.L.VERSION || UNKNOWN_VERSION };
            }
            return false;
        }
    },

    'Mapbox': {
        id: 'mapbox',
        icon: 'mapbox',
        url: 'https://www.mapbox.com/',
        npm: 'mapbox-gl',
        test: function(win) {
            if (win.L && win.L.mapbox && win.L.mapbox.geocoder) {
                return { version: win.L.mapbox.VERSION || UNKNOWN_VERSION };
            }
            return false;
        }
    },

    'Lo-Dash': {
        id: 'lodash',
        icon: 'lodash',
        url: 'https://lodash.com/',
        npm: 'lodash',
        test: function(win) {
            var _ = typeof (_ = win._) == 'function' && _,
                chain = typeof (chain = _ && _.chain) == 'function' && chain,
                wrapper = (chain || _ || function() { return {}; })(1);

            if (_ && wrapper.__wrapped__) {
                return { version: _.VERSION || UNKNOWN_VERSION };
            }
            return false;
        }
    },

    'Underscore': {
        id: 'underscore',
        icon: 'underscore',
        url: 'http://underscorejs.org/',
        npm: 'underscore',
        test: function(win) {
            if (win._ && typeof win._.tap === 'function' &&
                !d41d8cd98f00b204e9800998ecf8427e_LibraryDetectorTests['Lo-Dash'].test(win)) {
                return {version: win._.VERSION || UNKNOWN_VERSION};
            }
            return false;
        }
    },

    'Sammy': {
        id: 'sammy',
        icon: 'sammy',
        url: 'http://sammyjs.org',
        test: function(win) {
            if (win.Sammy && win.Sammy.Application.curry) {
                return {version: win.Sammy.VERSION || UNKNOWN_VERSION};
            }
            return false;
        }
    },

    'Rico': {
        id: 'rico',
        icon: 'rico',
        url: 'http://openrico.sourceforge.net/examples/index.html',
        test:  function(win) {
            if (win.Rico && window.Rico.checkIfComplete) {
                return {version: win.Rico.Version || UNKNOWN_VERSION};
            }
            return false;
        }
    },

    'MochiKit': {
        id: 'mochikit',
        icon: 'mochikit',
        url: 'https://mochi.github.io/mochikit/',
        test: function(win) {
            if (win.MochiKit && win.MochiKit.Base.module) {
                return {version: MochiKit.VERSION || UNKNOWN_VERSION};
            }
            return false;
        }
    },

    'gRapha&euml;l': {
        id: 'graphael',
        icon: 'graphael',
        url: 'https://github.com/DmitryBaranovskiy/g.raphael',
        test: function(win) {
            if (win.Raphael && win.Raphael.fn.g) {
                return {version: UNKNOWN_VERSION};
            }
            return false;
        }
    },

    'Glow': {
        id: 'glow',
        icon: 'glow',
        url: 'http://www.bbc.co.uk/glow/',
        test: function(win) {
            if (win.gloader && win.gloader.getRequests) {
                return {version: UNKNOWN_VERSION};
            }
            else if (win.glow && win.glow.dom) {
                return {version: win.glow.VERSION || UNKNOWN_VERSION};
            }
            else if (win.Glow) {
                return {version: win.Glow.version || UNKNOWN_VERSION};
            }
            return false;
        }
    },

    'Socket.IO': {
        id: 'socketio',
        icon: 'socketio', // currently has no icon
        url: 'https://socket.io/',
        npm: 'socket.io',
        test: function(win) {
            // version 0.6.2 uses only io.Socket; more recent versions also have io.sockets
            if (win.io && (win.io.sockets || win.io.Socket)) {
                return {version: win.io.version || UNKNOWN_VERSION};
            }
            return false;
        }
    },

    'Mustache': {
        id: 'mustache',
        icon: 'mustache',
        url: 'http://mustache.github.io/',
        npm: 'mustache',
        test: function(win) {
            if (win.Mustache && win.Mustache.to_html) {
                return {version: win.Mustache.version || UNKNOWN_VERSION};
            }
            return false;
        }
    },

    'Fabric.js': {
        id: 'fabricjs',
        icon: 'icon38', // currently has no icon
        url: 'http://fabricjs.com/',
        npm: 'fabric',
        test: function(win) {
            if (win.fabric && win.fabric.util) {
                return {version: win.fabric.version || UNKNOWN_VERSION};
            }
            return false;
        }
    },

    'FuseJS': {
        id: 'fusejs',
        icon: 'fusejs',
        url: 'http://fusejs.io/',
        npm: 'fuse.js',
        test: function(win) {
            if (win.Fuse) {
                return {version: UNKNOWN_VERSION};
            }
            return false;
        }
    },

    'Tween.js': {
        id: 'tweenjs',
        icon: 'icon38', // currently has no icon
        url: 'https://github.com/tweenjs/tween.js',
        npm: 'tween.js',
        test: function(win) {
            if (win.TWEEN && win.TWEEN.Easing) {
                return {version: UNKNOWN_VERSION};
            }
            return false;
        }
    },

    'SproutCore': {
       id: 'sproutcore',
       icon: 'sproutcore',
       url: 'http://sproutcore.com/',
       test: function(win) {
           if (win.SC && win.SC.Application) {
               return {version: UNKNOWN_VERSION};
           }
           return false;
       }
    },

    'Zepto.js': {
       id: 'zepto',
       icon: 'zepto',
       url: 'http://zeptojs.com',
       npm: 'zepto',
       test: function(win) {
           if (win.Zepto && win.Zepto.fn) {
               return {version: UNKNOWN_VERSION};
           }
           return false;
       }
    },

    'three.js': {
       id: 'threejs',
       icon: 'icon38', // currently has no icon
       url: 'https://threejs.org/',
       npm: 'three',
       test: function(win) {
           if (win.THREE && win.THREE.REVISION) {
               return {version: 'r' + win.THREE.REVISION};
           }
           else if (win.THREE) {
               return {version: UNKNOWN_VERSION};
           }
           return false;
       }
    },

    'PhiloGL': {
       id: 'philogl',
       icon: 'philogl',
       url: 'http://www.senchalabs.org/philogl/',
       npm: 'philogl',
       test: function(win) {
           if (win.PhiloGL && win.PhiloGL.Camera) {
               return {version: win.PhiloGL.version || UNKNOWN_VERSION};
           }
           return false;
       }
    },

    'CamanJS': {
        id: 'camanjs',
        icon: 'camanjs',
        url: 'http://camanjs.com/',
        npm: 'caman',
        test: function(win) {
            if (win.Caman && win.Caman.version) {
                return {version: win.Caman.version.release};
            }
            else if (win.Caman) {
                return {version: UNKNOWN_VERSION};
            }
            return false;
        }
    },

    'yepnope': {
        id: 'yepnope',
        icon: 'yepnope',
        url: 'http://yepnopejs.com/',
        test: function(win) {
            if (win.yepnope && win.yepnope.injectJs) {
                return {version: UNKNOWN_VERSION};
            }
            return false;
        }
    },

    'LABjs': {
        id: 'labjs',
        icon: 'icon38',
        url: 'https://github.com/getify/LABjs',
        test: function(win) {
            if (win.$LAB && win.$LAB.setOptions) {
                return {version: UNKNOWN_VERSION};
            }
            return false;
        }
    },

    'Head JS': {
        id: 'headjs',
        icon: 'headjs',
        url: 'http://headjs.com/',
        npm: 'headjs',
        test: function(win) {
            if (win.head && win.head.js) {
                return {version: UNKNOWN_VERSION};
            }
            return false;
        }
    },

    'ControlJS': {
        id: 'controljs',
        icon: 'icon38',
        url: 'http://stevesouders.com/controljs/',
        test: function(win) {
            if (win.CJS && win.CJS.start) {
                return {version: UNKNOWN_VERSION};
            }
            return false;
        }
    },

    'RequireJS': {
        id: 'requirejs',
        icon: 'requirejs',
        url: 'http://requirejs.org/',
        npm: 'requirejs',
        test: function(win) {
            var req = win.require || win.requirejs;
            if (req && (req.load || (req.s && req.s.contexts && req.s.contexts._ && (req.s.contexts._.loaded || req.s.contexts._.load)))) {
                return { version: req.version || UNKNOWN_VERSION };
            }
            return false;
        }
    },

    'RightJS': {
        id: 'rightjs',
        icon: 'rightjs',
        url: 'http://rightjs.org/',
        test: function(win) {
            if (win.RightJS && win.RightJS.isNode) {
                return { version: win.RightJS.version || UNKNOWN_VERSION };
            }
            return false;
        }
    },

    'jQuery Tools': {
       id: 'jquerytools',
       icon: 'jquerytools',
       url: 'http://jquerytools.github.io/',
       test: function(win) {
            var jq = win.jQuery || win.$;
            if(jq && jq.tools) {
               return { version: jq.tools.version || UNKNOWN_VERSION };
           }
           return false;
       }
    },

    'Pusher': {
       id: 'pusher',
       icon: 'pusher',
       url: 'https://pusher.com/docs/',
       npm: 'pusher-js',
       test: function(win) {
            if(win.Pusher && win.Pusher.Channel) {
               return { version: win.Pusher.VERSION || UNKNOWN_VERSION };
           }
           return false;
       }
    },

    'Paper.js': {
       id: 'paperjs',
       icon: 'paperjs',
       url: 'http://paperjs.org/',
       npm: 'paper',
       test: function(win) {
            if(win.paper && win.paper.Point) {
               return { version: win.paper.version || UNKNOWN_VERSION };
           }
           return false;
       }
    },

    'Swiffy': {
       id: 'swiffy',
       icon: 'icon38',
       url: 'https://developers.google.com/swiffy/',
       test: function(win) {
            if(win.swiffy && win.swiffy.Stage) {
               return { version: UNKNOWN_VERSION };
           }
           return false;
       }
    },

    'Move': {
       id: 'move',
       icon: 'move',
       url: 'https://github.com/rsms/move',
       npm: 'move',
       test: function(win) {
            if(win.move && win.move.compile) {
               return { version: win.move.version() || UNKNOWN_VERSION };
           }
           return false;
       }
    },

    'AmplifyJS': {
       id: 'amplifyjs',
       icon: 'amplifyjs',
       url: 'http://amplifyjs.com/',
       npm: 'amplifyjs',
       test: function(win) {
            if(win.amplify && win.amplify.publish) {
               return { version: UNKNOWN_VERSION };
           }
           return false;
       }
    },

    'Popcorn.js': {
       id: 'popcornjs',
       icon: 'popcornjs',
       url: 'https://github.com/mozilla/popcorn-js/',
       test: function(win) {
            if (win.Popcorn && win.Popcorn.Events) {
               return { version: win.Popcorn.version || UNKNOWN_VERSION };
           }
           return false;
       }
    },

    'D3': {
        id: 'd3',
        icon: 'd3',
        url: 'https://d3js.org/',
        npm: 'd3',
        test: function(win) {
            if (win.d3 && win.d3.select) {
                return { version: win.d3.version || UNKNOWN_VERSION };
            }
            return false;
        }
    },

    'Handlebars': {
        id: 'handlebars',
        icon: 'handlebars',
        url: 'http://handlebarsjs.com/',
        npm: 'handlebars',
        test: function(win) {
            if(win.Handlebars && win.Handlebars.compile) {
                return { version: win.Handlebars.VERSION || UNKNOWN_VERSION };
            }
            return false;
        }
    },

    'Handsontable': {
        id: 'handsontable',
        icon: 'handsontable',
        url: 'https://handsontable.com/',
        npm: 'handsontable',
        test: function(win) {
            if (win.Handsontable && win.Handsontable.Core) {
                return { version: win.Handsontable.version || UNKNOWN_VERSION };
            }
            return false;
        }
    },

    'Knockout': {
        id: 'knockout',
        icon: 'knockout',
        url: 'http://knockoutjs.com/',
        npm: 'knockout',
        test: function(win) {
            if (win.ko && win.ko.applyBindings) {
                return { version: win.ko.version || UNKNOWN_VERSION };
            }
            return false;
        }
    },

    'Spine': {
        id: 'spine',
        icon: 'icon38',
        url: 'http://spine.github.io/',
        test: function(win) {
            if (win.Spine && win.Spine.Controller) {
                return {version: win.Spine.version || UNKNOWN_VERSION};
            }
            return false;
        }
    },

    'jQuery Mobile': {
        id: 'jquery-mobile',
        icon: 'jquery_mobile',
        url: 'http://jquerymobile.com/',
        npm: 'jquery-mobile',
        test: function(win) {
            var jq = win.jQuery || win.$ || win.$jq || win.$j;
            if(jq && jq.fn && jq.fn.jquery && jq.mobile) {
                return { version: jq.mobile.version || UNKNOWN_VERSION };
            }
            return false;
        }
    },

    'WebFont Loader': {
        id: 'webfontloader',
        icon: 'icon38',
        url: 'https://github.com/typekit/webfontloader',
        npm: 'webfontloader',
        test: function(win) {
            if(win.WebFont && win.WebFont.load) {
                return { version: UNKNOWN_VERSION };
            }
            return false;
        }
    },

    'Angular': {
        id: 'angular',
        icon: 'angular',
        url: 'https://angular.io/',
        npm: '@angular/core',
        test: function(win) {
            var ngVersion = win.document.querySelector('[ng-version]');
            if (ngVersion) {
                return { version: ngVersion.getAttribute('ng-version') || UNKNOWN_VERSION };
            }
            else if (win.ng && win.ng.probe instanceof Function) {
                return { version: UNKNOWN_VERSION };
            }
            return false;
        }
    },

    'AngularJS': {
        id: 'angularjs',
        icon: 'angularjs',
        url: 'https://angularjs.org/',
        npm: 'angular',
        test: function(win) {
            var ng = win.angular;
            if (ng && ng.version && ng.version.full) {
                return { version: ng.version.full };
            }
            return false;
        }
    },

    'Ionic': {
        id: 'ionic',
        icon: 'ionic',
        url: 'https://ionicframework.com/',
        npm: '@ionic/cli',
        test: function(win) {
            var ion = win.document.querySelector('ion-app');
            if (ion && ion.nodeName === 'ION-APP') {
                return { version: UNKNOWN_VERSION };
            }
            return false;
        }
    },

    'Ember.js': {
        id: 'emberjs',
        icon: 'emberjs',
        url: 'https://emberjs.com/',
        npm: 'ember-source',
        test: function(win) {
            var ember = win.Ember || win.Em;
            if (ember && ember.GUID_KEY) {
                return { version: ember.VERSION || UNKNOWN_VERSION };
            }
            return false;
        }
    },

    'Hammer.js': {
        id: 'hammerjs',
        icon: 'hammerjs',
        url: 'http://eightmedia.github.io/hammer.js/',
        npm: 'hammerjs',
        test: function(win) {
            if(win.Hammer && win.Hammer.Pinch) {
                // Hammer.VERSION available in 1.0.10+
                return { version: win.Hammer.VERSION || "&lt; 1.0.10" };
            }
            return false;
        }
    },

    'Visibility.js': {
        id: 'visibilityjs',
        icon: 'icon38',
        url: 'https://github.com/ai/visibilityjs',
        npm: 'visibilityjs',
        test: function(win) {
            if(win.Visibility && win.Visibility.every) {
                return { version: UNKNOWN_VERSION };
            }
            return false;
        }
    },

    'Velocity.js': {
        id: 'velocityjs',
        icon: 'icon38',
        url: 'http://velocityjs.org/',
        npm: 'velocity-animate',
        test: function(win) {
            var jq = win.jQuery || win.$,
                velocity = jq ? jq.Velocity : win.Velocity;

            if(velocity && velocity.RegisterEffect && velocity.version) {
                return {
                    version:
                        velocity.version.major + "." +
                        velocity.version.minor + "." +
                        velocity.version.patch
                };
            }
            else if (velocity && velocity.RegisterEffect) {
                return { version: UNKNOWN_VERSION };
            }
            return false;
        }
    },

    'IfVisible.js': {
        id: 'ifvisiblejs',
        icon: 'icon38',
        url: 'http://serkanyersen.github.io/ifvisible.js/',
        npm: 'ifvisible.js',
        test: function(win) {
            var iv = win.ifvisible;
            if(iv && iv.__ceGUID === "ifvisible.object.event.identifier") {
                return { version: UNKNOWN_VERSION };
            }
            return false;
        }
    },
    'Pixi.js': {
        id: 'pixi',
        icon: 'pixi',
        url: 'http://www.pixijs.com/',
        npm: 'pixi.js',
        test: function(win) {
            var px = win.PIXI;
            if(px && px.WebGLRenderer && px.VERSION) {
                // version 4.4.3 returns simply "4.4.3"; version 1.5.2 returns "v1.5.2"
                return { version: px.VERSION.replace('v', '') || UNKNOWN_VERSION };
            }
            return false;
        }
    },
    'DC.js': {
        id: 'dcjs',
        icon: 'dcjs',
        url: 'http://dc-js.github.io/dc.js/',
        npm: 'dc',
        test: function(win) {
            var dc = win.dc;
            if(dc && dc.registerChart) {
                return { version: dc.version || UNKNOWN_VERSION };
            }
            return false;
        }
    },
    'GreenSock JS': {
        id: 'greensock',
        icon: 'greensock',
        url: 'https://greensock.com/gsap',
        npm: 'gsap',
        test: function(win) {
            if (win.TweenMax && win.TweenMax.pauseAll) {
                return { version: win.TweenMax.version || UNKNOWN_VERSION };
            }
            return false;
        }
    },
    'FastClick': {
        id: 'fastclick',
        icon: 'fastclick',
        url: 'https://github.com/ftlabs/fastclick',
        npm: 'fastclick',
        test: function(win) {
            if(win.FastClick && win.FastClick.notNeeded) {
                return { version: UNKNOWN_VERSION };
            }
            return false;
        }
    },
    'Isotope': {
        id: 'isotope',
        icon: 'isotope',
        url: 'https://isotope.metafizzy.co/',
        npm: 'isotope-layout',
        test: function(win) {
            if(win.Isotope || (win.$ != null && win.$.Isotope)) {
                return { version: UNKNOWN_VERSION };
            }
            return false;
        }
    },
    'Marionette': {
        id: 'marionette',
        icon: 'marionette',
        url: 'https://marionettejs.com/',
        npm: 'backbone.marionette',
        test: function(win) {
            if(win.Marionette && win.Marionette.Application) {
                return { version: win.Marionette.VERSION || UNKNOWN_VERSION };
            }
            return false;
        }
    },
    'Can': {
        id: 'canjs',
        icon: 'canjs',
        url: 'https://canjs.com/',
        npm: 'can',
        test: function (win) {
            if (win.can && win.can.Construct) {
                return { version: win.can.VERSION || UNKNOWN_VERSION };
            }
            return false;
        }
    },
    'Vue': {
        id: 'vue',
        icon: 'vue',
        url: 'https://vuejs.org/',
        npm: 'vue',
        test: function(win) {
            function isVueNode(node) {
                return node.__vue__ != null ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
            }
            var hasVueNode = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT, isVueNode).nextNode() !== null;
            if (hasVueNode || win.Vue) {
                return { version: win.Vue && win.Vue.version || UNKNOWN_VERSION };
            }
            return false;
        }
    },
    'Vue (Fast path)': {
        id: 'vue-fast',
        icon: 'vue',
        url: 'https://vuejs.org/',
        npm: 'vue',
        test: function (win) {
            if (win.Vue) {
                return { version: win.Vue && win.Vue.version || UNKNOWN_VERSION };
            }
            return false;
        }
    },
    'Nuxt.js': {
        id: 'nuxt',
        icon: 'nuxt',
        url: 'https://nuxtjs.org/',
        npm: 'nuxt',
        test: function(win) {
            if (win.__NUXT__ || win.$nuxt || [...win.document.querySelectorAll('*')].some(el => el.__vue__?.nuxt)) {
                return { version: UNKNOWN_VERSION };
            }
            return false;
        }
    },
    'Nuxt.js (Fast path)': {
        id: 'nuxt-fast',
        icon: 'nuxt',
        url: 'https://nuxtjs.org/',
        npm: 'nuxt',
        test: function (win) {
            if (win.__NUXT__  || win.$nuxt) {
                return { version: UNKNOWN_VERSION };
            }
            return false;
        }
    },
    'Two': {
        id: 'two',
        icon: 'two',
        url: 'https://two.js.org/',
        npm: 'two.js',
        test: function(win) {
            if (win.Two && win.Two.Utils) {
                return { version: win.Two.Version || UNKNOWN_VERSION };
            }
            return false;
        }
    },
    'Brewser': {
        id: 'brewser',
        icon: 'brewser',
        url: 'https://robertpataki.github.io/brewser/',
        npm: 'brewser',
        test: function(win) {
            if(win.BREWSER && win.BREWSER.ua) {
                return { version: BREWSER.VERSION || UNKNOWN_VERSION };
            }
            return false;
        }
    },
    'Material Design Lite': {
        id: 'materialdesignlite',
        icon: 'mdl',
        url: 'https://getmdl.io/',
        npm: 'material-design-lite',
        test: function(win) {
            if(win.componentHandler && win.componentHandler.upgradeElement) {
                return { version: UNKNOWN_VERSION};
            }
            return false;
        }
    },
    'Kendo UI': {
        id: 'kendoui',
        icon: 'kendoui',
        url: 'https://github.com/telerik/kendo-ui-core',
        npm: 'kendo-ui-core',
        test: function(win) {
            if (win.kendo && win.kendo.View && win.kendo.View.extend) {
                return {version: win.kendo.version || UNKNOWN_VERSION};
            }
            return false;
        }
    },
    'Matter.js': {
        id: 'matterjs',
        icon: 'matter-js',
        url: 'http://brm.io/matter-js/',
        npm: 'matter-js',
        test: function(win) {
            if (win.Matter && win.Matter.Engine) {
                return {version: UNKNOWN_VERSION};
            }
            return false;
        }
    },
    'Riot': {
        id: 'riot',
        icon: 'riot',
        url: 'http://riotjs.com/',
        npm: 'riot',
        test: function(win) {
            if (win.riot && win.riot.mixin) {
                return { version: win.riot.version || UNKNOWN_VERSION };
            }
            return false;
        }
    },
    'Sea.js': {
        id: 'seajs',
        icon: 'icon38',
        url: 'https://seajs.github.io/seajs/docs/',
        npm: 'seajs',
        test: function(win) {
            if(win.seajs && win.seajs.use) {
                return { version: win.seajs.version || UNKNOWN_VERSION };
            }
            return false;
        }
    },
    'Moment.js': {
        id: 'momentjs',
        icon: 'momentjs',
        url: 'http://momentjs.com/',
        npm: 'moment',
        test: function(win) {
            if(win.moment && (win.moment.isMoment || win.moment.lang)) {
                // version 1.0.0 has neither "isMoment" nor "version"
                return { version: win.moment.version || UNKNOWN_VERSION };
            }
            return false;
        }
    },
    'Moment Timezone': {
        id: 'moment-timezone',
        icon: 'momentjs',
        url: 'http://momentjs.com/timezone/',
        npm: 'moment-timezone',
        test: function(win) {
            if (win.moment && win.moment.tz) {
                return { version: win.moment.tz.version || UNKNOWN_VERSION };
            }
            return false;
        }
    },
    'ScrollMagic': {
        id: 'scrollmagic',
        icon: 'scrollmagic',
        url: 'http://scrollmagic.io/',
        npm: 'scrollmagic',
        test: function(win) {
            if (win.ScrollMagic && win.ScrollMagic.Controller) {
                return {version: ScrollMagic.version || UNKNOWN_VERSION};
            }
            return false;
        }
    },
    'SWFObject': {
        id: 'swfobject',
        icon: 'icon38', // currently has no icon
        url: 'https://github.com/swfobject/swfobject',
        test: function(win) {
            if (win.swfobject && win.swfobject.embedSWF) {
                // 2.x - exact version only for 2.3
                return { version: win.swfobject.version || UNKNOWN_VERSION };
            } else if(win.deconcept && win.deconcept.SWFObject) {
                // 1.x
                return { version: UNKNOWN_VERSION };
            }
            return false;
        }
    },
    'FlexSlider': {
        id: 'flexslider',
        icon: 'icon38', // currently has no icon
        url: 'https://woocommerce.com/flexslider/',
        npm: 'flexslider',
        test: function(win) {
            var jq = win.jQuery || win.$ || win.$jq || win.$j;
            if (jq && jq.fn && jq.fn.jquery && jq.flexslider){
                return { version: UNKNOWN_VERSION };
            }
            return false;
        }
    },
    'SPF': {
        id: 'spf',
        icon: 'icon38', // currently has no icon
        url: 'https://youtube.github.io/spfjs/',
        npm: 'spf',
        test: function(win) {
            if (win.spf && win.spf.init) {
                return { version: UNKNOWN_VERSION };
            }
            return false;
        }
    },
    'Numeral.js': {
        id: 'numeraljs',
        icon: 'icon38', // currently has no icon
        url: 'http://numeraljs.com/',
        npm: 'numeraljs',
        test: function(win) {
            if (win.numeral && win.isNumeral) {
                return { version: win.numeral.version || UNKNOWN_VERSION };
            }
            return false;
        }
    },
    'boomerang.js': {
        id: 'boomerangjs',
        icon: 'icon38', // currently has no icon
        url: 'https://soasta.github.io/boomerang/',
        npm: 'boomerangjs',
        test: function(win) {
            if (win.BOOMR && win.BOOMR.utils && win.BOOMR.init) {
                return { version: win.BOOMR.version || UNKNOWN_VERSION };
            }
            return false;
        }
    },
    'Framer': {
        id: 'framer',
        icon: 'framer',
        url: 'https://framer.com/',
        npm: 'framerjs',
        test: function(win) {
            if (win.Framer && win.Framer.Layer) {
                return { version: win.Framer.Version.build || UNKNOWN_VERSION };
            }
            return false;
        }
    },
    'Marko': {
        id: 'marko',
        icon: 'marko',
        url: 'https://markojs.com/',
        npm: 'marko',
        test: function (win) {
            var selector = '[data-marko-key], [data-marko]';
            var markoElement = document.querySelector(selector);
            if (markoElement) {
                return { version: UNKNOWN_VERSION };
            }
            return false;
        }
    },
    'AMP': {
        id: 'amp',
        icon: 'amp',
        url: 'https://amp.dev/',
        npm: 'https://www.npmjs.com/org/ampproject',
        test: function (win) {
            var version = win.document.documentElement.getAttribute("amp-version");
            return version ? { version: version } : false;
        }
    },
    'Gatsby': {
        id: 'gatsby',
        icon: 'gatsby',
        url: 'https://www.gatsbyjs.org/',
        npm: 'gatsby',
        test: function (win) {
            if (document.getElementById('___gatsby')) {
                return { version: UNKNOWN_VERSION };
            }
            return false;
        }
    },
    'Shopify': {
        id: 'shopify',
        icon: 'shopify',
        url: 'https://www.shopify.com/',
        npm: null,
        test: function (win) {
            if (win.Shopify && win.Shopify.shop) {
                return { version: UNKNOWN_VERSION };
            }
            return false;
        }
    },
    'Magento': {
        id: 'magento',
        icon: 'magento',
        url: 'https://magento.com/',
        npm: null,
        test: function (win) {
            // Same detecton used in Magento 2 DevTools: https://github.com/magento/m2-devtools
            const reRequireScript = /\/static(?:\/version\d+)?\/frontend\/.+\/.+\/requirejs\/require(?:\.min)?\.js/;
            const scripts = Array.from(document.querySelectorAll('script[src]') || []);
            if (scripts.some(s => reRequireScript.test(s.src))) {
                return { version: 2 }; // Magento 1 is no longer supported and this only verifies version 2
            }
            
            return false;
        }
    },
    'WordPress': {
        id: 'wordpress',
        icon: 'wordpress',
        url: 'https://wordpress.org/',
        npm: null,
        test: function (win) {
            const hasAPILinkElem = !!document.querySelector('link[rel="https://api.w.org/"]');
            const hasWPIncludes = !!document.querySelectorAll('link[href*="wp-includes"], script[src*="wp-includes"]').length;

            if (!hasAPILinkElem && !hasWPIncludes) return false;

            const generatorMeta = document.querySelector('meta[name=generator][content^="WordPress"]');
            const version = generatorMeta ? generatorMeta.getAttribute("content").replace(/^\w+\s/,'') : UNKNOWN_VERSION;
            return { version };
        }
    },
    'Wix': {
        id: 'wix',
        icon: 'wix',
        url: 'https://www.wix.com/',
        npm: null,
        test: function (win) {
            if (win.wixPerformanceMeasurements && win.wixPerformanceMeasurements.info) {
                return { version: UNKNOWN_VERSION };
            } else if (win.wixBiSession && win.wixBiSession.info) {
                return { version: UNKNOWN_VERSION };
            }
            return false;
        }
    },
    'Workbox': {
      id: 'workbox',
      icon: 'workbox',
      url: 'https://developers.google.com/web/tools/workbox/',
      npm: 'workbox-sw',
      test: async function (win) {
        var nav = win.navigator;
        // Service Workers not supported
        if (!('serviceWorker' in nav)) {
          return false;
        }

        const {timeoutPromise, clearTimeout} = _createTimeoutHelper();

        const workerPromise = nav.serviceWorker.getRegistration()
        .then(function(registration) {
          var scriptURL = nav.serviceWorker.controller ? nav.serviceWorker.controller.scriptURL :
            registration.active.scriptURL;
          return fetch(scriptURL, { credentials: 'include',
            headers: { 'service-worker': 'script' }
          })
          .then(function(response) {
            return response.text();
          })
          .then(function(scriptContent) {
            var workboxRegExp = /new Workbox|new workbox|workbox\.precaching\.|workbox\.strategies/gm;
            if (workboxRegExp.test(scriptContent)) {
              // Adapted from
              // https://github.com/semver/semver/issues/232#issue-48635632
              var semVerRegExp = /workbox.*?\b((0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(-(0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(\.(0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*)?(\+[0-9a-zA-Z-]+(\.[0-9a-zA-Z-]+)*)?)\b/gim;
              var matches = semVerRegExp.exec(scriptContent);
              var version = UNKNOWN_VERSION;
              if (Array.isArray(matches) && matches.length > 1 && matches[1]) {
                version = matches[1];
              }
              return { version: version };
            }
            return false;
          });
        })
        /* fix for https://github.com/johnmichel/Library-Detector-for-Chrome/issues/178
         * `TypeError: Cannot read property 'active' of undefined` on registration.active.scriptURL from failed serviceWorker where 'registration' is undefined above
         */
        .catch(function(err){
          return false;
        })
        ;
        
        return Promise.race([workerPromise, timeoutPromise]).catch(function(exception) {
          return false;
        }).finally(result => {
          clearTimeout();
          return result;
        });
      }
    },
    'Boq': {
        id: 'boq',
        icon: 'icon38',
        url: 'https://github.com/johnmichel/Library-Detector-for-Chrome/pull/143',
        npm: null,
        test: function (win) {
            if (win.WIZ_global_data) {
                return { version: UNKNOWN_VERSION };
            }
            return false;
        }
    },
    'Wiz': {
        id: 'wiz',
        icon: 'icon38',
        url: 'https://github.com/johnmichel/Library-Detector-for-Chrome/pull/147',
        npm: null,
        test: function (win) {
            if (document.__wizdispatcher) {
                return { version: UNKNOWN_VERSION };
            }
            return false;
        }
    },
    'core-js': {
        id: 'corejs',
        icon: 'icon38',
        url: 'https://github.com/zloirock/core-js',
        npm: 'core-js',
        test: function (win) {
            const shared = win['__core-js_shared__'];
            const core = win.core;
            if (shared) {
                const versions = shared.versions;
                return { version: Array.isArray(versions) ? versions.map(it => `core-js-${ it.mode }@${ it.version }`).join('; ') : UNKNOWN_VERSION };
            } else if (core) {
                return { version: core.version || UNKNOWN_VERSION };
            }
            return false;
        }
    },
    'Drupal': {
        id: 'drupal',
        icon: 'drupal',
        url: 'https://www.drupal.org/',
        npm: null,
        test: function (win) {
            const generatorMeta = document.querySelector('meta[name="generator"][content^="Drupal"]');
            const version = generatorMeta ? generatorMeta.getAttribute("content").replace(/\D+/gi,'') : UNKNOWN_VERSION;

            // Detect Drupal resources patterns
            const resDrupal = /\/sites\/(?:default|all)\/(?:themes|modules|files)/;
            const res = Array.from(document.querySelectorAll('link,style,script') || []);

            if (res.some(s => resDrupal.test(s.src)) || res.some(s => resDrupal.test(s.href)) ||
                generatorMeta || (win.Drupal && win.Drupal.behaviors)) {
                return { version };
            }

            return false;
        }
    },
    'TYPO3': {
        id: 'typo3',
        icon: 'typo3',
        url: 'https://typo3.org/',
        npm: null,
        test: function (win) {
            const generatorMeta = document.querySelector('meta[name="generator"][content^="TYPO3"]');

            // TYPO3 resource patterns / paths - search in link, style or script tags
            const resourcesTYPO3 = /\/(typo3conf|typo3temp|fileadmin)/;
            const res = Array.from(document.querySelectorAll('link,style,script') || []);

            if (generatorMeta || res.some(s => resourcesTYPO3.test(s.src)) || res.some(s => resourcesTYPO3.test(s.href))) {
		        // No version exposure available in TYPO3 due to information disclosure
                return { version: UNKNOWN_VERSION };
            }

            return false;
        }
    },
    'Create React App': {
        id: 'create-react-app',
        icon: 'cra',
        url: 'https://create-react-app.dev/',
        npm: 'react-scripts',
        test: function (win) {
            let child = win.document.body.firstElementChild;
            let noscript, root;
            
            do {
                if (child.localName === 'noscript') noscript = child;
                else if (child.id === 'root') root = child;
            } while (child = child.nextElementSibling);
            
            if (root && noscript && /You need to enable JavaScript to run this app/.test(noscript.textContent)) {
                return { version: UNKNOWN_VERSION };
            }

            return false;
        }
    },
    'Guess.js': {
        id: 'guessjs',
        icon: 'guessjs',
        url: 'https://guess-js.github.io/',
        test: function (win) {
            if (win.__GUESS__ && win.__GUESS__.guess) {
                return { version: UNKNOWN_VERSION };
            }
            return false;
        }
    },
    'October CMS': {
        id: 'octobercms',
        icon: 'october',
        url: 'https://octobercms.com/',
        npm: null,
        test: function (win) {
            const generatorMeta1 = document.querySelector('meta[name="generator"][content^="OctoberCMS"]');
            const generatorMeta2 = document.querySelector('meta[name="generator"][content^="October CMS"]');
            
            // October CMS resource patterns / paths - search in link, style or script tags
            const resourcesOctober = /\/modules\/system\/assets\/(css|js)\/framework(\.extras|\.combined)?(-min)?/;
            const res = Array.from(document.querySelectorAll('link,style,script') || []);

            if (generatorMeta1 || generatorMeta2 || res.some(s => resourcesOctober.test(s.src || s.href))) {
                // No version exposure available in October CMS due to information disclosure
                return { version: UNKNOWN_VERSION };
            }

            return false;
        }
    },
    'Joomla': {
        id: 'joomla',
        icon: 'joomla',
        url: 'https://www.joomla.org/',
        npm: null,
        test: function (win) {
            // You can disable the generator tag as well as the version from the backend
            const generatorMeta = document.querySelector('meta[name=generator][content^="Joomla"]');
            // This is the path to the joomla core bootstrap but sites are not required to load that file but could also load a different version
            const hasJoomlaBootstrap = !!document.querySelectorAll('script[src*="/media/jui/js/bootstrap.min.js"]').length;
            
            if (generatorMeta) {
                return { version: generatorMeta.getAttribute("content").replace(/^\w+\s/,'') };
            } else if (win.Joomla || hasJoomlaBootstrap) {
                return { version: UNKNOWN_VERSION };
            }
            
            return false;
        }
    },
    'Sugar': {
        id: 'sugar',
        icon: 'sugar',
        url: 'https://sugarjs.com',
        npm: 'sugar',
        test: function (win) {
            if (win.Sugar) {
                return { version: win.Sugar.VERSION || UNKNOWN_VERSION };
            }

            if (win.Array.SugarMethods) {
                return { version: UNKNOWN_VERSION };
            }

            return false;
        }
    },
    'Bento': {
      id: 'bentojs',
      icon: 'bentojs',
      url: 'https://bentojs.dev',
      npm: 'https://www.npmjs.com/org/bentoproject',
      test: function (win) {
        if (win.BENTO && win.BENTO.push) {
          return { version: UNKNOWN_VERSION };
        }
        return false;
      }
    },
    'WP Rocket':{
        id:'wp-rocket',
        icon:'wp-rocket',
        url: 'https://wp-rocket.me/',
        npm: null,
        test: async function (win) {
            const wpRocketLazyLoad = typeof RocketLazyLoadScripts !== 'undefined'|| typeof RocketPreloadLinksConfig !== 'undefined' ||typeof rocket_lazy !== 'undefined';
            const wpRocketRUCSS = !!document.querySelector('style#wpr-usedcss');
            const wpRocketComment = document.lastChild.nodeType === Node.COMMENT_NODE && document.lastChild.textContent.includes('WP Rocket');

            if ( wpRocketRUCSS || wpRocketLazyLoad || wpRocketComment ) {
                return { version: UNKNOWN_VERSION };
            }
            return false;
        }
    },
    'NitroPack': {
        id: 'nitropack',
        icon: 'nitropack',
        url: 'https://nitropack.io/',
        npm: null,
        test: async function (win) {
            const nitroPackGenerator = !!document.querySelector('meta[name="generator"][content="NitroPack"]');

            if ( nitroPackGenerator ) {
                return { version: UNKNOWN_VERSION };
            }
            return false;
        }
    },
    'Remix': {
      id: 'remix',
      icon: 'remix',
      url: 'https://remix.run/',
      npm: 'remix',
      test: function (win) {
        if (win.__remixContext) {
          return { version: UNKNOWN_VERSION };
        }
        return false;
      }
    }
};
