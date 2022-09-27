import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/display.css'
import { createApp } from 'vue'
import App from './App.vue'

import router from './router'
import store from './store'
import jiarui from './jiarui'
import i18n from './locales'
import ajTable from './components/ajTable/index.vue'
import ajHotTable from './components/ajHotTable/index.vue'
import ajTree from './components/ajTree/index.vue'
import ajSelectInput from './components/ajSelectInput/index.vue'
import * as scIcons from './assets/icons'

import { HotTable, HotColumn } from "@handsontable/vue3";

const app = createApp(App)
app.use(store).use(ElementPlus).use(i18n).use(router).use(jiarui).mount('#app')
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(`ElIcon${key}`, component)
}
for (let icon in scIcons) {
    app.component(`ScIcon${icon}`, scIcons[icon as keyof typeof scIcons])
}
app.component("ajTable", ajTable)
app.component("ajHotTable", ajHotTable)
app.component("ajTree", ajTree)
app.component("ajSelectInput", ajSelectInput)

app.component("HotTable", HotTable)
app.component("HotColumn", HotColumn)