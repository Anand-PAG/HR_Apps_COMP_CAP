const cds = require('@sap/cds');
class ZHR_COMP_CAP_CRVEXCEP_SRV extends cds.ApplicationService {
    async init() {
        const { BusinessDivisions, TargetTabs, Thresholds, SubZones, CompensationRatioMaster } = this.entities;

        this.on('READ', 'BusinessDivisions', async (req) => {
            return await SELECT.from(BusinessDivisions);
        });

        this.on('CREATE', 'BusinessDivisions', async (req) => {
            console.log(req.data);
            try {
                await INSERT.into(BusinessDivisions).entries({
                    year: req.data.year,
                    custBusUnit: req.data.custBusUnit,
                    custDivision: req.data.custDivision
                });
                return req.data
            } catch (error) {
                console.log(error);
                throw new Error(error);
            }
        });

        this.on('DELETE', 'BusinessDivisions', async (req) => {
            try {
                await DELETE.from(BusinessDivisions).where({
                    ID: req.data.ID,
                    year: req.data.year
                });
                return req.data
            } catch (error) {
                console.log(error);
                throw new Error(error);
            }
        });

        this.on('POST', 'Thresholds', async (req) => {
            try {
                await INSERT.into(BusinessDivisions).entries({
                    year: req.data.year,
                    compaRatioRanges: req.data.compaRatioRanges,
                    startRange: req.data.startRange,
                    endRange: req.data.endRange,
                    sequence: req.data.sequence,
                    fieldUsage: req.data.fieldUsage
                });
                return req.data
            } catch (error) {
                console.log(error);
                throw new Error(error);
            }
        });

        this.on('READ', 'Thresholds', async (req) => {
            return await SELECT.from(Thresholds);
        });

        this.on('POST', 'SubZones', async (req) => {
            try {
                await INSERT.into(SubZones).entries({
                    year: req.data.year,
                    performanceSubZone: req.data.compaRatioRanges,
                    sequence: req.data.sequence,
                    fieldUsage: req.data.fieldUsage
                });
                return req.data
            } catch (error) {
                console.log(error);
                throw new Error(error);
            }
        });

        this.on('READ', 'SubZones', async (req) => {
            return await SELECT.from(SubZones);
        });

        this.on('POST', 'CompensationRatioMaster', async (req) => {
            try {
                await INSERT.into(CompensationRatioMaster).entries({
                    year: req.data.year,
                    performanceSubZone: req.data.compaRatioRanges,
                    payzones: req.data.payzones,
                    compaRatioRanges: req.data.compaRatioRanges,
                    startRange: req.data.startRange,
                    endRange: req.data.endRange,
                    performanceRating: req.data.performanceRating,
                    thresholdFrom: req.data.thresholdFrom,
                    thresholdTo: req.data.thresholdTo,
                    status: req.data.status
                });
                return req.data
            } catch (error) {
                console.log(error);
                throw new Error(error);
            }
        });

        this.on('READ', 'CompensationRatioMaster', async (req) => {
            return await SELECT.from(CompensationRatioMaster);
        });

        this.on('POST', 'TargetTabs', async (req) => {
            try {
                await INSERT.into(TargetTabs).entries({
                    year: req.data.year,
                    Modeltype: req.data.Modeltype,
                    TargetTabName: req.data.TargetTabName,
                    custBusUnit: req.data.custBusUnit,
                    custDivision: req.data.custDivision,
                    fieldUsage: req.data.fieldUsage
                });
                return req.data
            } catch (error) {
                console.log(error);
                throw new Error(error);
            }
        });

        this.on('READ', 'TargetTabs', async (req) => {
            return await SELECT.from(TargetTabs);
        });

        return super.init();
    }
}
module.exports = { ZHR_COMP_CAP_CRVEXCEP_SRV };