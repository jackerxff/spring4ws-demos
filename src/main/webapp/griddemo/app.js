var absession = null;
var launched = false;

Ext.onReady(function() {
	var path = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/')+1);

	ab._construct = function(url, protocols) {
		return new SockJS(url);
	};

	ab.connect(path + 'book', function(session) {
		absession = session;
		console.log("Connected to ", absession);
		launch();
	}, function(code, reason) {
		absession = null;
		console.log("Connection lost (" + reason + ")");
	}, {
		skipSubprotocolCheck: true
	});
});

function launch() {
	if (launched) {
		return;
	}

	var baseUri = "http://demo.rasc.ch/spring4ws/book#";

	Ext.QuickTips.init();

	Ext.define('Book', {
		extend: 'Ext.data.Model',
		fields: [ {
			name: 'id',
			type: 'int'
		}, {
			name: 'title',
			type: 'string'
		}, {
			name: 'publisher',
			type: 'string'
		}, {
			name: 'isbn',
			type: 'string'
		}, {
			name: 'link',
			type: 'string'
		} ],
		proxy: {
			type: 'wamp',
			api: {
				create: baseUri + 'create',
				read: baseUri + 'read',
				update: baseUri + 'update',
				destroy: baseUri + 'destroy',

				// Topic URIs for CRUD events
				oncreate: baseUri + 'oncreate',
				onupdate: baseUri + 'onupdate',
				ondestroy: baseUri + 'ondestroy'
			}
		}
	});

	var store = Ext.create('AB.data.WampStore', {
		model: 'Book',
		autoLoad: true,
		remoteSort: true,
		autoSync: true
	});

	var rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
		clicksToMoveEditor: 1,
		autoCancel: false
	});

	var grid = Ext.create('Ext.grid.Panel', {
		store: store,
		columns: [ {
			header: 'ID',
			dataIndex: 'id',
			width: 50
		}, {
			header: 'ISBN',
			dataIndex: 'isbn',
			width: 100,
			editor: {
				allowBlank: false
			}
		}, {
			header: 'Title',
			dataIndex: 'title',
			flex: 1,
			editor: {
				allowBlank: false
			}
		}, {
			header: 'Publisher',
			dataIndex: 'publisher',
			width: 100,
			editor: {
				allowBlank: true
			}
		}, {
			header: 'Link',
			dataIndex: 'link',
			xtype: 'templatecolumn',
			tpl: '<a href="{link}" target="_blank">{link}</a>',
			flex: 1,
			editor: {
				allowBlank: true
			}
		} ],
		renderTo: Ext.getBody(),
		width: 900,
		height: 400,
		title: 'Books',
		frame: true,
		tbar: [ {
			text: 'Add Book',
			handler: function() {
				rowEditing.cancelEdit();

				var r = Ext.create('Book', {
					title: 'NewTitle',
					publisher: 'NewPublisher'
				});

				store.insert(0, r);
				rowEditing.startEdit(0, 0);
			},
			listeners: {
				render: function() {
					this.addCls("x-btn-default-small");
					this.removeCls("x-btn-default-toolbar-small");
				}
			}
		}, {
			itemId: 'removeBook',
			text: 'Remove Book',
			handler: function() {
				var sm = grid.getSelectionModel();
				rowEditing.cancelEdit();
				store.remove(sm.getSelection());
				if (store.getCount() > 0) {
					sm.select(0);
				}
			},
			disabled: true,
			listeners: {
				render: function() {
					this.addCls("x-btn-default-small");
					this.removeCls("x-btn-default-toolbar-small");
				}
			}
		}, '->', {
			xtype: 'checkbox',
			fieldLabel: 'Autosync',
			labelWidth: 60,
			width: 90,
			checked: true,
			inputValue: true,
			handler: function(e) {
				store.autoSync = e.checked;
				grid.down('#syncButton').setDisabled(e.checked);
				grid.down('#rollbackButton').setDisabled(e.checked);
			}
		}, '-', {
			text: 'Rollback',
			itemId: 'rollbackButton',
			disabled: true,
			listeners: {
				render: function() {
					this.addCls("x-btn-default-small");
					this.removeCls("x-btn-default-toolbar-small");
				}
			},
			handler: function() {
				store.rejectChanges();
			}
		}, {
			text: 'Sync',
			itemId: 'syncButton',
			disabled: true,
			listeners: {
				render: function() {
					this.addCls("x-btn-default-small");
					this.removeCls("x-btn-default-toolbar-small");
				}
			},
			handler: function() {
				store.sync();
			}
		} ],
		plugins: [ rowEditing ],
		listeners: {
			'selectionchange': function(view, records) {
				grid.down('#removeBook').setDisabled(!records.length);
			}
		}
	});

	launched = true;
}
