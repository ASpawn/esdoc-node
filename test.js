'use strict';

var test = require('tape');
var code = require('./index').onHandleCode;

var f = function(s) {
  let ev = {data: {code: s}};
  code(ev);
  return ev.data.code;
};

test('export default', function(t) {
  t.plan(1);
  t.equals(f('module . exports = hello;'),
           'export default hello;');
});

test('export list', function(t) {
  t.plan(1);
  t.equals(f('module . exports = { hello, world };'),
      'export { hello, world };');
});

test('export named list', function(t) {
  t.plan(1);
  t.equals(f('module . exports = { hi: hello, earth :world };'),
      'export { hello as hi, world as earth };');
});

test('export class|function', function(t) {
  t.plan(2);
  t.equals(f('exports . Hello = class Hello {};'),
           'export class Hello {};');
  t.equals(f('exports . world = function world () {};'),
           'export function world () {};');
});

test('export { named };', function(t) {
  t.plan(1);
  t.equals(f('exports . some = some;'),
           'export { some };');
});

test('export { named };', function(t) {
  t.plan(1);
  t.equals(f('exports . some = some; exports . someOther = someOther;'),
      'export { some }; export { someOther };');
});

test('export let', function(t) {
  t.plan(1);
  t.equals(f('exports . hello = "world";'),
           'export let hello = "world";');
});

test('export let multiple', function(t) {
  t.plan(1);
  t.equals(f('exports . some = "some"; exports . someOther = "someOther";'),
           'export let some = "some"; export let someOther = "someOther";');
});

test('variable = require', function(t) {
  t.plan(3);
  t.equals(f('const esdoc = require("esdoc");'),
           'import esdoc from "esdoc";');
  t.equals(f('let esdoc = require("esdoc");'),
           'import esdoc from "esdoc";');
  t.equals(f('var esdoc = require("esdoc");'),
           'import esdoc from "esdoc";');
});

test('{ named } = require', function(t) {
  t.plan(3);
  t.equals(f('const { esdoc } = require("esdoc");'),
           'import { esdoc } from "esdoc";');
  t.equals(f('let { esdoc } = require("esdoc");'),
           'import { esdoc } from "esdoc";');
  t.equals(f('var { esdoc } = require("esdoc");'),
           'import { esdoc } from "esdoc";');
});

test('{ named } = require multiple', function(t) {
  t.plan(3);
  t.equals(f('const { esdoc, another, named, module } = require("esdoc");'),
           'import { esdoc, another, named, module } from "esdoc";');
  t.equals(f('let { esdoc, another, named, module } = require("esdoc");'),
           'import { esdoc, another, named, module } from "esdoc";');
  t.equals(f('var { esdoc, another, named, module } = require("esdoc");'),
           'import { esdoc, another, named, module } from "esdoc";');
});

test('require', function(t) {
  t.plan(1);
  t.equals(f('require("esdoc");'),
           'import "esdoc";');
});
