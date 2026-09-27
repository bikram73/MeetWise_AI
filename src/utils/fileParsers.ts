import { jsPDF } from 'jspdf';
import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';

// Configure pdfjs worker to use unpkg cdn bundle or disable worker for pure client fallback
if (typeof window !== 'undefined' && 'Worker' in window) {
  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
  } catch {
    // If worker fails to attach, pdfjs uses fallback main-thread evaluation
  }
}

/**
 * Extracts plain text from a binary PDF file using pdfjs-dist getTextContent()
 */
async function extractTextFromPdf(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(arrayBuffer),
    useSystemFonts: true,
  });

  const pdfDoc = await loadingTask.promise;
  const numPages = pdfDoc.numPages;
  const textPieces: string[] = [];

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const page = await pdfDoc.getPage(pageNum);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item: any) => ('str' in item ? item.str : ''))
      .join(' ')
      .trim();

    if (pageText) {
      textPieces.push(pageText);
    }
  }

  const combined = textPieces.join('\n\n').trim();
  if (!combined || combined.length < 10) {
    throw new Error('Could not extract readable text from this PDF document.');
  }

  return combined;
}

/**
 * Robust Subtitle / Transcript cleaner for VTT and SRT formats
 */
function cleanSubtitleText(raw: string): string {
  return raw
    .replace(/^WEBVTT[^\r\n]*/gi, '') // Remove WEBVTT header
    .replace(/NOTE(?:\s+[^\r\n]*)?(?:[\r\n]+[\s\S]*?(?=[\r\n]{2,}|$))/gi, '') // Remove NOTE blocks
    .replace(/STYLE(?:\s+[^\r\n]*)?(?:[\r\n]+[\s\S]*?(?=[\r\n]{2,}|$))/gi, '') // Remove STYLE blocks
    .replace(/\d+\r?\n\d\d:\d\d:\d\d[.,]\d\d\d --> \d\d:\d\d:\d\d[.,]\d\d\d[^\r\n]*/g, '') // SRT timestamp blocks with index
    .replace(/\d\d:\d\d(?::\d\d)?(?:[.,]\d\d\d)? --> \d\d:\d\d(?::\d\d)?(?:[.,]\d\d\d)?[^\r\n]*/g, '') // WebVTT cue timings & positioning
    .replace(/<v(?:\s+[^>]+)?>/gi, (match) => {
      // Extract speaker name from <v Alice> tags
      const speaker = match.replace(/<v\s+([^>]+)>/i, '$1: ');
      return speaker;
    })
    .replace(/<\/v>/gi, '')
    .replace(/<[^>]+>/g, '') // Clean other HTML tags
    .replace(/\r?\n\s*\r?\n/g, '\n') // Remove empty gap lines
    .trim();
}

/**
 * Helper utility to read text content from user-uploaded files (.txt, .vtt, .srt, .md, .json, .docx, .pdf)
 */
export async function readTranscriptFromFile(file: File): Promise<string> {
  const extension = file.name.split('.').pop()?.toLowerCase();

  // Plain text formats
  if (['txt', 'vtt', 'srt', 'md', 'json', 'log'].includes(extension || '')) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        let text = (e.target?.result as string) || '';
        if (text.trim().length === 0) {
          reject(new Error('Uploaded file is empty. Please upload a file with meeting dialogue.'));
          return;
        }

        if (extension === 'vtt' || extension === 'srt') {
          text = cleanSubtitleText(text);
        }

        resolve(text);
      };
      reader.onerror = () => reject(new Error('Failed to read text file.'));
      reader.readAsText(file);
    });
  }

  // DOCX format using mammoth
  if (extension === 'docx') {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      const text = result.value.trim();
      if (!text || text.length < 5) {
        throw new Error('Could not extract readable text from DOCX document.');
      }
      return text;
    } catch (err: any) {
      throw new Error(err.message || 'Failed to read DOCX file. Please upload a .txt or .md file.');
    }
  }

  // PDF format using pdfjs-dist
  if (extension === 'pdf') {
    try {
      const text = await extractTextFromPdf(file);
      return text;
    } catch (err: any) {
      throw new Error(err.message || 'Could not parse text from PDF file. Please ensure it contains selectable text.');
    }
  }

  // Unsupported formats
  throw new Error(`Unsupported file type (.${extension}). Please upload .txt, .vtt, .srt, .md, .docx, or .pdf files.`);
}

/**
 * Trigger a browser download for text files
 */
export function downloadFile(content: string, filename: string, mimeType: string = 'text/plain') {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generate and download an executive PDF report with full metadata and wrapped table cells
 */
export function generatePdfReport(data: any) {
  const doc = new jsPDF({
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;
  let cursorY = margin;

  const checkPageBreak = (neededHeight: number) => {
    if (cursorY + neededHeight > pageHeight - margin) {
      doc.addPage();
      cursorY = margin;
    }
  };

  // Primary Header Banner
  doc.setFillColor(26, 115, 232); // #1a73e8
  doc.rect(0, 0, pageWidth, 55, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text('MeetWise AI — Meeting Intelligence Report', margin, 35);

  cursorY = 80;

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(20, 25, 40);
  const titleText = data.meeting_title || 'Meeting Summary & Action Items';
  const splitTitle = doc.splitTextToSize(titleText, contentWidth);
  doc.text(splitTitle, margin, cursorY);
  cursorY += splitTitle.length * 20 + 5;

  // Date & Extraction Coverage
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(110, 120, 135);
  const dateStr = data.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const coverageScore = data.confidence_metrics?.overallScore || 90;
  doc.text(`Generated on: ${dateStr}   |   Extraction Coverage: ${coverageScore}%`, margin, cursorY);
  cursorY += 20;

  // Horizontal Rule
  doc.setDrawColor(225, 230, 240);
  doc.setLineWidth(1);
  doc.line(margin, cursorY, pageWidth - margin, cursorY);
  cursorY += 15;

  // Meeting Objective
  if (data.meeting_objective) {
    checkPageBreak(50);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(26, 115, 232);
    doc.text('Meeting Objective', margin, cursorY);
    cursorY += 16;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(50, 60, 75);
    const splitObj = doc.splitTextToSize(data.meeting_objective, contentWidth);
    doc.text(splitObj, margin, cursorY);
    cursorY += splitObj.length * 14 + 15;
  }

  // Executive Summary
  if (data.summary) {
    checkPageBreak(60);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(26, 115, 232);
    doc.text('Executive Summary', margin, cursorY);
    cursorY += 16;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(50, 60, 75);
    const splitSummary = doc.splitTextToSize(data.summary, contentWidth);
    doc.text(splitSummary, margin, cursorY);
    cursorY += splitSummary.length * 14 + 15;
  }

  // Discussion Points
  if (data.discussion_points && data.discussion_points.length > 0) {
    checkPageBreak(40);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(26, 115, 232);
    doc.text('Key Discussion Points', margin, cursorY);
    cursorY += 16;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(50, 60, 75);
    data.discussion_points.forEach((point: string) => {
      checkPageBreak(20);
      const splitPoint = doc.splitTextToSize(`• ${point}`, contentWidth - 10);
      doc.text(splitPoint, margin + 10, cursorY);
      cursorY += splitPoint.length * 14 + 4;
    });
    cursorY += 10;
  }

  // Decisions
  if (data.decisions && data.decisions.length > 0) {
    checkPageBreak(40);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(16, 163, 127);
    doc.text('Decisions & Consensus', margin, cursorY);
    cursorY += 16;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(50, 60, 75);
    data.decisions.forEach((dec: any) => {
      checkPageBreak(25);
      const isString = typeof dec === 'string';
      const decTitle = isString ? dec : dec.title;
      const decStatus = isString ? 'Approved' : dec.status || 'Approved';
      const decImpact = !isString && dec.impact ? ` [${dec.impact} Impact]` : '';
      const splitDec = doc.splitTextToSize(`✔ [${decStatus}] ${decTitle}${decImpact}`, contentWidth - 10);
      doc.text(splitDec, margin + 10, cursorY);
      cursorY += splitDec.length * 14 + 4;
    });
    cursorY += 10;
  }

  // Risks & Concerns
  if (data.risks && data.risks.length > 0) {
    checkPageBreak(40);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(217, 119, 6);
    doc.text('Risks & Bottlenecks', margin, cursorY);
    cursorY += 16;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(50, 60, 75);
    data.risks.forEach((risk: string) => {
      checkPageBreak(20);
      const splitRisk = doc.splitTextToSize(`⚠ ${risk}`, contentWidth - 10);
      doc.text(splitRisk, margin + 10, cursorY);
      cursorY += splitRisk.length * 14 + 4;
    });
    cursorY += 10;
  }

  // Open Questions
  if (data.open_questions && data.open_questions.length > 0) {
    checkPageBreak(40);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(37, 99, 235);
    doc.text('Open Questions & Follow-ups', margin, cursorY);
    cursorY += 16;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(50, 60, 75);
    data.open_questions.forEach((q: string) => {
      checkPageBreak(20);
      const splitQ = doc.splitTextToSize(`? ${q}`, contentWidth - 10);
      doc.text(splitQ, margin + 10, cursorY);
      cursorY += splitQ.length * 14 + 4;
    });
    cursorY += 10;
  }

  // Action Items Table with Column Auto-Wrapping
  if (data.action_items && data.action_items.length > 0) {
    checkPageBreak(60);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(26, 115, 232);
    doc.text('Action Items', margin, cursorY);
    cursorY += 16;

    const widthTask = 210;
    const widthOwner = 95;
    const widthDue = 90;
    const widthPri = 60;
    const widthStatus = 60;

    const colTask = margin + 5;
    const colOwner = colTask + widthTask;
    const colDue = colOwner + widthOwner;
    const colPri = colDue + widthDue;
    const colStatus = colPri + widthPri;

    // Header row
    doc.setFillColor(240, 244, 250);
    doc.rect(margin, cursorY, contentWidth, 20, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(30, 40, 60);

    doc.text('Task', colTask, cursorY + 14);
    doc.text('Owner', colOwner, cursorY + 14);
    doc.text('Due Date', colDue, cursorY + 14);
    doc.text('Priority', colPri, cursorY + 14);
    doc.text('Status', colStatus, cursorY + 14);
    cursorY += 24;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);

    data.action_items.forEach((item: any, i: number) => {
      const taskLines = doc.splitTextToSize(item.task || '', widthTask - 10);
      const ownerLines = doc.splitTextToSize(item.owner || 'Unassigned', widthOwner - 8);
      const dueLines = doc.splitTextToSize(item.due_date || 'Not Specified', widthDue - 8);
      const maxLines = Math.max(taskLines.length, ownerLines.length, dueLines.length, 1);
      const rowHeight = maxLines * 12 + 8;

      checkPageBreak(rowHeight + 4);

      if (i % 2 === 1) {
        doc.setFillColor(248, 250, 252);
        doc.rect(margin, cursorY - 2, contentWidth, rowHeight, 'F');
      }

      doc.setTextColor(40, 50, 65);
      doc.text(taskLines, colTask, cursorY + 10);
      doc.text(ownerLines, colOwner, cursorY + 10);
      doc.text(dueLines, colDue, cursorY + 10);

      // Priority color
      if (item.priority === 'High') {
        doc.setTextColor(220, 38, 38);
      } else if (item.priority === 'Medium') {
        doc.setTextColor(217, 119, 6);
      } else {
        doc.setTextColor(37, 99, 235);
      }
      doc.text(item.priority || 'Medium', colPri, cursorY + 10);

      doc.setTextColor(70, 80, 95);
      doc.text(item.status || 'Pending', colStatus, cursorY + 10);

      cursorY += rowHeight;
    });

    cursorY += 15;
  }

  // Footer on all pages
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(150, 160, 175);
    doc.text(
      `Generated by MeetWise AI • Page ${p} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 20,
      { align: 'center' }
    );
  }

  doc.save('meetwise-executive-report.pdf');
}

/**
 * Format meeting analysis object to Markdown string
 */
export function generateMarkdownReport(data: any): string {
  const title = data.meeting_title || 'Meeting Analysis Report';
  const dateStr = data.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  
  let md = `# ${title}\n\n`;
  md += `**Date:** ${dateStr}\n\n`;
  
  if (data.meeting_objective) {
    md += `## 🎯 Meeting Objective\n${data.meeting_objective}\n\n`;
  }

  if (data.summary) {
    md += `## 📌 Executive Summary\n${data.summary}\n\n`;
  }

  if (data.discussion_points && data.discussion_points.length > 0) {
    md += `## 💬 Key Discussion Points\n`;
    data.discussion_points.forEach((point: string) => {
      md += `- ${point}\n`;
    });
    md += `\n`;
  }

  if (data.decisions && data.decisions.length > 0) {
    md += `## ✅ Decisions Taken\n`;
    data.decisions.forEach((dec: any) => {
      if (typeof dec === 'string') {
        md += `- ${dec}\n`;
      } else {
        md += `- **[${dec.status || 'Decided'}]** ${dec.title || dec.task || ''} ${dec.impact ? `_(${dec.impact} Impact)_` : ''}${dec.details ? ` — ${dec.details}` : ''}\n`;
      }
    });
    md += `\n`;
  }

  if (data.risks && data.risks.length > 0) {
    md += `## ⚠️ Risks & Concerns\n`;
    data.risks.forEach((risk: string) => {
      md += `- ${risk}\n`;
    });
    md += `\n`;
  }

  if (data.open_questions && data.open_questions.length > 0) {
    md += `## ❓ Open Questions & Unresolved Items\n`;
    data.open_questions.forEach((q: string) => {
      md += `- ${q}\n`;
    });
    md += `\n`;
  }

  if (data.action_items && data.action_items.length > 0) {
    md += `## 🚀 Action Items\n\n`;
    md += `| Task | Owner | Due Date | Priority | Status |\n`;
    md += `| :--- | :--- | :--- | :--- | :--- |\n`;
    data.action_items.forEach((item: any) => {
      md += `| ${item.task || ''} | ${item.owner || 'Unassigned'} | ${item.due_date || 'Not Specified'} | ${item.priority || 'Medium'} | ${item.status || 'Pending'} |\n`;
    });
    md += `\n`;
  }

  md += `---\n*Generated with MeetWise AI*\n`;
  return md;
}
