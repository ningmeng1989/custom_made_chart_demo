/**
 * Created by fuyw on 2015/9/8.
 */

// 记录图表id和帮助文档相对路径之间的对应关系
var CHART_SECTION = {
    0: 'e_chord',
    1: 'e_line',
    2: 'e_line',
    3: 'e_tree',
    4: 'e_eventriver',
    5: 'e_funnel',
    6: 'e_gauge',
    7: 'e_k',
    8: 'e_chinamap',
    9: 'e_treemap',
    10: 'e_pie',
    13: 'e_scatter',
    14: 'e_scatter',
    16: 'e_force',
    17: 'e_radar',
    18: 'bubble',
    19: 'bullet',
    21: 'calendar',
    22: 'chinamap',
    23: 'chord',
    24: 'column',
    25: 'columnline',
    26: 'dot',
    27: 'doubleline',
    28: 'bar',
    29: 'funnel',
    30: 'singlecolumn',
    31: 'hotmap',
    32: 'line',
    33: 'list',
    37: 'parallel',
    38: 'pie',
    39: 'pinterest',
    40: 'radar',
    42: 'rose',
    44: 'scatterplotmatrix',
    45: 'stack',
    46: 'stream',
    47: 'sunburst',
    48: 'tagcloud',
    49: 'tree',
    50: 'treemap',
    52: 'e_bar',
    53: 'e_line',
    54: 'e_barValue'
};

// 记录图表属性对应的简要说明、帮助文档中的节点id，公共属性需要标识是第一类还是第二类
var CHART_PROPERTY_SECTION = {
    '提示框': {
        '格式': ['提示框格式', 'first', 'tipFormat'],
        '触发类型': ['提示框触发类型', 'second', 'tooltipTrigger'],
        '格式模板': ['提示框格式模板', 'second', 'tooltipFormatter']
    },
    'X轴': {
        '聚焦策略': ['脱离0值比例', 'second', 'xAxisScale'],
        '类目轴空白策略': ['类目轴两端空白策略', 'second', 'xAxisCategoryBoundaryGap'],
        '是否定位': ['是否定位到垂直方向的0值坐标', 'second', 'xAxisLineOnZero']
    },
    'Y轴': {
        '聚焦策略': ['脱离0值比例', 'second', 'xAxisScale'],
        '类目轴空白策略': ['类目轴两端空白策略', 'second', 'xAxisCategoryBoundaryGap'],
        '是否定位': ['是否定位到垂直方向的0值坐标', 'second', 'xAxisLineOnZero']
    },
    '数据区域缩放控件': {
        '是否实时显示': ['是否实时显示缩放变化', 'second', 'dataZoomRealTime']
    },
    '值域漫游控制器': {
        '开启值域漫游': ['是否启用值域漫游', 'second', 'dataRangeCalculable']
    },
    '图表': {
        '拖拽重计算': ['是否启用拖拽重计算特性', 'second', 'calculable'],
        '大规模节点优化': ['是否启用大规模节点优化', 'massiveOptimation'],
        '数据筛选策略': ['数据筛选策略', 'dataFilterStrategy'],
        '开启大规模散点图': ['是否启用大规模散点图', 'massiveScatter'],
        '面包屑显示': ['是否显示下方的导航', 'showBreadCrumb'],
        '饼图类型': ['南丁格尔玫瑰图模式', 'pieType'],
        '格式': ['显示内容的格式', 'contentFormat']
    }

};