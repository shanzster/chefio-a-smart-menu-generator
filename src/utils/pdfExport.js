import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Export nutrition details to PDF
 * @param {Object} food - Food object with nutrition data
 * @param {number} quantity - Quantity in grams
 * @param {string} imageUrl - Optional image URL to include in PDF
 */
export const exportNutritionToPDF = async (food, quantity, imageUrl = null) => {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    let yPosition = margin;

    // Add header
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Nutrition Facts', margin, yPosition);
    yPosition += 10;

    // Add food name
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'normal');
    const foodName = pdf.splitTextToSize(food.name, pageWidth - 2 * margin);
    pdf.text(foodName, margin, yPosition);
    yPosition += foodName.length * 7;

    // Add serving size
    pdf.setFontSize(12);
    pdf.setTextColor(100);
    pdf.text(`Serving Size: ${quantity}g`, margin, yPosition);
    yPosition += 8;

    // Add image if provided
    if (imageUrl) {
      try {
        const img = await loadImage(imageUrl);
        const imgWidth = 80;
        const imgHeight = (img.height / img.width) * imgWidth;
        
        if (yPosition + imgHeight > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
        }
        
        pdf.addImage(img, 'JPEG', margin, yPosition, imgWidth, imgHeight);
        yPosition += imgHeight + 10;
      } catch (error) {
        console.warn('Failed to load image for PDF:', error);
      }
    }

    // Calculate adjusted nutrition
    const multiplier = quantity / food.servingSize;
    const adjustedNutrition = {};
    Object.keys(food.nutrition).forEach(key => {
      adjustedNutrition[key] = food.nutrition[key] * multiplier;
    });

    // Add calories section
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0);
    pdf.text('Calories', margin, yPosition);
    yPosition += 7;

    pdf.setFontSize(24);
    pdf.text(Math.round(adjustedNutrition.calories).toString(), margin + 5, yPosition);
    yPosition += 12;

    // Add line separator
    pdf.setLineWidth(0.5);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 8;

    // Add macronutrients
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Macronutrients', margin, yPosition);
    yPosition += 7;

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    
    const macros = [
      { label: 'Protein', value: adjustedNutrition.protein, unit: 'g' },
      { label: 'Carbohydrates', value: adjustedNutrition.carbs, unit: 'g' },
      { label: 'Total Fat', value: adjustedNutrition.fat, unit: 'g' },
      { label: 'Dietary Fiber', value: adjustedNutrition.fiber, unit: 'g' },
      { label: 'Sugars', value: adjustedNutrition.sugar, unit: 'g' }
    ];

    macros.forEach(macro => {
      if (macro.value > 0) {
        pdf.text(`${macro.label}:`, margin + 5, yPosition);
        pdf.text(`${macro.value.toFixed(1)}${macro.unit}`, pageWidth - margin - 20, yPosition, { align: 'right' });
        yPosition += 6;
      }
    });

    yPosition += 5;

    // Add fats breakdown if available
    if (adjustedNutrition.saturatedFat > 0 || adjustedNutrition.transFat > 0) {
      if (yPosition > pageHeight - 60) {
        pdf.addPage();
        yPosition = margin;
      }

      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Fats Breakdown', margin, yPosition);
      yPosition += 7;

      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');

      const fats = [
        { label: 'Saturated Fat', value: adjustedNutrition.saturatedFat, unit: 'g' },
        { label: 'Trans Fat', value: adjustedNutrition.transFat, unit: 'g' },
        { label: 'Monounsaturated Fat', value: adjustedNutrition.monounsaturatedFat, unit: 'g' },
        { label: 'Polyunsaturated Fat', value: adjustedNutrition.polyunsaturatedFat, unit: 'g' }
      ];

      fats.forEach(fat => {
        if (fat.value > 0) {
          pdf.text(`${fat.label}:`, margin + 5, yPosition);
          pdf.text(`${fat.value.toFixed(1)}${fat.unit}`, pageWidth - margin - 20, yPosition, { align: 'right' });
          yPosition += 6;
        }
      });

      yPosition += 5;
    }

    // Add minerals
    if (yPosition > pageHeight - 60) {
      pdf.addPage();
      yPosition = margin;
    }

    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Minerals', margin, yPosition);
    yPosition += 7;

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');

    const minerals = [
      { label: 'Sodium', value: adjustedNutrition.sodium, unit: 'mg' },
      { label: 'Potassium', value: adjustedNutrition.potassium, unit: 'mg' },
      { label: 'Calcium', value: adjustedNutrition.calcium, unit: 'mg' },
      { label: 'Iron', value: adjustedNutrition.iron, unit: 'mg' },
      { label: 'Magnesium', value: adjustedNutrition.magnesium, unit: 'mg' },
      { label: 'Zinc', value: adjustedNutrition.zinc, unit: 'mg' }
    ];

    minerals.forEach(mineral => {
      if (mineral.value > 0) {
        pdf.text(`${mineral.label}:`, margin + 5, yPosition);
        pdf.text(`${Math.round(mineral.value)}${mineral.unit}`, pageWidth - margin - 20, yPosition, { align: 'right' });
        yPosition += 6;
      }
    });

    yPosition += 5;

    // Add vitamins
    if (yPosition > pageHeight - 60) {
      pdf.addPage();
      yPosition = margin;
    }

    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Vitamins', margin, yPosition);
    yPosition += 7;

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');

    const vitamins = [
      { label: 'Vitamin A', value: adjustedNutrition.vitaminA, unit: 'IU' },
      { label: 'Vitamin C', value: adjustedNutrition.vitaminC, unit: 'mg' },
      { label: 'Vitamin D', value: adjustedNutrition.vitaminD, unit: 'IU' },
      { label: 'Vitamin E', value: adjustedNutrition.vitaminE, unit: 'mg' },
      { label: 'Vitamin B6', value: adjustedNutrition.vitaminB6, unit: 'mg' },
      { label: 'Vitamin B12', value: adjustedNutrition.vitaminB12, unit: 'µg' }
    ];

    vitamins.forEach(vitamin => {
      if (vitamin.value > 0) {
        pdf.text(`${vitamin.label}:`, margin + 5, yPosition);
        pdf.text(`${Math.round(vitamin.value)}${vitamin.unit}`, pageWidth - margin - 20, yPosition, { align: 'right' });
        yPosition += 6;
      }
    });

    // Add footer note
    yPosition += 10;
    if (yPosition > pageHeight - 20) {
      pdf.addPage();
      yPosition = margin;
    }

    pdf.setFontSize(8);
    pdf.setTextColor(150);
    const footerText = '* Percent Daily Values are based on a 2,000 calorie diet. Your daily values may be higher or lower depending on your calorie needs.';
    const footerLines = pdf.splitTextToSize(footerText, pageWidth - 2 * margin);
    pdf.text(footerLines, margin, yPosition);

    // Add generation timestamp
    yPosition += footerLines.length * 4 + 5;
    pdf.text(`Generated on: ${new Date().toLocaleString()}`, margin, yPosition);

    // Save PDF
    const fileName = `${food.name.replace(/[^a-z0-9]/gi, '_')}_nutrition_${quantity}g.pdf`;
    pdf.save(fileName);

    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

/**
 * Load image from URL
 * @param {string} url - Image URL
 * @returns {Promise<HTMLImageElement>}
 */
const loadImage = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
};

/**
 * Export nutrition details using html2canvas (alternative method)
 * @param {HTMLElement} element - DOM element to convert to PDF
 * @param {string} fileName - PDF file name
 */
export const exportElementToPDF = async (element, fileName = 'nutrition_facts.pdf') => {
  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth - 20;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 10;

    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight + 10;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(fileName);
    return true;
  } catch (error) {
    console.error('Error generating PDF from element:', error);
    throw error;
  }
};
