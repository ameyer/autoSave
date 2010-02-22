/*
---
description: Better event delegation for MooTools.

license: MIT-style

authors:
- Adam Meyer

requires:
- core/1.2.4
provides: ability to track and autosave changes on an input.

...
*/

var AutoSave = new Class({

	Implements: [Options, Events],

	options: {
		onStart: $empty,
		onPause: $empty,
		onSave: $empty,
		onSaved: $empty,
		interval: 1000,
		url: 'save.php',
		post: {}
	},
	
	initialize: function(element, options){
		console.log('autoSave: initializing');
		
		this.el = element;
		
		this.setOptions(options);
		
		this.saving = false;
		this.perVar;		
		this.value = '';
		
		this.saveFunction = function(){		
			if(element.value != this.value){
				this.fireEvent('onSave');
				this.value = this.el.value;
				this.saver.post(this.options.post);
			}else{
				console.log('autoSave: no change');
			}
		}.bind(this);
		
		
		this.saver = new Request.JSON({
			url: this.options.url,
			
			onRequest: function(object, txt){
				
			}.bind(this),	
			
			onSuccess: function(object, txt){
				this.fireEvent('onSaved', object);
			}.bind(this)
		
		});
		
	},
	
	start: function() {
		console.log('autoSave: started');
		this.value = this.el.value;
				
		if(!this.saving){
			this.saving = true;
			this.perVar = this.saveFunction.periodical(this.options.interval);
		}	
	},
	
	pause: function() {
		console.log('autoSave: paused');
		
		if(this.saving){
			this.saving = false;
			$clear(this.perVar);
		}
		
	},
		
	save: function() {
		this.saveFunction();
	},
	
	force: function(){
		this.fireEvent('onSave');
		this.value = this.el.value;
		this.saver.post(this.options.post);
	}
	
});