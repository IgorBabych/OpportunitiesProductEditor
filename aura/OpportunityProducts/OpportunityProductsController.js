({
    doInit: function (component, event, helper) {
        helper.getOpportunityLineItems(component);
    },


    clickSaveButton: function (component, event, helper) {
        helper.updateOpportunityLineItems(component, event);
        helper.getOpportunityLineItems(component);
    },

    clickReloadDataButton: function (component, event, helper) {
        helper.showToast("error", "button test message");
    },

    clickCancelButton: function (component, event, helper) {
        helper.closePage(component);
    }
})