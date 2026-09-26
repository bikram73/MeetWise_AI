/**
 * Helper utility to read text content from user-uploaded files (.txt, .vtt, .srt, .md, .json, or binary pdf/docx fallback)
 */
export async function readTranscriptFromFile(file: File): Promise<string> {
  const extension = file.name.split('.').pop()?.toLowerCase();

  // Plain text formats
  if (['txt', 'vtt', 'srt', 'md', 'json', 'log'].includes(extension || '')) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        let text = (e.target?.result as string) || '';
        // If VTT or SRT, clean up timing metadata lines slightly for better transcript readability
        if (extension === 'vtt' || extension === 'srt') {
          text = text.replace(/^WEBVTT$/g, '')
                     .replace(/\d+\r?\n\d\d:\d\d:\d\d[.,]\d\d\d --> \d\d:\d\d:\d\d[.,]\d\d\d/g, '')
                     .trim();
        }
        resolve(text);
      };
      reader.onerror = () => reject(new Error('Failed to read text file.'));
      reader.readAsText(file);
    });
  }

  // Fallback for PDF / DOCX / other formats
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result;
      if (typeof content === 'string') {
        resolve(content);
      } else {
        // Attempt text extraction from ArrayBuffer or raw string
        const decoder = new TextDecoder('utf-8');
        const text = decoder.decode(content as ArrayBuffer);
        // Strip non-printable ASCII characters for basic text recovery
        const printableText = text.replace(/[^\x20-\x7E\n\r\t]/g, ' ').replace(/\s+/g, ' ').trim();
        if (printableText.length > 20) {
          resolve(printableText);
        } else {
          reject(new Error(`Could not parse plain text from .${extension} file. Please paste transcript directly or upload a .TXT file.`));
        }
      }
    };
    reader.onerror = () => reject(new Error('Error reading uploaded file.'));
    reader.readAsText(file);
  });
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
        md += `- **[${dec.status || 'Decided'}]** ${dec.title || dec.task || ''} ${dec.impact ? `_(${dec.impact})_` : ''}\n`;
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
