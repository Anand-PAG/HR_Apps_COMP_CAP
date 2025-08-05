using com.compmodel as compmodel from '../db/schema';

type ThresholdInput         : {
    year              : Integer;
    compaRatioRanges  : String(20);
    startRange        : String(3);
    endRange          : String(3);
    performanceRating : String(20);
    sequence          : String(3);
    fieldUsage        : String(1);
};

type SubZoneInput           : {
    year               : Integer;
    performanceSubZone : String(10);
    sequence           : String(3);
    fieldUsage         : String(1);
};

type CompensationRatioInput : {
    year               : Integer;
    performanceSubZone : String(10);
    payzones           : String(10);
    compaRatioRanges   : String(20);
    startRange         : Integer;
    endRange           : Integer;
    performanceRating  : String(50);
    thresholdFrom      : Decimal(5, 2);
    thresholdTo        : Decimal(5, 2);
    status             : String(1);
};

type CRVExceptionInput      : {
    field_id                 : String;
    custPERNR                : String;
    executiveRuleViolation   : String;
    mgrFirstName             : String;
    mgrLastName              : String;
    userName                 : String;
    custHireDate             : Date;
    custBusUnit              : String;
    custDivision             : String;
    custDepartment           : String;
    jobTitle                 : String;
    custPayGradeLevel        : Integer;
    custTargetTab            : String;
    curSalary                : Decimal;
    custCurHrlySalary        : Decimal;
    payGuideMid              : Decimal;
    curRatio                 : Decimal;
    custPerformanceZone      : String;
    custPDScore              : String;
    compaRatioRanges         : String;
    meritGuideline           : Decimal;
    merit                    : Decimal;
    merit_Percentage         : Decimal;
    commentformerit          : String;
    custExceptionCode        : String;
    lumpSum                  : Decimal;
    lumpSum_Percentage       : Decimal;
    finSalary                : Decimal;
    compaRatio               : Decimal;
    custMeritExcepReqAmt     : Decimal;
    custMeritExcepReqPct     : Decimal;
    custfinSalaryExcepReq    : Decimal;
    custCompaRatioExcepReq   : Decimal;
    custMeritExcepReqComment : String;
    salaryNote               : String;
    payAdjustmentAmount      : Decimal;
    payAdjustmentAmountPer   : Decimal;
    payAdjustmentFinalPay    : Decimal;
    status                   : String;
};

type BusinessDivisionInput  : {
    year         : Integer;
    custBusUnit  : String(60);
    custDivision : String(60);
    fieldUsage   : String(1);
};

type TargetTabsInput        : {
    year          : Integer;
    Modeltype     : String(10);
    TargetTabName : String(80);
    custBusUnit   : String(80);
    custDivision  : String;
    fieldUsage    : String(1);
}

type CompTargets {
        ID            : UUID;
        year          : Integer;
        Modeltype     : String(10);
        TargetTabName : String(40);
        custBusUnit   : String(80);
        changedStatus : String(1);
        createdBy     : String;
        changedBy     : String;
        fieldUsage    : String(1);

        to_divisions  : many Divisionstype;
}

type Divisionstype {
        ID           : UUID;
        custDivision : String(80);
}

type yearfilter : Integer;


service ZHR_COMP_CAP_CRVEXCEP_SRV {
    entity Thresholds              as projection on compmodel.ZHR_COMP_TBL_THRSHLD_MASTER;
    entity SubZones                as projection on compmodel.ZHR_COMP_TBL_SUBZONE_MASTER;
    entity CompensationRatioMaster as projection on compmodel.ZHR_COMP_TBL_COMPRATIO_MASTER;
    entity CRVException            as projection on compmodel.ZHR_COMP_TBL_CRV_EXPTN_MASTER;
    entity BusinessDivisions       as projection on compmodel.ZHR_COMP_TBL_BUDIV_MASTER;
    entity CRVTargets                 as projection on compmodel.ZHR_COMP_TBL_TARGETTABS_MASTER;
    entity CRVDivisions               as projection on compmodel.ZHR_COMP_TBL_BUDIV_GROUP;
    // Custom action for bulk insert
    action   insertMultipleThresholds(entries : array of ThresholdInput);
    action   insertMultipleSubzones(entries : array of SubZoneInput);
    action   insertMultipleCompensationRatioMaster(entries : array of CompensationRatioInput);
    action   insertMultipleBusinessDivisions(entries : array of BusinessDivisionInput);
    action   insertMultipleCRVException(entries : array of CRVExceptionInput);
    action   insertMultipleTargetTabs(entries : array of TargetTabsInput);
    action   clearCRVExceptions(indicator:String);
    action   createupsertTargetTabs(nestedpayload:CompTargets);

    function readCompensationRatioMaster() returns array of CompensationRatioMaster;
    function readTargets( year:yearfilter ) returns array of CompTargets;
    function readCRVExceptionMaster() returns array of CRVException;


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

annotate ZHR_COMP_CAP_CRVEXCEP_SRV with @cds.server.body_parser.limit:'20000mb';
