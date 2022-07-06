import React from "react";
import { Routes, Route } from "react-router-dom";
import { parse } from './lib/csv-parse';
import "./App.scss";

import Home from './App/Home'
import List from './App/List'
import AboutUs from './App/AboutUs'
import Category from './App/Category'
import Images from './App/Images'

import Tabbar from './App/Tabbar'
import zen2han from './lib/zen2han';

const sortShopList = async (shopList: Pwamap.ShopData[]) => {

  // 新着順にソート
  return shopList.sort(function (item1, item2) {
    return Date.parse(item2['タイムスタンプ']) - Date.parse(item1['タイムスタンプ'])
  });

}

const App = () => {
  const [shopList, setShopList] = React.useState<Pwamap.ShopData[]>([])

  React.useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/data.csv?timestamp=${new Date().getTime()}`)
      .then((response) => {
        return response.ok ? response.text() : Promise.reject(response.status);
      })
      .then((data) => {

        // @ts-ignore
        parse(data, async (error, data) => {
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
            if (!feature['緯度'].match(/^-?[0-9]+(\.[0-9]+)?$/)) {
              continue
            }
            if (!feature['経度'].match(/^-?[0-9]+(\.[0-9]+)?$/)) {
              continue
            }

            const shop = {
              ...feature,
              index: i
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
