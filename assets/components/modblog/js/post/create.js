
modBlog.page.CreateBlogPost = function(config) {
    config = config || {record:{}};
    config.record = config.record || {};
    Ext.applyIf(config,{
        panelXType: 'modx-panel-blog-post'
    });
    config.canDuplicate = false;
    config.canDelete = false;
    modBlog.page.CreateBlogPost.superclass.constructor.call(this,config);
};
Ext.extend(modBlog.page.CreateBlogPost,MODx.page.CreateResource,{

});
Ext.reg('modblog-page-blog-post-create',modBlog.page.CreateBlogPost);

modBlog.panel.BlogPost = function(config) {
    config = config || {};
    Ext.applyIf(config,{
    });
    modBlog.panel.BlogPost.superclass.constructor.call(this,config);
};
Ext.extend(modBlog.panel.BlogPost,MODx.panel.Resource,{
    getFields: function(config) {
        var it = [];
        it.push({
            title: _('modblog.post')
            ,id: 'modx-resource-settings'
            ,cls: 'modx-resource-tab'
            ,layout: 'form'
            ,labelAlign: 'top'
            ,labelSeparator: ''
            ,bodyCssClass: 'tab-panel-wrapper main-wrapper'
            ,autoHeight: true
            ,defaults: {
                border: false
                ,msgTarget: 'under'
                ,width: 400
            }
            ,items: this.getMainFields(config)
        });
        if (config.show_tvs && MODx.config.tvs_below_content != 1) {
            it.push(this.getTemplateVariablesPanel(config));
        }
        if (config.access_permissions) {
            it.push(this.getAccessPermissionsTab(config));
        }
        var its = [];
        its.push(this.getPageHeader(config),{
            id:'modx-resource-tabs'
            ,xtype: 'modx-tabs'
            ,forceLayout: true
            ,deferredRender: false
            ,collapsible: true
            ,itemId: 'tabs'
            ,items: it
        });

        if (MODx.config.tvs_below_content == 1) {
            var tvs = this.getTemplateVariablesPanel(config);
            tvs.style = 'margin-top: 10px';
            its.push(tvs);
        }
        return its;
    }

    ,getMainLeftFields: function(config) {
        config = config || {record:{}};
        var mlf = [{
            xtype: 'textfield'
            ,fieldLabel: _('modblog.blog_title')+'<span class="required">*</span>'
            ,description: '<b>[[*pagetitle]]</b><br />'+_('modblog.blog_title_help')
            ,name: 'pagetitle'
            ,id: 'modx-resource-pagetitle'
            ,maxLength: 255
            ,anchor: '100%'
            ,allowBlank: false
            ,enableKeyEvents: true
            ,listeners: {
                'keyup': {scope:this,fn:function(f,e) {
                    var titlePrefix = MODx.request.a == MODx.action['resource/create'] ? _('new_document') : _('document');
                    var title = Ext.util.Format.stripTags(f.getValue());
                    Ext.getCmp('modx-resource-header').getEl().update('<h2>'+title+'</h2>');
                }}
            }

        },{
            xtype: 'textarea'
            ,fieldLabel: _('modblog.post_summary')
            ,description: '<b>[[*introtext]]</b><br />'+_('modblog.post_summary')
            ,name: 'introtext'
            ,id: 'modx-resource-introtext'
            ,maxLength: 255
            ,anchor: '100%'
            ,value: config.record.introtext || ''

        }];

        var ct = this.getContentField(config);
        if (ct) {
            mlf.push(ct);
        }
        return mlf;
    }

    ,getContentField: function(config) {
        return [{
            id: 'modx-content-above'
            ,border: false
        },{
            xtype: 'textarea'
            ,fieldLabel: _('modblog.post_content')
            ,name: 'ta'
            ,id: 'ta'
            ,anchor: '100%'
            ,height: 400
            ,grow: false
            ,value: (config.record.content || config.record.ta) || ''
        },{
            id: 'modx-content-below'
            ,border: false
        }];
    }


    ,getMainRightFields: function(config) {
        config = config || {};
        return [{
            xtype: 'fieldset'
            ,title: _('modblog.publishing_information')
            ,items: [{
                xtype: 'modblog-combo-publish-status'
                ,fieldLabel: _('modblog.status')
                ,name: 'published'
                ,hiddenName: 'published'
                ,value: false
            },{
                xtype: 'xdatetime'
                ,fieldLabel: _('resource_publishedon')
                ,description: '<b>[[*publishedon]]</b><br />'+_('resource_publishedon_help')
                ,name: 'publishedon'
                ,id: 'modx-resource-publishedon'
                ,allowBlank: true
                ,dateFormat: MODx.config.manager_date_format
                ,timeFormat: MODx.config.manager_time_format
                ,dateWidth: 120
                ,timeWidth: 120
                ,value: config.record.publishedon
            },{
                xtype: MODx.config.publish_document ? 'xdatetime' : 'hidden'
                ,fieldLabel: _('resource_publishdate')
                ,description: '<b>[[*pub_date]]</b><br />'+_('resource_publishdate_help')
                ,name: 'pub_date'
                ,id: 'modx-resource-pub-date'
                ,allowBlank: true
                ,dateFormat: MODx.config.manager_date_format
                ,timeFormat: MODx.config.manager_time_format
                ,dateWidth: 120
                ,timeWidth: 120
                ,value: config.record.pub_date
            },{
                xtype: MODx.config.publish_document ? 'xdatetime' : 'hidden'
                ,fieldLabel: _('resource_unpublishdate')
                ,description: '<b>[[*unpub_date]]</b><br />'+_('resource_unpublishdate_help')
                ,name: 'unpub_date'
                ,id: 'modx-resource-unpub-date'
                ,allowBlank: true
                ,dateFormat: MODx.config.manager_date_format
                ,timeFormat: MODx.config.manager_time_format
                ,dateWidth: 120
                ,timeWidth: 120
                ,value: config.record.unpub_date
            }]
        },{
            html: '<hr />'
            ,border: false
        },{
            xtype: 'fieldset'
            ,title: _('modblog.post_options')
            ,items: [{
                xtype: 'modx-combo-template'
                ,fieldLabel: _('resource_template')
                ,description: '<b>[[*template]]</b><br />'+_('resource_template_help')
                ,name: 'template'
                ,id: 'modx-resource-template'
                ,anchor: '100%'
                ,editable: false
                ,baseParams: {
                    action: 'getList'
                    ,combo: '1'
                }
                ,listeners: {
                    'select': {fn: this.templateWarning,scope: this}
                }
            },{
                xtype: 'textfield'
                ,fieldLabel: _('modblog.post_alias')
                ,description: '<b>[[*alias]]</b><br />'+_('modblog.post_alias_help')
                ,name: 'alias'
                ,id: 'modx-resource-alias'
                ,maxLength: 100
                ,anchor: '100%'
                ,value: config.record.alias || ''

            },{
                xtype: 'textfield'
                ,fieldLabel: _('modblog.post_tags')
                ,description: _('modblog.post_tags_help')
                ,name: 'tags'
                ,id: 'modx-resource-tags'
                ,maxLength: 100
                ,anchor: '100%'
                ,value: config.record.tags || ''

            },{
                xtype: 'hidden'
                ,name: 'menutitle'
                ,id: 'modx-resource-menutitle'
                ,value: config.record.menutitle || ''

            },{
                xtype: 'hidden'
                ,name: 'link_attributes'
                ,id: 'modx-resource-link-attributes'
                ,value: config.record.link_attributes || ''

            },{
                xtype: 'hidden'
                ,name: 'richtext'
                ,id: 'modx-resource-richtext'
                ,value: true

            },{
                xtype: 'hidden'
                ,name: 'hidemenu'
                ,id: 'modx-resource-hidemenu'
                ,value: config.record.hidemenu

            },{
                xtype: 'hidden'
                ,name: 'class_key'
                ,value: 'modBlogPost'
            }]
        }]
    }

});
Ext.reg('modx-panel-blog-post',modBlog.panel.BlogPost);