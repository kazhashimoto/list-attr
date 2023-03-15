#!/usr/bin/env node

const { program } = require("commander");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const debug = require('debug')('list-attr');

program
  .name('list-attr')
  .version('1.0.11')
  .usage('[options] htmlfile')
  .showHelpAfterError()
  .option('-t <tag>', 'specify tag name (default: img)')
  .option('-a <attr>', 'query attribute name(s) (comma separated list)')
  .option('-n, --null', 'show attributes that have NULL values')
  .option('--not-root-path', 'show links that have pathnames other than site-root relative path.');

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
  .set('source', ['src', 'srcset'])
  .set('script', ['src']);

let attr_list = [];
if (options.a) {
  attr_list = options.a.split(',');
}
let target = attrMap.get(tag);
if (target) {
  for (const a of attr_list) {
    target.push(a);
  }
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
    if (options.null) {
      if (!checkNullValues(o)) {
        continue;
      }
    }
    if (options.notRootPath) {
      if (!checkRelativePath(o)) {
        continue;
      }
    }
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
    const a = e.attributes[i];
    if (!target.includes(a.name)) {
      continue;
    }
    const a_loc = location.attrs[a.name];
    console.log(`${a_loc.startLine}    ${a.name}: ${a.value}`);
  }
}

function checkNullValues(e) {
  const stat = {};
  for (const attr of target) {
    stat[attr] = 0;
  }
  for (let i = 0; i < e.attributes.length; i++) {
    const a = e.attributes[i];
    if (stat[a.name] !== undefined) {
      stat[a.name]++;
    }
  }
  for (const p in stat) {
    if (!stat[p]) {
      return true;
    }
  }

  for (let i = 0; i < e.attributes.length; i++) {
    const a = e.attributes[i];
    if (target.includes(a.name)) {
      if (!a.value) {
        return true;
      }
    }
  }
  return false;
}

function checkRelativePath(e) {
  const url_attrs = ['href', 'src', 'srcset'];
  for (let i = 0; i < e.attributes.length; i++) {
    const a = e.attributes[i];
    if (target.includes(a.name)) {
      if (url_attrs.includes(a.name)) {
        if (!/^\//.test(a.value)) {
          return true;
        }
      }
    }
  }
  return false;
}
