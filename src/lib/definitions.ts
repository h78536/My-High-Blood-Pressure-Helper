export type BloodPressureReading = {
  id: string;
  systolic: number;
  diastolic: number;
  heartRate: number;
  timestamp: any; // Allow for Firestore Timestamp and Date objects
};

export type BloodPressureReadingForm = {
  systolic: number;
  diastolic: number;
  heartRate: number;
};