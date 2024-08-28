import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.scss";

import Home from './App/Home'
import List from './App/List'
import AboutUs from './App/AboutUs'
import Category from './App/Category'
import Images from './App/Images'

import Tabbar from './App/Tabbar'
import config from "./config.json";
import csvParser from 'csv-parse'

// You can see config.json after running `npm start` or `npm run build`
// import config from './config.json'


const sortShopList = async (shopList: Pwamap.ShopData[]) => {

  // 新着順にソート
  return shopList.sort(function (item1, item2) {
    return Date.parse(item2['タイムスタンプ']) - Date.parse(item1['タイムスタンプ'])
  });

}

const zen2han = (str: string) => {
  return str.replace(/[！-～]/g, function(s: string) {
    return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
  }).replace(/　/g, ' ');
}

const App = () => {
  const [shopList, setShopList] = React.useState<Pwamap.ShopData[]>([])

  React.useEffect(() => {
    fetch(`${encodeURIComponent(config.data_url)}`)
    .then((response) => {
      return response.ok ? response.text() : Promise.reject(response.status);
    })
    .then((data) => {
      csvParser(data, async (error, data) => {
        if (error) {
          console.log(error)
          setShopList([])
          return
        }

        const [header, ...records] = data;

        const features = records.map((record: string) => {
          const properties = header.reduce((prev: any, column: any) => {
            const value = record[header.indexOf(column)];
            prev[column] = zen2han(value);
            return prev;
          }, {});

          return properties;
        });

        const nextShopList: Pwamap.ShopData[] = []
        for (let i = 0; i < features.length; i++) {
          const feature = features[i] as Pwamap.ShopData
          if (!feature['緯度'] || !feature['経度'] || !feature['スポット名']) {
            continue;
          }
          if (!feature['緯度'].match(/^[0-9]+(\.[0-9]+)?$/)) {
            continue
          }
          if (!feature['経度'].match(/^[0-9]+(\.[0-9]+)?$/)) {
            continue
          }
          const shop = {
            index: i,
            ...feature
          }

          nextShopList.push(shop)
        }
        sortShopList(nextShopList).then((sortedShopList) => {
          setShopList(sortedShopList)
        })
      });
    });
  }, [])


  return (
    <div className="app">
      <div className="app-body">
        <Routes>
          <Route path="/" element={<Home data={shopList} />} />
          <Route path="/list" element={<List data={shopList} />} />
          <Route path="/category" element={<Category data={shopList} />} />
          <Route path="/images" element={<Images data={shopList} />} />
          <Route path="/about" element={<AboutUs />} />
        </Routes>
      </div>
      <div className="app-footer">
        <Tabbar />
      </div>
    </div>
  );
}

export default App;
