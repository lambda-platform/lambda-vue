<template>
    <section class="print-container">
        <div class="print-tools no-print">
            <div class="print-tools-left">
                <label>{{lang.paperSize}}</label>
                <a-select v-model:value="selectedPageSize" @change="changeCss" size="small" style="max-width:160px">
                    <a-select-option disabled :value="null">{{ lang.selectPaperSize }}</a-select-option>
                    <a-select-option value="A3">A3</a-select-option>
                    <a-select-option value="A3 landscape">A3 {{ lang.landScape }}</a-select-option>
                    <a-select-option value="A4">A4</a-select-option>
                    <a-select-option value="A4 landscape">A4 {{ lang.landScape }}</a-select-option>
                    <a-select-option value="A5">A5</a-select-option>
                    <a-select-option value="A5 landscape">A5 {{ lang.landScape }}</a-select-option>
                </a-select>
            </div>

            <div class="print-tools-right">


                <span class="link link-icon" v-shortkey="['ctrl', 'p']" @click="printPage" >
                    <span class="svg-icon ">
                              <inline-svg
                                  src="/assets/icons/duotone/Devices/Printer.svg"
                              />
                    </span>
                        Хэвлэх
                </span>
            </div>
        </div>

        <div class="print-body" v-bind:class="[pageClass, printOnly]">

            <a-spin size="large" :spinning="true" v-if="isLoading" />
            <section id="printArea" class="sheet padding-5mm print-only">
                <div class="print-title">
                    <h2 class="align-center ">{{gridTitle}}</h2>

                    <ul class="filter-info">
                        <li v-for="filterInfo in filterInfos" :key="filterInfo.index"><span class="info-label">{{filterInfo.label}}:</span> {{filterInfo.value}}</li>
                    </ul>
                </div>
                <table border="1" class="print-table">
                    <thead v-if="header != null">
                    <tr v-for="tr in computedHeader" :key="tr.index">
                        <td
                            v-for="td in tr.children"
                            :key="td.index"
                            :colspan="td.colspan"

                            :rowspan="td.rowspan">
                            <div :class="td.rotate ? 'vertical-column' : ''">
                                <div>{{ td.label }}</div>
                            </div>
                        </td>
                    </tr>
                    </thead>
                    <thead v-else>
                    <tr>
                        <td
                            v-for="td in computedSchema"
                            :key="td.index"
                            :colspan="td.colspan"
                            :rowspan="td.rowspan">
                            {{ td.label }}
                        </td>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="tr in data" :key="tr.index">
                        <td v-for="td in computedSchemaBody" :key="td.index">
                            <span v-html="printCell(tr, td)"></span>
                        </td>
                    </tr>
                    </tbody>
                </table>

            </section>
        </div>
    </section>
</template>

<script>
import axios from "axios"
import {Printd} from 'printd'
import {getPrintStyles} from "./utils/printStyles"
import {getOptionsData} from "../../utils/relation";
import {dataFromTemplate, evil} from "./utils/formula";
import {formatedNumber, getNumber, number} from "./utils/number";

export default {
    props: ["schemaID", "pageSize", "header", "schema", "info", "query", "filter", "search", "isNumber", "gridTitle", "aggregations"],

    data() {
        return {
            isLoading: true,
            isFalse: false,
            isTrue: true,
            total: 0,
            data: [],
            scrollOptions: {
                height: '100%',
                size: 7,
                railVisible: true,
                railOpacity: 0.2,
                alwaysVisible: true,
                wheelStep: 5,
                color: '#2C3A47'
            },

            templatecss: " @media print{@page {size: A4}}",
            valute: '',
            selectedPageSize:"",
            filterInfos:[]
        }
    },

    created() {
        this.d = new Printd();
        this.templatecss = " @media print{@page {size: " + this.pageSize + "}}";
        this.selectedPageSize = this.pageSize;
        this.fetchPrintData();

        this.getRelations();
    },

    computed: {

        lang() {
            const labels = ['type', 'selectPaperSize', 'paperSize', 'landScape', 'currencySelection', 'tugrug', 'dollar', 'euro', 'yen', 'austDollar', 'rubli',
                'reboot', 'print', '', '', '', '', '', '',

            ];
            return labels.reduce((obj, key, i) => {
                obj[key] = this.$t('dataGrid.' + labels[i]);
                return obj;
            }, {});
        },
        pageClass() {
            return this.selectedPageSize;
        },

        computedSchema() {
            return this.schema.filter(td => (td.printable && !td.hide))
        },

        computedSchemaBody() {
            return this.schema.filter(td => td.printable)
        },

        printOnly() {
            return 'print-only';
        },

        computedHeader(){
            if(this.header !== null){
                return this.header.structure.map((tr) => {
                    tr.children = tr.children.filter(td => {
                        if(td.label!=='#'){
                            const tdIndex =  this.schema.findIndex(col => col.model === td.model)
                            if(tdIndex >= 0) {
                                return this.schema[tdIndex].printable
                            } else {
                                return true;
                            }



                        }
                    });
                    return tr;
                });
            }
            return this.header;
        }
    },

    methods: {
        isPrintAble(td){
            return true;
        },
        cssPagedMedia: (function () {
            var style = document.createElement('style');
            document.head.appendChild(style);
            return function (rule) {
                style.innerHTML = rule;
            };
        }()),

        changeCss() {
            this.templatecss = " @media print{@page {size: " + this.pageSize + "}}";
        },

        printPage() {
            this.d.print(document.getElementById('printArea'), [this.templatecss, getPrintStyles]);
        },
        refreshData() {
            alert(this.valute);
        },

        fetchPrintData() {
            this.isLoading = true;
            let url = `/lambda/krud/print/${this.schemaID}`;
            let filters = Object.keys(this.filter)
                .filter(e => this.filter[e] !== null)
                .reduce((o, e) => {
                    o[e] = this.filter[e];
                    return o;
                }, {});

            axios.post(url, filters)
                .then(({data}) => {
                    this.data = data;
                    this.isLoading = false;


                    if(this.aggregations){
                        if (this.aggregations.columnAggregations.length >= 1) {
                            this.fetchAggregations(filters);
                        }
                    }

                })
                .catch(e => {
                    this.isLoading = false;
                });
        },
        fetchAggregations(filters) {
            this.aggregations.loading = true;
            this.aggregations.forumlaResult = '';
            this.aggregations.data = [];
            axios.post(`/lambda/puzzle/grid/aggergation/${this.$props.schemaID}`, filters).then(({data}) => {
                let mirror_data = {};
                let bottom_data = {};

                this.aggregations.columnAggregations.map(columnAggregation => {
                    let aggregation = columnAggregation.aggregation;
                    let column = columnAggregation.column;
                    if (data.length >= 1) {
                        let colIndex = this.schema.findIndex(col => col.model === column);
                        let data_key = aggregation + '_' + column;
                        if (data[0][data_key] == undefined) {
                            data_key = data_key.toLowerCase();
                        }
                        mirror_data[columnAggregation.column] = data[0][data_key];
                        if (colIndex >= 0) {
                            if (this.schema[colIndex].gridType == 'Number') {
                                bottom_data[column] = formatedNumber(data[0][data_key])+ ' ' ;
                            } else {
                                bottom_data[column] = number(data[0][data_key]) + ' ' + columnAggregation.symbol;
                            }
                        }

                    }
                });
                this.data.push(bottom_data)


            }).catch(e => {
                console.log(e.message);
            });
        },

        printCell(tr, td) {

            switch (td.gridType) {
                case "Number":
                    return Number(tr[td.model]).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
                case "Image":
                    return `<img src="${tr[td.model]}"/>`
                case "Html":
                    return tr[td.model];
                case "Date":
                    return tr[td.model] != null ? tr[td.model].substr(0, 10) : ''
                default:
                    return tr[td.model]
            }
        },
        async getRelations(){
            this.filterInfos = [];
            let filterSchema = [];

            const filteredKeys = Object.keys(this.filter).filter(k=>this.filter[k] !== null && this.filter[k] !== '');

            if(filteredKeys && filteredKeys.length >= 1){
                this.schema.forEach(s=>{
                    let filterIndex = filteredKeys.findIndex(k=>k===s.model)
                    if(s.filterable && filterIndex >= 0){
                        filterSchema.push({
                            ...s, formType: s.filter.type, relation:s.filter.relation
                        })
                    }
                });

                const relations = await getOptionsData(filterSchema, undefined, '');


                this.filterInfos = filterSchema.map(field=>{
                    if(field.filter.type === "Select"){
                        if(relations[field.model]){
                            let rIndex = relations[field.model].data.findIndex(r=>r.value === this.filter[field.model])
                            return {
                                "label":field.filter.label ? field.filter.label : field.label,
                                "value":rIndex >= 0 ? relations[field.model].data[rIndex].label : this.filter[field.model]
                            }
                        } else {

                            let rIndex = relations[field.relation.table].data.findIndex(r=>r.value === this.filter[field.model])
                            return {
                                "label":field.filter.label ? field.filter.label : field.label,
                                "value":rIndex >= 0 ? relations[field.relation.table].data[rIndex].label : this.filter[field.model]
                            }
                        }

                    } else  if(field.filter.type === "DateRange"){
                        return {
                            "label":field.filter.label ? field.filter.label : field.label,
                            "value":(Array.isArray(this.filter[field.model])) ? this.filter[field.model].join(" - ") : this.filter
                        }
                    } else {
                        return {
                            "label":field.filter.label ? field.filter.label : field.label,
                            "value":this.filter[field.model]
                        }
                    }

                })

            }




        }
    }
};
</script>

<style lang="scss">
@import "scss/print.scss";
</style>
