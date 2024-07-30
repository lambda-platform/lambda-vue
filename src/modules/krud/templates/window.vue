<template>
    <div class="card drawer-wrappper window-crud">
        <common :parent="parent" :title="title" :addAction="openSide" :hide-action="openSlidePanel" :permissions="permissions" :CRUD_ID="CRUD_ID"></common>
        <portal to="header-right" v-if="!openSlidePanel">
            <Krudtools :search="search"
                       :refresh="refresh"
                       :exportExcel="exportExcel"
                       :exportLoading="exportLoading"
                       :print="print"
                       :save="save"
                       :isPrint="isPrint"
                       :isExcel="isExcel"
                       :isExcelUpload="isExcelUpload"
                       :excelUploadCustomUrl="excelUploadCustomUrl"
                       :excelUploadMethod="excelUploadMethod"
                       :isRefresh="isRefresh"
                       :isSave="isSave"
                       :isSearch="false"
            />
        </portal>
        <section class="offcanvas-template">
            <div class="crud-page">
                <div class="crud-page-body">
                    <div class="ant-drawer" v-if="openSlidePanel">
                        <div class="ant-drawer-content">
                            <div class="ant-drawer-wrapper-body">
                                <div class="ant-drawer-header">
                                    <div class="ant-drawer-header-title flex p-4  border-b">
                                        <div class="ant-drawer-title flex-grow">{{ title }}</div>
                                        <button aria-label="Close" @click="hideSide" class="ant-drawer-close"><span role="img" aria-label="close" class="anticon anticon-close"><svg focusable="false" class="" data-icon="close" width="1em" height="1em" fill="currentColor" aria-hidden="true" viewBox="64 64 896 896"><path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 00203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"></path></svg></span></button>
                                    </div>
                                </div>
                                <div class="ant-drawer-body">

                                    <div :class="withCrudLog && editMode ? 'with-crud-log' : 'crud-form'">
                                        <dataform
                                            ref="dataForm"
                                            :hideTitle="true"
                                            :schemaID="form"
                                            :title="title"
                                            :url="url"
                                            :editMode="editMode"
                                            :onSuccess="templateOnSuccess"
                                            :onReady="onReady"
                                            :do_render="openSlidePanel"
                                            :permissions="permissions"
                                            :page_id="page_id"
                                            :user_condition="user_condition ? user_condition.formCondition : null"
                                            :onError="onError"
                                            :close="hideSide"
                                        >
                                        </dataform>
                                        <crud-log v-if="withCrudLog && editMode" :form="form" :rowId="rowId" :grid="grid"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div  v-if="!openSlidePanel" id="drawer-container">
                        <div :class="openSlidePanel ? 'dg-flex open-drawer' : 'dg-flex'">
                            <datagrid v-if="permissions ? permissions.r : false" ref="dataGrid"
                                      :url="url"
                                      :schemaID="grid"
                                      :paginate="50"
                                      :fnClone="templateClone"
                                      :fnEdit="templateEdit"
                                      :fnQuickEdit="quickEdit"
                                      :fnView="view"
                                      :actions="$props.actions"
                                      :dblClick="$props.dbClickAction"
                                      :onRowSelect="$props.onRowSelect"
                                      :permissions="permissions"
                                      :page_id="page_id"
                                      :custom_condition="$props.custom_condition? $props.custom_condition :null"
                                      :user_condition="user_condition ? user_condition.gridCondition : null"
                            >
                            </datagrid>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    </div>
</template>
<script setup>
import { ref, watch, onBeforeMount, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useCrud } from './useCrud';
import common from '../components/common';
import Krudtools from '../components/krudtools';
import crudLog from '../components/crudLog';
import {useI18n} from "vue-i18n";
const { t } = useI18n();
const props = defineProps({
    title: String,
    icon: String,
    main_tab_title: String,
    grid: Number,
    form: Number,
    projects_id: Number,
    hideHeader: Boolean,
    hasSelection: Boolean,
    actions: String,
    dbClickAction: Function,
    onRowSelect: Function,
    rowCurrentChange: Function,
    permissions: Object,
    user_condition: Object,
    custom_condition: Object,
    view_url: String,
    mode: String,
    onPropertySuccess: Function,
    onPropertyError: Function,
    page_id: String,
    withoutHeader: Boolean,
    withCrudLog: Boolean,
    base_url: String,
    form_width: [Number, String],
    edit_id: [Number, String],
    CRUD_ID: [Number, String],
    template: String ,
    parent: Object
});
const dataForm = ref(null);
const dataGrid = ref(null);
const openSlidePanel = ref(false);
const router = useRouter();
const route = useRoute();

function templateOnError () {

}


const path = computed(() => route.fullPath);

const hideSide = () => {
    openSlidePanel.value = false;
    editMode.value = false;
    router.push({ query: getQuery() });
};

const openSide = () => {
    let query = getQuery();
    query["add"] = true;
    router.push({ query });
    openSlidePanel.value = true;
};

const templateEdit = (id) => {
    let query = getQuery();
    query["edit"] = true;
    query["id"] = id;
    if (route.params.id && route.query.edit) {
        if (route.params.id.toString() !== id.toString()) {
            router.push({ query });
        }
    } else {
        router.push({ query });
    }
};

const templateClone = (id) => {
    let query = getQuery();
    query["clone"] = true;
    query["id"] = id;
    if (route.params.id && route.query.edit) {
        if (route.params.id.toString() !== id.toString()) {
            router.push({ query });
        }
    } else {
        router.push({ query });
    }
};

const templateOnSuccess = () => {
    hideSide();
};

const handleChange = () => {
    let add = route.query.add;
    let edit = route.query.edit;
    let clone = route.query.clone;
    let id = route.query.id;
    if (add === 'true' || add === true) {
        openSlidePanel.value = true;
    } else if (edit === 'true' || edit === true) {
        rowId.value = id;
        editMode.value = true;
        openSlidePanel.value = true;
    } else if (clone === 'true' || clone === true) {
        rowId.value = id;
        cloneID.value = id;
        editMode.value = true;
        openSlidePanel.value = true;
    } else {
        rowId.value = 0;
        editMode.value = false;
        openSlidePanel.value = false;
    }
};

const getQuery = () => {
    let query = {};
    if (route.query.sort) {
        query["sort"] = route.query.sort;
    }
    if (route.query.order) {
        query["order"] = route.query.order;
    }
    if (route.query.paginate) {
        query["paginate"] = route.query.paginate;
    }
    if (route.query.currentPage) {
        query["currentPage"] = route.query.currentPage;
    }
    return query;
};
const {
    closeByBtn, gridSrc, formSrc, editMode, searchModel, form_width, exportLoading,
    isPrint, isExcel, isRefresh, isSave, rowId, cloneID, visibleDataForm, isExcelUpload,
    excelUploadCustomUrl, showID, hasVNavSlot, hasNavSlot, hasLeftSlot, url, lang,
    view, edit, clone, quickEdit, refresh, search, stopLoading, exportExcel, print,
    excelUploadMethod, save, onReady, onSuccess, onError, mediaRecorder, recordedChunks, showScreenRecordConfirm, startRecording, stopRecording
} = useCrud(props, dataForm, dataGrid, templateEdit, templateOnSuccess, templateOnError, t, props.CRUD_ID);




watch(path, () => {
    handleChange();
});

onBeforeMount(() => {
    handleChange();
});
</script>
