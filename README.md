# list-attr

## Installation
```
$ mkdir test-package
$ cd test-package/
$ npm init -y
$ echo "@kazhashimoto:registry=https://npm.pkg.github.com" > .npmrc
$ npm install -g @kazhashimoto/list-attr
```

How to uninstall this package:
```
$ npm uninstall -g @kazhashimoto/list-attr
```

## Usage
```
$ list-attr --help
Usage: list-attr [options] htmlfile

Options:
  -V, --version  output the version number
  -t <tag>       specify tag name
  -a <attr>      query attribute name
  -h, --help     display help for command
```
