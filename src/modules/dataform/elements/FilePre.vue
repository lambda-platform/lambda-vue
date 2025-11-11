<template>
    <lambda-form-item :label="label" :name="model.component" :meta="meta">
        <div class="file-uploader">
            <file-pond
                ref="pondRef"
                v-model="files"
                name="file"
                :allow-multiple="isMultiple"
                :disabled="disabled"
                :instant-upload="false"
                :server="serverConfig"
                :credits="false"
                :allow-revert="false"
                :label-idle="labels.idle"
                :label-file-processing="labels.processing"
                :label-file-processing-complete="labels.done"
                :label-file-loading="labels.loading"
                :label-tap-to-undo="labels.undo"
                :label-tap-to-cancel="labels.cancelTap"
                :label-button-remove-item="labels.remove"
                :label-button-cancel-item-processing="labels.cancelBtn"
                :label-button-abort-item-processing="labels.abortBtn"
                :label-button-retry-item-processing="labels.retryBtn"
                :label-button-process-item="labels.processBtn"
                @addfile="onAddFile"
                @processfile="onProcessFile"
                @removefile="onRemoveFile"
                @activatefile="handleViewFile"
            />
        </div>
    </lambda-form-item>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import axios from '~/plugins/core/axios'
import { message } from 'ant-design-vue'

import vueFilePond from 'vue-filepond'
import 'filepond/dist/filepond.min.css'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'

const FilePond = vueFilePond(
    FilePondPluginImagePreview,
    FilePondPluginFileValidateType
)

const props = defineProps({
    model: Object,
    label: String,
    meta: Object,
    do_render: Boolean,
    editMode: Boolean,
    is_show: Boolean,
    relation_data: Function,
    showInformationModal: Boolean,
    url: String,
    setSchemaByModel: Function,
    getSchemaByModel: Function,
    validateWithSubForm: Function,
    validateDataForm: Function,
    subFormFillData: Function,
    isBuilder: Boolean,
})

const emit = defineEmits<{
    (e: 'update:model-form-field', payload: { component: string; value: any }): void
}>()

const pondRef = ref<any>(null)
const files = ref<any[]>([])
const disabled = computed(() => !!props.meta?.disabled)
const isMultiple = computed(() => !!(props.meta?.file && props.meta.file.isMultiple))
const isLoadingFiles = ref(false)

const labels = {
    idle: 'Энд чирж эсвэл <span class="filepond--label-action">сонгох</span>',
    processing: 'Хуулж байна...',
    done: 'Хуулалт амжилттай',
    loading: 'Уншиж байна...',
    undo: 'Буцаах',
    cancelTap: 'Болих бол товшино уу',
    remove: 'Устгах',
    cancelBtn: 'Болих',
    abortBtn: 'Цуцлах',
    retryBtn: 'Дахин оролдох',
    processBtn: 'Хуулах'
}

/* ---------------- Helper Functions ---------------- */
function _nameFromUrl(url: string): string {
    try {
        const path = url.split('?')[0].split('#')[0]
        const parts = path.split('/')
        return decodeURIComponent(parts[parts.length - 1] || 'file')
    } catch {
        return 'file'
    }
}

function _mimeFromName(nameOrUrl: string): string {
    const n = nameOrUrl.split('?')[0].split('#')[0]
    const ext = n.split('.').pop()?.toLowerCase()
    const map: Record<string, string> = {
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        png: 'image/png',
        gif: 'image/gif',
        webp: 'image/webp',
        svg: 'image/svg+xml',
        pdf: 'application/pdf',
        doc: 'application/msword',
        docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        xls: 'application/vnd.ms-excel',
        xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        zip: 'application/zip',
        mp4: 'video/mp4',
        mp3: 'audio/mpeg'
    }
    return (ext && map[ext]) ? map[ext] : 'application/octet-stream'
}

function _getFullUrl(path: string): string {
    const base = props.url || ''
    return path.startsWith('http') ? path : `${base}${path}`
}

/* ---------------- Model Binding ---------------- */
function setFormValue(value: any) {
    const comp = props.model?.component
    if (!comp) return

    try {
        if (props.model?.form) {
            props.model.form[comp] = value === "[]" ? null : value
        } else if (typeof props.setSchemaByModel === 'function') {
            props.setSchemaByModel(comp, value)
        } else {
            emit('update:model-form-field', { component: comp, value })
        }
    } catch (e) {
        console.error('Error setting form value:', e)
    }
}

/* ---------------- Server Configuration ---------------- */
const serverConfig = {
    process: (fieldName: string, file: File, metadata: any, load: any, error: any, progress: any, abort: any) => {
        const controller = new AbortController()
        const fd = new FormData()
        fd.append('file', file)

        axios.post(`${props.url || ''}/lambda/krud/upload`, fd, {
            signal: controller.signal as any,
            onUploadProgress: (e: ProgressEvent) => {
                if (e.lengthComputable) {
                    progress(e.lengthComputable, e.loaded, e.total)
                }
            }
        })
            .then(res => {
                const serverId = res?.data ?? ''
                if (!serverId) {
                    error('URL буцаагдаагүй')
                    return
                }
                // Store the response path with file metadata
                load(serverId)
            })
            .catch(err => {
                console.error('Upload error:', err)
                error('Хуулахад алдаа гарлаа')
                message.error('Хуулахад алдаа гарлаа')
            })

        return {
            abort: () => {
                controller.abort()
                abort()
            }
        }
    },

    load: (source: any, load: any, error: any, progress: any, abort: any, headers: any) => {
        const controller = new AbortController()
        const fullUrl = _getFullUrl(source)

        axios.get(fullUrl, {
            responseType: 'blob',
            signal: controller.signal as any,
            onDownloadProgress: (e: ProgressEvent) => {
                if (e.lengthComputable) {
                    progress(e.lengthComputable, e.loaded, e.total)
                }
            }
        })
            .then(res => {
                load(res.data)
            })
            .catch(err => {
                console.error('Load error:', err)
                error('Файл уншихад алдаа гарлаа')
            })

        return {
            abort: () => {
                controller.abort()
                abort()
            }
        }
    },

    revert: null,
    restore: null,
    fetch: null
}

/* ---------------- File Operations ---------------- */
async function onAddFile(error: any, file: any) {
    if (error) {
        console.error('Add file error:', error)
        return
    }

    // Auto-process newly added files
    if (file.status === 1) { // Status 1 = idle (newly added)
        await nextTick()
        pondRef.value?.processFile(file.id)
    }
}

async function onProcessFile(error: any, file: any) {
    if (error) {
        console.error('Process error:', error)
        return
    }

    await nextTick()
    syncFormFromPond()
}

async function onRemoveFile(error: any, file: any) {
    if (error) {
        console.error('Remove error:', error)
        return
    }

    await nextTick()
    syncFormFromPond()
}

function handleViewFile(file: any) {
    const src = file?.serverId || file?.source || ''
    const fullUrl = _getFullUrl(src)
    window.open(fullUrl, '_blank')
}

/* ---------------- Sync Form Data ---------------- */
function syncFormFromPond() {
    const items = pondRef.value?.getFiles?.() || []

    if (!isMultiple.value) {
        // Single file mode
        const firstFile = items[0]
        if (!firstFile) {
            setFormValue(null)
            return
        }

        const fileData = mapFileToResponse(firstFile)
        setFormValue(fileData.response)
    } else {
        // Multiple files mode
        if (items.length === 0) {
            setFormValue(null)
            return
        }

        const filesList = items
            .filter(f => f.status === 5 || f.status === 2) // Only processed or loading files
            .map(mapFileToResponse)

        setFormValue(JSON.stringify(filesList))
    }
}

function mapFileToResponse(file: any) {
    const base = props.url || ''
    const src = file?.serverId || file?.source || ''

    // Remove base URL if present
    const response = src.startsWith(base) ? src.slice(base.length) : src

    // Get file name
    const name = file?.filename || file?.file?.name || _nameFromUrl(src)

    // Get file size
    const size = file?.fileSize || file?.file?.size || 0

    return { name, response, size }
}

/* ---------------- Initialize Existing Files ---------------- */
async function init() {
    if (isLoadingFiles.value) return

    isLoadingFiles.value = true

    try {
        await nextTick()

        const field = props.model?.form?.[props.model?.component]

        // Clear existing files
        pondRef.value?.removeFiles()

        if (!field) {
            isLoadingFiles.value = false
            return
        }

        if (isMultiple.value) {
            await initMultipleFiles(field)
        } else {
            await initSingleFile(field)
        }
    } catch (e) {
        console.error('Init error:', e)
    } finally {
        isLoadingFiles.value = false
    }
}

async function initMultipleFiles(field: string) {
    let filesList: Array<{ name?: string; response: string; size?: number }> = []

    try {
        const parsed = JSON.parse(field)
        if (Array.isArray(parsed)) {
            filesList = parsed
        }
    } catch (e) {
        console.warn('Failed to parse multiple files:', e)
        return
    }

    for (const fileData of filesList) {
        const response = fileData?.response || ''
        if (!response) continue

        const fileName = fileData?.name || _nameFromUrl(response)
        const fileSize = fileData?.size || 0

        try {
            // Create a mock File object for FilePond
            const blob = await fetchFileAsBlob(response)
            const mimeType = _mimeFromName(fileName)
            const mockFile = new File([blob], fileName, { type: mimeType })

            await pondRef.value?.addFile(mockFile, {
                type: 'local',
                file: {
                    name: fileName,
                    size: fileSize || blob.size,
                    type: mimeType
                },
                metadata: {
                    source: response
                }
            })

            // Mark as processed
            const files = pondRef.value?.getFiles() || []
            const addedFile = files[files.length - 1]
            if (addedFile) {
                addedFile.serverId = response
                addedFile.status = 5 // Set status to processed
            }
        } catch (e) {
            console.warn('Failed to load file:', fileName, e)
        }
    }
}

async function initSingleFile(field: string) {
    let response = ''

    try {
        const parsed = JSON.parse(field)
        if (parsed?.response) {
            response = parsed.response
        } else if (typeof parsed === 'string') {
            response = parsed
        }
    } catch {
        response = typeof field === 'string' ? field : ''
    }

    if (!response) return

    const fileName = _nameFromUrl(response)

    try {
        const blob = await fetchFileAsBlob(response)
        const mimeType = _mimeFromName(fileName)
        const mockFile = new File([blob], fileName, { type: mimeType })

        await pondRef.value?.addFile(mockFile, {
            type: 'local',
            file: {
                name: fileName,
                size: blob.size,
                type: mimeType
            },
            metadata: {
                source: response
            }
        })

        // Mark as processed
        const files = pondRef.value?.getFiles() || []
        const addedFile = files[0]
        if (addedFile) {
            addedFile.serverId = response
            addedFile.status = 5
        }
    } catch (e) {
        console.warn('Failed to load file:', fileName, e)
    }
}

async function fetchFileAsBlob(path: string): Promise<Blob> {
    const fullUrl = _getFullUrl(path)
    const response = await axios.get(fullUrl, { responseType: 'blob' })
    return response.data
}

/* ---------------- Clear Files ---------------- */
function setNull(clearForm = false) {
    files.value = []
    pondRef.value?.removeFiles()
    if (clearForm) {
        setFormValue(null)
    }
}

/* ---------------- Watchers ---------------- */
const itemValue = computed(() => props.model?.form?.[props.model?.component])

watch(itemValue, (value, oldValue) => {
    if (!!oldValue && !value) {
        setNull(true)
        return
    }
    if (!!value && !oldValue) {
        init()
    }
})

onMounted(() => {
    init()
})
</script>

<style scoped>
.file-uploader {
    width: 100%;
}

:deep(.filepond--root) {
    margin-bottom: 0;
}

:deep(.filepond--drop-label) {
    min-height: 150px;
}
</style>
