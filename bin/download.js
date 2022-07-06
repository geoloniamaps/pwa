/**
 * @file Google スプレッドシートのデータをダウンロードする
 */

const fs = require("fs");
const path = require("path")
const fetch = require("node-fetch")
const { parse } = require('csv-parse/sync');

const SPREADSHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRtxqgKCZGMNT9GEzJuExmeugE7Ef_LuKGmV4hKlylxzOiVX0VhlB24S68_XR_BUOBuEjqSLAML3z5s/pub?output=csv';
const SHEETS = [
  {
    'fileName': 'data.csv',
    'sheetId': '1957425126', //「スポットデータ」のシートID を指定して下さい
  },
  {
    'fileName': 'config.csv',
    'sheetId': '1964433556', //「基本データ」のシートID を指定して下さい
  }
]

const downloadCSV = async () => {

  const baseUrl = SPREADSHEET_URL.replace('pub?output=csv', '');

  for (const sheet of SHEETS) {
    const url = `${baseUrl}pub?gid=${sheet.sheetId}&single=true&output=csv`;
    const response = await fetch(url);
    const text = await response.text();
    fs.writeFileSync(path.join(path.join(__dirname, '..', 'public'), sheet.fileName), text);
  }
}

// SVG 形式のロゴ画像が スプレッドシートの logo_image_url に指定されていればダウンロードする
const downloadSvgLogo = async () => {

  const distLogoFilePath = path.join(process.cwd(), "/public/logo.svg");
  const configFilePath = path.join(__dirname, "..", "public/config.csv");

  const file = fs.readFileSync(configFilePath, 'utf8')
  const data = parse(file);

  const header = data[0];
  const body = data[1];

  for (let i = 0; i < header.length; i++) {

    if (header[i] === "logo_image_url" && body[i].match(/\.svg|\.SVG/)) {

      try {

        const logoUrl = body[i];
        const response = await fetch(logoUrl);
        const text = await response.text();
        fs.writeFileSync(distLogoFilePath, text);

      } catch (error) {

        console.log(error)
        process.stderr.write(
          `ロゴ画像のダウンロードに失敗しました。正しいURLか確認して下さい。\n`
        );
        process.exit(1);

      }

    }
  }
}

downloadCSV()
downloadSvgLogo()
