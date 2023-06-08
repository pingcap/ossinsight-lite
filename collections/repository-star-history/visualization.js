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
  const repos = Array.from(new Set([...rawData.map((row) => row.full_name)]).values());
  const days = [...rawData.map((row) => row.time)].sort();
  const datasets = repos.map((repo) => {
    const stars = rawData
      .filter((row) => row.full_name === repo)
      .map((row) => ({
        x: row.time,
        y: row.stars
      }));
      return {
        label: repo,
        data: stars,
        lineTension: 0.4,
      }
  });

  const data = {
    labels: repos,
    datasets: datasets,
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    bezierCurve : true,
    plugins: {
      title: {
        display: true,
        text: 'Star History',
        padding: 10
      },
      legend: {
        position: 'top',
      }
    },
    scales: {
      x: {
        axis: 'x',
        type: 'timeseries',
        time: {
          minUnit: 'day',
        },
        offsetAfterAutoskip: true,
        min: days[0],
        max: days[days.length - 1],
        adapters: {
          date: {
            locale: 'en',
          },
        },
        grid: {
          lineWidth: 0,
        },
        border: {
          width: 1,
          color: '#444'
        },
        autoSkipPadding: 10
      },
      y: {
        grid: {
          lineWidth: 0,
        },
        border: {
          width: 1,
          color: '#444'
        }
      }
    },
    clip: {left: 30, top: 20, right: 30, bottom: 20}
  };

  return {
    type: 'line',
    data,
    options
  }
}

/**
 * @typedef RawData
 * @property {number} repo_id
 * @property {string} full_name
 * @property {string} time
 * @property {number} stars
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