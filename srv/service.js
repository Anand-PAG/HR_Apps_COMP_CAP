const cds = require('@sap/cds');
const XLSX = require('xlsx');
const Sftpclient = require('ssh2-sftp-client');
const csv = require('csv-parser');
const fs = require('fs');


class ZHR_COMP_CAP_CRVEXCEP_SRV extends cds.ApplicationService {

  async init() {

    const { BusinessDivisions, CRVTargets, CRVDivisions, Thresholds, SubZones, CompensationRatioMaster, CRVException } = this.entities;

    function extractPathFromWhere(where) {
      if (!where) return null;
      const index = where.findIndex(item => item.ref?.[0] === 'path');
      if (index > -1 && where[index + 1] === '=' && where[index + 2]?.val) {
        return where[index + 2].val;
      }
      return null;
    }

    this.on('READ', CompensationRatioMaster, async (req) => {
      const where = req.query.SELECT?.where;
      const filterPath = extractPathFromWhere(where);
      console.log("Extracted filter path:", filterPath);

      if (!filterPath) {
        return req.reject(400, 'Missing path query parameter');
      }



      console.log('Requested path:', filterPath);
      const sftp = new Sftpclient();
      const config = {
        host: 'sftp8.sapsf.com',
        port: '22',
        username: 'southernca',
        password: 'LhkkP5dXyAxN',
      };

      try {
        await sftp.connect(config);

        const fileList = await sftp.list(filterPath);
        console.log('Files in SFTP path:', fileList.map(f => f.name));

        const firstFile = fileList.find(file => file.type === '-');
        if (!firstFile) {
          console.log('No regular files found in folder.');
          await sftp.end();
          return [];
        }

        const filePath = `${filterPath}/${firstFile.name}`;
        const fileBuffer = await sftp.get(filePath);
        await sftp.end();

        const workbook = XLSX.read(fileBuffer, { type: 'buffer', raw: true });
        const allData = [];

        for (const sheetName of workbook.SheetNames) {
          const sheet = workbook.Sheets[sheetName];
          const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

          if (rows.length < 2) continue; // 1 header row + at least 1 data row

          const headers = rows[0]; // use first row as headers
          const dataRows = rows.slice(1); // data starts from second row

          for (const row of dataRows) {
            const entry = {};
            headers.forEach((key, idx) => {
              entry[key] = row[idx] ?? null;
            });
            allData.push(entry);
          }
        }

        console.log("allData", allData);
        const finalData = allData.map((r) => ({
          ID: cds.utils.uuid(),
          year: r.year,
          performanceSubZone: r.performanceSubZone || 0,
          payzones: r.payzones,
          compaRatioRanges: r.compaRatioRanges,
          startRange: parseFloat(r.startRange) || 0,
          endRange: parseFloat(r.endRange) || 0,
          performanceRating: r.performanceRating,
          thresholdFrom: r.thresholdFrom || 0,
          thresholdTo: r.thresholdTo || 0,
        }));

        console.log('Final data length:', finalData.length);
        return finalData;
      } catch (err) {
        console.error('SFTP Error:', err.message);
        return req.error(500, 'Failed to read SFTP file');
      } finally {
        sftp.end();
      }
    });

    this.on('READ', CRVException, async (req) => {
      const where = req.query.SELECT?.where;
      const filterPath = extractPathFromWhere(where);


      if (!filterPath) {
        return req.reject(400, 'Missing path query parameter');
      }

      console.log('Requested path:', filterPath);
      const sftp = new Sftpclient();
      const config = {
        host: 'sftp8.sapsf.com',
        port: '22',
        username: 'southernca',
        password: 'LhkkP5dXyAxN',
      };

      try {
        await sftp.connect(config);

        const fileList = await sftp.list(filterPath);
        //console.log('Files in SFTP path:', fileList.map(f => f.name));

        const firstFile = fileList.find(file => file.type === '-');
        if (!firstFile) {
          //console.log('No regular files found in folder.');
          await sftp.end();
          return [];
        }

        const filePath = `${filterPath}/${firstFile.name}`;
        const fileBuffer = await sftp.get(filePath);
        await sftp.end();

        const workbook = XLSX.read(fileBuffer, { type: 'buffer', raw: true });
        const allData = [];

        for (const sheetName of workbook.SheetNames) {
          const sheet = workbook.Sheets[sheetName];
          const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
          //console.log("this is rows");
          //console.log(rows);

          if (rows.length < 3) continue;

          const headers = rows[1]; // 2nd row = field IDs
          const dataRows = rows.slice(2); // actual data
          console.log(dataRows);
          for (const row of dataRows) {
            const entry = {};
            headers.forEach((key, idx) => {
              entry[key] = row[idx] ?? null;
            });
            allData.push(entry);
          }
        }
        console.log("allData", allData);
        //const Percentage = "%merit";
        //console.log("#####",Percentage.valueOf());
        const finalData = allData.map((r) => ({

          field_id: cds.utils.uuid(),
          executiveRuleViolation: r.executiveRuleViolation || '',
          mgrFirstName: r.mgrFirstName || '',
          mgrLastName: r.mgrLastName || '',
          userName: r.userName || '',
          custPERNR: parseInt(r.custPERNR) || 0,
          custHireDate: r.custHireDate ? new Date(r.custHireDate) : null,
          custBusUnit: r.custBusUnit || '',
          custDivision: r.custDivision || '',
          custDepartment: r.custDepartment || '',
          jobTitle: r.jobTitle || '',
          custPayGradeLevel: parseInt(r.custPayGradeLevel) || 0,
          curSalary: parseFloat(r.curSalary) || 0,
          custCurHrlySalary: parseFloat(r.custCurHrlySalary) || 0,
          payGuideMid: parseFloat(r.payGuideMid) || 0,
          curRatio: parseFloat(r['%curRatio']) || 0,
          custPerformanceZone: r.custPerformanceZone || '',
          custPDScore: r.custPDScore || '',
          meritGuideline: r.meritGuideline || '',
          merit: parseFloat(r.merit) || 0,
          //merit_Percentage: 'Percentage.valueOf()' || 0,
          merit_Percentage: r['%merit'] || 0,
          commentformerit: r['Comment for merit'] || '',
          custExceptionCode: r.custExceptionCode || '',
          lumpSum: parseFloat(r.lumpSum) || 0,
          lumpSum_Percentage: parseFloat(r['%lumpSum']) || 0,
          finSalary: parseFloat(r.finSalary) || 0,
          compaRatio: parseFloat(r['%compaRatio']) || 0,
          custMeritExcepReqAmt: parseFloat(r.custMeritExcepReqAmt) || 0,
          custMeritExcepReqPct: parseFloat(r.custMeritExcepReqPct) || 0,
          custfinSalaryExcepReq: parseFloat(r.custfinSalaryExcepReq) || 0,
          custCompaRatioExcepReq: parseFloat(r.custCompaRatioExcepReq) || 0,
          custMeritExcepReqComment: r.custMeritExcepReqComment || '',
          salaryNote: r.salaryNote || '',
          custTargetTab: r.custTargetTab || '',
          compaRatioRanges: r.compaRatioRanges || '',
          payAdjustmentAmount: parseFloat(r.payAdjustmentAmount) || 0,
          payAdjustmentAmountPer: parseFloat(r.payAdjustmentAmountPer) || 0,
          payAdjustmentFinalPay: parseFloat(r.payAdjustmentFinalPay) || 0,
          status: 'S', // or infer from file if available


        })
        );

        //console.log('Final data :', finalData);
        return finalData;
      } catch (err) {
        console.error('SFTP Error:', err.message);
        return req.error(500, 'Failed to read SFTP file');
      } finally {
        sftp.end();
      }
    });

    this.on('insertMultipleCRVException', async (req) => {
      const { entries } = req.data;

      if (!Array.isArray(entries) || entries.length === 0) {
        return req.error(400, 'No CRVException entries provided');
      }

      // Optional: Log the shape of data
      console.log('🟢 Received entries count:', entries.length);
      console.log('🔍 Sample entry:', JSON.stringify(entries[0], null, 2));

      // Validate composite key fields
      const invalidEntry = entries.find(e => !e.field_id || !e.custPERNR);
      if (invalidEntry) {
        console.error('❌ Invalid entry found:', invalidEntry);
        return req.error(400, 'Each entry must have both field_id and custPERNR');
      }

      // try {
      //   // Step 1: Delete all existing records
      //   await DELETE.from(this.entities.CRVException);
      //   console.log('🗑️ Existing CRVException records deleted.');

      // } catch (deleteErr) {
      //   console.error('❌ Delete failed:', deleteErr);
      //   return req.error(500, `Delete failed: ${deleteErr.message}`);
      // }

      try {
        // Step 2: Insert new records
        await INSERT.into(this.entities.CRVException).entries(entries);
        console.log(`✅ ${entries.length} CRVException records inserted successfully.`);
        return req.reply({
          message: `${entries.length} CRVException records inserted successfully after clearing existing ones.`,
        });

      } catch (insertErr) {
        console.error('❌ Insert failed:', insertErr);
        return req.error(500, `Insert failed: ${insertErr.message}`);
      }
    });


    this.on('clearCRVExceptions', async (req) => {
      try {
        await DELETE.from(this.entities.CRVException);
        console.log('🗑️ All CRVException records deleted.');
        return req.reply({ message: 'All CRVException records deleted successfully.' });
      } catch (err) {
        console.error('❌ Deletion failed:', err);
        return req.error(500, `Deletion failed: ${err.message}`);
      }
    });

    this.on('READ', 'BusinessDivisions', async (req) => {
      return await SELECT.from(BusinessDivisions);
    });

    //    this.on('CREATE', 'BusinessDivisions', async (req) => {
    //         console.log(req.data);
    //         try {
    //             await INSERT.into(BusinessDivisions).entries({
    //                 year: req.data.year,
    //                 custBusUnit: req.data.custBusUnit,
    //                 custDivision: req.data.custDivision
    //             });
    //             return req.data
    //         } catch (error) {
    //             console.log(error);
    //             throw new Error(error);
    //         }
    //     });

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

    this.on('insertMultipleBusinessDivisions', async (req) => {
      const { entries } = req.data;

      if (!Array.isArray(entries) || entries.length === 0) {
        return req.error(400, 'No entries provided');
      }

      try {
        await DELETE.from(this.entities.BusinessDivisions);
        await INSERT.into(this.entities.BusinessDivisions).entries(entries);
        return req.reply({ message: `${entries.length} BusinessDivisions records inserted.` });
      } catch (error) {
        console.error('Bulk insert failed:', error);
        return req.error(500, `Insert failed: ${error.message}`);
      }
    });

    // this.on('POST', 'Thresholds', async (req) => {
    //     try {
    //         await INSERT.into(BusinessDivisions).entries({
    //             year: req.data.year,
    //             compaRatioRanges: req.data.compaRatioRanges,
    //             startRange: req.data.startRange,
    //             endRange: req.data.endRange,
    //             sequence: req.data.sequence,
    //             fieldUsage: req.data.fieldUsage
    //         });
    //         return req.data
    //     } catch (error) {
    //         console.log(error);
    //         throw new Error(error);
    //     }
    // });

    this.on('READ', 'Thresholds', async (req) => {
      return await SELECT.from(Thresholds);
    });



    this.on('insertMultipleThresholds', async (req) => {
      const { entries } = req.data;

      if (!Array.isArray(entries) || entries.length === 0) {
        return req.error(400, 'No entries provided');
      }

      try {
        await DELETE.from(this.entities.Thresholds);
        await INSERT.into(this.entities.Thresholds).entries(entries);
        return req.reply({ message: `${entries.length} Threshold records inserted.` });
      } catch (error) {
        console.error('Bulk insert failed:', error);
        return req.error(500, `Insert failed: ${error.message}`);
      }
    });


    // this.on('POST', 'SubZones', async (req) => {
    //     try {
    //         await INSERT.into(SubZones).entries({
    //             year: req.data.year,
    //             performanceSubZone: req.data.compaRatioRanges,
    //             sequence: req.data.sequence,
    //             fieldUsage: req.data.fieldUsage
    //         });
    //         return req.data
    //     } catch (error) {
    //         console.log(error);
    //         throw new Error(error);
    //     }
    // });

    this.on('READ', 'SubZones', async (req) => {
      return await SELECT.from(SubZones);
    });


    this.on('insertMultipleSubzones', async (req) => {
      const { entries } = req.data;

      if (!Array.isArray(entries) || entries.length === 0) {
        return req.error(400, 'No entries provided');
      }

      try {
        await DELETE.from(this.entities.SubZones);
        await INSERT.into(this.entities.SubZones).entries(entries);
        return req.reply({ message: `${entries.length} Subzone records inserted.` });
      } catch (error) {
        console.error('Bulk insert failed:', error);
        return req.error(500, `Insert failed: ${error.message}`);
      }
    });

    // this.on('POST', 'CompensationRatioMaster', async (req) => {
    //     try {
    //         await INSERT.into(CompensationRatioMaster).entries({
    //             year: req.data.year,
    //             performanceSubZone: req.data.compaRatioRanges,
    //             payzones: req.data.payzones,
    //             compaRatioRanges: req.data.compaRatioRanges,
    //             startRange: req.data.startRange,
    //             endRange: req.data.endRange,
    //             performanceRating: req.data.performanceRating,
    //             thresholdFrom: req.data.thresholdFrom,
    //             thresholdTo: req.data.thresholdTo,
    //             status: req.data.status
    //         });
    //         return req.data
    //     } catch (error) {
    //         console.log(error);
    //         throw new Error(error);
    //     }
    // });

    this.on('insertMultipleCompensationRatioMaster', async (req) => {
      const { entries } = req.data;

      if (!Array.isArray(entries) || entries.length === 0) {
        return req.error(400, 'No entries provided');
      }

      try {
        await DELETE.from(this.entities.CompensationRatioMaster);
        await INSERT.into(this.entities.CompensationRatioMaster).entries(entries);
        return req.reply({ message: `${entries.length} CompensationRatio records inserted.` });
      } catch (error) {
        console.error('Bulk insert failed:', error);
        return req.error(500, `Insert failed: ${error.message}`);
      }
    });

    this.on('readCompensationRatioMaster', async () => {
      return await SELECT.from(this.entities.CompensationRatioMaster);
    });



    this.on('insertMultipleTargetTabs', async (req) => {
      const { entries } = req.data;

      if (!Array.isArray(entries) || entries.length === 0) {
        return req.error(400, 'No entries provided');
      }

      try {
        await INSERT.into(this.entities.TargetTabs).entries(entries);
        return req.reply({ message: `${entries.length} TargetTabs records inserted.` });
      } catch (error) {
        console.error('Bulk insert failed:', error);
        return req.error(500, `Insert failed: ${error.message}`);
      }
    });


    this.on('readTargets', async (req) => {
      const { year } = req.data;

      const TargetData = await SELECT.from(CRVTargets).where({ year });

      if (TargetData.length === 0) {
        return [];
      }
      const TargetIds = TargetData.map(t => t.TargetTabName);
      const DivisionsData = await SELECT.from(CRVDivisions).where({
        TargetTabName: { in: TargetIds },
        year: year
      });
      console.log(DivisionsData)
      const finalresult = TargetData.map(td => ({
        ID: td.uuid,
        year: td.year,
        Modeltype: td.Modeltype,
        TargetTabName: td.TargetTabName,
        custBusUnit: td.custBusUnit,
        changedStatus: td.changedStatus,
        createdBy: td.createdBy,
        changedBy: td.changedBy,
        fieldUsage: td.fieldUsage,
        to_divisions: DivisionsData.filter(
          d => d.year === td.year
            && d.Modeltype === td.Modeltype
            && d.TargetTabName === td.TargetTabName
        ).map(d => ({
          ID: d.uuid,
          custDivision: d.custDivision
        }))
      }));
      return finalresult;
    });

    this.on('createupsertTargetTabs', async (req) => {
      const { nestedpayload } = req.data;
      try {
        const {
          ID,
          year,
          Modeltype,
          TargetTabName,
          custBusUnit,
          changedStatus,
          createdBy,
          changedBy,
          fieldUsage,
          to_divisions = []
        } = nestedpayload;

        if (!year || !Modeltype) {
          return req.error(400, 'Both year and Modeltype are required.');
        }

        const existingModel = await SELECT.from(CRVTargets).where({
          TargetTabName: TargetTabName,
          year: year,
          Modeltype: Modeltype
        });
        if (existingModel.length > 0) {
          try {
            await UPDATE(CRVTargets).set({
              custBusUnit,
              changedStatus,
              fieldUsage,
            }).where({
              ID: existingModel[0].ID,
              year,
              Modeltype,
              TargetTabName,
            });
            try {
              await DELETE.from(CRVDivisions).where({ year, Modeltype, TargetTabName });
              for (const div of to_divisions) {
                try {
                  for (const div of to_divisions) {
                    await INSERT.into(CRVDivisions).entries({
                      year,
                      Modeltype,
                      TargetTabName,
                      custBusUnit,
                      custDivision: div.custDivision
                    });
                  }
                  return 'Target Tab Updated Successfully'
                } catch (error) {
                  return req.error(500, `Divisions failed: ${error.message}`);
                }

              }
            } catch {
              return req.error(500, `Create failed: ${error.message}`);
            }
          } catch (error) {
            return req.error(500, `Create failed: ${error.message}`);
          }
        } else {
          console.log('no data found');
          await INSERT.into(CRVTargets).entries({
            year,
            Modeltype,
            TargetTabName,
            custBusUnit,
            changedStatus,
            fieldUsage,
          });
          for (const div of to_divisions) {
            await INSERT.into(CRVDivisions).entries({
              year,
              Modeltype,
              TargetTabName,
              custBusUnit,
              custDivision: div.custDivision
            });
          }
          return 'Target Tab created successfully';
        }
      } catch (error) {
        return req.error(500, `Upsert/Create failed: ${error.message}`);
      }

    });

    this.on('readCRVExceptionMaster', async () => {
      return await SELECT.from(this.entities.CRVException);
    });

    return super.init();
  }
}
module.exports = { ZHR_COMP_CAP_CRVEXCEP_SRV };