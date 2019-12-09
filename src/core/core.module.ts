import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from './configure/config.module';
import { ConfigService } from './configure/config.service';
import { MailerModule } from './mailer/mailer.module';
import { SMTPTransportOptions } from './mailer/mailer.interface';
import { async } from 'rxjs/internal/scheduler/async';
// import { ConfigValidate } from './config.validate';
/**
 * 核心模块，只会注入到AppModule，不会注入到feature和shared模块里面，
 * 专门做初始化配置工作，不需要导出任何模块。
 */
@Module({
  imports: [
    ConfigModule.register({ folder: '../../config' }),

    // TODO: 使用了useClass
    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [
    //     // 宣告哪个provider或是service需要被注入
    //     ConfigService,
    //   ],
    //   // 指定用TypeOrmConfigService，作为载入TypeOrmOptions
    //   // Options就是数据库连接信息等
    //   useClass: TypeOrmConfigService,
    // }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('MYSQL_HOST'),
        port: Number(configService.get('MYSQL_PORT')),
        username: configService.get('MYSQL_USERNAME'),
        password: configService.get('MYSQL_PASSWORD'),
        database: configService.get('MYSQL_DATABASE'),
        entities: ['dist/src/**/**.entity{.ts,.js}'],
        synchronize: Boolean(configService.get('MYSQL_SYNCHRONIZE')),
      }),

      inject: [ConfigService],
    }),
    MailerModule.forRootAsync<SMTPTransportOptions>({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        host: configService.get('MAIL_HOST'), // 邮箱smtp地址
        port: +configService.get('MAIL_PORT'), // 端口号
        secure: true,
        secureConnection: true,
        auth: {
          user: configService.get('MAIL_USER'), // 邮箱账号
          pass: configService.get('MAIL_PASS'), // 授权码
        },
        ignoreTLS: true,
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [ConfigModule],
})
export class CoreModule {}