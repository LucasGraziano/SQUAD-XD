'use strict';

/**
 * Conclave Engine — Multi-agent deliberation system
 *
 * Orchestrates multiple agent perspectives on a decision,
 * then synthesizes a recommendation.
 *
 * @module core/conclave/conclave-engine
 * @version 2.0.0
 */

const AGENT_EXPERTISE = {
  'copy-chief': { focus: 'persuasion, emotional triggers, messaging', domains: ['copy-persuasion', 'psychology-influence'] },
  'traffic-head': { focus: 'ad performance, audiences, scaling rules', domains: ['traffic-ads'] },
  'creative-director': { focus: 'visual impact, scroll-stop, creative testing', domains: ['traffic-ads', 'psychology-influence'] },
  'funnel-chief': { focus: 'conversion, funnel flow, value ladder', domains: ['funnels-value-ladder'] },
  'analyst': { focus: 'market data, competitor analysis, objection handling', domains: ['offers-pricing', 'sales-closing'] },
  'pm': { focus: 'business model, margins, prioritization, ROI', domains: ['offers-pricing', 'systems-ops'] },
  'architect': { focus: 'technical feasibility, scalability, tradeoffs', domains: ['systems-ops'] },
  'commander': { focus: 'strategic alignment, resource allocation, timeline', domains: ['offers-pricing', 'systems-ops'] },
};

const DELIBERATION_ROLES = {
  CRITIC: {
    role: 'Process Quality Validator',
    criteria: [
      'evidence_quality',    // Are claims backed by data/experience?
      'logic_consistency',   // Is the reasoning internally consistent?
      'completeness',        // Are blind spots addressed?
      'actionability',       // Can the recommendation be executed?
      'risk_awareness',      // Are risks properly identified?
    ],
    scoring: '0-100 per criterion, weighted average',
    output: 'Scoring table + overall quality score + specific weaknesses',
  },
  DEVILS_ADVOCATE: {
    role: 'Consensus Attacker & Vulnerability Finder',
    tasks: [
      'Attack the strongest consensus point',
      'Find the assumption everyone missed',
      'Identify the scenario where this fails',
      'Challenge the confidence level',
    ],
    output: 'Top 3 vulnerabilities + stress test result + revised risk assessment',
  },
  SYNTHESIZER: {
    role: 'Final Integrator & Decision Maker',
    tasks: [
      'Integrate all perspectives + CRITIC scores + ADVOCATE challenges',
      'Calibrate final confidence (0-100%)',
      'Decide: GO / NO-GO / CONDITIONAL',
      'Create action plan with contingencies',
    ],
    output: 'Final verdict + confidence % + action plan + conditions (if CONDITIONAL)',
  },
};

const CONCLAVE_SIZES = {
  small: 3,   // Quick decisions
  medium: 4,  // Standard deliberation
  large: 6,   // Complex/strategic decisions
};

/**
 * Select the best agents for a given question based on topic keywords.
 */
function selectAgents(question, size = 'medium') {
  const maxAgents = CONCLAVE_SIZES[size] || 4;
  const q = question.toLowerCase();

  const relevanceScores = Object.entries(AGENT_EXPERTISE).map(([id, info]) => {
    let score = 0;
    const keywords = info.focus.split(', ');
    keywords.forEach(kw => {
      if (q.includes(kw.split(' ')[0])) score += 2;
    });
    // Domain keyword matching
    info.domains.forEach(d => {
      d.split('-').forEach(word => {
        if (q.includes(word)) score += 1;
      });
    });
    return { id, score, ...info };
  });

  return relevanceScores
    .sort((a, b) => b.score - a.score)
    .slice(0, maxAgents)
    .map(a => a.id);
}

/**
 * Generate the deliberation prompt for a single agent.
 */
function generatePerspectivePrompt(agentId, question, context = '') {
  const agent = AGENT_EXPERTISE[agentId];
  if (!agent) return null;

  return {
    agent: agentId,
    prompt: [
      `You are the ${agentId} agent. Your expertise: ${agent.focus}.`,
      `Knowledge domains: ${agent.domains.join(', ')}.`,
      '',
      `QUESTION FOR DELIBERATION:`,
      question,
      context ? `\nCONTEXT:\n${context}` : '',
      '',
      `Provide your perspective in this format:`,
      `## Position: [Your recommendation in 1 sentence]`,
      `## Reasoning: [2-3 key arguments from your expertise]`,
      `## Risk: [1 concern or tradeoff to consider]`,
      `## Confidence: [HIGH/MEDIUM/LOW]`,
    ].filter(Boolean).join('\n'),
  };
}

/**
 * Generate the synthesis prompt from all perspectives.
 */
function generateSynthesisPrompt(question, perspectives) {
  const perspectiveBlock = perspectives
    .map(p => `### ${p.agent}\n${p.content}`)
    .join('\n\n');

  return [
    `# Conclave Synthesis`,
    ``,
    `## Question`,
    question,
    ``,
    `## Agent Perspectives`,
    perspectiveBlock,
    ``,
    `## Your Task`,
    `Synthesize all perspectives into a final recommendation:`,
    `1. **Consensus**: Where do agents agree?`,
    `2. **Tension**: Where do they disagree?`,
    `3. **Recommendation**: Final decision with reasoning`,
    `4. **Action Items**: 1-3 concrete next steps`,
    `5. **Confidence**: Overall confidence level`,
  ].join('\n');
}

/**
 * Generate prompt for the CRITIC deliberation role.
 * Scores each perspective on 5 quality criteria.
 */
function generateCriticPrompt(perspectives) {
  const perspectiveBlock = perspectives
    .map(p => `### ${p.agent}\n${p.content}`)
    .join('\n\n');

  const criteriaList = DELIBERATION_ROLES.CRITIC.criteria
    .map(c => `- **${c}** (0-100)`)
    .join('\n');

  return [
    `# CRITIC — Process Quality Validation`,
    ``,
    `## Role`,
    `${DELIBERATION_ROLES.CRITIC.role}`,
    ``,
    `## Agent Perspectives to Evaluate`,
    perspectiveBlock,
    ``,
    `## Your Task`,
    `Score EACH perspective on the following criteria:`,
    criteriaList,
    ``,
    `## Output Format`,
    `1. **Scoring Table**: Agent × Criterion matrix with scores (0-100)`,
    `2. **Overall Quality Score**: Weighted average across all agents and criteria`,
    `3. **Weakest Arguments**: Top 3 claims with insufficient evidence or flawed logic`,
    `4. **Low-Evidence Flags**: Claims that lack data backing or rely on assumptions`,
    `5. **Blind Spots**: Important considerations no agent addressed`,
  ].join('\n');
}

/**
 * Generate prompt for the DEVIL'S ADVOCATE deliberation role.
 * Attacks consensus and finds vulnerabilities.
 */
function generateDevilsAdvocatePrompt(perspectives, criticResult) {
  const perspectiveBlock = perspectives
    .map(p => `### ${p.agent}\n${p.content}`)
    .join('\n\n');

  return [
    `# DEVIL'S ADVOCATE — Consensus Attack & Stress Test`,
    ``,
    `## Role`,
    `${DELIBERATION_ROLES.DEVILS_ADVOCATE.role}`,
    ``,
    `## Agent Perspectives`,
    perspectiveBlock,
    ``,
    `## CRITIC Evaluation`,
    criticResult,
    ``,
    `## Your Tasks`,
    ...DELIBERATION_ROLES.DEVILS_ADVOCATE.tasks.map((t, i) => `${i + 1}. ${t}`),
    ``,
    `## Output Format`,
    `1. **Strongest Consensus Point**: Identify it, then systematically attack it`,
    `2. **Hidden Assumptions**: The assumption everyone is making but nobody stated`,
    `3. **Failure Scenario**: Describe the specific scenario where this recommendation fails catastrophically`,
    `4. **Top 3 Vulnerabilities**: Ranked by impact severity`,
    `5. **Revised Risk Assessment**: Recalibrate the overall risk considering your findings`,
  ].join('\n');
}

/**
 * Generate prompt for the SYNTHESIZER deliberation role.
 * Final integration and decision making.
 */
function generateSynthesizerPrompt(perspectives, criticResult, advocateResult) {
  const perspectiveBlock = perspectives
    .map(p => `### ${p.agent}\n${p.content}`)
    .join('\n\n');

  return [
    `# SYNTHESIZER — Final Integration & Decision`,
    ``,
    `## Role`,
    `${DELIBERATION_ROLES.SYNTHESIZER.role}`,
    ``,
    `## Agent Perspectives`,
    perspectiveBlock,
    ``,
    `## CRITIC Evaluation`,
    criticResult,
    ``,
    `## DEVIL'S ADVOCATE Stress Test`,
    advocateResult,
    ``,
    `## Your Tasks`,
    ...DELIBERATION_ROLES.SYNTHESIZER.tasks.map((t, i) => `${i + 1}. ${t}`),
    ``,
    `## Output Format`,
    `1. **Integrated Recommendation**: Considering all perspectives, CRITIC scores, and ADVOCATE challenges`,
    `2. **Confidence Score**: 0-100% (calibrated considering vulnerabilities found)`,
    `3. **Verdict**: GO / NO-GO / CONDITIONAL`,
    `4. **Action Plan**: Numbered steps with owners and timeline`,
    `5. **Contingencies**: If CONDITIONAL, list specific conditions that must be met`,
    `6. **Residual Risks**: Risks accepted in this decision`,
  ].join('\n');
}

/**
 * Create a conclave session configuration.
 */
function createConclave(question, options = {}) {
  const {
    agents = null,
    size = 'medium',
    context = '',
    v1 = false,
  } = options;

  const selectedAgents = agents || selectAgents(question, size);
  const version = v1 ? 1 : 2;

  const conclave = {
    id: `conclave-${Date.now()}`,
    version,
    question,
    context,
    agents: selectedAgents,
    size,
    perspectives: selectedAgents.map(id => generatePerspectivePrompt(id, question, context)),
    synthesisTemplate: (collectedPerspectives) =>
      generateSynthesisPrompt(question, collectedPerspectives),
  };

  // V2: Add deliberation role templates
  if (version === 2) {
    conclave.deliberationRoles = {
      critic: (collectedPerspectives) =>
        generateCriticPrompt(collectedPerspectives),
      devilsAdvocate: (collectedPerspectives, criticResult) =>
        generateDevilsAdvocatePrompt(collectedPerspectives, criticResult),
      synthesizer: (collectedPerspectives, criticResult, advocateResult) =>
        generateSynthesizerPrompt(collectedPerspectives, criticResult, advocateResult),
    };
  }

  return conclave;
}

module.exports = {
  AGENT_EXPERTISE,
  CONCLAVE_SIZES,
  DELIBERATION_ROLES,
  selectAgents,
  generatePerspectivePrompt,
  generateSynthesisPrompt,
  generateCriticPrompt,
  generateDevilsAdvocatePrompt,
  generateSynthesizerPrompt,
  createConclave,
};
