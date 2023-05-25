import { defineAsyncComponent,  } from 'vue'

export const element = (type) => {
    if (type !== null && typeof type !== "undefined") {
        switch (type) {
            case "AreaChart":
            case "LineChart":
            case "ColumnChart":
                return defineAsyncComponent(() => import(/* webpackChunkName: "chart-Area" */'./AreaLine.vue'));

            case "PieChart":
            case "TreeMapChart":
            case "FunnelChart":
                return defineAsyncComponent(() => import(/* webpackChunkName: "chart-Pie" */'./Pie.vue'));

            case "DataTable":
                return defineAsyncComponent(() => import(/* webpackChunkName: "chart-Table" */'./Table.vue'));


            case "Radar":
                return defineAsyncComponent(() => import(/* webpackChunkName: "chart-Radar" */'./Radar.vue'));


            case "countBox":
                return defineAsyncComponent(() => import(/* webpackChunkName: "chart-CountBox" */'./CountBox.vue'));


            default:
                return undefined;
        }
    }
    return undefined;
}
