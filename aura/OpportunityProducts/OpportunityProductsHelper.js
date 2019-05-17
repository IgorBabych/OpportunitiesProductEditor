({

    getTableFieldSet : function(component, event, helper) {
        var action = component.get("c.getFieldSet");
        action.setParams({
            sObjectName: component.get("v.sObjectName"),
            fieldSetName: component.get("v.fieldSetName")
        });

        action.setCallback(this, function(response) {
            var fieldSetObj = JSON.parse(response.getReturnValue());
//alert(response.getReturnValue());
            component.set("v.fieldSetValues", fieldSetObj);
            //Call helper method to fetch the records
            helper.getTableRows(component, event, helper);
        })
        $A.enqueueAction(action);
    },

    getTableRows : function(component, event, helper){
        var action = component.get("c.getRecords");
        var fieldSetValues = component.get("v.fieldSetValues");
        var setfieldNames = new Set();
        for(var c=0, clang=fieldSetValues.length; c<clang; c++){
            if(!setfieldNames.has(fieldSetValues[c].name)) {
                setfieldNames.add(fieldSetValues[c].name);
                if(fieldSetValues[c].type == 'REFERENCE') {
                    if(fieldSetValues[c].name.indexOf('__c') == -1) {
                        setfieldNames.add(fieldSetValues[c].name.substring(
                            0, fieldSetValues[c].name.indexOf('Id')) + '.Name');}
                    else {setfieldNames.add(fieldSetValues[c].name.substring(
                        0, fieldSetValues[c].name.indexOf('__c')) + '__r.Name');}}}}
        var arrfieldNames = [];
        setfieldNames.forEach(v => arrfieldNames.push(v));
        console.log(arrfieldNames);

        action.setParams({
            sObjectName: component.get("v.sObjectName"),
            parentFieldName: component.get("v.parentFieldName"),
            parentRecordId: component.get("v.parentRecordId"),
            fieldNameJson: JSON.stringify(arrfieldNames)
        });
        action.setCallback(this, function(response) {
            var list = JSON.parse(response.getReturnValue());
            console.log("------------------------");
            console.log(JSON.stringify(list));
            console.log("------------------------");
            component.set("v.tableRecords", list);
 //           alert(response.getReturnValue());
 //           alert(list[0].Product2.Name);
        })
        $A.enqueueAction(action);
    },

    createTableRows : function(component, event, helper){

    },



    getOpportunityLineItems: function (component, event, helper) {
        var action = component.get("c.getOpportunityLineItems");
        const oppId = component.get("v.recordId");
        component.set("v.opportunityId", oppId);
        component.set("v.parentRecordId", oppId);
        action.setParam("oppId", oppId);
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var oppProd = response.getReturnValue();
                var updatedOppProd = this.handleOppProdFields (oppProd);
                component.set("v.opportunityProducts", updatedOppProd);
            } else {
                this.showToast('error', "Failed with state: " + state);
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