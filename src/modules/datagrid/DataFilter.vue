<template>
    <div class="dg-filter">
        <div class="dg-filter-widget">
            <div class="dg-filter-widget-header" v-if="!hideTitle">
                <h3>{{lang.infoCourt}}</h3>
            </div>
            <div class="dg-filter-widget-body">
                <a-form ref="filterFrm" :model="model" layout="vertical" >
                    <template v-for="item in schema" >
                        <a-form-item v-if="item.filterable && item.filter && item.filter.type && item.filter.showSideFilter !== false"
                                  :key="item.index">
                            <component
                                :is="element(item.filter.type)"
                                :model="{form: model, component: item.model}"
                                :label="item.filter.label ? item.filter.label : item.label"
                                :meta="setMeta(item)"
                                :relation_data="getRelation"
                                :filterData="filterData"
                            >
                            </component>
                        </a-form-item>
                    </template>
                    <a-form-item>
                        <a-button type="primary" long @click="filterData(1)" block>
                            <template #icon><SearchOutlined /></template>
                            {{lang.filtering}}
                        </a-button>
                    </a-form-item>
                    <br/>
                </a-form>
            </div>

        </div>

        <GridRowUpdate :permissions="permissions" :model="model" :schema="schema" :url="url" :inFilter="true" :schemaID="schemaID" :refresh="refresh"  />
    </div>
</template>

<script>
    import {element} from "./elements/filterElements";
    import GridRowUpdate from "./GridRowUpdate";
    import {getOptionsData} from "../../utils/relation";

    import { SearchOutlined } from '@ant-design/icons-vue';
    import {getRelationData} from "../dataform/utils/helpers";
    export default {
        props: ["model", "schema", "schemaID", "permissions", "url", 'hideTitle', 'filterData', "refresh"],
        components:{
            GridRowUpdate:GridRowUpdate,
            SearchOutlined
        },
        data(){
          return {
              relations: {},
          }
        },

        computed: {
            lang() {
                const labels = ['infoCourt', 'filtering', 'updatedSuccessfully', 'errorOccurredWhileUpdating', 'pleaseSelectUpdateLine'
                ];
                return labels.reduce((obj, key, i) => {
                    obj[key] = this.$t('dataGrid.' + labels[i]);
                    return obj;
                }, {});
            },

        },

        methods: {
            element(type){
                return element(type, this.$customDataGridElementList);
            },
            setMeta(item) {
                item.schemaID = this.$props.schemaID;
                item.relation = item.filter.relation
                item.formType = item.filter.type
                return item;
            },

            getRelation(item) {
                let s_index = this.schema.findIndex(schema => schema.model == item.model)
                let i = s_index >= 0 ? this.schema[s_index] : item
                return getRelationData({...i, relation:i.filter.relation}, this.relations)
            },
            async getRelations(){
               this.relations = await getOptionsData(this.schemaID, '', true);
            }
        },
        async mounted() {
            await this.getRelations();
        },

    };
</script>
