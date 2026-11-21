export type ModuleId =
  | 'dashboard'
  | 'daily-inspection'
  | 'near-miss'
  | 'accident-incident'
  | 'hemm-inspection'
  | 'hira'
  | 'safety-violation'
  | 'capa'
  | 'haul-road'
  | 'dump-yard'
  | 'fire-safety'
  | 'ppe-inspection'
  | 'safety-training'
  | 'safety-meetings'
  | 'daily-reports'
  | 'weekly-reports'
  | 'monthly-reports'
  | 'user-management'
  | 'settings';

export type ShiftCode = 'Shift A (06:00-14:00)' | 'Shift B (14:00-22:00)' | 'Shift C (22:00-06:00)';
export type SeverityLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export interface DailyInspectionRecord {
  id: string;
  date: string;
  shift: ShiftCode;
  zone: string;
  inspector: string;
  checklistPassed: number;
  checklistTotal: number;
  hazardsFound: number;
  status: 'Compliant' | 'Action Required' | 'Critical Hold';
  remarks: string;
}

export interface NearMissRecord {
  id: string;
  date: string;
  shift: ShiftCode;
  location: string;
  reportedBy: string;
  category: 'Unsafe Act' | 'Unsafe Condition' | 'Equipment Near Miss' | 'Traffic Near Miss';
  potentialSeverity: SeverityLevel;
  description: string;
  immediateAction: string;
  status: 'Open' | 'Investigating' | 'Closed';
}

export interface IncidentRecord {
  id: string;
  date: string;
  shift: ShiftCode;
  location: string;
  classification: 'First Aid' | 'Medical Treatment (MTC)' | 'Lost Time Injury (LTI)' | 'Property Damage' | 'Dangerous Occurrence';
  dgmsFormRef: string;
  injuredPerson: string;
  department: string;
  rootCause: string;
  status: 'Reported' | 'Under Inquiry' | 'Closed';
}

export interface HemmRecord {
  id: string;
  equipmentId: string;
  equipmentType: '100T Dumper' | '85T Dumper' | 'Hydraulic Shovel' | 'Dozer' | 'Motor Grader' | 'Water Sprinkler' | 'Blast Hole Drill';
  operatorName: string;
  shift: ShiftCode;
  date: string;
  brakesOk: boolean;
  afdssOk: boolean;
  reverseCamOk: boolean;
  ropsOk: boolean;
  fitnessStatus: 'Fit for Operation' | 'Conditional' | 'Grounded';
  deficiencyNotes: string;
}

export interface HiraRecord {
  id: string;
  activity: string;
  zone: string;
  hazard: string;
  likelihood: 1 | 2 | 3 | 4 | 5;
  severity: 1 | 2 | 3 | 4 | 5;
  inherentScore: number;
  controls: string;
  residualScore: number;
  owner: string;
  reviewDate: string;
  status: 'Controlled' | 'Monitoring' | 'Action Required';
}

export interface ViolationRecord {
  id: string;
  date: string;
  location: string;
  personOrContractor: string;
  violationType: 'PPE Non-Compliance' | 'Haul Road Overspeed' | 'Unauthorized Zone Entry' | 'LOTO Breach' | 'Seatbelt / Mobile Use';
  severity: SeverityLevel;
  actionTaken: string;
  issuedBy: string;
  status: 'Issued' | 'Counseled' | 'Resolved';
}

export interface CapaRecord {
  id: string;
  title: string;
  sourceModule: string;
  location: string;
  priority: SeverityLevel;
  assignedTo: string;
  dueDate: string;
  createdDate: string;
  status: 'Open' | 'In Progress' | 'Pending Verification' | 'Overdue' | 'Closed';
  correctiveAction: string;
}

export interface HaulRoadRecord {
  id: string;
  segmentId: string;
  segmentName: string;
  date: string;
  shift: ShiftCode;
  speedLimitKmh: number;
  bermHeightM: number;
  requiredBermM: number;
  gradientPct: number;
  dustSuppression: 'Sprinkled' | 'Due' | 'Dry - Urgent';
  illuminationStatus: 'Adequate' | 'Partial' | 'Outage';
  status: 'Safe' | 'Caution' | 'Restricted';
  inspector: string;
}

export interface DumpYardRecord {
  id: string;
  yardName: string;
  bayNumber: string;
  date: string;
  shift: ShiftCode;
  slopeAngleDeg: number;
  stopperBlockHeightM: number;
  crackObserved: boolean;
  spotterPresent: boolean;
  illuminationLux: number;
  status: 'Operational' | 'Restricted' | 'Closed for Stabilization';
  inspector: string;
  notes: string;
}

export interface FireSafetyRecord {
  id: string;
  assetCode: string;
  location: string;
  equipmentType: 'ABC Dry Powder 9kg' | 'CO2 4.5kg' | 'Foam 50L Trolley' | 'AFDSS System' | 'Fire Hydrant Post';
  lastInspected: string;
  nextDue: string;
  pressureOk: boolean;
  sealIntact: boolean;
  inspector: string;
  status: 'Serviceable' | 'Recharge Due' | 'Defective';
}

export interface PpeRecord {
  id: string;
  date: string;
  department: string;
  crewCount: number;
  helmetCompliancePct: number;
  bootCompliancePct: number;
  jacketCompliancePct: number;
  dustMaskCompliancePct: number;
  deficienciesFound: number;
  auditor: string;
  status: 'Compliant' | 'Partial' | 'Non-Compliant';
}

export interface TrainingRecord {
  id: string;
  programName: string;
  category: 'Basic VTC' | 'HEMM Simulator' | 'First Aid' | 'Fire Fighting' | 'Slope & Dump Safety' | 'Gas & Blasting';
  date: string;
  trainer: string;
  participantsCount: number;
  passCount: number;
  venue: string;
  status: 'Completed' | 'Scheduled' | 'In Progress';
}

export interface MeetingRecord {
  id: string;
  meetingType: 'Pit Safety Committee' | 'Daily Toolbox Talk (TBT)' | 'Area Tripartite Review' | 'HEMM Safety Briefing';
  date: string;
  chairperson: string;
  attendees: number;
  keyTopics: string;
  resolutionsCount: number;
  status: 'Minutes Issued' | 'Action Pending';
}

export interface MineUser {
  id: string;
  empCode: string;
  name: string;
  role: 'Mine Manager' | 'Safety Officer' | 'Assistant Safety Officer' | 'Pit Boss / Overman' | 'HEMM Foreman' | 'VTC Instructor';
  department: string;
  shift: ShiftCode | 'General Shift';
  phone: string;
  status: 'Active' | 'Suspended';
}

export interface MineSettings {
  unitName: string;
  areaName: string;
  companyName: string;
  mineCode: string;
  targetSafetyIndex: number;
  dailyInspectionTarget: number;
  capaEscalationDays: number;
  haulRoadMaxSpeedKmh: number;
  minBermHeightM: number;
  emailAlertsEnabled: boolean;
  smsEscalationEnabled: boolean;
}
