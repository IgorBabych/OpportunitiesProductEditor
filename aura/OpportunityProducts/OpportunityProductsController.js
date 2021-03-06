({
    doInit: function (component, event, helper) {
        helper.updateParentRecordId(component);
        helper.getTableFieldSet(component, event, helper);
    },

    clickSaveButton: function (component, event, helper) {
        helper.updateOpportunityLineItems(component, event);
        helper.closePage(component);
        $A.get('e.force:refreshView').fire();

    },

    clickCancelButton: function (component, event, helper) {
        helper.closePage(component);
    }
});