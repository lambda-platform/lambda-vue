<template>
    <div class="card drawer-wrappper">
        <common :parent="parent" :title="title" :hideAction="true" :permissions="permissions" :CRUD_ID="CRUD_ID"></common>

        <section class="offcanvas-template">
            <div class="crud-page">
                <div class="crud-page-body">
                    <div class="" >
                        <div class="ant-drawer-content">
                            <div class="ant-drawer-wrapper-body">

                                <div class="ant-drawer-body">
                                    <dataform
                                        ref="dataForm"
                                        :hideTitle="true"
                                        :schemaID="form"
                                        :title="title"
                                        :url="url"
                                        :editMode="editMode"
                                        :onSuccess="templateOnSuccess"
                                        :onReady="onReadyEdit"
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
import { ref, onMounted } from 'vue';
import { useCrud } from './useCrud';
import common from '../components/common';
import {useI18n} from "vue-i18n";
const { t } = useI18n();
// Define props

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


const formIdentity = ref(null);


function templateEdit () {

}
const templateOnSuccess = () => {
    if (props.actions) {
        editMode.value = true;
        dataForm.value.editModel(props.actions);
    } else {
        if (formIdentity.value) {
            editMode.value = true;
            dataForm.value.editModel(formIdentity.value);
        }
    }
};

const onReadyEdit = (formSchema, schema) => {
    console.log(props.actions)
    if (props.actions) {
        editMode.value = true;
        dataForm.value.editModel(props.actions);
    } else {
        checkEdit(formSchema);
    }
};
function templateOnError () {

}
const {
    closeByBtn, gridSrc, formSrc, editMode, searchModel, form_width, exportLoading,
    isPrint, isExcel, isRefresh, isSave, rowId, cloneID, visibleDataForm, isExcelUpload,
    excelUploadCustomUrl, showID, hasVNavSlot, hasNavSlot, hasLeftSlot, url, lang,
    view, edit, clone, quickEdit, refresh, search, stopLoading, exportExcel, print,
    excelUploadMethod, save, onReady, onSuccess, onError, mediaRecorder, recordedChunks, showScreenRecordConfirm, startRecording, stopRecording
} = useCrud(props, dataForm, dataGrid, templateEdit, templateOnSuccess, templateOnError, t, props.CRUD_ID);




const checkEdit = (formSchema) => {
    if (props.user_condition && props.user_condition.formCondition) {
        const formIdentity = formSchema["identity"];
        const editUserConditionIndex = props.user_condition.formCondition.findIndex(c => c.form_field === formIdentity);
        if (editUserConditionIndex >= 0) {
            const userField = props.user_condition.formCondition[editUserConditionIndex]["user_field"];
            if (window.init && window.init.user && window.init.user[userField]) {
                editMode.value = true;
                formIdentity.value = window.init.user[userField];
                dataForm.value.editModel(formIdentity.value);
            }
        }
    }
};
</script>
