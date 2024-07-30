<template>
    <common :parent="parent" :title="title" :addAction="openSide" :permissions="permissions" :CRUD_ID="CRUD_ID"></common>
    <portal to="header-right">
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
        />
    </portal>
    <div class="krud-drawer">
    <section class="offcanvas-template">
      <div class="crud-page">
        <div class="crud-page-body">
          <div id="drawer-container">
            <div id="left_panel">
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
            <div id="right_panel" class="ant-drawer" ref="panel" :class="openSlidePanel ? 'show-panel' : 'hide-panel'">
              <div class="resizer"></div>
              <div class="ant-drawer-content-wrapper">

                <div class="ant-drawer-content">
                  <div class="ant-drawer-wrapper-body">
                    <div class="ant-drawer-header">
                      <div class="ant-drawer-header-title flex p-4  border-b" v-if="openSlidePanel">
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
                        </div>

                    </div>
                  </div>
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
import { ref } from 'vue';
import {useI18n} from "vue-i18n";
const { t } = useI18n();
import { useCrud } from './useCrud';
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
const panel = ref(false);
const openSlidePanel = ref(false);
const m_pos = ref(0);


function hideSide() {
    openSlidePanel.value = false;
    editMode.value = false;
    panel.value.style.width = '0px';
    panel.value.style.flex = '0 0 0px';
}

function openSide() {
    if (!openSlidePanel.value) {
        openSlidePanel.value = true;
        let unit = (window.innerWidth - 300) / 100;
        let w = parseInt(unit * 40);
        panel.value.style.width = w + 'px';
        panel.value.style.flex = `0 0 ${w}px`;
    }
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


function resize(e) {
    window.getSelection().removeAllRanges();
    const dx = m_pos.value - e.x;
    m_pos.value = e.x;
    panel.value.style.width = (parseInt(getComputedStyle(panel.value, '').width) + dx) + 'px';
    panel.value.style.flex = `0 0 ${(parseInt(getComputedStyle(panel.value, '').width) + dx)}px`;
}

function handleResize() {
    const BORDER_SIZE = 4;
    panel.value.addEventListener('mousedown', (e) => {
        if (e.offsetX < BORDER_SIZE) {
            m_pos.value = e.x;
            document.addEventListener('mousemove', resize, false);
        }
    }, false);

    document.addEventListener('mouseup', () => {
        document.removeEventListener('mousemove', resize, false);
    }, false);
}


// Ensure to call handleResize when the component is mounted
onMounted(() => {
    handleResize();
});
</script>

<style lang="scss" scoped>

@import "../scss/drawer";

.offcanvas-template {
  .crud-page {
    height: calc(100vh - 110px) !important;

    .crud-page-body {
      height: 100%;
      margin: 0 !important;

      .dg-flex {
        flex: 1;
        width: 100%;
        overflow: hidden !important;
        height: 100%;
      }

    }
  }
}
.drawer-wrappper{
  width: 100%;
  overflow: hidden;
}


</style>
