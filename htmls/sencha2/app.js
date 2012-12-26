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
      items: [{
        xtype: 'panel',
        title: 'First View',    // ナビゲーションバーに表示する文字列
        items : [{
            xtype: 'label',
            html: 'This is First View'
        },{
          xtype: 'button',
          text: 'Push Next View',
          // ボタンにイベントを設定
          handler: function() {
            this.parent.parent.push({
              xtype: 'formpanel',
              items: [{
                xtype: 'fieldset',
                title: 'Form',
                id: 'formContent'
                items: [{
                  xtype: 'selectfield',
                  label: 'OS',
                  options: [
                    {text: '選択してください', value: 'none'},
                    {text: 'Android', value: 'Android'},
                    {text: 'iOS', value: 'iOS'},
                    {text: 'Windows', value: 'Windows'}
                  ]
                }, {
                  xtype: 'selectfield',
                  label: 'サイズ',
                  options: [
                    {text: '選択してください'},
                    {text: '7inch以下'},
                    {text: '7.1〜9.9inch'},
                    {text: '10inch以上'}
                  ]
                }, {
                  xtype: 'selectfield',
                  label: '解像度',
                  options: [
                    {text: '選択してください'},
                    {text: '1920*1200以上'},
                    {text: '1280*800以上〜1920*1200未満'},
                    {text: '1024*600以上〜1280*800未満'},
                    {text: '1024*600未満'}
                  ]
                }, {
                  xtype: 'sliderfield',
                  name: 'multithumb',
                  label: '重さ',
                  value: [0,1000],
                  minValue: 0,
                  maxValue: 3000,
                  increment: 10
                }, {
                  xtype: 'togglefield',
                  label: 'toggle'
                }]
              }]
            });
          }
        }]
      }]
    });
  }
});

/*
                }, {
                  xtype: 'panel',
                  defaults: {
                    xtype: 'button',
                    style: 'margin: 0.1em',
                    flex: 1
                  },
                  layout: {
                    type: 'hbox'
                  },
                  items: [
                    {
                      text: '検索する',
                      scope: this,
                      handler: function(btn){
                        Ext.getCmp('formContent').reset();
                      }
                    }
                  ]
*/
