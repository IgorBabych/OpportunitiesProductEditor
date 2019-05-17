({
    doInit : function(component, event, helper) {
        helper.doInit(component, event, helper);
    },

    handleInputFieldChange : function(component, event, helper) {
        helper.doInit(component, event, helper);
    },

    rerenderTable : function(component, event, helper) {
        console.log('rerenderTable = ' + JSON.stringify(component.get('v.record')));
        console.log('cellValue = ' + JSON.stringify(component.get('v.cellValue')));
        helper.doInit(component, event, helper);
    }
})