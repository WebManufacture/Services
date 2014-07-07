
/*

Storages.Temp - это хранилище информации может существовать, пока страница не будет перезагружена

Storages.Local.Session - существует пока длится сессия, т. е. пока работаем с сайтов
Storages.Local.User - Локальное (на этом компе, для пользователя для конкретного домена)
Storages.Local.Site - Общее для сайта, сохраняется до чистки кеша или переустановки браузера.
Storages.Local(.Persistent, .Shared) - общее хранилище, не привязано к домена
 
Storages.Server.Session
Storages.Server.User
Storages.Server.Site
Storages.Server(.Persistent)

Storages.Peer.Session
Storages.Peer.User
Storages.Peer.Site
Storages.Peer(.Persistent)

Storages.Global.Session
Storages.Global.User
Storages.Global.Site
Storages.Global(.Persistent)


Storage.Session(.Local, .Server, .Peer, .Global)
Storage.User(.Local, .Server, .Peer, .Global)
Storage.Site(.Local, .Server, .Peer, .Global)
Storage.Persistent(.Local, .Server, .Peer, .Global)

*/

Storages = {
	Init : function(){
		
	}	
};


Storages._storageObject = function(){
		
}

Inherit(Storages._storageObject, EventEmitter, {
	get : function(selector, callback){},
	all : function(selector, callback){},
	set : function(selector, callback){},
	del : function(selector, callback){},
	add : function(selector, callback){}
});

Storages._baseStorage = function(){
		
};

Inherit(Storages._baseStorage, EventEmitter, {
	get : function(selector, callback){},
	all : function(selector, callback){},
	set : function(selector, callback){},
	del : function(selector, callback){},
	add : function(selector, callback){},
	_serializeObject : function(obj){
		
	},
	_deSerializeObject : function(obj){
		
	}
});
/*
Storages.Temp = new Storages._baseStorage();

Storages.Session = {
	Local : new Storages._baseStorage(),
	Server: new Storages._baseStorage(),
	Peer : new Storages._baseStorage(),
	Global : new Storages._baseStorage(),
};

Storages.User = {
	Local : new Storages._baseStorage(),
	Server: new Storages._baseStorage(),
	Peer : new Storages._baseStorage(),
	Global : new Storages._baseStorage(),
};
 
Storages.Site = {
	Local : new Storages._baseStorage(),
	Server: new Storages._baseStorage(),
	Peer : new Storages._baseStorage(),
	Global : new Storages._baseStorage(),
};

Storages.Persistent = {
	Local : new Storages._baseStorage(),
	Server: new Storages._baseStorage(),
	Peer : new Storages._baseStorage(),
	Global : new Storages._baseStorage(),
};

Storages.Local = Storages.Persistent.Local;
Storages.Local.Session = Storages.Session.Local;
Storages.Local.User = Storages.User.Local;
Storages.Local.Site = Storages.Site.Local;

Storages.Server = Storages.Persistent.Server;
Storages.Server.Session = Storages.Session.Server;
Storages.Server.User = Storages.User.Server;
Storages.Server.Site = Storages.Site.Server;

Storages.Peer = Storages.Persistent.Peer;
Storages.Peer.Session = Storages.Session.Peer;
Storages.Peer.User = Storages.User.Peer;
Storages.Peer.Site = Storages.Site.Peer;

Storages.Global = Storages.Persistent.Global;
Storages.Global.Session = Storages.Session.Global;
Storages.Global.User = Storages.User.Global;
Storages.Global.Site = Storages.Site.Global;*/

Storages.Local = function(storageName){
	if (!storageName) storageName = "";
	var origin = location.origin;
	if (!this._privacy) origin = "PERSISTENT";
	this.storageKey = "_MAIN_" + storageName  + "_ITEM_FOR_" + origin;
	if (this._privacy == "session"){ 
		this.storage = localStorage.getItem(this.storageKey);
	}
	else{
		this.storage = sessionStorage.getItem(this.storageKey);
	}
	if (!this.storage){ this.storage = "" };
	this.storage = DOM.div("", this.storage);	
};

Inherit(Storages.Local, Storages._baseStorage, {
	on : function(){
		return this.channel.on.apply(this.channel, arguments);
	},
	
	un : function(){
		return this.channel.un.apply(this.channel, arguments);
	},

	once : function(){
		return this.channel.once.apply(this.channel, arguments);
	},

	_emit : function(){
		return this.channel.emit.apply(this.channel, arguments);
	},
	
	get : function(selector, callback){
		return this.storage.get(selector);
	},
	all : function(selector, callback){
		return this.storage.all(selector);
	},
	set : function(item, callback){
		var result = this.storage.innerHTML = item;
		this._save();
		return result;
	},
	del : function(selector, callback){
		var result = this.storage.del(selector);
		this._save();
		return result;
	},
	add : function(item, callback){
		var result = this.storage.innerHTML += item;
		this._save();
		return result;
	},
	_save : function(){
		if (this._privacy == "session"){ 
			localStorage.setItem(this.storageKey, this.storage.innerHTML);
		}
		else{
			sessionStorage.setItem(this.storageKey, this.storage.innerHTML);
		}
	}
});


Storages.Local.Session = Inherit(function(){ 
	this._privacy = 'session';
	Storages.Local.Session.super_.apply(this, arguments); 
}, Storages.Local);

Storages.Local.User = Inherit(function(){ 
	this._privacy = 'user';
	Storages.Local.User.super_.apply(this, arguments); 
}, Storages.Local);

Storages.Local.Site = Inherit(function(){ 
	this._privacy = 'site';
	Storages.Local.Site.super_.apply(this, arguments); 
}, Storages.Local);



Storages.Server = function(url){
	if (!url){
		if (window.Config && window.Config.Server){
			url = Config.Server.ServerStorageUrl;
		}
		if (!url){
			url = location.origin + "/storage";
		}		
	}
	this.url = url;
};

Storages.SyncObj = function(storage, dofunc, callback){
	this.storage = storage;
	this.ready = false;
	this.dofunc = dofunc;
	if (callback){
		this.on("data", callback);
	}
}

Inherit(Storages.SyncObj, Channel, {
	go : function(callback){
		if (callback){
			this.on("data", callback);
		}
		this.dofunc();
	}
});

Inherit(Storages.Server, Storages._baseStorage, {
	_sendRequest : function(type, selector, data, callback, defer){
		var storage = this;
		var syncObj = new Storages.SyncObj(this, function(){
			var url = storage.url + "?action=" + type + "&selector=" + encodeURIComponent(selector);
			syncObj.request = Net.POST(url, data ? JSON.stringify(data) : "", function(result){
				var contentType = this.getResponseHeader("Content-Type");
				syncObj.data = result;
				syncObj.ready = true;
				if (callback){
					callback.call(this, result, storage);
				}
				syncObj.emit("data", result);
			});
		});
		if (callback && !defer) syncObj.go();
		return syncObj;
	},

	all : function(selector, callback) {
		if (!callback && typeof(selector) == "function") {
			callback = selector;	
			selector = null;
		}
		return this._sendRequest("all", selector, null, callback);
	},

	get : function(selector, callback) {
		return this._sendRequest("get", selector, null, callback);
	},

	add : function(selector, data, callback) {
		return this._sendRequest("add", selector, data, callback);
	},


	set : function(selector, data, callback) {
		return this._sendRequest("set", selector, data, callback);
	},

	del : function(selector, callback) {
		return this._sendRequest("del", selector, null, callback);
	}
});

Storages.Server.Session = Inherit(function(url){
	if (!url && window.Config && window.Config.Server){
		arguments[0] = url = Config.Server.SessionStorageUrl;
	}
	Storages.Server.Session.super_.apply(this, arguments); 
}, Storages.Server, {
	_sendRequest : function(type, selector, data, callback){
		var syncObj = this.prototype._sendRequest.call(this, type, selector, data, callback, false);
		if (window.Auth && window.Auth.SessionKey){
			syncObj.request.setRequestHeader("auth-parameters", '{"SessionKey":"' + Auth.SessionKey + '"}');
		}
		if (callback) syncObj.go();
		return syncObj;
	},	
});

Storages.Server.User = Inherit(function(url){
	if (!url && window.Config && window.Config.Server){
		arguments[0] = url = Config.Server.UserStorageUrl;
	}
	Storages.Server.Session.super_.apply(this, arguments); 
}, Storages.Server, {
	_sendRequest : function(type, selector, data, callback){
		var syncObj = this.prototype._sendRequest.call(this, type, selector, data, callback, false);
		if (window.Auth && window.Auth.Login){
			syncObj.request.setRequestHeader("auth-parameters", '{"Login":"' + Auth.Login + '","SessionKey":"' + Auth.SessionKey + '"}');
		}
		if (callback) syncObj.go();
		return syncObj;
	},	
});

Storages.Server.Site = Inherit(function(url){
	if (!url && window.Config && window.Config.Server){
		arguments[0] = url = Config.Server.SiteStorageUrl;
	}
	Storages.Server.Session.super_.apply(this, arguments); 
}, Storages.Server);




Storages.Peer = function(){
	
};

Storages.Peer.Session = Inherit(function(){}, Storages.Peer);
Storages.Peer.User = Inherit(function(){}, Storages.Peer);
Storages.Peer.Site = Inherit(function(){}, Storages.Peer);

Storages.Global = function(){
	
};
Storages.Global.Session = Inherit(function(){}, Storages.Global);
Storages.Global.User = Inherit(function(){}, Storages.Global);
Storages.Global.Site = Inherit(function(){}, Storages.Global);

WS.DOMload(Storages.Init);

