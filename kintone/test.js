//デフォルトのkintone画面をカスタムするスクリプト
(function() {
  'use strict';

  let mainContents = 
  {
    Editor: null
  }
  
  const get_viewer_fieldcode = () =>
  {
    return Object.values(cybozu.data.page.FORM_DATA.schema.table.fieldList).find(_ => _.var == "VIEWER" && _.type != "RECORD_ID").id;
  }
  
  const get_title_fieldcode = () =>
  {
    return Object.values(cybozu.data.page.FORM_DATA.schema.table.fieldList).find(_ => _.var == "POSTTITLE" && _.type != "RECORD_ID").id;
  }
  
  const edit_initialize = (event) =>
  {
    
    //
    
    const button = $("<div></div>")
    .attr(
      {
        "class": "goog-inline-block goog-toolbar-button goog-toolbar-button-disabled",
        "title": "テスト",
        "role": "button",
        "style": "user-select: none;"
      });
    
    const button_content_outer = $("<div></div>")
    .attr(
      {
        "class": "goog-inline-block goog-toolbar-button-outer-box"
      });
          
          
    const button_content_inner = $("<div></div>")
    .attr(
      {
        "class": "goog-inline-block goog-toolbar-button-inner-box"
      });
    
    const button_content_icon = $("<div></div>")
    .text("test");
    
    button_content_icon.appendTo(button_content_inner);
    button_content_inner.appendTo(button_content_outer);
    button_content_outer.appendTo(button);
    
    button.appendTo($(".goog-toolbar.goog-toolbar-horizontal"));
      
    
    //スタイルに直接設定する大元の要素の横幅をリセット
    $(".layout-gaia.editablelayout-gaia").css("width", "");
    $(".post_info_group").remove();
    
    const viewer_fieldcode = get_viewer_fieldcode();
    const title_fieldcode = get_title_fieldcode();
    
    //最初の編集欄がある要素を取得する
    let dom_record_case = $(".control-gaia.control-editor-field-gaia.field-" + viewer_fieldcode);
    dom_record_case.attr("style", "").attr("id", "bs-richtextbox-container");
    
    //2つのスタイルを削除しておく
    dom_record_case.find(".input-text-outer-cybozu.cybozu-ui-forms-editor-seamless").attr("style", "");
    dom_record_case.find(".editor-cybozu.cybozu-editor-seamless.editable")
    .attr("spellcheck", "false")
    .attr("id", "bs-richtextbox")
    .attr("style", "");
    
    if (event.record.VIEWER.value == "<div><br /></div>")
    {
      dom_record_case.find(".editor-cybozu.cybozu-editor-seamless.editable").children().remove();
    }
    
    //サイズ変更グリップも削除
    dom_record_case.find(".textarea-resize-cybozu").remove();
    
    const topbar = $(".gaia-argoui-app-edit-buttons-contents").attr("id", "bs-richtextbox-toolbar");
    
    //タイトル欄 = 最初のレコード　を移動するために要素を取得
    const editor_title = $(".field-" + title_fieldcode).parent(".row-gaia.clearFix-cybozu")
     //保存・キャンセルボタンのすぐ直前に挿入
    .insertBefore(topbar.children().last())
    //IDを設定
    .attr("id", "bs-edit-posttitle");
    
    $(".editor-toolbar-cybozu").appendTo(topbar);
  }
  
  const view_initialize = (event) =>
  {
    console.log("AAAAABB");
    
    //スタイルに直接設定する大元の要素の横幅をリセット
    $(".layout-gaia.showlayout-gaia").css("width", "");
    $(".post_info_group").remove();
    
    const viewer =  $(kintone.app.record.getFieldElement("VIEWER"))
    .attr("id", "bs-viewer");
    
    const viewer_parent = viewer.parent(".control-gaia")
    //スタイルを削除しておく。。。
    .attr("id", "bs-viewer-container")
    .attr("style", "");
    
    const update = new Date(Date.parse(event.record.更新日時.value));
    
    const post_updatedate_label = $("<span></span>")
    .text("最終更新日時: " + update.getFullYear() + "年" + update.getMonth() + "月" + update.getDate() + "日 " + ("0" + update.getHours()).slice(-2) + ":" + ("0" + update.getMinutes()).slice(-2))
    .addClass("post_updatedate_label");
    
    const post_modifier_label = $("<span></span>")
    .text("最終更新者： " + event.record.更新者.value.name)
    .addClass("post_modifier_label");

    const post_title_label = $("<span></span>")
    .text(event.record.POSTTITLE.value)
    .addClass("post_title_label");

    const post_info_group = $("<div></div>")
    
    .insertBefore($(".gaia-argoui-app-show-toolbar.gaia-argoui-floater.gaia-argoui-floater-box").children().first())
    //.insertBefore($("#record-gaia"))
    // .insertBefore($("#record-gaia").children().first())
    .addClass("post_info_group")
    .append(post_title_label)
    .append(post_updatedate_label)
    .append(post_modifier_label)
    ;
    
    kintone.app.record.setFieldShown("POSTTITLE", false);
    
    console.log(event);
  }
    
  kintone.events.on('app.record.detail.show', view_initialize);
  kintone.events.on('app.record.edit.show', edit_initialize);
  kintone.events.on('app.record.create.show', edit_initialize);
    
})();
