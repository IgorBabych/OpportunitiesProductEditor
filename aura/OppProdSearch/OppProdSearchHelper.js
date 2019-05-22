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
                this.showCustomToast("error", "Failed with state: " + state);
            }
            component.set("v.LoadingText", false);
        });
        $A.enqueueAction(action);
    },

    setSelectedRecord: function (component, event, helper) {
        var resultBox = component.find('resultBox');
        $A.util.removeClass(resultBox, 'slds-is-open');
        let recordForUpdate = component.get('v.updateRecord');
        recordForUpdate.UnitPrice = event.currentTarget.dataset.price;
        recordForUpdate.Name = event.currentTarget.dataset.name;
        recordForUpdate.productToUpgrade = event.currentTarget.id;
        component.set('v.updateRecord', recordForUpdate);

        component.find('userinput').set("v.readonly", true);
        let updateProductEvent = component.getEvent("UpdateProductEvent");
        updateProductEvent.fire();
    },

    resetData: function (component, event, helper) {
        component.set("v.recordName", "");
        component.find('userinput').set("v.readonly", false);
    },

    setRecordName: function (component) {
        let updateRecord = component.get("v.updateRecord");
        let recordName = updateRecord.Product2.Name;
        component.set('v.recordName', recordName);
    },

    showCustomToast : function(state, contents) {
        var messageEvent = $A.get("e.c:ToastMessageEvent");
        messageEvent.setParams({
            "state": state,
            "contents": contents
        });
        messageEvent.fire();
    },

});