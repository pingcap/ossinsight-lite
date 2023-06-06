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
  const {colors: { sky }} = theme;
  const lineColors = [
    sky['800'],
    sky['700'],
    sky['600'],
    sky['500'],
    sky['400'],
    sky['300']
  ];

  const areaColors = [
    sky['800'],
    sky['700'],
    sky['600'],
    sky['500'],
    sky['400'],
    sky['300']
  ];

  const data = {
    labels: ['xs', 's', 'm', 'l', 'xl', 'xxl'],
    datasets: ['xs', 's', 'm', 'l', 'xl', 'xxl'].map((dim, index) => ({
      type: 'bar',
      data: rawData
        .map((row) => ({
          x: row['event_month'],
          y: row[dim],
        })),
      label: dim.toUpperCase(),
      borderColor: lineColors[index],
      backgroundColor: areaColors[index] + 'c0',
    })),
  };

  const options = {
    maintainAspectRatio: false,
    scales: {
      x: {
        axis: 'x',
        type: 'time',
        min: rawData[0].event_month,
        max: rawData[rawData.length - 1].event_month,
        time: {
          unit: 'month',
        },
        adapters: {
          date: {
            locale: 'en',
          },
        },
        stacked: true,
      },
      y: {
        stacked: true,
      }
    },
    plugins: {
      title: {
        display: true,
        text: 'Pull Request Size History (Last 1 year)',
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
    type: 'bar',
    data,
    options
  }
}

/**
 * @typedef RawData
 * @property {string} event_month
 * @property {number} xs
 * @property {number} s
 * @property {number} m
 * @property {number} l
 * @property {number} xl
 * @property {number} xxl
 * @property {number} all_size
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