<template>
    <tr>
        <td class="row-number" v-if="f.showRowNumber">
            <slot name="rowNumber"></slot>
        </td>
        <td v-for="item in f.schema.filter(i=>typeof i.formType !== 'undefined' && i.formType !== null
            && i.model && isShowAble(i.model) && i.model!==f.identity
            && i.model!==f.parent && i.model!=='updated_at'
            && i.model!=='created_at' && !i.hidden)"

            :key="item.index">
            <component :is="element(item.formType)"
                       :model="{form: model, component: item.model}"
                       v-if="model"
                       :url="url"
                       size="small"
                       :label="item.label !== '' ? item.label : `[${item.model}]`"
                       :meta="setMeta(item)"
                       :getSchemaRelationByModel="getSchemaRelationByModel"
                       @edit="edit"
                       :relation_data="getRelation"
                       :rowIndex="rowIndex"

            >
            </component>
        </td>
        <td class="action" >
            <slot name="action"></slot>
        </td>
        <td class="action-for-view" v-if="viewMode">
            <slot name="view"></slot>
        </td>
    </tr>
</template>

<script>
    import {element} from "../index";
    import {doFormula, doTrigger} from "../../utils/formula_and_trigger.js";
    import {getRelationData} from "../../utils/helpers";

    export default {
        props: ["f", "model", "editMode", "relations", "formula", "schema", "url", "rowIndex", "viewMode"],
        emits:["edit"],
        created() {

            this.f.data = {};
            this.f.schema.forEach(item => {

                if (this.f.identity == item.model || item.formType == null) {
                    return;
                }
                if (
                    this.f.timestamp &&
                    (item.model == "created_at" || item.model == "updated_at")
                ) {
                    return;
                }
                if (this.editMode) {
                    this.setModel(item.model, this.model[item.model], item.formType);
                } else {
                    this.setModel(item.model, item.default, item.formType);
                }

                this.$watch("model." + item.model, {
                    handler: (value, oldValue) => {
                        this.afterChange(item.model, value, oldValue);
                    },
                    deep: true
                });
            });
        },

        methods: {
            isShowAble(model) {
                if(this.schema){
                    let index = this.schema.findIndex(item => item.model == model);
                    if(index >= 0){
                        return !this.schema[index].hidden;
                    }
                    return false
                }
                return true;


            },
            element: element,
            setModel(name, value, type) {
                switch (type) {
                    case "Switch":
                        let val = false;
                        if (value == "true" || value == 1) {
                            val = true;
                        }
                        this.model[name] = val;
                        this.f.data[name] = val;
                        break;
                    case "Checkbox":
                        let val_ = 0;
                        if (value == "true" || value == 1) {
                            val_ = 1;
                        }
                        this.model[name] = val_;
                        this.f.data[name] = val_;
                        break;

                    default:
                        this.f.data[name] = value;
                }
            },

            setMeta(item) {
                delete item["table"];
                delete item["rules"];
                delete item["label"];
                delete item["span"];
                delete item["default"];

                return item;
            },

            getSchemaIndex(model) {
                return this.f.schema.findIndex(item => item.model == model);
            },

            afterChange(model, val, oldValue) {
                doTrigger(model, val, this.model, this.f.schema, this.$refs, this.$Notice);
                doFormula(this.formula, model, this.model, this.f.schema, this.f.rule, this.f.model);
            },

            getSchemaRelationByModel(model) {
                let index = this.f.schema.findIndex(item => item.model == model);
                if (index >= 0)
                    return getRelationData(this.f.schema[index], this.relations)
                else
                    return null
            },
            getRelation(item) {
                return getRelationData(item, this.relations)
            },
            edit(){
                this.$emit("edit")
            }
        }
    };
</script>

