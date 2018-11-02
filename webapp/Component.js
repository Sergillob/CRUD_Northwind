sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"ZPRODUCTS_CRUD/model/models"
], function(UIComponent, Device, models) {
	"use strict";

	return UIComponent.extend("ZPRODUCTS_CRUD.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// set the device model
			this.setModel(models.createDeviceModel(), "device");

			// We need to add the below one line code to initialize and enable the hash (#) based routing
			// enable hash based routing
			this.getRouter().initialize();
			//Per tal de poder accedir al odata del Northwind versió 3.0, que no está permés, com q es el que et 
			//permet llegir i escriure, el que fem es posar al manifest.json els següents 2 parámetres;
			//	"DataServiceVersion": "3.0",
			//	"MaxDataServiceVersion": "3.0"
		}
	});
});