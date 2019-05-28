public class LookupSearchComponentController {

    @AuraEnabled
    public static List<SObJectResult> getResults(String ObjectName, String fieldName, String value) {
        List<SObJectResult> sObjectResultList = new List<SObJectResult>();
        String value1 = '%' + value + '%';
        for(PricebookEntry so : [SELECT Id, UnitPrice, Product2.Id, Product2.Name, Pricebook2Id
        FROM PricebookEntry
        WHERE Pricebook2Id In (SELECT Pricebook2Id FROM Opportunity WHERE Id = '0062p00000z6jqGAAQ') AND Name LIKE : value1]) {
            String fieldvalue = so.Product2.Name;
            sObjectResultList.add(new SObjectResult(fieldvalue, so.Id));
        }

        return sObjectResultList;
    }

    public class SObJectResult {
        @AuraEnabled
        public String recName;
        @AuraEnabled
        public Id recId;

        public SObJectResult(String recNameTemp, Id recIdTemp) {
            recName = recNameTemp;
            recId = recIdTemp;
        }
    }
}