@isTest
public with sharing class OpportunityProductSearchControllerTest {

    @isTest static void getResultsTest() {


        Map<String, Integer> productMap_1 = new Map<String, Integer>();
        productMap_1.put('TestA', 5);
        productMap_1.put('TestQ', 5);
        productMap_1.put('TestL', 5);

        List<Product2> products_1 = TestDataFactory.createProducts(productMap_1);

        Id opportunityId_1 = TestDataFactory.createOpportunity();
        TestDataFactory.createOppLineItemStandardPB(opportunityId_1, products_1);

        List<OpportunityProductSearchController.SObjectResult> OppLineItems_1 =
                OpportunityProductSearchController.getOpportunityProducts(opportunityId_1, 'Test');
        System.assertEquals(15, OppLineItems_1.size());

        List<OpportunityProductSearchController.SObjectResult> OppLineItems_2 =
                OpportunityProductSearchController.getOpportunityProducts(opportunityId_1, 'TestA');
        System.assertEquals(5, OppLineItems_2.size());

        List<OpportunityProductSearchController.SObjectResult> OppLineItems_3 =
                OpportunityProductSearchController.getOpportunityProducts(opportunityId_1, 'TestF');
        System.assertEquals(0, OppLineItems_3.size());

        List<OpportunityProductSearchController.SObjectResult> OppLineItems_4 =
                OpportunityProductSearchController.getOpportunityProducts(opportunityId_1, '');
        System.assertEquals(15, OppLineItems_4.size());

    }

}