/**
 * PDF Generation Utility for Medical Prescriptions
 * 
 * Generates professional medical prescription PDFs with:
 * - RUET Medical Center branding
 * - Professional medical layout
 * - Patient and doctor information
 * - Medication details with dosage instructions
 * - Medical advice and follow-up information
 */

import jsPDF from 'jspdf';
import { Prescription } from '@/services/api';

export const generatePrescriptionPDF = (prescription: Prescription): void => {
  // Create a temporary PDF to measure content
  const tempPdf = new jsPDF();

  // Calculate dynamic height based on actual content
  let estimatedHeight = 80; // Base height for header and patient info

  // Measure symptoms text
  tempPdf.setFontSize(10);
  const tempSymptomsLines = tempPdf.splitTextToSize(prescription.symptoms, 170);
  estimatedHeight += (tempSymptomsLines.length * 4) + 15;

  // Measure diagnosis text
  const tempDiagnosisLines = tempPdf.splitTextToSize(prescription.diagnosis, 170);
  estimatedHeight += (tempDiagnosisLines.length * 4) + 20;

  // Add height for medications table
  estimatedHeight += 25; // Table header
  prescription.medications.forEach(med => {
    estimatedHeight += 12; // Base row height
    if (med.instructions) {
      const tempInstructionLines = tempPdf.splitTextToSize(`Instructions: ${med.instructions}`, 170);
      estimatedHeight += (tempInstructionLines.length * 3) + 3;
    }
  });
  estimatedHeight += 15; // Table spacing

  // Add height for advice if present
  if (prescription.advice) {
    const tempAdviceLines = tempPdf.splitTextToSize(prescription.advice, 170);
    estimatedHeight += (tempAdviceLines.length * 4) + 25;
  }

  // Add height for footer
  estimatedHeight += 60;

  // Create PDF with dynamic size (width: 210mm, height: calculated)
  const pageWidth = 210; // Standard width in mm
  const pageHeight = Math.max(estimatedHeight, 180); // Minimum height 180mm

  const pdf = new jsPDF({
    unit: 'mm',
    format: [pageWidth, pageHeight]
  });

  // Color Palette
  const primaryText = '#1e293b';
  const accentColor = '#0ea5e9';
  const borderColor = '#e2e8f0';
  const backgroundColor = '#f5f5f5';
  const footerText = '#6b7280';
  const lightBackground = '#f8fafc';

  // Convert hex colors to RGB for jsPDF
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  const primaryTextRgb = hexToRgb(primaryText);
  const accentRgb = hexToRgb(accentColor);
  const borderRgb = hexToRgb(borderColor);
  const backgroundRgb = hexToRgb(backgroundColor);
  const footerTextRgb = hexToRgb(footerText);
  const lightBackgroundRgb = hexToRgb(lightBackground);

  let yPosition = 0;

  // Blue Header Background - Theme Color
  const headerHeight = 35;
  pdf.setFillColor(37, 99, 235); // Blue theme color rgb(37, 99, 235)
  pdf.rect(0, 0, pageWidth, headerHeight, 'F');

  yPosition = 12;

  // Header Section - Center-aligned with white text
  pdf.setTextColor(255, 255, 255); // White text
  pdf.setFont('times', 'bold');
  pdf.setFontSize(18);
  pdf.text('RUET Medical Center', pageWidth / 2, yPosition, { align: 'center' });

  yPosition += 6;
  pdf.setFont('times', 'normal');
  pdf.setFontSize(10);
  pdf.text('Rajshahi University of Engineering & Technology', pageWidth / 2, yPosition, { align: 'center' });

  yPosition += 8;
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  pdf.text('MEDICAL PRESCRIPTION', pageWidth / 2, yPosition, { align: 'center' });

  // Date in top-right corner (white text on blue background)
  const prescriptionDate = new Date(prescription.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.setTextColor(255, 255, 255); // White text
  pdf.text(`Date: ${prescriptionDate}`, pageWidth - 10, 15, { align: 'right' });

  yPosition = headerHeight + 10; // Position after blue header

  // No horizontal line needed as blue background provides separation

  // Patient Information Block - Light gray bordered box
  const infoBoxHeight = 18;

  // Background
  pdf.setFillColor(backgroundRgb.r, backgroundRgb.g, backgroundRgb.b);
  pdf.rect(10, yPosition, pageWidth - 20, infoBoxHeight, 'F');

  // Border
  pdf.setDrawColor(borderRgb.r, borderRgb.g, borderRgb.b);
  pdf.setLineWidth(0.2);
  pdf.rect(10, yPosition, pageWidth - 20, infoBoxHeight, 'S');

  // Two-column layout within the box
  pdf.setTextColor(primaryTextRgb.r, primaryTextRgb.g, primaryTextRgb.b);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);

  // Left column - Patient info
  const leftColumnX = 15;
  pdf.text(`Patient Name: ${prescription.patientName}`, leftColumnX, yPosition + 6);
  pdf.text(`Patient ID: ${prescription.patientId}`, leftColumnX, yPosition + 12);

  // Right column - Doctor info
  const rightColumnX = pageWidth / 2 + 5;
  pdf.text(`Doctor: ${prescription.doctorName}`, rightColumnX, yPosition + 6);
  pdf.text(`RUET Medical Center`, rightColumnX, yPosition + 12);

  yPosition += infoBoxHeight + 10;

  // Symptoms Section
  pdf.setTextColor(primaryTextRgb.r, primaryTextRgb.g, primaryTextRgb.b);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Symptoms:', 10, yPosition);

  pdf.setTextColor(primaryTextRgb.r, primaryTextRgb.g, primaryTextRgb.b);
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  const symptomsLines = pdf.splitTextToSize(prescription.symptoms, pageWidth - 20);
  pdf.text(symptomsLines, 10, yPosition + 5);

  yPosition += 5 + (symptomsLines.length * 3) + 6;

  // Diagnosis Section
  pdf.setTextColor(primaryTextRgb.r, primaryTextRgb.g, primaryTextRgb.b);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Diagnosis:', 10, yPosition);

  pdf.setTextColor(primaryTextRgb.r, primaryTextRgb.g, primaryTextRgb.b);
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  const diagnosisLines = pdf.splitTextToSize(prescription.diagnosis, pageWidth - 20);
  pdf.text(diagnosisLines, 10, yPosition + 5);

  yPosition += 5 + (diagnosisLines.length * 3) + 8;

  // Medications Section
  pdf.setTextColor(primaryTextRgb.r, primaryTextRgb.g, primaryTextRgb.b);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Prescribed Medications', 10, yPosition);

  yPosition += 8;

  // Professional Medications Table
  const tableStartX = 10;
  const tableWidth = pageWidth - 20;
  const colWidths = [tableWidth * 0.3, tableWidth * 0.2, tableWidth * 0.25, tableWidth * 0.25];
  const rowHeight = 8;
  const tableHeaderHeight = 7;

  // Table Header
  pdf.setFillColor(backgroundRgb.r, backgroundRgb.g, backgroundRgb.b);
  pdf.rect(tableStartX, yPosition, tableWidth, tableHeaderHeight, 'F');

  // Header borders
  pdf.setDrawColor(borderRgb.r, borderRgb.g, borderRgb.b);
  pdf.setLineWidth(0.2);
  pdf.rect(tableStartX, yPosition, tableWidth, tableHeaderHeight, 'S');

  // Header text
  pdf.setTextColor(primaryTextRgb.r, primaryTextRgb.g, primaryTextRgb.b);
  pdf.setFontSize(7);
  pdf.setFont('helvetica', 'bold');

  let currentX = tableStartX + 3;
  pdf.text('Medicine', currentX, yPosition + 5);
  currentX += colWidths[0];
  pdf.text('Dosage', currentX, yPosition + 5);
  currentX += colWidths[1];
  pdf.text('Frequency', currentX, yPosition + 5);
  currentX += colWidths[2];
  pdf.text('Duration', currentX, yPosition + 5);

  yPosition += tableHeaderHeight;

  // Medications Rows
  prescription.medications.forEach((medication, index) => {
    const instructionsHeight = medication.instructions ? 5 : 0;
    const totalRowHeight = rowHeight + instructionsHeight;

    // Row background (alternating)
    if (index % 2 === 0) {
      pdf.setFillColor(lightBackgroundRgb.r, lightBackgroundRgb.g, lightBackgroundRgb.b);
      pdf.rect(tableStartX, yPosition, tableWidth, totalRowHeight, 'F');
    }

    // Row borders
    pdf.setDrawColor(borderRgb.r, borderRgb.g, borderRgb.b);
    pdf.rect(tableStartX, yPosition, tableWidth, totalRowHeight, 'S');

    // Vertical lines for columns
    currentX = tableStartX;
    for (let i = 0; i < colWidths.length - 1; i++) {
      currentX += colWidths[i];
      pdf.line(currentX, yPosition, currentX, yPosition + totalRowHeight);
    }

    // Cell content
    pdf.setTextColor(primaryTextRgb.r, primaryTextRgb.g, primaryTextRgb.b);
    pdf.setFontSize(7);
    pdf.setFont('helvetica', 'normal');

    currentX = tableStartX + 3;
    pdf.text(medication.name, currentX, yPosition + 5);
    currentX += colWidths[0];
    pdf.text(medication.dosage, currentX, yPosition + 5);
    currentX += colWidths[1];
    pdf.text(medication.frequency, currentX, yPosition + 5);
    currentX += colWidths[2];
    pdf.text(medication.duration, currentX, yPosition + 5);

    // Instructions (if any)
    if (medication.instructions) {
      pdf.setFontSize(6);
      pdf.setFont('helvetica', 'italic');
      pdf.setTextColor(footerTextRgb.r, footerTextRgb.g, footerTextRgb.b);
      const instructionText = `Instructions: ${medication.instructions}`;
      const instructionLines = pdf.splitTextToSize(instructionText, tableWidth - 6);
      pdf.text(instructionLines, tableStartX + 3, yPosition + rowHeight + 2);
    }

    yPosition += totalRowHeight;
  });

  yPosition += 10;

  // Medical Advice Section
  if (prescription.advice) {
    pdf.setTextColor(primaryTextRgb.r, primaryTextRgb.g, primaryTextRgb.b);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Medical Advice:', 10, yPosition);

    yPosition += 5;

    // Light background box for advice
    const adviceLines = pdf.splitTextToSize(prescription.advice, pageWidth - 26);
    const adviceBoxHeight = (adviceLines.length * 3) + 8;

    pdf.setFillColor(lightBackgroundRgb.r, lightBackgroundRgb.g, lightBackgroundRgb.b);
    pdf.rect(10, yPosition, pageWidth - 20, adviceBoxHeight, 'F');

    pdf.setDrawColor(borderRgb.r, borderRgb.g, borderRgb.b);
    pdf.setLineWidth(0.1);
    pdf.rect(10, yPosition, pageWidth - 20, adviceBoxHeight, 'S');

    pdf.setTextColor(primaryTextRgb.r, primaryTextRgb.g, primaryTextRgb.b);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.text(adviceLines, 13, yPosition + 5);

    yPosition += adviceBoxHeight + 8;
  }

  // Follow-up and Signature Section - Two-column layout
  const followUpSectionY = yPosition;

  if (prescription.followUpDate) {
    // Left column - Follow-up
    pdf.setTextColor(primaryTextRgb.r, primaryTextRgb.g, primaryTextRgb.b);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Follow-up: ${prescription.followUpDate}`, 10, followUpSectionY);
  }

  // Right column - Doctor's Signature
  pdf.setTextColor(primaryTextRgb.r, primaryTextRgb.g, primaryTextRgb.b);
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Doctor\'s Signature: ________________________', pageWidth - 10, followUpSectionY, { align: 'right' });

  yPosition += 15;

  // Footer Section - Dynamic positioning
  yPosition += 8; // Add some space before footer
  const footerStartY = yPosition;

  // Horizontal separator line
  pdf.setDrawColor(borderRgb.r, borderRgb.g, borderRgb.b);
  pdf.setLineWidth(0.2);
  pdf.line(10, footerStartY, pageWidth - 10, footerStartY);

  let footerY = footerStartY + 8;

  // Contact Information - Center-aligned
  pdf.setTextColor(footerTextRgb.r, footerTextRgb.g, footerTextRgb.b);
  pdf.setFontSize(7);
  pdf.setFont('helvetica', 'normal');
  pdf.text('RUET Medical Center | Phone: +880 1712-345678 | Email: medical@ruet.ac.bd',
           pageWidth / 2, footerY, { align: 'center' });

  footerY += 5;

  // Prescription details
  pdf.setFontSize(6);
  pdf.text(`Prescription ID: ${prescription._id}`, pageWidth / 2, footerY, { align: 'center' });

  footerY += 4;
  pdf.text('Important: This prescription is valid for 30 days from the date of issue.',
           pageWidth / 2, footerY, { align: 'center' });

  footerY += 3;
  pdf.text('Please consult your doctor before making any changes to the medication.',
           pageWidth / 2, footerY, { align: 'center' });

  // Author Credit - Bottom center, bold
  footerY += 8;
  pdf.setTextColor(primaryTextRgb.r, primaryTextRgb.g, primaryTextRgb.b);
  pdf.setFontSize(6);
  pdf.setFont('helvetica', 'bold');
  pdf.text('This whole system is made by Fardin Khan, Dept of CSE, Roll 2203018',
           pageWidth / 2, footerY, { align: 'center' });

  // Generate filename with proper formatting
  const dateForFilename = new Date(prescription.date).toLocaleDateString('en-CA'); // YYYY-MM-DD format
  const fileName = `RUET_Medical_Prescription_${prescription.patientName.replace(/\s+/g, '_')}_${dateForFilename}.pdf`;

  // Save the PDF
  pdf.save(fileName);
};

export const generatePrescriptionPreview = (prescription: Prescription): string => {
  // This function can be used to generate a preview URL for the prescription
  // For now, it returns a placeholder
  return `Prescription for ${prescription.patientName} - ${new Date(prescription.date).toLocaleDateString()}`;
};
