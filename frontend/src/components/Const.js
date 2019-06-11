/* 存放需要用于查询的全局变量 */
const webSource = {
  1: '人民网',
  2: '网易新闻',
  3: '新华网',
  4: 'uc头条',
  5: '今日头条',
  6: '中国日报',
  7: '凤凰网',
  8: '搜狐新闻',
  9: '中国青年网',
  10: '中国台湾网',
  11: '澎湃新闻',
  12: '中央人民广播电视台',
  13: '光明网',
  14: '齐鲁网',
  15: '中国小康网',
  16: '北方网',
  17: '南方网',
  18: '新京报',
  19: '中央纪委监察部网站',
  20: '金融界',
  21: '大众网',
  22: '扬子晚报网',
  23: '中国江苏网',
  24: '时代周报',
  25: '国际在线',
  26: '中国经济网',
  27: '东北网',
  28: '湖北日报',
  30: '京华网',
  32: '新华报业网',
  33: '环球网',
  34: '大江网',
  35: '浙江在线',
  36: '新浪城市',
  37: '山西日报',
  38: '四川日报',
  39: '贵州网',
  40: '安徽网',
  41: '华龙网',
  42: '东方网',
  43: '千龙网',
  44: '广西新闻',
  45: '内蒙古新闻',
  46: '中国西藏网',
  49: '安徽网',
  50: '广东网',
  51: '东南网',
  52: '陕西传媒网',
  60: 'Global Times',
  61: '中国日报法文',
  62: '中国日报英文',
  63: '中国日报BBS',
  64: '中国网日文',
  65: '中国网法文',
  66: '中国日报德文',
  67: '中国网俄文',
  68: '朝日新闻',
  70: '中国网西班牙',
  72: '中国日报韩文',
  73: '中国网繁体',
  74: '中国政府网',
  75: '中新网英文',
  76: '文汇报',
  78: '新华网日语',
  81: '中国青年网英语',
  82: '中华网德语',
  83: '中华网意大利语',
  84: '中华网俄语',
  85: '中华网日语',
};
const LegacyType = {
  0: '其他',
  1: '自然灾害',
  2: '安全事故',
  3: '环境污染',
  4: '公共卫生',
  5: '其他',
  6: '社会安全',
  7: '政治新闻',
  8: '国防军事',
  9: '社会焦点',
};

const MajorType = {
  0: '社会安全',
  1: '社会安全',
  2: '社会安全',
  3: '社会安全',
  4: '工业信息',
  5: '工业信息',
  6: '工业信息',
  7: '工业信息',
  8: '科教文卫',
  9: '科教文卫',
  10: '科教文卫',
  11: '经济金融',
  12: '经济金融',
  13: '经济金融',
  14: '社会民生',
  15: '社会民生',
  16: '社会民生',
  17: '社会民生',
  18: '社会民生',
  19: '社会民生',
  20: '社会民生',
  21: '社会民生',
  22: '社会民生',
  23: '政治军事',
  24: '政治军事',
  25: '政治军事',
  26: '政治军事',
  27: '政治军事',
  28: '政治军事',
};

const MinorType = {
  0: '涉外安全',
  1: '自然灾害',
  2: '社会公共安全',
  3: '社会不公',
  4: '工业企业',
  5: '信息产业',
  6: '网络安全',
  7: '信息安全',
  8: '卫生',
  9: '科技教育',
  10: '文化体育',
  11: '宏观经济',
  12: '财政金融',
  13: '商业贸易',
  14: '环境保护',
  15: '旅游服务',
  16: '国土资源',
  17: '能源',
  18: '交通',
  19: '农业',
  20: '住房',
  21: '人口计生',
  22: '人力资源',
  23: '党建',
  24: '党建',
  25: '党建',
  26: '党建',
  27: '政法监察',
  28: '军事国防',
};

const ManyType = {
  '典型事件': {
    0: '公共设施事故',
    3: '水上事故',
    5: '溺水事故',
    6: '火灾事故',
    7: '爆炸事故',
    8: '矿难事故',
    9: '空难事故',
    38: '医患关系',
    41: '医疗事故',
    45: '医疗负面',
    48: '看病难贵',
    82: '传染病疫情',
    84: '养老问题',
    86: '土地问题',
    91: '拆迁问题',
    92: '欠薪讨薪',
    95: '豆腐渣工程',
    96: '违规建筑',
    97: '食品安全',
  },
  '实时热点': {
    134: '3.15消协',
    135: 'APEC会议',
    136: 'G20峰会',
    137: '一带一路',
    138: '两会（2017）',
    139: '乌镇峰会',
  },
  '安全事故': {
    0: '公共设施事故',
    1: '公路事故',
    2: '核辐射事故',
    3: '水上事故',
    4: '水电气事故',
    5: '溺水事故',
    6: '火灾事故',
    7: '爆炸事故',
    8: '矿难事故',
    9: '空难事故',
    10: '铁路事故',
  },
  '医疗卫生': {
    37: '医德医风',
    38: '医患关系',
    39: '医改问题',
    40: '医生技术',
    41: '医疗事故',
    42: '医疗卫生',
    43: '医疗政策',
    44: '医疗设施',
    45: '医疗负面-其他',
    46: '患者体验',
    47: '挂号问题',
    48: '看病难贵',
    49: '票贩问题',
    50: '违规办院',
  },
  '科技教育': {
    55: '体罚问题',
    56: '作弊问题',
    57: '减招问题',
    58: '学术造假',
    59: '学籍问题',
    60: '教育收费',
    61: '教育政策',
    62: '教育方式',
    63: '教育问题-其它',
    64: '校园安全',
    65: '校园环境',
    66: '校园设施',
    67: '校风师德',
    68: '网瘾问题',
    69: '罢课问题',
    70: '资源分配失衡',
    71: '违规办学',
    72: '非法补课',
  },
  '暴恐问题': {
    73: 'IS信息',
    74: '七五问题',
    75: '六四事件',
    76: '暴恐问题',
  },
  '民族分裂': {
    77: '台独信息',
    78: '涉疆信息',
    79: '涉蒙信息',
    80: '涉藏信息',
    81: '香港占中',
  },
  '民情民生': {
    82: '传染病疫情',
    83: '假药黑药',
    84: '养老问题',
    85: '农资质量问题',
    86: '土地问题',
    87: '婚育婴问',
    88: '就业问题',
    89: '心理问题',
    90: '房屋交易问题',
    91: '拆迁问题',
    92: '欠薪讨薪',
    93: '知识产权',
    94: '职业疾病',
    95: '豆腐渣工程',
    96: '违规建筑',
    97: '食品安全',
    145: '分配不公',
    146: '判决不公',
    147: '待遇不公',
  },
  '公安司法': {
    51: '伪证问题',
    52: '冤假错案',
    53: '司法问题-其它',
    54: '目无法纪',
    98: '人身侵犯',
    99: '传销问题',
    100: '偷税漏税',
    101: '危险品问',
    102: '围堵机关',
    103: '城管问题',
    104: '妨碍公务',
    105: '户口问题',
    106: '执法不当',
    107: '扰乱公共秩序',
    108: '扰乱市场秩序',
    109: '投毒问题',
    110: '抢劫问题',
    111: '拐卖人口',
    112: '暴力问题',
    113: '毁坏公物',
    114: '民运组织',
    115: '涉枪问题',
    116: '涉毒问题',
    117: '涉爆问题',
    118: '涉警问题',
    119: '涉赌问题',
    120: '涉黄问题',
    121: '游行示威',
    122: '盗猎盗采',
    123: '盗窃问题',
    124: '绑架勒索',
    125: '群体事件',
    126: '自杀自焚',
    127: '证件票券犯罪',
    128: '走私问题',
    129: '造假问题',
    130: '邪教问题',
    131: '非法买卖',
    132: '非法生产',
    133: '黑恶势力',
    148: '人为纵火',
    149: '信息泄露',
    150: '涉外突发事件',
    151: '经济安全事件',
    152: '重大刑事案件',
  },
  '环境保护': {
    140: '土地污染',
    141: '大气污染',
    142: '水体污染',
    143: '环保问题',
    144: '生物多样性破坏',
  },
  '反腐倡廉': {
    153: '乱收费',
    154: '作风问题',
    155: '公车私用',
    156: '后台关系',
    157: '国有资产流失',
    158: '失职问题',
    159: '官职买卖',
    160: '履历造假',
    161: '招兵内幕',
    162: '挥霍性腐败',
    163: '挪用公款',
    164: '换届选举问题',
    165: '滥用职权',
    166: '独断专行',
    167: '职业行为不当',
    168: '腐败问题-其他',
    169: '贪污受贿',
    170: '霸占问题',
    171: '面子工程',
  },
  '自然灾害': {
    172: '冻害灾害',
    173: '地质灾害',
    174: '大雾灾害',
    175: '洪水灾害',
    176: '海洋灾害',
    177: '生物灾害',
    178: '雨雪灾害',
    179: '风灾灾害',
    180: '高温旱灾',
  },
  '其他': {
    11: '上访举报',
    12: '举报问题',
    13: '公共设施故障',
    14: '军民冲突',
    15: '制度问题',
    16: '态度问题',
    17: '性侵犯',
    18: '投诉问题',
    19: '抗议问题',
    20: '排队问题',
    21: '救援问题',
    22: '文物问题',
    23: '欺压百姓',
    24: '欺骗诱导',
    25: '求助事件',
    26: '消防隐患',
    27: '涉盐问题',
    28: '社会思潮',
    29: '维权问题',
    30: '网络问题',
    31: '罢工问题',
    32: '聚众上访',
    33: '设施问题',
    34: '道德问题',
    35: '领土安全',
    36: '验收纠纷',
  },
};

const Topic = {
  '全国两会': ['两会', '十三届', '人大'],
  '一带一路': ['一带一路', '丝绸之路', '一体化', '丝绸之路经济带'],
  '雄安新区': ['雄安'],
  '台海问题': ['台湾', '台海', '海峡两岸'],
  '朝核问题': ['朝鲜', '金正恩', '核武器', '朝核'],
  '精准扶贫': ['扶贫', '精准扶贫', '旅游扶贫'],
  '机构改革': ['机构改革'],
  '住房问题': ['住房', '廉租房', '房价', '限购', '限贷'],
};

const Emotion = {
  0: '中性',
  1: '高兴',
  2: '悲伤',
  3: '愤怒',
};

const Area = [
  {text: '全部', value: ''},
  {text: '全国', value: '全国'},
  {text: '海外', value: '海外'},
  {text: '北京', value: '北京'},
  {text: '天津', value: '天津'},
];

const TimeSpan = [
  {text: '全部', value: 5},
  {text: '1小时', value: 0},
  {text: '5小时', value: 1},
  {text: '1天', value: 2},
  {text: '1周', value: 3},
  {text: '1月', value: 4},
];

export default {
  LegacyType,
  MajorType,
  MinorType,
  ManyType,
  Topic,
  Emotion,
  Area,
  TimeSpan,
  webSource,
};

export {
  LegacyType,
  MajorType,
  MinorType,
  ManyType,
  Topic,
  Emotion,
  Area,
  TimeSpan,
  webSource,
};