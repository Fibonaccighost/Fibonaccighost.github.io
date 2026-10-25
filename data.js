// ─────────────────────────────────────────────────────────────
// All portfolio + resume content lives here. Edit, save, refresh.
//
// To add a project: copy one { ... } block inside a company's
// `projects` list and edit it. Newest first reads best.
//
//   resume: false      → shows on the website, left off the resume
//   resumeLine         → the one-line version used on the resume
//   why                → why the project is useful (shown when a project is opened)
//   links              → live products only. Never link to code; it stays private.
//   figure             → the dot-and-line figure drawn for the project (see figures.js):
//                        clipper, brain, ranking, bi, closet, sales, distribution, ripple,
//                        avatar, loop, modules, steps, funnel, board, leaf, pareto, gauge
// ─────────────────────────────────────────────────────────────

window.PORTFOLIO = {
  profile: {
    name: "Rahul Singh",
    role: "Product Manager",
    location: "Bengaluru, India",
    mapPin: [77.59, 12.97], // [longitude, latitude] marked on the India map
    email: "sunitarahulsingh2002@gmail.com",
    phone: "+91 99968 83635", // printed on the resume only, never shown on the website
    website: "",              // e.g. "rahulsingh.in", printed on the resume
    linkedin: "https://www.linkedin.com/in/rahul-singh-2732572b8",
    x: "https://x.com/ghostfibonacci",
    intro:
      "I build products and the systems behind them: distribution engines, AI tools and dashboards that make growth predictable, measurable and repeatable.",
    resumeSummary:
      "Product manager who builds systems that make growth repeatable. Scaled content distribution to 900M+ views (167M+ a month at peak) at The Prakhar Gupta Xperience, and now builds products and internal systems at OWLED. I see brand and content as distribution infrastructure that compounds when it's built right."
  },

  experience: [
    {
      company: "OWLED",
      role: "Product Manager",
      start: "2026-03",
      end: null, // null = Present
      location: "Bengaluru",
      url: "https://www.owledmedia.com",
      summary: "Building products and internal systems that make the agency faster, better and cheaper to run.",
      projects: [
        {
          name: "The Clipper System",
          figure: "clipper",
          year: "2026",
          type: "Product",
          summary: "A clipping platform, along the lines of Whop's Content Rewards: clippers turn long-form content into short clips, post them, and get rewarded for the views they bring in.",
          why: "Brands and creators get distribution at the scale of hundreds of accounts without hiring an editing team, and pay for the views the clips actually earn.",
          resumeLine: "Built The Clipper System, a clipping platform similar to Whop's Content Rewards.",
          impact: [],
          stack: [],
          links: [],
          resume: true
        },
        {
          name: "Owled Brain",
          figure: "brain",
          year: "2026",
          type: "Internal system",
          summary: "The company's AI knowledge base. Decks, strategy docs and meeting transcripts go in, an LLM files them into a growing tree of pages, and a knowledge graph answers questions with cited sources.",
          why: "An agency's knowledge sits in old decks, call recordings and people's heads. This makes it findable: anyone can ask what worked on a past campaign and get an answer they can trace back to the source, so every new pitch starts from what the company already knows.",
          resumeLine: "Built the company's AI knowledge base, turning decks, docs and transcripts into a knowledge graph that answers with cited sources.",
          impact: ["Answers questions about past work with sources the team can check"],
          stack: ["Python", "LLMs", "Knowledge graph", "Supabase"],
          links: [],
          resume: true
        }
      ]
    },
    {
      // Things built on my own. Shown as tiles and as "Independent projects" on the resume.
      independent: true,
      company: "Independent",
      role: "Founder & builder",
      start: "2024",
      end: null,
      location: "",
      url: "",
      summary: "",
      projects: [
        {
          name: "Startup Jobs Board",
          figure: "ranking",
          year: "2026",
          type: "Product",
          summary: "A live board of startup roles open to Indian talent, in India, remote or abroad. Job seekers browse and apply free; startups pay to feature a listing, and its boost runs down by a public formula over 30 days.",
          why: "Indian candidates get one free, login-free place to find startup roles, including remote roles and jobs abroad with visa sponsorship. Startups pay only when they want more reach, and the ranking formula is public, so no one can quietly buy the top spot forever.",
          resumeLine: "Built and launched startupjobs.lol, a pay-to-feature startup jobs board with live ranking and payments.",
          impact: ["Live at startupjobs.lol", "335 apply clicks tracked from 224 visitors (Oct 2026)"],
          stack: ["Next.js", "Supabase", "Cloudflare Workers", "Dodo Payments"],
          links: [{ label: "Visit startupjobs.lol", url: "https://startupjobs.lol" }],
          resume: true
        },
        {
          name: "Knowledge Core",
          figure: "bi",
          year: "2026",
          type: "Product",
          summary: "A conversational BI platform. Connect a database and it maps the schema into a knowledge graph, then answers questions and builds dashboards in plain language, querying your data live.",
          why: "Most teams wait on an analyst for simple data questions. This lets anyone ask in plain language and get an answer drawn from the company's own live data, not a guess, with dashboards built on the spot.",
          resumeLine: "Built Knowledge Core, an AI BI platform that answers questions and builds dashboards over a company's own data.",
          impact: [],
          stack: ["Java / Spring Boot", "Python / FastAPI", "React", "Memgraph", "pgvector", "LangGraph"],
          links: [],
          resume: true
        },
        {
          name: "Your Closet",
          figure: "closet",
          year: "2026",
          type: "Product",
          summary: "An intentional wardrobe app. Add your clothes and describe your week, and it suggests outfits from what you own, shows what's missing, and tells you the one thing to buy next, or to buy nothing.",
          why: "Most people own clothes they don't wear and keep buying more. This starts from what you already own, so the default is to wear something you have, and it suggests a purchase only when your week actually needs one. Your wardrobe stays on your phone.",
          resumeLine: "Built Your Closet, an offline-first wardrobe app with AI photo import and paid credits.",
          impact: [],
          stack: ["React PWA", "Supabase", "Claude API", "Dodo Payments"],
          links: [],
          resume: true
        },
        {
          name: "Power BI Sales Dashboard",
          figure: "sales",
          year: "2024",
          type: "Dashboard",
          summary: "A sales dashboard built in Power BI.",
          why: "Puts sales numbers in one view, so trends and weak spots are visible at a glance.",
          resumeLine: "Built a Power BI sales dashboard.",
          impact: [],
          stack: ["Power BI"],
          links: [],
          resume: false
        }
      ]
    },
    {
      company: "The Prakhar Gupta Xperience",
      role: "Distribution & Content Operations Specialist",
      start: "2024-10",
      end: "2026-01",
      location: "Faridabad, Haryana",
      url: "",
      summary: "Built the content distribution and operations engine from zero to scale, turning content into a repeatable growth system instead of a hit-driven process.",
      projects: [
        {
          name: "Content Distribution System",
          figure: "distribution",
          year: "2024–26",
          type: "System",
          summary: "Large-scale, multi-platform distribution across owned pages, run like a growth funnel: constant hook, format and retention experiments, tracked on cost per 1K views, RPM, retention and view efficiency.",
          why: "A great episode only matters if people see it. This made getting every episode in front of viewers a repeatable process instead of a one-off push.",
          resumeLine: "Built the multi-platform distribution system from scratch that scaled to 900M+ views, peaking at 167M+ views a month.",
          impact: ["900M+ views through systems built from scratch", "167M+ monthly views at peak"],
          stack: ["YouTube Studio", "BI tools"],
          links: [],
          resume: true
        },
        {
          name: "Content Marketing Campaigns",
          figure: "ripple",
          year: "2024–26",
          type: "Campaigns",
          summary: "Focused campaigns for the podcast.",
          why: "Campaigns put specific episodes and moments in front of more people.",
          resumeLine: "Delivered 15M+ views through focused campaigns.",
          impact: ["15M+ views"],
          stack: [],
          links: [],
          resume: true
        },
        {
          name: "AI Avatars & Automations",
          figure: "avatar",
          year: "2025",
          type: "Automation",
          summary: "AI avatars and automations that compressed turnaround time and cut manual work.",
          why: "Took repetitive production and admin work off the team, freeing time for creative work.",
          resumeLine: "Implemented AI avatars and automations that compressed turnaround time and cut manual work.",
          impact: [],
          stack: ["AI avatars", "AI automations"],
          links: [],
          resume: true
        },
        {
          name: "Ops & Data Systems",
          figure: "loop",
          year: "2024–26",
          type: "System",
          summary: "Internal dashboards, SOPs, templates and workflows, plus storage, communication and ops systems, with YouTube Studio and BI data feeding back into decisions.",
          why: "Execution stopped depending on individuals, the team could ship daily, and decisions came from data instead of guesses.",
          resumeLine: "Built dashboards, SOPs and data feedback loops that improved operational efficiency 3x.",
          impact: ["3x operational efficiency through systemisation"],
          stack: ["YouTube Studio", "BI tools"],
          links: [],
          resume: true
        }
      ]
    },
    {
      company: "Transformatie Doorbraak Pvt Ltd",
      role: "Operations Manager",
      start: "2024-05",
      end: "2024-10",
      location: "Delhi",
      url: "",
      summary: "Led operations, turning SOPs into a repeatable growth system instead of a checklist.",
      projects: [
        {
          name: "Internal ERP",
          figure: "modules",
          year: "2024",
          type: "Product",
          summary: "An internal ERP system to standardise how operations are run.",
          why: "One system for how operations run, so work is done the same way every time and is easy to track.",
          resumeLine: "Led development of an internal ERP system to standardise operations.",
          impact: [],
          stack: [],
          links: [],
          resume: true
        },
        {
          name: "Ops Dashboards & SOPs",
          figure: "steps",
          year: "2024",
          type: "Process",
          summary: "Internal dashboards, SOPs, templates and workflows for the operations team.",
          why: "Written processes and shared dashboards meant work didn't stall when one person was away.",
          resumeLine: "Built dashboards, SOPs and workflows that improved operational efficiency 2x.",
          impact: ["2x operational efficiency through systemisation"],
          stack: [],
          links: [],
          resume: true
        }
      ]
    },
    {
      company: "Uno Minda",
      role: "Senior Executive, Management Information System",
      start: "2022-06",
      end: "2024-05",
      location: "Bawal, Haryana",
      url: "",
      summary: "Built data, reporting and operational control systems for manufacturing and shop-floor teams.",
      projects: [
        {
          name: "MIS & Power BI Reporting",
          figure: "funnel",
          year: "2022–24",
          type: "Dashboard",
          summary: "MIS and reporting systems for quality, manpower, inventory and operations, with Power BI dashboards on SAP data for leadership and department-level tracking. I owned the data pipeline: segregation, validation and reporting.",
          why: "Turned raw operational data into decisions: data-backed quality control, manpower planning and inventory tracking.",
          resumeLine: "Designed MIS and Power BI reporting on SAP data for quality, manpower, inventory and operations.",
          impact: ["Data-backed quality control, manpower planning and inventory tracking"],
          stack: ["Power BI", "SAP"],
          links: [],
          resume: true
        },
        {
          name: "Department & DWM Boards",
          figure: "board",
          year: "2022–24",
          type: "Process",
          summary: "Department and DWM boards to standardise daily monitoring, plus new formats, templates and SOPs to replace manual, error-prone workflows.",
          why: "Daily monitoring became a standard habit, which raised execution discipline across departments.",
          resumeLine: "Implemented Department and DWM boards and SOPs that standardised daily monitoring.",
          impact: [],
          stack: [],
          links: [],
          resume: true
        },
        {
          name: "ESG & Sustainability Rollout",
          figure: "leaf",
          year: "2022–24",
          type: "Project",
          summary: "Contributed to organisation-wide ESG, EHS and sustainability rollouts.",
          why: "Turned sustainability, environment, health and safety strategy into everyday practice across the organisation.",
          resumeLine: "Contributed to organisation-wide ESG and sustainability rollouts.",
          impact: [],
          stack: [],
          links: [],
          resume: false
        }
      ]
    },
    {
      company: "Rockman Industries",
      role: "Management Information System Executive",
      start: "2021-03",
      end: "2022-06",
      location: "Bawal, Haryana",
      url: "",
      summary: "Built data, quality and shop-floor visibility systems that turned operational activity into measurable KPIs.",
      projects: [
        {
          name: "Rejection Analysis for QCC",
          figure: "pareto",
          year: "2021–22",
          type: "Data",
          summary: "MIS reports for quality and rejections, and the rejection data pipeline with Pareto analysis behind Quality Control Circle decisions.",
          why: "Made rejection trends and root causes visible, so quality teams worked from reliable data.",
          resumeLine: "Owned rejection data and Pareto analysis for Quality Control Circles.",
          impact: ["Recognised as Outstanding Contributor for QCC at company level"],
          stack: [],
          links: [],
          resume: true
        },
        {
          name: "Shop-floor KPI Boards",
          figure: "gauge",
          year: "2021",
          type: "Process",
          summary: "Department boards to track shop-floor KPIs and daily execution.",
          why: "Made each department's daily performance visible on the shop floor, so problems were spotted sooner.",
          resumeLine: "Designed department boards to track shop-floor KPIs.",
          impact: [],
          stack: [],
          links: [],
          resume: false
        }
      ]
    }
  ],

  achievements: [
    "Named MVP for direct contribution to revenue and 500M+ views",
    "Promoted to Head of Distribution within 6 months",
    "Awarded a retention bonus of ₹1 lakh",
    "Outstanding Contributor for QCC, company level (Rockman)",
    "Best Employee of the Month at Uno Minda and Rockman"
  ],

  skills: [
    { group: "Product", items: ["Software Product Management", "Product Operations", "Business Systems"] },
    { group: "Content & brand", items: ["Content Distribution", "Content Scaling", "Branding & Identity", "Creator Economy"] },
    { group: "Data", items: ["Data Analytics", "Power BI", "SAP", "YouTube Studio"] },
    { group: "AI", items: ["AI Automations", "AI Avatars", "LLM apps", "Knowledge graphs"] },
    { group: "Building", items: ["Python", "TypeScript", "React", "Next.js", "Supabase", "Cloudflare Workers"] },
    { group: "Languages", items: ["English", "Hindi (full professional)"] }
  ],

  education: [
    {
      school: "Indira Gandhi University, Rewari",
      degree: "Bachelor of Business Administration (not completed)",
      start: "",
      end: ""
    }
  ]
};
