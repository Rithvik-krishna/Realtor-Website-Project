import app from './app.js';
import { config } from './config/index.js';
import { Logger } from './utils/logger.js';
import { trrebService } from './services/trrebService.js';

const PORT = config.port;

app.listen(PORT, () => {
  Logger.info(`🚀 Canadian Realtor Backend Server running on port ${PORT} in ${config.env} mode`);
  Logger.info(`📡 API Base URL: http://localhost:${PORT}/api/v1`);

  // Streamlined pre-warm routine for core target locations (sequential to respect 512MB RAM ceiling on Render)
  const CITIES_TO_PREWARM = ['Mississauga', 'Brampton', 'Toronto', 'Oakville', 'Milton', 'Vaughan'];
  
  (async () => {
    for (const city of CITIES_TO_PREWARM) {
      try {
        const res = await trrebService.getProperties({ city, top: 60 });
        Logger.info(`⚡ [TRREB Service] Pre-warmed cache for "${city}": ${res.properties.length} listings (${res.count} total)`);
      } catch (err: any) {
        Logger.warn(`⚠️ [TRREB Service] Pre-warm warning for "${city}": ${err.message}`);
      }
      // 500ms delay between cities to allow V8 Garbage Collection to reclaim memory
      await new Promise(r => setTimeout(r, 500));
    }
  })();
});
