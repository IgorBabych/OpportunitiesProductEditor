({
    doInit: function (component, event, helper) {
        helper.getOpportunityLineItems(component);
    },


    clickSaveButton: function (component, event, helper) {
        helper.updateOpportunityLineItems(component, event);
        helper.getOpportunityLineItems(component);
    },


    clickCancelButton: function (component, event, helper) {
        helper.getOpportunityLineItems(component);
    }
})