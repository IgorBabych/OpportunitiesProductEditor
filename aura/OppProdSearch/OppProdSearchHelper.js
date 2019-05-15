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
        component.set("v.selectRecordName", event.currentTarget.dataset.name);
        component.set("v.updateUnitPrice", event.currentTarget.dataset.price);
        component.set("v.updatedRecordId", event.currentTarget.id);
        component.find('userinput').set("v.readonly", true);
    },

    resetData: function (component, event, helper) {
        component.set("v.selectRecordName", "");
        component.find('userinput').set("v.readonly", false);
    }

})