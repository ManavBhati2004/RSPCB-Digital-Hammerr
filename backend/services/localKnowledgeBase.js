// Topic-based reusable knowledge so the bot can answer non-formula questions
// without inventing data. Response builder picks `summary` + a few `points`.

const knowledgeBase = {
  dashboard_explanation: {
    summary:
      'The public dashboard shows overall calculator activity and carbon impact across all submissions for Rajasthan.',
    points: [
      'Total electricity submissions show how many people calculated their electricity carbon savings.',
      'Total vehicle submissions show how many people calculated travel emissions.',
      'Vehicle-wise charts compare 2-wheeler and 4-wheeler impact.',
      'Petrol vs diesel charts compare fuel-based emissions.',
      'Monthly trend shows participation and carbon impact over time.'
    ],
    followUps: [
      'What does total emission mean?',
      'Explain petrol vs diesel chart',
      'How can I improve my dashboard result?'
    ]
  },
  leaderboard_explanation: {
    summary:
      'The leaderboard highlights anonymous participants and factories that perform well on carbon-saving activity.',
    points: [
      'Ranks are based on total carbon saved across electricity and fuel entries.',
      'Both factories and individual contributors have their own boards.',
      'No private personal data is shown — only the name you optionally entered.',
      'It is meant to motivate people to reduce their carbon impact.'
    ],
    followUps: [
      'How can I appear on the leaderboard?',
      'How is rank decided?',
      'Show top contributors'
    ]
  },
  certificate_explanation: {
    summary:
      'Certificates are generated for users who calculate their carbon savings and want a downloadable record.',
    points: [
      'The certificate uses the name you optionally entered (Personal Use) or your factory name.',
      'It shows the carbon saved value, the unit (Kg for fuel, Tons for electricity), and the date.',
      'Open the Calculator page, finish a calculation, then press the "Generate Certificate" button.',
      'The certificate is downloaded as a PDF on your device.'
    ],
    followUps: [
      'Where is the certificate button?',
      'Why is my certificate in Tons?',
      'How can I generate certificate for fuel?'
    ]
  },
  carbon_reduction_tips: {
    summary:
      'Small daily changes add up to a meaningful reduction in your carbon footprint.',
    points: [
      'Use a 2-wheeler or carpool instead of a single-occupant 4-wheeler for short trips.',
      'Switch off appliances at the plug — standby load is real.',
      'Use LED lighting and energy-efficient (5-star) appliances at home and in factories.',
      'Cluster errands into one trip to cut total kilometres driven.',
      'Plant or sponsor native Rajasthan trees — they capture CO₂ over their lifetime.'
    ],
    followUps: [
      'Give electricity saving tips',
      'Give fuel saving tips',
      'How does tree plantation help?'
    ]
  },
  fuel_saving_tips: {
    summary: 'You can save fuel and reduce emissions with a few simple driving habits.',
    points: [
      'Maintain correct tyre pressure — under-inflated tyres cut mileage.',
      'Avoid harsh acceleration and sudden braking.',
      'Service the vehicle on time; a clean air filter improves mileage.',
      'Switch off the engine at long signals (more than ~30 seconds).',
      'Combine short trips and prefer carpool or public transport when possible.'
    ],
    followUps: [
      'How is petrol emission calculated?',
      'How is diesel emission calculated?',
      'Calculate 100 km bike emission'
    ]
  },
  electricity_saving_tips: {
    summary: 'Reducing electricity use directly reduces the carbon footprint of your home or factory.',
    points: [
      'Switch to LED bulbs and 5-star rated appliances.',
      'Set AC to 24-26°C — every degree lower can add ~6% to consumption.',
      'Use natural light during the day; close curtains to keep cool air in.',
      'Unplug chargers and appliances when not in use.',
      'For factories, schedule heavy equipment outside peak hours where possible.'
    ],
    followUps: [
      'How is electricity carbon saved calculated?',
      'What does zero hours mean?',
      'Calculate carbon saved for 600 units and 10 zero hours'
    ]
  },
  website_guide: {
    summary:
      'This is the Rajasthan State Pollution Control Board Carbon Emission Calculator — no login is required.',
    points: [
      'Open the Calculator page to enter electricity usage or vehicle travel and see your CO₂ impact.',
      'Visit the Dashboard for live totals, charts, and recent submissions.',
      'Check the Leaderboard or Top Contributors to see who is saving the most carbon.',
      'You can generate a certificate after any calculation from the Calculator page.',
      'Ask me here for explanations, formulas, or quick calculations in English, Hindi, or Hinglish.'
    ],
    followUps: [
      'How is petrol emission calculated?',
      'What does the dashboard show?',
      'How can I generate certificate?'
    ]
  },
  privacy_explanation: {
    summary:
      'This assistant is privacy-friendly. No login is needed and no personal identity data is required.',
    points: [
      'You stay anonymous — only a random session ID is stored locally in your browser.',
      'Chat logs may be saved without name, phone, email, or address — only topic and message text.',
      'Do not share Aadhaar, phone, email, or other personal IDs in the chat.',
      'You can clear browser storage to forget your session at any time.'
    ],
    followUps: [
      'Do I need to login?',
      'Is my data shared?',
      'How can I delete my session?'
    ]
  },
  general_environment_awareness: {
    summary:
      'Rajasthan faces unique environmental pressures — desert heat, water scarcity, and growing industrial activity.',
    points: [
      'Carbon emissions trap heat and worsen climate impact, including heat waves.',
      'Switching to cleaner fuels, solar power, and efficient appliances reduces local pollution.',
      'Tree plantation and water conservation are especially impactful in arid regions.',
      'Every calculation you submit on this site helps build awareness about Rajasthan-specific emissions.'
    ],
    followUps: [
      'How can I reduce my carbon footprint?',
      'Give electricity saving tips',
      'Give fuel saving tips'
    ]
  }
};

export default knowledgeBase;
