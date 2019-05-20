({
    doInit: function (component, event, helper) {
        helper.getOpportunityLineItems(component);
        helper.getTableFieldSet(component, event, helper);
    },

    handleChangeProduct: function (component, event, helper) {
        console.log('___handleChangeProduct Opportunity product helper v.tableRecords ' + JSON.stringify(component.get('v.tableRecords')));
        component.get('v.tableRecords', []);
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
    },

    handleChangeProduct: function (component, event, helper) {

    }
})