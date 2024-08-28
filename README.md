# Geolonia PWAマップ

## Geolonia PWAマップ について

Geolonia PWA は、GitHub と Google Sheets を使って、素早く PWA の地図アプリが作れるテンプレートです。

## フォーク

まず、以下のリポジトリをフォークしてください。
https://github.com/geoloniamaps/pwamap


## サイト全体の設定

`config.yml` を書き換えることでサイト全体の設定を変更できます。

設定の例:
```
title: Geolonia PWAマップ
description: Google スプレッドシートを更新するだけでオリジナルの地図アプリを作成できる\n「Geolonia PWAマップ」
data_url: https://docs.google.com/spreadsheets/d/1_m8s4P5tdSeam3nzC5ruSfuvtSejQKEX1FiBeOWJN3E/pub?gid=1957425126&single=true&output=csv
logo_image_url: https://geoloniamaps.github.io/pwamap/icon-pwamap.svg
background_image_url: https://geoloniamaps.github.io/pwamap/geolonia_bgimage_1920_1080.png
primary_color: "#d2691e"
orderby: distance
```

- `title`: サイトのタイトルです。
- `description`: サイトの概要文です。
- `data_url`: アプリで読み込む CSV データまでの URL を記述してください。SSL は必須です。
- `logo_image_url`: PCで表示した時のロゴ画像の URL を記述してください。
- `background_image_url`: PCで表示した時の背景画像の URL を記述してください。
- `primary_color`: サイトのテーマカラーを記述してください。（例: `#d2691e`）
- `orderby`: 一覧ページのデータの並び順を指定します。`distance` で距離順に並び替えます。`time` で新着順に並び替えます。

## スポットデータについて

スポットは CSV 以下の方法でスポットデータファイルを作成して、config.yml にその CSV までの URL を設定してください。

### Google スプレッドシートを使う方法
以下のスプレッドシートをコピーしてください。

https://docs.google.com/spreadsheets/d/1_m8s4P5tdSeam3nzC5ruSfuvtSejQKEX1FiBeOWJN3E/edit?usp=sharing


次に共有設定を行ってください。

Google スプレッドシート の URL は通常、以下のようなフォーマットの URL になっています。

```
https://docs.google.com/spreadsheets/d/<:id>/edit#gid=<:gid>
```

これを以下のように置き換えることで、CSV フォーマットでアクセスできます。

```
https://docs.google.com/spreadsheets/d/<:id>/export?format=csv&gid=<:gid>
```

上のサンプルスプレッドシートの例では、以下のような URL になります。

```
https://docs.google.com/spreadsheets/d/1P6HM3YhLvWcfay2V_Pqxv7xPJwU8yR0SzZxinjXW4o4/export?format=csv&gid=0
```

## 開発

[Geolonia PWA マップ ユーザーマニュアル](https://blog.geolonia.com/2022/05/17/pwamap-manual-setup.html) の手順を実行、その後以下のコマンドを実行して下さい。

```shell
$ git clone git@github.com:geoloniamaps/pwa.git
$ cd pwa
$ npm install
$ npm start
```

下の URL にアクセスして下さい。開発サーバーが立ち上がります。

`http://localhost:3000/<あなたのリポジトリ名>/#/`


## 注意事項
このプログラムは自由にカスタマイズ可能ですが、利用についてはサポート対象外となります。

