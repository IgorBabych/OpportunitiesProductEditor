({

    searchField: function (component, event, helper) {
        var currentText = event.getSource().get("v.value");
        var resultBox = component.find('resultBox');
        component.set("v.LoadingText", true);
        if (currentText.length > 0) {
            $A.util.addClass(resultBox, 'slds-is-open');
        } else {
            $A.util.removeClass(resultBox, 'slds-is-open');
        }
        var action = component.get("c.getOpportunityProducts");
        action.setParams({
            "opportunityId": component.get("v.opportunityId"),
            "value": currentText
        });

        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.searchRecords", response.getReturnValue());
            } else {
                console.log("Failed with state: " + state);
            }
            component.set("v.LoadingText", false);
        });
        $A.enqueueAction(action);
    },

    setSelectedRecord: function (component, event, helper) {
        var resultBox = component.find('resultBox');
        $A.util.removeClass(resultBox, 'slds-is-open');
        let oldRecord = component.get('v.updateRecord');
        let recordForUpdate = component.get('v.updateRecord');
        recordForUpdate.UnitPrice = event.currentTarget.dataset.price;
        component.set('v.updateRecord', recordForUpdate);
        var recAtt = component.get("v.updateRecord");
        alert(recAtt.UnitPrice);
        component.set("v.updatedRecordId", event.currentTarget.id);
        component.find('userinput').set("v.readonly", true);
        var updateProductEvent = component.getEvent("UpdateProduct");
        updateProductEvent.setParams({
            "updateRecord" :null,
            "row" :null
        });
        console.log('was fired');
        updateProductEvent.fire();
    },

    resetData: function (component, event, helper) {
        component.set("v.selectRecordName", "");
        component.find('userinput').set("v.readonly", false);
    }

})