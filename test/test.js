'use strict';

var test = require('node:test'),
  assert = require('node:assert'),
  compiler = require('..');

[
  {
    description: 'strip with from Vue render functions',
    input: `
  with (this) {
    return _h('div', items.map(function (item) {
      let foo
      return _h('p', {
        class: [a, b + 'c', c ? d : item.e],
        style: { color, item, [prop]: true, method(){} },
        inlineTemplate: {
          render: function (_h) {
            with (this) {
              return _h('span', ['hi', arguments[1]])
}
          }
        }
      }, item.tags.map(function (tag) {
        return _c('span', [item.id, tag.text, foo, a[b]])
      }), item.stuff.map(([a, b], { c: d }) => {
        const { x: z } = _c
        try { return _h('p', [a, b, c, d]) } catch (er) { return x(er + z) }
      }))
    }))
}`,
    output: `
  var _vm=this,_c=_vm._self._c;
    return _vm._h('div', _vm.items.map(function (item) {
      let foo
      return _vm._h('p', {
        class: [_vm.a, _vm.b + 'c', _vm.c ? _vm.d : item.e],
        style: { color: _vm.color, item, [_vm.prop]: true, method(){} },
        inlineTemplate: {
          render: function (_h) {
            var _vm=this,_c=_vm._self._c;
              return _h('span', ['hi', arguments[1]])

          }
        }
      }, item.tags.map(function (tag) {
        return _c('span', [item.id, tag.text, foo, _vm.a[_vm.b]])
      }), item.stuff.map(([a, b], { c: d }) => {
        const { x: z } = _c
        try { return _vm._h('p', [a, b, _vm.c, d]) } catch (er) { return _vm.x(er + z) }
      }))
    }))
`
  },
  {
    description: 'strip with w/ single line if',
    input: 'with(this){ if (NaN) return _c();text;}',
    output: 'var _vm=this,_c=_vm._self._c; if (NaN) return _c();_vm.text;'
  }
].forEach(function (t) {
  test(t.description, function () {
    var result = compiler.stripWithStatement(t.input);
    assert.strictEqual(result, t.output);
  });
});

[
  {
    description: 'should work',
    input: `
<div id="app">
  <div :style="{ color }">{{ foo }}</div>
  <p v-for="i in list">{{ i }}</p>
  <foo inline-template>
    <div>{{ bar }}</div>
  </foo>
</div>`,
    output: `function render() {
  var _vm = this,
    _c = _vm._self._c
  return _c(
    "div",
    { attrs: { id: "app" } },
    [
      _c("div", { style: { color: _vm.color } }, [_vm._v(_vm._s(_vm.foo))]),
      _vm._v(" "),
      _vm._l(_vm.list, function (i) {
        return _c("p", [_vm._v(_vm._s(i))])
      }),
      _vm._v(" "),
      _c("foo", {
        inlineTemplate: {
          render: function () {
            var _vm = this,
              _c = _vm._self._c
            return _c("div", [_vm._v(_vm._s(_vm.bar))])
          },
          staticRenderFns: [],
        },
      }),
    ],
    2
  )
}
`
  },
  {
    description: 'setup bindings',
    input: '<div @click="count++">{{ count }}</div>',
    output: `function render() {
  var _vm = this,
    _c = _vm._self._c
  return _c(
    "div",
    {
      on: {
        click: function ($event) {
          _vm.count++
        },
      },
    },
    [_vm._v(_vm._s(_vm.count))]
  )
}
`
  }
].forEach(function (t) {
  test(t.description, function () {
    var result = compiler.compile(t.input, { stripWith: true });
    assert.ok(!result.errors || !result.errors.length);

    var code = `function render(){${result.render}\n}`;
    code = require('prettier').format(code, { semi: false, parser: 'babel' });
    assert.strictEqual(code, t.output);
  });
});
