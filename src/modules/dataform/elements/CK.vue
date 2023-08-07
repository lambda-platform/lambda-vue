<template>
    <lambda-form-item :label="label" :name="model.component" :meta="meta">
        <ckeditor
            ref="ckeditor"
            :editor="editor"
            v-model="model.form[model.component]"
            :config="editorConfig"
            :key="meta.editorType"
            :placeholder="placeholder"
            :disabled="disabled"
            @ready="onReady"
            @blur="onBlur"
            @focus="onFocus"
        ></ckeditor>
    </lambda-form-item>
</template>

<script>
import CKEditor from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import mixin from "@lambda-platform/lambda-vue/src/modules/dataform/elements/_mixin";
import axios from "axios";

class UploadAdapter {
    constructor(loader) {
        this.loader = loader;
    }
    upload() {
        return this.loader.file.then((uploadedFile) => {
            return new Promise((resolve, reject) => {
                const data = new FormData();
                data.append("file", uploadedFile);

                axios({
                    url: `${window.baseUrl}/lambda/krud/upload`,
                    method: "post",
                    data,
                })
                    .then((response) => {
                        if (response.status === 200) {
                            resolve({
                                default: `${window.baseUrl}${response.data}`,
                            });
                        } else {
                            reject(response.data.message);
                        }
                    })
                    .catch((e) => {
                        console.log(e);
                        reject("Upload failed");
                    });
            });
        });
    }

    abort() {}
}

function LambdaUploadAdapterPlugin(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
        // Configure the URL to the upload script in your back-end here!
        return new UploadAdapter(loader);
    };
}

export default {
    name: "myCKEditor",
    mixins: [mixin],
    components: {
        ckeditor: CKEditor.component,
    },
    data() {
        return {
            editor: ClassicEditor,
            editorConfig: {
                toolbar: {
                    items: [
                        "heading",
                        "|",
                        "bold",
                        "italic",
                        "|",
                        "link",
                        "|",
                        "blockQuote",
                        "|",
                        "insertTable",
                        "|",
                        "indent",
                        "outdent",
                        "|",
                        "mediaEmbed",
                        "|",
                        'bulletedList',
                        'numberedList',
                    ],
                    shouldNotGroupWhenFull: true,
                },
                extraPlugins: [LambdaUploadAdapterPlugin],
                placeholder: "",
            },
        };
    },
    created() {
        if (this.url) {
            window.baseUrl = this.url;
        }

        if (this.meta.editorType === "article") {
            this.editorConfig = {
                toolbar: {
                    items: [
                        "heading",
                        "|",
                        "bold",
                        "italic",
                        "|",
                        "link",
                        "|",
                        "blockQuote",
                        "|",
                        "insertTable",
                        "|",
                        "indent",
                        "outdent",
                        "|",
                        "mediaEmbed",
                    ],
                    shouldNotGroupWhenFull: true,
                },

                extraPlugins: [LambdaUploadAdapterPlugin],
            };
        } else if (this.meta.editorType === "full") {
            this.editorConfig = {
                toolbar: {
                    //items: ['alignment:left', 'alignment:right', 'alignment:center', 'alignment:justify', 'alignment', 'undo', 'redo', 'blockQuote', 'bold', 'link', 'ckfinder', 'code', 'codeBlock', 'selectAll', 'findAndReplace', 'fontBackgroundColor', 'fontColor', 'fontFamily', 'fontSize', 'heading', 'highlight:yellowMarker', 'highlight:greenMarker', 'highlight:pinkMarker', 'highlight:blueMarker', 'highlight:redPen', 'highlight:greenPen', 'removeHighlight', 'highlight', 'horizontalLine', 'htmlEmbed', 'imageTextAlternative', 'toggleImageCaption', 'uploadImage', 'imageUpload', 'insertImage', 'imageInsert', 'resizeImage:original','resizeImage', 'imageResize', 'imageStyle:inline', 'imageStyle:alignLeft', 'imageStyle:alignRight', 'imageStyle:alignCenter', 'imageStyle:alignBlockLeft', 'imageStyle:alignBlockRight', 'imageStyle:block', 'imageStyle:side', 'imageStyle:wrapText', 'imageStyle:breakText', 'indent', 'outdent', 'italic', 'linkImage', 'numberedList', 'bulletedList', 'todoList', 'underline','mediaEmbed', 'pageBreak', 'removeFormat', 'sourceEditing', 'specialCharacters', 'restrictedEditingException', 'strikethrough', 'subscript', 'superscript', 'insertTable', 'tableColumn', 'tableRow', 'mergeTableCells', 'toggleTableCaption', 'tableCellProperties', 'tableProperties', 'textPartLanguage', 'todoList', 'underline'],
                    items: [
                        "undo",
                        "redo",
                        "|",
                        "selectAll",
                        "findAndReplace",
                        "|",
                        "alignment",
                        "bold",
                        "italic",
                        "link",
                        "|",
                        "linkImage",
                        "blockQuote",
                        "code",
                        "codeBlock",
                        "|",
                        "fontBackgroundColor",
                        "fontColor",
                        "fontFamily",
                        "fontSize",
                        "heading",
                        "|",
                        "removeHighlight",
                        "highlight",
                        "|",
                        "horizontalLine",
                        "htmlEmbed",
                        "|",
                        "imageTextAlternative",
                        "toggleImageCaption",
                        "uploadImage",
                        "imageInsert",
                        "resizeImage",
                        "imageStyle:inline",
                        "imageStyle:alignLeft",
                        "imageStyle:alignRight",
                        "imageStyle:alignCenter",
                        "imageStyle:alignBlockLeft",
                        "imageStyle:alignBlockRight",
                        "imageStyle:block",
                        "imageStyle:side",
                        "imageStyle:wrapText",
                        "imageStyle:breakText",
                        "|",
                        "indent",
                        "outdent",
                        "|",
                        "numberedList",
                        "bulletedList",
                        "|",
                        "pageBreak",
                        "removeFormat",
                        "|",
                        "specialCharacters",
                        "restrictedEditingException",
                        "strikethrough",
                        "subscript",
                        "superscript",
                        "|",
                        "insertTable",
                        "tableColumn",
                        "tableRow",
                        "mergeTableCells",
                        "toggleTableCaption",
                        "tableCellProperties",
                        "tableProperties",
                        "|",
                        "mediaEmbed",
                        "ckfinder",
                        "|",
                        "sourceEditing",
                    ],
                    shouldNotGroupWhenFull: true,
                },

                extraPlugins: [LambdaUploadAdapterPlugin],
            };
        }
    },

    methods: {
        onBlur(editor) {},
        onFocus(editor) {},
        onReady(event) {},
    },
};
</script>
<style>
.dark .ck.ck-editor__main > .ck-editor__editable {
    background: #192846 !important;
}

.dark .ck-toolbar {
    background: #192846 !important;
    color: white;
}
.dark .ck-icon_inherit-color {
    color: white !important;
}
.dark .ck-button {
    color: white !important;
}
</style>
