({
    getOpportunityLineItems: function (component, event, helper) {
        var action = component.get("c.getOpportunityLineItems");
        const oppId = component.get("v.recordId");
        component.set("v.opportunityId", oppId);
        action.setParam("oppId", oppId);
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var oppProd = response.getReturnValue();
                var updatedOppProd = this.handleOppProdFields (oppProd);
                component.set("v.opportunityProducts", updatedOppProd);
            } else {
                console.log("Failed with state: " + state);
            }
        });
        $A.enqueueAction(action);
    },


    updateOpportunityLineItems: function (component, event, helper) {
        var eventSource = event.getSource();
        var opportunityProductsToIterate = component.get("v.opportunityProducts");
        var opportunityProductsToUpsert = [];
        var opportunityProductsToDelete = [];

        for (var i = 0; i < opportunityProductsToIterate.length; i++) {
            var oppProd = opportunityProductsToIterate[i];

            if (this.oppProdIsToReplace(oppProd)) {
                let oppProductOld = this.createOppProdToDelete(oppProd);
                let oppProductCopy = this.createOppProdToInsert(oppProd);
                opportunityProductsToDelete.push(oppProductOld);
                opportunityProductsToUpsert.push(oppProductCopy);
            }

            if (this.oppProdIsToUpgrade(oppProd)) {
                let oppProduct = this.createOppProdToUpdate(oppProd);
                opportunityProductsToUpsert.push(oppProduct);
            }
        }

        if (opportunityProductsToUpsert.length) {
            this.upsertOpportunityLineItems(component, opportunityProductsToUpsert);
        }

        if (opportunityProductsToDelete.length) {
            this.deleteOpportunityLineItems(component, opportunityProductsToDelete);
        }
    },

    upsertOpportunityLineItems: function (component, opportunityProductsToUpsert) {
        let action = component.get("c.upsertOpportunityLineItems");
        action.setParam("oppLineItem", opportunityProductsToUpsert);
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                alert('Changes saved!');
                $A.get('e.force:refreshView').fire();
            } else {
                alert('Changes ' + state);
            }
        });
        $A.enqueueAction(action);
    },

    deleteOpportunityLineItems: function (component, opportunityProductsToDelete) {
        let action = component.get("c.deleteOpportunityLineItems");
        action.setParam("oppLineItem", opportunityProductsToDelete);
        $A.enqueueAction(action);
    },

    oppProdIsToReplace: function (oppProd) {
        return oppProd.productToUpgrade !== '' && oppProd.Product2Id !== oppProd.productToUpgrade;
    },


    oppProdIsToUpgrade: function (oppProd) {
        return oppProd.productToUpgrade === '';
    },

    createOppProdToDelete: function (oppProd) {
        return {
            'sobjectType': 'OpportunityLineItem',
            'Id': oppProd.Id
        };
    },

    createOppProdToInsert: function (oppProd) {
        return {
            'sobjectType': 'OpportunityLineItem',
            'OpportunityId': oppProd.OpportunityId,
            'Product2Id': oppProd.productToUpgrade,
            'Quantity': oppProd.Quantity,
            'UnitPrice': oppProd.UnitPrice,
            'ServiceDate': oppProd.ServiceDate,
            'Description' : oppProd.Description
        };
    },

    createOppProdToUpdate : function (oppProd) {
        return {
            'sobjectType': 'OpportunityLineItem',
            'Id': oppProd.Id,
            'OpportunityId': oppProd.OpportunityId,
            'Quantity': oppProd.Quantity,
            'UnitPrice': oppProd.UnitPrice,
            'ServiceDate': oppProd.ServiceDate,
            'Description' : oppProd.Description
        };
    },

    handleOppProdFields : function (oppProds){
        for (var i = 0; i < oppProds.length; i++) {
            var oppProd = oppProds[i];
            oppProd.productToUpgrade = "";
            if (oppProd.Product2) oppProd.Product2 = oppProd.Product2.Name;
        }
        return oppProds;
    },


    handleRowAction: function (cmp, event, helper) {
        var action = event.getParam('action');
        var row = event.getParam('row');
        switch (action.name) {
            case 'show_details':
                alert('Showing Details: ' + JSON.stringify(row));
                break;
            case 'delete':
                var rows = cmp.get('v.mydata');
                var rowIndex = rows.indexOf(row);
                rows.splice(rowIndex, 1);
                cmp.set('v.mydata', rows);
                break;
        }
    },

});