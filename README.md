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

オプションなしで実行した時は、Webページに含まれるimgタグのsrcとalt属性を出力します。
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
