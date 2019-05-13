public class OpportunityProductSearchController {

    @AuraEnabled
    public static List<SObjectResult> getOpportunityProducts(String opportunityId, String value) {

        List<SObjectResult> sObjectResultList = new List<SObjectResult>();

        value = '%' + value + '%';

        List<PricebookEntry> pricebookProducts = new List<PricebookEntry>();

        pricebookProducts = [
                SELECT Id,
                        UnitPrice,
                        Product2.Id,
                        Product2.Name,
                        Pricebook2Id
                FROM PricebookEntry
                WHERE Pricebook2Id
                        IN (
                                SELECT Pricebook2Id
                                FROM Opportunity
                                WHERE Id = :opportunityId
                        ) AND Name
                        LIKE :value
                LIMIT 25
        ];

        for (PricebookEntry so : pricebookProducts) {
            String productName = so.Product2.Name;
            Id productId = so.Product2.Id;
            Decimal productPrice = so.UnitPrice;
            sObjectResultList.add(new SObjectResult(productName, productId, productPrice));
        }

        return sObjectResultList;
    }

    public class SObjectResult {
        @AuraEnabled
        public String recName;
        @AuraEnabled
        public Decimal recPrice;
        @AuraEnabled
        public Id recId;

        public SObjectResult(String recNameTemp, Id recIdTemp, Decimal recPriceTemp) {
            recName = recNameTemp;
            recId = recIdTemp;
            recPrice = recPriceTemp;
        }
    }
}