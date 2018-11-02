sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History"
], function (Controller, History) {
	"use strict";

	return Controller.extend("ZPRODUCTS_CRUD.controller.Edit", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf ZPRODUCTS_CRUD.view.Edit
		 */
		onInit: function () {
			// Get the Router Info
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

			// Validate/Match the Router Details sent from source using oRouter.navTo("Router_Detail", {SelectedItem: selectPO});
			oRouter.getRoute("Editar").attachMatched(this._onRouteFound, this);

		},

		// Custom Method to bind the elements using the Event Arguments
		_onRouteFound: function (oEvt) {

			var oArgument = oEvt.getParameter("arguments");

			var oView = this.getView();

			oView.bindElement({
				path: "/Products(" + oArgument.SelectedItem + ")",
				//perque es vegi els puntets de pensar...
				events: {
					dataRequested: function (oEvt) {
						oView.setBusy(true);
					},
					dataReceived: function (oEvt) {
						oView.setBusy(false);
					}
				}
			});
		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf ZPRODUCTS_CRUD.view.Edit
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf ZPRODUCTS_CRUD.view.Edit
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf ZPRODUCTS_CRUD.view.Edit
		 */
		//	onExit: function() {
		//
		//	}
		// Volem navegar a la pantalla anterior!!!!
		onNavPress: function (Evt) {

			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();
			// Go one screen back if you find a Hash
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			}
			// If you do not find a correct Hash, go to the Source screen using default router;
			else {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("", true);
			}
		},

		onSave: function () {

			var content = this.getView().byId("form").getContent();

			var oEntry = {

				"ID": content[1].getValue(),
				"Name": content[3].getValue(),
				"Description": content[5].getValue(),
				"ReleaseDate": "2005-10-01T00:00:00",
				// "DiscontinuedDate":content[7].getValue(), Si está a blanc s'ha de formatejar a DateTime abans!!!!!!
				"Rating": content[9].getValue(),
				"Price": content[11].getValue()
			};
			//	console.log(oEntry);
			var sUrl = '',
				sPath = this.getView().getElementBinding().getPath(),
				oModel = this.getView().getModel(),
				//oObject = oModel.getProperty(sPath);

				sUrl = "/Products(" + oEntry.ID + ")";
			//Create,Update i Delete amb Northwind només pot ser amb V2 !!! V3 no em funciona!!!
			//Per tenir una nova sessió posar services.odata/V2/S(readwrite)/OData/OData.svc i et dóna el nou token
			//que has de posar dins del S()
			var vUrl = "proxy/http/services.odata.org/V2/(S(pw0txvbzrqvrsgt1lwfgdzay))/OData/OData.svc/Products(" + oEntry.ID + ")";

			/*     Realment No cal.......
			       oModel.setHeaders({
			       	"X-Requested-With":"XMLHttpRequest",
			       	"X-CSRF-Token": "Fetch"
			       });
			 */
			debugger;
			oModel.update(sUrl, oEntry, {
				success: function () {
					sap.m.MessageToast.show("Product Updated");
				},
				error: function () {
					alert("Error while inserting data");
				}
			});
			//Per tal de que actualizi la taula de la pantalla anterior, l'únic que hem de fer es 
			//posar al manifest.json, el defaultBindingMode=TwoWay (ja que per defecte està el OneTime)!!!!!!!!!!!!!!!!

			/*NO FUNCIONA no se perque.... em diu : 405 (Method Not Allowed)********************************************************
			$.ajax({
					type: "PUT",
					url: vUrl,
					dataType: "json",
					data: JSON.stringify(oEntry),
					contentType: "application/json",
					accept: "application/json",
					success: function() {
						sap.m.MessageToast.show("Product Updated");
					//	oEditDialog.close();
						sap.ui.getCore().byId("form").getModel().refresh(true);

					},

					error: function() {
						alert("Error while inserting data");
					}
				});
         */
		}

	});

});