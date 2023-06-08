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
  const repos = rawData.reduce((arr, row) => {
    if (!arr.includes(row.repo_full_name)) {
      arr.push(row.repo_full_name);
    }
    return arr;
  }, []);
  const months = [...rawData.map((row) => row.month)].sort();
  const datasets = repos.map((repo) => {
    const stars = rawData
      .filter((row) => row.repo_full_name === repo)
      .map((row) => ({
        x: row.month,
        y: row.issues
      }));
      return {
        label: repo,
        data: stars
      }
  });

  const data = {
    labels: repos,
    datasets: datasets,
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Monthly Opened Issues',
        padding: 10
      },
      legend: {
        position: 'top',
      },
    },
    scales: {
      x: {
        axis: 'x',
        type: 'time',
        time: {
          unit: 'month',
        },
        min: months[0],
        max: months[months.length - 1],
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
          color: '#d4d7db'
        },
      },
      y: {
        grid: {
          lineWidth: 0,
        },
        border: {
          width: 1,
          color: '#d4d7db'
        },
      }
    },
    clip: {left: 0, top: 20, right: 0, bottom: 0}
  };

  return {
    type: 'bar',
    data,
    options
  }
}

/**
 * @typedef RawData
 * @property {number} repo_id
 * @property {string} repo_full_name
 * @property {string} month
 * @property {number} issues
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