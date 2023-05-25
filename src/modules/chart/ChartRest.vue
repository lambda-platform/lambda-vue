<template>
    <div :class="chartType == 'AreaChart' || chartType == 'LineChart' || chartType == 'ColumnChart' ? 'chart-element-wide' : chartType == 'countBox' ? 'count-box' :'chart-element'" v-if="!loading" :style="minH ? `min-height: ${minH}`: ''">
        <Spin size="large" fix v-if="loading"></Spin> <component v-else :is="element(chartType)" :isRest="true" :type="chartType" :chartTitle="title" :chart_title="title" :chartData="chartData" :xData="xData" v-bind="currentProperties" :minH="minH" :hideTitle="hideTitle" :filters="filters" :hideZoom="hideZoom" :chartColor="chartColor" :chart_filter="chart_filter" :id="id"></component>
    </div>
</template>

<script>

import axios from 'axios'
import {element} from "./elements";
export default {
    props: ["src", "id", "title", "chart_filter", "hideTitle", "filters", "hideZoom", "APIurl", "chartType", "minH", "chartColor", ],
    data() {
        return {
            currentProperties: null,
            chartData:null,
            xData:null,
            loading:true
        };
    },
    methods: {
        init() {
            this.loading = true;
            axios.post(this.$props.APIurl, {filters:this.filters}).then(o => {
                   this.chartData= o.data.data.data;
                   this.xData= o.data.data.xdata;
                   this.loading = false;
                }).catch(o => {
                    console.log(o);
                });
        },
        element: element,

    },

    mounted() {
        this.init();
    },


    computed: {
        // currentProperties: function () {
        //     return {
        //         chart_title: this.title,
        //         ...JSON.parse(this.source)
        //     };
        // },
        // type: function () {
        //     let source = JSON.parse(this.source);
        //     return source.type
        // },
    }
};
</script>
