<template>
    <section class="excel-import-container">

        <div class="excel-import-tools">
            <div class="excel-import-tools-left">
                <label>{{ lang.excelImportModalTitle }}</label>
            </div>

            <div class="excel-import-tools-right" style="display: flex">
                <a-button type="default" v-if="options.excelUploadSample" :href="baseUrl+options.excelUploadSample"
                          shape="round" class="example-btn">

                    Жишээ файл татах
                </a-button>
            </div>
        </div>

        <div class="excel-import-body">
            <div class="excel-import-btns">
                <a-upload :action="`${baseUrl}/lambda/krud/upload`"
                          v-model="excelForm.excelFile"
                          @change="success"
                          class="ant-btn-default"
                          style="width: 200px"
                          size="small">

                    <div class="flex">
                        <inline-svg class="svg-icon"
                                    src="/assets/icons/duotone/Files/Upload.svg"
                        />
                        Файл оруулах
                    </div>

                </a-upload>

                <a-button type="primary" v-if="excelForm.excelFile" :loading="isLoading"
                          @click="excelImport">{{ lang.save }}
                </a-button>
            </div>

            <div class="excel_upload_loading notif" v-if="isLoading" style="padding:20px">
                Ачаалж байна түр хүлээнэ үү ...
            </div>
            <div v-else>
                <div v-if="summary===null" class="notif" style="height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    text-transform: uppercase;
    padding:20px;
    color: #ccc;">
                    Эксел файлаа оруулаад өгөгдөл хадгалах товчийг дарна уу
                </div>
                <div v-else-if="summary.length ===0" class="notif" style="height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    text-transform: uppercase;
    color: #149755;">
                    Амжилттай хадгалагдлаа. Хүснэгтээ дахин ачаалж мэдээллээ шалгана уу

                </div>
                <div v-else style="padding: 20px" v-if="summary.length >= 1">
                    <div>
                        <h3> Эксел файл оруулах үеийн лог </h3></div>
                    <div>Доорх алдааг засаж дахин оруулна уу, алдаа гараагүй өгөгдлүүд баазад орсон</div>
                    <div style="border-top:1px dotted #eee; padding: 20px; overflow-y: auto">
                        <ul>
                            <li v-for="sum in summary" :key="sum">
                                Мөрийн дугаар:  {{sum.row_index}} <br>
                                {{ sum.row.join(", ") }} - {{ sum.errors.join(", ") }}
                                <br>
                                <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert" v-for="error in sum.errors" :key="error.index">
                                    <span>{{error}}</span>
                                </div>
                            </li>
                        </ul>
                    </div>

                </div>
            </div>
        </div>
    </section>
</template>

<script>

import axios from "axios"
import {LoadingOutlined} from "@ant-design/icons-vue";
import {notification} from "ant-design-vue";

export default {
    components: {LoadingOutlined},
    props: ["schemaID", "schema", "options", "baseUrl"],
    data() {
        return {
            isLoading: false,
            excelForm: {
                excelFile: null,
                schemaID: this.schemaID
            },
            summary: null
        }
    },

    computed: {
        lang() {
            const labels = ['excelImportModalTitle', 'save'];
            return labels.reduce((obj, key, i) => {
                obj[key] = this.$t('dataGrid.' + labels[i]);
                return obj;
            }, {});
        },
    },

    methods: {
        excelImport() {
            this.isLoading = true;

            axios.post(this.baseUrl + '/lambda/krud/import-excel/' + this.schemaID, this.excelForm).then(res => {
                console.log("excelImport:");
                console.log(res.data);
                this.isLoading = false;
                if (res.status) {

                    this.summary = res.data === null ? [] : res.data;
                }
            }).catch(e => {

                this.isLoading = false;
                notification["error"]({
                    message: "Алдаа",
                    description: e.response.data.error,
                });
            });

        },
        success(val) {
            if (val.file.status === "done") {
                this.excelForm.excelFile = val.file.response;
            }

        },
    }
};
</script>

<style lang="scss">

@import "scss/print.scss";

</style>
