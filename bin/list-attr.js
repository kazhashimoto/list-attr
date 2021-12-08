#!/usr/bin/env node

const { program } = require("commander");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const debug = require('debug')('list-attr');

program
  .name('list-attr')
  .version('1.0.4')
  .usage('[options] htmlfile')
  .showHelpAfterError()
  .option('-t <tag>', 'specify tag name (default: img)')
  .option('-a <attr>', 'query attribute name(s) (comma separated list)');

program.parse(process.argv);
const options = program.opts();
debug('options', options);

if (!program.args.length) {
  program.help();
}

let htmlPath = program.args[0];
let tag = options.t? options.t: 'img';

const attrMap = new Map();
attrMap
  .set('a', ['href'])
  .set('iframe', ['src'])
  .set('img', ['src', 'alt'])
  .set('link', ['href'])
  .set('meta', ['name', 'content'])
  .set('script', ['src']);

let attr_list = [];
if (options.a) {
  attr_list = options.a.split(',');
}
let target = attrMap.get(tag);
if (target) {
  attr_list.forEach(a => {
    target.push(a);
  });
} else {
  attrMap.set(tag, attr_list);
  target = attrMap.get(tag);
}
debug('attrMap', attrMap);

const jsdom_options = { includeNodeLocations: true };

let reader;
if (/^https?:\/{2}/.test(htmlPath)) {
  reader = JSDOM.fromURL(htmlPath, jsdom_options);
} else {
  reader = JSDOM.fromFile(htmlPath, jsdom_options);
}

reader.then(dom => {
  const { document } = dom.window;
  const elements = document.querySelectorAll(tag);
  for (let i = 0; i < elements.length; i++) {
    const o = elements[i];
    const location = dom.nodeLocation(o);
    console.log(`${location.startLine} <${tag}> [${i + 1}/${elements.length}]`);
    printAttributes(o, location);
  }
})
.catch(err => {
  console.error(err.message);
});

function printAttributes(e, location) {
  for (let i = 0; i < e.attributes.length; i++) {
    const a = e.attributes.item(i);
    if (!target.includes(a.name)) {
      continue;
    }
    const a_loc = location.attrs[a.name];
    console.log(`${a_loc.startLine}    ${a.name}: ${a.value}`);
  }
}
