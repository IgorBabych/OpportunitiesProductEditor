@isTest
private class OpportunityProductsControllerTest {

    @isTest static void getOpportunityLineItemsTest() {

        String sObjectName = 'OpportunityLineItem';
        String parentFieldName = 'OpportunityId';
        String fieldNameJson = '["Product2Id","Product2.Name","Quantity","UnitPrice","ServiceDate","Description","TestField__c"]';

        List<Product2> products_1 = TestDataFactory.createProducts(20, 'TestProduct1_');
        Id opportunityId_1 = TestDataFactory.createOpportunity();
        TestDataFactory.createOppLineItemStandardPB(opportunityId_1, products_1);
        String records = OpportunityProductsController.getRecords(sObjectName, parentFieldName, opportunityId_1, fieldNameJson);
        List<OpportunityLineItem> OppLineItems = (List<OpportunityLineItem>) JSON.deserialize(records, List<OpportunityLineItem>.class);
        System.assertEquals(20, OppLineItems.size());

        List<Product2> products_2 = TestDataFactory.createProducts(10, 'TestProduct2_');
        Id opportunityId_2 = TestDataFactory.createOpportunity();
        TestDataFactory.createOppLineItemCustomPB(opportunityId_2, products_2);

        String records_2 = OpportunityProductsController.getRecords(sObjectName, parentFieldName, opportunityId_2, fieldNameJson);
        List<OpportunityLineItem> OppLineItems_2 = (List<OpportunityLineItem>) JSON.deserialize(records_2, List<OpportunityLineItem>.class);
        System.assertEquals(10, OppLineItems_2.size());


        products_1.addAll(products_2);
        TestDataFactory.createOppLineItemStandardPB(opportunityId_1, products_1);
        String records_3 = OpportunityProductsController.getRecords(sObjectName, parentFieldName, opportunityId_1, fieldNameJson);

        List<OpportunityLineItem> OppLineItems_3 = (List<OpportunityLineItem>) JSON.deserialize(records_3, List<OpportunityLineItem>.class);
        System.assertEquals(50, OppLineItems_3.size());


        Id opportunityId_3 = TestDataFactory.createOpportunity();
        String records_4  = OpportunityProductsController.getRecords(sObjectName, parentFieldName, opportunityId_3, fieldNameJson);
        List<OpportunityLineItem> OppLineItems_4 = (List<OpportunityLineItem>) JSON.deserialize(records_4, List<OpportunityLineItem>.class);
        System.assertEquals(0, OppLineItems_4.size());

    }


    @isTest static void deleteOpportunityLineItemsTest() {

        List<Product2> products_1 = TestDataFactory.createProducts(20, 'TestA');
        Id opportunityId_1 = TestDataFactory.createOpportunity();
        TestDataFactory.createOppLineItemStandardPB(opportunityId_1, products_1);
        List<OpportunityLineItem> opportunityLineItems_1 = [
                SELECT Id
                FROM OpportunityLineItem
                WHERE OpportunityId = :opportunityId_1];

        List<Product2> products_2 = TestDataFactory.createProducts(10, 'TestB');
        Id opportunityId_2 = TestDataFactory.createOpportunity();
        TestDataFactory.createOppLineItemStandardPB(opportunityId_2, products_2);

        System.assertEquals(30, [
                SELECT COUNT()
                FROM OpportunityLineItem
                WHERE Name
                        LIKE 'Test%'
        ]);

        OpportunityProductsController.deleteOpportunityLineItems(opportunityLineItems_1);

        System.assertEquals(0, [
                SELECT COUNT()
                FROM OpportunityLineItem
                WHERE Name
                        LIKE 'Test%a%'
        ]);
        System.assertEquals(10, [
                SELECT COUNT()
                FROM OpportunityLineItem
                WHERE Name
                        LIKE 'Test%b%'
        ]);
    }

}