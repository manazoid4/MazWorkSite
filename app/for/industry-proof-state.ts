import type { IndustryProof } from './industry-proof-data';
export type ProofState = { step: number; complete: boolean; interacted: boolean; choices: Record<string, string> };
export function initialProofState(proof: IndustryProof): ProofState {
  return { step: 0, complete: false, interacted: false, choices: Object.fromEntries(proof.fields.map(f => [f.id, f.initial])) };
}
export function advanceProof(proof: IndustryProof, state: ProofState): ProofState {
  const step = Math.min(state.step + 1, proof.steps.length - 1);
  return { ...state, step, complete: step === proof.steps.length - 1, interacted: true };
}
export function selectProofChoice(proof: IndustryProof, state: ProofState, id: string, value: string): ProofState {
  if (!proof.fields.find(f => f.id === id)?.options.includes(value)) return state;
  return { ...state, interacted: true, choices: { ...state.choices, [id]: value } };
}
export const replayProof = initialProofState;
export function proofSummary(proof: IndustryProof, state: ProofState) {
  const step = proof.steps[state.step];
  return { status: step.status, customer: step.customer, owner: step.owner, fields: proof.fields.map(f => ({ label: f.label, value: state.choices[f.id] })) };
}
