/*
  Aras.HTML5 provides a HTML5 client library to build Aras Innovator Applications

  Copyright (C) 2015 Processwall Limited.

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU Affero General Public License as published
  by the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU Affero General Public License for more details.

  You should have received a copy of the GNU Affero General Public License
  along with this program.  If not, see http://opensource.org/licenses/AGPL-3.0.
 
  Company: Processwall Limited
  Address: The Winnowing House, Mill Lane, Askham Richard, York, YO23 3NW, United Kingdom
  Tel:     +44 113 815 3440
  Email:   support@processwall.com
*/

define([
	'dojo/_base/declare',
	'dojo/_base/lang',
	'dojo/on',
	'../Property',
	'dijit/form/NumberSpinner'
], function(declare, lang, on, Property, NumberSpinner) {
	
	return declare('Aras.View.Properties.Integer', [NumberSpinner, Property], {
		
		_viewModelValueHandle: null,
		
		_valueHandle: null,
		
		constructor: function() {

		},
		
		startup: function() {
			this.inherited(arguments);			
		},

		destroy: function() {
			this.inherited(arguments);	

			if (this._viewModelValueHandle != null)
			{
				this._viewModelValueHandle.unwatch();
			}
			
			if (this._valueHandle != null)
			{
				this._valueHandle.unwatch();
			}
		},
		
		_mouseWheeled: function(evt){
			
			// Disable change on scroll wheel
			evt.stopPropagation();
			evt.preventDefault();
		},
		
		OnViewModelLoaded: function() {
			this.inherited(arguments);

			// Set Value from ViewModel
			this.set("value", this.ViewModel.Value);
			
			// Watch for changes in Control value
			if (this._valueHandle != null)
			{
				this._valueHandle.unwatch();
			}
			
			this._valueHandle = this.watch('value', lang.hitch(this, function(name, oldValue, newValue) {
				
				if (isNaN(newValue))
				{
					this.set("value", oldValue);
				}
				else
				{
					var newnumber = Number(newValue);
					var currentnumber = Number(this.ViewModel.get('Value'));
				
					if (currentnumber !== newnumber)
					{										
						if (!this._updateFromViewModel)
						{
							// Update ViewModel Value
							this.ViewModel.set('Value', newnumber);
							this.ViewModel.Write();
						}
					}
				}
					
			}));
			
			// Watch for changes in ViewModel
			if (this._viewModelValueHandle != null)
			{
				this._viewModelValueHandle.unwatch();
			}
			
			this._viewModelValueHandle = this.ViewModel.watch('Value', lang.hitch(this, function(name, oldValue, newValue) {
					
				if (newValue)
				{
					// Stop ViewModel Update
					this._updateFromViewModel = true;
					
					// Set Value
					this.set("value", this.ViewModel.Value);
					
					// Start ViewModel Update
					this._updateFromViewModel = false;
				}
					
			}));
		}

	});
});