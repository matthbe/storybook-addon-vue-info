/**
 * MIT License
 *
 * Copyright (c) 2017 Shota Fuji
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import Vue from 'vue';
import addons, { makeDecorator } from '@storybook/addons';
import { paramCase, pascalCase, camelCase } from 'change-case';
import hljs from 'highlight.js';
import marked from 'marked';
import { compile } from 'vue-template-compiler';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var dedent_1 = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports["default"] = dedent;

  function dedent(strings) {
    // $FlowFixMe: Flow doesn't undestand .raw
    var raw = typeof strings === "string" ? [strings] : strings.raw; // first, perform interpolation

    var result = "";

    for (var i = 0; i < raw.length; i++) {
      result += raw[i] // join lines when there is a suppressed newline
      .replace(/\\\n[ \t]*/g, "") // handle escaped backticks
      .replace(/\\`/g, "`");

      if (i < (arguments.length <= 1 ? 0 : arguments.length - 1)) {
        result += arguments.length <= i + 1 ? undefined : arguments[i + 1];
      }
    } // now strip indentation


    var lines = result.split("\n");
    var mindent = null;
    lines.forEach(function (l) {
      var m = l.match(/^(\s+)\S+/);

      if (m) {
        var indent = m[1].length;

        if (!mindent) {
          // this is the first indented line
          mindent = indent;
        } else {
          mindent = Math.min(mindent, indent);
        }
      }
    });

    if (mindent !== null) {
      (function () {
        var m = mindent; // appease Flow

        var whitespaceCharacters = [" ", "\t"]; // [space, tab]

        result = lines.map(function (l) {
          return whitespaceCharacters.includes(l[0]) ? l.slice(m) : l;
        }).join("\n");
      })();
    }

    return result // dedent eats leading and trailing whitespace too
    .trim() // handle escaped newlines at the end to ensure they don't get stripped too
    .replace(/\\n/g, "\n");
  }
});
var dedent = unwrapExports(dedent_1);

var getJSXFromRenderFn = function (render) {
    return render(createJSX);
};
function createJSX(tag, childrenOrData, _children) {
    var data = (childrenOrData instanceof Array ? {} : childrenOrData) || {};
    var children = (childrenOrData instanceof Array ? childrenOrData : _children) || [];
    var tagName = getTagName(tag);
    var props = formatDataObject(data);
    return children.length
        ? "<" + tagName + (props ? ' ' + props : '') + ">" + children.join('') + "</" + tagName + ">"
        : "<" + tagName + (props ? ' ' + props : '') + "/>";
}
var Anonymous = 'Anonymous';
var getTagName = function (tag) {
    if (!tag) {
        return Anonymous;
    }
    else if (typeof tag === 'string') {
        return tag;
    }
    else if (tag.name) {
        var t = tag;
        if (!t.options) {
            return t.name || Anonymous;
        }
        else {
            return t.options.name || Anonymous;
        }
    }
    else {
        return Anonymous;
    }
};
var formatDataObject = function (dataObject) {
    return formatDataObjectItem(dataObject.props).concat(formatDataObjectItem(dataObject.attrs), formatDataObjectItem(dataObject.domProps, 'domProps'), formatDataObjectItem(dataObject.on, 'on'), formatDataObjectItem(dataObject.nativeOn, 'nativeOn'), (dataObject.class ? [formatProp('class', dataObject.class)] : []), (dataObject.style ? [formatProp('style', dataObject.style)] : []), (dataObject.key ? [formatProp('key', dataObject.key)] : []), (dataObject.ref ? [formatProp('ref', dataObject.ref)] : []), (dataObject.slot ? [formatProp('slot', dataObject.slot)] : [])).join(' ');
};
var formatDataObjectItem = function (item, prefix) {
    if (prefix === void 0) { prefix = ''; }
    return item
        ? Object.keys(item).map(function (key) {
            return formatProp(prefix ? prefix + key[0].toUpperCase() + key.slice(1) : key, item[key]);
        })
        : [];
};
var formatProp = function (k, v) {
    return typeof v === 'string'
        ? k + "=\"" + v + "\""
        : typeof v === 'function'
            ? k + "={" + v.toString() + "}"
            : k + "={" + JSON.stringify(v) + "}";
};

var removeDuplicates = (function (arr) {
    return arr.filter(function (e, i) { return arr.indexOf(e) === i; });
});

var fromTemplate = function (template) {
    var ast = compile(dedent(template)).ast;
    if (!ast) {
        return [];
    }
    return removeDuplicates(retrieveTagNamesFromAST(ast));
};
var retrieveTagNamesFromAST = function (el) {
    return Array.from(el.children || []).map(function (e) { return retrieveTagNamesFromAST(e); }).slice().reduce(function (dest, cur) { return dest.concat(cur); }, el.tag ? [el.tag] : []);
};
var fromJSX = function (render) {
    var result = [];
    render(function (tag, dataObject, _children) {
        switch (typeof tag) {
            case 'string':
                result.push(tag);
                return;
            case 'object':
                if (tag.name) {
                    result.push(tag.name);
                    return;
                }
                return;
            case 'function':
                if (tag.options && typeof tag.options.name === 'string') {
                    result.push(tag.options.name);
                    return;
                }
                return;
            default:
                console.warn(tag);
                return;
        }
    }, {});
    return removeDuplicates(result);
};

function lookupGlobalComponent(name) {
    for (var componentName in Vue.options.components) {
        if (paramCase(componentName) === name) {
            var target = Vue.options.components[componentName];
            return {
                name: name,
                component: target
            };
        }
    }
    return null;
}

function decideTargets(story, options) {
    if (options.components) {
        return normalizeComponents(options.components);
    }
    if (story.components) {
        return normalizeComponents(story.components);
    }
    if (!story.template && !story.render) {
        throw new Error('`template` or `render` must be on component options.');
    }
    var tagNames = story.template
        ? fromTemplate(story.template).map(function (s) { return paramCase(s); })
        : fromJSX(story.render);
    var components = tagNames
        .map(function (tagName) { return lookupGlobalComponent(tagName); })
        .filter(function (res) { return !!res; });
    var ret = {};
    for (var _i = 0, components_1 = components; _i < components_1.length; _i++) {
        var _a = components_1[_i], name_1 = _a.name, component = _a.component;
        ret[name_1] = component;
    }
    return normalizeComponents(ret);
}
var normalizeComponents = function (c) {
    var ret = {};
    for (var _i = 0, _a = Object.keys(c); _i < _a.length; _i++) {
        var key = _a[_i];
        ret[key] = c[key].__docgenInfo
            ? c[key]
            : c[key].options || c[key];
    }
    return ret;
};

var normalizeAttrs = function (attrs) {
    return attrs instanceof Array ? attrs : Object.keys(attrs).map(function (key) { return (__assign({ name: key }, attrs[key])); });
};
function extractDocgenInfo(component) {
    var docs = component.__docgenInfo;
    var props = docs.props
        ? normalizeAttrs(docs.props).map(function (prop) {
            return {
                name: prop.name,
                type: prop.type ? prop.type.name : 'any',
                required: !!prop.required,
                default: prop.defaultValue ? prop.defaultValue.value : undefined,
                description: prop.description
            };
        })
        : [];
    var events = docs.events
        ? normalizeAttrs(docs.events).map(function (ev) {
            return {
                name: ev.name,
                type: ev.type ? ev.type.names.join(', ') : 'any',
                description: ev.description
            };
        })
        : [];
    var slots = docs.slots
        ? normalizeAttrs(docs.slots).map(function (slot) {
            return {
                name: slot.name,
                description: slot.description
            };
        })
        : [];
    return { props: props, events: events, slots: slots };
}

var constructorToString = function (constructor) {
    if (constructor instanceof Array) {
        return constructor.map(constructorToString).join(' | ');
    }
    else if (constructor === Number) {
        return 'number';
    }
    else if (constructor === String) {
        return 'string';
    }
    else if (constructor === Object) {
        return 'object';
    }
    else if (constructor === Boolean) {
        return 'boolean';
    }
    else if (constructor === Function) {
        return "function";
    }
    else if (constructor === Symbol) {
        return 'Symbol';
    }
    else if (constructor === Array) {
        return 'array';
    }
    else {
        return constructor.name || 'unknown';
    }
};

function getProps(component) {
    if (component instanceof Promise ||
        ('component' in component && component.component instanceof Promise)) {
        console.warn('[storybook-addon-vue-info] Cannot enumerate props for async component');
        return [];
    }
    if (!('props' in component)) {
        return [];
    }
    var props = component.props;
    if (!props) {
        return [];
    }
    return Object.keys(props).map(function (name) {
        var propDef = props[name];
        if (typeof propDef === 'function') {
            return {
                name: name,
                type: constructorToString(propDef),
                required: false,
                default: undefined
            };
        }
        var default$;
        if (propDef.type === Function && propDef.default) {
            default$ = propDef.default.toString();
        }
        else if (typeof propDef.default === 'function') {
            try {
                default$ = JSON.stringify(propDef.default.apply(component));
            }
            catch (e) {
                console.error(e);
                console.warn("[storybook-addon-vue-info] Failed to get default value for " + name);
                default$ = 'Failed to get default value';
            }
        }
        else {
            default$ =
                typeof propDef === 'object' && 'default' in propDef
                    ? JSON.stringify(propDef.default)
                    : '';
        }
        return {
            name: name,
            type: propDef.type ? constructorToString(propDef.type) : 'any',
            required: propDef.required,
            default: default$
        };
    });
}

function extract(story, kindName, storyName, options) {
    var targets = decideTargets(story, options);
    var descriptions = getDescriptionsFromStory(story) || formatPropsDescription(story);
    var components = Object.keys(targets).map(function (name) {
        var component = targets[name];
        var kebabName = paramCase(name);
        var propDescriptions = (descriptions[kebabName] && descriptions[kebabName].props) || {};
        var eventDescriptions = (descriptions[kebabName] && descriptions[kebabName].events) || {};
        var slotDescriptions = (descriptions[kebabName] && descriptions[kebabName].slots) || {};
        if (options.useDocgen && '__docgenInfo' in component) {
            var partial = extractDocgenInfo(component);
            var hydrateStoryDescription = function (defs, description) {
                return defs.map(function (def) {
                    if (def.name in description) {
                        return __assign({}, def, { description: description[def.name] });
                    }
                    return def;
                });
            };
            return __assign({ name: name }, partial, { props: partial.props &&
                    hydrateStoryDescription(partial.props, propDescriptions), events: partial.events &&
                    hydrateStoryDescription(partial.events, eventDescriptions), slots: partial.slots &&
                    hydrateStoryDescription(partial.slots, slotDescriptions) });
        }
        var props = getProps(component).map(function (prop) {
            if (prop.name in propDescriptions) {
                return __assign({}, prop, { description: propDescriptions[prop.name] });
            }
            return prop;
        });
        var events = Object.keys(eventDescriptions).map(function (eventName) {
            return {
                name: eventName,
                description: eventDescriptions[eventName]
            };
        });
        var slots = Object.keys(slotDescriptions).map(function (slotName) {
            return {
                name: slotName,
                description: slotDescriptions[slotName]
            };
        });
        return { name: name, props: props, events: events, slots: slots };
    });
    var renderer = new marked.Renderer();
    renderer.code = function (code, lang) {
        return "<pre><code class=\"hljs\">" + hljs.highlightAuto(code, lang ? [lang] : undefined).value + "</code></pre>";
    };
    marked.setOptions({ renderer: renderer });
    return {
        title: kindName,
        subtitle: storyName,
        summary: marked(dedent(options.summary)),
        storySource: dedent(story.template || getJSXFromRenderFn(story.render)),
        jsxStory: !!story.render,
        components: components
    };
}
var getDescriptionsFromStory = function (story) {
    if (!story.description) {
        return null;
    }
    var ret = {};
    for (var _i = 0, _a = Object.keys(story.description); _i < _a.length; _i++) {
        var component = _a[_i];
        ret[paramCase(component)] = story.description[component];
    }
    return ret;
};
var formatPropsDescription = function (story) {
    if (!story.propsDescription) {
        return {};
    }
    console.warn('[storybook-addon-vue-info] `propsDescription` is deprecated. Please consider switching to `description.props`');
    var components = {};
    for (var _i = 0, _a = Object.keys(story.propsDescription); _i < _a.length; _i++) {
        var component = _a[_i];
        components[paramCase(component)] = {
            props: story.propsDescription[component]
        };
    }
    return components;
};

var script = {
  props: {
    label: {
      type: String,
      "default": null
    }
  }
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
/* server only */
, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  if (typeof shadowMode !== 'boolean') {
    createInjectorSSR = createInjector;
    createInjector = shadowMode;
    shadowMode = false;
  } // Vue.extend constructor export interop.


  var options = typeof script === 'function' ? script.options : script; // render functions

  if (template && template.render) {
    options.render = template.render;
    options.staticRenderFns = template.staticRenderFns;
    options._compiled = true; // functional template

    if (isFunctionalTemplate) {
      options.functional = true;
    }
  } // scopedId


  if (scopeId) {
    options._scopeId = scopeId;
  }

  var hook;

  if (moduleIdentifier) {
    // server build
    hook = function hook(context) {
      // 2.3 injection
      context = context || // cached call
      this.$vnode && this.$vnode.ssrContext || // stateful
      this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
      // 2.2 with runInNewContext: true

      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__;
      } // inject component styles


      if (style) {
        style.call(this, createInjectorSSR(context));
      } // register component module identifier for async chunk inference


      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier);
      }
    }; // used by ssr in case component is cached and beforeCreate
    // never gets called


    options._ssrRegister = hook;
  } else if (style) {
    hook = shadowMode ? function () {
      style.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
    } : function (context) {
      style.call(this, createInjector(context));
    };
  }

  if (hook) {
    if (options.functional) {
      // register for functional component in vue file
      var originalRender = options.render;

      options.render = function renderWithStyleInjection(h, context) {
        hook.call(context);
        return originalRender(h, context);
      };
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate;
      options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
    }
  }

  return script;
}

var normalizeComponent_1 = normalizeComponent;

var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

function createInjector(context) {
  return function (id, style) {
    return addStyle(id, style);
  };
}

var HEAD = document.head || document.getElementsByTagName('head')[0];
var styles = {};

function addStyle(id, css) {
  var group = isOldIE ? css.media || 'default' : id;
  var style = styles[group] || (styles[group] = {
    ids: new Set(),
    styles: []
  });

  if (!style.ids.has(id)) {
    style.ids.add(id);
    var code = css.source;

    if (css.map) {
      // https://developer.chrome.com/devtools/docs/javascript-debugging
      // this makes source maps inside style tags work properly in Chrome
      code += '\n/*# sourceURL=' + css.map.sources[0] + ' */'; // http://stackoverflow.com/a/26603875

      code += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) + ' */';
    }

    if (!style.element) {
      style.element = document.createElement('style');
      style.element.type = 'text/css';
      if (css.media) style.element.setAttribute('media', css.media);
      HEAD.appendChild(style.element);
    }

    if ('styleSheet' in style.element) {
      style.styles.push(code);
      style.element.styleSheet.cssText = style.styles.filter(Boolean).join('\n');
    } else {
      var index = style.ids.size - 1;
      var textNode = document.createTextNode(code);
      var nodes = style.element.childNodes;
      if (nodes[index]) style.element.removeChild(nodes[index]);
      if (nodes.length) style.element.insertBefore(textNode, nodes[index]);else style.element.appendChild(textNode);
    }
  }
}

var browser = createInjector;

/* script */
const __vue_script__ = script;

/* template */
var __vue_render__ = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { class: _vm.$style.container }, [
    _vm.label
      ? _c("label", { class: _vm.$style.label }, [_vm._v(_vm._s(_vm.label))])
      : _vm._e(),
    _vm._v(" "),
    _c("div", { class: _vm.$style.contents }, [
      _c("table", { class: _vm.$style.table }, [_vm._t("default")], 2)
    ])
  ])
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

  /* style */
  const __vue_inject_styles__ = function (inject) {
    if (!inject) return
    inject("data-v-40da0f38_0", { source: ".src-components-Table-container-3ImG {\n  display: flex;\n  flex-direction: column;\n  overflow: hidden;\n}\n.src-components-Table-label-3GH2 {\n  font-size: 12px;\n\n  margin-left: 1px;\n  margin-bottom: 8px;\n}\n.src-components-Table-contents-2Hzm {\n  overflow: auto;\n  border: 1px solid #333;\n  border-radius: 4px;\n}\n.src-components-Table-table-3VHw {\n  position: relative;\n  font-size: 12px;\n  width: 100%;\n  border-spacing: 0;\n}\n.src-components-Table-table-3VHw thead {\n  color: #fff;\n  background-color: #333;\n  text-transform: uppercase;\n  text-align: left;\n}\n.src-components-Table-table-3VHw tbody tr {\n  position: relative;\n}\n.src-components-Table-table-3VHw tbody tr:not(:first-child)::after {\n  content: '';\n  position: absolute;\n  display: block;\n  left: 8px;\n  right: 8px;\n\n  border-bottom: 1px solid #333;\n}\n.src-components-Table-table-3VHw tbody tr:first-child > td {\n  padding-top: 16px;\n}\n.src-components-Table-table-3VHw tbody tr:last-child > td {\n  padding-bottom: 16px;\n}\n.src-components-Table-table-3VHw td:last-child {\n  width: 100%;\n\n  white-space: initial;\n}\n.src-components-Table-table-3VHw th {\n  padding: 8px;\n}\n.src-components-Table-table-3VHw th:first-child,\n.src-components-Table-table-3VHw td:first-child {\n  padding-left: 16px;\n  padding-right: 56px;\n}\n.src-components-Table-table-3VHw td {\n  padding: 8px;\n  padding-right: 48px;\n\n  white-space: nowrap;\n}\n", map: undefined, media: undefined });
Object.defineProperty(this, "$style", { value: {"container":"src-components-Table-container-3ImG","label":"src-components-Table-label-3GH2","contents":"src-components-Table-contents-2Hzm","table":"src-components-Table-table-3VHw"} });

  };
  /* scoped */
  const __vue_scope_id__ = undefined;
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
  /* style inject SSR */
  

  
  var XTable = normalizeComponent_1(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    browser,
    undefined
  );

var script$1 = {
  components: {
    XTable: XTable
  },
  props: {
    /**
     * type: ComponentInfo
     * See types/Info.ts
     */
    component: {
      type: Object,
      required: true
    },

    /**
     * Case conversion
     * See components/Wrapper/index.vue
     */
    casing: {
      type: Object,
      required: true
    }
  },
  computed: {
    title: function title() {
      return "# <".concat(this.normalizeCase(this.component.name, 'component'), "/>");
    }
  },
  methods: {
    normalizeCase: function normalizeCase(name, attr) {
      switch (this.casing[attr]) {
        case void 0:
          return name;

        case 'kebab':
        case 'kebab-case':
          return paramCase(name);

        case 'camel':
        case 'camelCase':
        case 'pascalCase':
        case 'PascalCase':
          return attr === 'component' ? pascalCase(name) : camelCase(name);
      }
    }
  }
};

/* script */
const __vue_script__$1 = script$1;

/* template */
var __vue_render__$1 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    { class: _vm.$style.container },
    [
      _c("h2", { class: _vm.$style.title }, [_vm._v(_vm._s(_vm.title))]),
      _vm._v(" "),
      _vm.component.props.length
        ? _c("x-table", { attrs: { label: "Props" } }, [
            _c("thead", [
              _c("tr", [
                _c("th", [_vm._v("Name")]),
                _vm._v(" "),
                _c("th", [_vm._v("Type")]),
                _vm._v(" "),
                _c("th", [_vm._v("Default")]),
                _vm._v(" "),
                _c("th", [_vm._v("Description")])
              ])
            ]),
            _vm._v(" "),
            _c(
              "tbody",
              _vm._l(_vm.component.props, function(prop) {
                return _c("tr", { key: prop.name }, [
                  _c("td", [
                    _vm._v(
                      "\n          " +
                        _vm._s(_vm.normalizeCase(prop.name, "props")) +
                        "\n          "
                    ),
                    prop.required
                      ? _c("sup", { class: _vm.$style.required }, [_vm._v("*")])
                      : _vm._e()
                  ]),
                  _vm._v(" "),
                  _c("td", [_vm._v(_vm._s(prop.type))]),
                  _vm._v(" "),
                  _c("td", [_vm._v(_vm._s(prop.default))]),
                  _vm._v(" "),
                  _c("td", [_vm._v(_vm._s(prop.description))])
                ])
              }),
              0
            )
          ])
        : _vm._e(),
      _vm._v(" "),
      _vm.component.events.length
        ? _c("x-table", { attrs: { label: "Events" } }, [
            _c("thead", [
              _c("tr", [
                _c("th", [_vm._v("Name")]),
                _vm._v(" "),
                _c("th", [_vm._v("Type")]),
                _vm._v(" "),
                _c("th", [_vm._v("Description")])
              ])
            ]),
            _vm._v(" "),
            _c(
              "tbody",
              _vm._l(_vm.component.events, function(event) {
                return _c("tr", { key: event.name }, [
                  _c("td", [_vm._v(_vm._s(event.name))]),
                  _vm._v(" "),
                  _c("td", [_vm._v(_vm._s(event.type))]),
                  _vm._v(" "),
                  _c("td", [_vm._v(_vm._s(event.description))])
                ])
              }),
              0
            )
          ])
        : _vm._e(),
      _vm._v(" "),
      _vm.component.slots.length
        ? _c("x-table", { attrs: { label: "Slots" } }, [
            _c("thead", [
              _c("tr", [
                _c("th", [_vm._v("Name")]),
                _vm._v(" "),
                _c("th", [_vm._v("Description")])
              ])
            ]),
            _vm._v(" "),
            _c(
              "tbody",
              _vm._l(_vm.component.slots, function(slot) {
                return _c("tr", { key: slot.name }, [
                  _c("td", [_vm._v(_vm._s(slot.name))]),
                  _vm._v(" "),
                  _c("td", [_vm._v(_vm._s(slot.description))])
                ])
              }),
              0
            )
          ])
        : _vm._e()
    ],
    1
  )
};
var __vue_staticRenderFns__$1 = [];
__vue_render__$1._withStripped = true;

  /* style */
  const __vue_inject_styles__$1 = function (inject) {
    if (!inject) return
    inject("data-v-771a2461_0", { source: ".src-components-Component-container-1CeL {\n  font-family: Roboto, sans-serif;\n}\n.src-components-Component-container-1CeL > :not(:first-child) {\n  margin-top: 24px;\n}\n.src-components-Component-title-2XL9 {\n  font-size: 24px;\n  margin: 0;\n\n  color: #333;\n  font-weight: 400;\n}\n.src-components-Component-required-37Qh {\n  color: #a01a1a;\n}\n", map: undefined, media: undefined });
Object.defineProperty(this, "$style", { value: {"container":"src-components-Component-container-1CeL","title":"src-components-Component-title-2XL9","required":"src-components-Component-required-37Qh"} });

  };
  /* scoped */
  const __vue_scope_id__$1 = undefined;
  /* module identifier */
  const __vue_module_identifier__$1 = undefined;
  /* functional template */
  const __vue_is_functional_template__$1 = false;
  /* style inject SSR */
  

  
  var XComponent = normalizeComponent_1(
    { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
    __vue_inject_styles__$1,
    __vue_script__$1,
    __vue_scope_id__$1,
    __vue_is_functional_template__$1,
    __vue_module_identifier__$1,
    browser,
    undefined
  );

var script$2 = {
  mounted: function mounted() {
    var link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', 'https://fonts.googleapis.com/css?family=Roboto+Mono|Roboto:400,500,700');
    link.dataset.saviHead = 'true';
    document.head.appendChild(link);
  },
  destroyed: function destroyed() {
    var link = document.querySelector('head > [data-savi-head]');

    if (!link) {
      return;
    }

    document.head.removeChild(link);
  }
};

/* script */
const __vue_script__$2 = script$2;

/* template */
var __vue_render__$2 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { class: _vm.$style.container }, [_vm._t("default")], 2)
};
var __vue_staticRenderFns__$2 = [];
__vue_render__$2._withStripped = true;

  /* style */
  const __vue_inject_styles__$2 = function (inject) {
    if (!inject) return
    inject("data-v-1dca7860_0", { source: ".src-components-Docs-container-1Ukn {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  padding: 40px;\n\n  overflow: auto;\n}\n.src-components-Docs-container-1Ukn > :not(:first-child) {\n  margin-top: 40px;\n}\n", map: undefined, media: undefined });
Object.defineProperty(this, "$style", { value: {"container":"src-components-Docs-container-1Ukn"} });

  };
  /* scoped */
  const __vue_scope_id__$2 = undefined;
  /* module identifier */
  const __vue_module_identifier__$2 = undefined;
  /* functional template */
  const __vue_is_functional_template__$2 = false;
  /* style inject SSR */
  

  
  var XDocs = normalizeComponent_1(
    { render: __vue_render__$2, staticRenderFns: __vue_staticRenderFns__$2 },
    __vue_inject_styles__$2,
    __vue_script__$2,
    __vue_scope_id__$2,
    __vue_is_functional_template__$2,
    __vue_module_identifier__$2,
    browser,
    undefined
  );

var script$3 = {
  props: {
    title: {
      type: String,
      "default": ''
    },
    subtitle: {
      type: String,
      "default": ''
    }
  }
};

/* script */
const __vue_script__$3 = script$3;

/* template */
var __vue_render__$3 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { class: _vm.$style.container }, [
    _c("h1", { class: _vm.$style.title }, [_vm._v(_vm._s(_vm.title))]),
    _vm._v(" "),
    _c("h2", { class: _vm.$style.subtitle }, [_vm._v(_vm._s(_vm.subtitle))])
  ])
};
var __vue_staticRenderFns__$3 = [];
__vue_render__$3._withStripped = true;

  /* style */
  const __vue_inject_styles__$3 = function (inject) {
    if (!inject) return
    inject("data-v-c2952910_0", { source: ".src-components-Header-container-1Kak {\n  color: #333;\n  font-family: Roboto, sans-serif;\n}\n.src-components-Header-title-1opt,\n.src-components-Header-subtitle-v58S {\n  margin: 0;\n}\n.src-components-Header-title-1opt {\n  font-size: 24px;\n\n  font-weight: 500;\n}\n.src-components-Header-subtitle-v58S {\n  font-size: 18px;\n  margin-top: 8px;\n\n  font-weight: 400;\n}\n", map: undefined, media: undefined });
Object.defineProperty(this, "$style", { value: {"container":"src-components-Header-container-1Kak","title":"src-components-Header-title-1opt","subtitle":"src-components-Header-subtitle-v58S"} });

  };
  /* scoped */
  const __vue_scope_id__$3 = undefined;
  /* module identifier */
  const __vue_module_identifier__$3 = undefined;
  /* functional template */
  const __vue_is_functional_template__$3 = false;
  /* style inject SSR */
  

  
  var XHeader = normalizeComponent_1(
    { render: __vue_render__$3, staticRenderFns: __vue_staticRenderFns__$3 },
    __vue_inject_styles__$3,
    __vue_script__$3,
    __vue_scope_id__$3,
    __vue_is_functional_template__$3,
    __vue_module_identifier__$3,
    browser,
    undefined
  );

var script$4 = {
  props: {
    label: {
      type: String,
      required: true
    }
  }
};

/* script */
const __vue_script__$4 = script$4;

/* template */
var __vue_render__$4 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { class: _vm.$style.container }, [
    _c("label", { class: _vm.$style.label }, [_vm._v(_vm._s(_vm.label))]),
    _vm._v(" "),
    _c("div", { class: _vm.$style.contents }, [_vm._t("default")], 2)
  ])
};
var __vue_staticRenderFns__$4 = [];
__vue_render__$4._withStripped = true;

  /* style */
  const __vue_inject_styles__$4 = function (inject) {
    if (!inject) return
    inject("data-v-284d322b_0", { source: ".src-components-SectionContainer-container-1UVl {\n  display: flex;\n  flex-direction: column;\n}\n.src-components-SectionContainer-label-32Bo {\n  width: 112px;\n  font-size: 12px;\n  line-height: 15px;\n  padding: 4px 0;\n\n  color: #fff;\n  background-color: #333;\n  border-radius: 4px 4px 0 0;\n  font-family: Roboto, sans-serif;\n  text-transform: uppercase;\n  text-align: center;\n}\n.src-components-SectionContainer-contents-3s6X {\n  padding: 8px;\n\n  border: 1px solid #333;\n  border-radius: 0 4px 4px 4px;\n  overflow: hidden;\n}\n", map: undefined, media: undefined });
Object.defineProperty(this, "$style", { value: {"container":"src-components-SectionContainer-container-1UVl","label":"src-components-SectionContainer-label-32Bo","contents":"src-components-SectionContainer-contents-3s6X"} });

  };
  /* scoped */
  const __vue_scope_id__$4 = undefined;
  /* module identifier */
  const __vue_module_identifier__$4 = undefined;
  /* functional template */
  const __vue_is_functional_template__$4 = false;
  /* style inject SSR */
  

  
  var XSectionContainer = normalizeComponent_1(
    { render: __vue_render__$4, staticRenderFns: __vue_staticRenderFns__$4 },
    __vue_inject_styles__$4,
    __vue_script__$4,
    __vue_scope_id__$4,
    __vue_is_functional_template__$4,
    __vue_module_identifier__$4,
    browser,
    undefined
  );

var script$5 = {
  components: {
    XSectionContainer: XSectionContainer
  },
  props: {
    customClassName: {
      type: String,
      required: false,
      "default": undefined
    },
    customStyle: {
      type: Object,
      required: false,
      "default": undefined
    }
  }
};

/* script */
const __vue_script__$5 = script$5;

/* template */
var __vue_render__$5 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("x-section-container", { attrs: { label: "Preview" } }, [
    _c(
      "div",
      {
        class: [_vm.$style.preview, _vm.customClassName],
        style: _vm.customStyle
      },
      [_vm._t("default")],
      2
    )
  ])
};
var __vue_staticRenderFns__$5 = [];
__vue_render__$5._withStripped = true;

  /* style */
  const __vue_inject_styles__$5 = function (inject) {
    if (!inject) return
    inject("data-v-b09dd7e2_0", { source: ".src-components-Preview-preview-30u8 {\n  position: relative;\n  display: block;\n}\n", map: undefined, media: undefined });
Object.defineProperty(this, "$style", { value: {"preview":"src-components-Preview-preview-30u8"} });

  };
  /* scoped */
  const __vue_scope_id__$5 = undefined;
  /* module identifier */
  const __vue_module_identifier__$5 = undefined;
  /* functional template */
  const __vue_is_functional_template__$5 = false;
  /* style inject SSR */
  

  
  var XPreview = normalizeComponent_1(
    { render: __vue_render__$5, staticRenderFns: __vue_staticRenderFns__$5 },
    __vue_inject_styles__$5,
    __vue_script__$5,
    __vue_scope_id__$5,
    __vue_is_functional_template__$5,
    __vue_module_identifier__$5,
    browser,
    undefined
  );

/* script */

/* template */
var __vue_render__$6 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("hr", { class: _vm.$style.separator })
};
var __vue_staticRenderFns__$6 = [];
__vue_render__$6._withStripped = true;

  /* style */
  const __vue_inject_styles__$6 = function (inject) {
    if (!inject) return
    inject("data-v-974bce32_0", { source: ".src-components-Separator-separator-1eBy {\n  border: 0;\n  border-bottom: 1px solid #333;\n}\n", map: undefined, media: undefined });
Object.defineProperty(this, "$style", { value: {"separator":"src-components-Separator-separator-1eBy"} });

  };
  /* scoped */
  const __vue_scope_id__$6 = undefined;
  /* module identifier */
  const __vue_module_identifier__$6 = undefined;
  /* functional template */
  const __vue_is_functional_template__$6 = false;
  /* style inject SSR */
  

  
  var XSeparator = normalizeComponent_1(
    { render: __vue_render__$6, staticRenderFns: __vue_staticRenderFns__$6 },
    __vue_inject_styles__$6,
    {},
    __vue_scope_id__$6,
    __vue_is_functional_template__$6,
    __vue_module_identifier__$6,
    browser,
    undefined
  );

var script$6 = {
  components: {
    XSectionContainer: XSectionContainer
  },
  props: {
    source: {
      type: String,
      "default": ''
    },
    lang: {
      type: String,
      "default": 'html'
    }
  },
  computed: {
    sourceCode: function sourceCode() {
      return this.lang === 'jsx' ? ";".concat(this.source) : this.source;
    }
  },
  watch: {
    source: function source() {
      this.highlight();
    }
  },
  mounted: function mounted() {
    this.highlight();
  },
  methods: {
    highlight: function highlight() {
      if (!this.$refs.code) {
        return;
      }

      hljs.highlightBlock(this.$refs.code, {
        languages: [this.lang]
      });
    }
  }
};

/* script */
const __vue_script__$6 = script$6;

/* template */
var __vue_render__$7 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("x-section-container", { attrs: { label: "Story source" } }, [
    _c("pre", { ref: "code", class: [_vm.lang, _vm.$style.codeBlock] }, [
      _c("code", [_vm._v(_vm._s(_vm.sourceCode))])
    ])
  ])
};
var __vue_staticRenderFns__$7 = [];
__vue_render__$7._withStripped = true;

  /* style */
  const __vue_inject_styles__$7 = function (inject) {
    if (!inject) return
    inject("data-v-e04a8d6a_0", { source: ".src-components-StorySource-codeBlock-2XbE.src-components-StorySource-codeBlock-2XbE {\n  margin: -8px;\n  padding: 16px;\n\n  overflow: auto;\n  background-color: #eee;\n}\n.src-components-StorySource-codeBlock-2XbE.src-components-StorySource-codeBlock-2XbE > code {\n  font-size: 12px;\n\n  font-family: 'Roboto Mono', monospace;\n}\n", map: undefined, media: undefined });
Object.defineProperty(this, "$style", { value: {"codeBlock":"src-components-StorySource-codeBlock-2XbE"} });

  };
  /* scoped */
  const __vue_scope_id__$7 = undefined;
  /* module identifier */
  const __vue_module_identifier__$7 = undefined;
  /* functional template */
  const __vue_is_functional_template__$7 = false;
  /* style inject SSR */
  

  
  var XStorySource = normalizeComponent_1(
    { render: __vue_render__$7, staticRenderFns: __vue_staticRenderFns__$7 },
    __vue_inject_styles__$7,
    __vue_script__$6,
    __vue_scope_id__$7,
    __vue_is_functional_template__$7,
    __vue_module_identifier__$7,
    browser,
    undefined
  );

var script$7 = {
  props: {
    markdown: {
      type: String,
      "default": ''
    },
    html: {
      type: String,
      "default": ''
    }
  },
  computed: {
    markdownHtml: function markdownHtml() {
      if (!this.markdown) {
        return '';
      }

      var renderer = new marked.Renderer();

      renderer.code = function (code, lang) {
        return "<pre><code class=\"hljs\">".concat(hljs.highlightAuto(code, lang ? [lang] : undefined).value, "</code></pre>");
      };

      marked.setOptions({
        renderer: renderer
      });
      return marked(this.markdown);
    }
  }
};

/* script */
const __vue_script__$7 = script$7;

/* template */
var __vue_render__$8 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _vm.html
    ? _c("section", {
        class: _vm.$style.container,
        domProps: { innerHTML: _vm._s(_vm.html) }
      })
    : _c("section", {
        class: _vm.$style.container,
        domProps: { innerHTML: _vm._s(_vm.markdownHtml) }
      })
};
var __vue_staticRenderFns__$8 = [];
__vue_render__$8._withStripped = true;

  /* style */
  const __vue_inject_styles__$8 = function (inject) {
    if (!inject) return
    inject("data-v-2bd3a1e0_0", { source: ".src-components-Summary-container-2crO {\n  font-family: Roboto, sans-serif;\n}\n.src-components-Summary-container-2crO h1 {\n  font-size: 24px;\n}\n.src-components-Summary-container-2crO h2 {\n  font-size: 22px;\n}\n.src-components-Summary-container-2crO h3 {\n  font-size: 20px;\n}\n.src-components-Summary-container-2crO h4 {\n  font-size: 18px;\n}\n.src-components-Summary-container-2crO h5 {\n  font-size: 16px;\n}\n.src-components-Summary-container-2crO h6 {\n  font-size: 14px;\n}\n.src-components-Summary-container-2crO p {\n  font-size: 14px;\n  margin: 16px 0;\n\n  color: #333;\n}\n.src-components-Summary-container-2crO a {\n  color: #0d7ccd;\n}\n.src-components-Summary-container-2crO.src-components-Summary-container-2crO pre,\n.src-components-Summary-container-2crO.src-components-Summary-container-2crO code {\n  font-size: 12px;\n  padding: 4px 8px;\n\n  font-family: 'Roboto Mono', monospace;\n  background-color: #eee;\n  border-radius: 4px;\n}\n.src-components-Summary-container-2crO.src-components-Summary-container-2crO pre {\n  display: block;\n  padding: 16px;\n  margin: 16px 0;\n}\n.src-components-Summary-container-2crO.src-components-Summary-container-2crO pre > code {\n  padding: 0;\n  background-color: transparent;\n  border-radius: 0;\n}\n", map: undefined, media: undefined });
Object.defineProperty(this, "$style", { value: {"container":"src-components-Summary-container-2crO"} });

  };
  /* scoped */
  const __vue_scope_id__$8 = undefined;
  /* module identifier */
  const __vue_module_identifier__$8 = undefined;
  /* functional template */
  const __vue_is_functional_template__$8 = false;
  /* style inject SSR */
  

  
  var XSummary = normalizeComponent_1(
    { render: __vue_render__$8, staticRenderFns: __vue_staticRenderFns__$8 },
    __vue_inject_styles__$8,
    __vue_script__$7,
    __vue_scope_id__$8,
    __vue_is_functional_template__$8,
    __vue_module_identifier__$8,
    browser,
    undefined
  );

var script$8 = {
  components: {
    XComponent: XComponent,
    XDocs: XDocs,
    XHeader: XHeader,
    XPreview: XPreview,
    XSeparator: XSeparator,
    XStorySource: XStorySource,
    XSummary: XSummary
  },
  props: {
    info: {
      type: Object,
      required: true
    },
    options: {
      type: Object,
      required: true
    }
  },
  computed: {
    casing: function casing() {
      return {
        component: typeof this.options.casing === 'string' || !this.options.casing ? this.options.casing : this.options.casing.component,
        props: typeof this.options.casing === 'string' || !this.options.casing ? this.options.casing : this.options.casing.props
      };
    }
  }
};

/* script */
const __vue_script__$8 = script$8;

/* template */
var __vue_render__$9 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "x-docs",
    { staticClass: "storybook-addon-vue-info" },
    [
      _vm.options.header
        ? _c("x-header", {
            attrs: { title: _vm.info.title, subtitle: _vm.info.subtitle }
          })
        : _vm._e(),
      _vm._v(" "),
      !_vm.options.docsInPanel
        ? _c(
            "x-preview",
            {
              attrs: {
                "custom-class-name": _vm.options.previewClassName,
                "custom-style": _vm.options.previewStyle
              }
            },
            [_vm._t("default")],
            2
          )
        : _vm._e(),
      _vm._v(" "),
      _c("x-summary", { attrs: { markdown: _vm.info.summary } }),
      _vm._v(" "),
      _vm.options.source
        ? _c("x-story-source", {
            attrs: {
              source: _vm.info.storySource,
              lang: _vm.info.jsxStory ? "jsx" : "html"
            }
          })
        : _vm._e(),
      _vm._v(" "),
      _c("x-separator"),
      _vm._v(" "),
      _vm._l(_vm.info.components, function(c) {
        return _c("x-component", {
          key: c.name,
          attrs: { component: c, casing: _vm.casing }
        })
      })
    ],
    2
  )
};
var __vue_staticRenderFns__$9 = [];
__vue_render__$9._withStripped = true;

  /* style */
  const __vue_inject_styles__$9 = function (inject) {
    if (!inject) return
    inject("data-v-1978d566_0", { source: ".storybook-addon-vue-info {\n  /*\n\ngithub.com style (c) Vasily Polovnyov <vast@whiteants.net>\n\n*/\n}\n.storybook-addon-vue-info .hljs {\n  display: block;\n  overflow-x: auto;\n  padding: 0.5em;\n  color: #333;\n  background: #f8f8f8;\n}\n.storybook-addon-vue-info .hljs-comment,\n.storybook-addon-vue-info .hljs-quote {\n  color: #998;\n  font-style: italic;\n}\n.storybook-addon-vue-info .hljs-keyword,\n.storybook-addon-vue-info .hljs-selector-tag,\n.storybook-addon-vue-info .hljs-subst {\n  color: #333;\n  font-weight: bold;\n}\n.storybook-addon-vue-info .hljs-number,\n.storybook-addon-vue-info .hljs-literal,\n.storybook-addon-vue-info .hljs-variable,\n.storybook-addon-vue-info .hljs-template-variable,\n.storybook-addon-vue-info .hljs-tag .hljs-attr {\n  color: #008080;\n}\n.storybook-addon-vue-info .hljs-string,\n.storybook-addon-vue-info .hljs-doctag {\n  color: #d14;\n}\n.storybook-addon-vue-info .hljs-title,\n.storybook-addon-vue-info .hljs-section,\n.storybook-addon-vue-info .hljs-selector-id {\n  color: #900;\n  font-weight: bold;\n}\n.storybook-addon-vue-info .hljs-subst {\n  font-weight: normal;\n}\n.storybook-addon-vue-info .hljs-type,\n.storybook-addon-vue-info .hljs-class .hljs-title {\n  color: #458;\n  font-weight: bold;\n}\n.storybook-addon-vue-info .hljs-tag,\n.storybook-addon-vue-info .hljs-name,\n.storybook-addon-vue-info .hljs-attribute {\n  color: #000080;\n  font-weight: normal;\n}\n.storybook-addon-vue-info .hljs-regexp,\n.storybook-addon-vue-info .hljs-link {\n  color: #009926;\n}\n.storybook-addon-vue-info .hljs-symbol,\n.storybook-addon-vue-info .hljs-bullet {\n  color: #990073;\n}\n.storybook-addon-vue-info .hljs-built_in,\n.storybook-addon-vue-info .hljs-builtin-name {\n  color: #0086b3;\n}\n.storybook-addon-vue-info .hljs-meta {\n  color: #999;\n  font-weight: bold;\n}\n.storybook-addon-vue-info .hljs-deletion {\n  background: #fdd;\n}\n.storybook-addon-vue-info .hljs-addition {\n  background: #dfd;\n}\n.storybook-addon-vue-info .hljs-emphasis {\n  font-style: italic;\n}\n.storybook-addon-vue-info .hljs-strong {\n  font-weight: bold;\n}\n", map: {"version":3,"sources":["index.vue","/Users/matth/Coding/storybook-addon-vue-info/src/components/Wrapper/index.vue"],"names":[],"mappings":"AAAA;EACE;;;;CAID;AACD;AACA;EACE,cAAc;EACd,gBAAgB;EAChB,cAAc;EACd,WAAW;EACX,mBAAmB;AACrB;AACA;;EAEE,WAAW;EACX,kBAAkB;AACpB;AACA;;;EAGE,WAAW;EACX,iBAAiB;AACnB;AACA;;;;;EAKE,cAAc;AAChB;AACA;;EAEE,WAAW;AACb;AACA;;;EAGE,WAAW;EACX,iBAAiB;AACnB;AACA;EACE,mBAAmB;AACrB;AACA;;EAEE,WAAW;EACX,iBAAiB;AACnB;AACA;;;EAGE,cAAc;EACd,mBAAmB;AACrB;AACA;;EAEE,cAAc;AAChB;AACA;;EAEE,cAAc;AAChB;AACA;;EAEE,cAAc;AAChB;AACA;EACE,WAAW;EACX,iBAAiB;AACnB;AACA;EACE,gBAAgB;AAClB;AACA;EACE,gBAAgB;ACClB;AACA;EACA,kBAAA;ADCA;AACA;EACE,iBAAiB;AACnB","file":"index.vue","sourcesContent":[".storybook-addon-vue-info {\n  /*\n\ngithub.com style (c) Vasily Polovnyov <vast@whiteants.net>\n\n*/\n}\n.storybook-addon-vue-info .hljs {\n  display: block;\n  overflow-x: auto;\n  padding: 0.5em;\n  color: #333;\n  background: #f8f8f8;\n}\n.storybook-addon-vue-info .hljs-comment,\n.storybook-addon-vue-info .hljs-quote {\n  color: #998;\n  font-style: italic;\n}\n.storybook-addon-vue-info .hljs-keyword,\n.storybook-addon-vue-info .hljs-selector-tag,\n.storybook-addon-vue-info .hljs-subst {\n  color: #333;\n  font-weight: bold;\n}\n.storybook-addon-vue-info .hljs-number,\n.storybook-addon-vue-info .hljs-literal,\n.storybook-addon-vue-info .hljs-variable,\n.storybook-addon-vue-info .hljs-template-variable,\n.storybook-addon-vue-info .hljs-tag .hljs-attr {\n  color: #008080;\n}\n.storybook-addon-vue-info .hljs-string,\n.storybook-addon-vue-info .hljs-doctag {\n  color: #d14;\n}\n.storybook-addon-vue-info .hljs-title,\n.storybook-addon-vue-info .hljs-section,\n.storybook-addon-vue-info .hljs-selector-id {\n  color: #900;\n  font-weight: bold;\n}\n.storybook-addon-vue-info .hljs-subst {\n  font-weight: normal;\n}\n.storybook-addon-vue-info .hljs-type,\n.storybook-addon-vue-info .hljs-class .hljs-title {\n  color: #458;\n  font-weight: bold;\n}\n.storybook-addon-vue-info .hljs-tag,\n.storybook-addon-vue-info .hljs-name,\n.storybook-addon-vue-info .hljs-attribute {\n  color: #000080;\n  font-weight: normal;\n}\n.storybook-addon-vue-info .hljs-regexp,\n.storybook-addon-vue-info .hljs-link {\n  color: #009926;\n}\n.storybook-addon-vue-info .hljs-symbol,\n.storybook-addon-vue-info .hljs-bullet {\n  color: #990073;\n}\n.storybook-addon-vue-info .hljs-built_in,\n.storybook-addon-vue-info .hljs-builtin-name {\n  color: #0086b3;\n}\n.storybook-addon-vue-info .hljs-meta {\n  color: #999;\n  font-weight: bold;\n}\n.storybook-addon-vue-info .hljs-deletion {\n  background: #fdd;\n}\n.storybook-addon-vue-info .hljs-addition {\n  background: #dfd;\n}\n.storybook-addon-vue-info .hljs-emphasis {\n  font-style: italic;\n}\n.storybook-addon-vue-info .hljs-strong {\n  font-weight: bold;\n}\n","<script>\nimport XComponent from '../Component/index.vue'\nimport XDocs from '../Docs/index.vue'\nimport XHeader from '../Header/index.vue'\nimport XPreview from '../Preview/index.vue'\nimport XSeparator from '../Separator/index.vue'\nimport XStorySource from '../StorySource/index.vue'\nimport XSummary from '../Summary/index.vue'\n\nexport default {\n  components: {\n    XComponent,\n    XDocs,\n    XHeader,\n    XPreview,\n    XSeparator,\n    XStorySource,\n    XSummary\n  },\n  props: {\n    info: {\n      type: Object,\n      required: true\n    },\n    options: {\n      type: Object,\n      required: true\n    }\n  },\n  computed: {\n    casing() {\n      return {\n        component:\n          typeof this.options.casing === 'string' || !this.options.casing\n            ? this.options.casing\n            : this.options.casing.component,\n        props:\n          typeof this.options.casing === 'string' || !this.options.casing\n            ? this.options.casing\n            : this.options.casing.props\n      }\n    }\n  }\n}\n</script>\n\n<template>\n  <x-docs class=\"storybook-addon-vue-info\">\n    <x-header\n      v-if=\"options.header\"\n      :title=\"info.title\"\n      :subtitle=\"info.subtitle\"\n    />\n    <x-preview\n      v-if=\"!options.docsInPanel\"\n      :custom-class-name=\"options.previewClassName\"\n      :custom-style=\"options.previewStyle\"\n    >\n      <slot />\n    </x-preview>\n    <x-summary :markdown=\"info.summary\" />\n    <x-story-source\n      v-if=\"options.source\"\n      :source=\"info.storySource\"\n      :lang=\"info.jsxStory ? 'jsx' : 'html'\"\n    />\n    <x-separator />\n    <x-component\n      v-for=\"c in info.components\"\n      :key=\"c.name\"\n      :component=\"c\"\n      :casing=\"casing\"\n    />\n  </x-docs>\n</template>\n\n<style lang=\"less\">\n.storybook-addon-vue-info {\n  @import (less) '../../../node_modules/highlight.js/styles/github.css';\n}\n</style>\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$9 = undefined;
  /* module identifier */
  const __vue_module_identifier__$9 = undefined;
  /* functional template */
  const __vue_is_functional_template__$9 = false;
  /* style inject SSR */
  

  
  var DefaultWrapper = normalizeComponent_1(
    { render: __vue_render__$9, staticRenderFns: __vue_staticRenderFns__$9 },
    __vue_inject_styles__$9,
    __vue_script__$8,
    __vue_scope_id__$9,
    __vue_is_functional_template__$9,
    __vue_module_identifier__$9,
    browser,
    undefined
  );

var defaultOptions = {
    header: true,
    source: true,
    summary: '',
    components: null,
    wrapperComponent: DefaultWrapper,
    docsInPanel: true,
    useDocgen: true,
    casing: undefined
};

var AddonName = 'STORYBOOK_ADDON_VUE_INFO';
var Events = {
    ShowDocs: AddonName + '/show_docs'
};

function renderToPanel(info, options) {
    var channel = addons.getChannel();
    channel.emit(Events.ShowDocs, { info: info, options: options });
}

function findBottomStorybookWraps(w) {
    while (w &&
        w.options &&
        w.options.components &&
        w.options.components.story &&
        w.options.components.story.options &&
        w.options.components.story.options.STORYBOOK_WRAPS) {
        w = w.options.components.story.options.STORYBOOK_WRAPS;
    }
    return w;
}
function getComponentOptions(story) {
    if (story.fnOptions && story.fnOptions.STORYBOOK_WRAPS) {
        return findBottomStorybookWraps(story.fnOptions.STORYBOOK_WRAPS).options;
    }
    return ((story.componentOptions && story.componentOptions.Ctor) || {}).options;
}
var withInfo = makeDecorator({
    name: 'withInfo',
    parameterName: 'info',
    skipIfNoParametersOrOptions: true,
    wrapper: function (getStory, context, _a) {
        var parameters = _a.parameters;
        var options = __assign({}, defaultOptions, (parameters === true
            ? {}
            : typeof parameters === 'string'
                ? { summary: parameters }
                : parameters));
        return Vue.extend({
            render: function (h) {
                var story = h(getStory(context));
                var componentOptions = getComponentOptions(story);
                var info = extract(componentOptions, context.kind, context.story, options);
                if (options.docsInPanel) {
                    renderToPanel(info, options);
                    return story;
                }
                return h(options.wrapperComponent, { props: { info: info, options: options } }, [
                    story
                ]);
            }
        });
    }
});
function setDefaults(options) {
    Object.assign(defaultOptions, typeof options === 'string' ? { summary: options } : options);
}

export { XComponent as Component, XDocs as Docs, XHeader as Header, XPreview as Preview, XSectionContainer as SectionContainer, XSeparator as Separator, XStorySource as StorySource, XSummary as Summary, XTable as Table, DefaultWrapper as Wrapper, setDefaults, withInfo };
