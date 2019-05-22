
({
        doInit: function (component, event, helper) {
            let fieldValue = component.get('v.fieldValue');
            let field = JSON.parse(JSON.stringify(fieldValue));
            component.set('v.field', field);
        },

        handleChangeProduct: function (component, event, helper) {
            let price = event.getParam('UnitPrice');
            console.log('handleChangeProduct_______________InputCell' + price);

        }
});