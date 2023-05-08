import MonacoEditorPlugin from 'monaco-editor-webpack-plugin'

export default {
  plugins: [
    new MonacoEditorPlugin({
      languages: ['mysql'],
    })
  ]
}
