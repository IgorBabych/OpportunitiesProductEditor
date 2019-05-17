({
    doInit: function (component, event, helper) {
        helper.getOpportunityLineItems(component);
        helper.getTableFieldSet(component, event, helper);
        console.log('1 tableRecords = ' + JSON.stringify(component.get('v.tableRecords')));
    },

    handleChangeProduct: function (component, event, helper) {
        console.log('2 tableRecords = ' + JSON.stringify(component.get('v.tableRecords')));
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
    }
})