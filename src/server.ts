import app from './app.js';
import { config } from './config/index.js';
import { Logger } from './utils/logger.js';
import { trrebService } from './services/trrebService.js';

const PORT = config.port;

app.listen(PORT, () => {
  Logger.info(`🚀 Canadian Realtor Backend Server running on port ${PORT} in ${config.env} mode`);
  Logger.info(`📡 API Base URL: http://localhost:${PORT}/api/v1`);

  // Pre-warm live TRREB properties cache in background (throttled in batches of 4 to avoid remote rate limits)
  const CITIES_TO_PREWARM = [
    'All', 'Toronto', 'Mississauga', 'Brampton', 'Oakville', 'Milton', 'Vaughan', 'Markham', 
    'Richmond Hill', 'Scarborough', 'Etobicoke', 'Hamilton', 'Ajax', 'Pickering', 'Whitby', 
    'Burlington', 'Newmarket', 'Aurora', 'King', 'Caledon', 'Halton Hills', 'Oshawa', 
    'Clarington', 'Whitchurch-Stouffville', 'Georgina', 'Brock', 'Scugog', 'Uxbridge', 
    'Niagara', 'Barrie', 'Guelph', 'Kitchener', 'Waterloo', 'Yorkville', 'Forest Hill', 
    'The Bridle Path', 'Rosedale', 'Lawrence Park', 'Waterfront Toronto', 'High Park', 'The Annex'
  ];
  
  (async () => {
    const BATCH_SIZE = 4;
    for (let i = 0; i < CITIES_TO_PREWARM.length; i += BATCH_SIZE) {
      const batch = CITIES_TO_PREWARM.slice(i, i + BATCH_SIZE);
      await Promise.all(
        batch.map(async city => {
          try {
            const res = await trrebService.getProperties({ city: city === 'All' ? undefined : city, top: 100 });
            Logger.info(`⚡ [TRREB Service] Pre-warmed cache for "${city}": ${res.properties.length} listings (${res.count} total)`);
          } catch (err: any) {
            Logger.warn(`⚠️ [TRREB Service] Pre-warm warning for "${city}": ${err.message}`);
          }
        })
      );
      await new Promise(r => setTimeout(r, 200));
    }
  })();
});
