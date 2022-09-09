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
import * as scIcons from './assets/icons'
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