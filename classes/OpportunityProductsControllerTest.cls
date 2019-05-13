@isTest
private class OpportunityProductsControllerTest {

    @isTest static void getOpportunityLineItemsTest() {

        List<Product2> products_1 = TestDataFactory.createProducts(20, 'TestProduct1_');
        Id opportunityId_1 = TestDataFactory.createOpportunity();
        TestDataFactory.createOppLineItemStandardPB(opportunityId_1, products_1);

        List<OpportunityLineItem> OppLineItems = OpportunityProductsController.getOpportunityLineItems(opportunityId_1);
        System.assertEquals(20, OppLineItems.size());

        List<Product2> products_2 = TestDataFactory.createProducts(10, 'TestProduct2_');
        Id opportunityId_2 = TestDataFactory.createOpportunity();
        TestDataFactory.createOppLineItemCustomPB(opportunityId_2, products_2);

        List<OpportunityLineItem> OppLineItems_2 = OpportunityProductsController.getOpportunityLineItems(opportunityId_2);
        System.assertEquals(10, OppLineItems_2.size());


        products_1.addAll(products_2);
        TestDataFactory.createOppLineItemStandardPB(opportunityId_1, products_1);
        List<OpportunityLineItem> OppLineItems_3 = OpportunityProductsController.getOpportunityLineItems(opportunityId_1);
        System.assertEquals(50, OppLineItems_3.size());


        Id opportunityId_3 = TestDataFactory.createOpportunity();
        List<OpportunityLineItem> OppLineItems_4 = OpportunityProductsController.getOpportunityLineItems(opportunityId_3);
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