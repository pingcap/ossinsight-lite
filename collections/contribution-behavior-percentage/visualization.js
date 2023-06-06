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
  const eventTypes = rawData.map((row) => row.event_type);
  const contributions = rawData.map((row) => row.contributions);
  const data = {
    labels: eventTypes,
    datasets: [
      {
        data: contributions
      }
    ],
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Contribution Behavior Percentage',
        padding: 10
      },
      legend: {
        display: false,
      },
    },
    scales: {
      r: {
        grid: {
          display: true,
          color: '#eeeeee'
        }
      }
    },
    clip: {left: 0, top: 20, right: 0, bottom: 0}
  };

  return {
    type: 'radar',
    data,
    options
  }
}

/**
 * @typedef RawData
 * @property {number} event_type
 * @property {number} contributions
 * @property {number} percentage
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