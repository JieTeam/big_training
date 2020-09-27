export function init(cities){
  var cityArray = [
    [],
    [],
    [],
  ];
  for (let i = 0, len = cities.length; i < len; i++) {
    //获取省级数据
    let province = cities[i];
    let pObject = {
      id: province.regionCode,
      name: province.regionName
    }
    //赋值第一个数组 省级数据
    cityArray[0].push(pObject);
  }
  // 默认北京市 市辖区
  //市级数据
  let city = cities[0].children;
  for (let j = 0; j < city.length; j++) {
    let cObject = {
      id: city[j].regionCode,
      name: city[j].regionName
    }
    //赋值第二个数组 市级数据
    cityArray[1].push(cObject);
    //区级数据
 
  }
  let region = city[0].children;
  for (let k = 0; k < region.length; k++) {
    let rObject = {
      id: region[k].regionCode,
      name: region[k].regionName
    }
    // 赋值区级数据
    cityArray[2].push(rObject);
  }
  return cityArray;
}
export function changeCloumt(cities, cityArray,index,column,province_index){
    if (column == 0) {
      cityArray[1] = [];
      cityArray[2] = [];
      //第一列切换
      let city = cities[index].children;
      for (let j = 0; j < city.length; j++) {
        let cObject = {
          id: city[j].regionCode,
          name: city[j].regionName
        }
        //赋值第二个数组 市级数据
        cityArray[1].push(cObject);
        //区级数据
      }
      let region = city[0].children;
      for (let k = 0; k < region.length; k++) {
        let rObject = {
          id: region[k].regionCode,
          name: region[k].regionName
        }
        // 赋值区级数据
        cityArray[2].push(rObject);
      }
      return cityArray;
    }
    if (column == 1) {
      //第二列切换
      cityArray[2] = [];
      let province = cityArray[0][province_index];
      for (let i = 0, len = cities.length; i < len; i++) {
        let p = cities[i];
        if (province.id == p.regionCode) {
          province = p;
        }
      }
      //获取已存在的省市区
      let city = province.children;
      let region = city[index].children;
      for (let k = 0; k < region.length; k++) {
        let rObject = {
          id: region[k].regionCode,
          name: region[k].regionName
        }
        // 赋值区级数据
        cityArray[2].push(rObject);
      }
     return cityArray;
    }
}
export function getCityCode(array, cities){
  let arrayText = [];
  let p = array[0];
  let c = array[1];
  let r = array[2];
  let city;
  for (let i = 0, len = cities.length; i < len; i++) {
    let province = cities[i];
    if (p == province.regionCode) {
      city = province.children;
      arrayText[0] = province.regionName;
    }
  }
  let region;
  for(let j = 0;  j < city.length; j++){
    if(c == city[j].regionCode){
      region = city[j].children;
      arrayText[1] = city[j].regionName
    }
  }
  for(let k = 0;  k < region.length; k++){
    if(r == region[k].regionCode){
      arrayText[2] = region[k].regionName
    }
  }
  return arrayText;
}
export function getCityIndex(cityArray,array){
  let arrayText = [];
  let p = array[0];
  let c = array[1];
  let r = array[2];
  arrayText[0] = cityArray[0][p];
  arrayText[1] = cityArray[1][c];
  arrayText[2] = cityArray[2][r];
  return arrayText;
}