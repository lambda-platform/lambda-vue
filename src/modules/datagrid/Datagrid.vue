<template>
    <div class='dg'>
        <div class='dg-body bg-white dark:bg-slate-900 rounded-md'
             :style="fullWidth ? `flex: 1` : ''"
             ref='dgBody'>
            <div :class="`dg-table ${header != null ? 'custom-table' : ''} ${'template-'+template}`">
                <table ref='customTableHeader' v-if='header != null' border='1'
                       :style="`width: ${tableWidth != null ? tableWidth+ 'px' : 'auto'}`"
                       class='custom-header' id='custom-header'>
                    <tr v-for='tr in header.structure' :key='tr.index'>
                        <td
                            v-for='td in tr.children'
                            :key='td.index'
                            :colspan='td.colspan'
                            :rowspan='td.rowspan'>
                            <div :style='`width: ${td.width}; height: ${td.height}`'
                                 :class="td.rotate ? 'vertical-column' : ''">
                                <div>{{ td.label }}</div>
                            </div>
                        </td>
                    </tr>
                </table>

                <ag-grid-vue
                    ref='agGrid'
                    :class="`${$appState.colorScheme === 'dark' ? agGridTheme : agGridTheme} ag-data-grid ag-table ${header != null ? 'custom-header-table custom-table-template' + template  : 'template-'+template} ${sideBar ? '' : 'no-sidebar'} ${fullText ? 'full-text' : ''} ${colFilterButton ? '' : 'no-filter-btn'} ${showGrid ? 'has-grid' : ''} ${theme ? theme : 'normal'}`"
                    :style="`width: ${tableWidth != null ? tableWidth + 'px' : 'auto'}`"
                    :gridOptions='gridOptions'
                    :columnDefs='columns'
                    :rowData='data'

                    :sideBar='sideBar'
                    :getContextMenuItems='getContextMenuItems'
                    :overlayLoadingTemplate='overlayLoadingTemplate'
                    :rowSelection='selectionMethod'
                    :defaultColDef='defaultColDef'
                    :enableRangeSelection="true"
                    :singleClickEdit='singleClickEdit'
                    :editType='editType'
                    :stopEditingWhenCellsLoseFocus='true'
                    :enableCellChangeFlash='flashChanges'
                    @grid-ready='onGridReady'
                    @sort-changed='onSortChanged'
                    @filter-changed='onFilterChanged'
                    @filter-modified='onFilterModified'
                    @row-double-clicked='onRowDblClick'
                    @row-clicked='onRowClick'
                    @row-selected='onRowSelected'
                    @rowEditingStarted='onRowEditingStarted'
                    @rowEditingStopped='onRowEditingStopped'
                    @cellEditingStarted='onCellEditingStarted'
                    @cellEditingStopped='onCellEditingStopped'

                    @columnResized='columnResized'>
                </ag-grid-vue>
            </div>

            <div class='dg-footer'>
                <div class="dg-info text-gray-700 dark:text-gray-200">
                    {{ lang.total }} : {{ info.total }}
                    <span v-if="aggregations.forumlaResult != ''">| {{ aggregations.forumlaResult }}</span>
                </div>
                <a-pagination v-if="!this.isClient" :rows="query.paginate" v-model:current="query.currentPage"
                              v-model:pageSize="query.paginate" show-size-changer :total="info.total" size="small"
                              @change="changePage"
                              :pageSizeOptions="['10', '20', '30', '50', '100', '500']"></a-pagination>
            </div>
        </div>


        <div class="fixed top-20 right-2" v-if="isMobile && template == 1 || isMobile && template==3">
            <a-button type="outline" @click="showMobileFilter = true" shape="circle" size="large">
                <template #icon>
                      <span class="settings-btn ant-btn-svg-icon">
                        <inline-svg
                            src="/assets/icons/duotune/general/gen021.svg"
                        />
                      </span>
                </template>
            </a-button>
        </div>
        <a-drawer
            v-if="isMobile && template == 1 || isMobile && template==3"
            v-model:open="showMobileFilter"
            class="custom-class"
            style="color: red"
            :title="lang.infoCourt"
            placement="right"

        >
            <datafilter class="bg-white dark:bg-slate-900 rounded-md"
                        v-if="isMobile && template == 1 || isMobile && template==3"
                        :schemaID="schemaID" :schema="schema" :permissions="permissions"
                        :url="url"
                        :hideTitle="true"
                        :filterData="filterData"
                        :model="filterModel"></datafilter>
        </a-drawer>
        <datafilter class="bg-white dark:bg-slate-900 rounded-md"
                    v-if="!isMobile && template == 1 || !isMobile && template==3"
                    :schemaID="schemaID" :schema="schema" :permissions="permissions"
                    :url="url"
                    :filterData="filterData"
                    :refresh="refresh"
                    :model="filterModel"></datafilter>

        <a-modal

            :min-width="200"
            :min-height="200"
            class="print-modal"
            :footer="null"
            width="78%"
            height="90%"

            v-model:open="showPrint"
        >
            <print v-if="showPrint"
                   :schemaID="$props.schemaID"
                   :user_condition="user_condition"
                   :gridTitle="gridTitle"
                   :pageSize="printSize"
                   :header="header"
                   :schema="schema"
                   :info="info"
                   :query="query"
                   :baseUrl="baseUrl"
                   :search="searchModel"
                   :filter="filterModel"
                   :aggregations="aggregations"
                   :isNumber="isNumbered"/>
        </a-modal>
        <a-modal

            :min-width="200"
            :min-height="200"
            class="import-excel-modal"
            :footer="null"
            width="78%"
            height="90%"
            :title="lang.excelImportModalTitle"
            v-model:open="showExcelImport"
        >
            <excel-import
                :schemaID="$props.schemaID"
                :schema="schema"
                :baseUrl="baseUrl"
                :options="$parent"/>
        </a-modal>


        <!--        <Modal v-model="deleteModal" :closable="false" width="360">-->
        <!--            <div style="color:#ed4014;text-align:center">-->
        <!--                <p>{{ lang.ruSureYouDeleteInfo }}.</p>-->
        <!--            </div>-->
        <!--            <div slot="footer" style="text-align: center">-->
        <!--                <Button type="default" size="small" @click="deleteModal = false">{{ lang.no }}</Button>-->
        <!--                <Button type="error" size="small" :loading="delLoading"-->
        <!--                        @click="remove(currentRow.rowId, currentRow.rowIndex)">{{ lang.yes }}-->
        <!--                </Button>-->
        <!--            </div>-->
        <!--        </Modal>-->

        <GridRowUpdate v-if="template == 0 || template==2"
                       :permissions="permissions" :model="filterModel" :schema="schema" :url="url" :inFilter="false"
                       :schemaID="schemaID"
        />

    </div>
</template>

<script>
import dayjs from "../../utils/dayjs";
import axios from 'axios';

import 'ag-grid-enterprise';
import {
    LicenseManager,
} from 'ag-grid-enterprise';

LicenseManager.prototype.validateLicense = () => {
};
import {AgGridVue} from 'ag-grid-vue3';

import 'lodash';

import {data, tableToExcel} from './utils/data';
import {dataFromTemplate, evil} from './utils/formula.js';
import {compareObj, isValid} from './utils/methods';
import {convertLink} from './utils/formula';
import Print from "./Print";
import ExcelImport from "./ExcelImport.vue";
// import ExcelImport from "./ExcelImport";
import DataFilter from "./DataFilter";
import {getNumber, number, formatedNumber} from './utils/number.js';
import {isMobile} from '../../utils/device.ts';
import GridActions from './GridActions';

//Grid elements
import Image from './elements/Image';
import File from './elements/File';
import Check from './elements/Check';
import Number from './elements/Number';
import Radio from './elements/Radio';
import Html from './elements/Html';
import Custom from './elements/Custom';
import Link from './elements/Link';

//Editable elements
import editableText from './elements/editableText';
import editableDate from './elements/editableDate';
import editableNumber from './elements/editableNumber';
import editableSelect from './elements/editableSelect';

//Filter elements
import selectFloatingFilter from './elements/selectFloatingFilter';
import SetFilter from './elements/SetFilter';
import SetFilterDate from './elements/SetFilterDate';
import SetFilterAltered from './elements/SetFilterAltered';
import './elements/ExcelFilter.js';
import GridRowUpdate from "./GridRowUpdate";
import {notification, message} from 'ant-design-vue';
import {isNumber} from "@vueuse/core";

const messageKey = 'datagrid';
export default {
    name: 'datagrid',
    props: [
        'schemaID',
        'filterProp',
        'highlights',
        'fnClone',
        'fnEdit',
        'fnView',
        'actions',
        'dblClick',
        'hasSelection',
        'onRowSelect',
        'permissions',
        'user_condition',
        'custom_condition',
        'hasAggregation',
        'page_id',
        'actionvisibility',
        'gridSelector',
        'url',
        'filter'
    ],
    computed: {
        // ...mapGetters({
        //     user: "user"
        // }),
        lang() {
            const labels = ['ruSureYouDeleteInfo', 'yes', 'no', 'total', 'infoDeleted', 'errorMsg', 'successfullySaved', 'noChangesHaveBeenReported',
                'pleaseWaitForLoading', 'infoCourt', 'excelImportModalTitle'
            ];

            return labels.reduce((obj, key, i) => {
                obj[key] = this.$t('dataGrid.' + labels[i]);
                return obj;
            }, {});
        },
        isMobile() {
            return isMobile.value
        },
        agGridTheme() {
            if (this.gridTheme === "balham") {
                return "ag-theme-balham"
            } else {
                return "ag-theme-material"
            }
        }
    },
    components: {
        AgGridVue,
        // eslint-disable-next-line vue/no-unused-components
        editableText,
        // eslint-disable-next-line vue/no-unused-components
        editableDate,
        // eslint-disable-next-line vue/no-unused-components
        editableNumber,
        // eslint-disable-next-line vue/no-unused-components
        editableSelect,
        // eslint-disable-next-line vue/no-unused-components
        selectFloatingFilter,
        // eslint-disable-next-line vue/no-unused-components
        SetFilter,
        // eslint-disable-next-line vue/no-unused-components
        SetFilterAltered,
        // eslint-disable-next-line vue/no-unused-components
        SetFilterDate,
        GridActions: GridActions,
        "datafilter": DataFilter,
        "GridRowUpdate": GridRowUpdate,
        "print": Print,
        // ExcelImport
        "excel-import": ExcelImport
    },

    data() {
        return data();
    },

    watch: {
        update(val) {
            if (val !== null) {
                if (val.type === 'create') {
                    this.data = [_.cloneDeep(val.data), ...this.data];
                    this.info.total++;
                }
            }
        },

        highlights() {
            this.preselect();
        },
    },

    methods: {
        onGridReady(params) {

            this.gridApi = params.api;
            this.gridColumnApi = params.columnApi;
            this.initGrid();

            setTimeout(() => {
                if (this.saveFilter) {
                    this.restoreFloatFilterValue();
                    this.onFilterChanged();
                }
            }, 150);
        },

        async initFromServerData(customSchemaId) {

            if (customSchemaId) {
                this.customShemaId = customSchemaId;
            } else {
                this.customShemaId = null;
            }


            try {
                let response = await axios.get(this.page_id ? `${this.baseUrl}/lambda/puzzle/schema/grid/${this.customShemaId ? this.customShemaId : this.$props.schemaID}?page_id=${this.page_id}` : `${this.baseUrl}/lambda/puzzle/schema/grid/${this.customShemaId ? this.customShemaId : this.$props.schemaID}`);

                this.gridTitle = response.data.data.name;
                let data = JSON.parse(response.data.data.schema);
                data['grid_id'] = response.data.data.id;
                return data;
            } catch (e) {
                console.log(e);
                return undefined;
            }
        },

        async initGrid(customSchemaId) {
            /* data reset. it need more options*/
            this.columns = [];
            this.data = [];
            this.formula = [];
            this.pinnedBottomRowData = null;
            this.aggregations.columnAggregations = [];

            let gridSchema = {};
            this.baseUrl = this.$props.url ? this.$props.url : '';
            // if (window.init.gridSchemas) {
            //     if (window.init.gridSchemas[this.$props.schemaID]) {
            //         gridSchema = window.init.gridSchemas[this.$props.schemaID];
            //     } else {
            //         gridSchema = await this.initFromServerData(baseUrl, customSchemaId);
            //     }
            // } else {
            //     gridSchema = await this.initFromServerData(baseUrl, customSchemaId);
            // }

            gridSchema = await this.initFromServerData(customSchemaId);


            this.model = gridSchema.model;
            this.template = gridSchema.template;
            this.schema = gridSchema.schema;


            if (this.$route.query.sort) {
                this.query.sort = this.$route.query.sort
            } else {
                this.query.sort = gridSchema.sort;
            }
            if (this.$route.query.order) {
                this.query.order = this.$route.query.order
            } else {
                this.query.order = gridSchema.sortOrder;
            }
            if (this.$route.query.paginate) {
                if (!isNaN(this.$route.query.paginate)) {
                    this.query.paginate = this.$route.query.paginate * 1
                }
            } else {
                this.query.paginate = gridSchema.paging;
            }

            if (this.$route.query.currentPage) {
                if (!isNaN(this.$route.query.currentPage)) {
                    this.query.currentPage = this.$route.query.currentPage * 1
                } else {
                    this.query.currentPage = 1;
                }
            } else {
                this.query.currentPage = 1;
            }
            if (gridSchema.gridTheme) {
                this.gridTheme = gridSchema.gridTheme;
            }

            this.hasContextMenu = gridSchema.isContextMenu;
            this.gridActions = gridSchema.actions;
            this.identity = gridSchema.identity;
            this.actionPosition = gridSchema.actionPosition ? gridSchema.actionPosition : 0;
            this.isClient = 'isClient' in gridSchema ? gridSchema.isClient : false;
            this.isStatic = 'staticWidth' in gridSchema ? gridSchema.staticWidth : false;
            this.isNumbered = 'isNumbered' in gridSchema ? gridSchema.isNumbered : false;
            this.formula = 'formula' in gridSchema ? gridSchema.formula : [];
            this.fullText = 'fullText' in gridSchema ? gridSchema.fullText : false;
            this.editableAction = 'editableAction' in gridSchema ? gridSchema.editableAction : null;
            this.editType = 'editFullRow' in gridSchema ? (gridSchema.editFullRow ? 'fullRow' : null) : null;
            this.singleClickEdit = 'singleClickEdit' in gridSchema ? gridSchema.singleClickEdit : false;
            this.flashChanges = 'flashChanges' in gridSchema ? gridSchema.flashChanges : false;
            this.colMenu = 'colMenu' in gridSchema ? gridSchema.colMenu : false;
            this.colFilterButton = 'colFilterButton' in gridSchema ? gridSchema.colFilterButton : true;
            this.showGrid = 'showGrid' in gridSchema ? gridSchema.showGrid : false;
            this.saveFilter = 'showGrid' in gridSchema ? gridSchema.saveFilter : false;
            this.autoSelect = 'autoSelect' in gridSchema ? gridSchema.autoSelect : false;
            this.autoSelectModel = 'autoSelectModel' in gridSchema ? gridSchema.autoSelectModel : false;

            if (this.isNumbered) {
                this.columns.push({
                    headerName: "#",
                    valueGetter: "node.rowIndex + 1",
                    width: 50,
                    filter: false,
                })
            }

            this.$parent.isSave = this.editableShouldSubmit = 'editableShouldSubmit' in gridSchema ? gridSchema.editableShouldSubmit : false;

            if (gridSchema.template === 2 || gridSchema.template === 3) {
                this.defaultColDef.floatingFilter = true;
            }

            /**
             * Custom part remove later
             */
            this.gridOptions.getRowStyle = (params) => {
                if ((this.$props.schemaID === 220) && isValid(params.data.ubtirsenognoo)) {
                    return {'background-color': '#87cefa'};
                }

                if ((this.$props.schemaID === 224 && isValid(params.data.chw_status))) {
                    if (params.data.chw_status === 9) {
                        return {'background-color': '#d7f9e2'};
                    } else if (params.data.chw_status === 8) {
                        return {'background-color': '#ffe4e4'};
                    } else if (params.data.chw_status === 7) {
                        return {'background-color': '#d5eaff'};
                    }
                }

                if (this.$props.schemaID == 230) {
                    if (params.data.chw_status == 9) {
                        return {'background-color': '#d7f9e2'};
                    } else if (params.data.chw_status == 6 || params.data.chw_status == 8) {
                        return {'background-color': '#ffe4e4'};
                    } else {
                        if (isValid(params.data.ubtirsenognoo)) {
                            return {'background-color': '#d5eaff'};
                        }
                    }
                }

                if (this.$props.schemaID == 264) {
                    if (params.data.chw_status == 7) {
                        return {'background-color': '#d5eaff'};
                    }

                    if (params.data.chw_status == 9) {
                        return {'background-color': '#d7f9e2'};
                    }

                    if (params.data.chw_status == 6 || params.data.chw_status == 8) {
                        return {'background-color': '#ffe4e4'};
                    }
                }
            };

            /*********/
            //client side sorting and filtering
            if (this.isClient) {
                this.gridOptions.enableServerSideFilter = false;
                this.gridOptions.enableServerSideSorting = false;
                this.gridOptions.enableFilter = true;
                this.gridOptions.enableSorting = true;
            } else {
                if (gridSchema.columnAggregations) {
                    this.aggregations['columnAggregations'] = gridSchema.columnAggregations;
                }

                if (gridSchema.excelUploadCustomUrl) {
                    this.$parent.excelUploadCustomUrl = gridSchema.excelUploadCustomUrl;
                }

                if (gridSchema.excelUploadSample) {
                    this.$parent.excelUploadSample = gridSchema.excelUploadSample;
                }

                if (gridSchema.excelUploadCustomNamespace) {
                    this.$parent.excelUploadCustomNamespace = gridSchema.excelUploadCustomNamespace;
                }

                if (gridSchema.excelUploadCustomTrigger) {
                    this.$parent.excelUploadCustomTrigger = gridSchema.excelUploadCustomTrigger;
                }
                if (gridSchema.columnAggregationsFormula) {
                    this.aggregations.columnAggregationsFormula = gridSchema.columnAggregationsFormula;
                }
            }


            if (gridSchema.theme) {
                this.theme = 'theme' in gridSchema ? gridSchema.theme : 'normal';
                if (this.theme == 'mini') {
                    this.gridApi.setHeaderHeight(22);
                    this.gridApi.setFloatingFiltersHeight(22);
                    this.gridOptions.rowHeight = 24;
                } else {
                    if (this.gridTheme === "balham") {
                        this.gridApi.setHeaderHeight(30);
                        this.gridApi.setFloatingFiltersHeight(30);
                    } else {
                        this.gridApi.setHeaderHeight(56);
                        this.gridApi.setFloatingFiltersHeight(40);
                    }

                }
            }

            // Full width option
            if (gridSchema.fullWidth) {
                this.gridOptions.sizeColumnsToFit = gridSchema.fullWidth;
                this.fullWidth = true;
            }

            //Tool buttons
            if (gridSchema.isPrint) {
                this.$parent.isPrint = this.isPrint = gridSchema.isPrint;
                this.printSize = gridSchema.printSize;
            }

            if (gridSchema.isExcel) {
                this.$parent.isExcel = gridSchema.isExcel;
            }

            if (gridSchema.isExcelUpload) {
                this.$parent.isExcelUpload = gridSchema.isExcelUpload;
            }

            if (gridSchema.isExcelUploadSample) {
                this.$parent.isExcelUploadSample = gridSchema.isExcelUploadSample;
            }

            if (gridSchema.isRefresh) {
                this.$parent.isRefresh = gridSchema.isRefresh;
            }

            //Sidebar configuration
            if (gridSchema.isPivot) {
                this.sideBar = {
                    toolPanels: [
                        {
                            id: 'columns',
                            labelDefault: 'Columns',
                            labelKey: 'columns',
                            iconKey: 'columns',
                            toolPanel: 'agColumnsToolPanel',
                        },
                    ],
                    defaultToolPanel: '',
                };
            }

            // //setting selection
            if (this.$props.hasSelection) {
                if (!this.$props.gridSelector) {
                    this.selectionMethod = 'multiple';
                } else {
                    this.selectionMethod = 'single';
                }

            }

            if (gridSchema.hasCheckbox || this.$props.hasSelection) {
                this.hasCheckbox = true;
                let selectionCol = {
                    headerName: '',
                    width: 38,
                    minWidth: 38,
                    suppressNavigable: true,
                    cellClass: 'no-border grid-checkbox',
                    checkboxSelection: true,
                    headerCheckboxSelection: !this.$props.gridSelector,
                    headerCheckboxSelectionFilteredOnly: true,
                    filter: false,
                };
                this.columns.push(selectionCol);
            }

            if (gridSchema.hasCheckbox || this.$props.hasSelection) {
                this.hasCheckbox = true;
            }
            let filter_not_found = true;

            //Has custom header
            if (gridSchema.header && gridSchema.header.render) {
                this.header = gridSchema.header;
                this.gridOptions.headerHeight = 0;
                this.gridOptions.enableColResize = false;
                this.gridOptions.toolPanelSuppressSideButtons = true;
                this.isStatic = true;
                if (this.tableWidth == null) {
                    this.tableWidth = 0;
                }
                gridSchema.header.structure.forEach(tr => {
                    tr.children.forEach((td) => {
                        if (td.model != null) {
                            let schemaItem = gridSchema.schema.find(item => item.model === td.model);

                            if (schemaItem) {
                                if (schemaItem.filterable) {
                                    this.filterModel[schemaItem.model] = null;
                                    filter_not_found = false;
                                }
                                schemaItem.width = parseInt(td.width) + 1;
                                this.tableWidth += schemaItem.width;
                            }

                        }
                    });
                });
                this.init = true;

                if (gridSchema.hasCheckbox) {
                    this.tableWidth += 32;
                }
            }

            this.schema.forEach((item) => {
                if (item.filterable) {
                    if (isValid(item.filter.default)) {

                        this.filterModel[item.model] = item.filter.default;
                    } else {
                        this.filterModel[item.model] = null;
                    }
                    filter_not_found = false;
                }
                this.setColumn(item);
            });

            this.init = true;

            if (filter_not_found) {
                this.defaultColDef.floatingFilter = false;
            }

            // Setting actions
            if (!this.hasContextMenu &&
                !this.$props.hasSelection &&
                (gridSchema.actions.length > 0 ||
                    (this.$props.actions && this.$props.actions.length > 0))
            ) {
                let width = gridSchema.actions.length * 50;

                if (this.$props.actions) {
                    width += this.$props.actions.length * 50;
                }

                if (this.header != null) {
                    this.tableWidth += parseInt(width);
                }

                let grid_actions = gridSchema.actions;
                if (this.permissions) {
                    if (!this.permissions.u) {
                        grid_actions = grid_actions.filter(g_ac => g_ac != 'e');
                    }
                    if (!this.permissions.d) {
                        grid_actions = grid_actions.filter(g_ac => g_ac != 'd');
                    }
                }

                let actions = {
                    headerName: '...',
                    width: width,
                    field: this.identity ? this.identity : 'id',
                    suppressMenu: true,
                    sortable: false,
                    filter: false,
                    cellRenderer: "GridActions",
                    // pinned: 'right',
                    cellRendererParams: {
                        actions: grid_actions,
                        width: width,
                        methods: {
                            quickEdit: this.quickEdit,
                            clone: this.fnClone,
                            view: this.fnView,
                            edit: this.fnEdit,
                            remove: this.remove,
                            permissions: this.permissions,
                        },
                        customActions: this.$props.actions,
                        actionsVisibility: this.$props.actionvisibility,


                    },
                };

                if (this.permissions) {
                    if (this.permissions.r || this.permissions.u || this.permissions.d) {
                        if (this.actionPosition == 0) {
                            this.columns.push(actions);
                        } else {
                            this.columns.unshift(actions);
                        }
                    }
                } else {
                    if (this.actionPosition == 0) {
                        this.columns.push(actions);
                    } else {
                        this.columns.unshift(actions);
                    }
                }
            }
            //Getting data
            this.query.src = this.baseUrl + '/lambda/puzzle/grid/data/' + gridSchema['grid_id'];
            if (this.saveFilter) {
                this.restoreFilter();
            }
            this.fetchData();
        },

        setColumn(item) {
            //set post models -- hidden could be posted
            if (isValid(item.editable) && (isValid(item.editable) && item.editable.shouldPost)) {
                this.postModels.push(item.model);
            }

            //if not hidden the set properties
            if (!item.hide) {
                let colItem = {
                    headerName: item.label === '' ? item.model : item.label,
                    field: item.model,
                    // suppressNavigable: true,
                    // cellClass: 'no-border',
                    enableRowGroup: true,
                    enableValue: true,
                    enablePivot: true,
                    suppressMenu: !this.colMenu,
                };

                //Sortable
                if (!item.sortable) {
                    colItem.sortable = false;
                }

                if (this.fullText) {
                    colItem.cellStyle = {'white-space': 'normal'};
                    colItem.autoHeight = true;
                }

                //Filterable
                if (item.filterable) {
                    // item.floatingFilter = true;
                    // item.suppressMenu = true;
                    // console.log(item.filter)
                    // console.log(item.filter.param)

                    if (isValid(item.filter.param)) {
                        // console.log(this.$route.query[item.filter.param])
                        if (isValid(this.$route.query[item.filter.param])) {
                            // this.filterModel[item.model] = {
                            //     filter: this.$route.query[item.filter.param],
                            //     filterType: "text",
                            //     type: isValid(item.filter.paramCompareType) ? item.filter.paramCompareType : "contains"
                            // };

                            this.filterModel[item.model] = this.$route.query[item.filter.param];
                        }
                        this.$watch('$route.query.' + item.filter.param, {
                            handler: () => {
                                if(this.$route.query[item.filter.param]){
                                    this.filterModel[item.model] = {
                                        filter: this.$route.query[item.filter.param] ? this.$route.query[item.filter.param] : '',
                                        filterType: "text",
                                        type: isValid(item.filter.paramCompareType) ? item.filter.paramCompareType : "contains"
                                    };
                                    this.fetchData();
                                }

                            },
                            deep: true
                        });
                    }


                    switch (item.filter.type) {
                        case 'Number':
                            colItem.filter = "agNumberColumnFilter";
                            colItem.filterParams = {
                                newRowsAction: "keep",
                                suppressAndOrCondition: true
                            };
                            break;
                        case 'Date':
                            colItem.filter = "agDateColumnFilter";
                            colItem.filterParams = {
                                newRowsAction: "keep",
                                comparator: (filterLocalDateAtMidnight, cellValue) => {
                                    let dateParts = cellValue.substr(0, 10).split("-");
                                    let day = parseInt(dateParts[2]);
                                    let month = parseInt(dateParts[1]) - 1;
                                    let year = parseInt(dateParts[0]);
                                    let cellDate = new Date(year, month, day);

                                    if (cellDate < filterLocalDateAtMidnight) {
                                        return -1;
                                    } else if (cellDate > filterLocalDateAtMidnight) {
                                        return 1;
                                    } else {
                                        return 0;
                                    }
                                },
                                inRangeInclusive: true,
                                browserDatePicker: true,
                                suppressAndOrCondition: true
                            };
                            break;
                        case 'DateRange':
                            colItem.filter = "agDateColumnFilter";
                            colItem.filterParams = {
                                newRowsAction: "keep",
                                comparator: (filterLocalDateAtMidnight, cellValue) => {
                                    let dateParts = cellValue.substr(0, 10).split("-");
                                    let day = parseInt(dateParts[2]);
                                    let month = parseInt(dateParts[1]) - 1;
                                    let year = parseInt(dateParts[0]);
                                    let cellDate = new Date(year, month, day);

                                    if (cellDate < filterLocalDateAtMidnight) {
                                        return -1;
                                    } else if (cellDate > filterLocalDateAtMidnight) {
                                        return 1;
                                    } else {
                                        return 0;
                                    }
                                },

                                defaultOption: 'inRange',
                                inRangeInclusive: true,
                                browserDatePicker: true,
                                suppressAndOrCondition: true
                            };
                            break;
                        case 'Select':
                            if (!this.isClient) {
                                colItem.floatingFilterComponent = "selectFloatingFilter";
                                colItem.floatingFilterComponentParams = {
                                    newRowsAction: "keep",
                                    suppressAndOrCondition: true,
                                    selectAllOnMiniFilter: true,
                                    suppressFilterButton: true,
                                    schemaID: this.schemaID,
                                    column: this.schema.find(col => col.model === item.model),
                                    filterModel: this.filterModel,
                                    filterData: this.updateFilterModel
                                };
                            } else {
                                colItem.filter = "agTextColumnFilter";
                                colItem.filterParams = {
                                    newRowsAction: "keep",
                                    suppressAndOrCondition: true
                                };
                            }
                            break;
                        case 'Tag':
                            if (!this.isClient) {
                                colItem.floatingFilterComponent = "selectFloatingFilter";
                                colItem.floatingFilterComponentParams = {
                                    newRowsAction: "keep",
                                    suppressAndOrCondition: true,
                                    selectAllOnMiniFilter: true,
                                    suppressFilterButton: true,
                                    schemaID: this.schemaID,
                                    column: this.schema.find(col => col.model == item.model),
                                    filterModel: this.filterModel,
                                    filterData: this.updateFilterModel
                                };
                            } else {
                                colItem.filter = "agTextColumnFilter";
                                colItem.filterParams = {
                                    newRowsAction: "keep",
                                    suppressAndOrCondition: true
                                };
                            }
                            break;
                        case 'Set-Filter':
                            if (!this.isClient) {
                                let t = this.schema.find(col => col.model == item.model);
                                let dataUrl = `/lambda/krud/${this.schemaID}/options`;

                                colItem.filter = "agSetColumnFilter";
                                colItem.filterParams = {
                                    newRowsAction: "keep",
                                    selectAllOnMiniFilter: true,
                                    suppressMiniFilter: false,
                                    // cellRenderer: params => params.value.label,
                                    // values: (params) => {
                                    //     axios.post(dataUrl, t.filter.relation).then(({data}) => {
                                    //         params.success(data.map(item => item.label));
                                    //     });
                                    // },
                                    cellRenderer: params => params.value.label,
                                    values: (params) => {
                                        axios.post(dataUrl, getRelation(t.filter.relation)).then(({data}) => {
                                            params.success(data);
                                        });
                                    },
                                };
                            } else {
                                colItem.filter = "agSetColumnFilter";

                                colItem.filterParams = {
                                    newRowsAction: "keep",
                                    selectAllOnMiniFilter: false,
                                    suppressSyncValuesAfterDataChange: false,
                                    suppressRemoveEntries: false,
                                    suppressSelectAll: true,
                                    suppressMiniFilter: true,
                                };
                            }
                            break;
                        case 'Set-Filter-Altered':
                            if (this.isClient) {
                                colItem.filter = "agSetColumnFilter";
                                colItem.floatingFilterComponent = "SetFilterAltered";
                                colItem.filterParams = {
                                    newRowsAction: "keep",
                                    selectAllOnMiniFilter: false,
                                    suppressSyncValuesAfterDataChange: false,
                                    suppressRemoveEntries: false,
                                    suppressSelectAll: true,
                                    suppressMiniFilter: false,
                                    excelMode: 'windows'
                                };

                                colItem.floatingFilterComponentParams = {
                                    schemaID: this.schemaID,
                                    column: this.schema.find(col => col.model == item.model),
                                    width: item.width,
                                    isClient: this.isClient,
                                    filterModel: this.filterModel,
                                    filterType: 'text',
                                    filterData: this.isClient ? this.onClientFilter : this.updateFilterModel
                                };

                                this.selectInputModels.push(item.model);

                                // setTimeout(()=>{
                                //     let instance = this.gridApi.getFilterInstance(item.model);
                                //     // instance.selectNothing();
                                // }, 100);
                            }
                            break;
                        case 'Set-Filter-Date':
                            if (!this.isClient) {
                                //Todo when server filter fns
                            } else {
                                colItem.filter = "agSetColumnFilter";
                                colItem.floatingFilterComponent = "SetFilterDate";

                                colItem.filterParams = {
                                    newRowsAction: "keep",
                                    selectAllOnMiniFilter: false,
                                    suppressSyncValuesAfterDataChange: false,
                                    suppressRemoveEntries: false,
                                    suppressSelectAll: true,
                                    suppressMiniFilter: true,
                                };

                                colItem.floatingFilterComponentParams = {
                                    schemaID: this.schemaID,
                                    column: this.schema.find(col => col.model == item.model),
                                    width: item.width,
                                    isClient: this.isClient,
                                    filterModel: this.filterModel,
                                    filterType: 'text',
                                    filterData: this.isClient ? this.onClientFilter : this.updateFilterModel
                                };

                                this.selectInputModels.push(item.model);
                            }
                            break;
                        default:
                            colItem.filter = "agTextColumnFilter";

                            if (!this.isClient) {
                                colItem.filterParams = {
                                    newRowsAction: "keep",
                                    suppressAndOrCondition: true,
                                    textCustomComparator: (filter, value, filterText) => {
                                        return filterText.replace('*', '');
                                    },
                                };
                            } else {
                                colItem.filterParams = {
                                    newRowsAction: "keep",
                                    suppressAndOrCondition: true,
                                    textCustomComparator: (filter, value, filterText) => {
                                        let startWith = false;
                                        let endWith = false;

                                        if (filterText.charAt(0) == '*') {
                                            startWith = true;
                                        }

                                        let lastFilterChar = filterText[filterText.length - 1];
                                        if (lastFilterChar == '*') {
                                            endWith = true;
                                        }

                                        let f = filterText.toLowerCase().replace('*', '');
                                        let valueLowerCase = value.toString().toLowerCase();

                                        if (startWith == true && endWith == false) {
                                            let index = valueLowerCase.lastIndexOf(f);
                                            return index >= 0 && index === (valueLowerCase.length - f.length);
                                        }

                                        if (endWith == true && startWith == false) {
                                            return valueLowerCase.indexOf(f) === 0;
                                        }

                                        if ((endWith == false && startWith == false) || (endWith == true && startWith == true)) {
                                            return valueLowerCase.includes(f);
                                        }
                                    },
                                };
                            }
                            break;
                    }
                } else {
                    colItem.filter = false;
                }


                if (this.isStatic) {
                    if (this.header != null) {
                        colItem.width = parseInt(item.width);
                    } else {
                        colItem.width = this.getColumnWidth(item.width, item.model);
                    }
                }

                if (item.pinned) {
                    colItem.pinned = item.pinPosition;
                    colItem.lockPosition = true;

                    colItem.width = item.width;
                }

                // File column
                if (isValid(item.gridType) && item.gridType === 'File') {
                    colItem.cellRenderer = File;
                }

                // Select
                if (isValid(item.gridType) && item.gridType === 'Select') {
                    // console.log('select element');
                    // colItem.keyCreator = colKeyCreator;
                    // colItem.cellRenderer = countryCellRenderer;
                }

                // Image column
                if (isValid(item.gridType) && (item.gridType === 'Image' || item.gridType === 'SVG')) {
                    colItem.cellRenderer = Image;
                }



                //Date only column
                if (isValid(item.gridType) && item.gridType === 'Date') {
                    colItem.valueFormatter = (data) => {
                        if(data.value){
                            const withoutZ = this.formatDateTime(data.value);
                            return withoutZ ? dayjs(withoutZ).format('YYYY-MM-DD') : "";
                        } else {
                            return ""
                        }
                    };
                }

                //Date only column
                if (isValid(item.gridType) && item.gridType === 'Datetime') {
                    colItem.valueFormatter = (data) => {
                        if(data.value){
                            const withoutZ = this.formatDateTime(data.value);
                            return withoutZ ? dayjs(withoutZ).format('YYYY-MM-DD HH:mm:ss') : "";
                        } else {
                            return ""
                        }

                        // console.log(data.value)
                        // let val = moment(data.value).format('YYYY-MM-DD HH:mm:ss');
                        // if (val == 'Invalid date') {
                        //     return '';
                        // }
                        // return val;
                    };
                }

                //Number column
                if (isValid(item.gridType) && item.gridType === 'Number') {
                    colItem.cellRenderer = Number;
                }

                //Radio column
                if (isValid(item.gridType) && item.gridType === 'Radio') {
                    colItem.cellRenderer = Radio;
                    colItem.cellRendererParams = {
                        valueOptions: item.options,
                    };
                }

                //Checkbox or switch column
                if (isValid(item.gridType) && (item.gridType === 'Checkbox' || item.gridType === 'Switch')) {
                    colItem.cellRenderer = Check;
                }

                //HTML column
                if (isValid(item.gridType) && item.gridType === 'Html') {
                    colItem.cellRenderer = Html;
                    colItem.cellRendererParams = {
                        customOptions: item.options,
                        fetchData: this.fetchData,

                    };
                }

                //Custom column
                if (isValid(item.gridType) && item.gridType === 'Custom') {
                    colItem.cellRenderer = Custom;
                    colItem.cellRendererParams = {
                        customOptions: item.options,
                        fetchData: this.fetchData,
                    };
                }

                //link
                if (isValid(item.gridType) && item.gridType === 'Link') {
                    colItem.cellRenderer = Link;
                    colItem.cellRendererParams = {
                        customOptions: item.options,
                        fetchData: this.fetchData,
                        link: item.link,
                        linkTarget: item.linkTarget,
                        icon: item.icon,
                        showOnlyIcon: item.showOnlyIcon,
                    };
                }

                //Custom column item as plugin
                if (isValid(item.gridType)) {
                    // if (window.init.data_grid_custom_elements) {
                    //     let custom = window.init.data_grid_custom_elements.find(custom_element => custom_element.element == item.gridType);
                    //     if (custom) {
                    //         // colItem.cellRenderer = require(`datagrid_custom/${item.gridType}.vue`).default;
                    //         // colItem.cellRendererParams = {
                    //         //     customOptions: item.options,
                    //         // }
                    //         // colItem.suppressRowTransform = true;
                    //         // colItem.cellClass = 'lambda-custom-element overflow-visible';
                    //     }
                    // }
                }

                //set update models
                if (isValid(item.editable) && (isValid(item.editable.shouldUpdate) && item.editable.shouldUpdate)) {
                    this.updateModels.push(item.model);
                }

                //editable text
                if (isValid(item.editable)) {
                    if (typeof item.editable.status != undefined && item.editable.status == true) {

                        colItem.cellRenderer = Html;
                        colItem.cellRendererParams = {
                            state: '',
                            type: item.gridType,
                        };

                        colItem.editable = true;

                        switch (item.editable.type) {
                            case 'date':
                                colItem.cellEditor = 'editableDate';
                                colItem.cellEditorParams = {
                                    editType: this.editType,
                                };
                                break;
                            case 'datepicker':
                                colItem.cellEditor = 'editableDatePicker';
                                break;
                            case 'number':
                                colItem.cellEditor = 'agNumberCellEditor';
                                break;
                            case 'select':
                                colItem.cellEditor = 'editableSelect';
                                break;
                            default:
                                break;
                        }
                    }
                }
                //Custom column item as plugin
                if (isValid(item.gridType)) {

                    if (this.$customDataGridElementList) {
                        if (this.$customDataGridElementList.length >= 1) {
                            const elIndex = this.$customDataGridElementList.findIndex(el => el.element === item.gridType);

                            if (elIndex >= 0) {
                                colItem.cellRenderer = this.$customDataGridElementList[elIndex].component;
                                colItem.cellRendererParams = {
                                    customOptions: item.options,
                                    fetchData: this.fetchData,
                                };
                            }
                        }
                    }
                }


                this.columns.push(colItem);
            }
        },

        getColumnWidth(width, colId) {
            let savedWidth = window.localStorage.getItem(this.$props.schemaID + '_column_width_' + colId);
            if (savedWidth) {
                return parseInt(savedWidth);
            }

            return parseInt(width);
        },

        columnResized(event) {
            if (event.finished) {
                // console.log(event)
                // window.localStorage.setItem(this.$props.schemaID + '_column_width_' + event.column.colId, event.column.actualWidth);
            }
        },
        formatDateTime(dateTimeStr) {
            if(dateTimeStr){
                const date = new Date(dateTimeStr);
                const YYYY = date.getUTCFullYear();
                const MM = String(date.getUTCMonth() + 1).padStart(2, '0');
                const DD = String(date.getUTCDate()).padStart(2, '0');
                const HH = String(date.getUTCHours()).padStart(2, '0');
                const mm = String(date.getUTCMinutes()).padStart(2, '0');
                const ss = String(date.getUTCSeconds()).padStart(2, '0');

                return `${YYYY}-${MM}-${DD} ${HH}:${mm}:${ss}`;
            } else {
                return  null
            }

        },

        restoreFilter() {
            if (!this.isClient) {
                let gridSavedFilter = JSON.parse(localStorage.getItem(`grid-${this.schemaID}`));
                this.filterModel = {};
                for (let key in gridSavedFilter) {
                    this.filterModel[key] = gridSavedFilter[key];
                }
            }
        },

        restoreFloatFilterValue() {
            let gridSavedFilter = JSON.parse(localStorage.getItem(`grid-${this.schemaID}`));
            for (let key in gridSavedFilter) {
                let filterComponent = this.gridApi.getFilterInstance(key);
                filterComponent.setModel(gridSavedFilter[key]);
            }
        },

        saveFilterState() {
            localStorage.setItem(`grid-${this.schemaID}`, JSON.stringify(this.gridApi.getFilterModel()));
        },
        setUserConditionValues(filters) {

            this.user_condition.forEach(userCondition => {
                filters[userCondition.grid_field] = window.init.user[userCondition.user_field];
            });
            return filters;
        },
        // Getting grid data
        fetchData() {
            this.gridApi.showLoadingOverlay();
            this.isLoading = true;

            //Setting source URL
            let url = `${this.query.src}?&paginate=${this.query.paginate}&page=${
                this.query.currentPage
            }&sort=${this.query.sort}&order=${this.query.order}`;

            //Setting filter form data
            let filters = Object.keys(this.filterModel)
                .filter(e => this.filterModel[e] !== null)
                .reduce((o, e) => {
                    o[e] = this.filterModel[e];
                    return o;
                }, {});

            if(this.filter){

                filters = {...filters, ...this.filter}
            }

            //Setting search params
            if (this.searchModel) {
                url = `${url}&search=${this.searchModel}`;
            }

            // if (this.user_condition) {
            //     filters = this.setUserConditionValues(filters);
            // }
            if (this.user_condition) {
                filters["user_condition"] = this.user_condition;
            }

            if (this.custom_condition) {
                filters.custom_condition = this.custom_condition;
            }

            axios.post(url, filters).then(({data}) => {
                if (this.isClient) {
                    if (Array.isArray(data)) {
                        this.data = data;
                        this.info.total = data.length;
                    }

                    if (typeof data === 'object' && ('data' in data)) {
                        this.data = data.data;
                    }
                } else {
                    //for tuushin llc
                    // if (this.$props.schemaID == 224) {
                    //     this.info.total = data.data.total;
                    //     this.info.totalPage = data.data.last_page;
                    //     //getting data
                    //     this.data = data.data.data;
                    //     this.gridOptions.api.setRowData(data.data.data)
                    //
                    //     //after data has been rendered
                    //     this.fetchAggregationsTuushin(filters, data.footer);
                    // } else {
                    this.info.total = data.total;
                    this.info.totalPage = data.last_page;
                    //getting data
                    this.data = data.data;
                    this.gridOptions.api.setRowData(data.data);

                    if (this.aggregations.columnAggregations.length >= 1) {
                        this.fetchAggregations(filters);
                    }
                    // }
                }

                if (this.gridOptions.sizeColumnsToFit) {
                    this.gridApi.sizeColumnsToFit();
                }

                if (this.data.length <= 0) {
                    this.gridOptions.suppressNoRowsOverlay = false;
                    this.gridApi.showNoRowsOverlay();
                } else {
                    this.gridApi.hideOverlay();
                }

                //select prev selected items
                setTimeout(() => {
                    this.preselect();

                    this.selectInputModels.forEach(filterModel => {
                        let instance = this.gridApi.getFilterInstance(filterModel);
                        instance.selectNothing();
                    });

                    // if(this.hasCheckbox){
                    //
                    //   this.gridApi.forEachNode( (node) =>{
                    //     node.setSelected(true);
                    //   });
                    // }
                }, 100);


                this.isLoading = false;
            }).catch(e => {
                console.log(e.message);
                this.gridApi.hideOverlay();
                this.isLoading = false;
            });
        },
        updateFilterModel(model, val) {
            this.filterModel[model] = val;
            this.filterData(1);
        },
        filterData(page) {
            this.changePage(page);
            this.showMobileFilter = false;
        },

        fetchAggregations(filters) {
            this.aggregations.loading = true;
            this.aggregations.forumlaResult = '';
            this.aggregations.data = [];
            axios.post(`${this.baseUrl}/lambda/puzzle/grid/aggergation/${this.customShemaId ? this.customShemaId : this.$props.schemaID}`, filters).then(({data}) => {
                let mirror_data = {};

                this.aggregations.columnAggregations.map(columnAggregation => {
                    let data_key = columnAggregation.aggregation + '_' + columnAggregation.column;
                    if (data[0][data_key] == undefined) {
                        data_key = data_key.toLowerCase();
                    }
                    mirror_data[columnAggregation.column] = data[0][data_key];
                });

                this.aggregations.columnAggregationsFormula.map(
                    columnAggregationsFormula => {
                        let pre_formula = dataFromTemplate(
                            columnAggregationsFormula.template,
                            mirror_data,
                        );
                        let calculated = evil(pre_formula);

                        let result = columnAggregationsFormula.title + ': ' + getNumber(calculated) + columnAggregationsFormula.symbol;
                        if (this.aggregations.forumlaResult == '') {
                            this.aggregations.forumlaResult = result;
                        } else {
                            this.aggregations.forumlaResult =
                                this.aggregations.forumlaResult + ', ' + result;
                        }
                    },
                );

                let bottom_data = {};

                this.columns.map(column => {
                    if (column.field)
                        bottom_data[column.field] = null;
                });

                this.aggregations.columnAggregations.map(columnAggregation => {
                    let aggregation = columnAggregation.aggregation;
                    let column = columnAggregation.column;
                    if (data.length >= 1) {
                        let colIndex = this.schema.findIndex(col => col.model == column);
                        let data_key = aggregation + '_' + column;
                        if (data[0][data_key] == undefined) {
                            data_key = data_key.toLowerCase();
                        }
                        mirror_data[columnAggregation.column] = data[0][data_key];
                        if (colIndex >= 0) {
                            bottom_data[column] = number(data[0][data_key]) + ' ' + columnAggregation.symbol;
                        }

                    }
                });

                this.gridApi.setPinnedBottomRowData([bottom_data]);


                this.aggregations['data'] = data;
                this.aggregations['loading'] = false;


            }).catch(e => {
                console.log(e.message);
            });
        },

        fetchAggregationsTuushin(filter, localdata) {
            this.aggregations.loading = true;
            this.aggregations.forumlaResult = '';
            this.aggregations.data = [];

            let bottom_data = {};

            this.columns.map(column => {
                if (column.field)
                    bottom_data[column.field] = null;
            });
            let str = 'totalamountfcy saleamountfcy agent1dun agent2dun agent3dun agent4dun agent5dun niitzardal profitamountfcy';
            this.aggregations.columnAggregations.map(columnAggregation => {
                let column = columnAggregation.column;

                if (data.length >= 1) {
                    if (str.includes(column)) {
                        bottom_data[column] = localdata[column]['MNT'] + ' ' + localdata[column]['USD'] + ' ' + localdata[column]['EUR'] + ' ' + localdata[column]['JPY'] + ' ' + localdata[column]['AUD'] + ' ' + localdata[column]['RUB'];
                    } else {
                        bottom_data[column] = localdata[column];
                    }
                }
            });

            this.gridApi.setPinnedBottomRowData([bottom_data]);

            this.aggregations['data'] = data;
            this.aggregations['loading'] = false;
        },

        searchData(val, page) {
            this.searchModel = val;
            this.changePage(page);
        },

        changePage(page, pageSize) {
            // if (pageNumber > 1) {
            this.query.currentPage = page;
            if (pageSize) {
                this.query.paginate = pageSize;
            }

            // this.$router.replace({...this.$route.query, dp: pageNumber})
            this.$router.push({
                query: {
                    sort: this.query.sort,
                    order: this.query.order,
                    paginate: this.query.paginate,
                    currentPage: this.query.currentPage,
                }
            });
            // }
            this.fetchData();
        },

        //Events
        append(val) {
            this.data = [_.cloneDeep(val), ...this.data];
            this.info.total++;
        },

        update(val) {
            this.data = this.data.map(item => {
                if (item[this.identity] == val[this.identity]) {
                    item = val;
                    // _.merge(item, val);
                }
                return item;
            });
        },

        view(id) {
            console.log('view data', id);
        },

        quickEdit(id) {
            console.log('quickedit data', id);
        },

        remove(id, index) {
            this.delLoading = true;
            axios.delete(this.page_id ? `${this.baseUrl}/lambda/krud/delete/${this.schemaID}/${id}?page_id=${this.page_id}` : `${this.baseUrl}/lambda/krud/delete/${this.schemaID}/${id}`)
                .then(o => {
                    if (o.status) {
                        notification["success"]({
                            message: this.lang.infoDeleted,
                        });
                        // this.data.splice(index, 1);
                        // this.info.total--;
                        // setTimeout(() => {
                        //     this.delLoading = false;
                        //     this.deleteModal = false;
                        // }, 600);
                        this.refresh();
                    } else {
                        notification["error"]({
                            message: this.lang.errorOccWhileDeleting + '!',
                        });
                        setTimeout(() => {
                            this.delLoading = false;
                            this.deleteModal = false;
                        }, 600);
                    }
                })
                .catch(err => {
                    notification["error"]({
                        message: this.lang.errorMsg + '!',
                    });
                    setTimeout(() => {
                        this.delLoading = false;
                        this.deleteModal = false;
                    }, 600);
                });
        },

        //Custom events
        refresh() {
            this.searchModel = null;
            this.filterModel = {};
            this.gridApi.setFilterModel(null);
            localStorage.removeItem(`grid-${this.schemaID}`);


            if (this.$route.query.sort) {
                this.query.sort = this.$route.query.sort
            }
            if (this.$route.query.order) {
                this.query.order = this.$route.query.order
            }
            if (this.$route.query.paginate) {
                if (!isNaN(this.$route.query.paginate)) {
                    this.query.paginate = this.$route.query.paginate * 1
                }
            }

            if (this.$route.query.currentPage) {
                if (!isNaN(this.$route.query.currentPage)) {
                    this.query.currentPage = this.$route.query.currentPage * 1
                } else {
                    this.query.currentPage = 1;
                }
            } else {
                this.query.currentPage = 1;
            }
            this.fetchData();
        },

        exportExcel(callBack) {
            if (this.isClient) {
                this.gridApi.exportDataAsExcel();
            } else {
                let url = `${this.baseUrl}/lambda/krud/excel/${this.schemaID}`;
                let filters = Object.keys(this.filterModel)
                    .filter(e => this.filterModel[e] !== null)
                    .reduce((o, e) => {
                        o[e] = this.filterModel[e];
                        return o;
                    }, {});
                if (this.user_condition) {
                    filters.user_condition = this.user_condition;
                }

                if (this.custom_condition) {
                    filters.custom_condition = this.custom_condition;
                }
                if (this.header) {
                    filters.customHeader = JSON.stringify(this.header);
                }

                if (this.header) {
                    filters.customHeader = 'customHeader';
                }

                axios
                    .post(url, filters)
                    .then(({data}) => {
                        if (data.tableRows) {
                            let Header = document.getElementById('custom-header');
                            tableToExcel(Header ? Header.innerHTML : '', data.tableRows, data.name);
                            if (callBack) {
                                callBack(true);
                            }
                        } else {
                            let a = document.createElement('a');
                            const blob = this.b64toBlob(decodeURIComponent(data.file), 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                            a.href = URL.createObjectURL(blob);
                            a.download = data.name;
                            a.click();
                            if (callBack) {
                                callBack(true);
                            }
                        }
                    })
                    .catch(e => {
                        console.log(e.message);
                        if (callBack) {
                            callBack(false);
                        }
                    });
            }
        },

        b64toBlob(b64Data, contentType = '', sliceSize = 512) {
            const byteCharacters = atob(b64Data);
            const byteArrays = [];

            for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                const slice = byteCharacters.slice(offset, offset + sliceSize);

                const byteNumbers = new Array(slice.length);
                for (let i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }

                const byteArray = new Uint8Array(byteNumbers);
                byteArrays.push(byteArray);
            }

            let blob = new Blob(byteArrays, {type: contentType});
            return blob;
        },

        print() {

            this.showPrint = true;
        },

        importExcel() {
            this.showExcelImport = true;
        },

        //Default grid actions
        onRowDblClick(row) {
            if (this.$props.dblClick) {
                if (this.permissions) {
                    if (this.permissions.u) {
                        this.$props.dblClick(row.data);
                    }
                } else {
                    this.$props.dblClick(row.data);
                }
            } else if (this.permissions) {
                if (this.permissions.u) {
                    if (this.gridActions.find(action => action == 'dbl') || this.gridActions.find(action => action == 'obl')) {
                        if (row.data[this.identity]) {
                            this.fnEdit(row.data[this.identity]);
                        }
                    }
                }
            }
        },
        onRowClick(row) {
            if (this.permissions) {
                if (this.permissions.u) {
                    if (this.gridActions.find(action => action == 'obl')) {

                        if (row.data[this.identity]) {
                            this.fnEdit(row.data[this.identity], row.data)
                        }
                    }
                }
            }
        },

        getContextMenuItems(params) {
            if (!this.hasContextMenu || params.node == null) {
                return null;
            }

            let rowId = params.node.data.id;
            let actions = [];

            if (this.$props.actions) {
                this.$props.actions.forEach(item => {
                    let menuItem = {
                        name: item.label ? item.label : '',
                        icon: '<span class=\'' + item.icon + '\'></span>',
                        action: () => {
                            item.method(params.node.data);
                        },
                        disabled: item.disabled ? item.disabled : false,
                    };
                    actions.push(menuItem);
                });
            }

            this.gridActions.forEach(item => {
                if (item == 'qe') {
                    console.log('qe');
                }

                if (item == 'cl') {
                    let menuItem = {
                        name: 'Хувилах',
                        icon: '<span class=\'ivu-icon ivu-icon-ios-copy-outline\'></span>',
                        action: () => {
                            this.fnClone(rowId);
                        },
                    };
                    actions.push(menuItem);
                }

                if (item == 'v') {
                    console.log('v action');
                }

                if (item == 'e') {
                    let menuItem = {
                        name: 'Засах',
                        icon:
                            '<span class=\'ivu-icon ivu-icon-ios-color-wand-outline\'></span>',
                        action: () => {
                            this.fnEdit(rowId);
                        },
                    };
                    actions.push(menuItem);
                }

                if (item == 'd') {
                    let menuItem = {
                        name: 'Устгах',
                        icon: '<span class=\'ivu-icon ivu-icon-ios-trash-outline\'></span>',
                        action: () => {
                            this.deleteModal = true;
                            this.currentRow.rowId = rowId;
                            this.currentRow.rowIndex = params.node.rowIndex;
                            // this.remove(rowId, params.node.rowIndex);
                        },
                    };
                    actions.push(menuItem);
                }
            });

            return actions;
        },

        onSortChanged() {
            //when enable server side sort
            if (!this.isClient) {
                let column = this.gridColumnApi.getColumnState().filter(c => c.sort != null);
                if (typeof column !== "undefined" && column.length > 0) {
                    this.query.sort = column[0].colId;
                    this.query.order = column[0].sort;
                    this.fetchData();
                }
            }
        },

        getColumnValues(colId) {
            let colValues = [];
            this.gridApi.forEachNode((rowNode) => {
                if (!colValues.includes(rowNode.data[colId]) && rowNode.data[colId] != null) {
                    colValues.push(rowNode.data[colId]);
                }
            });
            return colValues;
        },

        manualAliasFilter(values, needle) {
            return values.filter(v => {
                let startWith = false;
                let endWith = false;

                if (v.charAt(0) == '*') {
                    startWith = true;
                }

                let lastFilterChar = v[v.length - 1];
                if (lastFilterChar == '*') {
                    endWith = true;
                }

                let f = v.toLowerCase().replace('*', '');
                let valueLowerCase = needle.toString().toLowerCase();

                if (startWith == true && endWith == false) {
                    let index = valueLowerCase.lastIndexOf(f);
                    return index >= 0 && index === (valueLowerCase.length - f.length);
                }

                if (endWith == true && startWith == false) {
                    return valueLowerCase.indexOf(f) === 0;
                }

                if ((endWith == false && startWith == false) || (endWith == true && startWith == true)) {
                    return f.includes(valueLowerCase);
                }

                return false;
            });
        },

        onClientFilter(model, val, type) {
            console.log('working here', type);
            let filterComponent = this.gridApi.getFilterInstance(model);
            // filterComponent.selectNothing();

            let filterColumnUniqueValues = this.getColumnValues(model);
            let filterValueAliases = this.manualAliasFilter(filterColumnUniqueValues, val);
            filterValueAliases.forEach(filterSetVal => {
                filterComponent.selectValue(filterSetVal);
            });

            filterComponent.applyModel();
            this.gridApi.onFilterChanged();
            filterComponent.selectNothing();
        },

        onFilterModified(event) {
            if (!this.isClient) {
                //Todo server side configs
                console.log(event);
            }
        },

        onFilterChanged(event) {

            if (this.saveFilter) {
                this.saveFilterState(event);
            }


            //when enable server side filter
            if (!this.isClient) {
                this.filterModel = {};
                let filters = event.api.getFilterModel();
                for (let key in filters) {

                    this.filterModel[key] = filters[key];
                }
                this.filterData(1);

            } else {
                let filters = event.api.getFilterModel();
                for (let key in filters) {
                    if (Object.prototype.hasOwnProperty.call(filters, key)) {
                        console.log(filters[key]);
                        if (filters[key].filterType == 'set' && this.selectInputModels.includes(key)) {
                            let instance = this.gridApi.getFilterInstance(key);
                            // console.log("here");
                            //             if (instance.isNothingSelected()) {
                            //                 console.log("I am here nothing");
                            //                 //     instance.selectEverything();
                            //                 //     // this.gridApi.onFilterChanged();
                            //             }
                            instance.selectNothing();
                        }
                    }
                }
                this.info.total = this.gridApi.getModel().rootNode.childrenAfterFilter.length;
            }
        },

        //Grid inline form functions
        onCellEditingStarted(cell) {
            if (this.editType == null) {
                this.editCellValue = cell.value;
            }
        },

        onCellEditingStopped(cell) {
            if (this.editType == null && this.editableAction != null && this.editCellValue !== cell.value) {
                // Setting post data
                let postData = {};
                postData[cell.colDef.field] = cell.value;

                this.postModels.forEach(item => {
                    postData[item] = cell.data[item];
                });

                //if has submit event
                if (this.editableShouldSubmit) {
                    this.setChangedData(cell, postData);
                    return;
                }

                let value = `<span class='loading-cell'><span>${cell.value}</span><i class='ti-reload'></i></span>`;
                cell.node.setDataValue(cell.colDef.field, value);

                let editUrl = convertLink(this.editableAction, cell.data);

                //response should have data[] and status boolean
                axios.post(editUrl, postData)
                    .then(({data}) => {
                        if (data.status) {
                            let successValue = `<span class='success-cell'><span>${cell.value}</span><i class='ti-check'></i></span>`;
                            cell.node.setDataValue(cell.colDef.field, successValue);
                            if (isValid(data.data)) {
                                this.updateModels.forEach(item => {
                                    cell.node.setDataValue(item, data.data[item]);
                                });
                            }

                            setTimeout(() => {
                                cell.node.setDataValue(cell.colDef.field, cell.value);
                            }, 1100);
                        } else {
                            setTimeout(() => {
                                let errorValue = `<span class='error-cell'><span>${cell.value}</span><i class='ti-check'></i></span>`;
                                cell.node.setDataValue(cell.colDef.field, errorValue);
                                setTimeout(() => {
                                    cell.node.setDataValue(cell.colDef.field, this.editCellValue);
                                }, 1500);
                            }, 1000);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        setTimeout(() => {
                            let errorValue = `<span class='error-cell'><span>${cell.value}</span><i class='ti-close'></i></span>`;
                            cell.node.setDataValue(cell.colDef.field, errorValue);
                            setTimeout(() => {
                                cell.node.setDataValue(cell.colDef.field, this.editCellValue);
                            }, 1500);
                        }, 1000);
                    });
            }
        },

        onRowEditingStarted(row) {
            this.editRowValue = _.clone(row.data);
            this.gridApi.setFocusedCell(row.rowIndex, row.node.Column);
        },

        onRowEditingStopped(row) {
            if (compareObj(this.editRowValue, row.data)) {
                return;
            }

            if (this.editableShouldSubmit) {
                let item = {
                    rowIndex: row.rowIndex,
                    data: row.data,
                };
                this.changedRowsData.push(item);
                return;
            }

            message.destroy(messageKey);

            message.loading({
                content: this.lang.pleaseWaitForLoading,
                key: messageKey,
                duration: 0
            });


            let editUrl = convertLink(this.editableAction, row.data);

            axios.post(editUrl, row.data)
                .then(({data}) => {

                    if (data.status) {
                        message.success({content: this.lang.successfullySaved, key: messageKey, duration: 2});

                        if (isValid(data.data)) {
                            this.updateModels.forEach(item => {
                                row.node.setDataValue(item, data.data[item]);
                            });
                        }

                    } else {
                        message.error({
                            content: 'msg' in data ? data.msg : this.lang.anErrorOccurredWhileSaving,
                            key: messageKey,
                            duration: 2
                        });
                    }
                })
                .catch(err => {
                    console.log(err);
                    message.error({content: this.lang.anErrorOccurredWhileSaving, key: messageKey, duration: 2});
                });
        },

        setChangedData($event, data) {
            let isset = this.changedRowsData.find(r => r.rowIndex === $event.rowIndex);
            if (isset) {
                isset.data = data;
            } else {
                let item = {
                    rowIndex: $event.rowIndex,
                    data: data,
                };
                this.changedRowsData.push(item);
            }
        },

        saveGridData() {
            if (this.changedRowsData.length === 0) {
                message.info({
                    content: this.lang.noChangesHaveBeenReported,
                    key: messageKey
                });
                return;
            }

            message.destroy(messageKey);
            message.loading({
                content: this.lang.pleaseWaitForLoading,
                key: messageKey,
                duration: 0
            });

            console.log(this.editableAction)
            let editUrl = convertLink(this.editableAction, {});

            //Post with row index and data. Response should have row index and update model data
            axios.post(editUrl, this.changedRowsData)
                .then(({data}) => {
                    if (data.status) {
                        message.success({content: this.lang.successfullySaved, key: messageKey, duration: 2});
                        if (isValid(data.data)) {
                            data.data.forEach(item => {
                                this.updateModels.forEach(cellModel => {
                                    this.gridApi.getRowNode(item.rowIndex).setDataValue(cellModel, item[cellModel]);
                                });
                            });
                        }
                        this.changedRowsData = [];
                    } else {

                        message.error({
                            content: 'msg' in data ? data.msg : this.lang.anErrorOccurredWhileSaving,
                            key: messageKey,
                            duration: 2
                        });
                    }
                })
                .catch(err => {
                    console.log(err);
                    message.error({content: this.lang.anErrorOccurredWhileSaving, key: messageKey, duration: 2});
                });
        },

        // Grid selections
        preselect() {
            this.gridApi.deselectAll();
            if (this.highlights && this.highlights.length > 0) {
                this.gridApi.forEachNode(node => {
                    this.highlights.forEach(item => {
                        if (node.data.id == item.id) {
                            node.setSelected(true);
                        }
                    });
                });
            }
        },

        autoSelectRows(node) {
            let selectedNodes = this.gridApi.getSelectedNodes();
            selectedNodes.forEach(item => {
                if (node.isSelected()) {
                    this.gridApi.forEachNode(node => {
                        if (node.data[this.autoSelectModel] == item.data[this.autoSelectModel]) {
                            node.setSelected(true);
                        }
                    });
                } else {
                    if (node.data[this.autoSelectModel] == item.data[this.autoSelectModel]) {
                        item.setSelected(false);
                    }
                }
            });
        },

        //Row selection
        onRowSelected(e) {
            if (this.$props.onRowSelect) {
                let selectedNodes = this.gridApi.getSelectedNodes();
                let selectedData = selectedNodes.map(node => node.data);
                if (this.autoSelect && this.autoSelectModel != null) {
                    this.autoSelectRows(e.node);
                }
                this.$props.onRowSelect(selectedData, selectedNodes);
            }
        },
    },
};
</script>
<style lang='scss'>


</style>
