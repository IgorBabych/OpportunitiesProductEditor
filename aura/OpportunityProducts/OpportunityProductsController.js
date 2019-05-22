({
    doInit: function (component, event, helper) {
        helper.updateParentRecordId(component);
        helper.getTableFieldSet(component, event, helper);
    },

    clickSaveButton: function (component, event, helper) {
        helper.updateOpportunityLineItems(component, event);
        helper.closePage(component);
    },

    clickCancelButton: function (component, event, helper) {
        helper.closePage(component);
    }
});