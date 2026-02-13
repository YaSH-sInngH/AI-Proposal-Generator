/**
 * Validates proposal JSON structure matches required schema
 */

/**
 * Validates that the proposal data matches the required structure
 * @param {Object} data - The proposal data to validate
 * @returns {Object} Validation result with isValid and errors
 */
export function validateProposalStructure(data) {
  const errors = [];

  // Check required top-level fields
  if (!data.projectTitle || typeof data.projectTitle !== 'string') {
    errors.push('Missing or invalid projectTitle');
  }

  if (!data.overview || typeof data.overview !== 'string') {
    errors.push('Missing or invalid overview');
  }

  if (!data.phases || !Array.isArray(data.phases) || data.phases.length !== 3) {
    errors.push('phases must be an array with exactly 3 phases');
  }

  if (!data.overallTotalHours || typeof data.overallTotalHours !== 'string') {
    errors.push('Missing or invalid overallTotalHours');
  }

  // Validate phases structure
  if (data.phases && Array.isArray(data.phases)) {
    const expectedPhaseNames = [
      'Phase 1 — Core Development',
      'Phase 2 — Deployment & Infrastructure',
      'Phase 3 — Testing & Frontend Integration'
    ];

    data.phases.forEach((phase, index) => {
      if (!phase.name || typeof phase.name !== 'string') {
        errors.push(`Phase ${index + 1}: Missing or invalid name`);
      } else if (!expectedPhaseNames.includes(phase.name)) {
        errors.push(`Phase ${index + 1}: Name must match one of the expected phase names`);
      }

      if (!phase.totalHours || typeof phase.totalHours !== 'string') {
        errors.push(`Phase ${index + 1}: Missing or invalid totalHours`);
      }

      if (!phase.tasks || !Array.isArray(phase.tasks)) {
        errors.push(`Phase ${index + 1}: Missing or invalid tasks array`);
      } else if (phase.tasks.length === 0) {
        errors.push(`Phase ${index + 1}: tasks array cannot be empty`);
      } else {
        phase.tasks.forEach((task, taskIndex) => {
          if (typeof task !== 'string' || task.trim().length === 0) {
            errors.push(`Phase ${index + 1}, Task ${taskIndex + 1}: Must be a non-empty string`);
          }
        });
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
