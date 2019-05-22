({
    updateComponentFieldValues: function (component, event, helper) {
        let fields = component.get('v.fieldSetValues');
        let fieldNames = [];
        let opportunityProduct = component.get('v.opportunityProduct');
        for (let i = 0; i < fields.length; i++) {
            fields[i].fieldValue = opportunityProduct[fields[i].name];
            fieldNames.push(fields[i].name);
        }

        component.set('v.fieldValues', JSON.parse(JSON.stringify(fields)));
        component.set('v.fieldNames', JSON.parse(JSON.stringify(fieldNames)));
    },

    refreshComponentFieldValues: function (component, event, helper) {

        let fields = component.get('v.fieldValues');
        let opportunityProduct = component.get('v.opportunityProduct');
        for (let i = 0; i < fields.length; i++) {
            fields[i].fieldValue = opportunityProduct[fields[i].name];
        }
        component.set('v.fieldValues', fields);
    },

    refreshInputField: function (component, event, helper) {
        let fieldValue = event.getSource().get("v.value");
        let fieldName = event.getSource().get("v.name");
        let opportunityProduct = component.get('v.opportunityProduct');
        opportunityProduct[fieldName] = fieldValue;

    }
});