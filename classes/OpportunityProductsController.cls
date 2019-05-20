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
    public static String getFieldSet(String sObjectName, String fieldSetName) {
        String result = '';
        try{
            SObjectType objToken = Schema.getGlobalDescribe().get(sObjectName);
            Schema.DescribeSObjectResult d = objToken.getDescribe();
            Map<String, Schema.FieldSet> FsMap = d.fieldSets.getMap();
            system.debug('>>>>>>> FsMap >>> ' + FsMap);
            if(FsMap.containsKey(fieldSetName))
                for(Schema.FieldSetMember f : FsMap.get(fieldSetName).getFields()) {
                    if(result != ''){
                        result += ',';
                    }
                    String jsonPart = '{';
                    jsonPart += '"label":"' + f.getLabel() + '",';
                    jsonPart += '"required":"' + (f.getDBRequired() || f.getRequired()) + '",';
                    jsonPart += '"type":"' + (f.getType()) + '",';
                    jsonPart += '"name":"' + f.getFieldPath() + '"';
                    jsonPart += '}';
                    result += jsonPart;
                }
        }
        catch(Exception e){
            result += e.getLineNumber() + ' : ' + e.getMessage();
        }
        return '['+result+']';
    }

    @AuraEnabled
    public static String getRecords(String sObjectName, String parentFieldName, String parentRecordId, String fieldNameJson){

        List<sObject> lstResult = new List<sObject>();
        String result = '[]';
        try{
            List<String> fieldNames = (List<String>) JSON.deserialize(fieldNameJson, List<String>.class);
            Set<String> setFieldNames = new Set<String>();
            String query = 'SELECT ' + String.join(fieldNames, ',') + ' FROM ' + sObjectName;
            if(parentFieldName != NULL && parentFieldName != '' && parentRecordId != NULL){
                query += ' WHERE ' + parentFieldName + '= \'' +  parentRecordId + '\'';
            }
            for(sObject s : Database.query(query)){
                lstResult.add(s);
            }
            if(lstResult.size() > 0) {
                result = JSON.serialize(lstResult);
            }
        }
        catch(Exception e){
            result += e.getLineNumber() + ' : ' + e.getMessage();
        }
        System.debug(JSON.serialize(result));
        return result;
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