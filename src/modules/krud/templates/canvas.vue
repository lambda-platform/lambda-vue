<template>
    <div class="krud-canvas">
        <common :parent="parent" :title="title" :addAction="openSide" :permissions="permissions"></common>
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

                            <datagrid v-if="permissions ? permissions.r : false" ref="grid"
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
        <a-drawer
            v-model:open="openSlidePanel"
            class="canvas-drawer"
            :maskClosable="false"
            :forceRender="true"
            :title="withCrudLog && rowId && showID ? `${title} : ${rowId}` : title"
            :width="form_width"
            placement="right"
            @close="hideSide"
        >
            <div :class="withCrudLog && editMode ? 'with-crud-log' : 'crud-form'">
                <dataform
                    ref="form"
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
        </a-drawer>
    </div>
</template>
<script>

import common from '../components/common'
import Krudtools from '../components/krudtools'
import mixins from './mixin'

export default {
    inheritAttrs: false,
    name: 'Canvas',
    mixins: [mixins],
    data () {
        return {

            openSlidePanel: false,
            exportLoading: false,
        }
    },
    components: {
        common,
        Krudtools
    },
    methods: {
        hideSide () {
            this.openSlidePanel = false;
            this.editMode = false;

        },
        openSide () {
            this.openSlidePanel = true

        },

        templateEdit () {
            this.openSide()
        },
        templateOnSuccess () {
            this.hideSide()
        },

    },
}
</script>
