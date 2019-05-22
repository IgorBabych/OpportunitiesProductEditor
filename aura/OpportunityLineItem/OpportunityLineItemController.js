({
    doInit: function (component, event, helper) {
        helper.updateComponentCells(component, event);
    },

    handleSelectedProductEvent: function (component, event, helper) {
        helper.refreshComponentcells(component, event);
    },

    handleInputField: function (component, event, helper){
        helper.updateDataToRecord(component, event, helper);
    }

});