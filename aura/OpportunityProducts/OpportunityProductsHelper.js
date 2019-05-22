({

    getTableFieldSet : function(component, event, helper) {
        var action = component.get("c.getFieldSet");
        action.setParams({
            sObjectName: component.get("v.sObjectName"),
            fieldSetName: component.get("v.fieldSetName")
        });

        action.setCallback(this, function(response) {
            var fieldSetObj = JSON.parse(response.getReturnValue());
            component.set("v.fieldSetValues", fieldSetObj);
            helper.getTableRows(component, event, helper);
        });
        $A.enqueueAction(action);
    },

    getTableRows : function(component, event, helper){
        let action = component.get("c.getRecords");
        let fieldSetValues = component.get("v.fieldSetValues");
        let fieldNames = this.getFieldNames(fieldSetValues);

        action.setParams({
            sObjectName: component.get("v.sObjectName"),
            parentFieldName: component.get("v.parentFieldName"),
            parentRecordId: component.get("v.parentRecordId"),
            fieldNameJson: JSON.stringify(fieldNames)
        });

        action.setCallback(this, function(response) {
            let tableRecords = JSON.parse(response.getReturnValue());
            component.set("v.tableRecords", tableRecords);
        });
        $A.enqueueAction(action);
    },

    updateOpportunityLineItems: function (component, event, helper) {
        let eventSource = event.getSource();
        let opportunityProductsToIterate = component.get("v.tableRecords");
        let opportunityProductsToUpsert = [];
        let opportunityProductsToDelete = [];

        for (let i = 0; i < opportunityProductsToIterate.length; i++) {
            let oppProd = opportunityProductsToIterate[i];

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
            let state = response.getState();
            if (state === "SUCCESS") {
                this.showToast('success', 'Changes saved!');
                $A.get('e.force:refreshView').fire();
            } else {
                this.showToast('error', 'Changes ' + state);
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

        return !$A.util.isEmpty(oppProd.productToUpgrade) && oppProd.Product2Id !== oppProd.productToUpgrade;
    },


    oppProdIsToUpgrade: function (oppProd) {

        return $A.util.isEmpty(oppProd.productToUpgrade);
    },

    createOppProdToDelete: function (oppProd) {
        return {
            'sobjectType': 'OpportunityLineItem',
            'Id': oppProd.Id
        };
    },

    createOppProdToInsert: function (oppProd) {
        oppProd.Id = undefined;
        oppProd.attributes = undefined;
        oppProd.Product2 = undefined;
        oppProd.Product2Id = oppProd.productToUpgrade;
        return oppProd;
    },

    createOppProdToUpdate : function (oppProd) {
        oppProd.attributes = undefined;
        oppProd.Product2 = undefined;
        oppProd.Product2Id = undefined;
        return oppProd;
    },

    closePage : function (oppProds){
        $A.get('e.force:closeQuickAction').fire();
    },


    showToast : function(state, contents) {
        var messageEvent = $A.get("e.c:ToastMessageEvent");
        messageEvent.setParams({
            "state": state,
            "contents": contents
        });
        messageEvent.fire();
    },

    updateParentRecordId : function (component) {
        let oppId = component.get("v.recordId");
        component.set("v.parentRecordId", oppId);
    },

    getFieldNames: function (fieldSetValues) {
        let fieldSetNames = new Set();
        for (let c = 0; c < fieldSetValues.length; c++) {
            if (!fieldSetNames.has(fieldSetValues[c].name)) {
                fieldSetNames.add(fieldSetValues[c].name);
                if (fieldSetValues[c].type === 'REFERENCE') {
                    if (fieldSetValues[c].name.indexOf('__c') === -1) {
                        fieldSetNames.add(fieldSetValues[c].name.substring(
                            0, fieldSetValues[c].name.indexOf('Id')) + '.Name');
                    } else {
                        fieldSetNames.add(fieldSetValues[c].name.substring(
                            0, fieldSetValues[c].name.indexOf('__c')) + '__r.Name');
                    }
                }
            }
        }
        let fieldNames = [];
        fieldSetNames.forEach(v => fieldNames.push(v));
        return fieldNames;
    }
});