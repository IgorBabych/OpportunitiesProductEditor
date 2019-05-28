({
    searchField : function(component, event, helper) {
        var currentText = event.getSource().get("v.value");
        var resultBox = component.find('resultBox');
        component.set("v.LoadingText", true);
        if(currentText.length > 0) {
            $A.util.addClass(resultBox, 'slds-is-open');
        }
        else {
            $A.util.removeClass(resultBox, 'slds-is-open');
        }
        var action = component.get("c.getResults");
        action.setParams({
            "opportunityId" : component.get("v.opportunityId"),
            "fieldName" : component.get("v.fieldName"),
            "value" : currentText
        });




        action.setCallback(this, function(response){
            var STATE = response.getState();
            if(STATE === "SUCCESS") {
                component.set("v.searchRecords", response.getReturnValue());
                if(component.get("v.searchRecords").length == 0) {
                    console.log('000000');
                }
            }
            else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " +
                            errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            }
            component.set("v.LoadingText", false);
        });

        $A.enqueueAction(action);
    },

    setSelectedRecord : function(component, event, helper) {

        var resultBox = component.find('resultBox');
        $A.util.removeClass(resultBox, 'slds-is-open');
        //component.set("v.selectRecordName", currentText);
        component.set("v.selectRecordName", event.currentTarget.dataset.name);
        component.set("v.updateUnitPrice", event.currentTarget.dataset.price);
        component.set("v.updatedRecordId", event.currentTarget.id);
        component.find('userinput').set("v.readonly", true);
 //       alert(event.currentTarget.dataset.price);
    },

    resetData : function(component, event, helper) {
        component.set("v.selectRecordName", "");
        // component.set("v.updateUnitPrice", "");
        component.find('userinput').set("v.readonly", false);
    }
})