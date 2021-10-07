# list-attr
list-attrは、HTMLファイルから特定のタグについて属性値の一覧を標準出力に書き出すコマンドラインインターフェイスです。たとえば、list-attrを使って、HTMLファイルからimgタグのsrcやalt属性、aタグのhref属性、scriptタグのsrc属性の値を抽出したリストを得ることができます。用途としては、コーディングしたWebページをテストアップする前に、リンクのURLや画像ファイルのパス名に誤りがないかをチェックするのに使います。

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
  -t <tag>       specify tag name (default: img)
  -a <attr>      query attribute name(s) (comma separated list)
  -h, --help     display help for command
```

オプションなしで実行した時は、Webページに含まれるimgタグのsrcとalt属性を出力します。検索対象のHTMLファイルにはリモートのURLも指定できます。
```
$ list-attr index.html
$ list-attr https://www.example.com
```

-tオプションで検索対象のタグを指定します。たとえば、以下の例ではWebページに含まれるaタグのhref属性を出力します。
```
$ list-attr -t a index.html
```

これはscriptタグのsrc属性を出力します。
```
$ list-attr -t script index.html
```

-aオプションで検索対象の属性を追加します。以下の例ではimgタグのsrc, alt属性に加えて、widthおよびheight属性があればそれらの値も出力します。
```
$ list-attr -t img -a width,height index.html
```

結果の出力形式は以下のとおりです。出力の最初の行に検索対象のタグ名が表示され、出現順に[x/N]形式のラベルのついたブロックが続きます。ここでNはタグの総数、xは1から始まるインデックス番号です。各ブロックは、属性と値のペアが１行ずつ表示されます。タグが該当する属性を持たない場合は、そのタグに関してブロックの内容は空で[x/N]ラベルのみ表示されます。
```
<tagName>
[1/N]
attr1: value1
attr2: value2
[2/N]
attr1: value1
attr2: value2
...
```

## Turning on debug mode
```
$ DEBUG=* list-attr [options] htmlfile
```
