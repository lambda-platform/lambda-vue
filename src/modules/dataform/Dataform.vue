<template>
    <div :class="viewMode ? 'dataform view-mode' : 'dataform'">
        <a-form :ref="meta.model +'-'+ schemaID" :model='model' :label-position=meta.option.labelPosition
              :layout="meta.option.labelPosition === 'top' ? 'vertical' : 'horizontal'"
                :rules="rule"
                @finish="handleSubmit"
                @finishFailed="finishFailed"
        >
            <div class='dataform-header' v-if="!hideTitle">
                <h3>{{ title ? title : formTitle }}<b v-if='showID'><span v-if='model[identity]'>: {{model[identity]}}</span></b></h3>
            </div>

            <div class="dataform-body" v-if='!loadConfig && use2ColumnLayout'>
                <a-row :gutter="16">
                    <a-col :span="18">
                        <div class="two-column-form-left">
                                <a-row v-for='row in ui.schema.filter(r=>!r.use2ColumnLayout)' :gutter="10">
                        <!-- Section -->
                        <a-col v-for='col in row.children.filter(c=>isVisibleSection(c))' v-if='!row.sectionRenderByTab'
                               :xs='col.span.xs'
                               :sm='col.span.sm' :md='col.span.md' :lg='col.span.lg'>
                            <div :class="col.name != '' ? 'fieldset' : ''">
                                <legend v-if="col.name != ''">{{ col.name }}</legend>
                                <a-row v-for='srow in col.children' :gutter="10">
                                    <a-col v-for='scol in srow.children' :id='scol.id' :key='scol.index' :xs='24'
                                           :sm='24' :md='scol.span.md' :lg='scol.span.lg'>
                                        <a-divider v-if='scol.name' orientation='left' class='form-divider'>{{ scol.name }}
                                        </a-divider>
                                        <span v-for='item in scol.children' :key='item.index'>
                                        <component
                                            :key='item.model'
                                            :ref="'sf'+item.model"
                                            :url='url'
                                            v-if="isShow(item.model) && item.formType == 'SubForm' && item.subtype"
                                            :is='element(`subform/${item.subtype}`)'
                                            :model='{form: model, component: item.model}'
                                            :form='setMeta(item, true)'
                                            :formula='formula'
                                            :relations='relations'
                                            :asyncMode='asyncMode'
                                            :viewMode='viewMode'
                                            :editMode='editMode'
                                        />
                                        <component
                                            :key='item'
                                            v-if="isShow(item.model) && item.formType != 'SubForm'"
                                            :do_render='do_render'
                                            :asyncMode='asyncMode'
                                            :editMode='editMode'
                                            :is='element(item.formType)'
                                            :model='{form: model, component: item.model}'
                                            :disabled='item.disabled ? item.disabled : false'
                                            :label='item.label ? item.label : `[${item.model}]`'
                                            :meta='setMeta(item)'
                                            :identity='identity'
                                            :url='url'
                                            :getSchemaByModel='getSchemaByModel'
                                            :getSchemaRelationByModel='getSchemaRelationByModel'
                                            :setSchemaByModel='setSchemaByModel'
                                            :relation_data='getRelation'
                                        />
                                        </span>
                                    </a-col>
                                </a-row>
                            </div>
                        </a-col>

                        <!-- Tab -->
                        <a-tabs v-model:activeKey='tabIndex' v-if='row.sectionRenderByTab'>
                            <a-tab-pane :tab='col.name' :key='col.index' v-for='col in row.children.filter(c=>isVisibleSection(c))'
                            >
                                <a-row v-for='srow in col.children' :key='srow.index' :gutter="10">
                                    <a-col v-for='scol in srow.children' :id='scol.id' :key='scol.index' :xs='24'
                                           :sm='24' :md='scol.span.md' :lg='scol.span.lg'>
                                        <a-divider v-if='scol.name' orientation='left' class='form-divider'>{{ scol.name }}
                                        </a-divider>
                                        <span v-for='item in scol.children' :key='item.index'>
                                        <component
                                            :ref="'sf'+item.model"
                                            v-if="isShow(item.model) && item.formType == 'SubForm' && item.subtype"
                                            :is='element(`subform/${item.subtype}`)'
                                            :model='{form: model, component: item.model}'
                                            :form='setMeta(item, true)'
                                            :formula='formula'
                                            :url='url'
                                            :relations='relations'
                                            :asyncMode='asyncMode'
                                            :editMode='editMode'>
                                        </component>
                                        <component
                                            v-if="isShow(item.model) && item.formType != 'SubForm'"
                                            :do_render='do_render'
                                            :asyncMode='asyncMode'
                                            :editMode='editMode'
                                            :is='element(item.formType)'
                                            :model='{form: model, component: item.model}'
                                            :url='url'
                                            :disabled='item.disabled ? item.disabled : false'
                                            :label='item.label ? item.label : `[${item.model}]`'
                                            :meta='setMeta(item)'
                                            :identity='identity'
                                            :getSchemaByModel='getSchemaByModel'
                                            :getSchemaRelationByModel='getSchemaRelationByModel'
                                            :setSchemaByModel='setSchemaByModel'
                                            :relation_data='getRelation'>
                                        </component>
                                        </span>
                                    </a-col>
                                </a-row>
                            </a-tab-pane>
                        </a-tabs>

                        <!-- Standart column -->
                        <a-col v-for="col in row.children.filter(c=>c.type === 'col')" :xs='col.span.xs'
                               :sm='col.span.sm' :md='col.span.md' :lg='col.span.lg'>
                            <a-divider v-if='col.name' orientation='left' class='form-divider'>{{ col.name }}</a-divider>
                            <span v-for='item in col.children' :key='item.index'>
                            <component
                                :key='item.model'
                                :ref="'sf'+item.model"
                                v-if="isShow(item.model) && item.formType === 'SubForm' && item.subtype"
                                :is='element(`subform/${item.subtype}`)'
                                :label='item.label ? item.label : `[${item.model}]`'
                                :model='{form: model, component: item.model}'
                                :form='setMeta(item, true)'
                                :relations='relations'
                                :asyncMode='asyncMode'
                                :formula='formula'
                                :schemaID='schemaID'
                                :url='url'
                                :editMode='editMode'>
                            </component>
                            <component
                                :key='item.model'
                                v-if="isShow(item.model) && item.formType !== 'SubForm'"
                                :do_render='do_render'
                                :editMode='editMode'
                                :is='element(item.formType)'
                                :disabled='item.disabled ? item.disabled : false'
                                :model='{form: model, component: item.model}'
                                :label='item.label ? item.label : `[${item.model}]`'
                                :meta='setMeta(item)'
                                :identity='identity'
                                :rule='rule[item.model]'
                                :asyncMode='asyncMode'
                                :getSchemaByModel='getSchemaByModel'
                                :getSchemaRelationByModel='getSchemaRelationByModel'
                                :setSchemaByModel='setSchemaByModel'
                                :relation_data='getRelation'>
                            </component>
                            </span>
                        </a-col>
                    </a-row>
                        </div>
                    </a-col>
                    <a-col :span="6">
                        <div class="two-column-form-right">
                            <div class="two-column-form">
                                <a-row v-for='row in ui.schema.filter(r=>r.use2ColumnLayout)' :gutter="10">
                                    <!-- Section -->
                                    <a-col v-for='col in row.children.filter(c=>isVisibleSection(c))' v-if='!row.sectionRenderByTab'
                                           :xs='col.span.xs'
                                           :sm='col.span.sm' :md='col.span.md' :lg='col.span.lg'>
                                        <div :class="col.name != '' ? 'fieldset' : ''">
                                            <legend v-if="col.name != ''">{{ col.name }}</legend>
                                            <a-row v-for='srow in col.children' :gutter="10">
                                                <a-col v-for='scol in srow.children' :id='scol.id' :key='scol.index' :xs='24'
                                                       :sm='24' :md='scol.span.md' :lg='scol.span.lg'>
                                                    <a-divider v-if='scol.name' orientation='left' class='form-divider'>{{ scol.name }}
                                                    </a-divider>
                                                    <span v-for='item in scol.children' :key='item.index'>
                                        <component
                                            :key='item.model'
                                            :ref="'sf'+item.model"
                                            :url='url'
                                            v-if="isShow(item.model) && item.formType == 'SubForm' && item.subtype"
                                            :is='element(`subform/${item.subtype}`)'
                                            :model='{form: model, component: item.model}'
                                            :form='setMeta(item, true)'
                                            :formula='formula'
                                            :relations='relations'
                                            :asyncMode='asyncMode'
                                            :editMode='editMode'
                                        />
                                        <component
                                            :key='item'
                                            v-if="isShow(item.model) && item.formType != 'SubForm'"
                                            :do_render='do_render'
                                            :asyncMode='asyncMode'
                                            :editMode='editMode'
                                            :is='element(item.formType)'
                                            :model='{form: model, component: item.model}'
                                            :disabled='item.disabled ? item.disabled : false'
                                            :label='item.label ? item.label : `[${item.model}]`'
                                            :meta='setMeta(item)'
                                            :identity='identity'
                                            :url='url'
                                            :getSchemaByModel='getSchemaByModel'
                                            :getSchemaRelationByModel='getSchemaRelationByModel'
                                            :setSchemaByModel='setSchemaByModel'
                                            :relation_data='getRelation'
                                        />
                                        </span>
                                                </a-col>
                                            </a-row>
                                        </div>
                                    </a-col>

                                    <!-- Tab -->
                                    <a-tabs v-model:activeKey='tabIndex' v-if='row.sectionRenderByTab'>
                                        <a-tab-pane :tab='col.name' :key='col.index' v-for='col in row.children.filter(c=>isVisibleSection(c))'
                                        >
                                            <a-row v-for='srow in col.children' :key='srow.index' :gutter="10">
                                                <a-col v-for='scol in srow.children' :id='scol.id' :key='scol.index' :xs='24'
                                                       :sm='24' :md='scol.span.md' :lg='scol.span.lg'>
                                                    <a-divider v-if='scol.name' orientation='left' class='form-divider'>{{ scol.name }}
                                                    </a-divider>
                                                    <span v-for='item in scol.children' :key='item.index'>
                                        <component
                                            :ref="'sf'+item.model"
                                            v-if="isShow(item.model) && item.formType == 'SubForm' && item.subtype"
                                            :is='element(`subform/${item.subtype}`)'
                                            :model='{form: model, component: item.model}'
                                            :form='setMeta(item, true)'
                                            :formula='formula'
                                            :url='url'
                                            :relations='relations'
                                            :asyncMode='asyncMode'
                                            :editMode='editMode'>
                                        </component>
                                        <component
                                            v-if="isShow(item.model) && item.formType != 'SubForm'"
                                            :do_render='do_render'
                                            :asyncMode='asyncMode'
                                            :editMode='editMode'
                                            :is='element(item.formType)'
                                            :model='{form: model, component: item.model}'
                                            :url='url'
                                            :disabled='item.disabled ? item.disabled : false'
                                            :label='item.label ? item.label : `[${item.model}]`'
                                            :meta='setMeta(item)'
                                            :identity='identity'
                                            :getSchemaByModel='getSchemaByModel'
                                            :getSchemaRelationByModel='getSchemaRelationByModel'
                                            :setSchemaByModel='setSchemaByModel'
                                            :relation_data='getRelation'>
                                        </component>
                                        </span>
                                                </a-col>
                                            </a-row>
                                        </a-tab-pane>
                                    </a-tabs>

                                    <!-- Standart column -->
                                    <a-col v-for="col in row.children.filter(c=>c.type === 'col')" :xs='col.span.xs'
                                           :sm='col.span.sm' :md='col.span.md' :lg='col.span.lg'>
                                        <a-divider v-if='col.name' orientation='left' class='form-divider'>{{ col.name }}</a-divider>
                                        <span v-for='item in col.children' :key='item.index'>
                            <component
                                :key='item.model'
                                :ref="'sf'+item.model"
                                v-if="isShow(item.model) && item.formType === 'SubForm' && item.subtype"
                                :is='element(`subform/${item.subtype}`)'
                                :label='item.label ? item.label : `[${item.model}]`'
                                :model='{form: model, component: item.model}'
                                :form='setMeta(item, true)'
                                :relations='relations'
                                :asyncMode='asyncMode'
                                :formula='formula'
                                :schemaID='schemaID'
                                :viewMode='viewMode'
                                :url='url'
                                :editMode='editMode'>
                            </component>
                            <component
                                :key='item.model'
                                v-if="isShow(item.model) && item.formType !== 'SubForm'"
                                :do_render='do_render'
                                :editMode='editMode'
                                :is='element(item.formType)'
                                :disabled='item.disabled ? item.disabled : false'
                                :model='{form: model, component: item.model}'
                                :label='item.label ? item.label : `[${item.model}]`'
                                :meta='setMeta(item)'
                                :identity='identity'
                                :rule='rule[item.model]'
                                :asyncMode='asyncMode'
                                :getSchemaByModel='getSchemaByModel'
                                :getSchemaRelationByModel='getSchemaRelationByModel'
                                :setSchemaByModel='setSchemaByModel'
                                :relation_data='getRelation'>
                            </component>
                            </span>
                                    </a-col>
                                </a-row>
                            </div>
                            <div class="two-column-form-footer" v-if="!viewMode">
                                <fromFooter
                                    :withBackButton="withBackButton"
                                    :save_btn_text="save_btn_text"
                                    :asyncMode="asyncMode"
                                    :lang="lang"
                                    :extraButtons="extraButtons"
                                    :schemaID="schemaID"
                                    :editMode="editMode"
                                    :disableReset="disableReset"
                                    :handleReset="handleReset"

                                    :getFooterButtons="getFooterButtons"
                                    :setAndSend="setAndSend"
                                    :createWithTemplate="createWithTemplate"

                                />
                            </div>
                        </div>
                    </a-col>
                </a-row>
            </div>
            <div class='dataform-body' v-if='!loadConfig && !use2ColumnLayout'>
                <!-- Tab Section -->
                <a-row v-for='row in ui.schema' :gutter="10">
                    <!-- Section -->
                    <a-col v-for='col in row.children.filter(c=>isVisibleSection(c))' v-if='!row.sectionRenderByTab'
                          :xs='col.span.xs'
                         :sm='col.span.sm' :md='col.span.md' :lg='col.span.lg'>
                        <div :class="col.name != '' ? 'fieldset' : ''">
                            <legend v-if="col.name != ''">{{ col.name }}</legend>
                            <a-row v-for='srow in col.children' :gutter="10">
                                <a-col v-for='scol in srow.children' :id='scol.id' :key='scol.index' :xs='24'
                                     :sm='24' :md='scol.span.md' :lg='scol.span.lg'>
                                    <a-divider v-if='scol.name' orientation='left' class='form-divider'>{{ scol.name }}
                                    </a-divider>
                                    <span v-for='item in scol.children' :key='item.index'>
                                        <component
                                            :key='item.model'
                                            :ref="'sf'+item.model"
                                            :url='url'
                                            v-if="isShow(item.model) && item.formType == 'SubForm' && item.subtype"
                                            :is='element(`subform/${item.subtype}`)'
                                            :model='{form: model, component: item.model}'
                                            :form='setMeta(item, true)'
                                            :formula='formula'
                                            :relations='relations'
                                            :viewMode='viewMode'
                                            :asyncMode='asyncMode'
                                            :editMode='editMode'
                                        />
                                        <component
                                            :key='item'
                                            v-if="isShow(item.model) && item.formType != 'SubForm'"
                                            :do_render='do_render'
                                            :asyncMode='asyncMode'
                                            :editMode='editMode'
                                            :is='element(item.formType)'
                                            :model='{form: model, component: item.model}'
                                            :disabled='item.disabled ? item.disabled : false'
                                            :label='item.label ? item.label : `[${item.model}]`'
                                            :meta='setMeta(item)'
                                            :identity='identity'
                                            :url='url'
                                            :getSchemaByModel='getSchemaByModel'
                                            :getSchemaRelationByModel='getSchemaRelationByModel'
                                            :setSchemaByModel='setSchemaByModel'
                                            :relation_data='getRelation'
                                        />
                                        </span>
                                </a-col>
                            </a-row>
                        </div>
                    </a-col>

                    <!-- Tab -->
                    <a-tabs v-model:activeKey='tabIndex' v-if='row.sectionRenderByTab'>
                        <a-tab-pane :tab='col.name' :key='col.index' v-for='col in row.children.filter(c=>isVisibleSection(c))'
                                >
                            <a-row v-for='srow in col.children' :key='srow.index' :gutter="10">
                                <a-col v-for='scol in srow.children' :id='scol.id' :key='scol.index' :xs='24'
                                     :sm='24' :md='scol.span.md' :lg='scol.span.lg'>
                                    <a-divider v-if='scol.name' orientation='left' class='form-divider'>{{ scol.name }}
                                    </a-divider>
                                    <span v-for='item in scol.children' :key='item.index'>
                                        <component
                                            :ref="'sf'+item.model"
                                            v-if="isShow(item.model) && item.formType == 'SubForm' && item.subtype"
                                            :is='element(`subform/${item.subtype}`)'
                                            :model='{form: model, component: item.model}'
                                            :form='setMeta(item, true)'
                                            :formula='formula'
                                            :url='url'
                                            :relations='relations'
                                            :asyncMode='asyncMode'
                                            :viewMode='viewMode'
                                            :editMode='editMode'>
                                        </component>
                                        <component
                                            v-if="isShow(item.model) && item.formType != 'SubForm'"
                                            :do_render='do_render'
                                            :asyncMode='asyncMode'
                                            :editMode='editMode'
                                            :is='element(item.formType)'
                                            :model='{form: model, component: item.model}'
                                            :url='url'
                                            :disabled='item.disabled ? item.disabled : false'
                                            :label='item.label ? item.label : `[${item.model}]`'
                                            :meta='setMeta(item)'
                                            :identity='identity'
                                            :getSchemaByModel='getSchemaByModel'
                                            :getSchemaRelationByModel='getSchemaRelationByModel'
                                            :setSchemaByModel='setSchemaByModel'
                                            :relation_data='getRelation'>
                                        </component>
                                        </span>
                                </a-col>
                            </a-row>
                        </a-tab-pane>
                    </a-tabs>

                    <!-- Standart column -->
                    <a-col v-for="col in row.children.filter(c=>c.type === 'col')" :xs='col.span.xs'
                           :sm='col.span.sm' :md='col.span.md' :lg='col.span.lg'>
                        <a-divider v-if='col.name' orientation='left' class='form-divider'>{{ col.name }}</a-divider>
                        <span v-for='item in col.children' :key='item.index'>
                            <component
                                :key='item.model'
                                :ref="'sf'+item.model"
                                v-if="isShow(item.model) && item.formType === 'SubForm' && item.subtype"
                                :is='element(`subform/${item.subtype}`)'
                                :label='item.label ? item.label : `[${item.model}]`'
                                :model='{form: model, component: item.model}'
                                :form='setMeta(item, true)'
                                :relations='relations'
                                :asyncMode='asyncMode'
                                :formula='formula'
                                :schemaID='schemaID'
                                :viewMode='viewMode'
                                :url='url'
                                :editMode='editMode'>
                            </component>
                            <component
                                :key='item.model'
                                v-if="isShow(item.model) && item.formType !== 'SubForm'"
                                :do_render='do_render'
                                :editMode='editMode'
                                :is='element(item.formType)'
                                :disabled='item.disabled ? item.disabled : false'
                                :model='{form: model, component: item.model}'
                                :label='item.label ? item.label : `[${item.model}]`'
                                :meta='setMeta(item)'
                                :identity='identity'
                                :rule='rule[item.model]'
                                :asyncMode='asyncMode'
                                :getSchemaByModel='getSchemaByModel'
                                :getSchemaRelationByModel='getSchemaRelationByModel'
                                :setSchemaByModel='setSchemaByModel'
                                :relation_data='getRelation'>
                            </component>
                            </span>
                    </a-col>
                </a-row>
            </div>
            <a-spin v-if='loadConfig' fix></a-spin>
            <div class='dataform-footer' v-if='!viewMode  && !use2ColumnLayout'>
                <fromFooter
                    :withBackButton="withBackButton"
                    :save_btn_text="save_btn_text"
                    :asyncMode="asyncMode"
                    :lang="lang"
                    :extraButtons="extraButtons"
                    :schemaID="schemaID"
                    :editMode="editMode"
                    :disableReset="disableReset"
                    :handleReset="handleReset"
                    :getFooterButtons="getFooterButtons"
                    :setAndSend="setAndSend"

                    :createWithTemplate="createWithTemplate"

                />
            </div>
        </a-form>
        <a-drawer
            class='info-modal'
            v-model:visible="showInfo"
            :title='infoTitle'
            width='860px'
        >
            <iframe :src='infoUrl' frameborder='0'></iframe>
            <div slot='footer'>
                <a-button type='primary' size='large' @click='showInfo = false'>
                    {{ lang.close }}
                </a-button>
            </div>
        </a-drawer>
    </div>
</template>

<script>
import mixins from './DataformMixin'

export default {
    mixins: [mixins]
}
</script>

