<template>
    <div class="card drawer-wrappper">
        <common :parent="parent" :title="title" :hideAction="true" :permissions="permissions" :CRUD_ID="CRUD_ID"></common>

        <section class="offcanvas-template">
            <div class="crud-page">
                <div class="crud-page-body">
                    <div class="" >
                        <div class="ant-drawer-content">
                            <div class="ant-drawer-wrapper-body">
<!--                                <div class="ant-drawer-header">-->
<!--                                    <div class="ant-drawer-header-title">-->
<!--                                        <div class="ant-drawer-title">{{ title }}</div>-->
<!--                                    </div>-->
<!--                                </div>-->
                                <div class="ant-drawer-body">
                                    <dataform
                                        ref="dataForm"
                                        :hideTitle="true"
                                        :schemaID="form"
                                        :title="title"
                                        :url="url"
                                        :editMode="editMode"
                                        :onSuccess="onSuccess"
                                        :onReady="onReady"
                                        :do_render="true"
                                        :permissions="permissions"
                                        :page_id="page_id"
                                        :user_condition="user_condition ? user_condition.formCondition : null"
                                        :onError="onError"

                                    >
                                    </dataform>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>

    </div>
</template>
<script setup>
import { useCrud } from './useCrud';

import common from '../components/common';
const { t } = useI18n();
import {ref} from "vue";
import {useI18n} from "vue-i18n";


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

function templateEdit () {

}
function templateOnSuccess () {

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
