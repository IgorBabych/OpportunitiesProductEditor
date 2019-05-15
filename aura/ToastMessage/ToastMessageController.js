({
    handleCloseClick: function (component, event, helper) {
        component.set("v.visible", false);
    },

    componentEvent: function (component, event, helper) {
        var timeout = component.get("v.timeout");
        var updatedExp = event.getParam("contents");
        component.set("v.visible", true);
        component.set("v.contents", updatedExp);

        var toastState = event.getParam("state");
        var toastTheme = component.find("notifyToast");
        var toastIcon = component.find("notifyIcon");

        var iconInitialClasses = 'slds-icon_container slds-m-right_small slds-no-flex slds-align-top ';
        var toastInitialClasses = 'slds-notify slds-notify_toast ';

        switch (toastState) {

            case 'success':
                component.set("v.toastTheme", toastInitialClasses + 'slds-theme_success');
                component.set("v.iconTheme", iconInitialClasses + 'slds-icon-utility-success');
                component.set("v.iconName", "utility:success");
                break;
            case 'warning':
                component.set("v.toastTheme", toastInitialClasses + 'slds-theme_warning');
                component.set("v.iconTheme", iconInitialClasses + 'slds-icon-utility-warning');
                component.set("v.iconName", "utility:warning");
                break;
            case 'error':
                component.set("v.toastTheme", toastInitialClasses + 'slds-theme_error');
                component.set("v.iconTheme", iconInitialClasses + 'slds-icon-utility-error');
                component.set("v.iconName", "utility:error");
                break;
            case 'base':
                component.set("v.toastTheme", toastInitialClasses + 'slds-theme_info');
                component.set("v.iconTheme", iconInitialClasses + 'slds-icon-utility-info');
                component.set("v.iconName", "utility:info");
                break;
        }

        setTimeout(function() { component.set("v.visible", false) }, timeout);
    }
})