/**
 * This is an example remote SQL Chart widget for OSSInsight lite.
 */

/**
 * Default exported function accept executed data from template.sql, and returns chart.js config object { data, options }
 *
 * @param {RawData[]} rawData from executed SQL
 * @param {ThemeInfo} theme
 * @returns {ChartJsConfig}
 */
export default function (rawData, theme) {
  const {colors: {red, green, yellow, cyan}} = theme;
  const lineColors = [
    red['500'],
    green['500'],
    yellow['500'],
    cyan['500'],
  ];

  const areaColors = [
    red['200'],
    green['200'],
    yellow['200'],
    cyan['200'],
  ];

  const data = {
    labels: ['issue', 'pull_request', 'issue_comment', 'commit_comment'],
    datasets: ['issue', 'pull_request', 'issue_comment', 'commit_comment'].map((dim, index) => ({
      type: 'line',
      data: rawData
        .filter(x => x.type === dim)
        .map(({month, cnt}) => ({
          x: month,
          y: cnt,
        })),
      label: dim,
      borderColor: lineColors[index],
      borderWidth: 1,
      pointRadius: 0,
      backgroundColor: areaColors[index] + 'c0',
      fill: true,
    })),
  };

  const options = {
    maintainAspectRatio: false,
    scales: {
      x: {
        axis: 'x',
        type: 'time',
        min: rawData[0].month,
        max: rawData[rawData.length - 1].month,
        time: {},
        adapters: {
          date: {
            locale: 'en',

          },
        },
      },
    },
    plugins: {
      title: {
        display: true,
        text: 'Activity trends by month',
      },
      legend: {
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          boxHeight: 4,
          boxPadding: 0,
          textAlign: 'left',
        },
      },
    },
  };

  return {
    type: 'line',
    data,
    options
  }
}

/**
 * @typedef RawData
 * @property {string} month
 * @property {string} type
 * @property {number} cnt
 */

/**
 * @typedef ThemeInfo
 * @property {import('tailwindcss').colors} colors
 */

/**
 * @typedef ChartJsConfig
 * @property {import('chart.js').ChartType} type
 * @property {import('chart.js').ChartData} data
 * @property {import('chart.js').ChartOptions} options
 */