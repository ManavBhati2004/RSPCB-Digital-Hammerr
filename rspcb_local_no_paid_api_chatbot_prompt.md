# Updated Prompt: Local No-Paid-API Chatbot for Rajasthan Carbon Emission Calculator

## 1. Purpose of This Updated Prompt

Update the existing **Green Mitra / Carbon Assistant chatbot** for the Rajasthan State Pollution Control Board Carbon Emission Calculator so that it runs **locally** and does **not use any paid AI API**.

The chatbot must still accept **free text input** from users. It must not be limited to fixed or hardcoded question buttons. Suggested question chips can be shown for convenience, but users must be able to type any relevant question naturally in English, Hindi, or Hinglish.

The chatbot should work in two local modes:

1. **Default Mode: Local Rule-Based Chat Engine**
   - Fully runs inside the MERN backend.
   - Does not need internet.
   - Does not need API key.
   - Uses local intent detection, keyword matching, regex extraction, formula utilities, and a local knowledge base.
   - Best for guaranteed local development and college/project demonstration.

2. **Optional Mode: Local LLM Using Ollama**
   - Uses a locally installed model on the developer's machine.
   - Does not use paid cloud APIs.
   - Backend calls the local Ollama server only.
   - If Ollama is not installed or the model is not running, the chatbot must automatically fall back to the local rule-based engine.

Do **not** use OpenAI API, Gemini API, Claude API, paid Hugging Face inference API, or any other paid/external cloud API.

---

## 2. Project Context

The application is a MERN stack web application for the **Rajasthan State Pollution Control Board Carbon Emission Calculator**.

The website helps people of Rajasthan calculate and understand carbon impact from:

1. **Fuel-based travel**
2. **Electricity carbon saving**

The application has:

- No login system.
- Public calculator pages.
- Public dashboard.
- MongoDB database for storing calculator submissions.
- Nature-inspired green UI theme.
- Advanced dashboard / leaderboard / certificate features may exist in the project and should be explained by the chatbot if present.

The chatbot must be added as a fixed floating assistant at the bottom-right side of every page.

---

## 3. Most Important Requirement

The chatbot must run locally without paid APIs.

### Strict Rules

- Do not ask for `AI_API_KEY`.
- Do not create `.env` variables for paid AI services.
- Do not call any cloud AI provider.
- Do not expose any secret key in frontend.
- Do not require login.
- Do not store personal details.
- Do not make the chatbot only FAQ-button based.
- Allow users to type any relevant question in the chatbot input box.
- Use local calculation logic for formula-based questions.
- Use a local knowledge base and intent engine for general relevant questions.
- Optional local LLM integration must only use local Ollama.

---

## 4. Chatbot Name and Identity

Name the chatbot:

```text
Green Mitra
```

Subtitle:

```text
Carbon guidance for Rajasthan
```

Welcome message:

```text
Namaste! I am Green Mitra, your local carbon assistant. I can help you understand fuel emissions, electricity carbon savings, dashboard results, leaderboard ranking, certificates, and simple ways to reduce your carbon footprint in Rajasthan. What would you like to know?
```

The chatbot should speak in a friendly, simple, helpful, nature-focused tone.

It should support:

- English
- Hindi
- Hinglish

Examples:

```text
How is petrol emission calculated?
100 km bike ka carbon kitna hoga?
Maine 120 km diesel car chalayi, emission batao.
Electricity me 600 unit and 10 zero hours ka carbon saved kitna?
Dashboard me total emission ka kya meaning hai?
Leaderboard kaise work karta hai?
Certificate kaise generate hoga?
Carbon footprint kam kaise kare?
```

---

## 5. UI and Position Requirements

Create a floating fixed-position chatbot widget.

### Desktop

- Launcher button fixed at bottom-right.
- Position: `bottom: 24px; right: 24px;`
- Chat panel width: `380px` to `420px`
- Chat panel height: `560px` to `620px`
- `z-index: 9999`

### Mobile

- Launcher button fixed at bottom-right.
- Position: `bottom: 16px; right: 16px;`
- Chat panel width: `calc(100vw - 24px)`
- Chat panel height: `70vh` to `80vh`

### Behaviour

- Initially show only a circular launcher button.
- On click, open chatbot panel with smooth animation.
- Panel includes header, message area, free-text input, send button, suggested chips, close/minimize button, and privacy note.
- Pressing `Esc` closes the chatbot.
- Pressing `Enter` sends the message.
- Empty input should not be sent.
- The latest message should auto-scroll into view.
- Show typing indicator while backend processes the response.

---

## 6. UI Theme

Use the existing nature-inspired theme.

### Colors

```text
Primary dark green: #0B3D2E
Soft olive green: #C3CC9B
Light beige green: #E4DFB5
Off-white background: #FAFAF1
Deep text color: #1D2A22
Muted text color: #667064
Border color: rgba(11, 61, 46, 0.14)
```

### Design Direction

- Minimal and attractive.
- Rounded cards.
- Soft shadows.
- Clean dashboard-like layout.
- Green and beige gradients.
- Leaf/chat icon for the launcher.
- Smooth transitions.
- Responsive layout.
- Bot message should use a light beige/green bubble.
- User message should use dark green bubble.

---

## 7. Pages Where Chatbot Should Appear

The chatbot must appear on all public pages:

1. Landing / Home page
2. Fuel calculator page
3. Electricity calculator page
4. Public dashboard page
5. Leaderboard page
6. Certificate page
7. About / Guide page
8. Any future public pages

Place the chatbot component near the root layout, not inside one single page only.

Example:

```jsx
function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/fuel-calculator" element={<FuelCalculator />} />
        <Route path="/electricity-calculator" element={<ElectricityCalculator />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/certificate" element={<Certificate />} />
        <Route path="/about" element={<About />} />
      </Routes>
      <ChatbotWidget />
    </>
  );
}
```

---

## 8. Free Text Input Requirement

The chatbot must not be limited to hardcoded FAQ questions.

### Required Behaviour

The user can type anything in the input box.

The backend must classify the message using local logic:

- Detect intent.
- Extract numbers.
- Extract vehicle type.
- Extract fuel type.
- Extract electricity units.
- Extract zero hours.
- Detect dashboard/leaderboard/certificate questions.
- Detect tips/reduction questions.
- Detect out-of-scope questions.
- Return a useful response.

Suggested chips can still be displayed, but they are only shortcuts. They must not be the only way to interact with the chatbot.

---

## 9. Allowed Topics

The chatbot can answer questions related to:

- Fuel emission calculation.
- Petrol emission.
- Diesel emission.
- 2-wheeler emission.
- 4-wheeler emission.
- Electricity carbon saved.
- Meaning of zero hours.
- Dashboard cards and charts.
- Leaderboard ranking.
- Certificate generation.
- Carbon footprint.
- Pollution awareness.
- Sustainable travel.
- Electricity saving.
- Fuel saving.
- Tree plantation.
- Green habits.
- Rajasthan environment awareness.
- How to use the website.
- Privacy-friendly anonymous data saving.

---

## 10. Out-of-Scope Topics

If the user asks unrelated questions, politely redirect.

Unrelated examples:

- Movies
- Songs
- Games
- Personal relationship advice
- Political debate
- Financial investment
- Medical diagnosis
- Hacking
- Adult content
- Any topic not related to carbon, pollution, environment, dashboard, leaderboard, certificate, or this website

Redirect response:

```text
I am Green Mitra, a local assistant for carbon emission calculation, electricity saving, fuel usage, dashboard guidance, leaderboard, certificates, and pollution awareness for Rajasthan. Please ask me something related to this website or your carbon footprint.
```

---

## 11. Exact Formulas

The chatbot must use the same formulas as the main calculator.

### Fuel Calculation

```text
2-wheeler petrol emission = (km / 35) * 2.31
4-wheeler petrol emission = (km / 13) * 2.31
4-wheeler diesel emission = (km / 15) * 2.68
```

### Electricity Carbon Saved

```text
carbon saved = monthlyUnits * zeroHours * 0.001134
```

### Rules

- Output all results in kg.
- Round results to 2 decimals.
- If vehicle type is 2-wheeler, fuel is petrol by default.
- If vehicle type is 4-wheeler and fuel is missing, ask whether it is petrol or diesel.
- If electricity values are missing, ask for monthly units and zero hours.
- Do not invent dashboard numbers.
- Do not invent leaderboard ranking.
- Do not invent certificate details.

---

## 12. Example Calculations

### Example 1

User:

```text
I travelled 100 km by 2-wheeler. How much carbon?
```

Bot:

```text
For a 2-wheeler, fuel is considered petrol.

Formula: (km / 35) × 2.31
Calculation: (100 / 35) × 2.31 = 6.60 kg CO₂

Your estimated carbon emission is **6.60 kg CO₂**.
```

### Example 2

User:

```text
120 km diesel car emission
```

Bot:

```text
For a 4-wheeler diesel vehicle:

Formula: (km / 15) × 2.68
Calculation: (120 / 15) × 2.68 = 21.44 kg CO₂

Your estimated carbon emission is **21.44 kg CO₂**.
```

### Example 3

User:

```text
600 unit electricity and 10 zero hours
```

Bot:

```text
For electricity carbon saving:

Formula: monthlyUnits × zeroHours × 0.001134
Calculation: 600 × 10 × 0.001134 = 6.80 kg

Your estimated carbon saved is **6.80 kg**.
```

### Example 4

User:

```text
bike se 70 km gaya hu carbon batao
```

Bot:

```text
2-wheeler ke liye fuel petrol maana gaya hai.

Formula: (km / 35) × 2.31
Calculation: (70 / 35) × 2.31 = 4.62 kg CO₂

Aapka estimated carbon emission **4.62 kg CO₂** hai.
```

---

## 13. Local Chatbot Engine Architecture

Create a backend local chatbot engine instead of paid API integration.

Recommended structure:

```text
server/
  controllers/
    chatbotController.js
  routes/
    chatbotRoutes.js
  models/
    ChatMessage.js
  services/
    localChatEngine.js
    localIntentDetector.js
    localKnowledgeBase.js
    localResponseBuilder.js
    topicGuardService.js
    ollamaLocalService.js
  utils/
    carbonFormulaUtils.js
    messageParser.js
    languageDetector.js
```

### Important

Replace any old paid AI service file such as:

```text
aiChatService.js
```

with:

```text
localChatEngine.js
```

or keep `aiChatService.js` only if it calls local Ollama. It must not call paid APIs.

---

## 14. Backend Route

Create route:

```text
POST /api/chatbot/message
```

Request payload:

```json
{
  "message": "100 km bike carbon batao",
  "sessionId": "anonymous-session-id",
  "pageContext": {
    "currentPage": "fuel-calculator",
    "calculatorType": "fuel"
  }
}
```

Response payload:

```json
{
  "success": true,
  "reply": "2-wheeler ke liye fuel petrol maana gaya hai...",
  "intent": "fuel_calculation",
  "engine": "local-rules",
  "suggestedQuestions": [
    "How can I reduce fuel emissions?",
    "What does the dashboard show?"
  ]
}
```

---

## 15. Backend Processing Flow

The backend must process a user message like this:

1. Receive `message`, `sessionId`, and `pageContext`.
2. Validate that message is not empty.
3. Limit message length using `CHATBOT_MAX_MESSAGE_LENGTH`.
4. Normalize text:
   - Lowercase
   - Remove extra spaces
   - Keep important numbers
   - Support English/Hindi/Hinglish words
5. Detect language style:
   - English
   - Hindi
   - Hinglish
6. Run topic guard.
7. Detect intent.
8. Extract calculation values.
9. If enough calculation values are present:
   - Use local formula utilities.
   - Return calculated answer.
10. If calculation values are incomplete:
   - Ask a short follow-up question.
11. If message is about dashboard, leaderboard, certificate, website guide, privacy, or tips:
   - Use local knowledge base and response builder.
12. If message is relevant but too broad:
   - Use local knowledge base or optional local Ollama if enabled.
13. Save anonymous chat log in MongoDB if enabled.
14. Return response to frontend.

---

## 16. Local Formula Utility Functions

Create:

```js
function calculateTwoWheelerEmission(km) {
  return Number(((km / 35) * 2.31).toFixed(2));
}

function calculateFourWheelerPetrolEmission(km) {
  return Number(((km / 13) * 2.31).toFixed(2));
}

function calculateFourWheelerDieselEmission(km) {
  return Number(((km / 15) * 2.68).toFixed(2));
}

function calculateElectricityCarbonSaved(monthlyUnits, zeroHours) {
  return Number((monthlyUnits * zeroHours * 0.001134).toFixed(2));
}

module.exports = {
  calculateTwoWheelerEmission,
  calculateFourWheelerPetrolEmission,
  calculateFourWheelerDieselEmission,
  calculateElectricityCarbonSaved
};
```

---

## 17. Message Parser Requirements

Create `messageParser.js`.

It should extract:

```text
distanceKm
vehicleType
fuelType
monthlyUnits
zeroHours
```

### Distance Detection Examples

Recognize:

```text
100 km
100km
I travelled 100 kilometers
100 kilometre
100 किलोमीटर
70 km bike
bike se 70 km
```

### Vehicle Detection Examples

2-wheeler words:

```text
2 wheeler, two wheeler, bike, motorcycle, scooter, scooty, activa, बाइक, स्कूटर, gaadi bike
```

4-wheeler words:

```text
4 wheeler, four wheeler, car, vehicle, gadi, gaadi, कार
```

### Fuel Detection Examples

Petrol words:

```text
petrol, petrol car, petrol vehicle, पेट्रोल
```

Diesel words:

```text
diesel, diesel car, डीजल
```

### Electricity Detection Examples

Recognize:

```text
600 units
600 unit
monthly unit 600
bijli 600 unit
electricity 600 units
zero hours 10
10 zero hours
10 ghante off
10 hours no electricity
```

---

## 18. Intent Detection Requirements

Create `localIntentDetector.js`.

The intent detector should return:

```js
{
  intent: "fuel_calculation",
  confidence: 0.92,
  topic: "fuel"
}
```

### Required Intents

```text
fuel_calculation
electricity_calculation
fuel_formula_explanation
electricity_formula_explanation
dashboard_explanation
leaderboard_explanation
certificate_explanation
carbon_reduction_tips
fuel_saving_tips
electricity_saving_tips
website_guide
privacy_explanation
general_environment_awareness
out_of_scope
unknown_relevant
```

### Keyword Examples

Fuel:

```text
carbon, emission, petrol, diesel, fuel, vehicle, km, kilometer, bike, scooter, car, gaadi, gadi, 2 wheeler, 4 wheeler
```

Electricity:

```text
electricity, unit, units, zero hour, zero hours, bijli, light, energy, urja, power saving, carbon saved
```

Dashboard:

```text
dashboard, chart, graph, report, total emission, average, submission, analytics
```

Leaderboard:

```text
leaderboard, rank, top user, best performer, performance, score, position
```

Certificate:

```text
certificate, download certificate, generate certificate, reward, badge, achievement
```

Tips:

```text
reduce, save, decrease, kam, bachat, tips, improve, eco friendly, green habit
```

Out of scope:

Use negative topic detection for clearly unrelated messages, but do not block environmental Hinglish questions.

---

## 19. Local Knowledge Base Requirements

Create `localKnowledgeBase.js`.

Do not store only exact fixed questions. Store reusable topic-based knowledge and response fragments.

Example structure:

```js
const knowledgeBase = {
  dashboard_explanation: {
    summary: "The public dashboard shows overall calculator activity and carbon impact...",
    points: [
      "Total fuel submissions show how many people calculated travel emissions.",
      "Total electricity submissions show how many people calculated electricity carbon savings.",
      "Vehicle-wise charts compare 2-wheeler and 4-wheeler impact.",
      "Petrol vs diesel chart compares fuel-based emissions.",
      "Monthly trend shows changes in participation and carbon impact over time."
    ],
    followUps: [
      "What does total emission mean?",
      "Explain petrol vs diesel chart",
      "How can I improve my dashboard result?"
    ]
  },
  leaderboard_explanation: {
    summary: "The leaderboard highlights people or anonymous participants who perform well based on carbon-saving activity...",
    points: [
      "Ranks can be based on total carbon saved, number of eco-friendly actions, and low-emission travel choices.",
      "The leaderboard should not show private personal data.",
      "It helps motivate people to reduce carbon impact."
    ]
  },
  certificate_explanation: {
    summary: "Certificates are generated for users who achieve good carbon-saving performance...",
    points: [
      "A certificate may include participant name if the user chooses to enter it.",
      "It can show carbon saved, rank, badge, date, and certificate ID.",
      "Certificate generation should be optional and privacy-friendly."
    ]
  }
};

module.exports = knowledgeBase;
```

The response builder should combine these fragments based on detected intent and language style.

---

## 20. Optional Local LLM Mode Using Ollama

Add optional support for local Ollama only.

This mode is optional. The app must still work without it.

### When to Use Ollama

Use local Ollama only when:

- `CHATBOT_ENGINE=ollama`
- `OLLAMA_ENABLED=true`
- Ollama server is running locally
- The message is relevant
- The local rule engine cannot confidently answer the message

### Never Use Ollama For

- Simple formula calculations where values are clear
- Out-of-scope questions
- Cases where required values are missing

### Local Ollama Endpoint

Use backend fetch to call:

```text
POST http://localhost:11434/api/chat
```

Use request body:

```json
{
  "model": "llama3.2:3b",
  "stream": false,
  "messages": [
    {
      "role": "system",
      "content": "You are Green Mitra..."
    },
    {
      "role": "user",
      "content": "User question here"
    }
  ]
}
```

### Ollama Service

Create `ollamaLocalService.js`:

```js
async function askLocalOllama({ message, systemPrompt, conversationHistory = [] }) {
  const baseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
  const model = process.env.OLLAMA_MODEL || 'llama3.2:3b';

  const response = await fetch(`${baseUrl}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      stream: false,
      messages: [
        { role: 'system', content: systemPrompt },
        ...conversationHistory,
        { role: 'user', content: message }
      ]
    })
  });

  if (!response.ok) {
    throw new Error('Local Ollama server is not available');
  }

  const data = await response.json();
  return data?.message?.content || '';
}

module.exports = { askLocalOllama };
```

### Fallback Rule

If Ollama fails:

```text
Return a helpful local knowledge-base response instead of showing a technical error.
```

Example user-facing fallback:

```text
I can answer using my local guide. Please ask about fuel emission, electricity savings, dashboard, leaderboard, certificate, or carbon reduction tips.
```

---

## 21. Local System Prompt for Ollama

Use this only inside the backend when optional Ollama mode is enabled.

```text
You are Green Mitra, a local carbon-emission assistant for the Rajasthan State Pollution Control Board Carbon Emission Calculator web application.

You help public users understand fuel emissions, electricity carbon savings, dashboard results, leaderboard ranking, certificate generation, and practical ways to reduce carbon footprint.

Answer only questions related to:
- fuel emission
- petrol and diesel impact
- 2-wheeler and 4-wheeler calculation
- electricity carbon saving
- dashboard explanation
- leaderboard explanation
- certificate generation
- pollution awareness
- sustainability
- Rajasthan environment
- how to use this website

Use these exact formulas:
1. 2-wheeler petrol emission = (km / 35) * 2.31
2. 4-wheeler petrol emission = (km / 13) * 2.31
3. 4-wheeler diesel emission = (km / 15) * 2.68
4. Electricity carbon saved = monthlyUnits * zeroHours * 0.001134

Output calculated results in kg and round to 2 decimal places.

Rules:
- If vehicle is 2-wheeler, fuel is petrol by default.
- If vehicle is 4-wheeler and fuel is missing, ask whether it is petrol or diesel.
- If electricity values are missing, ask for monthly units and zero hours.
- Do not invent dashboard data.
- Do not invent leaderboard data.
- Do not invent certificate IDs.
- Do not ask for login.
- Do not ask for personal identity details.
- Keep answers simple and under 120 words unless the user asks for details.
- Reply in English, Hindi, or Hinglish based on the user's message.
- If the user asks unrelated questions, politely redirect them to this website's carbon emission and pollution awareness topics.
```

---

## 22. Environment Variables

Use this `.env` for local development:

```env
CHATBOT_ENABLED=true
CHATBOT_ENGINE=local-rules
CHATBOT_SAVE_LOGS=true
CHATBOT_MAX_MESSAGE_LENGTH=800

# Optional local LLM mode only
OLLAMA_ENABLED=false
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2:3b
OLLAMA_TIMEOUT_MS=12000
```

For optional Ollama mode:

```env
CHATBOT_ENGINE=ollama
OLLAMA_ENABLED=true
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2:3b
```

Do not include:

```env
AI_API_KEY
AI_API_BASE_URL
OPENAI_API_KEY
GEMINI_API_KEY
ANTHROPIC_API_KEY
```

---

## 23. MongoDB Chat Message Schema

Create `ChatMessage.js`.

```js
const mongoose = require('mongoose');

const ChatMessageSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      index: true
    },
    userMessage: {
      type: String,
      required: true,
      trim: true,
      maxlength: 800
    },
    botReply: {
      type: String,
      required: true,
      trim: true
    },
    topic: {
      type: String,
      enum: [
        'fuel',
        'electricity',
        'dashboard',
        'leaderboard',
        'certificate',
        'website-guide',
        'carbon-awareness',
        'tips',
        'privacy',
        'out-of-scope',
        'general'
      ],
      default: 'general'
    },
    intent: {
      type: String,
      default: 'unknown_relevant'
    },
    confidence: {
      type: Number,
      default: 0
    },
    extractedData: {
      distanceKm: Number,
      vehicleType: String,
      fuelType: String,
      monthlyUnits: Number,
      zeroHours: Number
    },
    pageContext: {
      currentPage: String,
      calculatorType: String
    },
    engine: {
      type: String,
      enum: ['local-rules', 'ollama', 'fallback'],
      default: 'local-rules'
    },
    isRelevant: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('ChatMessage', ChatMessageSchema);
```

Do not store personal details such as phone number, address, Aadhaar number, email, or government ID.

---

## 24. Frontend Component Structure

Use React.

Recommended structure:

```text
src/
  components/
    chatbot/
      ChatbotWidget.jsx
      ChatbotHeader.jsx
      ChatbotMessages.jsx
      ChatbotInput.jsx
      SuggestedQuestions.jsx
      chatbot.css
  services/
    chatbotService.js
```

### `ChatbotWidget.jsx` Requirements

The component should:

- Manage open/close state.
- Store messages.
- Show welcome message on first open.
- Allow free text input.
- Send user message to backend.
- Show typing indicator.
- Show error message when backend fails.
- Auto-scroll to latest message.
- Create anonymous session ID in localStorage.
- Pass current page context.
- Render suggested chips only as optional shortcuts.

State:

```js
const [isOpen, setIsOpen] = useState(false);
const [messages, setMessages] = useState([]);
const [input, setInput] = useState('');
const [isLoading, setIsLoading] = useState(false);
const [sessionId, setSessionId] = useState(null);
```

Anonymous session key:

```js
carbon_chat_session_id
```

---

## 25. Frontend API Service

Create `chatbotService.js`.

```js
export async function sendChatMessage({ message, sessionId, pageContext }) {
  const response = await fetch('/api/chatbot/message', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message,
      sessionId,
      pageContext
    })
  });

  if (!response.ok) {
    throw new Error('Chatbot API failed');
  }

  return response.json();
}
```

---

## 26. Suggested Question Chips

Show chips as optional shortcuts only.

Suggested chips:

```text
How is petrol emission calculated?
How is diesel emission calculated?
Calculate 100 km bike emission
How do I calculate electricity savings?
What does the dashboard show?
How does leaderboard work?
How can I generate certificate?
How can I reduce my carbon footprint?
Give electricity saving tips
```

Important:

Even if no chip matches, the user should still be able to type any relevant free-text question.

---

## 27. Dashboard, Leaderboard, and Certificate Support

The chatbot should explain these features using local knowledge.

### Dashboard Explanation

The bot can explain:

- Total submissions
- Total fuel emissions
- Total electricity carbon saved
- Average emission
- Petrol vs diesel comparison
- Vehicle-wise impact
- Monthly trends
- Top categories

### Leaderboard Explanation

The bot can explain:

- Leaderboard ranks top performers.
- Ranking can be based on carbon saved, low-emission travel, or eco-friendly score.
- It should not reveal private user data.
- It motivates users to improve their environmental performance.

### Certificate Explanation

The bot can explain:

- Certificates are generated for good performance.
- Certificate may show name only if user voluntarily enters it.
- Certificate may include carbon saved, badge, rank, date, and certificate ID.
- Certificate should be downloadable as PDF if implemented.

The bot must not create fake ranks, fake names, or fake certificate IDs.

---

## 28. Privacy Note

Show in chatbot footer:

```text
This local assistant stores anonymous chat data only to improve guidance. Do not share personal details.
```

Rules:

- No login.
- No personal identity requirement.
- No phone number required.
- No email required.
- No Aadhaar number.
- Store only anonymous session ID and chat topic data.

---

## 29. Error Handling

### Backend Error

User-facing message:

```text
Sorry, I am having trouble answering right now. You can still use the calculator, and I can help again in a moment.
```

### Ollama Not Running

User-facing message should not be technical.

```text
I am using my local guide right now. Please ask about fuel emission, electricity savings, dashboard, leaderboard, certificate, or carbon reduction tips.
```

### Message Too Long

```text
Please ask a shorter question related to carbon emission, fuel, electricity, dashboard, leaderboard, or certificate.
```

### Missing Fuel Data

```text
Please tell me the distance travelled in km and vehicle type. If it is a 4-wheeler, also tell me petrol or diesel.
```

### Missing Electricity Data

```text
Please tell me monthly electricity units and zero hours.
```

---

## 30. Accessibility Requirements

- Launcher button: `aria-label="Open carbon assistant"`
- Close button: `aria-label="Close carbon assistant"`
- Input placeholder: `Ask about carbon emission...`
- Send button must be keyboard accessible.
- Enter key sends message.
- Escape key closes panel.
- Text contrast must be readable.
- Chat panel should not block important mobile content.
- Focus should move logically when chat opens/closes.

---

## 31. CSS Direction

Use CSS similar to:

```css
.chatbot-launcher {
  position: fixed;
  right: 24px;
  bottom: 24px;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: none;
  background: #0B3D2E;
  color: #E4DFB5;
  box-shadow: 0 18px 40px rgba(11, 61, 46, 0.28);
  cursor: pointer;
  z-index: 9999;
}

.chatbot-panel {
  position: fixed;
  right: 24px;
  bottom: 96px;
  width: 400px;
  height: 580px;
  background: #FAFAF1;
  border: 1px solid rgba(11, 61, 46, 0.14);
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 24px 80px rgba(11, 61, 46, 0.24);
  z-index: 9999;
  display: flex;
  flex-direction: column;
}

.chatbot-header {
  background: linear-gradient(135deg, #0B3D2E 0%, #214F3D 100%);
  color: #FAFAF1;
  padding: 18px 20px;
}

.bot-bubble {
  background: #E4DFB5;
  color: #1D2A22;
  border-radius: 18px 18px 18px 4px;
}

.user-bubble {
  background: #0B3D2E;
  color: #FAFAF1;
  border-radius: 18px 18px 4px 18px;
}

@media (max-width: 600px) {
  .chatbot-panel {
    right: 12px;
    left: 12px;
    bottom: 88px;
    width: auto;
    height: 76vh;
    border-radius: 24px;
  }

  .chatbot-launcher {
    right: 16px;
    bottom: 16px;
  }
}
```

---

## 32. Optional Local Ollama Setup Notes for Developer

The code should not require Ollama by default.

For optional local LLM mode, the developer can install Ollama and run a local model.

Example commands:

```bash
ollama pull llama3.2:3b
ollama serve
```

Then set:

```env
CHATBOT_ENGINE=ollama
OLLAMA_ENABLED=true
OLLAMA_MODEL=llama3.2:3b
```

The application must still run when Ollama is not installed by using:

```env
CHATBOT_ENGINE=local-rules
OLLAMA_ENABLED=false
```

---

## 33. Final Expected Output

Generate a complete chatbot module for the MERN project with:

1. Fixed bottom-right chatbot button.
2. Expandable chatbot panel.
3. Free-text user input.
4. Suggested chips as optional shortcuts.
5. No paid API.
6. No external cloud AI service.
7. Local rule-based chatbot engine.
8. Optional local Ollama integration.
9. Automatic fallback if Ollama is unavailable.
10. Local formula calculation support.
11. Intent detection.
12. Message parsing for English, Hindi, and Hinglish.
13. Local knowledge base.
14. Topic guard.
15. Anonymous MongoDB chat logs.
16. Public access on all pages.
17. No login system.
18. Dashboard explanation support.
19. Leaderboard explanation support.
20. Certificate explanation support.
21. Green nature-themed responsive UI.
22. Error handling and loading states.
23. Accessibility support.

---

## 34. Exact Prompt to Give to an AI Code Generator

Use this prompt directly:

```text
Update my MERN stack Rajasthan State Pollution Control Board Carbon Emission Calculator chatbot so it runs locally without any paid API.

The application is a public no-login website. Calculator submissions are saved in MongoDB and the dashboard is publicly visible. The chatbot should also be public and should not require login.

Create a floating fixed-position chatbot at the bottom-right corner of every page. Initially show only a circular launcher button. When clicked, open a modern chatbot panel. The UI must be minimal, attractive, nature-themed, responsive, and use these colors: dark green #0B3D2E, soft olive #C3CC9B, light beige #E4DFB5, off-white #FAFAF1.

Name the bot Green Mitra. Subtitle: Carbon guidance for Rajasthan. Welcome message: "Namaste! I am Green Mitra, your local carbon assistant. I can help you understand fuel emissions, electricity carbon savings, dashboard results, leaderboard ranking, certificates, and simple ways to reduce your carbon footprint in Rajasthan. What would you like to know?"

Important: The chatbot must accept free-text input. It must not be limited to hardcoded questions. Suggested question chips are allowed only as shortcuts. Users should be able to type relevant questions naturally in English, Hindi, or Hinglish.

Do not use OpenAI API, Gemini API, Claude API, paid Hugging Face inference API, or any paid/external cloud AI API. Do not create AI_API_KEY or cloud API environment variables.

Build a local chatbot backend using:
- localChatEngine.js
- localIntentDetector.js
- localKnowledgeBase.js
- localResponseBuilder.js
- topicGuardService.js
- messageParser.js
- carbonFormulaUtils.js
- optional ollamaLocalService.js only for local Ollama

Default chatbot engine must be local-rules. It should run fully offline using local intent detection, keyword matching, regex parsing, formula calculation, and local knowledge-base responses.

Optional local LLM mode may use Ollama only when CHATBOT_ENGINE=ollama and OLLAMA_ENABLED=true. It should call only http://localhost:11434/api/chat from the backend. If Ollama is unavailable, automatically fall back to local-rules. The app must work without Ollama.

Use these exact formulas:
1. 2-wheeler petrol emission = (km / 35) * 2.31
2. 4-wheeler petrol emission = (km / 13) * 2.31
3. 4-wheeler diesel emission = (km / 15) * 2.68
4. Electricity carbon saved = monthlyUnits * zeroHours * 0.001134

All results must be in kg and rounded to 2 decimals. If vehicle is 2-wheeler, fuel is petrol by default. If vehicle is 4-wheeler and fuel is missing, ask whether it is petrol or diesel. If electricity values are missing, ask for monthly units and zero hours.

The chatbot should answer only relevant topics:
- carbon emission
- fuel calculation
- petrol and diesel impact
- electricity carbon saving
- dashboard explanation
- leaderboard explanation
- certificate generation
- pollution awareness
- sustainability
- Rajasthan environment
- website guidance
- carbon reduction tips

If the user asks unrelated questions, politely redirect them to carbon emission, electricity saving, fuel emission, pollution awareness, dashboard, leaderboard, certificate, or website guidance.

Frontend requirements:
- Create React components: ChatbotWidget, ChatbotHeader, ChatbotMessages, ChatbotInput, SuggestedQuestions.
- Add ChatbotWidget to the root App layout so it appears on all pages.
- Use localStorage to create anonymous session ID named carbon_chat_session_id.
- Send free-text messages to POST /api/chatbot/message.
- Show typing indicator, loading state, error state, auto-scroll, close/minimize, Enter-to-send, Esc-to-close, responsive design, and privacy note.

Backend requirements:
- Create Express route POST /api/chatbot/message.
- Validate message and limit length to CHATBOT_MAX_MESSAGE_LENGTH.
- Normalize text and detect language style.
- Run topic guard.
- Detect intent using localIntentDetector.
- Extract distance, vehicle type, fuel type, monthly units, and zero hours using messageParser.
- Calculate locally when values are available.
- Ask follow-up when values are missing.
- Use localKnowledgeBase for dashboard, leaderboard, certificate, tips, privacy, and website guide questions.
- Save anonymous chat logs in MongoDB using ChatMessage model.
- Do not store personal data.

Use these environment variables only:
CHATBOT_ENABLED=true
CHATBOT_ENGINE=local-rules
CHATBOT_SAVE_LOGS=true
CHATBOT_MAX_MESSAGE_LENGTH=800
OLLAMA_ENABLED=false
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2:3b
OLLAMA_TIMEOUT_MS=12000

Create MongoDB schema with sessionId, userMessage, botReply, topic, intent, confidence, extractedData, pageContext, engine, isRelevant, and timestamps.

Make the chatbot polished, local, production-ready for a college/project demonstration, responsive, privacy-friendly, and fully integrated with the MERN application.
```
