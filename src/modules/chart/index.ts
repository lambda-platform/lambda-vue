import { App } from "vue";
import { defineAsyncComponent } from 'vue';

/**
 * Initialize Chart component
 * @param app vue instance
 */
export function installChart(app: App<Element>) {
    const AsyncChart = defineAsyncComponent(() => import("./Chart.vue"));
    const AsyncChartRest = defineAsyncComponent(() => import("./ChartRest.vue"));

    app.component("Chart", AsyncChart);
    app.component("ChartRest", AsyncChartRest);
}
