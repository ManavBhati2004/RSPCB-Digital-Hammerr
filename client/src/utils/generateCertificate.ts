type Opts = {
  element: HTMLElement;
  filename: string;
};

export async function generateCertificatePdf({ element, filename }: Opts): Promise<void> {
  // html2canvas-pro is a drop-in fork that supports modern CSS color functions
  // (oklch/oklab/lab/lch). The stock html2canvas 1.x throws on Tailwind v4's
  // oklch() palette, which is why this project switched to the pro fork.
  const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
    import('html2canvas-pro'),
    import('jspdf'),
  ]);

  const canvas = await html2canvas(element, {
    scale: 2,
    backgroundColor: '#FBF7EE',
    useCORS: true,
    logging: false,
  });

  const imgData = canvas.toDataURL('image/png');

  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight);
  pdf.save(filename);
}
