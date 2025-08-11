const cds = require('@sap/cds');
const XLSX = require('xlsx');
const Sftpclient = require('ssh2-sftp-client');
const csv = require('csv-parser');
const fs = require('fs');


class ZHR_COMP_CAP_CRVEXCEP_SRV extends cds.ApplicationService {

  async init() {

    const { BusinessDivisions, CRVTargets, CRVDivisions, Thresholds, SubZones, CompensationRatioMaster, CRVException, crvModelsLaunch, NumberRange } = this.entities;

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
      console.log(' Received entries count:', entries.length);
      console.log(' Sample entry:', JSON.stringify(entries[0], null, 2));

      // Validate composite key fields
      const invalidEntry = entries.find(e => !e.field_id || !e.custPERNR);
      if (invalidEntry) {
        console.error('Invalid entry found:', invalidEntry);
        return req.error(400, 'Each entry must have both field_id and custPERNR');
      }

      // try {
      //   // Step 1: Delete all existing records
      //   await DELETE.from(this.entities.CRVException);
      //   console.log('Existing CRVException records deleted.');

      // } catch (deleteErr) {
      //   console.error(' Delete failed:', deleteErr);
      //   return req.error(500, `Delete failed: ${deleteErr.message}`);
      // }

      try {
        // Step 2: Insert new records
        await INSERT.into(this.entities.CRVException).entries(entries);
        console.log(` ${entries.length} CRVException records inserted successfully.`);
        return req.reply({
          message: `${entries.length} CRVException records inserted successfully after clearing existing ones.`,
        });

      } catch (insertErr) {
        console.error(' Insert failed:', insertErr);
        return req.error(500, `Insert failed: ${insertErr.message}`);
      }
    });


    this.on('clearCRVExceptions', async (req) => {
      try {
        await DELETE.from(this.entities.CRVException);
        console.log(' All CRVException records deleted.');
        return req.reply({ message: 'All CRVException records deleted successfully.' });
      } catch (err) {
        console.error(' Deletion failed:', err);
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
        modifiedBy: td.modifiedBy,
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

    this.on('readTargetTotal', async (req) => {
      const { year, TargetTabName } = req.data;
      const TargetData = await SELECT.from(CRVTargets).where({ year: year, Modeltype: 'CRV', TargetTabName: TargetTabName });
      const Divisions = await SELECT.from(CRVDivisions).where({
        TargetTabName: TargetTabName,
        Modeltype: 'CRV',
        year: year
      });
      var businessUnit = TargetData[0].custBusUnit;
      const aDivisions = Divisions.map(d => d.custDivision);
      const aExceptionData = await SELECT.from(CRVException)
        .columns(
          'custBusUnit',
          'sum(curSalary) as totalSalary'
        ).where({
          custBusUnit: businessUnit,
          custDivision: { in: aDivisions }
        }).groupBy('custBusUnit');
      console.log(aExceptionData);

      const aFinal = { year: year, TargetTabName: TargetTabName, curSalary: aExceptionData[0]?.totalSalary ?? 0.00 }
      return aFinal;
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

    this.before('DELETE', CRVTargets, async (req) => {
      const { year, TargetTabName } = req.data;
      if (!year || !TargetTabName) return;

      const [{ count }] = await cds.run(
        SELECT.one.from(crvModelsLaunch).columns`count(1) as count`
          .where({ year, targetTab: TargetTabName })   // do NOT filter by model_Id or Modeltype
      );

      if (count > 0) {
        req.error(409, `Cannot delete TargetTab '${TargetTabName}' for year ${year}: referenced by ${count} CRV Model Header record(s).`);
      }
    });

    this.on('deleteTargetTab', async (req) => {
      const p = (req.data && (req.data.nestedpayload || req.data)) || {};
      const { year, Modeltype, TargetTabName, custBusUnit } = p;

      if (!year || !Modeltype || !TargetTabName || !custBusUnit) {
        return req.error(400, 'year, Modeltype, TargetTabName, custBusUnit are required');
      }

      const tx = cds.transaction(req);

      // 1) Reference check: year + targetTab only
      const [{ count }] = await tx.run(
        SELECT.one.from(crvModelsLaunch).columns`count(1) as count`
          .where({ year, targetTab: TargetTabName })
      );
      if (count > 0) {
        return req.error(409, `Cannot delete TargetTab '${TargetTabName}' for year ${year}: referenced by ${count} CRV Model Header record(s).`);
      }

      try {
        // 2) Find master row by natural key
        const master = await tx.run(
          SELECT.one.from(CRVTargets).where({ year, Modeltype, TargetTabName, custBusUnit })
        );
        if (!master) return true;

        // 3) Delete children (group rows)
        await tx.run(
          DELETE.from(CRVDivisions).where({ year, Modeltype, TargetTabName, custBusUnit })
        );

        // 4) Delete master by ID
        await tx.run(DELETE.from(CRVTargets).where({ ID: master.ID }));

        return true;
      } catch (err) {
        return req.error(500, `deleteTargetTab failed: ${err.message}`);
      }
    });

    this.on('readCRVExceptionMaster', async () => {
      return await SELECT.from(this.entities.CRVException);
    });

    this.on('readStatus', async () => {
      var sStatus = [];
      sStatus.push({
        StatusCode: 'S',
        StatusDescription: 'Submitted'
      }, {
        StatusCode: 'O',
        StatusDescription: 'Obsolete'
      }, {
        StatusCode: 'P',
        StatusDescription: 'Published'
      }, {
        StatusCode: 'A',
        StatusDescription: 'Approved'
      }, {
        StatusCode: 'R',
        StatusDescription: 'Rejected'
      });
      return sStatus;
    });

    this.on('readTargetMaster', async () => {
      const Targets = await SELECT.from(CRVTargets);
      var targetdata = [];
      const seen = new Set();
      Targets.forEach(entry => {
        const key = `${entry.TargetTabName}`;
        if (!seen.has(key)) {
          seen.add(key);
          targetdata.push(entry.TargetTabName);
        }
      });
      return targetdata;
    });

    this.on('readApprovedby', async () => {
      const ApprovedData = await SELECT.from(crvModelsLaunch).columns('approvedby', 'approvedname');
      var Approvedby = [];
      const seen = new Set();
      ApprovedData.forEach(entry => {
        const key = `${entry.approvedby}`;
        if (!seen.has(key)) {
          seen.add(key);
          Approvedby.push({ approvedby: entry.approvedby, approvedname: entry.approvedname });
        }
      });
      return Approvedby;
    });

    this.on('readCreatedby', async () => {
      const CreatedData = await SELECT.from(crvModelsLaunch).columns('createdBy', 'createdname');
      var Createdby = [];
      const seen = new Set();
      CreatedData.forEach(entry => {
        const key = `${entry.createdBy}`;
        if (!seen.has(key)) {
          seen.add(key);
          Createdby.push({ createdBy: entry.createdBy, createdname: entry.createdname });
        }
      });
      return Createdby;
    });

    // this.on('createnumberRange', async (req) => {
    //   const { year, Modeltype } = req.data;
    //   console.log(year);
    //   console.log(Modeltype);
    //   function padToLength4(value) {
    //     return String(value || "").padStart(4, "0");
    //   }
    //   const aNumbers = await SELECT.from(NumberRange).where({
    //     year: year,
    //     Modeltype: Modeltype
    //   });
    //   console.log(aNumbers);
    //   if (aNumbers.length > 0) {
    //     if (aNumbers[0].status === 'D') {
    //       var Id = 'CM' + year.toString() + padToLength4(aNumbers[0].currentvalue);
    //       var ModelId = { ModelId: Id }
    //       return ModelId;
    //     } else {
    //       var next = 0;
    //       next = aNumbers[0].currentvalue + 1;
    //       var Id = 'CM' + year.toString() + padToLength4(next);
    //       var ModelId = { ModelId: Id }
    //       return ModelId;
    //     }
    //   } else {
    //     try {
    //       console.log('else satisfied');
    //       await INSERT.into(NumberRange).entries({
    //         year: year,
    //         Modeltype: Modeltype,
    //         rangefrom: 1,
    //         rangeto: 9999,
    //         currentvalue: 1,
    //         status: 'D'
    //       });
    //       var Id = 'CM' + year.toString() + padToLength4(1);
    //       var ModelId = { ModelId: Id }
    //       return ModelId;
    //     } catch (error) {
    //       return 'N/A'
    //     }

    //   }
    // });

    this.on('createnumberRange', async (req) => {
  const { year, Modeltype } = req.data;
  const pad = n => String(n || 0).padStart(4, '0');

  let row = await SELECT.one.from(NumberRange).where({ year, Modeltype });

  if (!row) {
    // first time for this year/type → start at 1 (draft)
    await INSERT.into(NumberRange).entries({
      year, Modeltype, rangefrom: 1, rangeto: 9999, currentvalue: 1, status: 'D'
    });
    row = { year, Modeltype, currentvalue: 1, status: 'D' };
  } else if (row.status === 'A') {
    // last one was finalized → move to next and mark as draft (reserve it)
    const next = Math.min((row.currentvalue || 0) + 1, row.rangeto || 9999);
    await UPDATE(NumberRange)
      .set({ currentvalue: next, status: 'D' })
      .where({ year, Modeltype });
    row.currentvalue = next;
    row.status = 'D';
  }
  // If status is already 'D', we just return the reserved one again.

  return { ModelId: `CM${year}${pad(row.currentvalue)}` };
});


    this.on('postCRVModel', async (req) => {
      const b = req.data.payload || req.data;

      const model_Id = b.ModelId;
      const year = Number(b.year);
      const targetTab = b.Targettab;
      if (!model_Id || !year || !targetTab) return req.error(400, 'ModelId, year, Targettab are required');

      const totalsalary = 0;
      const pool = Number(b.TotalDistributedPct ?? 0);
      const pool_available = 0;
      const totalDistributed = Number(b.TotalDistributed ?? 0);
      const totalDistrubuted_Percentage = Number(b.TotalDistributedPct ?? 0);
      const remainingPool = Number(b.RemainingPool ?? 0);
      const remainingPool_Percentage = Number(b.RemainingPoolPct ?? 0);
      const remainingPoolbalance = 0;

      const byOption = new Map();
      for (const h of b.to_header || []) {
        const key = String(h.option || 'Option1').trim();
        if (!byOption.has(key)) byOption.set(key, []);
        byOption.get(key).push(h);
      }

      const tx = cds.transaction(req);
      const MODEL_HEADER = 'com.compmodel.ZHR_COMP_TBL_CRV_MODEL_HEADER';

      for (const [option, rows] of byOption.entries()) {
        const entry = {
          model_Id,
          year,
          targetTab,
          modelOption: option,
          totalsalary,
          pool,
          pool_available,
          totalDistributed,
          totalDistrubuted_Percentage,
          remainingPool,
          remainingPool_Percentage,
          remainingPoolbalance,
          status: 'S',
          to_ThresholdHeaders: rows.map((r, idx) => ({
            year,
            model_Id,
            targetTab,
            modelOption: option,
            custPerformancesubZone: String(r.performancesubzone || ''),
            payzones: String(r.payzone || ''),
            custPDScore: String(r.rating || ''),
            sequence: String(r.sequence || String(idx + 1)),
            count: 0,
            totalBudget: Number(r.budget || 0),
            totalCost: Number(r.total || 0),
            indicator: String(r.Indicator || ''),
            status: 'S',
            to_ThresholdItems: (r.to_item || []).map((it, j) => ({
              year,
              model_Id,
              modelOption: option,
              targetTab,
              custPerformancesubZone: String(r.performancesubzone || ''),
              payzones: String(r.payzone || ''),
              custPDScore: String(r.rating || ''),
              threshold_Id: cds.utils.uuid(),
              compaRatioRanges: String(it.text || ''),
              startRange: String(it.startrange || ''),
              endRange: String(it.endrange || ''),
              percentage_val_from: Number(it.threshholdfrom || 0),
              percentage_val_to: Number(it.threshholdto || 0),
              percentage_text: `${it.threshholdfrom || 0}-${it.threshholdto || 0}%`,
              value: Number(it.value || 0),
              sequence: String(it.sequence || String(j + 1)),
              fieldUsage: 'A',
              status: 'S'
            }))
          }))
        };

        await tx.run(INSERT.into(MODEL_HEADER).entries(entry));
      }

      return { ok: true, message: 'Inserted', model_Id };
    });

    // after the inserts in postCRVModel finish successfully
    this.after('postCRVModel', async (result, req) => {
      if (!result?.ok) return;                   // only if save succeeded

      const b = req.data.payload || req.data;    // original input
      const year = Number(b.year);
      const modelId = result.model_Id || b.ModelId;
      const seq = parseInt(modelId.slice(-4), 10); // CM20250017 -> 17

      await cds.transaction(req).run(
        UPDATE(this.entities.NumberRange)
          .set({ status: 'A' })
          .where({ year, Modeltype: 'CRV', currentvalue: seq })
      );
    });


    this.on('readcreatemodel', async (req) => {
      const { year } = req.data;
      const compRatioMaster = await SELECT.from(CompensationRatioMaster).where({
        year: year,
        status: 'A'
      });
      if (compRatioMaster.length>0) {
        console.log("CRM",compRatioMaster);
        const subzones = await SELECT.from(SubZones).where({
          year: year,
          fieldUsage: 'A'
        }).orderBy('sequence');
        if (subzones.length>0) {
          
          const threshholdMaster = await SELECT.from(Thresholds).where({
            year: year,
            fieldUsage: 'A'
          }).orderBy('sequence');
          if(threshholdMaster.length>0) return null;
          const subzonesdata = subzones.map(c => ({
            performanceRating: compRatioMaster.find(s => s.performanceSubZone === c.performanceSubZone)?.performanceRating || '',
            performanceSubZone: c.performanceSubZone,
            payzones: compRatioMaster.find(s => s.performanceSubZone === c.performanceSubZone)?.payzones || '',
            sub_zonesequence: c.sequence
          })).sort((a, b) => Number(a.sub_zonesequence) - Number(b.sub_zonesequence));
          const aCompensationData = subzonesdata.map(c => ({
            performanceRating: c.performanceRating,
            performanceSubZone: c.performanceSubZone,
            payzones: c.payzones,
            sub_zonesequence: c.sub_zonesequence,
            to_columns: threshholdMaster.map(d => ({
              ID: d.ID,
              compaRatioRanges: d.compaRatioRanges,
              startRange: d.startRange,
              endRange: d.endRange,
              thresholdFrom: compRatioMaster.find(s => s.performanceSubZone === c.performanceSubZone
                && s.performanceRating === c.performanceRating
                && s.payzones === c.payzones
                && s.compaRatioRanges === d.compaRatioRanges
              )?.thresholdFrom || '',
              thresholdTo: compRatioMaster.find(s => s.performanceSubZone === c.performanceSubZone
                && s.performanceRating === c.performanceRating
                && s.payzones === c.payzones
                && s.compaRatioRanges === d.compaRatioRanges
              )?.thresholdTo || '',
              sequence: d.sequence
            })).sort((a, b) => Number(a.sequence) - Number(b.sequence))
          }));
          return aCompensationData;
        } else {
          return null;
        }

      } else {
        return null;
      }
    })

    return super.init();
  }
}
module.exports = { ZHR_COMP_CAP_CRVEXCEP_SRV };