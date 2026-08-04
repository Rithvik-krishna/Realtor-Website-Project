import app from './app.js';
import { config } from './config/index.js';
import { Logger } from './utils/logger.js';
import { trrebService } from './services/trrebService.js';

const PORT = config.port;

app.listen(PORT, () => {
  Logger.info(`🚀 Canadian Realtor Backend Server running on port ${PORT} in ${config.env} mode`);
  Logger.info(`📡 API Base URL: http://localhost:${PORT}/api/v1`);

  // Pre-warm live TRREB properties cache in background for 0ms load times
  trrebService.getProperties({ top: 60 }).then(res => {
    Logger.info(`⚡ [TRREB Service] Pre-warmed cache with ${res.properties.length} live MLS listings`);
  }).catch(err => {
    Logger.warn(`⚠️ [TRREB Service] Cache pre-warm warning: ${err.message}`);
  });
});
