({
        handleRemoveLeadButtonClick : function(component, event, helper) {
            var self = this;  // safe reference

            var domEvent = event.getParams().domEvent;
            var bodySpan = domEvent.target.nextSibling;
            var index = bodySpan.dataset.index;
                alert(index);
            helper.removeLead(component, index);

        },

        handleRemoveLeadAnchorClick : function(component, event, helper) {
            var self = this;  // safe reference

            var index = event.target.dataset.index;
            helper.removeLead(component, index);
        }
})