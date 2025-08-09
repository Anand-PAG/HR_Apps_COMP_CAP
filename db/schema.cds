namespace com.compmodel;

using {
    cuid,
    managed,
} from '@sap/cds/common';

type StatusCode : String(1) enum {
  A; // Approved
  O; // Open
  S; // Submitted
  P; // Published
  R; //Rejected
}

type fieldUsage : String(1) enum {
  A; // Approved
  D; // Open
}

type fieldUsage1 : String(1) enum {
  A; // Active
  O; //Obsolete
  S; // Save
};

//User Management Table
entity ZHR_COMP_TBL_USER {
    key user_email       : String;
    key role             : String;
}

// Threshold Master Table
entity ZHR_COMP_TBL_THRSHLD_MASTER : managed {
    key ID               : UUID;
    key year             : Integer   @assert.range : [
            1000,
            9999
        ];
        //    performanceSubZone : String(10);
        //    payzones           : String(10);
        compaRatioRanges : String(20);
        startRange       : String(3) @assert.format: '^[0-9]{1,3}$';
        endRange         : String(3) @assert.format: '^[0-9]{1,3}$';
        //    performanceRating  : String(20);
        sequence         : String(3) @assert.format: '^[0-9]{1,3}$';
        fieldUsage       : fieldUsage1; //A- Active,O-Obselete,S-Save

}

// SubZone Master Table
entity ZHR_COMP_TBL_SUBZONE_MASTER : managed {
    key ID                 : UUID;
    key year               : Integer   @assert.range : [
            1000,
            9999
        ];
        performanceSubZone : String(10);
        sequence           : String(3) @assert.format: '^[0-9]{1,3}$';
        fieldUsage         : fieldUsage1; //A- Active,O-Obselete,S-Save
}

// Comp Master Table
entity ZHR_COMP_TBL_COMPRATIO_MASTER : managed {
    key ID                 : UUID;
    key year               : Integer   @assert.range: [
            1000,
            9999
        ];
        performanceSubZone : String(10);
        payzones           : String(10);
        compaRatioRanges   : String(20);
        startRange         : Integer;
        endRange           : Integer;
        performanceRating  : String(50); //Performance Rating C,C++
        thresholdFrom      : Decimal(5, 2) default 0.00;
        thresholdTo        : Decimal(5, 2) default 0.00;
        status             : fieldUsage1;
        path               : String;
}

// CRV Exception Master Table
entity ZHR_COMP_TBL_CRV_EXPTN_MASTER : managed {
    key ID                       : UUID;
    key field_id                 : String(40);
    key custPERNR                : String(20);
        executiveRuleViolation   : String(1);
        mgrFirstName             : String(60);
        mgrLastName              : String(60);
        userName                 : String(250);
        custHireDate             : Date;
        custBusUnit              : String(80);
        custDivision             : String(80);
        custDepartment           : String(80);
        custTargetTab            : String(80);
        jobTitle                 : String(80);
        custPayGradeLevel        : Integer default 0;
        curSalary                : Decimal(17, 2) default 0.00;
        custCurHrlySalary        : Decimal(17, 2) default 0.00;
        payGuideMid              : Decimal(17, 2) default 0.00;
        curRatio                 : Decimal(5, 2) @assert.range: [
            0.00,
            100.00
        ] default 0.00;
        custPerformanceZone      : String(10);
        custPDScore              : String(50); //Performance Rating C,C++
        compaRatioRanges         : String(20);
        meritGuideline           : Decimal(3, 2) @assert.range: [
            0.00,
            100.00
        ] default 0.00;
        merit                    : Decimal(17, 2) default 0.00;
        merit_Percentage         : Decimal(5, 2) @assert.range: [
            0.00,
            100.00
        ] default 0.00;
        commentformerit          : String;
        custExceptionCode        : String(200);
        lumpSum                  : Decimal(17, 2) default 0.00;
        lumpSum_Percentage       : Decimal(5, 2) @assert.range: [
            0.00,
            100.00
        ] default 0.00;
        finSalary                : Decimal(17, 2) default 0.00;
        compaRatio               : Decimal(5, 2) @assert.range: [
            0.00,
            500.00
        ] default 0.00;
        custMeritExcepReqAmt     : Decimal(17, 2) default 0.00;
        custMeritExcepReqPct     : Decimal(5, 2) @assert.range: [
            0.00,
            200.00
        ] default 0.00;
        custfinSalaryExcepReq    : Decimal(17, 2) default 0.00;
        custCompaRatioExcepReq   : Decimal(5, 2) @assert.range: [
            0.00,
            200.00
        ] default 0.00;
        payAdjustmentAmount      : Decimal(17, 2) default 0.00;
        payAdjustmentAmountPer   : Decimal(5, 2) @assert.range: [
            0.00,
            200.00
        ] default 0.00;
        payAdjustmentFinalPay    : Decimal(17, 2) default 0.00;
        custMeritExcepReqComment : String;
        salaryNote               : String;
        status                   : StatusCode; //O - Obselete, A- Approved,S-Save,P-Published
        path                     : String;

}

// BU Div Master Table
entity ZHR_COMP_TBL_BUDIV_MASTER : managed {
    key ID           : UUID;
    key year         : Integer   @assert.range: [
            1000,
            9999
        ];
        custBusUnit  : String(60);
        custDivision : String(60);
        fieldUsage   : fieldUsage1; //O - Obselete, A- Active, S-Save
}

// Target Tabs Master Table
entity ZHR_COMP_TBL_TARGETTAB_MASTER : managed {
    key ID            : UUID;
    key year          : Integer    @assert.range: [
            1000,
            9999
        ];
    key Modeltype     : String(10) @assert.enum : [
            'CRV',
            'STIP',
            'RSU'
        ];
    key TargetTabName : String(80);

    key custBusUnit   : String(80);
    key custDivision  : String(80);
        fieldUsage    : fieldUsage1; // A - Active, O - Obsolete, S - Save
}

entity ZHR_COMP_TBL_TARGETTABS_MASTER : managed {
    key year          : Integer   @assert.range: [
            1000,
            9999
        ];
    key ID            : UUID;
    key TargetTabName : String(40);
    key Modeltype     : String(10);
        custBusUnit   : String(80);
        changedStatus : String(1);
        fieldUsage    : fieldUsage1;
}

entity ZHR_COMP_TBL_BUDIV_GROUP {
    key year          : Integer @assert.range: [
            1000,
            9999
        ];
    key ID            : UUID;
    key Modeltype     : String(10);
        custBusUnit   : String(80);
        custDivision  : String(80);
        TargetTabName : String(40);
}


// Update CRV Exception Master Table
@cds.persistence.skip
entity ZHR_COMP_TBL_CRV_EXCEP_FINAL : managed {
    key ID                       : UUID;
    key field_id                 : String;
    key custPERNR                : Integer;
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
        curSalary                : Decimal;
        custCurHrlySalary        : Decimal;
        payGuideMid              : Decimal;
        curRatio                 : Decimal;
        custPerformanceZone      : Integer;
        custPDScore              : String;
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
        custPerformanceSubZone   : String;
        TargetTabName            : String;
        path                     : String;

}

entity ZHR_COMP_CRV_MODEL_NUMBERRANGE : cuid, managed {
    key ID            : UUID;
    key year          : Integer;
    key Modeltype     : String(10);
    rangefrom         : Integer @assert.range: [
            0,
            9999
        ] default 0;
    rangeto           : Integer @assert.range: [
            0,
            9999
        ] default 0;
    currentvalue      : Integer @assert.range: [
            0,
            9999
        ] default 0;
    status            : String(1) @assert.enum : [
            'D',
            'A'
        ]; //D- Draft A-Active
}

// STIP Exception Master Data
@cds.persistence.skip
entity ZHR_COMP_TBL_STIP_EXCEP_MASTER : cuid, managed {
    key ID                          : UUID;
    key field_id                    : String;
        executiveRuleViolation      : String;
        programName                 : String;
        formName                    : String;
        currentlyWith               : String;
        userId                      : Integer;
        empFirstName                : String;
        empLastName                 : String;
        middleName                  : String;
        mgrUserId                   : Integer;
        mgrName                     : String;
        mgrFirstName                : String;
        mgrLastName                 : String;
        localCurrencyCode           : String;
        assignmentTargetAmountTotal : Decimal;
        finalPayout                 : Decimal;
        percentTarget               : Integer;
        varpayNotes                 : String;
        custPERNR                   : Integer;
        custBusUnit                 : String;
        custDivision                : String;
        custDepartment              : String;
        custJobTitle                : String;
        custPayGradeLevel           : Integer;
        custEligibleEarningsSum     : Integer;
        custBonusTgtPct             : Integer;
        custPDScore                 : String;
        custIPMPct                  : Integer;
        custAdjustedSTIPayPct       : Integer;
}

// entity ZHR_COMP_TBL_STIP_EXCEP_MASTER : cuid, managed {
//     key ID            : UUID;
//     key field_id                    : String(30);
//         executiveRuleViolation      : String(1);
//         programName                 : String(40);
//         formName                    : String(60);
//         currentlyWith               : String(15);
//         userId                      : Integer(10);
//         empFirstName                : String;
//         empLastName                 : String;
//         middleName                  : String;
//         mgrUserId                   : Integer;
//         mgrName                     : String;
//         mgrFirstName                : String(60);
//         mgrLastName                 : String(60);
//         localCurrencyCode           : String;
//         assignmentTargetAmountTotal : Decimal;
//         finalPayout                 : Decimal;
//         percentTarget               : Integer(3);
//         varpayNotes                 : String;
//         custPERNR                   : Integer(20);
//         custBusUnit                 : String(60);
//         custDivision                : String(60);
//         custDepartment              : String(60);
//         custJobTitle                : String(30);
//         custPayGradeLevel           : Integer(5);
//         custEligibleEarningsSum     : Integer(10);
//         custBonusTgtPct             : Integer(4);
//         custPDScore                 : String(20);
//         custIPMPct                  : Integer(4);
//         custAdjustedSTIPayPct       : Integer;
// }


// RSU Exception Master Data
@cds.persistence.skip
entity ZHR_COMP_TBL_RSU_EXCEP_MASTER : cuid, managed {
    key ID                      : UUID;
    key field_id                : String;
    key custPERNR               : Integer;
        executiveRuleViolation  : String;
        mgrFirstName            : String;
        mgrLastName             : String;
        userName                : String;
        custBusUnit             : String;
        custDivision            : String;
        custDepartment          : String;
        jobTitle                : String;
        curSalary               : Decimal;
        custPDScore             : String;
        custPerformanceZone     : Integer;
        custTalentPlanningScore : String;
        lumpSum                 : Integer;
        lumpSum_Percentage      : Decimal;
        commentforlumpSum       : String;
        custLTIAwardCurrency    : String;
        salaryNote              : String;
}


// entity ZHR_COMP_TBL_RSU_EXCEP_MASTER : managed {
//     key ID            : UUID;
//     key field_id                : String(30);
//     key custPERNR               : Integer(20);
//         executiveRuleViolation  : String(1);
//         mgrFirstName            : String(60);
//         mgrLastName             : String(60);
//         userName                : String(120);
//         custBusUnit             : String(10);
//         custDivision            : String(60);
//         custDepartment          : String(60);
//         jobTitle                : String(60);
//         curSalary               : Decimal;
//         custPDScore             : String(20);
//         custPerformanceZone     : Integer(10);
//         custTalentPlanningScore : String(20);
//         lumpSum                 : Integer(10);
//         lumpSum_Percentage      : Decimal;
//         commentforlumpSum       : String;
//         custLTIAwardCurrency    : String;
//         salaryNote              : String(260);
// }


// STIP Model Header Table
@cds.persistence.skip
entity ZHR_COMP_TBL_STIP_MODEL_HEADER : cuid, managed {
    key ID          : UUID;
    key year        : Integer;
    key model_Id    : String;
    key modelOption : String;
    key targetTab   : String;
        totalPool   : Decimal;
        totalCost   : Decimal;
        remaning    : Decimal;
        status      : String;
}

// entity ZHR_COMP_TBL_STIP_MODEL_HEADER : managed {
//     key ID            : UUID;
//     key year        : Integer(4);
//     key model_Id    : String(20);
//     key modelOption : String(20);
//     key targetTab   : String(50);
//         totalPool   : Decimal;
//         totalCost   : Decimal;
//         remaning    : Decimal;
//         status      : String(20);
// }

// STIP Model Threshold Table
@cds.persistence.skip
entity ZHR_COMP_TBL_STIP_MODEL_ITEM : cuid, managed {
    key ID                     : UUID;
    key year                   : Integer;
    key model_Id               : String;
    key modelOption            : String;
    key targetTab              : String;
        custPerformancesubZone : Integer;
        payzones               : String;
        custPDScore            : String;
        corpGuidelines         : String;
        empCount               : Integer;
        distribution           : Decimal;
        sumOfTargetpool        : Decimal;
        proposed_IPM1          : Decimal;
        proposed_IPM2          : Decimal;
        Proposed_IPM3          : Decimal;
        cost                   : Integer;
}

// entity ZHR_COMP_TBL_STIP_MODEL_ITEM : managed {
//     key ID            : UUID;
//     key year                   : Integer(4);
//     key model_Id               : String(20);
//     key modelOption            : String(20);
//     key targetTab              : String(50);
//         custPerformancesubZone : Integer(8);
//         payzones               : String(10);
//         custPDScore            : String(20);
//         corpGuidelines         : String(20);
//         empCount               : Integer(5);
//         distribution           : Decimal;
//         sumOfTargetpool        : Decimal;
//         proposed_IPM1          : Decimal;
//         proposed_IPM2          : Decimal;
//         Proposed_IPM3          : Decimal;
//         cost                   : Integer;
// }

// STIP Model Calibration Table
@cds.persistence.skip
entity ZHR_COMP_TBL_STIP_CALIBRATION : cuid, managed {
    key ID                   : UUID;
    key year                 : Integer;
        calibrationName      : String;
        totalBudget          : Decimal;
        totalSpend           : Decimal;
        remaining            : Decimal;
        remaining_Percentage : Decimal;
        employeecount        : Integer;
        custBusUnit          : String;
        custDivision         : String;
        managerName          : String;
        jobTitle             : String;
        custPDScore          : String;
        PerformanceSubZone   : String;
}

// entity ZHR_COMP_TBL_STIP_CALIBRATION : cuid, managed {
//     key ID            : UUID;
//     key year                 : Integer(4);
//         calibrationName      : String(20);
//         totalBudget          : Decimal;
//         totalSpend           : Decimal;
//         remaining            : Decimal;
//         remaining_Percentage : Decimal;
//         employeecount        : Integer(5);
//         custBusUnit          : String(60);
//         custDivision         : String(60);
//         managerName          : String;
//         jobTitle             : String(60);
//         custPDScore          : String(20);
//         PerformanceSubZone   : String(10);
// }

// CRV Model Calibration Table
@cds.persistence.skip
entity ZHR_COMP_TBL_CRV_CALIBRATION : cuid, managed {
    key ID                     : UUID;
    key year                   : Integer;
        calibrationName        : String;
        totalBudget            : Decimal;
        totalSpend             : Decimal;
        annualRemainingPool    : Decimal;
        merit                  : Decimal;
        lumpSum                : Decimal;
        distributed_Percentage : Decimal;
        custBusUnit            : String;
        custDivision           : String;
        managerName            : String;
        jobTitle               : String;
        custPDScore            : String;
        performanceSubZone     : String;
        jbCode                 : String;
        compaRatio             : Decimal;
}

// entity ZHR_COMP_TBL_CRV_CALIBRATION : cuid, managed {
//     key ID            : UUID;
//     key year                   : Integer(4);
//         calibrationName        : String(20);
//         totalBudget            : Decimal;
//         totalSpend             : Decimal;
//         annualRemainingPool    : Decimal;
//         merit                  : Decimal;
//         lumpSum                : Decimal;
//         distributed_Percentage : Decimal;
//         custBusUnit            : String(60);
//         custDivision           : String(60);
//         managerName            : String;
//         jobTitle               : String(60);
//         custPDScore            : String(20);
//         performanceSubZone     : String(10);
//         jobCode                : String(25);
//         compaRatio             : Decimal(6);
// }

// RSU Model Calibration Table
@cds.persistence.skip
entity ZHR_COMP_TBL_RSU_CALIBRATION : cuid, managed {
    key ID               : UUID;
    key year             : Integer;
        calibrationName  : String;
        totalBudget      : Decimal;
        allocatedAward   : Decimal;
        remainingBudget  : Decimal;
        employeeCount    : Decimal;
        businessUnit     : String;
        division         : String;
        jobTitle         : String;
        performanceZone  : Integer;
        PDPScore         : String;
        managerFirstName : String;
}

// entity ZHR_COMP_TBL_RSU_CALIBRATION : cuid, managed {
//     key ID            : UUID;
//     key year             : Integer(4);
//         calibrationName  : String(20);
//         totalBudget      : Decimal;
//         allocatedAward   : Decimal;
//         remainingBudget  : Decimal;
//         employeeCount    : Decimal;
//         custBusUnit      : String(60);
//         custDivision     : String(60);
//         jobTitle         : String(60);
//         performanceZone  : Integer(5);
//         PDPScore         : String(20);
//         mgrFirstName : String;
// }


// CRV Merit Master Table
@cds.persistence.skip
entity ZHR_COMP_TBL_CRV_MERITMASTER : cuid, managed {
    key ID                            : UUID;
    key key1                          : String;
    key key2                          : String;
        compaRatioRanges              : String;
        formulaName                   : String;
        ratioFrom                     : Integer;
        ratioFromInclusive            : String;
        ratioTo                       : Integer;
        ratioToInclusive              : String;
        customCriteria0               : String;
        customCriteria0_value         : String;
        customCriteria0_fromValue     : String;
        customCriteria0_fromInclusive : String;
        customCriteria0_toValue       : String;
        customCriteria0_toInclusive   : String;
        customCriteria1               : String;
        customCriteria1_value         : String;
        customCriteria1_fromValue     : String;
        customCriteria1_fromInclusive : String;
        customCriteria1_toValue       : String;
        customCriteria1_toInclusive   : String;
        customCriteria2               : String;
        customCriteria2_value         : Decimal;
        customCriteria2_fromValue     : String;
        customCriteria2_fromInclusive : String;
        customCriteria2_toValue       : String;
        customCriteria2_toInclusive   : String;
        min                           : Integer;
        low                           : Decimal;
        default                       : Decimal;
        high                          : Decimal;
        max                           : Integer;
}


// entity ZHR_COMP_TBL_CRV_MERITMASTER : cuid, managed {
//     key ID            : UUID;
//     key key1                          : String;
//     key key2                          : String;
//         compaRatioRanges              : String;
//         formulaName                   : String;
//         ratioFrom                     : Integer;
//         ratioFromInclusive            : String;
//         ratioTo                       : Integer;
//         ratioToInclusive              : String;
//         customCriteria0               : String;
//         customCriteria0_value         : String;
//         customCriteria0_fromValue     : String;
//         customCriteria0_fromInclusive : String;
//         customCriteria0_toValue       : String;
//         customCriteria0_toInclusive   : String;
//         customCriteria1               : String;
//         customCriteria1_value         : String;
//         customCriteria1_fromValue     : String;
//         customCriteria1_fromInclusive : String;
//         customCriteria1_toValue       : String;
//         customCriteria1_toInclusive   : String;
//         customCriteria2               : String;
//         customCriteria2_value         : Decimal;
//         customCriteria2_fromValue     : String;
//         customCriteria2_fromInclusive : String;
//         customCriteria2_toValue       : String;
//         customCriteria2_toInclusive   : String;
//         min                           : Integer(4);
//         low                           : Decimal;
//         default                       : Decimal;
//         high                          : Decimal;
//         max                           : Integer(4);
// }

// STIP MeritMaster Table
@cds.persistence.skip
entity ZHR_COMP_TBL_STIP_MERITMASTER : cuid, managed {
    key ID                            : UUID;
    key key1                          : String;
        formulaName                   : String;
        customCriteria0               : String;
        customCriteria0_value         : String;
        customCriteria0_fromValue     : String;
        customCriteria0_fromInclusive : String;
        customCriteria0_toValue       : String;
        customCriteria0_toInclusive   : String;
        customCriteria1               : String;
        customCriteria1_value         : String;
        customCriteria1_fromValue     : String;
        customCriteria1_fromInclusive : String;
        customCriteria1_toValue       : String;
        customCriteria1_toInclusive   : String;
        customCriteria2               : String;
        customCriteria2_value         : Decimal;
        customCriteria2_fromValue     : String;
        customCriteria2_fromInclusive : String;
        customCriteria2_toValue       : String;
        customCriteria2_toInclusive   : String;
        min                           : Integer;
        low                           : Integer;
        default                       : Integer;
        high                          : Integer;
        max                           : Integer;
}


// entity ZHR_COMP_TBL_STIP_MERITMASTER : cuid, managed {
//     key ID            : UUID;
//     key key1                          : String;
//         formulaName                   : String;
//         customCriteria0               : String;
//         customCriteria0_value         : String;
//         customCriteria0_fromValue     : String;
//         customCriteria0_fromInclusive : String;
//         customCriteria0_toValue       : String;
//         customCriteria0_toInclusive   : String;
//         customCriteria1               : String;
//         customCriteria1_value         : String;
//         customCriteria1_fromValue     : String;
//         customCriteria1_fromInclusive : String;
//         customCriteria1_toValue       : String;
//         customCriteria1_toInclusive   : String;
//         customCriteria2               : String;
//         customCriteria2_value         : Decimal;
//         customCriteria2_fromValue     : String;
//         customCriteria2_fromInclusive : String;
//         customCriteria2_toValue       : String;
//         customCriteria2_toInclusive   : String;
//         min                           : Integer;
//         low                           : Integer;
//         default                       : Integer;
//         high                          : Integer;
//         max                           : Integer;
// }


// CRV Model Header Table
entity ZHR_COMP_TBL_CRV_MODEL_HEADER : cuid, managed {
    key ID                          : UUID;
    key year                        : Integer;
    key model_Id                    : String(10);
        //key modelOption                   : String;
    key targetTab                   : String(80);
    key modelOption                 : String(10);
        totalsalary                 : Decimal(17, 2) default 0.00;
        pool                        : Decimal;
        pool_available              : Decimal(17, 2) default 0.00;
        totalDistributed            : Decimal(17, 2) default 0.00;
        totalDistrubuted_Percentage : Decimal(3, 2)  @assert.range: [
            0.00,
            100.00
        ] default 0.00;
        remainingPool               : Decimal(17, 2) default 0.00;
        remainingPool_Percentage    : Decimal(3, 2)  @assert.range: [
            0.00,
            100.00
        ] default 0.00;
        remainingPoolbalance        : Decimal(17, 2) default 0.00;
        approvedby                  : String;
        approvedname                : String;
        publishedby                 : String;
        publishedname               : String;
        changedname                 : String;
        createdname                 : String;
        approvedon                  : Date;
        approvedcomments            : String;
        publishedon                 : Date;
        publishedcomments           : String;
        status                      : StatusCode; //O - Obselete, A- Approved,S-Save,P-Published

        // Composition to ZHR_COMP_TBL_CRV_MODEL_THRSHLD_HEADER
        to_ThresholdHeaders         : Composition of many ZHR_COMP_TBL_CRV_MODEL_THRSHLD_HEADER
                                          on  to_ThresholdHeaders.year      = year
                                          and to_ThresholdHeaders.model_Id  = model_Id
                                          and to_ThresholdHeaders.targetTab = targetTab;
}

// CRV Model Threshold Table
entity ZHR_COMP_TBL_CRV_MODEL_THRSHLD_HEADER : cuid, managed {
    key ID                     : UUID;
    key year                   : Integer   @assert.range: [
            1000,
            9999
        ];
    key model_Id               : String(10);
    key targetTab              : String(80);
    key custPerformancesubZone : String(10);
    key modelOption            : String(10);
        payzones               : String(10);
        custPDScore            : String(50);
        count                  : Integer default 0;
        totalBudget            : Decimal(17, 2) default 0.00;
        totalCost              : Decimal(17, 2) default 0.00;
        indicator              : String(1);
        status                 : StatusCode; //O - Obselete, A- Approved,S-Save,P-Published

        //Composition to ZHR_COMP_TBL_CRV_MODEL_THRSHLD_ITEM
        to_ThresholdItems      : Composition of many ZHR_COMP_TBL_CRV_MODEL_THRSHLD_ITEM
                                     on  to_ThresholdItems.year        = year
                                     and to_ThresholdItems.model_Id    = model_Id
                                     and to_ThresholdItems.modelOption = modelOption
                                     and to_ThresholdItems.targetTab   = targetTab;
}

// Dynamic Column Value Table
entity ZHR_COMP_TBL_CRV_MODEL_THRSHLD_ITEM : cuid, managed {
    key ID                     : UUID;
    key year                   : Integer   @assert.range : [
            1000,
            9999
        ];
    key model_Id               : String(10);
    key modelOption            : String(10);
    key targetTab              : String(80);
    key custPerformancesubZone : String(10);
    key payzones               : String(10);
    key custPDScore            : String(50);
    key threshold_Id           : UUID;
        value                  : Decimal(5, 2) default 0.00;
        sequence               : String(3) @assert.format: '^[0-9]{1,3}$';
        percentage_val_from    : Integer default 0;
        percentage_val_to      : Integer default 0;
        percentage_text        : String(50);
        fieldUsage             : fieldUsage;
        status                 : StatusCode; //O - Obselete, A- Approved,S-Save,P-Published
}

// Model Master Table
@cds.persistence.skip
entity ZHR_COMP_TBL_MODEL_MASTER : cuid, managed {
    key ID                   : UUID;
    key year                 : Integer;
    key model_Id             : String;
    key appType              : String;
        approved_rejected_by : String;
        approved_rejected_on : String;
        published_by         : String;
        published_on         : String;
        usage                : String;
}
