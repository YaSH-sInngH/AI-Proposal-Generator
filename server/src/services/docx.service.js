/**
 * DOCX document generation service
 */
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  LevelFormat
} from 'docx';

/**
 * Generates a DOCX document from proposal data
 * @param {Object} proposalData - The structured proposal data
 * @returns {Promise<Buffer>} DOCX file buffer
 */
export async function generateProposalDoc(proposalData) {
  const { phases, overallTotalHours, techStack } = proposalData;

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: "Arial", size: 24 } // 12pt
        }
      },
      paragraphStyles: [
        {
          id: "Heading1",
          name: "Heading 1",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: { size: 28, bold: true, font: "Arial" }, // 14pt
          paragraph: {
            spacing: { before: 240, after: 200 },
            outlineLevel: 0
          }
        }
      ]
    },
    numbering: {
      config: [
        {
          reference: "arrow-bullets",
          levels: [
            {
              level: 0,
              format: LevelFormat.BULLET,
              text: "→",
              alignment: AlignmentType.LEFT,
              style: {
                paragraph: {
                  indent: { left: 720, hanging: 360 }
                }
              }
            }
          ]
        }
      ]
    },
    sections: [
      {
        properties: {
          page: {
            size: {
              width: 12240,
              height: 15840
            },
            margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
          }
        },
        children: buildDocumentContent(phases, overallTotalHours, techStack)
      }
    ]
  });

  return await Packer.toBuffer(doc);
}

/**
 * Builds the document content structure
 */
function buildDocumentContent(phases, overallTotalHours, techStack) {
  const children = [];

  // Each phase
  phases.forEach((phase, phaseIndex) => {
    // Phase heading with hours
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        children: [
          new TextRun(`${phase.name} (${phase.totalHours}hrs)`)
        ],
        spacing: { 
          before: phaseIndex === 0 ? 0 : 300, 
          after: 200 
        }
      })
    );

    // Tasks with arrow bullets
    phase.tasks.forEach((task) => {
      // Remove any existing hours pattern from description (e.g., "(4hrs)", "(4 hrs)", "(4hrs)")
      const cleanDescription = task.description.replace(/\s*\([\d.]+\s*hrs?\)\s*$/i, '').trim();
      children.push(
        new Paragraph({
          numbering: { 
            reference: "arrow-bullets", 
            level: 0 
          },
          children: [
            new TextRun(`${cleanDescription} (${task.hours}hrs)`)
          ],
          spacing: { after: 80 }
        })
      );
    });
  });

  // Spacing before total
  children.push(
    new Paragraph({
      children: [new TextRun("")],
      spacing: { before: 300, after: 100 }
    })
  );

  // Overall Total Hours
  children.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      children: [
        new TextRun(`Overall Total Hours → ${overallTotalHours}hrs`)
      ],
      spacing: { before: 200, after: 200 }
    })
  );

  // Tech Stack
  if (techStack && techStack.length > 0) {
    children.push(
      new Paragraph({
        children: [
          new TextRun(`Tech Stack: ${techStack.join(', ')}`)
        ],
        spacing: { before: 100 }
      })
    );
  }

  return children;
}