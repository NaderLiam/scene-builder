
import { Shot } from '../types';

export async function exportShotsToCSV(shots: Shot[]): Promise<void> {
  if (shots.length === 0) {
    alert("No shots to export.");
    return;
  }
  try {
    const { unparse } = await import('papaparse');
    const csvData = shots.map(shot => ({
      ID: shot.id,
      Name: shot.name,
      GeneratedPrompt: shot.generatedPrompt,
      Timestamp: new Date(shot.timestamp).toLocaleString(),
      // Add more fields from shot.promptData if needed
    }));
    const csv = unparse(csvData);
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'historical_prompts_export.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    alert("CSV export initiated.");
  } catch (error) {
    console.error("Error exporting to CSV:", error);
    alert("Failed to export to CSV. See console for details.");
  }
}

export async function exportShotsToPDF(shots: Shot[]): Promise<void> {
  if (shots.length === 0) {
    alert("No shots to export.");
    return;
  }
  alert("PDF export is a complex feature. This is a placeholder for `pdf-lib` and `html2canvas` integration.");
  // Implementation would involve:
  // 1. Dynamically import `pdf-lib` and `html2canvas`.
  // 2. Create a hidden element with the content to export.
  // 3. Use `html2canvas` to render the element to a canvas.
  // 4. Convert canvas to an image.
  // 5. Use `pdf-lib` to create a PDF and embed the image.
  // 6. Trigger download.
  console.log("Simulating PDF export for shots:", shots);
}
