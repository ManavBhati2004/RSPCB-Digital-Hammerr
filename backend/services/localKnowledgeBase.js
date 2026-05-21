// Topic-based reusable knowledge so the bot can answer non-formula questions
// without inventing data. Response builder picks `summary` + a few `points`.

const knowledgeBase = {
  // ───────── Website features ─────────
  about_website: {
    summary:
      'This is the Rajasthan State Pollution Control Board (RSPCB) Carbon Emission Calculator — a public, no-login web app to estimate and track the carbon impact of electricity use and vehicle travel for households and factories.',
    points: [
      'Built for citizens, students, factory owners, and analysts in Rajasthan.',
      'It does not store personal identity — you stay anonymous unless you choose to enter a name on a certificate.',
      'Submissions feed a public dashboard and leaderboard so awareness scales with usage.',
      'You can download a personalised certificate of your carbon-saving contribution.',
      'No paid AI is used — every calculation runs locally on the server.'
    ],
    followUps: [
      'How do I submit a calculation?',
      'What does the dashboard show?',
      'How can I generate certificate?'
    ]
  },

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

  submission_flow: {
    summary:
      'Submitting a calculation takes less than a minute and does not require login.',
    points: [
      'Open the Calculator page from the navigation bar.',
      'Choose "Factory" or "Personal" use at the top of the page.',
      'Pick the Electricity or Vehicle tab depending on what you want to calculate.',
      'Enter the numbers — for electricity: monthly units and zero hours; for vehicle: distance, vehicle type, and fuel type.',
      'Press the green Calculate & Submit button. Your entry appears on the dashboard immediately.'
    ],
    followUps: [
      'How can I generate certificate?',
      'What is Factory vs Personal use?',
      'What does consumption mean?'
    ]
  },

  factory_vs_personal: {
    summary:
      'The Calculator has two modes — Factory use and Personal use — which control how your submission is grouped on the dashboard and leaderboard.',
    points: [
      'Personal use is for individuals tracking their own home electricity or daily travel.',
      'Factory use is for industrial units submitting on behalf of their facility — enter the factory name.',
      'Factory submissions are grouped by registration number (auto-generated from the factory name).',
      'Personal entries roll up to an "Individual" leaderboard separate from factories.',
      'You can switch the toggle at the top of the Calculator page before submitting.'
    ],
    followUps: [
      'How can my factory get listed?',
      'How does leaderboard work?',
      'How do I submit a calculation?'
    ]
  },

  upload_help: {
    summary:
      'For electricity submissions you may optionally attach a supporting document such as a copy of your electricity bill.',
    points: [
      'Upload is optional — you can submit a calculation without any document.',
      'Common formats like PDF and image files (JPG, PNG) are accepted.',
      'Uploads are stored on the server and linked to your submission for verification.',
      'Do not upload documents containing personal IDs (Aadhaar, PAN, etc.) — only the bill is needed.',
      'No upload is required for vehicle/fuel submissions.'
    ],
    followUps: [
      'How do I submit a calculation?',
      'Is my data safe?',
      'What does consumption mean?'
    ]
  },

  consumption_meaning: {
    summary:
      'On the electricity tab, "consumption" and "non-consumption" (also called zero hours) are the two numbers used to estimate carbon saved.',
    points: [
      'Consumption = the electricity (in units / kWh) you actually used in the month.',
      'Non-consumption / zero hours = the equivalent hours your facility was idle or your home had power cuts — periods where load could have been avoided.',
      'Carbon saved = consumption × non-consumption × 0.0008541, with the result in Tons of CO₂.',
      'Larger non-consumption values mean more potential savings from running fewer load hours.',
      'For households, you can estimate zero hours from your hours of AC/heater off or power-cut hours per month.'
    ],
    followUps: [
      'How is electricity carbon saved calculated?',
      'Give electricity saving tips'
    ]
  },

  accuracy_question: {
    summary:
      'The calculator gives a reliable estimate using standard emission factors — it is not a lab-grade measurement, but it is good enough for awareness and trend tracking.',
    points: [
      'Petrol/diesel formulas use the widely accepted 2.31 kg CO₂ per litre factor.',
      'Mileage assumptions (35 km/L for 2-wheelers, 13 km/L for petrol cars, 15 km/L for diesel cars) are reasonable defaults — your actual mileage may differ.',
      'Electricity carbon saved uses an India-grid-weighted intensity factor (~0.85 kg CO₂ per kWh).',
      'Results are meant for relative comparison and motivation, not regulatory reporting.',
      'Real factory reporting should use measured grid intensity and certified meter data.'
    ],
    followUps: [
      'How is petrol emission calculated?',
      'How is electricity carbon saved calculated?',
      'About this website'
    ]
  },

  // ───────── Saving and reduction tips ─────────
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
      'How is diesel emission calculated?'
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
      'What does zero hours mean?'
    ]
  },

  // ───────── Related fields and ideas ─────────
  carbon_footprint_definition: {
    summary:
      'Your carbon footprint is the total amount of CO₂ your daily activities release. It is measured in kilograms or tonnes of CO₂.',
    points: [
      'Direct emissions come from things you burn yourself: petrol/diesel in a vehicle, LPG at home.',
      'Indirect emissions come from electricity you use, food you eat, and goods you buy.',
      'For an average Indian household, transport and electricity together account for the largest share.',
      'Reducing it usually means: less fuel, more efficient appliances, and lower-carbon energy sources.'
    ],
    followUps: [
      'How can I reduce my carbon footprint?',
      'What is climate change?',
      'How is petrol emission calculated?'
    ]
  },

  climate_change_basics: {
    summary:
      'Climate change is the long-term rise in the Earth\'s temperature. It happens because gases like CO₂ trap extra heat in the atmosphere when we burn fuel.',
    points: [
      'Burning petrol, diesel, coal, and gas releases CO₂ that stays in the atmosphere for decades.',
      'India is among the most climate-vulnerable countries — heat waves, droughts, and erratic monsoons are getting worse.',
      'Rajasthan in particular faces rising heat, falling groundwater, and desertification pressure.',
      'Reducing emissions and switching to clean energy slows down further warming.'
    ],
    followUps: [
      'How can I reduce my carbon footprint?',
      'Tell me about pollution in Rajasthan',
      'What is solar power?'
    ]
  },

  renewable_energy: {
    summary:
      'Renewable energy — solar, wind, hydro, biomass — generates electricity with little to no CO₂, unlike coal or gas plants.',
    points: [
      'Rajasthan has India\'s largest solar potential and hosts massive solar parks (e.g. Bhadla).',
      'Rooftop solar can offset a large share of household or factory electricity use.',
      'Wind energy is also significant in western Rajasthan (Jaisalmer, Barmer).',
      'Every kWh of renewable electricity displaces ~0.85 kg of grid CO₂.'
    ],
    followUps: [
      'What is solar power?',
      'How can I reduce my carbon footprint?',
      'Give electricity saving tips'
    ]
  },

  solar_power: {
    summary:
      'Solar power turns sunlight into electricity using solar panels. It is the cleanest and lowest-cost source of electricity in Rajasthan.',
    points: [
      'A 1 kW rooftop system can generate ~1,400-1,600 units per year in Rajasthan.',
      'Households can avail subsidies under the PM Surya Ghar / state rooftop solar schemes.',
      'Pay-back is typically 4-6 years; panels last 25+ years.',
      'Even partial coverage (e.g. running daytime AC or pumps on solar) cuts grid carbon meaningfully.'
    ],
    followUps: [
      'What is renewable energy?',
      'Give electricity saving tips',
      'How can my factory get listed?'
    ]
  },

  electric_vehicle: {
    summary:
      'Electric vehicles (EVs) run on a battery and have no exhaust. They produce much less CO₂ than petrol or diesel cars, even when the electricity comes from the normal grid.',
    points: [
      'A typical petrol car emits ~178 g CO₂/km; an EV on the Indian grid emits ~80-100 g CO₂/km — and falls as the grid greens.',
      'EVs cut local air pollution dramatically, which matters in dense cities like Jaipur and Jodhpur.',
      'Running cost is ~₹1-1.5/km for EVs vs ~₹6-8/km for petrol.',
      'Charging from rooftop solar makes EV travel almost zero-carbon.'
    ],
    followUps: [
      'How is petrol emission calculated?',
      'What is renewable energy?',
      'Bike vs car emission'
    ]
  },

  public_transport: {
    summary:
      'Public transport — buses, metro, trains, shared autos — dramatically lowers per-person emissions because the vehicle\'s CO₂ is split across many passengers.',
    points: [
      'A full city bus can replace 40+ private cars on the same route.',
      'Jaipur Metro runs largely on electricity; per-passenger emissions are a fraction of car travel.',
      'Shared autos and carpools also reduce emissions per person.',
      'Even a few public-transport days a week meaningfully cuts your monthly carbon footprint.'
    ],
    followUps: [
      'Give fuel saving tips',
      'How can I reduce my carbon footprint?',
      'Bike vs car emission'
    ]
  },

  air_quality: {
    summary:
      'Air quality tells you how much harmful smoke and tiny dust particles are in the air. The main causes are vehicle exhaust, factory smoke, and burning of fuel or waste.',
    points: [
      'Vehicle exhaust and industrial emissions are the biggest contributors in Rajasthan cities.',
      'PM2.5 (very fine particles) is the most dangerous — it enters the bloodstream and harms lungs and the heart.',
      'Reducing fuel emissions lowers both CO₂ and local air pollution at the same time.',
      'You can check live AQI at apps and dashboards from CPCB and the state board.'
    ],
    followUps: [
      'Tell me about pollution in Rajasthan',
      'Give fuel saving tips',
      'What is climate change?'
    ]
  },

  tree_plantation: {
    summary:
      'Trees absorb CO₂ from the atmosphere and store it as wood — large-scale plantation is one of the cheapest carbon-sequestration tools.',
    points: [
      'A mature tree captures roughly 20-25 kg CO₂ per year.',
      'Native species (neem, peepal, gular, khejri) survive Rajasthan\'s heat best and need less water once established.',
      'Khejri (Prosopis cineraria), the state tree, is especially well-suited to arid zones.',
      'Plantation also cools cities by ~2-3°C and reduces dust storms.'
    ],
    followUps: [
      'How can I reduce my carbon footprint?',
      'Tell me about pollution in Rajasthan',
      'How can I generate certificate?'
    ]
  },

  water_conservation: {
    summary:
      'Saving water also saves carbon — pumping, treating, and heating water all use electricity, which carries grid emissions.',
    points: [
      'Drip irrigation cuts farm water use by 40-60% versus flood irrigation.',
      'Rainwater harvesting is mandatory for many buildings in Rajasthan — it reduces dependence on pumped groundwater.',
      'Fixing a single leaking tap saves thousands of litres per year.',
      'Reusing greywater for gardens lowers both your bill and electricity use.'
    ],
    followUps: [
      'Tell me about pollution in Rajasthan',
      'How can I reduce my carbon footprint?',
      'Give electricity saving tips'
    ]
  },

  waste_management: {
    summary:
      'Burning or landfilling waste releases methane and CO₂ — sorting and composting cut a household\'s carbon footprint significantly.',
    points: [
      'Segregate wet (kitchen) and dry (paper, plastic) waste at the source.',
      'Compost kitchen waste at home — even a small bucket works and gives free fertiliser.',
      'Recycle paper, glass, and metal through local kabadiwalas.',
      'Avoid single-use plastic — Rajasthan has restrictions on many disposable plastic items.'
    ],
    followUps: [
      'How can I reduce my carbon footprint?',
      'What is climate change?',
      'Give electricity saving tips'
    ]
  },

  carpooling_benefits: {
    summary:
      'Carpooling cuts per-person emissions by sharing one vehicle\'s CO₂ across multiple passengers — and saves money too.',
    points: [
      'Sharing a 4-wheeler petrol car with 3 others reduces per-person CO₂ by ~75%.',
      'It also reduces traffic congestion and parking pressure in cities.',
      'For factories, employee carpool programs are a low-cost way to cut scope-3 emissions.',
      'Apps and WhatsApp groups make it easy to find regular carpool partners.'
    ],
    followUps: [
      'How can I reduce my carbon footprint?',
      'Give fuel saving tips',
      'Bike vs car emission'
    ]
  },

  petrol_vs_diesel: {
    summary:
      'On this calculator, diesel and petrol use the same 2.31 kg CO₂ per litre factor, but diesel cars get better mileage (15 km/L vs 13 km/L) so diesel ends up lower per kilometre.',
    points: [
      'Both fuels use 2.31 kg CO₂/L in this calculator.',
      'Diesel cars: ~15 km/L assumed. Petrol cars: ~13 km/L assumed.',
      'Per 100 km: petrol car ≈ 17.77 kg, diesel car ≈ 15.40 kg.',
      'Both fuels emit local pollutants too — electric vehicles and public transport are cleaner.'
    ],
    followUps: [
      'How is petrol emission calculated?',
      'How is diesel emission calculated?',
      'Tell me about electric vehicles'
    ]
  },

  bike_vs_car: {
    summary:
      'A 2-wheeler emits far less CO₂ per kilometre than a car because it uses less fuel — but a fully-occupied car can sometimes beat a single bike rider on per-person emissions.',
    points: [
      '100 km on a petrol bike (35 km/L) ≈ 6.60 kg CO₂.',
      '100 km in a petrol car (13 km/L, solo) ≈ 17.77 kg CO₂.',
      '100 km in the same car with 4 people ≈ 4.44 kg CO₂ per person — lower than the bike.',
      'So for solo short trips, prefer 2-wheelers or EVs; for group travel, prefer carpooling.'
    ],
    followUps: [
      'How is petrol emission calculated?',
      'Tell me about carpooling',
      'Tell me about electric vehicles'
    ]
  },

  rajasthan_specific: {
    summary:
      'Rajasthan faces a mix of climate challenges — extreme heat, scarce water, desertification — but also has unique strengths like world-class solar potential.',
    points: [
      'Average summer temperatures regularly cross 45°C in western districts.',
      'Groundwater depletion is severe — many districts are in the "over-exploited" category.',
      'Rajasthan leads India in installed solar capacity, with huge solar parks like Bhadla.',
      'Native vegetation (khejri, neem, ber) is climate-resilient and culturally important.',
      'State schemes promote rooftop solar, rainwater harvesting, and EV adoption.'
    ],
    followUps: [
      'What is solar power?',
      'How can I reduce my carbon footprint?',
      'What is climate change?'
    ]
  },

  government_schemes: {
    summary:
      'India and Rajasthan run several schemes to reward low-carbon choices — rooftop solar, EV purchases, energy efficiency, and tree plantation.',
    points: [
      'PM Surya Ghar Muft Bijli Yojana — subsidy of up to ₹78,000 for rooftop solar.',
      'FAME II — central subsidy on electric 2- and 3-wheelers.',
      'State EV policy — additional rebates and registration fee waivers in Rajasthan.',
      'PAT (Perform-Achieve-Trade) — energy-efficiency targets for large industries.',
      'CAMPA / state plantation drives — funding and saplings for community plantation.'
    ],
    followUps: [
      'What is solar power?',
      'Tell me about electric vehicles',
      'How can my factory get listed?'
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
