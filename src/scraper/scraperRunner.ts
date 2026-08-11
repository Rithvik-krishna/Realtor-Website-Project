import axios, { AxiosError } from 'axios';
import { trrebService, TRREBPropertyMapped } from '../services/trrebService.js';
import * as os from 'os';

export interface ScraperOptions {
  location: string;
  targetRecords?: number;
  pageSize?: number;
  maxRuntimeSeconds?: number;
  concurrency?: number;
  minPrice?: number;
  maxPrice?: number;
}

export interface TelemetryReport {
  location: string;
  targetRecords: number;
  recordsFetched: number;
  uniqueRecords: number;
  duplicateCount: number;
  pagesRequested: number;
  requestsMade: number;
  successfulRequests: number;
  failedRequests: number;
  retries: number;
  status429: number;
  status5xx: number;
  timeouts: number;
  startTime: string;
  endTime: string;
  runtimeSeconds: number;
  formattedRuntime: string;
  cpuPeakPercent: number;
  memoryPeakMB: number;
  status: 'SUCCESS' | 'FAILED' | 'PARTIAL';
  errorDetails?: string;
  records: TRREBPropertyMapped[];
}

export class ScraperRunner {
  private getCpuUsage(): number {
    const cpus = os.cpus();
    if (!cpus || cpus.length === 0) return 0;
    let user = 0, sys = 0, idle = 0;
    for (const cpu of cpus) {
      user += cpu.times.user;
      sys += cpu.times.sys;
      idle += cpu.times.idle;
    }
    const total = user + sys + idle;
    return total > 0 ? Number((((user + sys) / total) * 100).toFixed(1)) : 0;
  }

  private getMemoryUsageMB(): number {
    const mem = process.memoryUsage();
    return Number((mem.heapUsed / 1024 / 1024).toFixed(1));
  }

  private formatRuntime(ms: number): string {
    const totalSec = Math.floor(ms / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}m ${s}s`;
  }

  async run(options: ScraperOptions): Promise<TelemetryReport> {
    const location = options.location || 'Mississauga';
    const targetRecords = options.targetRecords || 300;
    const pageSize = options.pageSize || 100; // OData max per TRREB rule
    const maxRuntimeMs = (options.maxRuntimeSeconds || 600) * 1000;
    const startTimeMs = Date.now();
    const startTimeStr = new Date(startTimeMs).toISOString();

    const uniqueMap = new Map<string, TRREBPropertyMapped>();
    let recordsFetched = 0;
    let pagesRequested = 0;
    let requestsMade = 0;
    let successfulRequests = 0;
    let failedRequests = 0;
    let retries = 0;
    let status429 = 0;
    let status5xx = 0;
    let timeouts = 0;
    let peakMemoryMB = this.getMemoryUsageMB();
    let peakCpuPercent = this.getCpuUsage();

    let skip = 0;
    let lastError: string | undefined = undefined;

    console.log(`\n🚀 [Scraper Runner] Starting job for "${location}" | Target: ${targetRecords} unique records | Page Size: ${pageSize}`);

    while (uniqueMap.size < targetRecords) {
      // Check global job timeout
      const elapsedTime = Date.now() - startTimeMs;
      if (elapsedTime > maxRuntimeMs) {
        lastError = `Global job timeout reached (${options.maxRuntimeSeconds || 600}s limit)`;
        console.warn(`⏳ [Scraper Runner] ${lastError}`);
        break;
      }

      pagesRequested++;
      let success = false;
      let attempt = 0;
      const maxAttempts = 5;

      while (!success && attempt < maxAttempts) {
        attempt++;
        requestsMade++;
        peakMemoryMB = Math.max(peakMemoryMB, this.getMemoryUsageMB());
        peakCpuPercent = Math.max(peakCpuPercent, this.getCpuUsage());

        try {
          console.log(`📡 [Scraper Engine] Fetching page ${pagesRequested} (skip=${skip}, top=${pageSize}, current unique=${uniqueMap.size}/${targetRecords})...`);

          const result = await trrebService.getProperties({
            city: location,
            top: pageSize,
            skip: skip,
            minPrice: options.minPrice,
            maxPrice: options.maxPrice,
            throwOnError: true
          });

          successfulRequests++;
          success = true;

          const items = result.properties || [];
          recordsFetched += items.length;

          let newAddedThisPage = 0;
          for (const item of items) {
            const key = item.listingKey || item.id || item.mlsNumber;
            if (key) {
              if (!uniqueMap.has(key)) {
                uniqueMap.set(key, item);
                newAddedThisPage++;
              }
            }
          }

          console.log(`✅ [Scraper Engine] Page ${pagesRequested} received ${items.length} items (${newAddedThisPage} new unique). Total unique: ${uniqueMap.size}/${targetRecords}`);

          // If current page returned fewer items than requested pageSize, we reached the end of target inventory
          if (items.length < pageSize) {
            console.log(`ℹ️ [Scraper Engine] Reached end of available feed for "${location}" at skip=${skip} (returned ${items.length}/${pageSize}).`);
            break; // Break loop if feed exhausted
          }

          skip += pageSize;

        } catch (err: any) {
          failedRequests++;
          const status = err.response?.status;
          const isTimeout = err.code === 'ECONNABORTED' || err.message?.includes('timeout');

          if (isTimeout) {
            timeouts++;
            console.warn(`⚠️ [Scraper Engine] Request timeout (Attempt ${attempt}/${maxAttempts})`);
          } else if (status === 429) {
            status429++;
            console.warn(`⚠️ [Scraper Engine] HTTP 429 Rate Limit Exceeded (Attempt ${attempt}/${maxAttempts})`);
          } else if (status && status >= 500) {
            status5xx++;
            console.warn(`⚠️ [Scraper Engine] HTTP ${status} Server Error (Attempt ${attempt}/${maxAttempts})`);
          } else if (status === 401 || status === 403 || status === 400 || status === 404) {
            // Permanent non-retryable 4xx error
            lastError = `Permanent HTTP ${status} error: ${err.response?.data?.message || err.message}`;
            console.error(`❌ [Scraper Engine] ${lastError}`);
            break; // Stop attempting
          }

          if (attempt < maxAttempts) {
            retries++;
            // Calculate exponential backoff with jitter
            let backoffMs = Math.min(30000, Math.pow(2, attempt) * 1000 + Math.floor(Math.random() * 500));

            // Respect Retry-After header if provided
            const retryAfterHeader = err.response?.headers?.['retry-after'];
            if (retryAfterHeader) {
              const parsedSec = parseInt(retryAfterHeader, 10);
              if (!isNaN(parsedSec)) {
                backoffMs = parsedSec * 1000;
              }
            }

            console.log(`🔄 [Scraper Engine] Retrying in ${Math.round(backoffMs / 1000)}s...`);
            await new Promise(r => setTimeout(r, backoffMs));
          } else {
            lastError = `Max retry attempts (${maxAttempts}) exhausted for page ${pagesRequested}`;
            console.error(`❌ [Scraper Engine] ${lastError}`);
          }
        }
      }

      // Break outer loop if permanent error occurred or retry limit reached
      if (!success && attempt >= maxAttempts) {
        break;
      }
    }

    const endTimeMs = Date.now();
    const endTimeStr = new Date(endTimeMs).toISOString();
    const totalRuntimeMs = endTimeMs - startTimeMs;
    const runtimeSeconds = Number((totalRuntimeMs / 1000).toFixed(1));
    const recordsList = Array.from(uniqueMap.values());
    const duplicateCount = recordsFetched - uniqueMap.size;

    const finalStatus = uniqueMap.size >= targetRecords ? 'SUCCESS' : (uniqueMap.size > 0 ? 'PARTIAL' : 'FAILED');

    const report: TelemetryReport = {
      location,
      targetRecords,
      recordsFetched,
      uniqueRecords: uniqueMap.size,
      duplicateCount: Math.max(0, duplicateCount),
      pagesRequested,
      requestsMade,
      successfulRequests,
      failedRequests,
      retries,
      status429,
      status5xx,
      timeouts,
      startTime: startTimeStr,
      endTime: endTimeStr,
      runtimeSeconds,
      formattedRuntime: this.formatRuntime(totalRuntimeMs),
      cpuPeakPercent: peakCpuPercent,
      memoryPeakMB: peakMemoryMB,
      status: finalStatus,
      errorDetails: lastError,
      records: recordsList
    };

    this.printStructuredSummary(report);

    return report;
  }

  public printStructuredSummary(report: TelemetryReport) {
    console.log(`\n================================================`);
    console.log(`SCRAPE RUN TELEMETRY REPORT`);
    console.log(`------------------------------------------------`);
    console.log(`Location:            ${report.location}`);
    console.log(`Target:              ${report.targetRecords}`);
    console.log(`Records collected:   ${report.recordsFetched}`);
    console.log(`Unique records:      ${report.uniqueRecords}`);
    console.log(`Duplicates:          ${report.duplicateCount}`);
    console.log(`Pages requested:     ${report.pagesRequested}`);
    console.log(``);
    console.log(`Start:               ${report.startTime}`);
    console.log(`End:                 ${report.endTime}`);
    console.log(`Runtime:             ${report.formattedRuntime} (${report.runtimeSeconds}s)`);
    console.log(``);
    console.log(`Requests:            ${report.requestsMade}`);
    console.log(`Successful:          ${report.successfulRequests}`);
    console.log(`Failed:              ${report.failedRequests}`);
    console.log(`Retries:             ${report.retries}`);
    console.log(`Timeouts:            ${report.timeouts}`);
    console.log(`Rate limits (429):   ${report.status429}`);
    console.log(`5xx Errors:          ${report.status5xx}`);
    console.log(``);
    console.log(`CPU peak:            ${report.cpuPeakPercent}%`);
    console.log(`Memory peak:         ${report.memoryPeakMB} MB`);
    console.log(``);
    console.log(`Status:              ${report.status}`);
    if (report.errorDetails) {
      console.log(`Error Details:       ${report.errorDetails}`);
    }
    console.log(`================================================\n`);
  }
}

export const scraperRunner = new ScraperRunner();
