/*
Ext.application({   
  launch: function() {
    Ext.Viewport.add({
      xtype: 'panel',
      items: [
      {
        xtype: 'label',
        html: 'Sencha Touchのテストです!'
      },{
        xtype: 'button',
        text: 'ボタンです'
      },{
        xtype: 'textfield',
        placeHolder: 'テキストボックスです'
      }]
    });
  }
});
*/

Ext.application({
  launch: function() {
    Ext.Viewport.add({
      xtype: 'navigationview',
      title: 'タブレットの検索',
      items: [{
        xtype: 'formpanel',
        items: [{
          xtype: 'fieldset',
          title: 'タブレットを検索する',
          items: [{
            xtype: 'selectfield',
            label: 'OS',
            labelWrap: 'ture',
            options: [
              {text: '選択してください', value: 'none'},
              {text: 'Android', value: 'Android'},
              {text: 'iOS', value: 'iOS'},
              {text: 'Windows', value: 'Windows'}
            ]
          }, {
            xtype: 'selectfield',
            label: 'サイズ',
            labelWrap: 'ture',
            options: [
              {text: '選択してください', value: 'none'},
              {text: '7inch以下', value: 'under71'},
              {text: '7.1〜9.9inch', value: '71-99'},
              {text: '10inch以上', value: 'over10'}
            ]
          }, {
            xtype: 'selectfield',
            label: '解像度',
            labelWrap: 'ture',
            options: [
              {text: '選択してください', value: 'none'},
              {text: '1920*1200以上', value: 'over1200'},
              {text: '1280*800以上〜1920*1200未満', value: '800-1199'},
              {text: '1024*600以上〜1280*800未満', value: '600-799'},
              {text: '1024*600未満', value: 'under600'}
            ]
          }, {
            xtype: 'sliderfield',
            name: 'multithumb',
            label: '重さ',
            value: [0,1000],
            minValue: 0,
            maxValue: 3000
          }, {
            xtype: 'selectfield',
            label: 'CPU(クロック)',
            labelWrap: 'ture',
            options: [
              {text: '選択してください', value: 'none'},
              {text: '1.5GHz以上', value: 'over1.5'},
              {text: '1.2GHz以上〜1.5GHz未満', value: '1.2-1.49'},
              {text: '1.0GHz以上〜1.2GHz未満', value: '1-1.19'},
              {text: '1.0GHz未満', value: 'under1.0'}
            ]
          }, {
            xtype: 'selectfield',
            label: 'CPU(コア数)',
            labelWrap: 'ture',
            options: [
              {text: '選択してください', value: 'none'},
              {text: '1コア', value: '1core'},
              {text: '2コア', value: '2core'},
              {text: '4コア', value: '4core'}
            ]
          }]
        }, {
          xtype: 'button',
          text: '検索',
          handler: search()
        }, {
          xtype: 'panel',
          id: 'result',
          styleHtmlContent: true,
          title: '結果'
        }]
      }]
    });
  }
});

function search(){
  /*
  var panel = Ext.getCmp('result');//変える必要あり
  panel.getParent().setMasked({
    xtype: 'loadmask',
    message: 'loading...'
  });
  Ext.Ajax.request({
    url: 'http://tablet-hikaku.appspot.com/search',
    success: function(res){
      panel.setHtml(res.responseText);
      panel.getParent().unmask();
    }
  });
*/
}

