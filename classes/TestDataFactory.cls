@isTest

public class TestDataFactory {
    public static List<Product2> createProducts(Integer numProducts, String productName) {
        List<Product2> products = new List<Product2>();

        for (Integer i = 0; i < numProducts; i++) {
            Product2 p = new Product2(
                    Name = productName + ' Index ' + i,
                    IsActive = true);
            products.add(p);
        }
        insert products;
        return products;
    }


    public static List<Product2> createProducts(Map<String, Integer> productsMap) {
        List<Product2> products = new List<Product2>();


        for (String prod : productsMap.keySet()){

        for (Integer i = 0; i < productsMap.get(prod); i++) {
            Product2 p = new Product2(
                    Name = prod + ' Index ' + i,
                    IsActive = true);
            products.add(p);
        }

        }
        insert products;
        return products;

    }



    public static Id createCustomPricebook() {

        Pricebook2 pricebook = new Pricebook2(
                Name = 'TestPricebook',
                IsActive = true
        );
        insert pricebook;
        return pricebook.Id;
    }

    public static Id createOpportunity() {

        Opportunity opportunity = new Opportunity(
                Name = 'TestOpportunity',
                StageName =  'TestOpportunity',
                CloseDate =  System.today()
        );
        insert opportunity;
        return opportunity.Id;
    }

    public static void createPricebookEntries(Id pricebookId, List<Product2> productsList) {
        List<PricebookEntry> pricebookStandardEntries = new List<PricebookEntry>();
        List<PricebookEntry> pricebookCustomEntries = new List<PricebookEntry>();
        Id standardPricebookId = Test.getStandardPricebookId();

        List<Product2> productsToStandardAndCustomPricebook = [
                SELECT Id, Name
                FROM Product2
                WHERE Id NOT IN (
                        SELECT Product2Id
                        FROM PricebookEntry
                        WHERE Product2Id
                                IN:productsList
                )
                AND Id
                        IN:productsList
        ];

        List<Product2> productsToCustomPricebook = [
                SELECT Id, Name
                FROM Product2
                WHERE Id
                        NOT IN (
                                SELECT Product2Id
                                FROM PricebookEntry
                                WHERE Pricebook2Id = :pricebookId
                        )
                AND Id
                        IN (
                                SELECT Product2Id
                                FROM PricebookEntry
                                WHERE Pricebook2Id = :standardPricebookId
                        )
        ];

        for (Integer i = 0; i < productsToStandardAndCustomPricebook.size(); i++) {
            if(pricebookId !=standardPricebookId) {
                PricebookEntry standardEntry = new PricebookEntry(
                        IsActive = true,
                        Pricebook2Id = standardPricebookId,
                        Product2Id = productsToStandardAndCustomPricebook[i].Id,
                        UnitPrice = 1000.0);
                pricebookStandardEntries.add(standardEntry);
            }
            PricebookEntry customEntry = new PricebookEntry(
                    IsActive = true,
                    Pricebook2Id = pricebookId,
                    Product2Id = productsToStandardAndCustomPricebook[i].Id,
                    UnitPrice = 1000.0
            );
            pricebookCustomEntries.add(customEntry);
        }

        for (Integer i = 0; i < productsToCustomPricebook.size(); i++) {
            PricebookEntry customEntry = new PricebookEntry(
                    IsActive = true,
                    Pricebook2Id = pricebookId,
                    Product2Id = productsToCustomPricebook[i].Id,
                    UnitPrice = 1000.0
            );
            pricebookCustomEntries.add(customEntry);
        }

        insert pricebookStandardEntries;
        insert pricebookCustomEntries;
    }

    public static void createOppLineItemStandardPB(Id opportunityId, List<Product2> productsList) {
        List<OpportunityLineItem> opportunityLineItems = new List<OpportunityLineItem>();
        Id pricebookId = Test.getStandardPricebookId();
        createPricebookEntries(pricebookId, productsList);

        Opportunity opportunity = [
                SELECT Id, Pricebook2Id
                FROM Opportunity
                WHERE Id = :opportunityId
        ];
        opportunity.Pricebook2Id = pricebookId;
        update opportunity;

        for (Integer i = 0; i < productsList.size(); i++) {
            OpportunityLineItem oppLnItm = new OpportunityLineItem(
                    OpportunityId = opportunityId,
                    Product2Id = productsList[i].Id,
                    Quantity = 1,
                    TotalPrice = 1000
            );
            opportunityLineItems.add(oppLnItm);
        }
        System.debug('Standard' + JSON.serializePretty(opportunityLineItems));
        insert opportunityLineItems;
    }

    public static void createOppLineItemCustomPB(Id opportunityId, List<Product2> productsList) {
        List<OpportunityLineItem> opportunityLineItems = new List<OpportunityLineItem>();
        Id pricebookId = createCustomPricebook();
        createPricebookEntries(pricebookId, productsList);

        Opportunity opportunity = [
                SELECT Id, Pricebook2Id
                FROM Opportunity
                WHERE Id = :opportunityId
        ];
        opportunity.Pricebook2Id = pricebookId;
        update opportunity;

        for (Integer i = 0; i < productsList.size(); i++) {
            OpportunityLineItem oppLnItm = new OpportunityLineItem(
                    OpportunityId = opportunityId,
                    Product2Id = productsList[i].Id,
                    Quantity = 1,
                    TotalPrice = 1000
            );
            opportunityLineItems.add(oppLnItm);
        }

        System.debug('Custom' + JSON.serializePretty(opportunityLineItems));
        insert opportunityLineItems;
    }
}