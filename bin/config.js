#!/usr/bin/env node

const fs = require("fs");
const path = require("path")
const { parse } = require('csv-parse/sync');
const csv2geojson = require('csv2geojson');
const configFilePath = path.join(__dirname, "..", "public/config.csv");
const dataFilePath = path.join(__dirname, "..", "public/data.csv");

// config.json と .env を作成する
const exportConfig = () => {
  try {
    const file = fs.readFileSync(configFilePath, 'utf8')
    const data = parse(file);

    const header = data[0];
    const body = data[1];

    let envText = '';
    let json = {}

    for (let i = 0; i < header.length; i++) {

      if (typeof body[i] === "string" || typeof body[i] === "number") {

        let value = body[i];

        // .env
        let upperCaseHeader = header[i].toUpperCase();
        envText += `REACT_APP_${upperCaseHeader}="${value}"\n`;

        // json
        json[header[i]] = value;
      }
    }

    fs.writeFileSync(path.join(process.cwd(), '.env'), envText)
    fs.writeFileSync(path.join(__dirname, '..', 'src/config.json'), JSON.stringify(json, null, 2))

  } catch (error) {
    process.stderr.write(`${configFilePath} が存在しません。\n`);
    process.exit(1);
  }
}


const exportGeoJSON = () => {
  try {

    let file = fs.readFileSync(dataFilePath, 'utf8')

    csv2geojson.csv2geojson(file, {
      latfield: '緯度',
      lonfield: '経度',
      delimiter: ','
    }, function (err, data) {


      // プロパティ名 「スポット名」を「title」に変更
      if (data && data.features) {

        const features = data.features;

        for (let i = 0; i < features.length; i++) {

          const feature = features[i];

          if (feature.properties && feature.properties['スポット名']) {

            const value = feature.properties['スポット名'];
            delete feature.properties['スポット名'];
            feature.properties.title = value;

            data.features[i] = feature;

          }
        }
      }

      fs.writeFileSync(path.join(__dirname, '..', 'public/data.geojson'), JSON.stringify(data, null, 2))
    });

  } catch (error) {
    process.stderr.write(`${dataFilePath} が存在しません。\n`);
    process.exit(1);
  }

}

exportConfig();
exportGeoJSON();
