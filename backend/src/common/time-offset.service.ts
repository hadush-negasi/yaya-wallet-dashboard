import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TimeOffsetService {
  private readonly logger = new Logger(TimeOffsetService.name);
  private offsetMs = 0; // will store offset to add to Date.now()

  constructor(private readonly http: HttpService) {}

  // Ensure we have fetched the offset from server
  async ensureOffset(baseUrl: string) {
    if (this.offsetMs !== 0) return; // already set

    try {
      const res = await firstValueFrom(this.http.get(`${baseUrl}/api/en/time`));
      
      // Extract server time from object response
      const serverMs = Number(res.data?.time);
      if (!Number.isFinite(serverMs)) {
        this.logger.warn('Server time is invalid, cannot compute offset');
        return;
      }

      const localMs = Date.now();
      this.offsetMs = serverMs - localMs;

      this.logger.log(`Time offset set to ${this.offsetMs} ms`);
    } catch (error) {
      this.logger.warn('Could not fetch server time, proceeding without offset');
    }
  }

  // Return adjusted current time in ms
  nowMs(): number {
    return Date.now() + this.offsetMs;
  }
}
