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
  -n, --null     show attributes that have NULL values
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

-nオプションで属性値がnull文字列になっているタグを出力します。以下の例は、alt属性の値が空文字列になっているimg要素を出力します。
```
$ list-attr -t img -n test.html
35 <img> [3/19]
35    src: foo.jpg
35    alt:
37 <img> [4/19]
37    src: bar.jpg
37    alt:
$
```

## Examples
出力の各行の先頭の数字は、HTMLファイル中の行番号を表します。各ブロックは１行目に検索対象のタグ名、その後ろに属性と値のペアが続きます。タグ名の右側に表示された[x/N]形式のラベルは、タグの検索結果の件数Nとインデックスxを表します。xの開始番号は1です。
```
$ list-attr -a width,height sample.html
25 <img> [1/3]
25    src: a1.png
25    alt: photo1
32 <img> [2/3]
32    src: a2.png
32    alt: photo2
33    width: 500
34    height: 400
41 <img> [3/3]
42    src: a3.png
43    alt:
```

## Turning on debug mode
```
$ DEBUG=* list-attr [options] htmlfile
```
