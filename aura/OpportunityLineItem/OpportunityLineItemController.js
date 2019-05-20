({
    doInit: function (component, event, helper) {
        component.set('v.rowId', component.get('v.rowIndex'));
        let fields = component.get('v.fieldSetValues');
        let fieldNames = [];
        let opportunityProduct = component.get('v.opportunityProduct');
        // component.set('v.justOneMoreFieldValue', opportunityProduct[fields[i].name);
        for (let i = 0; i <fields.length ; i++) {
//            console.log('1' + JSON.stringify(fields[i]));
            // console.log('2' + JSON.stringify(opportunityProduct[fields[i].name]));
            fields[i].fieldValue = opportunityProduct[fields[i].name];
            fieldNames.push(fields[i].name);

        }
        console.log('doInit__FIELDS_______________' + fieldNames);

        console.log('doInit__opportunityProduct_______________' + JSON.stringify(opportunityProduct));
        component.set('v.fieldValues', fields);
        component.set('v.fieldNames', fieldNames);
//setTimeout(component.set('v.fieldValues', fields), 500);

        component.set('v.selectRecordName', opportunityProduct.Product2.Name);
    },
    handleChangeProduct: function (component, event, helper) {

        let fields = component.get('v.fieldSetValues');
        let opportunityProduct = component.get('v.opportunityProduct');
        console.log('EVENT__fields_____________' + JSON.stringify(fields));
        console.log('EVENT__opportunityProduct_______________' + JSON.stringify(opportunityProduct));
        for (let i = 0; i <fields.length ; i++) {
  //           console.log('1' + JSON.stringify(fields[i].name));
            // console.log('2' + JSON.stringify(opportunityProduct[fields[i].name]));
            fields[i].fieldValue = opportunityProduct[fields[i].name];
        }
        component.set('v.fieldValues', fields);
    },
})