# The Tiebreaker — AI Decision Engine

**Break decision paralysis with structured AI-powered reasoning.**

The Tiebreaker is an AI-powered decision-support application designed to help users evaluate difficult choices through structured analysis, multi-criteria comparisons, risk assessment, and strategic recommendations. Instead of relying only on intuition, users can compare multiple options, explore potential outcomes, understand trade-offs, and receive an AI-generated verdict tailored to their priorities.

The application combines a React and TypeScript frontend with an Express backend and Google's Gemini API to generate detailed decision analyses and hypothetical scenario evaluations.

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [How It Works](#how-it-works)
- [Decision Analysis Framework](#decision-analysis-framework)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation and Setup](#installation-and-setup)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Data Storage](#data-storage)
- [Building for Production](#building-for-production)
- [Error Handling and Limitations](#error-handling-and-limitations)
- [Future Enhancements](#future-enhancements)
- [License](#license)

## Overview

Making an important decision often involves competing priorities, uncertainty, hidden costs, and long-term consequences. The Tiebreaker helps organize these factors into a structured, easy-to-review analysis.

Users enter a decision topic, provide at least two alternatives, and optionally describe their circumstances and preferred decision-making perspective. The application sends this information to the backend, where Gemini generates a structured response containing an analysis of the alternatives and a recommended course of action.

The results are presented through dedicated views for pros and cons, weighted comparison criteria, SWOT analysis, strategic recommendations, and hypothetical scenario testing.

**Example decisions include:**

- Choosing between different career opportunities.
- Comparing education and professional development paths.
- Evaluating technology and hardware investments.
- Making housing or financial planning decisions.
- Assessing alternative business strategies.

These are examples of the types of decisions the application can help analyze, not financial or professional guarantees.

## Key Features

### 1. AI-Powered Decision Analysis

Enter a decision topic and compare between two and five options. The application uses the Gemini API to generate a structured analysis based on the available context and selected perspective.

The analysis includes:

- An executive summary of the dilemma.
- A classification of the decision type.
- Individual analyses of each option.
- Advantages and disadvantages.
- A multi-criteria comparison matrix.
- A final recommendation with supporting rationale.

### 2. Context-Aware Recommendations

Users can provide additional information about their situation, constraints, goals, and priorities.

They can also choose an advisor perspective to influence the analysis:

- **Balanced Strategist:** Considers the overall trade-offs.
- **Ruthless Pragmatist:** Emphasizes execution risks, hidden costs, and downside protection.
- **Long-Term Compounding:** Prioritizes long-term opportunities and future flexibility.
- **Sustainable Wellbeing:** Focuses on stress, wellbeing, and burnout prevention.

The selected perspective is included in the decision request sent to the AI backend.

### 3. AI-Generated Option Suggestions

When users are uncertain about which alternatives to consider, they can ask the application to brainstorm options from a decision topic.

The backend requests two to four distinct, realistic alternatives from Gemini. The suggested options can then be used as a starting point for the analysis.

### 4. Pros and Cons Analysis

Each option receives a structured breakdown of its advantages and disadvantages.

Each item includes:

- A title describing the factor.
- A detailed explanation.
- A category, such as financial impact, career growth, stress, or risk.
- An impact weight on a scale of 1 to 5.

This structure helps users distinguish minor considerations from potentially decisive factors.

### 5. Multi-Criteria Comparison Matrix

The application generates decision criteria for comparing the available alternatives.

Each criterion includes a description, category, default weight, and an individual score for each option on a scale of 1 to 10, along with a rationale.

The interface provides a dedicated comparison-table view for reviewing the alternatives across multiple dimensions.

### 6. SWOT Analysis

The application generates a SWOT analysis for each option:

- **Strengths:** Internal advantages.
- **Weaknesses:** Internal limitations.
- **Opportunities:** External factors that could improve the outcome.
- **Threats:** External risks that could negatively affect the outcome.

This provides a complementary perspective to the numerical comparison matrix.

### 7. Strategic Verdict and Reversal Conditions

The verdict view presents the AI's recommended option and supporting explanation.

It includes:

- Recommended option.
- AI-generated confidence percentage.
- A headline summarizing the recommendation.
- The decisive factor that influences the choice.
- Detailed strategic reasoning.
- Conditions under which an alternative option may be preferable.

The reversal conditions are especially useful because they identify circumstances in which the recommendation should be reconsidered.

The confidence percentage is an AI-generated assessment, not a statistically calibrated probability that the decision will succeed.

### 8. The 10/10/10 Perspective Rule

The application uses a time-based reflection framework to help users consider the emotional and practical consequences of a decision over three horizons:

- **10 minutes:** Immediate emotional reaction.
- **10 months:** Medium-term practical consequences.
- **10 years:** Potential long-term impact.

This encourages users to look beyond immediate comfort or short-term pressure.

### 9. Pre-Mortem Risk Assessment

The AI identifies a hypothetical failure scenario for the recommended choice and proposes a preventive action.

This feature encourages users to consider what might go wrong before committing to a decision and to identify safeguards that could reduce the risk.

### 10. What-If Scenario Lab

The Scenario Lab lets users test how a new assumption or hypothetical event could change the original recommendation.

The backend evaluates the scenario against the current decision and returns:

- An explanation of the scenario's impact.
- Whether the leading option changes.
- A new recommended option.
- The impact on each alternative.
- Contingency advice.

This feature helps users explore uncertainty and understand which assumptions matter most to the decision.

### 11. Saved Decisions Vault

Completed analyses are automatically saved in the application's local browser storage.

Users can access previous decisions through the Saved Decisions interface. Saved records can include the decision title, options, context, selected perspective, analysis, final committed choice, and notes.

The application also supports clearing saved decisions from the interface.

Saved records are stored locally in the browser rather than in a server-side database.

### 12. Decision Commitment

After reviewing the recommendation, users can record their final choice and optional commitment notes.

The application displays the committed option and allows the user to update the commitment later.

This feature helps turn the analysis into a documented decision.

### 13. Export and Share

Users can export a decision analysis as a Markdown-formatted decision memo.

The generated memo can include:

- Decision title and date.
- Dilemma type.
- Executive summary.
- Recommended option and rationale.
- Reversal conditions.
- 10/10/10 reflections.
- Pre-mortem safeguards.
- Pros and cons.
- SWOT analysis.

The interface provides options to copy the Markdown to the clipboard or print the memo, including the browser's print-to-PDF functionality.

### 14. Preset Decision Examples

The application includes preset dilemmas that demonstrate how the analysis works.

Examples cover career choices, housing decisions, hardware upgrades, education paths, and business strategy.

Users can load a preset to explore the application without having to construct a decision from scratch.

## How It Works

The application follows a frontend-backend-AI workflow.

1. **Input:** The user enters the decision topic, two to five options, additional context, and an advisor perspective.
2. **Request:** The React frontend sends the information to the Express backend through an HTTP POST request.
3. **AI processing:** The backend constructs prompts and calls the Gemini API.
4. **Structured response:** Gemini returns a response using the requested JSON schema.
5. **Analysis display:** The frontend renders the result in separate analytical views.
6. **Scenario testing:** The user can test hypothetical changes through the What-If Scenario Lab.
7. **Save and export:** The decision is stored in browser local storage and can be exported as a Markdown memo.

### Architecture

```text
User
 |
 v
React + TypeScript Frontend
 |
 |-- Decision Form
 |-- Pros & Cons
 |-- Comparison Matrix
 |-- SWOT Analysis
 |-- Verdict
 |-- Scenario Lab
 |-- Saved Decisions / Export
 |
 v
Express + TypeScript Backend
 |
 |-- /api/analyze-decision
 |-- /api/suggest-options
 |-- /api/what-if
 |
 v
Google Gemini API
 |
 v
Structured JSON Responses
 |
 v
Analysis Views + Local Storage
```

## Decision Analysis Framework

The main analysis endpoint requests a structured response containing the following data:

| Component | Purpose |
|---|---|
| Executive summary | Summarizes the central dilemma. |
| Dilemma type | Describes the main decision trade-off. |
| Option analysis | Provides pros, cons, taglines, and SWOT findings for each option. |
| Comparison criteria | Scores alternatives against multiple decision criteria. |
| Verdict | Recommends an option and explains the decisive factors. |
| Reversal conditions | Defines circumstances that could favor an alternative. |
| 10/10/10 rule | Examines immediate, medium-term, and long-term consequences. |
| Pre-mortem | Identifies a potential failure scenario and preventive action. |

The backend uses the Gemini SDK's structured-response configuration to request JSON that follows the expected schema.

The criteria weights and option scores are AI-generated starting points. They should be reviewed alongside the user's actual constraints, evidence, and preferences.

## Technology Stack

### Frontend

- **React 19:** Builds the interactive user interface.
- **TypeScript:** Adds static typing to components, API data, and decision-analysis models.
- **Vite:** Provides frontend tooling and build support.
- **Tailwind CSS 4:** Styles the application using utility classes.
- **Lucide React:** Supplies interface icons.
- **Canvas Confetti:** Provides a visual effect when a decision commitment is recorded.

### Backend

- **Node.js:** Runs the JavaScript and TypeScript application.
- **Express:** Handles HTTP requests and API endpoints.
- **TypeScript:** Provides typed backend request and response handling.
- **tsx:** Runs the TypeScript server directly.
- **dotenv:** Loads environment variables from a local environment file.

### AI Integration

- **Google Gemini API:** Generates decision analyses, alternative options, and hypothetical scenario evaluations.
- **`@google/genai`:** Provides the Google GenAI SDK used by the backend.

### Data Storage

- **Browser `localStorage`:** Persists saved decisions on the user's device.

## Project Structure

```text
the-tiebreaker/
├── index.html
├── package.json
├── bun.lock
├── server.ts
├── vite.config.ts
├── tsconfig.json
├── .env.example
├── .gitignore
├── README.md
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css
    ├── types/
    │   └── decision.ts
    ├── data/
    │   └── presets.ts
    └── components/
        ├── Navbar.tsx
        ├── DecisionForm.tsx
        ├── AnalysisView.tsx
        ├── SavedDecisionsModal.tsx
        ├── ExportModal.tsx
        └── tabs/
            ├── ProsConsTab.tsx
            ├── ComparisonTableTab.tsx
            ├── SwotTab.tsx
            ├── VerdictTab.tsx
            └── ScenarioLabTab.tsx
```

### Important Files

- **`src/App.tsx`** — Manages application state, submits decision analyses, saves results, and coordinates the main interface.
- **`src/components/DecisionForm.tsx`** — Collects the decision topic, alternatives, context, and advisor perspective; also requests AI-generated option suggestions.
- **`src/components/AnalysisView.tsx`** — Organizes the generated analysis into the main views.
- **`src/components/tabs/ProsConsTab.tsx`** — Displays advantages and disadvantages.
- **`src/components/tabs/ComparisonTableTab.tsx`** — Displays the multi-criteria comparison matrix.
- **`src/components/tabs/SwotTab.tsx`** — Displays SWOT findings for the alternatives.
- **`src/components/tabs/VerdictTab.tsx`** — Displays the recommendation, reversal conditions, reflection framework, and commitment interaction.
- **`src/components/tabs/ScenarioLabTab.tsx`** — Sends hypothetical scenarios to the backend for evaluation.
- **`src/components/SavedDecisionsModal.tsx`** — Manages access to previously saved decisions.
- **`src/components/ExportModal.tsx`** — Generates and previews the Markdown decision memo.
- **`src/types/decision.ts`** — Defines TypeScript interfaces for analysis results, criteria, verdicts, and saved decisions.
- **`src/data/presets.ts`** — Contains sample decision scenarios.
- **`server.ts`** — Implements the Express API, Gemini integration, and development/production serving.
- **`vite.config.ts`** — Configures Vite, React, and Tailwind CSS.

## Prerequisites

Before running the project, ensure that you have:

- Node.js and npm installed.
- A Google Gemini API key.
- A terminal or code editor, such as Visual Studio Code.
- An internet connection for Gemini API requests.

## Installation and Setup

### 1. Download or Clone the Project

If the project is hosted in a Git repository:

```bash
git clone <YOUR_REPOSITORY_URL>
cd the-tiebreaker
```

Alternatively, extract the project ZIP file and open the extracted project directory in your terminal.

Replace `<YOUR_REPOSITORY_URL>` with the actual repository URL if using Git.

### 2. Install Dependencies

Run the following command from the project root:

```bash
npm install
```

This installs the packages defined in `package.json`.

### 3. Configure Environment Variables

Create a file named `.env` in the project root.

Add your Gemini API key:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

Replace `your_gemini_api_key_here` with your actual key.

Do not commit `.env` to GitHub or expose your API key in frontend code.

The project includes an `.env.example` file showing the environment variables used by the application.

### 4. Start the Application

Run:

```bash
npm run dev
```

The development script starts the Express server with `tsx` and integrates Vite's development middleware.

By default, the server listens on port `3000`.

Open the following URL in your browser:

```text
http://localhost:3000
```

If the `PORT` environment variable is configured, the server uses that port instead.

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | Yes | Authenticates requests to the Google Gemini API. |
| `PORT` | No | Sets the server's listening port; defaults to `3000`. |
| `NODE_ENV` | No | Set to `production` to serve the built frontend. |
| `APP_URL` | Not required for the core local workflow | Included in `.env.example` for the hosted environment; its use depends on deployment needs. |

Keep all secret credentials on the backend. The browser should communicate with your own API endpoints rather than receiving the Gemini API key.

## Running the Application

### Start Development Mode

```bash
npm run dev
```

Use this command while developing the application. The Express server serves the API and integrates Vite's development middleware.

### TypeScript Check

```bash
npm run lint
```

Despite the script name, this command runs the TypeScript compiler without emitting files:

```bash
tsc --noEmit
```

### Build the Frontend

```bash
npm run build
```

This creates a production frontend build in the `dist/` directory.

### Preview the Vite Build

```bash
npm run preview
```

This starts Vite's preview server for the built frontend. It is separate from the Express production server and is not, by itself, a complete test of the backend API.

### Start Production Mode

After building the frontend, run:

```bash
npm start
```

The production script sets `NODE_ENV=production` and starts the Express server. The server serves static files from `dist/` and provides the API endpoints.

Ensure the production environment contains `GEMINI_API_KEY` and any other required configuration.

## API Endpoints

The Express backend defines three main POST endpoints.

### 1. Analyze a Decision

**Endpoint:** `POST /api/analyze-decision`

**Purpose:** Generates a comprehensive analysis of a decision and its alternatives.

**Request body:**

```json
{
  "title": "Choose a career path",
  "options": [
    "Join a startup",
    "Join an established company"
  ],
  "context": "I value career growth and financial stability.",
  "perspective": "Strategic & Balanced"
}
```

**Response:** A structured JSON object containing the summary, dilemma type, option analyses, criteria, and verdict.

The endpoint validates that a decision topic is provided and at least two options are supplied. It returns an error if the required API key is missing.

### 2. Suggest Decision Options

**Endpoint:** `POST /api/suggest-options`

**Purpose:** Brainstorms realistic alternatives based on a dilemma description.

**Request body:**

```json
{
  "dilemma": "Should I pursue a master's degree or focus on professional experience?"
}
```

**Response:** JSON containing a suggested title and an array of alternatives with names and short descriptions.

This endpoint is called by the decision form when the user requests AI-generated suggestions.

### 3. Evaluate a What-If Scenario

**Endpoint:** `POST /api/what-if`

**Purpose:** Evaluates how a hypothetical change affects an existing decision.

**Request body:**

```json
{
  "decisionTitle": "Choose a career path",
  "options": [
    "Join a startup",
    "Join an established company"
  ],
  "currentVerdict": {
    "recommendedOption": "Join an established company"
  },
  "scenario": "The startup secures enough funding for five years."
}
```

**Response:** Structured JSON containing the scenario impact, whether the leading option changes, option-specific impacts, a new recommendation, and contingency advice.

The exact result depends on the information provided and the AI-generated assessment.

## Data Storage

The application stores saved decisions in browser `localStorage` under the key:

```text
tiebreaker_saved_decisions_v1
```

This allows saved analyses to remain available across page reloads in the same browser profile.

**Important storage considerations:**

- Saved decisions are stored on the user's device, not in a centralized database.
- Clearing browser storage or using a different browser profile may make the saved records unavailable.
- The current project does not implement server-side user accounts or cloud synchronization.
- Avoid entering sensitive personal, financial, or confidential business information unless you understand how it may be processed by the AI provider and stored in your browser.

## Building for Production

To create and run a production build:

```bash
npm install
npm run build
npm start
```

Set the following environment variables in your deployment environment:

```env
NODE_ENV=production
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
```

The production server expects the frontend build to exist in `dist/`.

For deployment, use a hosting platform that supports Node.js applications and backend environment variables. Configure HTTPS, secure secret storage, and suitable request limits before exposing the service publicly.

## Error Handling and Limitations

The backend includes basic validation and error handling for its API requests.

Potential issues include:

- **Missing API key:** Configure `GEMINI_API_KEY` in the server environment.
- **Invalid request:** Supply a decision topic and at least two options to the analysis endpoint.
- **API or network errors:** Check network connectivity, API credentials, provider availability, and server logs.
- **Unexpected AI response:** The application requests structured JSON, but external API calls can still fail.
- **Local storage limitations:** Saved decisions are browser-specific and are not synchronized across devices.
- **AI-generated recommendations:** Results can be incomplete, inaccurate, or influenced by missing context. Review the reasoning before acting on it.

The application does not replace professional financial, legal, medical, or other specialized advice. Its recommendations should be treated as decision-support material rather than guaranteed outcomes.

## Future Enhancements

Potential improvements for future versions include:

- User authentication and cloud-based decision history.
- Editable decision criteria and more explicit user-controlled weighting.
- Comparison charts and sensitivity analysis.
- Decision history search, filtering, and tagging.
- PDF export with a dedicated report layout.
- Unit and integration tests for API endpoints and UI components.
- Request validation, rate limiting, and improved production security.
- Improved accessibility and automated UI testing.
- Support for additional AI providers or configurable models.

These are possible extensions, not features currently implemented in the project.

## License

No explicit open-source license is defined in the supplied project files. Add a `LICENSE` file before distributing the project under a specific open-source license.

---

**The Tiebreaker — AI Decision Engine**

*Structured reasoning. Clearer trade-offs. More deliberate decisions.*
