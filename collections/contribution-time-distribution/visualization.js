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
  const maxRadius = Math.max(...rawData.map(({cnt}) => cnt));
  const hours = new Array(24).fill(0).map((_, i) => i);
  const getDayofweek = (dayofweek) => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayofweek];
  const data = {
    datasets: [
      {
        data: rawData.map(({dayofweek, hour, cnt}) => {
          return {
            x: String(hour),
            y: getDayofweek(dayofweek),
            cnt,
            r: cnt * (1/ maxRadius) * 15,
          }
        }),
        pointStyle: 'circle'
      }
    ],
  };


  const options = {
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Contribution Time Distribution (UTC)',
        padding: 10
      },
      legend: {
        display: false,
      },
    },
    layout: {
      padding: 10
    },
    scales: {
      x: {
        type: 'category',
        labels: hours.map(hour => String(hour)),
        title: {
          display: true,
          text: 'Hour',
          align: 'end'
        }
      },
      y: {
        type: 'category',
        labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        offset: true
      }
    },
    clip: {left: 0, top: 20, right: 0, bottom: 0}
  };

  return {
    type: 'bubble',
    data,
    options
  }
}

/**
 * @typedef RawData
 * @property {number} dayofweek
 * @property {number} hour
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
