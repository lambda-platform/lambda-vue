<template>
    <div class="card drawer-wrappper">
        <common :parent="parent" :title="title" :addAction="openSide" :permissions="permissions" :CRUD_ID="CRUD_ID"></common>
        <portal to="header-right" >
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
                    <div id="drawer-container">
                        <div :class="openSlidePanel ? 'dg-flex open-drawer' : 'dg-flex'">
                            <datagrid v-if="permissions ? permissions.r : false" ref="dataGrid"
                                      :url="url"
                                      :schemaID="grid"
                                      :paginate="50"
                                      :fnClone="clone"
                                      :fnEdit="edit"
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
        <a-modal
            v-model:open="openSlidePanel"
            class="create"
            :maskClosable="false"
            :title="withCrudLog ? `${title} : ${rowId}` : title"
            :forceRender="true"
            :width="form_width"
            :footer="null"
            placement="right"
        >
            <dataform
                ref="dataForm"
                :hideTitle="true"
                :schemaID="form"
                :title="title"
                :url="url"
                :editMode="editMode"
                :onSuccess="onSuccess"
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

        </a-modal>
    </div>
</template>
<script setup>
import { ref } from 'vue';
import { useCrud } from './useCrud';
import {useI18n} from "vue-i18n";
const { t } = useI18n();
import common from '../components/common';
import Krudtools from '../components/krudtools';
import crudLog from '../components/crudLog';

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
function hideSide (){
    openSlidePanel.value = false;
    editMode.value = false;
}
function openSide () {
    openSlidePanel.value = true;
}

function templateEdit () {
    openSide()
}
function templateOnSuccess () {
    hideSide()
}

function templateOnError () {

}

const {
    closeByBtn, gridSrc, formSrc, editMode, searchModel, form_width, exportLoading,
    isPrint, isExcel, isRefresh, isSave, rowId, cloneID, visibleDataForm, isExcelUpload,
    excelUploadCustomUrl, showID, hasVNavSlot, hasNavSlot, hasLeftSlot, url, lang,
    view, edit, clone, quickEdit, refresh, search, stopLoading, exportExcel, print,
    excelUploadMethod, save, onReady, onSuccess, onError, mediaRecorder, recordedChunks, showScreenRecordConfirm, startRecording, stopRecording
} = useCrud(props, dataForm, dataGrid, templateEdit, templateOnSuccess, templateOnError, t, props.CRUD_ID);

</script>
