<template>
    <div class="card drawer-wrappper window-crud">
        <common :parent="parent" :title="title" :addAction="openSide" :hide-action="openSlidePanel" :permissions="permissions"></common>
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
                                            ref="form"
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
                            <datagrid v-if="permissions ? permissions.r : false" ref="grid"
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
            form_width: 800,
            openSlidePanel: false,
            exportLoading: false,
        }
    },
    computed:{
      path(){
          return this.$route.fullPath
      }
    },
    components: {
        common,
        Krudtools
    },
    methods: {
        hideSide () {
            this.openSlidePanel = false;


            this.$router.push({query: this.getQuery()});
            this.editMode = false;

        },
        openSide () {
            let query = this.getQuery();
            query["add"] = true;
            this.$router.push({query:query});
            this.openSlidePanel = true;
        },

        templateEdit (id) {
            let query = this.getQuery();
            query["edit"] = true;
            query["id"] = id;
            if(this.$route.params.id && this.$route.query.edit){
                if(this.$route.params.id.toString() !== id.toString()){

                    this.$router.push({query:query });


                }
            } else {
                this.$router.push({query: query});


            }
        },
        templateClone(id){
            let query = this.getQuery();
            query["clone"] = true;
            query["id"] = id;
            if(this.$route.params.id && this.$route.query.edit){
                if(this.$route.params.id.toString() !== id.toString()){

                    this.$router.push({query:query });


                }
            } else {
                this.$router.push({query: query});


            }
        },
        templateOnSuccess () {
            this.hideSide()
        },
        handleChange(){

            let add = this.$route.query.add;
            let edit = this.$route.query.edit;
            let clone = this.$route.query.clone;
            let id = this.$route.query.id;
            if(add === 'true' || add === true){
                this.openSlidePanel = true;
            } else if(edit === 'true' || edit === true){
                this.rowId = id;
                this.editMode = true;
                this.openSlidePanel = true;
            } else if(clone === 'true' || clone === true){
                this.rowId = id;
                this.cloneID = id;
                this.editMode = true;
                this.openSlidePanel = true;
            } else {
                this.rowId = 0;
                this.editMode = false;
                this.openSlidePanel = false;
            }
        },
        getQuery(){
            let query = { };
            if(this.$route.query.sort){
                query["sort"] = this.$route.query.sort
            }
            if(this.$route.query.order){
                query["order"] = this.$route.query.order
            }
            if(this.$route.query.paginate){
                query["paginate"] = this.$route.query.paginate
            }
            if(this.$route.query.currentPage){
                query["currentPage"] = this.$route.query.currentPage
            }
            return query;
        }
    },
    watch:{
        path(){
            this.handleChange();
        }
    },
    beforeMount () {
      this.handleChange();
    },
}
</script>
