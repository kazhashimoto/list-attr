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
  .option('-t <tag>', 'specify tag name')
  .option('-a <attr>', 'query attribute name');

program.parse(process.argv);
const options = program.opts();
debug('options', options);

if (!program.args.length) {
  program.help();
}

let htmlPath = program.args[0];
let tag = options.t? options.t: 'img';
let reader = JSDOM.fromFile(htmlPath);
reader.then(dom => {
  const { document } = dom.window;
  const elements = document.querySelectorAll(tag);
  elements.forEach(e => {
    printAttributes(e, options.a);
  });
})
.catch(err => {
  console.error(err.message);
});

function printAttributes(e, attr) {
  console.log(e.localName);
  for (let i = 0; i < e.attributes.length; i++) {
    const a = e.attributes.item(i);
    if (attr && attr != a.name) {
      continue;
    }
    console.log(a.name +': '+ a.value);
  }
}
