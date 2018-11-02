sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox"
], function (Controller, MessageBox) {
	"use strict";

	return Controller.extend("ZPRODUCTS_CRUD.controller.Mostrar_dades", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf ZPRODUCTS_CRUD.view.Mostrar_dades
		 */
		onInit: function () {

		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf ZPRODUCTS_CRUD.view.Mostrar_dades
		 */
		//	onBeforeRendering: function() {
		//		debugger;
		//      this.getView().byId("it_item").getModel().refresh(true);
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf ZPRODUCTS_CRUD.view.Mostrar_dades
		 */
		//		onAfterRendering: function() {
		//		},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf ZPRODUCTS_CRUD.view.Mostrar_dades
		 */
		//	onExit: function() {
		//
		//	}

		//Contador de linies (visualitzades/total)
		onUF: function (oEvent) {

			var sTitle = "Número Productos";
			var oTable = this.getView().byId("it_item");
			//Mira si el backend soporta el contador remoto!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
			if (oTable.getBinding("items").isLengthFinal()) {
				var iCount = oEvent.getParameter("total"),
					iItems = oTable.getItems().length;
				sTitle += " (" + iItems + "/" + iCount + ")";
			}
			this.getView().byId("title").setText(sTitle);

			//UNA ALTRA MANERA...... també funciona !!!!!!!!
			// var oModel = this.getView().getModel();
			//   oModel.read("/Products", {
			//  	  success: function(data) {

			//  	  	var numLineas = data.results.length;
			//  	  },
			//  	  error: function(){
			//  	  	alert("ERROR");
			//  	  }
			//   });
		},

		/* Amb només un camp per filtrar!!!!
				handleSearch: function(evt) {

					// create model filter
					var filters = [];
					var query = evt.getParameter("query");
					if (query && query.length > 0) {
						var filter = new sap.ui.model.Filter("Name", sap.ui.model.FilterOperator.Contains, query);
						filters.push(filter);
					}

					// update list binding
					var list = this.getView().byId("it_item");
					var binding = list.getBinding("items");
					binding.filter(filters);

				},
		*/

		// Altra manera amb més d'un camp per filtrar!!!!!!!!
		handleSearch: function (evt) {

			// create model filter

			var query = evt.getParameter("query");
			if (query && query.length > 0) {

				var filters = new sap.ui.model.Filter({
					//	and: true,
					or: true,
					filters: [new sap.ui.model.Filter("Name", sap.ui.model.FilterOperator.Contains, query),
						new sap.ui.model.Filter("Description", sap.ui.model.FilterOperator.Contains, query)
					]
				});

			}

			// update list binding
			var list = this.getView().byId("it_item");
			var binding = list.getBinding("items");
			binding.filter(filters);

		},

		//si clicka  a la linea, que vagia la pantalla de editar directament, 
		//sense calguer donar-li al radiobutton i clickar a editar!!!!  
		NavToEditView: function (evt) {

			// Get Property of the Clicked Item....
			var selectProduct = evt.getSource().getBindingContext().getProperty("ID");

			// Now Get the Router Info
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

			// selectProduct = "Products(" + selectProduct + ")";
			// Tell the Router to Navigate To Editar(ruta) which is linked to Edit view
			oRouter.navTo("Editar", {
				SelectedItem: selectProduct
			});
		},

		///////////////////////////////////////// EDIT /////////////////////////////////////////////////////////////////////
		onEdit: function (evt) {
			// Get Property of the Clicked Item.

			//it give complete context data assigned to row
			debugger;
			var contexts = this.getView().byId("it_item").getSelectedContexts();
			if (contexts == "") {
				sap.m.MessageToast.show("Please Select a row to Update");
			} else {

				var oSelectedItem = this.getView().byId("it_item").getSelectedItem().getCells();
				var selectProduct = oSelectedItem[0].getText();

				// No funciona el de sempre ja que el context está al botó i no a la taula!!!!!!!!!!
				//  var oItem = evt.getSource();
				// var selectProduct = oItem.getBindingContext().getProperty("ID");

				/*Si volguéssim més d'una linea seleccionada...... (canviant la view a multiselect també clar...)
				             var oSelectedItem = sap.ui.getCore().byId("table").getSelectedItems(); 
							 var item1 = oSelectedItem[0];
							 var cells = item1.getCells();
							 var oProductId = cells[0].getText();
							 var oProductName = cells[1].getText();
							 var oProductDescription = cells[2].getText();
							 var oProductRating = cells[3].getValue();
							 var oProductPrice = cells[4].getText();
				*/
				// Now Get the Router Info
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

				// selectProduct = "Products(" + selectProduct + ")";
				// Tell the Router to Navigate To Editar(ruta) which is linked to Edit view
				oRouter.navTo("Editar", {
					SelectedItem: selectProduct
				});
			}
		},

		///////////////////////////////////// CREATE ////////////////////////////////////////////////////////////////////////
		onCreate: function (evt) {
			debugger;
			//Creem el Diàleg amb javascript no xml......
			var oCreateDialog = new sap.m.Dialog();

			oCreateDialog.setTitle("Crear Nou Producte");
			//Nº màxim de regsitres
			//var oTableCount = sap.ui.getCore().byId('it_item').getBinding("items").getLength();
			//No s eperque amb el sap.ui.getCore no funciona el byId, ha de ser el this;
			var oTableCount = this.byId('it_item').getBinding("items").getLength();
			debugger;
			//summem 1 al últim registre
			oTableCount = oTableCount + 1;

			//jQuery code to get length of table
			//var oTableCount = $('#table tr').length;  

			var oSimpleForm = new sap.ui.layout.form.SimpleForm({
				maxContainerCols: 2,
				//	id: "form_crea", Si el posem naltros, cada cop q li donem a crear sense referescar dona error 
				// al duplicar id !!!!!!!
				content: [
					new sap.m.Label({
						text: "ID"
					}),
					new sap.m.Input({
						value: oTableCount,
						editable: false
					}),
					new sap.m.Label({
						text: "Name"
					}),
					new sap.m.Input({
						value: ""
					}),
					new sap.m.Label({
						text: "Description"
					}),
					new sap.m.Input({
						value: ""
					}),
					new sap.m.Label({
						text: "Rating"
					}),
					new sap.m.RatingIndicator({
						value: 0
					}),
					new sap.m.Label({
						text: "Price"
					}),
					new sap.m.Input({
						value: ""
					})
				]
			});

			oCreateDialog.addContent(oSimpleForm);
			//Afegim els botons de gravar i cancelar
			var that = this;
			oCreateDialog.addButton(
				new sap.m.Button({
					text: "Save",
					icon: "sap-icon://save",
					press: function () {
						debugger;
						//Les dos van bé???
						//var content = this.getView().byId("form_crea").getContent(); NO VA Bé ja que this fa referencia a la window!!!!!
						//var content = sap.ui.getCore().byId("form_crea").getContent() Aquet cas sí que aniria bé!!!!!
						var content = oSimpleForm.getContent();

						var oEntry = {

							"ID": content[1].getValue(),
							"Name": content[3].getValue(),
							"Description": content[5].getValue(),
							//"ReleaseDate": "2005-10-01T00:00:00",
							// "DiscontinuedDate":content[7].getValue(), Si está a blanc s'ha de formatejar a DateTime abans!!!!!!
							"Rating": content[7].getValue(),
							"Price": content[9].getValue()
						};

						var oModel = that.getView().getModel();
						var sUrl = "/Products";
						//Create,Update i Delete amb Northwind només pot ser amb V2 !!! V3 no em funciona!!!
						//Per tenir una nova sessió posar services.odata/V2/S(readwrite)/OData/OData.svc i et dóna el nou token
						//que has de posar dins del S()
						//Ho posem al manifest.json, aquí no cal....
						//	var vUrl = "proxy/http/services.odata.org/V2/(S(ik52onxl0sr30cpafruicddf))/OData/OData.svc//Products";

						/*     Realment No cal.......
						       oModel.setHeaders({
						       	"X-Requested-With":"XMLHttpRequest",
						       	"X-CSRF-Token": "Fetch"
						       });
						 */
						debugger;

						oModel.create(sUrl, oEntry, {
							success: function () {
								sap.m.MessageToast.show("Product Created");
								oCreateDialog.close();

							},
							error: function () {
								alert("Error while inserting data");
							}
						});

						//Per tal de que actualizi la taula de la pantalla anterior, l'únic que hem de fer es 
						//posar al manifest.json, el defaultBindingMode=TwoWay (ja que per defecte està el OneTime)!!!!!!!!!!!!!!!!

						/*NO FUNCIONA no se perque.... em diu : 405 (Method Not Allowed)********************************************************
			$.ajax({
					type: "POST",
					url: vUrl,
					dataType: "json",
					data: JSON.stringify(oEntry),
					contentType: "application/json",
					accept: "application/json",
					success: function() {
						sap.m.MessageToast.show("Product Created");
					//	oEditDialog.close();
					//	sap.ui.getCore().byId("form").getModel().refresh(true);

					},

					error: function() {
						alert("Error while inserting data");
					}
				});
         */
					}

				})

			);

			oCreateDialog.addButton(
				new sap.m.Button({
					text: "Cancel",
					icon: "sap-icon://cancel",
					press: function () {
						alert("Cancelar form i anar a la main list");
						oCreateDialog.close();
					}
				})

			);

			oCreateDialog.open();
			debugger;

		},
		////////////////////////////////////////// DELETE ////////////////////////////////////////////////////////////////////////
		//Traiem una finestreta d'avis amb textes del resourcebundle per si volem traduir textos!!!!!!!

		onDelete: function () {
			// Get Property of the Clicked Item.

			//it give complete context data assigned to row
			debugger;
			var contexts = this.getView().byId("it_item").getSelectedContexts();
			if (contexts == "") {
				sap.m.MessageToast.show("Please Select a row to Delete");
			} else {

				var oSelectedItem = this.getView().byId("it_item").getSelectedItem().getCells();
				var selectProduct = oSelectedItem[0].getText();

				var sUrl = '',
					//	sPath = this.getView().getElementBinding().getPath(),
					oModel = this.getView().getModel(),
					sUrl = "/Products(" + selectProduct + ")";

				debugger;
				//Popup confirmació borrat....
				var bundle = this.getView().getModel("i18n").getResourceBundle();
				MessageBox.confirm(
					//	"Segur que vols borrar el registre?", {
					bundle.getText("Pregunta"), {
						icon: sap.m.MessageBox.Icon.QUESTION,
						//	title: "Avís",
						title: bundle.getText("Avis"),
						actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
						onClose: function (oAction) {
							if (oAction == "YES") {
								oModel.remove(sUrl, {
									success: function () {
										sap.m.MessageToast.show("Product Deleted");
									},
									error: function () {
										alert("Error while deleting data");
									}
								});

							}
						}
					});

			}
		}
	});
});