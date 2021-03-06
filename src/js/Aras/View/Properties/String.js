/*  
  Copyright 2017 Processwall Limited

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
 
  Company: Processwall Limited
  Address: The Winnowing House, Mill Lane, Askham Richard, York, YO23 3NW, United Kingdom
  Tel:     +44 113 815 3440
  Web:     http://www.processwall.com
  Email:   support@processwall.com
*/

define([
	'dojo/_base/declare',
	'dojo/_base/lang',
	'../Property',
	'dijit/form/TextBox'
], function(declare, lang, Property, TextBox) {
	
	return declare('Aras.View.Properties.String', [TextBox, Property], {
			
		_viewModelValueHandle: null, 
		
		_valueHandle: null,
		
		constructor: function() {
			
		},
		
		startup: function() {
			this.inherited(arguments);
			
			// Call Control Startup
			this._startup();
			
			this._updateString();
		},
		
		destroy: function() {
			this.inherited(arguments);	

			// Call Control Destroy
			this._destroy();
			
			if (this._viewModelValueHandle != null)
			{
				this._viewModelValueHandle.unwatch();
			}
			
			if (this._valueHandle)
			{
				this._valueHandle.unwatch();
			}
		},
		
		_updateString: function() {

			if (this.ViewModel != null)
			{
				// Set Value from ViewModel
				this.set("value", this.ViewModel.Value);
			
				// Watch for changes in Control value
				if (!this._valueHandle)
				{
					this._valueHandle = this.watch('value', lang.hitch(this, function(name, oldValue, newValue) {
				
						if (oldValue !== newValue)
						{										
							if (!this._updateFromViewModel)
							{
								// Update ViewModel Value
								this.ViewModel.set('Value', newValue);
								this.ViewModel.Write();
							}
						}
	
					}));
				}
			
				// Watch for changes in the ViewModel
				if (!this._viewModelValueHandle)
				{
					this._viewModelValueHandle = this.ViewModel.watch('Value', lang.hitch(this, function(name, oldValue, newValue) {
					
						// Stop ViewModel Update
						this._updateFromViewModel = true;
				
						// Set Value
						this.set("value", newValue);

						// Stop ViewModel Update
						this._updateFromViewModel = false;				
					}));
				}
			}
			else
			{
				this.set("value", null);
				
				if (this._valueHandle)
				{
					this._valueHandle.unwatch();
				}
				
				if (this._viewModelValueHandle)
				{
					this._viewModelValueHandle.unwatch();
				}
			}
		},
		
		OnViewModelChanged: function(name, oldValue, newValue) {
			this.inherited(arguments);	
			
			// Update String
			this._updateString();	
		}

	});
});