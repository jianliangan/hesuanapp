module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/vue3-essential',
   
  ],
  parserOptions: {
    parser: '@typescript-eslint/parser'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "off",
    'vue/multi-word-component-names': 'off',
  },
  globals: {
    ElMessage: "readonly",
    ElMessageBox: "readonly",
    ElLoading: "readonly",
  }
}
