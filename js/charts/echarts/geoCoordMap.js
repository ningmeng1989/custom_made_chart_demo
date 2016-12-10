	var geoCoordMap = {
		    "海门":[121.15,31.89],
		    "鄂尔多斯":[109.781327,39.608266],
		    "招远":[120.38,37.35],
		    "舟山":[122.207216,29.985295],
		    "齐齐哈尔":[123.97,47.33],
		    "盐城":[120.13,33.38],
		    "赤峰":[118.87,42.28],
		    "青岛":[120.33,36.07],
		    "乳山":[121.52,36.89],
		    "金昌":[102.188043,38.520089],
		    "泉州":[118.58,24.93],
		    "莱西":[120.53,36.86],
		    "日照":[119.46,35.42],
		    "胶南":[119.97,35.88],
		    "南通":[121.05,32.08],
		    "拉萨":[91.11,29.97],
		    "云浮":[112.02,22.93],
		    "梅州":[116.1,24.55],
		    "文登":[122.05,37.2],
		    "上海":[121.48,31.22],
		    "攀枝花":[101.718637,26.582347],
		    "威海":[122.1,37.5],
		    "承德":[117.93,40.97],
		    "厦门":[118.1,24.46],
		    "汕尾":[115.375279,22.786211],
		    "潮州":[116.63,23.68],
		    "丹东":[124.37,40.13],
		    "太仓":[121.1,31.45],
		    "曲靖":[103.79,25.51],
		    "烟台":[121.39,37.52],
		    "福州":[119.3,26.08],
		    "瓦房店":[121.979603,39.627114],
		    "即墨":[120.45,36.38],
		    "抚顺":[123.97,41.97],
		    "玉溪":[102.52,24.35],
		    "张家口":[114.87,40.82],
		    "阳泉":[113.57,37.85],
		    "莱州":[119.942327,37.177017],
		    "湖州":[120.1,30.86],
		    "汕头":[116.69,23.39],
		    "昆山":[120.95,31.39],
		    "宁波":[121.56,29.86],
		    "湛江":[110.359377,21.270708],
		    "揭阳":[116.35,23.55],
		    "荣成":[122.41,37.16],
		    "连云港":[119.16,34.59],
		    "葫芦岛":[120.836932,40.711052],
		    "常熟":[120.74,31.64],
		    "东莞":[113.75,23.04],
		    "河源":[114.68,23.73],
		    "淮安":[119.15,33.5],
		    "泰州":[119.9,32.49],
		    "南宁":[108.33,22.84],
		    "营口":[122.18,40.65],
		    "惠州":[114.4,23.09],
		    "江阴":[120.26,31.91],
		    "蓬莱":[120.75,37.8],
		    "韶关":[113.62,24.84],
		    "嘉峪关":[98.289152,39.77313],
		    "广州":[113.23,23.16],
		    "延安":[109.47,36.6],
		    "太原":[112.53,37.87],
		    "清远":[113.01,23.7],
		    "中山":[113.38,22.52],
		    "昆明":[102.73,25.04],
		    "寿光":[118.73,36.86],
		    "盘锦":[122.070714,41.119997],
		    "长治":[113.08,36.18],
		    "深圳":[114.07,22.62],
		    "珠海":[113.52,22.3],
		    "宿迁":[118.3,33.96],
		    "咸阳":[108.72,34.36],
		    "铜川":[109.11,35.09],
		    "平度":[119.97,36.77],
		    "佛山":[113.11,23.05],
		    "海口":[110.35,20.02],
		    "江门":[113.06,22.61],
		    "章丘":[117.53,36.72],
		    "肇庆":[112.44,23.05],
		    "大连":[121.62,38.92],
		    "临汾":[111.5,36.08],
		    "吴江":[120.63,31.16],
		    "石嘴山":[106.39,39.04],
		    "沈阳":[123.38,41.8],
		    "苏州":[120.62,31.32],
		    "茂名":[110.88,21.68],
		    "嘉兴":[120.76,30.77],
		    "长春":[125.35,43.88],
		    "胶州":[120.03336,36.264622],
		    "银川":[106.27,38.47],
		    "张家港":[120.555821,31.875428],
		    "三门峡":[111.19,34.76],
		    "锦州":[121.15,41.13],
		    "南昌":[115.89,28.68],
		    "柳州":[109.4,24.33],
		    "三亚":[109.511909,18.252847],
		    "自贡":[104.778442,29.33903],
		    "吉林":[126.57,43.87],
		    "阳江":[111.95,21.85],
		    "泸州":[105.39,28.91],
		    "西宁":[101.74,36.56],
		    "宜宾":[104.56,29.77],
		    "呼和浩特":[111.65,40.82],
		    "成都":[104.06,30.67],
		    "大同":[113.3,40.12],
		    "镇江":[119.44,32.2],
		    "桂林":[110.28,25.29],
		    "张家界":[110.479191,29.117096],
		    "宜兴":[119.82,31.36],
		    "北海":[109.12,21.49],
		    "西安":[108.95,34.27],
		    "金坛":[119.56,31.74],
		    "东营":[118.49,37.46],
		    "牡丹江":[129.58,44.6],
		    "遵义":[106.9,27.7],
		    "绍兴":[120.58,30.01],
		    "扬州":[119.42,32.39],
		    "常州":[119.95,31.79],
		    "潍坊":[119.1,36.62],
		    "重庆":[106.54,29.59],
		    "台州":[121.420757,28.656386],
		    "南京":[118.78,32.04],
		    "滨州":[118.03,37.36],
		    "贵阳":[106.71,26.57],
		    "无锡":[120.29,31.59],
		    "本溪":[123.73,41.3],
		    "克拉玛依":[84.77,45.59],
		    "渭南":[109.5,34.52],
		    "马鞍山":[118.48,31.56],
		    "宝鸡":[107.15,34.38],
		    "焦作":[113.21,35.24],
		    "句容":[119.16,31.95],
		    "北京":[116.46,39.92],
		    "徐州":[117.2,34.26],
		    "衡水":[115.72,37.72],
		    "包头":[110,40.58],
		    "绵阳":[104.73,31.48],
		    "乌鲁木齐":[87.68,43.77],
		    "枣庄":[117.57,34.86],
		    "杭州":[120.19,30.26],
		    "淄博":[118.05,36.78],
		    "鞍山":[122.85,41.12],
		    "溧阳":[119.48,31.43],
		    "库尔勒":[86.06,41.68],
		    "安阳":[114.35,36.1],
		    "开封":[114.35,34.79],
		    "济南":[117,36.65],
		    "德阳":[104.37,31.13],
		    "温州":[120.65,28.01],
		    "九江":[115.97,29.71],
		    "邯郸":[114.47,36.6],
		    "临安":[119.72,30.23],
		    "兰州":[103.73,36.03],
		    "沧州":[116.83,38.33],
		    "临沂":[118.35,35.05],
		    "南充":[106.110698,30.837793],
		    "天津":[117.2,39.13],
		    "富阳":[119.95,30.07],
		    "泰安":[117.13,36.18],
		    "诸暨":[120.23,29.71],
		    "郑州":[113.65,34.76],
		    "哈尔滨":[126.63,45.75],
		    "聊城":[115.97,36.45],
		    "芜湖":[118.38,31.33],
		    "唐山":[118.02,39.63],
		    "平顶山":[113.29,33.75],
		    "邢台":[114.48,37.05],
		    "德州":[116.29,37.45],
		    "济宁":[116.59,35.38],
		    "荆州":[112.239741,30.335165],
		    "宜昌":[111.3,30.7],
		    "义乌":[120.06,29.32],
		    "丽水":[119.92,28.45],
		    "洛阳":[112.44,34.7],
		    "秦皇岛":[119.57,39.95],
		    "株洲":[113.16,27.83],
		    "石家庄":[114.48,38.03],
		    "莱芜":[117.67,36.19],
		    "常德":[111.69,29.05],
		    "保定":[115.48,38.85],
		    "湘潭":[112.91,27.87],
		    "金华":[119.64,29.12],
		    "岳阳":[113.09,29.37],
		    "长沙":[113,28.21],
		    "衢州":[118.88,28.97],
		    "廊坊":[116.7,39.53],
		    "菏泽":[115.480656,35.23375],
		    "合肥":[117.27,31.86],
		    "武汉":[114.31,30.52],
		    "大庆":[125.03,46.58],
		    "东城区":[116.418757,39.917544],
		    "西城区":[116.366794,39.915309],
		    "朝阳区":[116.486409,39.921489],
		    "丰台区":[116.286968,39.863642],
		    "石景山区":[116.195445,39.914601],
		    "海淀区":[116.310316,39.956074],
		    "门头沟区":[116.105381,39.937183],
		    "房山区":[116.139157,39.735535],
		    "通州区":[116.658603,39.902486],
		    "顺义区":[116.653525,40.128936],
		    "昌平区":[116.235906,40.218085],
		    "大兴区":[116.338033,39.728908],
		    "怀柔区":[116.637122,40.324272],
		    "平谷区":[117.112335,40.144783],
		    "密云县":[116.843352,40.377362],
		    "延庆县":[115.985006,40.465325],
		    "万州区":[108.380246,30.807807],
		    "涪陵区":[107.394905,29.703652],
		    "渝中区":[106.56288,29.556742],
		    "大渡口区":[106.48613,29.481002],
		    "江北区":[106.532844,29.575352],
		    "沙坪坝区":[106.4542,29.541224],
		    "九龙坡区":[106.480989,29.523492],
		    "南岸区":[106.560813,29.523992],
		    "北碚区":[106.437868,29.82543],
		    "綦江区":[106.651417,29.028091],
		    "大足区":[105.715319,29.700498],
		    "渝北区":[106.512851,29.601451],
		    "巴南区":[106.519423,29.381919],
		    "黔江区":[108.782577,29.527548],
		    "长寿区":[107.074854,29.833671],
		    "江津区":[106.253156,29.283387],
		    "合川区":[106.265554,29.990993],
		    "永川区":[105.894714,29.348748],
		    "南川区":[107.098153,29.156646],
		    "潼南区":[105.841818,30.189554],
		    "铜梁区":[106.054948,29.839944],
		    "荣昌区":[105.594061,29.403627],
		    "璧山区":[106.231126,29.593581],
		    "梁平县":[107.800034,30.672168],
		    "城口县":[108.6649,31.946293],
		    "丰都县":[107.73248,29.866424],
		    "垫江县":[107.348692,30.330012],
		    "武隆县":[107.75655,29.32376],
		    "忠县":[108.037518,30.291537],
		    "开县":[108.413317,31.167735],
		    "云阳县":[108.697698,30.930529],
		    "奉节县":[109.465774,31.019967],
		    "巫山县":[109.878928,31.074843],
		    "巫溪县":[109.628912,31.3966],
		    "石柱土家族自治县":[108.112448,29.99853],
		    "秀山土家族苗族自治县":[108.996043,28.444772],
		    "酉阳土家族苗族自治县":[108.767201,28.839828],
		    "彭水苗族土家族自治县":[108.166551,29.293856],
		    "黄浦区":[121.490317,31.222771],
		    "徐汇区":[121.43752,31.179973],
		    "长宁区":[121.4222,31.218123],
		    "静安区":[121.448224,31.229003],
		    "普陀区":[121.392499,31.241701],
		    "闸北区":[121.465689,31.25318],
		    "虹口区":[121.491832,31.26097],
		    "杨浦区":[121.522797,31.270755],
		    "闵行区":[121.375972,31.111658],
		    "宝山区":[121.489934,31.398896],
		    "嘉定区":[121.250333,31.383524],
		    "浦东新区":[121.567706,31.245944],
		    "金山区":[121.330736,30.724697],
		    "松江区":[121.223543,31.03047],
		    "青浦区":[121.113021,31.151209],
		    "奉贤区":[121.458472,30.912345],
		    "崇明县":[121.397516,31.626946],
		    "花地瑪堂區":[113.5528956,22.20787],
		    "花王堂區":[113.5489608,22.1992075],
		    "望德堂區":[113.5501828,22.19372083],
		    "大堂區":[113.5536475,22.18853944],
		    "風順堂區":[113.5419278,22.18736806],
		    "嘉模堂區":[113.5587044,22.15375944],
		    "路氹填海區":[113.5695992,22.13663],
		    "聖方濟各堂區":[113.5599542,22.12348639],
		    "中西區":[114.1543731,22.28198083],
		    "灣仔區":[114.1829153,22.27638889],
		    "東區":[114.2260031,22.27969306],
		    "南區":[114.1600117,22.24589667],
		    "油尖旺區":[114.1733317,22.31170389],
		    "深水埗區":[114.1632417,22.33385417],
		    "九龍城區":[114.1928467,22.31251],
		    "黃大仙區":[114.2038856,22.33632056],
		    "觀塘區":[114.2140542,22.32083778],
		    "荃灣區":[114.1210792,22.36830667],
		    "屯門區":[113.9765742,22.39384417],
		    "元朗區":[114.0324381,22.44142833],
		    "北區":[114.1473639,22.49610389],
		    "大埔區":[114.1717431,22.44565306],
		    "西貢區":[114.264645,22.31421306],
		    "沙田區":[114.1953653,22.37953167],
		    "葵青區":[114.1393194,22.36387667],
		    "離島區":[113.94612,22.28640778],
		    "和平区":[117.195907,39.118327],
		    "河东区":[117.226568,39.122125],
		    "河西区":[117.217536,39.101897],
		    "南开区":[117.164143,39.120474],
		    "河北区":[117.201569,39.156632],
		    "红桥区":[117.163301,39.175066],
		    "东丽区":[117.313967,39.087764],
		    "西青区":[117.012247,39.139446],
		    "津南区":[117.382549,38.989577],
		    "北辰区":[117.13482,39.225555],
		    "武清区":[117.057959,39.376925],
		    "宝坻区":[117.308094,39.716965],
		    "滨海新区":[117.654173,39.032846],
		    "宁河县":[117.82828,39.328886],
		    "静海县":[116.925304,38.935671],
		    "蓟县":[117.407449,40.045342]
		};
	var code = {
			"Afghanistan":            "AF",
			"Albania":                "AL",
			"Algeria":                "DZ",
			"Angola":                 "AO",
			"Argentina":              "AR",
			"Armenia":                "AM",
			"Australia":              "AU",
			"Austria":                "AT",
			"Azerbaijan":             "AZ",
			"Bahrain":                "BH",
			"Bangladesh":             "BD",
			"Belarus":                "BY",
			"Belgium":                "BE",
			"Benin":                  "BJ",
			"Bhutan":                 "BT",
			"Bolivia":                "BO",
			"Bosnia and Herzegovina": "BA",
			"Botswana":               "BW",
			"Brazil":                 "BR",
			"Brunei":                 "BN",
			"Bulgaria":               "BG",
			"Burkina Faso":           "BF",
			"Burundi":                "BI",
			"Cambodia":               "KH",
			"Cameroon":               "CM",
			"Canada":                 "CA",
			"Cape Verde":             "CV",
			"Central African Rep.":   "CF",
			"Chad":                   "TD",
			"Chile":                  "CL",
			"China":                  "CN",
			"Colombia":               "CO",
			"Comoros":                "KM",
			"Congo. Dem. Rep.":       "CD",
			"Congo. Rep.":            "CG",
			"Costa Rica":             "CR",
			"Cote dIvoire":           "CI",
			"Croatia":                "HR",
			"Cuba":                   "CU",
			"Cyprus":                 "CY",
			"Czech Rep.":             "CZ",
			"Denmark":                "DK",
			"Djibouti":               "DJ",
			"Dominican Rep.":         "DO",
			"Ecuador":                "EC",
			"Egypt":                  "EG",
			"El Salvador":            "SV",
			"Equatorial Guinea":      "GQ",
			"Eritrea":                "ER",
			"Estonia":                "EE",
			"Ethiopia":               "ET",
			"Fiji":                   "FJ",
			"Finland":                "FI",
			"France":                 "FR",
			"Gabon":                  "GA",
			"Gambia":                 "GM",
			"Georgia":                "GE",
			"Germany":                "DE",
			"Ghana":                  "GH",
			"Greece":                 "GR",
			"Guatemala":              "GT",
			"Guinea":                 "GN",
			"Guinea-Bissau":          "GW",
			"Guyana":                 "GY",
			"Haiti":                  "HT",
			"Honduras":               "HN",
			"Hong Kong":              "HK",
			"Hungary":                "HU",
			"Iceland":                "IS",
			"India":                  "IN",
			"Indonesia":              "ID",
			"Iran":                   "IR",
			"Iraq":                   "IQ",
			"Ireland":                "IE",
			"Israel":                 "IL",
			"Italy":                  "IT",
			"Jamaica":                "JM",
			"Japan":                  "JP",
			"Jordan":                 "JO",
			"Kazakhstan":             "KZ",
			"Kenya":                  "KE",
			"Korea. Dem. Rep.":       "KP",
			"Korea. Rep.":            "KR",
			"Kuwait":                 "KW",
			"Kyrgyzstan":             "KG",
			"Laos":                   "LA",
			"Latvia":                 "LV",
			"Lebanon":                "LB",
			"Lesotho":                "LS",
			"Liberia":                "LR",
			"Libya":                  "LY",
			"Lithuania":              "LT",
			"Luxembourg":             "LU",
			"Macedonia. FYR":         "MK",
			"Madagascar":             "MG",
			"Malawi":                 "MW",
			"Malaysia":               "MY",
			"Mali":                   "ML",
			"Mauritania":             "MR",
			"Mauritius":              "MU",
			"Mexico":                 "MX",
			"Moldova":                "MD",
			"Mongolia":               "MN",
			"Montenegro":             "ME",
			"Morocco":                "MA",
			"Mozambique":             "MZ",
			"Myanmar":                "MM",
			"Namibia":                "NA",
			"Nepal":                  "NP",
			"Netherlands":            "NL",
			"New Zealand":            "NZ",
			"Nicaragua":              "NI",
			"Niger":                  "NE",
			"Nigeria":                "NG",
			"Norway":                 "NO",
			"Oman":                   "OM",
			"Pakistan":               "PK",
			"Panama":                 "PA",
			"Papua New Guinea":       "PG",
			"Paraguay":               "PY",
			"Peru":                   "PE",
			"Philippines":            "PH",
			"Poland":                 "PL",
			"Portugal":               "PT",
			"Puerto Rico":            "PR",
			"Qatar":                  "QA",
			"Romania":                "RO",
			"Russia":                 "RU",
			"Rwanda":                 "RW",
			"Saudi Arabia":           "SA",
			"Senegal":                "SN",
			"Serbia":                 "RS",
			"Sierra Leone":           "SL",
			"Singapore":              "SG",
			"Slovak Republic":        "SK",
			"Slovenia":               "SI",
			"Solomon Islands":        "SB",
			"Somalia":                "SO",
			"South Africa":           "ZA",
			"Spain":                  "ES",
			"Sri Lanka":              "LK",
			"Sudan":                  "SD",
			"Suriname":               "SR",
			"Swaziland":              "SZ",
			"Sweden":                 "SE",
			"Switzerland":            "CH",
			"Syria":                  "SY",
			"Taiwan":                 "TW",
			"Tajikistan":             "TJ",
			"Tanzania":               "TZ",
			"Thailand":               "TH",
			"Togo":                   "TG",
			"Trinidad and Tobago":    "TT",
			"Tunisia":                "TN",
			"Turkey":                 "TR",
			"Turkmenistan":           "TM",
			"Uganda":                 "UG",
			"Ukraine":                "UA",
			"United Arab Emirates":   "AE",
			"United Kingdom":         "GB",
			"United States":          "US",
			"Uruguay":                "UY",
			"Uzbekistan":             "UZ",
			"Venezuela":              "VE",
			"West Bank and Gaza":     "PS",
			"Vietnam":                "VN",
			"Yemen. Rep.":            "YE",
			"Zambia":                 "ZM",
			"Zimbabwe":               "ZW"};
	var latlong = {};
	latlong.AD = {'latitude':42.5, 'longitude':1.5};
	latlong.AE = {'latitude':24, 'longitude':54};
	latlong.AF = {'latitude':33, 'longitude':65};
	latlong.AG = {'latitude':17.05, 'longitude':-61.8};
	latlong.AI = {'latitude':18.25, 'longitude':-63.1667};
	latlong.AL = {'latitude':41, 'longitude':20};
	latlong.AM = {'latitude':40, 'longitude':45};
	latlong.AN = {'latitude':12.25, 'longitude':-68.75};
	latlong.AO = {'latitude':-12.5, 'longitude':18.5};
	latlong.AP = {'latitude':35, 'longitude':105};
	latlong.AQ = {'latitude':-90, 'longitude':0};
	latlong.AR = {'latitude':-34, 'longitude':-64};
	latlong.AS = {'latitude':-14.3333, 'longitude':-170};
	latlong.AT = {'latitude':47.3333, 'longitude':13.3333};
	latlong.AU = {'latitude':-27, 'longitude':133};
	latlong.AW = {'latitude':12.5, 'longitude':-69.9667};
	latlong.AZ = {'latitude':40.5, 'longitude':47.5};
	latlong.BA = {'latitude':44, 'longitude':18};
	latlong.BB = {'latitude':13.1667, 'longitude':-59.5333};
	latlong.BD = {'latitude':24, 'longitude':90};
	latlong.BE = {'latitude':50.8333, 'longitude':4};
	latlong.BF = {'latitude':13, 'longitude':-2};
	latlong.BG = {'latitude':43, 'longitude':25};
	latlong.BH = {'latitude':26, 'longitude':50.55};
	latlong.BI = {'latitude':-3.5, 'longitude':30};
	latlong.BJ = {'latitude':9.5, 'longitude':2.25};
	latlong.BM = {'latitude':32.3333, 'longitude':-64.75};
	latlong.BN = {'latitude':4.5, 'longitude':114.6667};
	latlong.BO = {'latitude':-17, 'longitude':-65};
	latlong.BR = {'latitude':-10, 'longitude':-55};
	latlong.BS = {'latitude':24.25, 'longitude':-76};
	latlong.BT = {'latitude':27.5, 'longitude':90.5};
	latlong.BV = {'latitude':-54.4333, 'longitude':3.4};
	latlong.BW = {'latitude':-22, 'longitude':24};
	latlong.BY = {'latitude':53, 'longitude':28};
	latlong.BZ = {'latitude':17.25, 'longitude':-88.75};
	latlong.CA = {'latitude':54, 'longitude':-100};
	latlong.CC = {'latitude':-12.5, 'longitude':96.8333};
	latlong.CD = {'latitude':0, 'longitude':25};
	latlong.CF = {'latitude':7, 'longitude':21};
	latlong.CG = {'latitude':-1, 'longitude':15};
	latlong.CH = {'latitude':47, 'longitude':8};
	latlong.CI = {'latitude':8, 'longitude':-5};
	latlong.CK = {'latitude':-21.2333, 'longitude':-159.7667};
	latlong.CL = {'latitude':-30, 'longitude':-71};
	latlong.CM = {'latitude':6, 'longitude':12};
	latlong.CN = {'latitude':35, 'longitude':105};
	latlong.CO = {'latitude':4, 'longitude':-72};
	latlong.CR = {'latitude':10, 'longitude':-84};
	latlong.CU = {'latitude':21.5, 'longitude':-80};
	latlong.CV = {'latitude':16, 'longitude':-24};
	latlong.CX = {'latitude':-10.5, 'longitude':105.6667};
	latlong.CY = {'latitude':35, 'longitude':33};
	latlong.CZ = {'latitude':49.75, 'longitude':15.5};
	latlong.DE = {'latitude':51, 'longitude':9};
	latlong.DJ = {'latitude':11.5, 'longitude':43};
	latlong.DK = {'latitude':56, 'longitude':10};
	latlong.DM = {'latitude':15.4167, 'longitude':-61.3333};
	latlong.DO = {'latitude':19, 'longitude':-70.6667};
	latlong.DZ = {'latitude':28, 'longitude':3};
	latlong.EC = {'latitude':-2, 'longitude':-77.5};
	latlong.EE = {'latitude':59, 'longitude':26};
	latlong.EG = {'latitude':27, 'longitude':30};
	latlong.EH = {'latitude':24.5, 'longitude':-13};
	latlong.ER = {'latitude':15, 'longitude':39};
	latlong.ES = {'latitude':40, 'longitude':-4};
	latlong.ET = {'latitude':8, 'longitude':38};
	latlong.EU = {'latitude':47, 'longitude':8};
	latlong.FI = {'latitude':62, 'longitude':26};
	latlong.FJ = {'latitude':-18, 'longitude':175};
	latlong.FK = {'latitude':-51.75, 'longitude':-59};
	latlong.FM = {'latitude':6.9167, 'longitude':158.25};
	latlong.FO = {'latitude':62, 'longitude':-7};
	latlong.FR = {'latitude':46, 'longitude':2};
	latlong.GA = {'latitude':-1, 'longitude':11.75};
	latlong.GB = {'latitude':54, 'longitude':-2};
	latlong.GD = {'latitude':12.1167, 'longitude':-61.6667};
	latlong.GE = {'latitude':42, 'longitude':43.5};
	latlong.GF = {'latitude':4, 'longitude':-53};
	latlong.GH = {'latitude':8, 'longitude':-2};
	latlong.GI = {'latitude':36.1833, 'longitude':-5.3667};
	latlong.GL = {'latitude':72, 'longitude':-40};
	latlong.GM = {'latitude':13.4667, 'longitude':-16.5667};
	latlong.GN = {'latitude':11, 'longitude':-10};
	latlong.GP = {'latitude':16.25, 'longitude':-61.5833};
	latlong.GQ = {'latitude':2, 'longitude':10};
	latlong.GR = {'latitude':39, 'longitude':22};
	latlong.GS = {'latitude':-54.5, 'longitude':-37};
	latlong.GT = {'latitude':15.5, 'longitude':-90.25};
	latlong.GU = {'latitude':13.4667, 'longitude':144.7833};
	latlong.GW = {'latitude':12, 'longitude':-15};
	latlong.GY = {'latitude':5, 'longitude':-59};
	latlong.HK = {'latitude':22.25, 'longitude':114.1667};
	latlong.HM = {'latitude':-53.1, 'longitude':72.5167};
	latlong.HN = {'latitude':15, 'longitude':-86.5};
	latlong.HR = {'latitude':45.1667, 'longitude':15.5};
	latlong.HT = {'latitude':19, 'longitude':-72.4167};
	latlong.HU = {'latitude':47, 'longitude':20};
	latlong.ID = {'latitude':-5, 'longitude':120};
	latlong.IE = {'latitude':53, 'longitude':-8};
	latlong.IL = {'latitude':31.5, 'longitude':34.75};
	latlong.IN = {'latitude':20, 'longitude':77};
	latlong.IO = {'latitude':-6, 'longitude':71.5};
	latlong.IQ = {'latitude':33, 'longitude':44};
	latlong.IR = {'latitude':32, 'longitude':53};
	latlong.IS = {'latitude':65, 'longitude':-18};
	latlong.IT = {'latitude':42.8333, 'longitude':12.8333};
	latlong.JM = {'latitude':18.25, 'longitude':-77.5};
	latlong.JO = {'latitude':31, 'longitude':36};
	latlong.JP = {'latitude':36, 'longitude':138};
	latlong.KE = {'latitude':1, 'longitude':38};
	latlong.KG = {'latitude':41, 'longitude':75};
	latlong.KH = {'latitude':13, 'longitude':105};
	latlong.KI = {'latitude':1.4167, 'longitude':173};
	latlong.KM = {'latitude':-12.1667, 'longitude':44.25};
	latlong.KN = {'latitude':17.3333, 'longitude':-62.75};
	latlong.KP = {'latitude':40, 'longitude':127};
	latlong.KR = {'latitude':37, 'longitude':127.5};
	latlong.KW = {'latitude':29.3375, 'longitude':47.6581};
	latlong.KY = {'latitude':19.5, 'longitude':-80.5};
	latlong.KZ = {'latitude':48, 'longitude':68};
	latlong.LA = {'latitude':18, 'longitude':105};
	latlong.LB = {'latitude':33.8333, 'longitude':35.8333};
	latlong.LC = {'latitude':13.8833, 'longitude':-61.1333};
	latlong.LI = {'latitude':47.1667, 'longitude':9.5333};
	latlong.LK = {'latitude':7, 'longitude':81};
	latlong.LR = {'latitude':6.5, 'longitude':-9.5};
	latlong.LS = {'latitude':-29.5, 'longitude':28.5};
	latlong.LT = {'latitude':55, 'longitude':24};
	latlong.LU = {'latitude':49.75, 'longitude':6};
	latlong.LV = {'latitude':57, 'longitude':25};
	latlong.LY = {'latitude':25, 'longitude':17};
	latlong.MA = {'latitude':32, 'longitude':-5};
	latlong.MC = {'latitude':43.7333, 'longitude':7.4};
	latlong.MD = {'latitude':47, 'longitude':29};
	latlong.ME = {'latitude':42.5, 'longitude':19.4};
	latlong.MG = {'latitude':-20, 'longitude':47};
	latlong.MH = {'latitude':9, 'longitude':168};
	latlong.MK = {'latitude':41.8333, 'longitude':22};
	latlong.ML = {'latitude':17, 'longitude':-4};
	latlong.MM = {'latitude':22, 'longitude':98};
	latlong.MN = {'latitude':46, 'longitude':105};
	latlong.MO = {'latitude':22.1667, 'longitude':113.55};
	latlong.MP = {'latitude':15.2, 'longitude':145.75};
	latlong.MQ = {'latitude':14.6667, 'longitude':-61};
	latlong.MR = {'latitude':20, 'longitude':-12};
	latlong.MS = {'latitude':16.75, 'longitude':-62.2};
	latlong.MT = {'latitude':35.8333, 'longitude':14.5833};
	latlong.MU = {'latitude':-20.2833, 'longitude':57.55};
	latlong.MV = {'latitude':3.25, 'longitude':73};
	latlong.MW = {'latitude':-13.5, 'longitude':34};
	latlong.MX = {'latitude':23, 'longitude':-102};
	latlong.MY = {'latitude':2.5, 'longitude':112.5};
	latlong.MZ = {'latitude':-18.25, 'longitude':35};
	latlong.NA = {'latitude':-22, 'longitude':17};
	latlong.NC = {'latitude':-21.5, 'longitude':165.5};
	latlong.NE = {'latitude':16, 'longitude':8};
	latlong.NF = {'latitude':-29.0333, 'longitude':167.95};
	latlong.NG = {'latitude':10, 'longitude':8};
	latlong.NI = {'latitude':13, 'longitude':-85};
	latlong.NL = {'latitude':52.5, 'longitude':5.75};
	latlong.NO = {'latitude':62, 'longitude':10};
	latlong.NP = {'latitude':28, 'longitude':84};
	latlong.NR = {'latitude':-0.5333, 'longitude':166.9167};
	latlong.NU = {'latitude':-19.0333, 'longitude':-169.8667};
	latlong.NZ = {'latitude':-41, 'longitude':174};
	latlong.OM = {'latitude':21, 'longitude':57};
	latlong.PA = {'latitude':9, 'longitude':-80};
	latlong.PE = {'latitude':-10, 'longitude':-76};
	latlong.PF = {'latitude':-15, 'longitude':-140};
	latlong.PG = {'latitude':-6, 'longitude':147};
	latlong.PH = {'latitude':13, 'longitude':122};
	latlong.PK = {'latitude':30, 'longitude':70};
	latlong.PL = {'latitude':52, 'longitude':20};
	latlong.PM = {'latitude':46.8333, 'longitude':-56.3333};
	latlong.PR = {'latitude':18.25, 'longitude':-66.5};
	latlong.PS = {'latitude':32, 'longitude':35.25};
	latlong.PT = {'latitude':39.5, 'longitude':-8};
	latlong.PW = {'latitude':7.5, 'longitude':134.5};
	latlong.PY = {'latitude':-23, 'longitude':-58};
	latlong.QA = {'latitude':25.5, 'longitude':51.25};
	latlong.RE = {'latitude':-21.1, 'longitude':55.6};
	latlong.RO = {'latitude':46, 'longitude':25};
	latlong.RS = {'latitude':44, 'longitude':21};
	latlong.RU = {'latitude':60, 'longitude':100};
	latlong.RW = {'latitude':-2, 'longitude':30};
	latlong.SA = {'latitude':25, 'longitude':45};
	latlong.SB = {'latitude':-8, 'longitude':159};
	latlong.SC = {'latitude':-4.5833, 'longitude':55.6667};
	latlong.SD = {'latitude':15, 'longitude':30};
	latlong.SE = {'latitude':62, 'longitude':15};
	latlong.SG = {'latitude':1.3667, 'longitude':103.8};
	latlong.SH = {'latitude':-15.9333, 'longitude':-5.7};
	latlong.SI = {'latitude':46, 'longitude':15};
	latlong.SJ = {'latitude':78, 'longitude':20};
	latlong.SK = {'latitude':48.6667, 'longitude':19.5};
	latlong.SL = {'latitude':8.5, 'longitude':-11.5};
	latlong.SM = {'latitude':43.7667, 'longitude':12.4167};
	latlong.SN = {'latitude':14, 'longitude':-14};
	latlong.SO = {'latitude':10, 'longitude':49};
	latlong.SR = {'latitude':4, 'longitude':-56};
	latlong.ST = {'latitude':1, 'longitude':7};
	latlong.SV = {'latitude':13.8333, 'longitude':-88.9167};
	latlong.SY = {'latitude':35, 'longitude':38};
	latlong.SZ = {'latitude':-26.5, 'longitude':31.5};
	latlong.TC = {'latitude':21.75, 'longitude':-71.5833};
	latlong.TD = {'latitude':15, 'longitude':19};
	latlong.TF = {'latitude':-43, 'longitude':67};
	latlong.TG = {'latitude':8, 'longitude':1.1667};
	latlong.TH = {'latitude':15, 'longitude':100};
	latlong.TJ = {'latitude':39, 'longitude':71};
	latlong.TK = {'latitude':-9, 'longitude':-172};
	latlong.TM = {'latitude':40, 'longitude':60};
	latlong.TN = {'latitude':34, 'longitude':9};
	latlong.TO = {'latitude':-20, 'longitude':-175};
	latlong.TR = {'latitude':39, 'longitude':35};
	latlong.TT = {'latitude':11, 'longitude':-61};
	latlong.TV = {'latitude':-8, 'longitude':178};
	latlong.TW = {'latitude':23.5, 'longitude':121};
	latlong.TZ = {'latitude':-6, 'longitude':35};
	latlong.UA = {'latitude':49, 'longitude':32};
	latlong.UG = {'latitude':1, 'longitude':32};
	latlong.UM = {'latitude':19.2833, 'longitude':166.6};
	latlong.US = {'latitude':38, 'longitude':-97};
	latlong.UY = {'latitude':-33, 'longitude':-56};
	latlong.UZ = {'latitude':41, 'longitude':64};
	latlong.VA = {'latitude':41.9, 'longitude':12.45};
	latlong.VC = {'latitude':13.25, 'longitude':-61.2};
	latlong.VE = {'latitude':8, 'longitude':-66};
	latlong.VG = {'latitude':18.5, 'longitude':-64.5};
	latlong.VI = {'latitude':18.3333, 'longitude':-64.8333};
	latlong.VN = {'latitude':16, 'longitude':106};
	latlong.VU = {'latitude':-16, 'longitude':167};
	latlong.WF = {'latitude':-13.3, 'longitude':-176.2};
	latlong.WS = {'latitude':-13.5833, 'longitude':-172.3333};
	latlong.YE = {'latitude':15, 'longitude':48};
	latlong.YT = {'latitude':-12.8333, 'longitude':45.1667};
	latlong.ZA = {'latitude':-29, 'longitude':24};
	latlong.ZM = {'latitude':-15, 'longitude':30};
	latlong.ZW = {'latitude':-20, 'longitude':30};