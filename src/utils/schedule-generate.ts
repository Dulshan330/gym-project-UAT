"use client";

import { saveAs } from "file-saver";
import { WorkoutDayGroup } from "@/types";
import { PDFPage } from "pdf-lib";

export default async function generateSchedulePDF(
  member: string,
  gender: string,
  validTime: string,
  workout: WorkoutDayGroup[]
) {
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

  // Embed the standard fonts
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Current Date
  const today = new Date();

  // Gender
  const genderText = () => {
    switch (gender) {
      case "Male":
        return "Mr.";
      case "Female":
        return "Ms.";
      default:
        return "";
    }
  };

  // Pagination variables
  let currentPage: PDFPage | null = null;
  let currentY = 0;
  const pageHeight = 842; // A4 height in points
  const pageWidth = 595; // A4 width in points
  const margin = 50; // Bottom margin
  const rowHeight = 22; // Height of each table row
  const tableGap = 40; // Gap between tables

  // Function to add a new page
  const addNewPage = () => {
    currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
    currentY = pageHeight - 50; // Start below top margin
    return currentPage;
  };

  // Add first page
  addNewPage();

  // Draw header function (only on first page)
  const drawHeader = async (page: PDFPage) => {
    let headerYPos = pageHeight - 70;

    try {
      const logoResponse = await fetch("/LOGO.png");
      const logoImageBytes = await logoResponse.arrayBuffer();
      const logoImage = await pdfDoc.embedPng(logoImageBytes);

      page.drawImage(logoImage, {
        x: 40,
        y: headerYPos - 100,
        width: 120,
        height: 120,
      });
    } catch (error) {
      page.drawText("GYM", {
        x: 76,
        y: 780,
        size: 16,
        font: helveticaBold,
        color: darkGrayColor,
      });
      // Logo placeholder
      page.drawRectangle({
        x: 50,
        y: 760,
        width: 80,
        height: 40,
        color: lightGrayColor,
      });
      console.log(error);
    }

    // Header text
    page.drawText("RAVISHKA DILAN", {
      x: 180,
      y: headerYPos,
      size: 21,
      font: helveticaBold,
      color: blackColor,
    });

    headerYPos -= 10;
    page.drawLine({
      start: { x: 180, y: headerYPos },
      end: { x: 540, y: headerYPos },
      thickness: 2,
      color: blackColor,
    });

    headerYPos -= 20;
    const headerDescriptionTextSize = 10;

    page.drawText("Managing Director", {
      x: 180,
      y: headerYPos,
      size: headerDescriptionTextSize,
      font: helveticaBold,
      color: blackColor,
    });

    headerYPos -= 15;

    page.drawText("ISSA - Certified Personal Trainer & Nutritionist", {
      x: 180,
      y: headerYPos,
      size: headerDescriptionTextSize,
      font: helveticaBold,
      color: blackColor,
    });

    headerYPos -= 15;

    page.drawText(
      "IASS - Certified in Bodybuilding/ Nutrition/ Personal Trainer/ Weight loss specialist",
      {
        x: 180,
        y: headerYPos,
        size: headerDescriptionTextSize,
        font: helveticaBold,
        color: blackColor,
        maxWidth: 360,
        lineHeight: 15,
      }
    );

    headerYPos -= 30;

    page.drawText("SLBBFF level 1 Approved Coach", {
      x: 180,
      y: headerYPos,
      size: headerDescriptionTextSize,
      font: helveticaBold,
      color: blackColor,
    });

    return headerYPos - 30; // Return Y position after header
  };

  // Draw member details
  const drawMemberDetails = (page: PDFPage, yPos: number) => {
    page.drawText(`Name: ${genderText()} ${member}`, {
      x: 50,
      y: yPos,
      size: 10,
      font: helveticaBold,
      color: blackColor,
    });

    page.drawText(`Valid Period: ${validTime}`, {
      x: 50,
      y: yPos - 15,
      size: 10,
      font: helveticaBold,
      color: blackColor,
    });

    return yPos - 50; // Return Y position after details
  };

  // Draw workout table
  const drawWorkoutTable = (
    page: PDFPage,
    dayGroup: WorkoutDayGroup,
    startY: number
  ) => {
    const tableHeaders = [
      "#",
      "EXERCISE",
      "TARGET MUSCLE",
      "SETS",
      "REPS",
      "REST",
    ];
    const colWidths = [30, 165, 110, 50, 80, 60];
    let tableY = startY;

    // Prepare table rows
    const tableRows: string[][] = [
      ...(dayGroup.day !== "Abdominal"
        ? [
            [
              "",
              dayGroup.day
                .replace(/_/g, " ")
                .replace(/^./, (c) => c.toUpperCase()),
              "",
              "",
              "",
              "",
            ],
            ["", "Warmup", "5 min", "", "", ""],
            ["", "Dynamic stretchings", "", "", "", ""],
          ]
        : []),
      ...dayGroup.exercises.map((ex, idx) => [
        (idx + 1).toString(),
        ex.exercises?.exerciseName || "",
        ex.exercises?.targetMuscleGroup || "",
        ex.sets || "",
        ex.reps || "",
        ex.rest || "",
      ]),
      ...(dayGroup.day !== "Abdominal"
        ? [
            ["", "", "", "", "", ""],
            ["", "Abs", "", "", "", ""],
            ["", "Warmdown", "5 min", "", "", ""],
            ["", "Static stretchings", "", "", "", ""],
          ]
        : []),
    ];

    // Draw table headers
    let x = 50;
    for (let i = 0; i < tableHeaders.length; i++) {
      page.drawRectangle({
        x,
        y: tableY,
        width: colWidths[i],
        height: rowHeight,
        color: lightGrayColor,
        borderColor: blackColor,
        borderWidth: 1,
      });
      page.drawText(tableHeaders[i], {
        x: x + 7,
        y: tableY + 6,
        size: 10,
        font: helveticaBold,
        color: blackColor,
      });
      x += colWidths[i];
    }

    // Draw table rows
    tableY -= rowHeight;
    for (const row of tableRows) {
      x = 50;
      for (let i = 0; i < row.length; i++) {
        page.drawRectangle({
          x,
          y: tableY,
          width: colWidths[i],
          height: rowHeight,
          color: i === 0 ? lightGrayColor : undefined,
          borderColor: blackColor,
          borderWidth: 1,
        });
        if (row[i]) {
          page.drawText(row[i], {
            x: x + 7,
            y: tableY + 6,
            size: 10,
            font: helveticaBold,
            color: blackColor,
          });
        }
        x += colWidths[i];
      }
      tableY -= rowHeight;
    }

    return tableY - tableGap; // Return Y position after table
  };

  // ===== MAIN RENDERING LOGIC =====

  // Draw header and member details only on first page
  const afterHeaderY = await drawHeader(currentPage!);
  const afterDetailsY = drawMemberDetails(currentPage!, afterHeaderY);
  currentY = afterDetailsY;

  // Draw workout tables with pagination
  for (const dayGroup of workout) {
    // Calculate required height for this table
    const numRows = 8 + dayGroup.exercises.length; // Header + rows
    const requiredHeight = (numRows + 1) * rowHeight + tableGap; // +1 for header row

    // Check if we need a new page
    if (currentY - requiredHeight < margin) {
      addNewPage();
      currentY = pageHeight - 70; // Reset Y position for new page
    }

    // --- ADD YOUR CAPTION DRAWING CODE HERE ---

    if (dayGroup.day === "Abdominal") {
      currentPage!.drawText(
        ` ${dayGroup.day
          .replace(/_/g, " ")
          .replace(/^./, (c) => c.toUpperCase())}`,
        {
          x: 50,
          y: currentY,
          size: 13,
          font: helveticaBold,
          color: blackColor,
        }
      );
      currentY -= 30;
    }

    // Draw the table
    currentY = drawWorkoutTable(currentPage!, dayGroup, currentY);
  }

  // ===== SAVE THE PDF =====
  try {
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const memberName = member.replace(/\s+/g, "_");
    const dateForFilename = today.toISOString().split("T")[0];
    const filename = `${memberName}_Schedule_${dateForFilename}.pdf`;

    saveAs(blob, filename);
    return { success: true, filename };
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
}
