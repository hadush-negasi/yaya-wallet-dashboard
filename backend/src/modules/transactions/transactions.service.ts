import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { signRequest } from 'src/common/yaya-auth.util';
import { TimeOffsetService } from 'src/common/time-offset.service';

@Injectable()
export class TransactionsService {
    private readonly base : string;
    private readonly key : string;
    private readonly secret : string;
    private readonly current : string | undefined;


    constructor(
        private readonly http: HttpService,
        private readonly config: ConfigService,
        private readonly time: TimeOffsetService,
    ) {
        this.base = this.config.getOrThrow<string>('YAYA_API_BASE');
        this.key = this.config.getOrThrow<string>('YAYA_API_KEY');
        this.secret = this.config.getOrThrow<string>('YAYA_API_SECRET');
        this.current = this.config.get<string>('CURRENT_ACCOUNT_NAME');
    }

    // method to create yaya wallet header specification with a signed message
    private headers(method: string, endpoint: string, body?: unknown) {
        const ts = String(this.time.nowMs());
        const sign = signRequest({
            secret: this.secret,
            method,
            endpoint,
            body,
            timestamp: ts,
        });
        return {
            'Content-Type': 'application/json',
            'YAYA-API-KEY': this.key,
            'YAYA-API-TIMESTAMP': ts,
            'YAYA-API-SIGN': sign,
        };
    }

    async getByUser(page = 1) {
        const endpoint = '/api/en/transaction/find-by-user';
        const url = `${this.base}${endpoint}?p=${page}`;
        await this.time.ensureOffset(this.base);
        const res = await firstValueFrom(
            this.http.get(url, { headers: this.headers('GET', endpoint) })
        );
        return res.data;
    }


    async search(query: string, page = 1) {
        const endpoint = `/api/en/transaction/search`;
        const url = `${this.base}${endpoint}?p=${page}`;
        await this.time.ensureOffset(this.base);
        const body = { query };
        const res = await firstValueFrom(
            this.http.post(url, body, { headers: this.headers('POST', endpoint, body) })
        );
        return res.data;
    }


    // Optional helper if you pass CURRENT_ACCOUNT_NAME via .env
    getCurrentAccountName() {
        return this.current || null;
    }
}