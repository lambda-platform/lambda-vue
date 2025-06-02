<template>
    <div v-if="permissions">
        <div v-if="!inFilter && permissions.u === true">
            <portal to="grid-left" >

                <div  class="row-updater float-left">
                    <div class="row-update-item" v-for="item in actionColumns" >
                        <a-button  type="primary" class="ml-3"  @click="preUpdate(item.update.label, item.update.updateForm, item.model, item.update.refresh)" >
                            <template v-if="item.update.buttonIcon" #icon >
                                <i :class="item.update.buttonIcon" class="mr-2"></i>
                            </template>
                            {{ item.update.buttonLabel }}
                        </a-button>
                    </div>
                </div>

            </portal>
        </div>

        <div class="dg-filter-widget" v-for="item in columns">
            <div class="dg-filter-widget-header">
                <h3>{{ item.update.updateLabel }}</h3>
            </div>
            <div class="dg-filter-widget-body">
                <a-form :model="item.update.updateForm" layout="vertical">
                    <a-form-item>
                        <component :is="element(item.filter.type)"
                                   :model="{form: item.update.updateForm, component: item.model}"
                                   :label="item.update.label ? item.update.label : item.label"
                                   :meta="setMeta(item)"
                                   :relation_data="getRelation"
                        >
                        </component>
                    </a-form-item>
                    <a-form-item>
                        <a-button type="primary" long
                                @click="updateRows(item.update.updateForm, item.model, item.update.refresh)">
                            {{ item.update.buttonLabel }}
                        </a-button>
                    </a-form-item>
                </a-form>
            </div>
        </div>
    </div>
</template>

<script>
import {element} from "./elements";
import {getRelationData} from "../dataform/utils/helpers";
import {getOptionsData} from "../../utils/relation";
import axios from "axios";
import {notification} from 'ant-design-vue';
export default {

    props: ["model", "schema", "schemaID", "permissions", "url", "inFilter"],
    name: "GridRowUpdate",
    computed: {
        // ...mapGetters({
        //     user: "user"
        // }),
        lang() {
            const labels = ['infoCourt', 'filtering', 'updatedSuccessfully', 'errorOccurredWhileUpdating', 'pleaseSelectUpdateLine'
            ];
            return labels.reduce((obj, key, i) => {
                obj[key] = this.$t('dataGrid.' + labels[i]);
                return obj;
            }, {});
        },
        columns(){
            return this.schema.filter(ii=>ii.updateable && ii.update && ii.filter.type && this.permissions.u === true && this.inFilter)
        },
        actionColumns(){
            return this.schema.filter(ii=>ii.updateable && ii.update && ii.filter.type)
        }
    },
    async mounted() {
        await this.getRelations();
    },
    data(){
        return {
            relations: {},
        }
    },
    methods: {
        element: element,
        setMeta(item) {
            item.schemaID = this.$props.schemaID;
            item.relation = item.filter.relation
            item.formType = item.filter.type
            return item;
        },
        preUpdate(value, updateForm, model, refresh){
            updateForm[model] = value
            this.updateRows(updateForm, model, refresh)
        },
        updateRows(updateForm, model, refresh) {


            let selectedNodes = this.inFilter ? this.$parent.$parent.gridApi.getSelectedNodes() :  this.$parent.gridApi.getSelectedNodes();

            let selectedData = selectedNodes.map(node => {
                let indentity = this.inFilter ? this.$parent.$parent.identity :this.$parent.identity;
                return node.data[indentity];
            });
            if (selectedData.length >= 1) {
                let updateData = {
                    ids: selectedData,
                    value: updateForm[model],
                    model: model
                };
                let baseUrl = this.$props.url ? this.$props.url : '';
                axios.post(`${baseUrl}/lambda/krud/update-row/${this.schemaID}`, updateData).then(res => {
                    if (res.data.status) {
                        if (refresh) {
                            if(this.refresh){
                                this.refresh();
                            } else {
                                this.inFilter ? this.$parent.$parent.refresh() : this.$parent.refresh();
                            }
                        }

                        notification["success"]({
                            message: this.lang.updatedSuccessfully,
                        });
                    } else {

                        notification["error"]({
                            message: this.lang.errorOccurredWhileUpdating,
                        });
                    }
                }).catch(e => {
                    notification["error"]({
                        message: this.lang.errorOccurredWhileUpdating,
                    });
                });

            } else {

                notification["error"]({
                    message: this.lang.pleaseSelectUpdateLine,
                });
            }

        },
        getRelation(item) {

            let s_index = this.columns.findIndex(schema => schema.model === item.model)
            let i = s_index >= 0 ? this.columns[s_index] : item

            return getRelationData({...i, relation:i.filter.relation}, this.relations)
        },
        async getRelations(){
            let schema = []
            this.schema.forEach(s=>{
                if(s.updateable){
                    schema.push({
                        ...s, formType: s.filter.type, relation:s.filter.relation
                    })
                }
            });

            this.relations = await getOptionsData(this.schemaID, "", true, schema);
        }
    }
}
</script>

