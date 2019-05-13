public with sharing class OpportunityProductsController {
    @AuraEnabled
    public static List<OpportunityLineItem> getOpportunityLineItems(String oppId) {

    List<OpportunityLineItem> oppLineItem = new List<OpportunityLineItem>(
        [
                SELECT Id, OpportunityId, Product2Id, Product2.Name, Quantity, UnitPrice, ServiceDate, Description
                FROM OpportunityLineItem
                WHERE OpportunityId =: oppId
        ]
        );
        return oppLineItem;
    }

    @AuraEnabled
    public static void upsertOpportunityLineItems(List<OpportunityLineItem> oppLineItem) {

        upsert oppLineItem;
    }

    @AuraEnabled
    public static void deleteOpportunityLineItems(List<OpportunityLineItem> oppLineItem) {

        delete oppLineItem;
    }

}