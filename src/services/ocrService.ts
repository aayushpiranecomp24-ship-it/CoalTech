// MINEGOV AI - Simulated Document OCR Pipeline Service
// Clearly labeled prototype service; ready to connect to Tesseract.js / AWS Textract / Google Cloud Vision API.

export interface OcrProcessingResult {
  rawText: string;
  extractedFields: {
    documentType: string;
    licenseOrCertificateNumber: string;
    issuingAuthority: string;
    expiryDate: string;
    isExpired: boolean;
    complianceTerms: string;
    confidenceScore: number; // 0-100%
  };
  processingDurationMs: number;
}

export async function processDocumentWithOCR(
  fileName: string,
  category: string
): Promise<OcrProcessingResult> {
  // Simulate network & vision model inference latency (1.2 seconds)
  await new Promise((resolve) => setTimeout(resolve, 1200));

  const isExpiredSample = fileName.toLowerCase().includes('contract') || fileName.toLowerCase().includes('abc');
  const expiryYear = isExpiredSample ? '2026-06-15' : '2028-12-31';
  const isExpired = new Date(expiryYear).getTime() < Date.now();

  const mockText = `
DIRECTORATE GENERAL OF MINES SAFETY (DGMS)
GOVERNMENT OF INDIA - STATUTORY CERTIFICATION
DOCUMENT: ${fileName.toUpperCase()}
REFERENCE CODE: DGMS/JH/2026/SEC-${Math.floor(1000 + Math.random() * 9000)}
CATEGORY: ${category}
ISSUING AUTHORITY: Central Mining Regulatory Board, Dhanbad
DATE OF ISSUE: 01-JAN-2024
VALID UNTIL: ${expiryYear}
STATUTORY MANDATE: Complies with Section 22 of the Mines Act 1952 and Coal Mines Regulations 2017.
TERMS: Continuous telemetry calibration and quarterly joint inspections required. Non-compliance results in immediate operational suspension.
`.trim();

  return {
    rawText: mockText,
    extractedFields: {
      documentType: category,
      licenseOrCertificateNumber: `DGMS-JH-${Math.floor(10000 + Math.random() * 90000)}`,
      issuingAuthority: 'Directorate General of Mines Safety (DGMS)',
      expiryDate: expiryYear,
      isExpired,
      complianceTerms: 'Quarterly strata verification and CAAQMS telemetry logs mandatory.',
      confidenceScore: 97.4,
    },
    processingDurationMs: 1240,
  };
}
