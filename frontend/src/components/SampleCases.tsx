import { Sparkles } from 'lucide-react';
import { SAMPLE_CASES } from '../config/constants';
import type { SampleCase } from '../types';


interface SampleCasesProps {
  onSelectCase: (sample: SampleCase) => void;
  disabled: boolean;
}

export function SampleCases({ onSelectCase, disabled }: SampleCasesProps) {
  return (
    <div className="sample-cases-container">
      <label className="section-label flex-header">
        <span>Quick Demo Cases</span>
        <Sparkles size={14} className="sparkle-glow" />
      </label>
      <div className="sample-cases-grid">
        {SAMPLE_CASES.map((sample) => (
          <button
            key={sample.id}
            className="sample-case-card"
            onClick={() => onSelectCase(sample)}
            disabled={disabled}
            type="button"
          >
            <span className="case-name">{sample.name}</span>
            <span className="case-desc">{sample.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
export default SampleCases;
