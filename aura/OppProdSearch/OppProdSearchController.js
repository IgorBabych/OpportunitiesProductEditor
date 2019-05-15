({
    searchFieldController: function (component, event, helper) {
        helper.searchField(component, event);
    },

    selectedRecordController: function (component, event, helper) {
        helper.setSelectedRecord(component, event);
    },

    closeIconController: function (component, event, helper) {
        helper.resetData(component, event);
    },

})