import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useSafety } from '../context/SafetyContext';
import { ModuleId, SeverityLevel, ShiftCode } from '../types/safety';

const today = '2026-11-21';

export const RecordModal: React.FC = () => {
  const {
    modalModule,
    closeCreateModal,
    activeShift,
    addInspection,
    addNearMiss,
    addIncident,
    addHemm,
    addHira,
    addViolation,
    addCapa,
    addHaulRoad,
    addDumpYard,
    addFireSafety,
    addPpe,
    addTraining,
    addMeeting,
    addUser,
  } = useSafety();

  const [selectedType, setSelectedType] = useState<ModuleId | null>(null);
  const effectiveModule = selectedType ?? modalModule;

  // Shared form fields
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [text3, setText3] = useState('');
  const [text4, setText4] = useState('');
  const [shift, setShift] = useState<ShiftCode>(activeShift);
  const [severity, setSeverity] = useState<SeverityLevel>('Medium');
  const [num1, setNum1] = useState(16);
  const [num2, setNum2] = useState(16);
  const [num3, setNum3] = useState(0);
  const [bool1, setBool1] = useState(true);
  const [bool2, setBool2] = useState(true);
  const [bool3, setBool3] = useState(true);
  const [bool4, setBool4] = useState(true);
  const [select1, setSelect1] = useState('');

  if (!modalModule || !effectiveModule) return null;

  const resetAndClose = () => {
    setSelectedType(null);
    setText1('');
    setText2('');
    setText3('');
    setText4('');
    closeCreateModal();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    switch (effectiveModule) {
      case 'daily-inspection':
        addInspection({
          date: today,
          shift,
          zone: text1 || 'Quarry Bench-4',
          inspector: text2 || 'S. Mallikarjun',
          checklistPassed: Number(num1) || 16,
          checklistTotal: Number(num2) || 16,
          hazardsFound: Number(num3) || 0,
          status: Number(num3) > 1 ? 'Critical Hold' : Number(num3) === 1 ? 'Action Required' : 'Compliant',
          remarks: text3 || 'Routine shift inspection completed as per DGMS checklist.',
        });
        break;

      case 'near-miss':
        addNearMiss({
          date: today,
          shift,
          location: text1 || 'Haul Road Ramp-1',
          reportedBy: text2 || 'Shift Supervisor',
          category: (select1 as 'Unsafe Act' | 'Unsafe Condition' | 'Equipment Near Miss' | 'Traffic Near Miss') || 'Unsafe Condition',
          potentialSeverity: severity,
          description: text3 || 'Near miss hazard observed and secured.',
          immediateAction: text4 || 'Area barricaded and crew briefed.',
          status: 'Open',
        });
        break;

      case 'accident-incident':
        addIncident({
          date: today,
          shift,
          location: text1 || 'HEMM Workshop',
          classification:
            (select1 as 'First Aid' | 'Medical Treatment (MTC)' | 'Lost Time Injury (LTI)' | 'Property Damage' | 'Dangerous Occurrence') ||
            'First Aid',
          dgmsFormRef: text2 || 'SCCL-IR-2026-125',
          injuredPerson: text3 || 'None / Equipment Only',
          department: text4 || 'OB Operations',
          rootCause: 'Preliminary investigation initiated under Mine Safety Officer.',
          status: 'Reported',
        });
        break;

      case 'hemm-inspection': {
        const allOk = bool1 && bool2 && bool3 && bool4;
        addHemm({
          equipmentId: text1 || 'BH-100-12 (BEML 100T)',
          equipmentType: (select1 as '100T Dumper') || '100T Dumper',
          operatorName: text2 || 'K. Nagesh',
          shift,
          date: today,
          brakesOk: bool1,
          afdssOk: bool2,
          reverseCamOk: bool3,
          ropsOk: bool4,
          fitnessStatus: !bool1 || !bool2 ? 'Grounded' : allOk ? 'Fit for Operation' : 'Conditional',
          deficiencyNotes: text3 || (allOk ? 'All pre-shift safety systems verified.' : 'Deficiency tagged for workshop action.'),
        });
        break;
      }

      case 'hira': {
        const l = Math.min(5, Math.max(1, Number(num1) || 3)) as 1 | 2 | 3 | 4 | 5;
        const s = Math.min(5, Math.max(1, Number(num2) || 4)) as 1 | 2 | 3 | 4 | 5;
        addHira({
          activity: text1 || 'Bench Drilling & Charging',
          zone: text2 || 'Quarry Bench-3',
          hazard: text3 || 'Uncontrolled flyrock / Slope slip',
          likelihood: l,
          severity: s,
          controls: text4 || 'SOP compliance, perimeter sentry, PPE verification.',
          residualScore: Math.max(2, Math.round((l * s) / 3)),
          owner: 'S. Mallikarjun',
          reviewDate: '2026-12-15',
          status: l * s >= 15 ? 'Action Required' : 'Monitoring',
        });
        break;
      }

      case 'safety-violation':
        addViolation({
          date: today,
          location: text1 || 'Main Haul Road',
          personOrContractor: text2 || 'Contractor Crew',
          violationType:
            (select1 as 'PPE Non-Compliance' | 'Haul Road Overspeed' | 'Unauthorized Zone Entry' | 'LOTO Breach' | 'Seatbelt / Mobile Use') ||
            'PPE Non-Compliance',
          severity,
          actionTaken: text3 || 'Safety memo issued and counseling completed.',
          issuedBy: 'S. Mallikarjun',
          status: 'Issued',
        });
        break;

      case 'capa':
        addCapa({
          title: text1 || 'Rectify safety observation in mine zone',
          sourceModule: select1 || 'Daily Safety Inspection',
          location: text2 || 'Quarry Bench-4',
          priority: severity,
          assignedTo: text3 || 'R. Venkateshwarlu',
          dueDate: text4 || '2026-11-28',
          status: 'Open',
          correctiveAction: text3 ? `Assigned to ${text3} for verification and closure.` : 'Immediate engineering control required.',
        });
        break;

      case 'haul-road':
        addHaulRoad({
          segmentId: text1 || 'SEG-A3',
          segmentName: text2 || 'Ramp-3 Intermediate Curve',
          date: today,
          shift,
          speedLimitKmh: Number(num1) || 25,
          bermHeightM: Number(num2) || 1.6,
          requiredBermM: 1.5,
          gradientPct: Number(num3) || 6.5,
          dustSuppression: bool1 ? 'Sprinkled' : 'Due',
          illuminationStatus: bool2 ? 'Adequate' : 'Partial',
          status: Number(num2) < 1.5 ? 'Caution' : 'Safe',
          inspector: text3 || 'S. Mallikarjun',
        });
        break;

      case 'dump-yard':
        addDumpYard({
          yardName: text1 || 'East OB Dump Yard',
          bayNumber: text2 || 'Tipping Bay-3',
          date: today,
          shift,
          slopeAngleDeg: Number(num1) || 34,
          stopperBlockHeightM: Number(num2) || 1.6,
          crackObserved: !bool1,
          spotterPresent: bool2,
          illuminationLux: Number(num3) || 36,
          status: !bool1 ? 'Closed for Stabilization' : 'Operational',
          inspector: text3 || 'M. Srinivas Rao',
          notes: text4 || 'Slope & berm inspected before tipping clearance.',
        });
        break;

      case 'fire-safety':
        addFireSafety({
          assetCode: text1 || 'FE-CHP-09',
          location: text2 || 'CHP Secondary Crusher',
          equipmentType: (select1 as 'ABC Dry Powder 9kg') || 'ABC Dry Powder 9kg',
          lastInspected: today,
          nextDue: '2026-12-21',
          pressureOk: bool1,
          sealIntact: bool2,
          inspector: text3 || 'K. Padmavathi',
          status: bool1 && bool2 ? 'Serviceable' : 'Recharge Due',
        });
        break;

      case 'ppe-inspection':
        addPpe({
          date: today,
          department: text1 || 'Quarry Operations',
          crewCount: Number(num1) || 40,
          helmetCompliancePct: Number(num2) || 100,
          bootCompliancePct: 100,
          jacketCompliancePct: 98,
          dustMaskCompliancePct: 95,
          deficienciesFound: Number(num3) || 1,
          auditor: text2 || 'S. Mallikarjun',
          status: (Number(num2) || 100) >= 95 ? 'Compliant' : 'Partial',
        });
        break;

      case 'safety-training':
        addTraining({
          programName: text1 || 'Haulage & Defensive Driving Refresher',
          category: (select1 as 'HEMM Simulator') || 'HEMM Simulator',
          date: today,
          trainer: text2 || 'T. Anjaneyulu (VTC)',
          participantsCount: Number(num1) || 25,
          passCount: Number(num2) || 25,
          venue: text3 || 'Kothagudem Area VTC',
          status: 'Completed',
        });
        break;

      case 'safety-meetings':
        addMeeting({
          meetingType: (select1 as 'Daily Toolbox Talk (TBT)') || 'Daily Toolbox Talk (TBT)',
          date: today,
          chairperson: text1 || 'R. Venkateshwarlu',
          attendees: Number(num1) || 45,
          keyTopics: text2 || 'Shift hazard briefing, speed limits, and PPE compliance.',
          resolutionsCount: Number(num2) || 3,
          status: 'Minutes Issued',
        });
        break;

      case 'user-management':
        addUser({
          empCode: text1 || 'SCCL-15880',
          name: text2 || 'P. Venkanna',
          role: (select1 as 'Safety Officer') || 'Assistant Safety Officer',
          department: text3 || 'Safety & Rescue',
          shift,
          phone: text4 || '+91 94401 22990',
          status: 'Active',
        });
        break;

      default:
        break;
    }

    resetAndClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60" role="dialog" aria-modal="true">
      <div className="bg-white border border-slate-200 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between gap-2 bg-[#0B1F3A] text-white rounded-t-lg">
          <div>
            <h2 className="text-sm font-bold">New VKCM Safety Record</h2>
            <p className="text-[11px] text-slate-300">Venkatesh Khani Coal Mine · Kothagudem Area</p>
          </div>
          <button
            type="button"
            onClick={resetAndClose}
            className="p-1 rounded hover:bg-white/10 text-slate-200 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Quick Module Switcher inside Modal */}
          <label className="block space-y-1">
            <span className="font-semibold text-slate-700">Record Module</span>
            <select
              value={effectiveModule}
              onChange={(e) => setSelectedType(e.target.value as ModuleId)}
              className="w-full border border-slate-200 rounded-md px-3 py-2 bg-slate-50 font-medium text-[#0B1F3A]"
            >
              <option value="daily-inspection">Daily Safety Inspection</option>
              <option value="near-miss">Near Miss Reporting</option>
              <option value="accident-incident">Accident & Incident Reporting</option>
              <option value="hemm-inspection">HEMM Pre-Shift Inspection</option>
              <option value="hira">HIRA Hazard Assessment</option>
              <option value="safety-violation">Safety Violation Register</option>
              <option value="capa">Corrective Action (CAPA)</option>
              <option value="haul-road">Haul Road & Traffic Check</option>
              <option value="dump-yard">Dump Yard Safety Check</option>
              <option value="fire-safety">Fire Safety Audit</option>
              <option value="ppe-inspection">PPE Compliance Audit</option>
              <option value="safety-training">Safety Training Batch</option>
              <option value="safety-meetings">Safety Meeting / TBT Record</option>
              <option value="user-management">Add Safety Personnel User</option>
            </select>
          </label>

          {/* Dynamic Fields by Module */}
          {effectiveModule === 'daily-inspection' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="block space-y-1">
                  <span className="font-semibold text-slate-700">Mine Zone *</span>
                  <input required type="text" value={text1} onChange={(e) => setText1(e.target.value)} placeholder="e.g. Quarry Bench-4 East" className="w-full border border-slate-200 rounded-md px-3 py-2" />
                </label>
                <label className="block space-y-1">
                  <span className="font-semibold text-slate-700">Inspecting Officer *</span>
                  <input required type="text" value={text2} onChange={(e) => setText2(e.target.value)} placeholder="e.g. S. Mallikarjun" className="w-full border border-slate-200 rounded-md px-3 py-2" />
                </label>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <label className="block space-y-1">
                  <span className="font-semibold text-slate-700">Passed Items</span>
                  <input type="number" min={0} max={30} value={num1} onChange={(e) => setNum1(Number(e.target.value))} className="w-full border border-slate-200 rounded-md px-3 py-2 font-mono" />
                </label>
                <label className="block space-y-1">
                  <span className="font-semibold text-slate-700">Total Items</span>
                  <input type="number" min={1} max={30} value={num2} onChange={(e) => setNum2(Number(e.target.value))} className="w-full border border-slate-200 rounded-md px-3 py-2 font-mono" />
                </label>
                <label className="block space-y-1">
                  <span className="font-semibold text-slate-700">Hazards Found</span>
                  <input type="number" min={0} max={20} value={num3} onChange={(e) => setNum3(Number(e.target.value))} className="w-full border border-slate-200 rounded-md px-3 py-2 font-mono" />
                </label>
              </div>
              <label className="block space-y-1">
                <span className="font-semibold text-slate-700">Inspection Remarks</span>
                <textarea rows={2} value={text3} onChange={(e) => setText3(e.target.value)} placeholder="Bench stability, haul berm, lighting..." className="w-full border border-slate-200 rounded-md px-3 py-2" />
              </label>
            </>
          )}

          {effectiveModule === 'near-miss' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="block space-y-1">
                  <span className="font-semibold text-slate-700">Location *</span>
                  <input required type="text" value={text1} onChange={(e) => setText1(e.target.value)} placeholder="e.g. Weighbridge Curve J-3" className="w-full border border-slate-200 rounded-md px-3 py-2" />
                </label>
                <label className="block space-y-1">
                  <span className="font-semibold text-slate-700">Reported By *</span>
                  <input required type="text" value={text2} onChange={(e) => setText2(e.target.value)} placeholder="Operator / Supervisor Name" className="w-full border border-slate-200 rounded-md px-3 py-2" />
                </label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <label className="block space-y-1">
                  <span className="font-semibold text-slate-700">Category</span>
                  <select value={select1} onChange={(e) => setSelect1(e.target.value)} className="w-full border border-slate-200 rounded-md px-3 py-2">
                    <option value="Unsafe Condition">Unsafe Condition</option>
                    <option value="Unsafe Act">Unsafe Act</option>
                    <option value="Traffic Near Miss">Traffic Near Miss</option>
                    <option value="Equipment Near Miss">Equipment Near Miss</option>
                  </select>
                </label>
                <label className="block space-y-1">
                  <span className="font-semibold text-slate-700">Potential Severity</span>
                  <select value={severity} onChange={(e) => setSeverity(e.target.value as SeverityLevel)} className="w-full border border-slate-200 rounded-md px-3 py-2">
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </label>
              </div>
              <label className="block space-y-1">
                <span className="font-semibold text-slate-700">Observation Description *</span>
                <textarea required rows={2} value={text3} onChange={(e) => setText3(e.target.value)} placeholder="Describe what happened..." className="w-full border border-slate-200 rounded-md px-3 py-2" />
              </label>
              <label className="block space-y-1">
                <span className="font-semibold text-slate-700">Immediate Action Taken</span>
                <input type="text" value={text4} onChange={(e) => setText4(e.target.value)} placeholder="e.g. Area barricaded, crew briefed" className="w-full border border-slate-200 rounded-md px-3 py-2" />
              </label>
            </>
          )}

          {effectiveModule === 'accident-incident' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="block space-y-1">
                  <span className="font-semibold text-slate-700">Incident Location *</span>
                  <input required type="text" value={text1} onChange={(e) => setText1(e.target.value)} placeholder="e.g. Quarry Bench-2" className="w-full border border-slate-200 rounded-md px-3 py-2" />
                </label>
                <label className="block space-y-1">
                  <span className="font-semibold text-slate-700">Classification</span>
                  <select value={select1} onChange={(e) => setSelect1(e.target.value)} className="w-full border border-slate-200 rounded-md px-3 py-2">
                    <option value="First Aid">First Aid</option>
                    <option value="Medical Treatment (MTC)">Medical Treatment (MTC)</option>
                    <option value="Lost Time Injury (LTI)">Lost Time Injury (LTI)</option>
                    <option value="Property Damage">Property Damage</option>
                    <option value="Dangerous Occurrence">Dangerous Occurrence</option>
                  </select>
                </label>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="block space-y-1">
                  <span className="font-semibold text-slate-700">DGMS / SCCL Form Ref</span>
                  <input type="text" value={text2} onChange={(e) => setText2(e.target.value)} placeholder="e.g. DGMS-Form-IV-A" className="w-full border border-slate-200 rounded-md px-3 py-2" />
                </label>
                <label className="block space-y-1">
                  <span className="font-semibold text-slate-700">Department</span>
                  <input type="text" value={text4} onChange={(e) => setText4(e.target.value)} placeholder="e.g. OB Operations" className="w-full border border-slate-200 rounded-md px-3 py-2" />
                </label>
              </div>
              <label className="block space-y-1">
                <span className="font-semibold text-slate-700">Injured Person / Equipment Involved</span>
                <input type="text" value={text3} onChange={(e) => setText3(e.target.value)} placeholder="Name & designation or Equipment ID" className="w-full border border-slate-200 rounded-md px-3 py-2" />
              </label>
            </>
          )}

          {effectiveModule === 'hemm-inspection' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="block space-y-1">
                  <span className="font-semibold text-slate-700">HEMM Unit ID *</span>
                  <input required type="text" value={text1} onChange={(e) => setText1(e.target.value)} placeholder="e.g. BH-100-11 (BEML 100T)" className="w-full border border-slate-200 rounded-md px-3 py-2" />
                </label>
                <label className="block space-y-1">
                  <span className="font-semibold text-slate-700">Operator Name *</span>
                  <input required type="text" value={text2} onChange={(e) => setText2(e.target.value)} placeholder="Operator Name" className="w-full border border-slate-200 rounded-md px-3 py-2" />
                </label>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <label className="flex items-center gap-2"><input type="checkbox" checked={bool1} onChange={(e) => setBool1(e.target.checked)} /> Brakes & Steering OK</label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={bool2} onChange={(e) => setBool2(e.target.checked)} /> AFDSS Pressure OK</label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={bool3} onChange={(e) => setBool3(e.target.checked)} /> Reverse Camera & Alarm OK</label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={bool4} onChange={(e) => setBool4(e.target.checked)} /> ROPS / FOPS & Seatbelt OK</label>
              </div>
              <label className="block space-y-1">
                <span className="font-semibold text-slate-700">Deficiency Notes</span>
                <input type="text" value={text3} onChange={(e) => setText3(e.target.value)} placeholder="Any maintenance tags or observations..." className="w-full border border-slate-200 rounded-md px-3 py-2" />
              </label>
            </>
          )}

          {effectiveModule === 'hira' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="block space-y-1">
                  <span className="font-semibold text-slate-700">Operational Activity *</span>
                  <input required type="text" value={text1} onChange={(e) => setText1(e.target.value)} placeholder="e.g. Highwall Shovel Loading" className="w-full border border-slate-200 rounded-md px-3 py-2" />
                </label>
                <label className="block space-y-1">
                  <span className="font-semibold text-slate-700">Mine Zone *</span>
                  <input required type="text" value={text2} onChange={(e) => setText2(e.target.value)} placeholder="e.g. Quarry Bench-3" className="w-full border border-slate-200 rounded-md px-3 py-2" />
                </label>
              </div>
              <label className="block space-y-1">
                <span className="font-semibold text-slate-700">Hazard Description *</span>
                <input required type="text" value={text3} onChange={(e) => setText3(e.target.value)} placeholder="e.g. Bench overhang collapse" className="w-full border border-slate-200 rounded-md px-3 py-2" />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block space-y-1">
                  <span className="font-semibold text-slate-700">Likelihood (1-5)</span>
                  <input type="number" min={1} max={5} value={num1} onChange={(e) => setNum1(Number(e.target.value))} className="w-full border border-slate-200 rounded-md px-3 py-2 font-mono" />
                </label>
                <label className="block space-y-1">
                  <span className="font-semibold text-slate-700">Severity (1-5)</span>
                  <input type="number" min={1} max={5} value={num2} onChange={(e) => setNum2(Number(e.target.value))} className="w-full border border-slate-200 rounded-md px-3 py-2 font-mono" />
                </label>
              </div>
              <label className="block space-y-1">
                <span className="font-semibold text-slate-700">Control Measures</span>
                <input type="text" value={text4} onChange={(e) => setText4(e.target.value)} placeholder="Engineering & administrative controls..." className="w-full border border-slate-200 rounded-md px-3 py-2" />
              </label>
            </>
          )}

          {effectiveModule === 'safety-violation' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="block space-y-1">
                  <span className="font-semibold text-slate-700">Location *</span>
                  <input required type="text" value={text1} onChange={(e) => setText1(e.target.value)} placeholder="e.g. Haul Road Ramp-1" className="w-full border border-slate-200 rounded-md px-3 py-2" />
                </label>
                <label className="block space-y-1">
                  <span className="font-semibold text-slate-700">Person / Contractor *</span>
                  <input required type="text" value={text2} onChange={(e) => setText2(e.target.value)} placeholder="Name or Contractor Unit" className="w-full border border-slate-200 rounded-md px-3 py-2" />
                </label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <label className="block space-y-1">
                  <span className="font-semibold text-slate-700">Violation Type</span>
                  <select value={select1} onChange={(e) => setSelect1(e.target.value)} className="w-full border border-slate-200 rounded-md px-3 py-2">
                    <option value="PPE Non-Compliance">PPE Non-Compliance</option>
                    <option value="Haul Road Overspeed">Haul Road Overspeed</option>
                    <option value="Unauthorized Zone Entry">Unauthorized Zone Entry</option>
                    <option value="LOTO Breach">LOTO Breach</option>
                    <option value="Seatbelt / Mobile Use">Seatbelt / Mobile Use</option>
                  </select>
                </label>
                <label className="block space-y-1">
                  <span className="font-semibold text-slate-700">Severity</span>
                  <select value={severity} onChange={(e) => setSeverity(e.target.value as SeverityLevel)} className="w-full border border-slate-200 rounded-md px-3 py-2">
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </label>
              </div>
              <label className="block space-y-1">
                <span className="font-semibold text-slate-700">Action Taken *</span>
                <input required type="text" value={text3} onChange={(e) => setText3(e.target.value)} placeholder="Memo issued, pass suspended, counseled..." className="w-full border border-slate-200 rounded-md px-3 py-2" />
              </label>
            </>
          )}

          {effectiveModule === 'capa' && (
            <>
              <label className="block space-y-1">
                <span className="font-semibold text-slate-700">CAPA Action Title *</span>
                <input required type="text" value={text1} onChange={(e) => setText1(e.target.value)} placeholder="e.g. Repair high-mast luminaire at Junction J-3" className="w-full border border-slate-200 rounded-md px-3 py-2" />
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="block space-y-1">
                  <span className="font-semibold text-slate-700">Mine Location *</span>
                  <input required type="text" value={text2} onChange={(e) => setText2(e.target.value)} placeholder="e.g. Haul Road J-3" className="w-full border border-slate-200 rounded-md px-3 py-2" />
                </label>
                <label className="block space-y-1">
                  <span className="font-semibold text-slate-700">Assigned Owner *</span>
                  <input required type="text" value={text3} onChange={(e) => setText3(e.target.value)} placeholder="e.g. P. Rajasekhar" className="w-full border border-slate-200 rounded-md px-3 py-2" />
                </label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <label className="block space-y-1">
                  <span className="font-semibold text-slate-700">Priority</span>
                  <select value={severity} onChange={(e) => setSeverity(e.target.value as SeverityLevel)} className="w-full border border-slate-200 rounded-md px-3 py-2">
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </label>
                <label className="block space-y-1">
                  <span className="font-semibold text-slate-700">Target Due Date</span>
                  <input type="date" value={text4 || '2026-11-28'} onChange={(e) => setText4(e.target.value)} className="w-full border border-slate-200 rounded-md px-3 py-2 font-mono" />
                </label>
              </div>
            </>
          )}

          {(effectiveModule === 'haul-road' || effectiveModule === 'dump-yard') && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="block space-y-1">
                  <span className="font-semibold text-slate-700">{effectiveModule === 'haul-road' ? 'Segment ID *' : 'Dump Yard Name *'}</span>
                  <input required type="text" value={text1} onChange={(e) => setText1(e.target.value)} placeholder={effectiveModule === 'haul-road' ? 'SEG-A3' : 'East OB Dump Yard'} className="w-full border border-slate-200 rounded-md px-3 py-2" />
                </label>
                <label className="block space-y-1">
                  <span className="font-semibold text-slate-700">{effectiveModule === 'haul-road' ? 'Corridor Name *' : 'Tipping Bay *'}</span>
                  <input required type="text" value={text2} onChange={(e) => setText2(e.target.value)} placeholder={effectiveModule === 'haul-road' ? 'Ramp-3 Sector' : 'Tipping Bay-3'} className="w-full border border-slate-200 rounded-md px-3 py-2" />
                </label>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <label className="block space-y-1">
                  <span className="font-semibold text-slate-700">{effectiveModule === 'haul-road' ? 'Speed (km/h)' : 'Slope (°)'}</span>
                  <input type="number" value={num1} onChange={(e) => setNum1(Number(e.target.value))} className="w-full border border-slate-200 rounded-md px-3 py-2 font-mono" />
                </label>
                <label className="block space-y-1">
                  <span className="font-semibold text-slate-700">Berm Height (m)</span>
                  <input type="number" step="0.1" value={num2} onChange={(e) => setNum2(Number(e.target.value))} className="w-full border border-slate-200 rounded-md px-3 py-2 font-mono" />
                </label>
                <label className="block space-y-1">
                  <span className="font-semibold text-slate-700">{effectiveModule === 'haul-road' ? 'Gradient %' : 'Lux'}</span>
                  <input type="number" step="0.1" value={num3} onChange={(e) => setNum3(Number(e.target.value))} className="w-full border border-slate-200 rounded-md px-3 py-2 font-mono" />
                </label>
              </div>
              <label className="block space-y-1">
                <span className="font-semibold text-slate-700">Inspecting Officer</span>
                <input type="text" value={text3} onChange={(e) => setText3(e.target.value)} placeholder="Officer Name" className="w-full border border-slate-200 rounded-md px-3 py-2" />
              </label>
            </>
          )}

          {(effectiveModule === 'fire-safety' || effectiveModule === 'ppe-inspection' || effectiveModule === 'safety-training' || effectiveModule === 'safety-meetings' || effectiveModule === 'user-management') && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="block space-y-1">
                  <span className="font-semibold text-slate-700">
                    {effectiveModule === 'fire-safety' ? 'Asset Code *' : effectiveModule === 'ppe-inspection' ? 'Department *' : effectiveModule === 'safety-training' ? 'Program Name *' : effectiveModule === 'safety-meetings' ? 'Chairperson *' : 'Employee Code *'}
                  </span>
                  <input required type="text" value={text1} onChange={(e) => setText1(e.target.value)} className="w-full border border-slate-200 rounded-md px-3 py-2" />
                </label>
                <label className="block space-y-1">
                  <span className="font-semibold text-slate-700">
                    {effectiveModule === 'fire-safety' ? 'Location *' : effectiveModule === 'ppe-inspection' ? 'Auditor *' : effectiveModule === 'safety-training' ? 'Trainer *' : effectiveModule === 'safety-meetings' ? 'Key Topics *' : 'Full Name *'}
                  </span>
                  <input required type="text" value={text2} onChange={(e) => setText2(e.target.value)} className="w-full border border-slate-200 rounded-md px-3 py-2" />
                </label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <label className="block space-y-1">
                  <span className="font-semibold text-slate-700">
                    {effectiveModule === 'user-management' ? 'Department' : 'Count / Metric'}
                  </span>
                  <input type={effectiveModule === 'user-management' ? 'text' : 'number'} value={effectiveModule === 'user-management' ? text3 : num1} onChange={(e) => (effectiveModule === 'user-management' ? setText3(e.target.value) : setNum1(Number(e.target.value)))} className="w-full border border-slate-200 rounded-md px-3 py-2" />
                </label>
                <label className="block space-y-1">
                  <span className="font-semibold text-slate-700">Shift</span>
                  <select value={shift} onChange={(e) => setShift(e.target.value as ShiftCode)} className="w-full border border-slate-200 rounded-md px-3 py-2">
                    <option value="Shift A (06:00-14:00)">Shift A</option>
                    <option value="Shift B (14:00-22:00)">Shift B</option>
                    <option value="Shift C (22:00-06:00)">Shift C</option>
                  </select>
                </label>
              </div>
            </>
          )}

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={resetAndClose}
              className="px-4 py-2 rounded-md border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-semibold cursor-pointer"
            >
              Save Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
