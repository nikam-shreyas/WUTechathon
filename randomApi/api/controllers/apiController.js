"use strict";
let dictionary = {
  EURGBP: 0.89518,
  EURUSD: 1.187611,
  GBPUSD: 1.326673,
  NZDUSD: 0.689708,
  USDAED: 3.673199,
  USDAFN: 77.070706,
  USDALL: 104.441726,
  USDAMD: 497.379627,
  USDANG: 1.798626,
  USDAOA: 666.072039,
  USDARS: 80.014818,
  USDAUD: 1.371234,
  USDAWG: 1.8,
  USDAZN: 1.699135,
  USDBAM: 1.649919,
  USDBBD: 2.023097,
  USDBDT: 84.964527,
  USDBGN: 1.650499,
  USDBHD: 0.377106,
  USDBIF: 1940.678502,
  USDBMD: 1,
  USDBND: 1.3457,
  USDBOB: 6.918817,
  USDBRL: 5.328899,
  USDBSD: 1.00202,
  USDBTN: 74.638412,
  USDBWP: 11.109293,
  USDBYN: 2.562911,
  USDBYR: 19600,
  USDBZD: 2.019723,
  USDCAD: 1.309555,
  USDCDF: 1964.999729,
  USDCHF: 0.910355,
  USDCLP: 763.197232,
  USDCNY: 6.546694,
  USDCOP: 3644.5,
  USDCRC: 613.208144,
  AUDUSD: 0.72927,
  USDCUC: 1,
  USDCUP: 26.5,
  USDCVE: 93.019626,
  USDCZK: 22.306502,
  USDDJF: 178.377102,
  USDDKK: 6.272601,
  USDDOP: 58.497307,
  USDDZD: 128.495577,
  USDEGP: 15.639918,
  USDERN: 14.999862,
  USDETB: 38.221452,
  USDEUR: 0.842026,
  USDFJD: 2.0965,
  USDFKP: 0.753825,
  USDGBP: 0.753765,
  USDGEL: 3.309612,
  USDGGP: 0.753825,
  USDGHS: 5.831727,
  USDGIP: 0.753825,
  USDGMD: 51.780029,
  USDGNF: 9835.625799,
  USDGTQ: 7.79816,
  USDGYD: 209.474479,
  USDHKD: 7.75255,
  USDHNL: 24.605093,
  USDHRK: 6.371802,
  USDHTG: 64.078522,
  USDHUF: 304.519577,
  USDIDR: 14099.55,
  USDILS: 3.36845,
  USDIMP: 0.753825,
  USDINR: 74.39975,
  USDIQD: 1196.193722,
  USDIRR: 42105.000014,
  USDISK: 135.999482,
  USDJEP: 0.753825,
  USDJMD: 147.795901,
  USDJOD: 0.708952,
  USDJPY: 104.009907,
  USDKES: 109.41013,
  USDKGS: 84.799692,
  USDKHR: 4066.120862,
  USDKMF: 414.999907,
  USDKPW: 900.070062,
  USDKRW: 1104.259664,
  USDKWD: 0.305901,
  USDKYD: 0.834985,
  USDKZT: 429.94407,
  USDLAK: 9288.51621,
  USDLBP: 1515.256325,
  USDLKR: 185.570309,
  USDLRD: 155.988745,
  USDLSL: 15.398789,
  USDLTL: 2.95274,
  USDLVL: 0.60489,
  USDLYD: 1.361048,
  USDMAD: 9.134231,
  USDMDL: 17.154234,
  USDMGA: 3948.074408,
  USDMKD: 51.977797,
  USDMMK: 1301.602659,
  USDMNT: 2831.570986,
  USDMOP: 8.00162,
  USDMRO: 357.000515,
  USDMUR: 39.999764,
  USDMVR: 15.410004,
  USDMWK: 759.81964,
  USDMXN: 20.26425,
  USDMYR: 4.095496,
  USDMZN: 73.739965,
  USDNAD: 15.404788,
  USDNGN: 381.201466,
  USDNIO: 34.919711,
  USDNOK: 9.05569,
  USDNPR: 119.420789,
  USDNZD: 1.44989,
  USDOMR: 0.384997,
  USDPAB: 1.002008,
  USDPEN: 3.672822,
  USDPGK: 3.50589,
  USDPHP: 48.217012,
  USDPKR: 158.474206,
  USDPLN: 3.78103,
  USDPYG: 7043.723269,
  USDQAR: 3.641016,
  USDRON: 4.103043,
  USDRSD: 98.974985,
  USDRUB: 76.2821,
  USDRWF: 989.860134,
  USDSAR: 3.750478,
  USDSBD: 8.100485,
  USDSCR: 20.575789,
  USDSDG: 55.325014,
  USDSEK: 8.616604,
  USDSGD: 1.341739,
  USDSHP: 0.753825,
  USDSLL: 9984.99998,
  USDSOS: 583.000068,
  USDSRD: 14.153976,
  USDSTD: 21031.906016,
  USDSVC: 8.767431,
  USDSYP: 512.916402,
  USDSZL: 15.402539,
  USDTHB: 30.209851,
  USDTJS: 11.350309,
  USDTMT: 3.51,
  USDTND: 2.748498,
  USDTOP: 2.29445,
  USDTRY: 7.724101,
  USDTTD: 6.808109,
  USDTWD: 28.513398,
  USDTZS: 2319.000038,
  USDUAH: 28.178808,
  USDUGX: 3707.456164,
  USDUSD: 1,
  USDUYU: 43.061232,
  USDUZS: 10381.716031,
  USDVEF: 9.987499,
  USDVND: 23165,
  USDVUV: 111.986096,
  USDWST: 2.572688,
  USDXAF: 553.356419,
  USDXAG: 0.040854,
  USDXAU: 0.000532,
  USDXCD: 2.70255,
  USDXDR: 0.704939,
  USDXOF: 553.361088,
  USDXPF: 100.874964,
  USDYER: 250.374959,
  USDZAR: 15.38945,
  USDZMK: 9001.197294,
  USDZMW: 20.966838,
};

exports.fetchAll = function (req, res) {
  let temp = dictionary;

  for (const key in temp) {
    if (temp.hasOwnProperty(key)) {
      if (key.slice(0, 3) != key.slice(3, 6)) {
        temp[key] = (temp[key] + Math.random()).toFixed(5);
      }
    }
  }
  res.status(201).json(temp);
};

exports.fetchPair = function (req, res) {
  let conv = req.params.pair;
  let list = conv.split(",");
  let responseVals = {};
  list.forEach((element) => {
    if (!dictionary.hasOwnProperty(element)) {
      let tempStr = "" + element.slice(3, 6) + element.slice(0, 3);
      if (dictionary.hasOwnProperty(tempStr)) {
        responseVals[element] = (
          1 / dictionary[tempStr] +
          Math.random()
        ).toFixed(5);
      } else {
        responseVals[element] = 0;
      }
    } else {
      responseVals[String(element)] = (
        dictionary[element] + Math.random()
      ).toFixed(5);
    }
  });
  res.status(201).json(responseVals);
};

exports.fetchHistory = function (req, res) {
  let data = req.params.data.split(",");
  let response = [];
  for (let i = Number(data[0]); i <= Number(data[1]); i += 86400000) {
    let temp = {};
    let tempDate = new Date(i);
    temp["timestamp"] =
      tempDate.getMonth() +
      1 +
      "/" +
      tempDate.getDate() +
      "/" +
      tempDate.getFullYear();
    temp["bestRate"] = (dictionary[data[2]] + Math.random(2)).toFixed(5);
    temp["worstRate"] = (dictionary[data[2]] - Math.random(2)).toFixed(5);
    response.push(temp);
  }
  console.log(response[0]);
  res.status(200).json(response);
};

exports.fetchTopFour = function (req, res) {
  const sorted = Object.entries(dictionary)
    .sort(([, a], [, b]) => a - b)
    .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});
  let n = 166;
  let i = 0;
  let top = [];
  for (const key in sorted) {
    if (i >= n) top.push(key);
    i++;
  }
  res.status(200).json(top);
};
