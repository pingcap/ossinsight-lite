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
  const languages = rawData.map((row) => row.language);
  const prs = rawData.map((row) => row.count);
  const presetColors = [
      '#34A352',
      '#D34764',
      '#FF9D36',
      '#FFD7AD',
      '#2F92FF',
      '#BCDAFF'
  ];
  const areaColors = languages.map((language, index) => {
    return presetColors[index % presetColors.length];
  });
  const borderColors = languages.map((language, index) => {
    return presetColors[index % presetColors.length] + 'C0';
  });
  const data = {
    labels: languages,
    datasets: [
      {
        data: prs,
        borderWidth: 1,
        borderColor: borderColors,
        backgroundColor: areaColors,
      }
    ],
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Most Used Languages In Contributions',
        padding: 10
      },
      legend: {
        position: 'top',
      }
    },
    clip: {left: 30, top: 20, right: 30, bottom: 20},
  };

  return {
    type: 'pie',
    data,
    options
  }
}

/**
 * @typedef RawData
 * @property {number} language
 * @property {number} count
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