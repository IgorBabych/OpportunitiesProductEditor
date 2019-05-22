({
    doInit: function (component, event, helper) {
        helper.updateComponentFieldValues(component, event);
    },

    handleSelectedProductEvent: function (component, event, helper) {
        helper.refreshComponentFieldValues(component, event);
    },

    handleInputField: function (component, event, helper){
        helper.refreshInputField(component, event, helper);
    }

});