<template>
    <div class="subform-grid" :style="subStyle">

        <h3 style="display: none">{{ rowLength }}</h3>
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
        <div class="relative">

            <table border="1" :ref="model.component">
                <thead>
                <tr>
                    <th class="row-number" v-if="form.showRowNumber">ДД</th>
                    <th @click="sort(item)" v-for="item in form.schema.filter(i=>i.label !== '' && !i.hidden)"
                        :key="item.index">
                        <div class="th-title">
                            {{ item.label }}<i class="ti-exchange-vertical"/></div>
                    </th>
                    <th class="action" v-if="!form.disableDelete">...</th>
                </tr>
                </thead>
                <tbody>
                <grid-form v-for="(item, index) in listData"
                           :key="index"
                           :rowIndex="index"
                           :f="item.form"
                           :model="item.model"
                           :editMode="editMode"
                           :relations="relations"
                           :url='url'
                           :schema="form.schema"
                           :formula="formula">
                    <template #action v-if="!form.disableDelete">
                        <a href="javascript:void(0);" class="btn btn-icon" @click="remove(index)">
                        <span class="svg-icon ">
                                  <inline-svg
                                      src="/assets/icons/duotone/General/Trash.svg"
                                  />
                        </span>
                        </a>
                    </template>
                    <template #rowNumber v-if="form.showRowNumber">
                        <span>{{ index + 1 }}</span>
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
            <a class="sub-grid-add" href="javascript:void(0)"  @click="exportToExcel" >
             <span class="svg-icon ">
                                 <inline-svg
                                     class="w-4 h-4"
                                     src="/assets/icons/duotone/Files/Download.svg"
                                 />
                        </span>
                Татах
            </a>
        </div>
        <a class="sub-grid-add" href="javascript:void(0)" @click="add" v-if="form.min_height && !form.disableCreate && !viewMode">
             <span class="svg-icon ">
                                 <inline-svg
                                     src="/assets/icons/duotune/general/gen041.svg"
                                 />
                        </span>
            {{ lang.add }}
        </a>

        <a-modal
            :name="`grid-modal-${form.sourceGridID}`"
            v-model:open="modal_grid_show"
            class="form-modal"
            :title="form.sourceGridModalTitle "
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
            <section class="form-modal source-grid" style="height: calc(100vh - 300px)">


                <div class="form-body" v-if="modal_grid_show">

                    <div v-if="form.sourceGridTitle || form.sourceGridDescription" class="source-grid-description">
                        <h3 v-if="form.sourceGridTitle">
                            {{ form.sourceGridTitle }}
                        </h3>
                        <p v-html="form.sourceGridDescription">

                        </p>
                    </div>
                    <datagrid
                        :schemaID="form.sourceGridID"
                        :url="sourceGridUrl()"
                        :onRowSelect="onRowSelect"
                        :paginate="50"
                        :hasSelection="true"
                        :user_condition="user_condition"
                        :custom_condition="custom_condition"
                        :permissions="{
                          c:false,
                          r:true,
                          u:false,
                          d:false,
                      }"
                    />

                </div>
            </section>
            <template #footer>
                <div class="add-from-pre-source">
                    <a-button type="success" size="small" @click="addFromPreSource" :disabled="preSource.length === 0"
                              class="sub-form-add-btn">
                        <template #icon>
                     <span class="svg-icon ">
                                 <inline-svg
                                     src="/assets/icons/duotune/general/gen041.svg"
                                 />
                        </span>
                        </template>
                        Сонгох
                    </a-button>
                </div>
            </template>
        </a-modal>
    </div>
</template>

<script>
import {element} from "../index";
import GridForm from "./GridForm";
import subFormMix from "./subFormMix";
import {Modal} from 'ant-design-vue'
import * as XLSX from 'xlsx';
export default {
    props: ["form", "model", "editMode", "relations", "formula", "url", "viewMode"],
    mixins: [subFormMix],
    components: {
        "grid-form": GridForm,
        "a-modal": Modal,
    },

    mounted() {

        this.equationRenderer();
    },
    computed: {
        lang() {
            const labels = ['pleaseCompleteFirstLine',
            ];
            return labels.reduce((obj, key, i) => {
                obj[key] = this.$t('dataForm.' + labels[i]);
                return obj;
            }, {});
        },
        subStyle() {
            if (this.form.min_height) {
                return {
                    minHeight: this.form.min_height + 'px',

                }
            } else {
                return {
                    minHeight: '30px',

                }
            }
        },
        Lang() {
            const labels = ['add',];
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
            rowLength: 0,
        };
    },
    methods: {
        exportToExcel() {
            const table = this.$refs[this.model.component];

            // Collect the input values and text content
            const rows = table.querySelectorAll('tr');
            const data = [];

            rows.forEach(row => {
                const rowData = [];
                const cells = row.querySelectorAll('th, td');

                cells.forEach(cell => {
                    let cellValue = '';

                    // Check if there is an input element
                    const input = cell.querySelector('input');
                    if (input) {
                        cellValue = input.value;
                    }

                    // Check if there is a select item
                    const selectItem = cell.querySelector('.ant-select-selection-item');
                    if (selectItem) {
                        cellValue = selectItem.textContent.trim();
                    }

                    // If no input or select item, get the text content
                    if (!cellValue) {
                        cellValue = cell.innerText.trim() || cell.textContent.trim();
                    }

                    rowData.push(cellValue);
                });

                if (rowData.length > 0) {
                    data.push(rowData);
                }
            });

            // Create a new table with the collected data
            const newTable = document.createElement('table');
            data.forEach(rowData => {
                const tr = newTable.insertRow();
                rowData.forEach(cellData => {
                    const td = tr.insertCell();
                    td.textContent = cellData;
                });
            });

            // Convert the new table to a workbook and export it
            const wb = XLSX.utils.table_to_book(newTable, { sheet: this.form.name });
            const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

            function s2ab(s) {
                const buf = new ArrayBuffer(s.length);
                const view = new Uint8Array(buf);
                for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
                return buf;
            }

            const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `${this.form.name}.xlsx`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
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
            this.rowLength = this.model.form[this.model.component].length;
        },
        addSubFormWithData(row) {
            let clonedForm = _.cloneDeep(this.form);
            let clonedFormModel = {...row};


            let listItem = {
                form: clonedForm,
                model: clonedFormModel
            };


            if (this.model.form[this.model.component] == undefined) {
                this.model.form[this.model.component] = [];
            }
            this.model.form[this.model.component].push(clonedFormModel);

            this.listData.push(listItem);
            this.rowLength = this.model.form[this.model.component].length;
        },

        add() {
            if (this.form.addFromGrid && this.form.sourceGridID) {
                this.showAddSourceModal();
            } else {
                this.checkAddable()
                    .then(o => {
                        setTimeout(() => {
                            this.addSubForm();
                        }, 200);
                    })
                    .catch(e => {
                        console.log(e);
                    });
            }

        },

        fillData(data) {
            this.$nextTick(() => {
                let listData = [];
                if(data){
                    data.forEach(item => {

                        listData.push({
                            form: _.cloneDeep(this.form),
                            model: item
                        })
                    });
                }


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

        remove(index) {
            this.model.form[this.form.model].splice(index, 1);
            this.listData.splice(index, 1);
            this.rowLength = this.model.form[this.model.component].length;
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
        },
    }
};
</script>
