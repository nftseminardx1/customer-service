import { Module, OnModuleInit, OnModuleDestroy, Inject } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
const Consul = require('consul');

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'CONSUL',
      useFactory: (configService: ConfigService) => {
        const consulHost = configService.get<string>(
          'CONSUL_HOST',
          '84pl7j-8500.csb.app',
        );
        const consulPort = configService.get<number>('CONSUL_PORT', 8500);
        const consulSecure = true; // HTTPSを使用する場合はtrue
        const consulHostWithoutProtocol = consulHost.replace(
          /^https?:\/\//,
          '',
        );

        console.log(
          `Connecting to Consul at ${consulHostWithoutProtocol}:${consulPort}, secure: ${consulSecure}`,
        );

        return new Consul({
          host: consulHostWithoutProtocol,
          port: consulPort,
          secure: consulSecure,
          defaults: {
            timeout: 20000, // 接続タイムアウトを20秒に設定
          },
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: ['CONSUL'],
})
export class ConsulModule implements OnModuleInit, OnModuleDestroy {
  constructor(@Inject('CONSUL') private readonly consul) {}

  async onModuleInit() {
    const serviceId = 'my-service-id';
    const check = {
      id: serviceId,
      name: 'my-service-name',
      address: 'm7k2kj-3000.csb.app',
      port: 3000,
      check: {
        http: 'https://m7k2kj-3000.csb.app/health',
        interval: '10s',
        timeout: '5s',
      },
    };

    try {
      await this.consul.agent.service.register(check);
      console.log(`Service ${serviceId} registered with Consul`);
    } catch (err) {
      console.error('Error registering service with Consul:', err);
    }
  }

  async onModuleDestroy() {
    const serviceId = 'my-service-id';
    try {
      await this.consul.agent.service.deregister(serviceId);
      console.log(`Service ${serviceId} deregistered from Consul`);
    } catch (err) {
      console.error('Error deregistering service from Consul:', err);
    }
  }
}
