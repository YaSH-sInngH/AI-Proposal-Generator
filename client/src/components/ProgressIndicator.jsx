import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

// Define all possible stages
const STAGES = [
  { id: 'initializing', label: 'Starting proposal generation...' },
  { id: 'analyzing', label: 'Analyzing requirements with AI...' },
  { id: 'generated', label: 'Proposal structure generated' },
  { id: 'validating', label: 'Validating proposal structure...' },
  { id: 'validated', label: 'Proposal validated successfully' },
  { id: 'creating', label: 'Creating document...' },
  { id: 'finalizing', label: 'Finalizing document...' },
  { id: 'complete', label: 'Document ready!' }
];

function ProgressIndicator({ currentStage, stagesCompleted = [] }) {
  const isComplete = currentStage === 'complete';

  // Determine stage state
  const getStageState = (stageId) => {
    // If complete, all stages are completed
    if (isComplete) {
      return 'completed';
    }
    if (stagesCompleted.includes(stageId)) {
      return 'completed';
    }
    if (stageId === currentStage) {
      return 'active';
    }
    return 'pending';
  };

  return (
    <div className="flex gap-6 items-start">
      {/* Right Side - Step Log Feed */}
      <div className="flex-1 min-w-0">
        <div className="space-y-0">
          {STAGES.map((stage, index) => {
            const state = getStageState(stage.id);
            const isLast = index === STAGES.length - 1;
            const currentStageIndex = STAGES.findIndex(s => s.id === currentStage);
            
            // Only show stages up to and including the current stage (or all if complete)
            // Also show completed stages
            const shouldShow = isComplete || 
                              index <= currentStageIndex || 
                              stagesCompleted.includes(stage.id);
            
            if (!shouldShow) {
              return null;
            }

            // Check if next stage should be shown (for connector line)
            const nextStage = !isLast ? STAGES[index + 1] : null;
            const nextStageShouldShow = nextStage && (
              isComplete || 
              (index + 1) <= currentStageIndex || 
              stagesCompleted.includes(nextStage.id)
            );

            return (
              <div key={stage.id} className="relative">
                <div
                  className={`flex items-center gap-2 text-xs transition-all duration-300 py-1 ${
                    state === 'completed'
                      ? 'text-green-400'
                      : state === 'active'
                      ? 'text-blue-400'
                      : 'text-text-secondary'
                  }`}
                >
                  {/* Icon/Indicator */}
                  <div className="flex-shrink-0 w-4 h-4 flex items-center justify-center relative z-10">
                    {state === 'completed' ? (
                      <FontAwesomeIcon 
                        icon={faCheck} 
                        className="text-xs text-green-400"
                      />
                    ) : state === 'active' ? (
                      <div className="spinner" style={{ fontSize: '16px' }}>
                        <div className="spinner-blade"></div>
                        <div className="spinner-blade"></div>
                        <div className="spinner-blade"></div>
                        <div className="spinner-blade"></div>
                        <div className="spinner-blade"></div>
                        <div className="spinner-blade"></div>
                        <div className="spinner-blade"></div>
                        <div className="spinner-blade"></div>
                        <div className="spinner-blade"></div>
                        <div className="spinner-blade"></div>
                        <div className="spinner-blade"></div>
                        <div className="spinner-blade"></div>
                      </div>
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-text-secondary opacity-50"></div>
                    )}
                  </div>

                  {/* Step Text */}
                  <span className={`${
                    state === 'completed'
                      ? 'font-medium'
                      : state === 'active'
                      ? 'font-medium'
                      : 'font-normal'
                  }`}>
                    {stage.label}
                  </span>
                </div>

                {/* Connector Line (except for last item and when next stage isn't shown) */}
                {!isLast && shouldShow && nextStageShouldShow && (
                  <div className={`absolute left-2 top-4 w-0.5 h-5 ${
                    state === 'completed'
                      ? 'bg-green-400 opacity-30'
                      : 'bg-border-subtle opacity-20'
                  }`}></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ProgressIndicator;
