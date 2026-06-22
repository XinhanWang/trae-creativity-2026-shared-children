// Shared Children · Warm Companion - Charts
(function() {
  var style = getComputedStyle(document.documentElement);
  var accent = style.getPropertyValue('--accent').trim();
  var accent2 = style.getPropertyValue('--accent2').trim();
  var ink = style.getPropertyValue('--ink').trim();
  var muted = style.getPropertyValue('--muted').trim();
  var rule = style.getPropertyValue('--rule').trim();
  var bg2 = style.getPropertyValue('--bg2').trim();
  var bg = style.getPropertyValue('--bg').trim();

  var palette = [accent, accent2, muted, accent + 'aa', accent2 + 'aa', '#D4A373', '#8B7355'];

  var commonTooltip = {
    backgroundColor: bg2,
    borderColor: rule,
    borderWidth: 1,
    textStyle: { color: ink, fontSize: 13 },
    appendToBody: true
  };

  // ===== Chart 1: Population trend =====
  var chart1 = echarts.init(document.getElementById('chart-population'), null, { renderer: 'svg' });
  chart1.setOption({
    animation: false,
    color: [accent, accent2],
    tooltip: Object.assign({ trigger: 'axis' }, commonTooltip),
    legend: {
      data: ['60+ 人口 (亿)', '独居/空巢老人 (亿)'],
      textStyle: { color: muted, fontSize: 12 },
      top: 10
    },
    grid: { top: 50, right: 30, bottom: 50, left: 60 },
    xAxis: {
      type: 'category',
      data: ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025E', '2030E'],
      axisLine: { lineStyle: { color: rule } },
      axisLabel: { color: muted, fontSize: 12 }
    },
    yAxis: {
      type: 'value',
      name: '亿人',
      nameTextStyle: { color: muted, fontSize: 11 },
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: rule, type: 'dashed', opacity: 0.5 } },
      axisLabel: { color: muted, fontSize: 11 }
    },
    series: [
      {
        name: '60+ 人口 (亿)',
        type: 'line',
        smooth: true,
        data: [2.49, 2.54, 2.60, 2.67, 2.71, 2.80, 2.87, 2.95, 3.40],
        lineStyle: { width: 3 },
        symbol: 'circle',
        symbolSize: 8,
        areaStyle: { color: accent + '22' }
      },
      {
        name: '独居/空巢老人 (亿)',
        type: 'line',
        smooth: true,
        data: [0.92, 0.96, 1.00, 1.05, 1.10, 1.15, 1.18, 1.25, 1.60],
        lineStyle: { width: 3 },
        symbol: 'circle',
        symbolSize: 8,
        areaStyle: { color: accent2 + '22' }
      }
    ]
  });
  window.addEventListener('resize', function() { chart1.resize(); });

  // ===== Chart 2: Silver Economy Market =====
  var chart2 = echarts.init(document.getElementById('chart-market'), null, { renderer: 'svg' });
  chart2.setOption({
    animation: false,
    color: [accent],
    tooltip: Object.assign({ trigger: 'axis', axisPointer: { type: 'shadow' } }, commonTooltip),
    grid: { top: 30, right: 30, bottom: 50, left: 70 },
    xAxis: {
      type: 'category',
      data: ['2020', '2022', '2024', '2026E', '2028E', '2030E', '2035E'],
      axisLine: { lineStyle: { color: rule } },
      axisLabel: { color: muted, fontSize: 12 }
    },
    yAxis: {
      type: 'value',
      name: '万亿元',
      nameTextStyle: { color: muted, fontSize: 11 },
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: rule, type: 'dashed', opacity: 0.5 } },
      axisLabel: { color: muted, fontSize: 11 }
    },
    series: [{
      name: '市场规模',
      type: 'bar',
      data: [5.4, 7.0, 8.8, 11.0, 13.8, 17.4, 25.0],
      barWidth: 36,
      itemStyle: {
        color: {
          type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: accent },
            { offset: 1, color: accent2 }
          ]
        },
        borderRadius: [4, 4, 0, 0]
      },
      label: {
        show: true,
        position: 'top',
        color: ink,
        fontWeight: 700,
        fontSize: 12,
        formatter: '{c}'
      }
    }]
  });
  window.addEventListener('resize', function() { chart2.resize(); });

  // ===== Chart 3: User Needs Distribution (horizontal bar) =====
  var chart3 = echarts.init(document.getElementById('chart-needs'), null, { renderer: 'svg' });
  var needs = [
    { name: '日常陪聊、读报', value: 78 },
    { name: '陪同就医、代取药', value: 72 },
    { name: '代买菜、代缴费用', value: 65 },
    { name: '教用智能手机', value: 61 },
    { name: '节日陪伴、心理疏导', value: 54 },
    { name: '紧急救助与安全提醒', value: 48 },
    { name: '陪散步、户外活动', value: 42 }
  ];
  chart3.setOption({
    animation: false,
    color: [accent],
    tooltip: Object.assign({ trigger: 'axis', axisPointer: { type: 'shadow' } }, commonTooltip),
    grid: { top: 20, right: 50, bottom: 30, left: 140 },
    xAxis: {
      type: 'value',
      max: 100,
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: rule, type: 'dashed', opacity: 0.5 } },
      axisLabel: { color: muted, fontSize: 11, formatter: '{value}%' }
    },
    yAxis: {
      type: 'category',
      data: needs.map(function(n) { return n.name; }).reverse(),
      axisLine: { lineStyle: { color: rule } },
      axisTick: { show: false },
      axisLabel: { color: ink, fontSize: 12 }
    },
    series: [{
      name: '用户占比',
      type: 'bar',
      data: needs.map(function(n) { return n.value; }).reverse(),
      barWidth: 18,
      itemStyle: { color: accent, borderRadius: [0, 4, 4, 0] },
      label: {
        show: true,
        position: 'right',
        color: ink,
        fontWeight: 700,
        fontSize: 11,
        formatter: '{c}%'
      }
    }]
  });
  window.addEventListener('resize', function() { chart3.resize(); });

  // ===== Chart 4: Revenue projection (stacked bar) =====
  var chart4 = echarts.init(document.getElementById('chart-revenue'), null, { renderer: 'svg' });
  chart4.setOption({
    animation: false,
    color: [accent, accent2, '#D4A373', '#8B7355'],
    tooltip: Object.assign({ trigger: 'axis', axisPointer: { type: 'shadow' } }, commonTooltip),
    legend: {
      data: ['企业工会', '商业保险', '街道/民政', '个人付费'],
      textStyle: { color: muted, fontSize: 11 },
      top: 10
    },
    grid: { top: 50, right: 30, bottom: 50, left: 60 },
    xAxis: {
      type: 'category',
      data: ['Y1 试点', 'Y2 拓展', 'Y3 规模化', 'Y4 区域', 'Y5 全国'],
      axisLine: { lineStyle: { color: rule } },
      axisLabel: { color: muted, fontSize: 12 }
    },
    yAxis: {
      type: 'value',
      name: '万元',
      nameTextStyle: { color: muted, fontSize: 11 },
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: rule, type: 'dashed', opacity: 0.5 } },
      axisLabel: { color: muted, fontSize: 11 }
    },
    series: [
      { name: '企业工会', type: 'bar', stack: 'rev', data: [120, 380, 950, 2200, 4500], barWidth: 30, itemStyle: { borderRadius: [0, 0, 0, 0] } },
      { name: '商业保险', type: 'bar', stack: 'rev', data: [30, 150, 520, 1300, 2800] },
      { name: '街道/民政', type: 'bar', stack: 'rev', data: [60, 220, 680, 1500, 3200] },
      { name: '个人付费', type: 'bar', stack: 'rev', data: [40, 180, 620, 1600, 3600], itemStyle: { borderRadius: [4, 4, 0, 0] } }
    ]
  });
  window.addEventListener('resize', function() { chart4.resize(); });

  // ===== Chart 5: Roadmap (dual line) =====
  var chart5 = echarts.init(document.getElementById('chart-roadmap'), null, { renderer: 'svg' });
  chart5.setOption({
    animation: false,
    color: [accent, accent2],
    tooltip: Object.assign({ trigger: 'axis' }, commonTooltip),
    legend: {
      data: ['累计服务家庭', '注册志愿者'],
      textStyle: { color: muted, fontSize: 12 },
      top: 10
    },
    grid: { top: 50, right: 30, bottom: 50, left: 70 },
    xAxis: {
      type: 'category',
      data: ['M3', 'M6', 'M9', 'M12', 'M18', 'M24', 'M30', 'M36'],
      axisLine: { lineStyle: { color: rule } },
      axisLabel: { color: muted, fontSize: 12 }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: rule, type: 'dashed', opacity: 0.5 } },
      axisLabel: { color: muted, fontSize: 11 }
    },
    series: [
      {
        name: '累计服务家庭',
        type: 'line',
        smooth: true,
        data: [80, 500, 1800, 4500, 18000, 45000, 80000, 120000],
        lineStyle: { width: 3 },
        symbol: 'circle',
        symbolSize: 9,
        areaStyle: { color: accent + '22' },
        label: {
          show: true,
          position: 'top',
          color: ink,
          fontSize: 11,
          fontWeight: 700,
          formatter: function(p) {
            if (p.value >= 10000) return (p.value / 10000) + '万';
            return p.value;
          }
        }
      },
      {
        name: '注册志愿者',
        type: 'line',
        smooth: true,
        data: [120, 600, 2200, 5500, 20000, 50000, 90000, 150000],
        lineStyle: { width: 3 },
        symbol: 'circle',
        symbolSize: 9,
        areaStyle: { color: accent2 + '22' },
        label: {
          show: true,
          position: 'bottom',
          color: ink,
          fontSize: 11,
          fontWeight: 700,
          formatter: function(p) {
            if (p.value >= 10000) return (p.value / 10000) + '万';
            return p.value;
          }
        }
      }
    ]
  });
  window.addEventListener('resize', function() { chart5.resize(); });

})();
