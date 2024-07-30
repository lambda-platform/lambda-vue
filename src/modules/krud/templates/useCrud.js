import { ref, computed, getCurrentInstance, inject } from 'vue';
import axios from 'axios';
import { message, Modal } from 'ant-design-vue';

export function useCrud(props, dataForm, dataGrid, templateEdit = undefined, templateOnSuccess = undefined, templateOnError = undefined, t, CRUD_ID) {
    const { proxy } = getCurrentInstance();

    const closeByBtn = ref(true);
    const gridSrc = ref("");
    const formSrc = ref("");
    const editMode = ref(false);
    const searchModel = ref('');
    const form_width = ref(600);
    const exportLoading = ref(false);
    const isPrint = ref(false);
    const isExcel = ref(false);
    const isRefresh = ref(false);
    const isSave = ref(false);
    const rowId = ref(null);
    const cloneID = ref(null);
    const visibleDataForm = ref(false);
    const isExcelUpload = ref(false);
    const excelUploadCustomUrl = ref(null);
    const showID = ref(window.init ? window.init.showID ? window.init.showID : undefined : undefined);

    const screenRecordTargets = inject('screenRecordTargets', []);
    const screenRecordSavePath = inject('screenRecordSavePath', '');

    const mediaRecorder = ref(null);
    const recordedChunks = ref([]);
    let stream = null;

    const showScreenRecordConfirm = () => {
        return new Promise((resolve, reject) => {
            Modal.confirm({
                title: 'Анхааруулга',
                content: 'Систем таны дэлгэцийг бичиж хадгалах болно. Та зөвшөөрч байна уу?',
                okText: 'Зөвшөөрөх',
                cancelText: 'Цуцлах',
                onOk() {
                    resolve(true);
                },
                onCancel() {
                    console.log('Cancelled');
                    resolve(false);
                },
            });
        });
    };

    const startRecording = async () => {
        try {
            stream = await navigator.mediaDevices.getDisplayMedia({
                video: {
                    cursor: "always"  // Заавал курсорыг бичлэгт оруулах
                },
                audio: false  // Системийн аудиог оруулах
            });

            // Бүх дэлгэцийг сонгосон эсэхийг шалгах
            const videoTrack = stream.getVideoTracks()[0];
            const videoSettings = videoTrack.getSettings();
            if (videoSettings.displaySurface !== 'monitor') {
                message.error("Бичлэг хийхийн тулд бүтэн дэлгэцийг сонгоно уу.");
                stream.getTracks().forEach(track => track.stop());
                return false;
            }

            mediaRecorder.value = new MediaRecorder(stream);

            mediaRecorder.value.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    recordedChunks.value.push(event.data);
                }
            };

            mediaRecorder.value.onstop = async () => {
                const blob = new Blob(recordedChunks.value, {
                    type: 'video/webm'
                });

                // Бичсэн видеог сервер рүү оруулах
                const formData = new FormData();
                formData.append('file', blob, 'recording.webm');

                try {
                    const response = await axios.post(screenRecordSavePath, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                    message.success('Амжилттай дэлгэцийн бичлэг');
                    console.log('Амжилттай орууллаа:', response.data);
                    stream.getTracks().forEach(track => track.stop());
                } catch (error) {
                    message.error('Оруулахад алдаа гарлаа');
                    console.error('Оруулахад алдаа гарлаа:', error);
                }
            };

            mediaRecorder.value.start();
            return true;
        } catch (err) {
            message.error('Дэлгэцийн медиа руу хандахад алдаа гарлаа.');
            console.error('Дэлгэцийн медиа руу хандахад алдаа гарлаа.', err);
            return false;
        }
    };

    const stopRecording = () => {
        if (mediaRecorder.value) {
            setTimeout(() => {
                mediaRecorder.value.stop();
                if (stream) {
                    stream.getTracks().forEach(track => track.stop());
                }
            }, 300);
        }
    };

    const recordAndDoAction = async () => {
        const index = screenRecordTargets.findIndex(id => id === CRUD_ID);

        if (index > -1) {
            const shouldRecord = await showScreenRecordConfirm();
            if (shouldRecord) {
                const started = await startRecording();
                return started;
            }
            return false;
        }

        return true;
    };

    const hasVNavSlot = computed(() => !!proxy.$slots['v-nav']);
    const hasNavSlot = computed(() => !!proxy.$slots['nav']);
    const hasLeftSlot = computed(() => !!proxy.$slots['left']);
    const url = computed(() => {
        if (props.projects_id !== null && props.projects_id != "" && props.projects_id != undefined) {
            if (window.init) {
                if (window.init.microserviceSettings) {
                    if (window.init.microserviceSettings.length >= 1) {
                        let si = window.init.microserviceSettings.findIndex(set => set.project_id == props.projects_id);
                        if (si >= 0) {
                            if (window.microservice_dev) {
                                return window.init.microserviceSettings[si].dev_url;
                            } else {
                                return window.init.microserviceSettings[si].production_url;
                            }
                        }
                    }
                }
            }
        }
        return props.base_url ? props.base_url : "";
    });

    const labels = ['_add', 'Information_viewing_history', 'excelUpload'];
    const lang = computed(() => {
        return labels.reduce((obj, key, i) => {
            obj[key] = t('crud.' + labels[i]);
            return obj;
        }, {});
    });

    const view = (id) => {
        rowId.value = id;
        editMode.value = true;
        dataForm.value.viewMode = true;
        dataForm.value.editModel(id);
        if (templateEdit) {
            templateEdit();
        }
    };

    const edit = (id) => {
        rowId.value = id;
        editMode.value = true;
        dataForm.value.editModel(id);

        if (templateEdit) {
            templateEdit(id);
        }
    };

    const clone = (id) => {
        dataForm.value.cloneModel(id);
        if (templateEdit) {
            templateEdit(id);
        }
    };

    const quickEdit = (id) => {
        console.log(id);
    };

    const refresh = () => {
        searchModel.value = null;
        dataGrid.value.refresh();
    };

    const search = (q) => {
        dataGrid.value.searchData(q, 1);
    };

    const stopLoading = (isExported) => {
        exportLoading.value = false;
        if (!isExported) {
            message.error('Татах үед алдаа гарлаа!');
        }
    };

    const exportExcel = () => {
        exportLoading.value = true;
        dataGrid.value.exportExcel(stopLoading);
    };

    const print = () => {
        dataGrid.value.print();
    };

    const excelUploadMethod = () => {
        dataGrid.value.importExcel();
    };

    const save = () => {
        dataGrid.value.saveGridData();
    };

    const onReady = (formOption) => {
        if ((window.innerWidth - 100) >= parseInt(formOption.width)) {
            form_width.value = formOption.width;
        } else {
            form_width.value = window.innerWidth;
        }
        if (editMode.value && rowId.value !== null && rowId.value !== undefined && cloneID.value === null) {
            dataForm.value.editModel(rowId.value);
        } else if (editMode.value && rowId.value !== null && rowId.value !== undefined && cloneID.value !== null) {
            dataForm.value.cloneModel(rowId.value);
        }
    };

    const onSuccess = (val) => {
        if (dataGrid && dataGrid.value) {
            if (typeof props.mode !== 'undefined' && props.mode && props.mode === 'refresh') {
                dataGrid.value.refresh();
            } else {
                if (editMode.value) {
                    dataGrid.value.update(val);
                } else {
                    dataGrid.value.append(val);
                }
            }
        }
        editMode.value = false;
        rowId.value = null;
        cloneID.value = null;
        if (templateOnSuccess) {
            templateOnSuccess(val);
        }
        if (props.onPropertySuccess) {
            props.onPropertySuccess();
        }
        stopRecording();
    };

    const onError = () => {
        if (props.onPropertyError) {
            props.onPropertyError();
        }
        if (templateOnError) {
            templateOnError();
        }
    };

    return {
        closeByBtn, gridSrc, formSrc, editMode, searchModel, form_width, exportLoading,
        isPrint, isExcel, isRefresh, isSave, rowId, cloneID, visibleDataForm, isExcelUpload,
        excelUploadCustomUrl, showID, hasVNavSlot, hasNavSlot, hasLeftSlot, url, lang,
        view, edit, clone, quickEdit, refresh, search, stopLoading, exportExcel, print,
        excelUploadMethod, save, onReady, onSuccess, onError, mediaRecorder, recordedChunks, showScreenRecordConfirm, startRecording, stopRecording, recordAndDoAction
    };
}
