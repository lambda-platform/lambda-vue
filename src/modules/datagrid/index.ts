import { App } from "vue";
import { defineAsyncComponent } from 'vue'

/**
 * Initialize DataGrid component
 * @param app vue instance
 */
export function installDataGrid(app: App<Element>) {

    const AsyncDatagrid = defineAsyncComponent(() => import("./Datagrid.vue"));

    app.component("datagrid", AsyncDatagrid);
}
