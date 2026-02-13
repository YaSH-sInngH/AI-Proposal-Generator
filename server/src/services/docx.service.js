/**
 * DOCX document generation service
 */
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType
} from 'docx';

/**
 * Generates a DOCX document from proposal data
 * @param {Object} proposalData - The structured proposal data
 * @returns {Promise<Buffer>} DOCX file buffer
 */
export async function generateProposalDoc(proposalData) {
  const { projectTitle, overview, phases, overallTotalHours } = proposalData;

  // Build document children
  const children = [];

  // Project Title (Heading 1)
  children.push(
    new Paragraph({
      text: projectTitle,
      heading: HeadingLevel.HEADING_1,
      spacing: { after: 400 }
    })
  );

  // Overview section
  children.push(
    new Paragraph({
      text: 'Overview',
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 200 }
    })
  );

  children.push(
    new Paragraph({
      text: overview,
      spacing: { after: 400 }
    })
  );

  // Phases
  phases.forEach((phase, index) => {
    // Phase heading (Heading 2)
    children.push(
      new Paragraph({
        text: `${phase.name} (${phase.totalHours} hrs)`,
        heading: HeadingLevel.HEADING_2,
        spacing: { before: index === 0 ? 0 : 300, after: 200 }
      })
    );

    // Tasks as bullet points
    phase.tasks.forEach((task) => {
      children.push(
        new Paragraph({
          text: task,
          bullet: {
            level: 0
          },
          spacing: { after: 100 }
        })
      );
    });
  });

  // Overall Total Hours
  children.push(
    new Paragraph({
      text: `Overall Total Hours — ${overallTotalHours} hrs`,
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 400, after: 200 },
      alignment: AlignmentType.CENTER
    })
  );

  // Create document
  const doc = new Document({
    sections: [
      {
        properties: {},
        children
      }
    ]
  });

  // Generate buffer
  return await Packer.toBuffer(doc);
}
