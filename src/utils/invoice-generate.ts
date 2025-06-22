"use client";

import { saveAs } from "file-saver";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: string;
  customerName: string;
  customerPhone: string;
  serviceName: string;
  serviceDetails: string;
  serviceTime: string;
  amount: string;
  paymentMethod: "Cash" | "Bank Transfer" | "Credit/Debit Card";
  paymentAmount?: string;
  discountAmount: string | undefined;
}

export async function generateInvoice(data: InvoiceData) {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();

  // Add a page
  const page = pdfDoc.addPage([595, 842]); // A4 size

  // Define colors
  const black = rgb(0, 0, 0);
  const darkGray = rgb(0.3, 0.3, 0.3);
  const lightGray = rgb(0.9, 0.9, 0.9);
  const white = rgb(1, 1, 1);
  const brandBlue = rgb(0.1, 0.2, 0.4); // Legion Fitness brand color

  // Embed fonts
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Embed icons
  const [mailIconBytes, phoneIconBytes, webIconBytes] = await Promise.all([
    fetch("/icons/mail.png").then((res) => res.arrayBuffer()),
    fetch("/icons/phone.png").then((res) => res.arrayBuffer()),
    fetch("/icons/web.png").then((res) => res.arrayBuffer()),
  ]);
  const mailIcon = await pdfDoc.embedPng(mailIconBytes);
  const phoneIcon = await pdfDoc.embedPng(phoneIconBytes);
  const webIcon = await pdfDoc.embedPng(webIconBytes);

  // Helper function to draw text
  const drawText = (
    text: string | number | undefined,
    x: number,
    y: number,
    { font = fontRegular, size = 12, color = black } = {}
  ) => {
    page.drawText(String(text), { x, y, size, font, color });
  };

  // Helper function to draw filled rectangle
  const drawRect = (
    x: number,
    y: number,
    width: number,
    height: number,
    color = lightGray
  ) => {
    page.drawRectangle({ x, y, width, height, color });
  };

  // Add logo image instead of placeholder text
  try {
    // Fetch the logo image (you need to adjust the path to your actual logo location)
    const logoResponse = await fetch("/LOGO.png");
    const logoImageBytes = await logoResponse.arrayBuffer();

    // Embed the image in the PDF
    const logoImage = await pdfDoc.embedPng(logoImageBytes);
    // const logoDims = logoImage.scale(0.5); // Scale the logo to 50% of its original size

    // Draw the logo image
    page.drawImage(logoImage, {
      x: 100,
      y: 670,
      width: 160,
      height: 160,
    });
  } catch (error) {
    console.error("Error loading logo:", error);
    // Fallback to text if image loading fails
    drawRect(50, 730, 100, 40, lightGray);
    drawText("LEGION", 65, 755, { font: fontBold, size: 16, color: brandBlue });
    drawText("FITNESS", 65, 738, {
      font: fontBold,
      size: 16,
      color: brandBlue,
    });
  }

  page.drawLine({
    start: { x: 297, y: 790 },
    end: { x: 297, y: 710 },
    thickness: 2,
    color: black,
    opacity: 0.75,
  });

  let headerYpos = 760;

  drawText("54/B, Nugegoda Road,", 330, headerYpos, {
    font: fontRegular,
    size: 12,
  });
  drawText("Pepiliyana, Nugegoda,", 330, (headerYpos -= 15), {
    font: fontRegular,
    size: 12,
  });
  drawText("Sri Lanka", 330, (headerYpos -= 15), {
    font: fontRegular,
    size: 12,
  });

  // header information
  // Icon size
  const iconSize = 14;

  // Draw website icon and text
  page.drawImage(webIcon, {
    x: 60,
    y: (headerYpos -= 60),
    width: iconSize,
    height: iconSize,
  });
  drawText("www.legionfitness.lk", 60 + iconSize + 5, (headerYpos += 2), {
    font: fontRegular,
    size: 13,
  });

  // Draw phone icon and text
  page.drawImage(phoneIcon, {
    x: 220,
    y: (headerYpos -= 2),
    width: iconSize,
    height: iconSize,
  });
  drawText("+94-76-849-0984", 220 + iconSize + 5, (headerYpos += 2), {
    font: fontRegular,
    size: 13,
  });

  // Draw mail icon and text
  page.drawImage(mailIcon, {
    x: 360,
    y: (headerYpos -= 2),
    width: iconSize,
    height: iconSize,
  });
  drawText("legionfitnesslk@gmail.com", 360 + iconSize + 5, (headerYpos += 2), {
    font: fontRegular,
    size: 13,
  });

  page.drawLine({
    start: { x: 50, y: (headerYpos -= 20) },
    end: { x: 545, y: headerYpos },
    thickness: 3,
    color: black,
  });

  let yPos = headerYpos - 30;

  // PAYMENT INVOICE title
  drawText("PAYMENT INVOICE", 200 + iconSize + 5, yPos, {
    font: fontBold,
    size: 16,
  });

  // Invoice details section
  drawText("Invoice Number:", 50, (yPos -= 40), { font: fontBold, size: 12 });
  drawText(data.invoiceNumber, 150, yPos, { size: 12 });

  drawText("Invoice Date:", 50, (yPos -= 20), { font: fontBold, size: 12 });
  drawText(data.invoiceDate, 130, yPos, { size: 12 });

  // Customer information
  drawText("Bill To:", 50, (yPos -= 40), { font: fontBold, size: 12 });
  drawText(data.customerName, 50, (yPos -= 20), { size: 12 });
  drawText(data.customerPhone, 50, (yPos -= 20), { size: 12 });

  // Service description header
  drawText("Description of Services", 50, (yPos -= 40), {
    font: fontBold,
    size: 12,
  });

  let tableHeaderYpos = yPos - 35;

  // Table
  page.drawLine({
    start: { x: 50, y: (yPos -= 20) },
    end: { x: 545, y: yPos },
    thickness: 1,
    color: darkGray,
  });

  page.drawLine({
    start: { x: 50, y: (yPos -= 20) },
    end: { x: 545, y: yPos },
    thickness: 1,
    color: darkGray,
  });

  page.drawLine({
    start: { x: 50, y: (yPos += 20) },
    end: { x: 50, y: (yPos -= 100) },
    thickness: 1,
    color: darkGray,
  });

  page.drawLine({
    start: { x: 297, y: (yPos += 100) },
    end: { x: 297, y: (yPos -= 100) },
    thickness: 1,
    color: darkGray,
  });

  page.drawLine({
    start: { x: 379, y: (yPos += 100) },
    end: { x: 379, y: (yPos -= 100) },
    thickness: 1,
    color: darkGray,
  });

  page.drawLine({
    start: { x: 461, y: (yPos += 100) },
    end: { x: 461, y: (yPos -= 100) },
    thickness: 1,
    color: darkGray,
  });

  page.drawLine({
    start: { x: 545, y: (yPos += 100) },
    end: { x: 545, y: (yPos -= 100) },
    thickness: 1,
    color: darkGray,
  });

  page.drawLine({
    start: { x: 50, y: (yPos += 20) },
    end: { x: 545, y: yPos },
    thickness: 1,
    color: darkGray,
  });

  page.drawLine({
    start: { x: 50, y: (yPos -= 20) },
    end: { x: 545, y: yPos },
    thickness: 1,
    color: darkGray,
  });

  // Table headers
  drawText("Service/Item", 135, tableHeaderYpos, { font: fontBold, size: 12 });
  drawText("Price", 320, tableHeaderYpos, { font: fontBold, size: 12 });
  drawText("Discount", 395, tableHeaderYpos, { font: fontBold, size: 12 });
  drawText("Subtotal", 480, tableHeaderYpos, { font: fontBold, size: 12 });

  tableHeaderYpos -= 20;

  // Table row
  drawText(data.serviceName, 60, tableHeaderYpos, { size: 12 });
  drawText(data.serviceDetails, 60, tableHeaderYpos - 15, { size: 11 });
  drawText(data.serviceTime, 60, tableHeaderYpos - 30, { size: 11 });
  drawText(data.amount, 320, tableHeaderYpos, { size: 12 });
  drawText(data.discountAmount, 405, tableHeaderYpos, { size: 12 });
  drawText(data.paymentAmount, 490, tableHeaderYpos, { size: 12 });

  tableHeaderYpos -= 60;
  // Table footer
  drawText("Total Amount (LKR)", 60, tableHeaderYpos, {
    font: fontBold,
    size: 12,
  });
  drawText(data.paymentAmount, 490, tableHeaderYpos, {
    font: fontBold,
    size: 12,
  });

  tableHeaderYpos -= 40;

  // Payment method
  drawText("Payment Method:", 70, tableHeaderYpos, {
    font: fontBold,
    size: 12,
  });
  drawText(
    `${data.paymentMethod} - Rs. ${data.paymentAmount}/-`,
    175,
    tableHeaderYpos,
    {
      size: 12,
    }
  );

  tableHeaderYpos -= 90;

  // Terms & Conditions
  drawText("Terms & Conditions:", 50, tableHeaderYpos, {
    font: fontBold,
    size: 12,
  });
  drawText(
    "• No refunds after membership activation.",
    60,
    (tableHeaderYpos -= 20),
    {
      size: 12,
    }
  );
  drawText(
    "• For inquiries, contact our support team at +94 76 849 0984 or legionfitnesslk@gmail.com",
    60,
    (tableHeaderYpos -= 20),
    {
      size: 12,
    }
  );

  // Footer message
  const footerY = 80;
  drawText(
    "Thank you for choosing Legion Fitness! Stay strong, stay fit!",
    140,
    footerY,
    {
      font: fontBold,
      size: 11,
      color: black,
    }
  );

  // Add this code after the "Payment method section" and before the "Terms and conditions section"

  // Add PAID seal/stamp
  try {
    // Fetch the PAID seal image
    const paidSealResponse = await fetch("/paid_logo.png");
    const paidSealBytes = await paidSealResponse.arrayBuffer();

    // Embed the seal in the PDF
    const paidSeal = await pdfDoc.embedPng(paidSealBytes);

    // Draw the PAID seal at an angle over the payment details
    // Position it so it's visible but doesn't obscure critical information
    page.drawImage(paidSeal, {
      x: 390, // Position horizontally in the payment section area
      y: 180, // Position vertically near the payment method
      width: 120, // Adjust size as needed based on your seal image
      height: 120,
      opacity: 0.85, // Slightly transparent so it doesn't completely hide content underneath
    });
  } catch (error) {
    console.error("Error loading PAID seal:", error);

    // Fallback - draw a text-based "PAID" stamp if image fails to load
    // Draw a rotated ellipse with "PAID" text
    const paidX = 450;
    const paidY = 120;

    // Draw a red ellipse
    page.drawEllipse({
      x: paidX,
      y: paidY,
      xScale: 40,
      yScale: 20,
      color: rgb(0.9, 0.2, 0.2),
      opacity: 0.7,
    });

    // Add "PAID" text in white
    drawText("PAID", paidX - 20, paidY - 5, {
      font: fontBold,
      size: 16,
      color: white,
    });
  }

  // Generate PDF bytes
  const pdfBytes = await pdfDoc.save();

  // Create blob and download using FileSaver
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  saveAs(blob, `Legion_Fitness_Invoice_${data.invoiceNumber}.pdf`);

  return { success: true };
}
