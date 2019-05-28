({
    removeLead : function(component, index) {
        var leads = component.get("v.expenses");

        leads.splice(index, 1);
        component.set("v.expenses", leads);

    }
})