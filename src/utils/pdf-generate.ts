"use client";

import { saveAs } from "file-saver";
import { DownloadMemberPDFType } from "@/types";
import { PDFFont, PDFPage, RGB } from "pdf-lib";

export default async function generatePDF(data: DownloadMemberPDFType) {
  let PDFDocument, rgb, StandardFonts;
  try {
    ({ PDFDocument, rgb, StandardFonts } = await import("pdf-lib"));
  } catch (error) {
    console.error("Error loading libraries:", error);
    throw new Error("Failed to load required libraries for PDF generation.");
  }

  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();

  // Colors
  const blackColor = rgb(0, 0, 0);
  const darkGrayColor = rgb(0.3, 0.3, 0.3);
  const lightGrayColor = rgb(0.9, 0.9, 0.9);
  const normalGrayColor = rgb(0.6235, 0.6235, 0.6235);

  // Get the data
  const { personalData, medicalData } = data;

  // Create first page
  const page1 = pdfDoc.addPage([595, 842]); // A4 size

  // Embed the standard fonts
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaOblique = await pdfDoc.embedFont(
    StandardFonts.HelveticaOblique
  );

  // ===== HEADER (PAGE 1) =====

  try {
    const logoResponse = await fetch("/LOGO.png");
    const logoImageBytes = await logoResponse.arrayBuffer();
    const logoImage = await pdfDoc.embedPng(logoImageBytes);

    page1.drawImage(logoImage, {
      x: 50,
      y: 730,
      width: 80,
      height: 80,
    });
  } catch (error) {
    page1.drawText("GYM", {
      x: 76,
      y: 780,
      size: 16,
      font: helveticaBold,
      color: darkGrayColor,
    });
    // Logo placeholder
    page1.drawRectangle({
      x: 50,
      y: 760,
      width: 80,
      height: 40,
      color: lightGrayColor,
    });
    console.log(error);
  }

  // Title
  page1.drawText("MEMBERSHIP REGISTRATION FORM", {
    x: 170,
    y: 790,
    size: 21,
    font: helveticaBold,
    color: blackColor,
  });

  page1.drawText("Welcome to Legion Fitness", {
    x: 170,
    y: 770,
    size: 12,
    font: helveticaBold,
    color: blackColor,
  });

  page1.drawText(
    "We are excited to have you on board. Please fill out this application form",
    {
      x: 170,
      y: 751,
      size: 11,
      font: helvetica,
      color: blackColor,
    }
  );

  page1.drawText("completely to get started with your fitness journey", {
    x: 170,
    y: 738,
    size: 11,
    font: helvetica,
    color: blackColor,
  });

  // Date
  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  page1.drawText(`Registration Date: ${dateStr}`, {
    x: 170,
    y: 720,
    size: 10,
    font: helveticaOblique,
    color: darkGrayColor,
  });

  // Decorative line below header
  page1.drawLine({
    start: { x: 50, y: 705 },
    end: { x: 545, y: 705 },
    thickness: 2,
    color: normalGrayColor,
  });

  // ===== PERSONAL INFORMATION SECTION =====
  let yPos = 670;

  page1.drawText("Personal Information", {
    x: 60,
    y: yPos + 10,
    size: 13,
    font: helveticaBold,
    color: blackColor,
  });

  yPos -= 20;

  // Helper function for drawing key-value pairs
  const drawField = (
    key: string,
    value: string | boolean | null,
    x: number,
    y: number,
    maxWidth: number = 400 // wider line for long fields
  ) => {
    // Draw the label in bold
    page1.drawText(key, {
      x,
      y,
      size: 11,
      font: helveticaBold,
      color: blackColor,
    });

    // Calculate the width of the label
    const labelWidth = helveticaBold.widthOfTextAtSize(key, 11);

    // Draw a long underline after the label
    const lineStartX = x + labelWidth + 5;
    const lineEndX = x + maxWidth;
    page1.drawLine({
      start: { x: lineStartX, y: y - 2 },
      end: { x: lineEndX, y: y - 2 },
      thickness: 1,
      color: normalGrayColor,
    });

    // If value is provided, draw it on top of the line (optional, comment out if you want blank lines)
    if (value !== undefined && value !== null && value !== "") {
      const valueText = String(value);
      page1.drawText(valueText, {
        x: lineStartX + 2,
        y: y + 1,
        size: 11,
        font: helvetica,
        color: blackColor,
      });
    }
  };

  drawField("1. Full Name:", personalData.name, 70, yPos);
  drawField("2. Email:", personalData.email, 70, yPos - 20);
  yPos -= 20;
  drawField("3. Date of Birth:", personalData.dob, 70, yPos - 20);
  yPos -= 20;
  drawField("4. Gender:", personalData.gender, 70, yPos - 20);
  yPos -= 20;
  drawField("5. Phone:", personalData.phone, 70, yPos - 20);
  yPos -= 20;
  drawField("6. Address:", personalData.address, 70, yPos - 20);

  // Address (might be longer, so give it more space)
  yPos -= 50;

  // ===== MEMBERSHIP DETAILS SECTION =====
  yPos = 470;

  function drawMultiLineField(
    page: PDFPage,
    {
      label,
      x,
      y,
      lineCount = 4,
      lineWidth = 455,
      lineSpacing = 18,
      fonts,
      colors,
      value,
    }: {
      label: string;
      x: number;
      y: number;
      lineCount?: number;
      lineWidth?: number;
      lineSpacing?: number;
      fonts: { bold: PDFFont; regular: PDFFont };
      colors: { black: RGB; darkGray: RGB };
      value: string | string[] | boolean | null;
    }
  ) {
    // Draw the main label in bold
    page.drawText(label, {
      x,
      y,
      size: 11,
      font: fonts.bold,
      color: colors.black,
    });

    let currentY = y - 20;

    // Draw multiple blank lines
    for (let i = 0; i < lineCount; i++) {
      page.drawLine({
        start: { x: x + 10, y: currentY },
        end: { x: x + lineWidth, y: currentY },
        thickness: 1,
        color: normalGrayColor,
      });
      currentY -= lineSpacing;
    }

    if (value !== undefined && value !== null && value !== "") {
      if (Array.isArray(value)) {
        // Join array elements with commas and draw as text
        const valueText = value
          .map((v: string) =>
            v
              .replace(/-/g, " ")
              .replace(/\b\w/g, (c) => c.toUpperCase()) 
              .trim()
          )
          .join(", ");
        page.drawText(valueText, {
          x: x + 10,
          y: y - 16,
          size: 11,
          font: fonts.regular,
          color: colors.black,
        });
      } else {
        // Handle non-array values
        const valueText = String(value);
        page.drawText(valueText, {
          x: x + 10,
          y: y - 16,
          size: 11,
          font: fonts.regular,
          color: colors.black,
        });
      }
    }
  }

  page1.drawLine({
    start: { x: 50, y: yPos + 40 },
    end: { x: 545, y: yPos + 40 },
    thickness: 2,
    color: normalGrayColor,
  });

  page1.drawText("Health and Fitness Information", {
    x: 60,
    y: yPos + 10,
    size: 13,
    font: helveticaBold,
    color: blackColor,
  });

  yPos -= 20;

  drawField("7. Height (cm):", `${medicalData.height} cm`, 70, yPos);
  drawField("8. Weight (kg)", `${medicalData.weight} kg`, 70, yPos - 20);
  yPos -= 40;

  drawMultiLineField(page1, {
    label:
      "9. Do you have any medical conditions or injuries that we should be aware of?",
    x: 70,
    y: yPos,
    lineCount: 2,
    lineWidth: 455,
    lineSpacing: 18,
    fonts: { bold: helveticaBold, regular: helvetica },
    colors: { black: blackColor, darkGray: darkGrayColor },
    value: medicalData.health_conditions,
  });

  yPos -= 60;

  drawMultiLineField(page1, {
    label: "10. Are you currently taking any medications?",
    x: 70,
    y: yPos,
    lineCount: 3,
    lineWidth: 455,
    lineSpacing: 18,
    fonts: { bold: helveticaBold, regular: helvetica },
    colors: { black: blackColor, darkGray: darkGrayColor },
    value: medicalData.medications,
  });

  yPos -= 80;

  drawMultiLineField(page1, {
    label: "11. What are your fitness goals?",
    x: 70,
    y: yPos,
    lineCount: 2,
    lineWidth: 455,
    lineSpacing: 18,
    fonts: { bold: helveticaBold, regular: helvetica },
    colors: { black: blackColor, darkGray: darkGrayColor },
    value: medicalData.fitness_goals,
  });

  yPos -= 60;

  drawMultiLineField(page1, {
    label:
      "12. Have you had any recent injuries or surgeries in past 12 months?",
    x: 70,
    y: yPos,
    lineCount: 2,
    lineWidth: 455,
    lineSpacing: 18,
    fonts: { bold: helveticaBold, regular: helvetica },
    colors: { black: blackColor, darkGray: darkGrayColor },
    value: medicalData.recent_injuries,
  });

  yPos -= 60;

  drawField(
    "13. How about your GYM experience:",
    medicalData.exercise_history,
    70,
    yPos
  );

  // ===== FOOTER PAGE 1 =====
  const footerY1 = 50;

  page1.drawLine({
    start: { x: 50, y: footerY1 + 15 },
    end: { x: 545, y: footerY1 + 15 },
    thickness: 1,
    color: lightGrayColor,
  });

  page1.drawText("Gym Management System - Membership Registration - Page 1", {
    x: 50,
    y: footerY1,
    size: 8,
    font: helveticaOblique,
    color: darkGrayColor,
  });

  // ===== CREATE PAGE 2 =====
  const page2 = pdfDoc.addPage([595, 842]);

  // ===== MEDICAL INFORMATION SECTION =====
  let y2Pos = 760; // Start position for page 2

  page2.drawLine({
    start: { x: 50, y: y2Pos + 40 },
    end: { x: 545, y: y2Pos + 40 },
    thickness: 2,
    color: normalGrayColor,
  });

  page2.drawText("Membership Options", {
    x: 60,
    y: y2Pos + 10,
    size: 14,
    font: helveticaBold,
    color: blackColor,
  });

  y2Pos -= 20;

  // Create a function similar to drawField but for page2
  const drawField2 = (
    key: string,
    value: string | boolean | null | undefined,
    x: number,
    y: number,
    maxWidth: number = 400
  ) => {
    page2.drawText(key, {
      x,
      y,
      size: 11,
      font: helveticaBold,
      color: blackColor,
    });

    // Calculate the width of the label
    const labelWidth = helveticaBold.widthOfTextAtSize(key, 11);

    // Draw a long underline after the label
    const lineStartX = x + labelWidth + 5;
    const lineEndX = x + maxWidth;
    page2.drawLine({
      start: { x: lineStartX, y: y - 2 },
      end: { x: lineEndX, y: y - 2 },
      thickness: 1,
      color: normalGrayColor,
    });

    // If value is provided, draw it on top of the line (optional, comment out if you want blank lines)
    if (value !== undefined && value !== null && value !== "") {
      const valueText = String(value);
      page2.drawText(valueText, {
        x: lineStartX + 2,
        y: y + 1,
        size: 11,
        font: helvetica,
        color: blackColor,
      });
    }
  };

  drawField2(
    "14. Preferred Membership Package:",
    medicalData.plan_id,
    70,
    y2Pos
  );
  drawField2(
    "15. Preferred Workout Time Slot:",
    medicalData.planTime,
    70,
    y2Pos - 20
  );

  y2Pos -= 100;

  page2.drawLine({
    start: { x: 50, y: y2Pos + 40 },
    end: { x: 545, y: y2Pos + 40 },
    thickness: 2,
    color: normalGrayColor,
  });

  page2.drawText("Emergency Contact Information", {
    x: 60,
    y: y2Pos + 10,
    size: 14,
    font: helveticaBold,
    color: blackColor,
  });

  y2Pos -= 20;

  drawField2(
    "16. Emergency Contact Name:",
    medicalData.emergency_name,
    70,
    y2Pos
  );
  drawField2(
    "17. Relationship:",
    medicalData.emergency_relationship,
    70,
    y2Pos - 20
  );
  y2Pos -= 20;
  drawField2(
    "18. Phone Number:",
    medicalData.emergency_contact,
    70,
    y2Pos - 20
  );

  y2Pos -= 100;

  page2.drawLine({
    start: { x: 50, y: y2Pos + 40 },
    end: { x: 545, y: y2Pos + 40 },
    thickness: 2,
    color: normalGrayColor,
  });

  page2.drawText("Acknowledgment and Agreement", {
    x: 60,
    y: y2Pos + 10,
    size: 14,
    font: helveticaBold,
    color: blackColor,
  });

  y2Pos -= 10;

  page2.drawText(
    `I hereby confirm that the information provided above is accurate and complete to the best 
of my knowledge.`,
    {
      x: 70,
      y: y2Pos - 10,
      size: 11,
      font: helvetica,
      color: blackColor,
      lineHeight: 15,
    }
  );

  y2Pos -= 40;

  page2.drawText(
    `I understand that participation in gym activities involves inherent risks, and I agree to
follow all gym rules and instructions provided by the trainers.`,
    {
      x: 70,
      y: y2Pos - 10,
      size: 11,
      font: helvetica,
      color: blackColor,
      lineHeight: 15,
    }
  );

  y2Pos -= 150;

  // Add signature line
  page2.drawLine({
    start: { x: 60, y: y2Pos },
    end: { x: 300, y: y2Pos },
    thickness: 1,
    color: darkGrayColor,
  });

  page2.drawText("Member Signature", {
    x: 130,
    y: y2Pos - 20,
    size: 11,
    font: helveticaOblique,
    color: blackColor,
  });

  page2.drawLine({
    start: { x: 350, y: y2Pos },
    end: { x: 490, y: y2Pos },
    thickness: 1,
    color: darkGrayColor,
  });

  page2.drawText("Date", {
    x: 410,
    y: y2Pos - 20,
    size: 11,
    font: helveticaOblique,
    color: blackColor,
  });

  // ===== FOOTER PAGE 2 =====
  const footerY2 = 50;

  page2.drawLine({
    start: { x: 50, y: footerY1 + 15 },
    end: { x: 545, y: footerY1 + 15 },
    thickness: 1,
    color: lightGrayColor,
  });

  page2.drawText("Gym Management System - Membership Registration - Page 2", {
    x: 50,
    y: footerY2,
    size: 8,
    font: helveticaOblique,
    color: darkGrayColor,
  });

  // Add page numbers to previous pages
  page1.drawText("Page 1 of 2", {
    x: 480,
    y: footerY1,
    size: 8,
    font: helveticaOblique,
    color: darkGrayColor,
  });

  page2.drawText("Page 2 of 2", {
    x: 480,
    y: footerY1,
    size: 8,
    font: helveticaOblique,
    color: darkGrayColor,
  });

  // Serialize the PDF document to bytes (a Uint8Array)
  try {
    const pdfBytes = await pdfDoc.save();

    // Create a Blob from the PDF bytes
    const blob = new Blob([pdfBytes], { type: "application/pdf" });

    // Generate filename with member's name and current date
    const memberName = personalData.name.replace(/\s+/g, "_");
    const dateForFilename = today.toISOString().split("T")[0]; // YYYY-MM-DD format
    const filename = `${memberName}_Registration_${dateForFilename}.pdf`;

    // Use FileSaver.js to save the PDF
    saveAs(blob, filename);

    return { success: true, filename };
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
}
