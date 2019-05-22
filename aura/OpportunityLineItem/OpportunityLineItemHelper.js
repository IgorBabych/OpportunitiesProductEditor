({
    updateComponentCells: function (component, event, helper) {
        let fields = component.get('v.fieldSetValues');
        let opportunityProduct = component.get('v.opportunityProduct');
        let cells = JSON.parse(JSON.stringify(fields));

        for (let i = 0; i < cells.length; i++) {
            cells[i].fieldValue = opportunityProduct[fields[i].name];
            if (cells[i].required === "false"
                || cells[i].required === ""){
                cells[i].required = false
            }
            if (cells[i].required === "true"){
                cells[i].required = true
            }
        }
        component.set('v.cells', cells);
    },

    refreshComponentcells: function (component, event, helper) {
        let fields = component.get('v.cells');
        let opportunityProduct = component.get('v.opportunityProduct');
        for (let i = 0; i < fields.length; i++) {
            fields[i].fieldValue = opportunityProduct[fields[i].name];
        }
        component.set('v.cells', fields);
    },

    updateDataToRecord: function (component, event, helper) {
        let fieldValue = event.getSource().get("v.value");
        let fieldName = event.getSource().get("v.name");
        let opportunityProduct = component.get('v.opportunityProduct');
        opportunityProduct[fieldName] = fieldValue;

    }
});