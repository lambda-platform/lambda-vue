<template>
    <div class="subform-grid sub-modal-form" :style="subStyle">
        <div class="subform-header" v-if="!form.min_height && !form.disableCreate && !viewMode">
            {{ form.name }}
            <a-button shape="circle" type="success" size="small" @click="add"
                      class="sub-form-add-btn">
                <template #icon>
                     <span class="svg-icon ">
                                 <inline-svg
                                     src="/assets/icons/duotune/general/gen041.svg"
                                 />
                        </span>
                </template>
            </a-button>
        </div>

        <table class="sub-form-grid" border="1" v-if="form.min_height ? true : this.listData.length >= 1">
            <thead>
            <tr>
                <th class="row-number" v-if="form.showRowNumber">ДД</th>
                <th @click="sort(item)" v-for="item in form.schema.filter(i=>i.label !== '' && !i.hidden)"
                    :key="item.index">
                    <div class="th-title">
                        {{ item.label }} <i class="ti-exchange-vertical"/></div>
                </th>
                <th class="action" v-if="!form.disableEdit || !form.disableDelete" >...</th>
                <th class="action-for-view" v-if="viewMode" >...</th>
            </tr>
            </thead>

            <tbody>

            <grid-form v-for="(item, index) in listData"
                       :key="index"
                       :rowIndex="index"
                       :f="item.form"
                       :model="item.model"
                       :editMode="editMode"
                       :viewMode="viewMode"
                       :relations="relations"
                       :formula="formula"
                       :schema="form.schema"
                       @edit="()=>edit(index)"
            >
                <template #action >
                    <a href="javascript:void(0);" class="btn btn-icon sub-edit" @click="edit(index)"   v-if="!form.disableEdit">
                        <span class="svg-icon ">
                                  <inline-svg
                                      src="/assets/icons/duotone/Design/Edit.svg"
                                  />
                        </span>
                    </a>

                    <a href="javascript:void(0);" class="btn btn-icon" @click="remove(index)"  v-if="!form.disableDelete">
                        <span class="svg-icon ">
                                  <inline-svg
                                      src="/assets/icons/duotone/General/Trash.svg"
                                  />
                        </span>
                    </a>
                </template>

                <template #view >
                    <a href="javascript:void(0);" class="btn btn-icon sub-edit" @click="edit(index)"   v-if="viewMode">
                        <span class="svg-icon ">
                                  <inline-svg
                                      src="/assets/icons/duotone/General/Visible.svg"
                                  />
                        </span>
                    </a>
                </template>

                <template #rowNumber v-if="form.showRowNumber">
                    <span>{{index+1}}</span>
                </template>
            </grid-form>
            </tbody>
            <tfoot v-if="hasEq">
            <tr>
                <td v-for="(item, index) in equationData" :key="index">
                    <span v-if="item.preStaticWord!=null && item.preStaticWord!=''"> {{ item.preStaticWord }} </span>
                    <span v-if="item.hasEquation">{{ item.data.toLocaleString() }}</span>
                    <span v-if="item.prefix!=null && item.prefix!=''"> {{ item.prefix }}</span>
                </td>
                <td>
                </td>
            </tr>
            </tfoot>
        </table>
        <a class="sub-grid-add" href="javascript:void(0)" @click="add" v-if="form.min_height">
             <span class="svg-icon ">
                                 <inline-svg
                                     src="/assets/icons/duotune/general/gen041.svg"
                                 />
                        </span>
            {{ lang.save }}
        </a>


        <a-modal
            :min-width="200"
            :min-height="100"
            :draggable="true"
            :footer-hide="true"
            :title="form.name"
            width="85%"
            height="85%"
            v-model:open="modal_show"
        >
            <section class="form-modal">


                <div class="form-body">

                    <dataform ref="form" v-if="modal_show" :schemaID="form.formId"
                              :do_render="modal_show"
                              :editMode="editIndex >= 0"
                              :isSubForm="true"
                              :onSuccess="onSuccess"
                              :url="url"
                              :onReady="formReady"
                              :onError="onError"></dataform>

                </div>
            </section>
            <template #footer></template>
        </a-modal>

        <a-modal
            :name="`grid-modal-${form.sourceGridID}`"
            v-model:open="modal_grid_show"
            class="form-modal"
            :min-width="200"
            :min-height="100"
            :pivot-y="0.5"
            :adaptive="true"
            :reset="true"
            :draggable="true"
            :resizable="true"
            draggable=".form-tool"
            width="85%"
            height="50%"
        >
            <section class="form-modal source-grid">
                <div class="form-tool ">

                    <h4>{{ form.sourceGridModalTitle }}</h4>
                    <div class="form-tool-actions">
                        <a href="javascript:void(0)" @click="closeSourceModal">
                            <i class="ti-close"></i>
                        </a>
                    </div>
                </div>

                <div class="form-body" v-if="modal_grid_show">

                    <div v-if="form.sourceGridTitle && form.sourceGridDescription" class="source-grid-description">
                        <h3>
                            {{form.sourceGridTitle}}
                        </h3>
                        <p v-html="form.sourceGridDescription">

                        </p>
                    </div>
                    <datagrid
                        :schemaID="form.sourceGridID"
                        :url="sourceGridUrl()"
                        :onRowSelect="onRowSelect"
                        :user_condition="user_condition"
                        :paginate="50"
                        :hasSelection="true"
                        :permissions="{
                          c:false,
                          r:true,
                          u:false,
                          d:false,
                      }"
                    />
                    <div class="add-from-pre-source">
                        <a-button shape="circle" type="primary" size="small" @click="addByFrom" :disabled="preSource.length >= 1" icon="md-add"
                                class="sub-form-add-btn">Шинээр бүртгэх</a-button>
                        <a-button shape="circle" type="success" size="small" @click="addFromPreSource" :disabled="preSource.length == 0" icon="md-add"
                                class="sub-form-add-btn">Сонгох</a-button>
                    </div>
                </div>
            </section>
            <template #footer>
            </template>
        </a-modal>
    </div>
</template>

<script>
import {element} from "../index";
import GridForm from "./GridForm";
import subFormMix from "./subFormMix";
import { Modal } from 'ant-design-vue'
export default {
    props: ["form", "model", "editMode", "relations", "formula", "url", "viewMode", "validateWithSubForm"],
    mixins: [subFormMix],
    components: {
        "grid-form": GridForm,
        "a-modal": Modal,
    },
    mounted() {
        this.equationRenderer();
        this.form.schema.forEach(field => {
            field.disabled = true;
        });
    },
    computed: {
            lang() {
                const labels = ['pleaseCompleteFirstLine', ];
                return labels.reduce((obj, key, i) => {
                    obj[key] = this.$t('dataForm.' + labels[i]);
                    return obj;
                }, {});
            },

        subStyle() {
            if (this.form.min_height) {
                return {
                    minHeight: this.form.min_height + 'px',
                    background: '#f3f4f5'
                }
            } else {
                return undefined;
            }
        },
        Lang() {
            const labels = [ 'add',];
            return labels.reduce((obj, key, i) => {
                obj[key] = this.$t('dataForm.' + labels[i]);
                return obj;
            }, {});
        },
    },
    watch: {
        listData: {
            handler: function (curr, old) {

                if (this.hasEq) {
                    this.equationData.map(eq => {
                        if (eq.hasEquation) {
                            eq.data = -1;
                            let count = 0;
                            switch (eq.equation) {
                                case "SUM": {
                                    eq.data = 0;
                                    curr.map(it => {
                                        eq.data += Number(isNaN(parseInt(it.model[eq.model], 10)) ? 0 : it.model[eq.model]);
                                    });
                                    break;
                                }
                                case "COUNT": {
                                    eq.data = 0;
                                    curr.map(it => {
                                        eq.data += Number(1);
                                    });
                                    break;
                                }
                                case "MIN": {
                                    curr.map(it => {
                                        if (eq.data == -1) {
                                            eq.data = it.model[eq.model];
                                        } else {
                                            eq.data = Math.min(eq.data, it.model[eq.model]);
                                        }
                                    });
                                    break;
                                }
                                case "MAX": {
                                    eq.data = 0;
                                    curr.map(it => {
                                        eq.data = Math.max(eq.data, it.model[eq.model]);
                                    });
                                    break;
                                }
                                case "AVG": {
                                    eq.data = 0;
                                    curr.map(it => {
                                        count++;
                                        eq.data += Number(it.model[eq.model]);
                                    });
                                    eq.data = Number(eq.data / count);
                                    break;
                                }
                            }
                        }
                    });
                }
            },
            deep: true
        }
    },
    data() {
        return {
            listData: [],
            equationData: [],
            currentSortDir: 'asc',
            hasEq: false,
            modal_show: false,
            filled: false,
            editIndex: -1,

        };
    },
    methods: {
        showAddModal() {
            this.modal_show = true;
            // this.$modal.show(`form-modal-${this.form.formId}`);
        },
        closeModal() {
            this.modal_show = false;
            this.editIndex = -1;
            // this.$modal.hide(`form-modal-${this.form.formId}`);
        },
        formReady(formData, subSchema) {
            let parentFieldIndex = subSchema.findIndex(field => field.model === this.form.parent);

            if (parentFieldIndex > 0) {
                subSchema[parentFieldIndex].hidden = true;
            }

            if (this.editIndex >= 0) {
                this.$nextTick(() => {
                    if(this.viewMode){
                        this.$refs.form.viewMode = true;
                    }
                    this.$refs.form.editModel(this.listData[this.editIndex].model[this.form.identity], {...this.listData[this.editIndex].model});


                });
            }


        },
        onError() {

        },
        onSuccess(data) {

            if (this.editIndex >= 0) {
                Object.keys(data).forEach(itemKey => {
                    if (
                        this.listData[this.editIndex].form.identity == itemKey
                    ) {
                        return;
                    }

                    if (
                        (itemKey == "created_at" || itemKey == "updated_at")
                    ) {
                        return;
                    }

                    this.listData[this.editIndex].model[itemKey] = data[itemKey];

                });

            } else {
                let clonedForm = _.cloneDeep(this.form);
                let clonedFormModel = {};
                Object.keys(data).forEach(key => {
                    let schemaIndex = clonedForm.schema.findIndex(schema => schema.model == 'key')
                    if (schemaIndex >= 0) {
                        if (
                            clonedForm.identity == clonedForm.schema[schemaIndex].model ||
                            clonedForm.schema[schemaIndex].formType == null
                        ) {
                            return;
                        }

                        if (
                            clonedForm.timestamp &&
                            (clonedForm.schema[schemaIndex].model == "created_at" || clonedForm.schema[schemaIndex].model == "updated_at")
                        ) {
                            return;
                        }
                    }

                    clonedFormModel[key]  = data[key];
                });

                let listItem = {
                    form: clonedForm,
                    model: clonedFormModel
                };

                let subItems = this.model.form[this.model.component];

                if (subItems == undefined) {
                    subItems = [];
                }
                subItems.push(clonedFormModel);
                this.model.form[this.model.component] = subItems;

                this.listData.push(listItem);
            }


            if(this.editMode){
                this.validateWithSubForm(true);
            }
            this.closeModal();
        },
        element: element,
        checkAddable() {
            return new Promise((resolve, reject) => {
                let obj = this.listData[this.listData.length - 1];
                if (obj) {
                    let hasValue = false;
                    let lastModel = obj.model;

                    for (let key in lastModel) {
                        if (
                            typeof lastModel[key] != undefined &&
                            lastModel[key] != null &&
                            lastModel[key] != "" &&
                            lastModel[key] != false
                        ) {
                            hasValue = true;
                        }
                    }
                    if (hasValue) {
                        resolve(true)
                    } else {
                        alert(this.lang.pleaseCompleteFirstLine);
                        reject(false);
                    }
                } else {
                    resolve(true);
                }
            });
        },
        addSubForm() {
            let clonedForm = _.cloneDeep(this.form);
            let clonedFormModel = {};
            clonedForm.schema.forEach(item => {
                if (
                    clonedForm.identity == item.model ||
                    item.formType == null
                ) {
                    return;
                }

                if (
                    clonedForm.timestamp &&
                    (item.model == "created_at" || item.model == "updated_at")
                ) {
                    return;
                }

                clonedFormModel[item.model] = item.default;
            });

            let listItem = {
                form: clonedForm,
                model: clonedFormModel
            };


            if (this.model.form[this.model.component] == undefined) {
                this.model.form[this.model.component] = [];
            }
            this.model.form[this.model.component].push(clonedFormModel);
            this.listData.push(listItem);
        },
        add() {
            if(this.form.addFromGrid && this.form.sourceGridID){
                this.showAddSourceModal();
            } else {

                this.addByFrom();
            }
        },
        addByFrom(){
            this.closeSourceModal();
            this.editIndex = -1;
            this.showAddModal()
        },
        fillData(data) {
            this.$nextTick(() => {

            let listData = [];
            data.forEach(item => {
                listData.push({
                    form: _.cloneDeep(this.form),
                    model: item
                })
            });


            this.listData = listData;



            });
        },
        equationRenderer() {
            this.equationData = [];
            this.form.schema.map(item => {
                if (item.label != '' && !item.hidden) {
                    if (item.hasEquation) this.hasEq = true;
                    this.equationData.push({
                        hasEquation: item.hasEquation,
                        equation: item.equations,
                        prefix: item.prefix,
                        model: item.model,
                        preStaticWord: item.preStaticWord,
                        data: 0
                    });
                }
            });
        },
        edit(index) {
            this.model.form[this.form.model][index];

            this.editIndex = index;
            this.showAddModal();

        },
        remove(index) {
            this.model.form[this.form.model].splice(index, 1);
            this.listData.splice(index, 1);
        },

        reset() {
            this.model.form[this.form.model] = [];
            this.listData = [];
        },

        sort(item) {
            let sortStatus = 1;
            this.currentSortDir = this.currentSortDir === 'asc' ? 'desc' : 'asc';
            this.currentSort = this.currentSortDir === 'desc' ? -1 : 1;
            this.currentSort = item.model;
            this.listData.sort((a, b) => {
                if (this.currentSortDir === 'desc') sortStatus = -1;
                if (a.model[this.currentSort] < b.model[this.currentSort]) return -1 * sortStatus;
                if (a.model[this.currentSort] > b.model[this.currentSort]) return 1 * sortStatus;
                return 0;
            });
        }
    }
};
</script>
