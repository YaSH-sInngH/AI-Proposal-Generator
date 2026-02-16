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
  if (!data.phases || !Array.isArray(data.phases) || data.phases.length !== 3) {
    errors.push('phases must be an array with exactly 3 phases');
  }

  if (!data.overallTotalHours || typeof data.overallTotalHours !== 'string') {
    errors.push('Missing or invalid overallTotalHours');
  }

  if (!data.techStack || !Array.isArray(data.techStack)) {
    errors.push('Missing or invalid techStack array');
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
        errors.push(`Phase ${index + 1}: Name must be "${expectedPhaseNames[index]}"`);
      }

      if (!phase.totalHours || typeof phase.totalHours !== 'string') {
        errors.push(`Phase ${index + 1}: Missing or invalid totalHours`);
      }

      if (!phase.tasks || !Array.isArray(phase.tasks)) {
        errors.push(`Phase ${index + 1}: Missing or invalid tasks array`);
      } else if (phase.tasks.length === 0) {
        errors.push(`Phase ${index + 1}: tasks array cannot be empty`);
      } else {
        // Validate each task has description and hours
        phase.tasks.forEach((task, taskIndex) => {
          if (!task || typeof task !== 'object') {
            errors.push(`Phase ${index + 1}, Task ${taskIndex + 1}: Must be an object`);
          } else {
            if (!task.description || typeof task.description !== 'string' || task.description.trim().length === 0) {
              errors.push(`Phase ${index + 1}, Task ${taskIndex + 1}: Missing or invalid description`);
            } else if (task.description.trim().length < 50) {
              errors.push(`Phase ${index + 1}, Task ${taskIndex + 1}: Description must be at least 50 characters`);
            }
            if (!task.hours || typeof task.hours !== 'string') {
              errors.push(`Phase ${index + 1}, Task ${taskIndex + 1}: Missing or invalid hours`);
            }
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