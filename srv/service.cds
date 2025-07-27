using com.compmodel as compmodel from '../db/schema';

service ZHR_COMP_CAP_CRVEXCEP_SRV {
    entity Thresholds as projection on compmodel.ZHR_COMP_TBL_THRSHLD_MASTER;
    entity SubZones as projection on compmodel.ZHR_COMP_TBL_SUBZONE_MASTER;
    entity CompensationRatioMaster as projection on compmodel.ZHR_COMP_TBL_COMPRATIO_MASTER;  
    entity CRVException as projection on compmodel.ZHR_COMP_TBL_CRV_EXPTN_MASTER;
    entity BusinessDivisions as projection on compmodel.ZHR_COMP_TBL_BUDIV_MASTER;
    entity TargetTabs as projection on compmodel.ZHR_COMP_TBL_TARGETTAB_MASTER;
    //entity CRV_EXCEP_FINAL as projection on compmodel.ZHR_COMP_TBL_CRV_EXCEP_FINAL;
    //entity STIP_EXCEP as projection on compmodel.ZHR_COMP_TBL_STIP_EXCEP_MASTER;
   // entity RSU_EXCEP as projection on compmodel.ZHR_COMP_TBL_RSU_EXCEP_MASTER;
    //entity STIP_MODEL_HEADER as projection on compmodel.ZHR_COMP_TBL_STIP_MODEL_HEADER;
   // entity STIP_MODEL_ITEM as projection on compmodel.ZHR_COMP_TBL_STIP_MODEL_ITEM;
   // entity STIP_CALIBRATION as projection on compmodel.ZHR_COMP_TBL_STIP_CALIBRATION;
   // entity CRV_CALIBRATION as projection on compmodel.ZHR_COMP_TBL_CRV_CALIBRATION;
   // entity RSU_CALIBRATION as projection on compmodel.ZHR_COMP_TBL_RSU_CALIBRATION;
   // entity CRV_MERIT as projection on compmodel.ZHR_COMP_TBL_CRV_MERITMASTER;
  //  entity STIP_MERIT as projection on compmodel.ZHR_COMP_TBL_STIP_MERITMASTER;
   // entity CRV_MODEL_HEADER as projection on compmodel.ZHR_COMP_TBL_CRV_MODEL_HEADER;
   // entity CRV_MODEL_THRSHLD_HEADER as projection on compmodel.ZHR_COMP_TBL_CRV_MODEL_THRSHLD_HEADER;
   // entity CRV_MODEL_THRSHLD_ITEM as projection on compmodel.ZHR_COMP_TBL_CRV_MODEL_THRSHLD_ITEM;
}