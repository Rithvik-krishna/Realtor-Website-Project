import { Router } from 'express';
import { ResponseUtil } from '../../utils/response.util.js';

const router = Router();

router.get('/step-1', (req, res) => {
  return ResponseUtil.success(res, {
    badge: '⚡ MLS® & MARKET INTELLIGENCE',
    title: 'Live TRREB Data & Instant CMA Valuations',
    description: 'Welcome to your real estate command center. Get direct access to 100% active TRREB MLS listings, interactive market analytics, and instant comparative market analysis reports.',
    features: [
      { icon: '📡', title: 'Live TRREB Feed', desc: 'Direct connection to Ontario MLS listings updated every 10 minutes.' },
      { icon: '📊', title: 'Market Analytics', desc: 'Days-on-market metrics, neighborhood school scores, and price trends.' },
      { icon: '📄', title: 'Instant CMA Reports', desc: 'Generate professional property valuation dossiers for your buyers in seconds.' },
    ],
  }, 'Onboarding step 1 retrieved');
});

router.get('/step-2', (req, res) => {
  return ResponseUtil.success(res, {
    badge: '🤖 AI COPILOT & CLIENT CRM',
    title: 'Automate Leads, Showings & AI Search',
    description: 'Supercharge your realtor workflow. Use natural language AI to find target properties, automate showing requests, and manage client pipelines effortlessly.',
    features: [
      { icon: '💬', title: 'AI Assistant', desc: 'Ask natural language queries like "Find 4 bed homes in Oakville under $1.5M".' },
      { icon: '📅', title: 'Showing Scheduler', desc: 'Book and manage client property showings with instant notifications.' },
      { icon: '👥', title: 'VIP Client Pipeline', desc: 'Track buyer budgets, saved searches, and lead stages in one unified CRM.' },
    ],
  }, 'Onboarding step 2 retrieved');
});

export default router;
