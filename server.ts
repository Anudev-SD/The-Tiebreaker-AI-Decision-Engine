import express, { Request, Response } from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Primary Decision Analysis Endpoint
app.post('/api/analyze-decision', async (req: Request, res: Response) => {
  try {
    const { title, options, context, perspective, criteriaWeights } = req.body;

    if (!title || !options || !Array.isArray(options) || options.length < 2) {
      return res.status(400).json({
        error: 'Please provide a decision topic and at least 2 distinct options.',
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured on the server.',
      });
    }

    const optionsList = options.map((opt: string, i: number) => `Option ${i + 1}: "${opt}"`).join('\n');
    const systemPrompt = `You are "The Tiebreaker", an expert strategic decision advisor, behavioral economist, and executive coach.
Your job is to objectively, rigorously, and comprehensively break ties between hard choices.
Analyze the user's decision dilemma thoroughly.
Always deliver high-acuity insights, identifying hidden costs, second-order effects, psychological traps (like sunk cost or status quo bias), and asymmetric upsides.

Return strict, valid JSON matching the exact schema requested.`;

    const userPrompt = `Decision Topic: "${title}"
Options to compare:
${optionsList}

Additional Context & Priorities:
${context || 'No specific personal context provided - evaluate comprehensively.'}

Advisor Perspective: ${perspective || 'Objective & Balanced'}
Custom weight considerations: ${criteriaWeights ? JSON.stringify(criteriaWeights) : 'Default balanced weights'}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: 'A crisp 2-3 sentence executive summary explaining the heart of this dilemma.',
            },
            dilemmaType: {
              type: Type.STRING,
              description: 'e.g., Risk vs Reward, Immediate Comfort vs Long-term Growth, Speed vs Thoroughness',
            },
            optionsAnalysis: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  tagline: { type: Type.STRING, description: 'Punchy 3-6 word summary of this choice persona' },
                  bestFor: { type: Type.STRING, description: 'Who or when this option is ideal for' },
                  pros: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        title: { type: Type.STRING },
                        description: { type: Type.STRING },
                        weight: { type: Type.INTEGER, description: 'Impact score 1 (minor) to 5 (game-changing)' },
                        category: { type: Type.STRING, description: 'e.g. Financial, Mental Wellbeing, Career, Time, Risk' }
                      },
                      required: ['id', 'title', 'description', 'weight', 'category']
                    }
                  },
                  cons: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        title: { type: Type.STRING },
                        description: { type: Type.STRING },
                        weight: { type: Type.INTEGER, description: 'Impact score 1 (minor annoyance) to 5 (dealbreaker)' },
                        category: { type: Type.STRING, description: 'e.g. Financial, Stress, Opportunity Cost, Lock-in' }
                      },
                      required: ['id', 'title', 'description', 'weight', 'category']
                    }
                  },
                  swot: {
                    type: Type.OBJECT,
                    properties: {
                      strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                      weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                      opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
                      threats: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ['strengths', 'weaknesses', 'opportunities', 'threats']
                  }
                },
                required: ['name', 'tagline', 'bestFor', 'pros', 'cons', 'swot']
              }
            },
            criteria: {
              type: Type.ARRAY,
              description: '5 to 7 key criteria for a comparison matrix (e.g., Financial ROI, Stress & Workload, Growth Potential, Reversibility, Long-term Fulfillment)',
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  category: { type: Type.STRING },
                  description: { type: Type.STRING },
                  defaultWeight: { type: Type.INTEGER, description: '1 to 5' },
                  scores: {
                    type: Type.ARRAY,
                    description: 'Score for each option from 1 (terrible) to 10 (outstanding)',
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        optionName: { type: Type.STRING },
                        score: { type: Type.INTEGER },
                        rationale: { type: Type.STRING }
                      },
                      required: ['optionName', 'score', 'rationale']
                    }
                  }
                },
                required: ['id', 'name', 'category', 'description', 'defaultWeight', 'scores']
              }
            },
            verdict: {
              type: Type.OBJECT,
              properties: {
                recommendedOption: { type: Type.STRING },
                confidencePercentage: { type: Type.INTEGER, description: '50 to 95' },
                headline: { type: Type.STRING },
                decisiveFactor: { type: Type.STRING, description: 'The single most critical tiebreaker factor' },
                detailedVerdict: { type: Type.STRING },
                reversalConditions: {
                  type: Type.ARRAY,
                  description: 'Exact conditions under which the other option(s) should be chosen instead',
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      optionName: { type: Type.STRING },
                      condition: { type: Type.STRING }
                    },
                    required: ['optionName', 'condition']
                  }
                },
                tenTenTenRule: {
                  type: Type.OBJECT,
                  properties: {
                    tenMinutes: { type: Type.STRING, description: 'Emotional state right after choosing' },
                    tenMonths: { type: Type.STRING, description: 'Mid-term practical reality' },
                    tenYears: { type: Type.STRING, description: 'Long term life impact' }
                  },
                  required: ['tenMinutes', 'tenMonths', 'tenYears']
                },
                preMortem: {
                  type: Type.OBJECT,
                  properties: {
                    failureScenario: { type: Type.STRING, description: 'If the chosen option failed in 18 months, what likely caused it?' },
                    preventiveAction: { type: Type.STRING, description: 'Actionable steps to safeguard against this now' }
                  },
                  required: ['failureScenario', 'preventiveAction']
                }
              },
              required: [
                'recommendedOption',
                'confidencePercentage',
                'headline',
                'decisiveFactor',
                'detailedVerdict',
                'reversalConditions',
                'tenTenTenRule',
                'preMortem'
              ]
            }
          },
          required: ['summary', 'dilemmaType', 'optionsAnalysis', 'criteria', 'verdict']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Error analyzing decision:', err);
    return res.status(500).json({ error: message || 'Failed to analyze decision.' });
  }
});

// "What If" Scenario Stress Tester
app.post('/api/what-if', async (req: Request, res: Response) => {
  try {
    const { decisionTitle, options, currentVerdict, scenario } = req.body;

    if (!scenario || !decisionTitle) {
      return res.status(400).json({ error: 'Scenario description is required.' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Decision: "${decisionTitle}"
Options: ${JSON.stringify(options)}
Current Leader: "${currentVerdict?.recommendedOption || 'None'}"
Hypothetical Scenario: "${scenario}"

Analyze how this new condition or assumption change alters the decision dynamics. Does it flip the winner?
Return strict JSON.`,
      config: {
        systemInstruction: 'You are an expert scenario stress-tester and decision game-theorist.',
        temperature: 0.7,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            scenarioImpact: { type: Type.STRING },
            doesWinnerFlip: { type: Type.BOOLEAN },
            newRecommendedOption: { type: Type.STRING },
            optionImpacts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  optionName: { type: Type.STRING },
                  impactLevel: { type: Type.STRING, description: 'Significantly Worse, Slightly Worse, Neutral, Improved, Game-Changer' },
                  notes: { type: Type.STRING }
                },
                required: ['optionName', 'impactLevel', 'notes']
              }
            },
            contingencyAdvice: { type: Type.STRING }
          },
          required: ['scenarioImpact', 'doesWinnerFlip', 'newRecommendedOption', 'optionImpacts', 'contingencyAdvice']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return res.status(500).json({ error: message || 'Failed to simulate scenario.' });
  }
});

// Option Brainstormer / Dilemma Clarifier
app.post('/api/suggest-options', async (req: Request, res: Response) => {
  try {
    const { dilemma } = req.body;
    if (!dilemma) {
      return res.status(400).json({ error: 'Dilemma description is required.' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `The user has this dilemma: "${dilemma}". Suggest 2 to 4 distinct, concrete, realistic options they can evaluate. Include both standard and creative/hybrid alternatives.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestedTitle: { type: Type.STRING },
            options: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  shortDescription: { type: Type.STRING }
                },
                required: ['name', 'shortDescription']
              }
            }
          },
          required: ['suggestedTitle', 'options']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return res.status(500).json({ error: message || 'Failed to suggest options.' });
  }
});

// Server-side Vite dev middleware or static serving
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`The Tiebreaker server listening on port ${port} (${isProduction ? 'production' : 'development'})`);
  });
}

startServer();
