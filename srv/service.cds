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
    curSalary     : Decimal(17, 2);
    custBusUnit   : String(80);
    changedStatus : String(1);
    createdBy     : String;
    changedBy     : String;
    fieldUsage    : String(1);

    to_divisions  : many Divisionstype;
}

type targetTotals {
    year          : Integer;
    TargetTabName : String(40);
    curSalary     : Decimal(17, 2);
}

//Raghu added this code
type DeleteTargetTabInput   : {
    year          : Integer;
    Modeltype     : String(10);
    TargetTabName : String(80);
    custBusUnit   : String(80);
}


type Divisionstype {
    ID           : UUID;
    custDivision : String(80);
}

type ModelStatus {
    StatusCode        : String(1);
    StatusDescription : String;
}

type ApprovedData {
    approvedby   : String;
    approvedname : String;
}

type createdData {
    createdBy   : String;
    createdname : String;
}

type Targets {
    targetname : String(80)
}

type ModelId {
    model_Id : String(10);
}

type getdyanamiccolumns : {
    ID               : UUID;
    compaRatioRanges : String(20);
    startRange       : String(3);
    endRange         : String(3);
    thresholdFrom      : Decimal(5, 2);
    thresholdTo        : Decimal(5, 2);
    sequence         : String(3);
};

type getdyanamicModel       : {
    performanceSubZone : String(10);
    payzones           : String(10);
    performanceRating  : String(50);
    sub_zonesequence   : String(3);
    to_columns         : many getdyanamiccolumns;
};


type yearfilter             : Integer;

type Email                  : String(255);

type Role                   : String enum {
    approver;
    publisher;
}

type ToItemInput {
    id             : String;
    text           : String;
    value          : String;
    threshholdfrom : String;
    threshholdto   : String;
    startrange     : String;
    endrange       : String;
    sequence       : String;
  }

  type ToHeaderInput {
    option             : String(10);
    performancesubzone : String;
    payzone            : String;
    rating             : String;
    budget            : String;
    total              : String;
    Indicator          : String;
    sequence           : String;
    to_item            : many ToItemInput;
  }

  type CRVModelPayload {
    TotalDistributed    : String;
    TotalDistributedPct : String;
    RemainingPool       : String;
    ModelId             : String;
    year                : String;
    Targettab           : String;
    RemainingPoolPct    : String;
    to_header           : many ToHeaderInput;
  }


service ZHR_COMP_CAP_CRVEXCEP_SRV {
    entity Thresholds              as projection on compmodel.ZHR_COMP_TBL_THRSHLD_MASTER;
    entity SubZones                as projection on compmodel.ZHR_COMP_TBL_SUBZONE_MASTER;
    entity CompensationRatioMaster as projection on compmodel.ZHR_COMP_TBL_COMPRATIO_MASTER;
    entity CRVException            as projection on compmodel.ZHR_COMP_TBL_CRV_EXPTN_MASTER;
    entity BusinessDivisions       as projection on compmodel.ZHR_COMP_TBL_BUDIV_MASTER;
    entity CRVTargets              as projection on compmodel.ZHR_COMP_TBL_TARGETTABS_MASTER;
    entity CRVDivisions            as projection on compmodel.ZHR_COMP_TBL_BUDIV_GROUP;
    entity crvModelsLaunch         as projection on compmodel.ZHR_COMP_TBL_CRV_MODEL_HEADER;
    entity Persona                 as projection on compmodel.ZHR_COMP_TBL_USER;
    entity NumberRange             as projection on compmodel.ZHR_COMP_CRV_MODEL_NUMBERRANGE;
    entity Constants               as projection on compmodel.ZHR_COMP_TBL_CONSTANTS;
    entity ModelMaster             as projection on compmodel.ZHR_COMP_TBL_MODEL_MASTER;


    // Custom action for bulk insert
    action   insertMultipleThresholds(entries : array of ThresholdInput);
    action   insertMultipleSubzones(entries : array of SubZoneInput);
    action   insertMultipleCompensationRatioMaster(entries : array of CompensationRatioInput);
    action   insertMultipleBusinessDivisions(entries : array of BusinessDivisionInput);
    action   insertMultipleCRVException(entries : array of CRVExceptionInput);
    action   insertMultipleTargetTabs(entries : array of TargetTabsInput);
    action   clearCRVExceptions(indicator : String);
    action   createupsertTargetTabs(nestedpayload : CompTargets);
    action   deleteTargetTab(nestedpayload : DeleteTargetTabInput)          returns Boolean;
    action   createnumberRange(Modeltype : String(10), year : Integer)      returns ModelId;
      action postCRVModel(payload: CRVModelPayload) returns {
    ok       : Boolean;
    message  : String;
    model_Id : String;
  };

    function readCompensationRatioMaster()                                  returns array of CompensationRatioMaster;
    function readTargets(year : yearfilter)                                 returns array of CompTargets;
    function readCRVExceptionMaster()                                       returns array of CRVException;
    function readStatus()                                                   returns array of ModelStatus;
    function readTargetMaster()                                             returns array of Targets;
    function readApprovedby()                                               returns array of ApprovedData;
    function readCreatedby()                                                returns array of createdData;
    function readTargetTotal(year : yearfilter, TargetTabName : String(40)) returns targetTotals;
    function readcreatemodel(year: yearfilter) returns array of getdyanamicModel;


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

annotate ZHR_COMP_CAP_CRVEXCEP_SRV with @cds.server.body_parser.limit: '20000mb';
