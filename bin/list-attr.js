#!/usr/bin/env node

const { program } = require("commander");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const debug = require('debug')('list-attr');

program
  .name('list-attr')
  .version('1.0.0')
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
  .set('img', ['src', 'alt'])
  .set('a', ['href'])
  .set('script', ['src'])
  .set('link', ['href'])
  .set('meta', ['name', 'content']);

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

let reader;
if (/^https?:\/{2}/.test(htmlPath)) {
  reader = JSDOM.fromURL(htmlPath);
} else {
  reader = JSDOM.fromFile(htmlPath);
}

reader.then(dom => {
  const { document } = dom.window;
  const elements = document.querySelectorAll(tag);
  console.log(`<${tag}>`);
  for (let i = 0; i < elements.length; i++) {
    console.log(`[${i + 1}/${elements.length}]`)
    printAttributes(elements[i]);
  }
})
.catch(err => {
  console.error(err.message);
});

function printAttributes(e) {
  for (let i = 0; i < e.attributes.length; i++) {
    const a = e.attributes.item(i);
    if (!target.includes(a.name)) {
      continue;
    }
    console.log(`${a.name}: ${a.value}`);
  }
}
