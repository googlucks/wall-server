import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as Joi from '@hapi/joi';
import { isAbsolute, resolve, dirname } from 'path';
// 缺少环境变量的名称和类型（无智能感知）
// 缺少提供对 .env 文件的验证
// env文件将布尔值/作为string ('true'),提供，因此每次都必须将它们转换为 boolean
import { EnvConfig, ConfigOptions } from './config.interface';

export class ConfigService<T = EnvConfig> {
  private readonly envConfig: T;
  // 文件路径
  private rootPath: string;
  constructor(filePath: string) {
    let config: ConfigOptions;
    if (this.isFileExist(filePath)) {
      config = dotenv.parse(fs.readFileSync(filePath));
    }
    this.envConfig = this.validateInpt(config);
  }

  /**
   *  检测文件是否存在
   * @param startPath
   */
  private isFileExist(filePath: string): boolean {
    if (!fs.existsSync(filePath)) {
      throw Error('文件不存在');
    }
    return true;
  }
  private resolveRootPath(startPath: string) {
    if (!isAbsolute(startPath)) {
      throw Error('filePath must be an absolute path');
    }
    // if(){}
    if (!this.rootPath) {
      const root = this.root();
      let workingDir = startPath;
      let parent = dirname(startPath);
      while (workingDir !== root && parent !== root && parent !== workingDir) {
        workingDir = parent;
        parent = dirname(workingDir);
      }
      this.rootPath = workingDir;
    }
  }
  /**
   *校验env 文件
   * @private
   * @memberof ConfigService
   */
  private validateInpt(envConfig: ConfigOptions): T {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      NODE_ENV: Joi.string()
        .valid('development', 'production', 'test', 'provision')
        .default('development'),
      PORT: Joi.number().default(3000),
      DATABASE_USER: Joi.string().required(),
      DATABASE_PASSWORD: Joi.string().required(),
      // API_AUTH_ENABLED: Joi.boolean().required(),
    });
    const { error, value: validatedEnvConfig } = envVarsSchema.validate(
      envConfig,
    );
    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }
    return validatedEnvConfig;
  }
  /**
   * 获取根路径
   * @param dir
   */
  private root(dir: string = ''): string {
    const rootPath = this.rootPath || resolve(process.cwd());
    return resolve(rootPath, dir);
  }
  /**
   * 获取配置
   * @param key
   * @param defaultVal
   */
  get(key: string, defaultVal?: any): string {
    return process.env[key] || this.envConfig[key] || defaultVal;
  }
  /**
   * 获取系统配置
   * @param keys
   */
  getKeys(keys: string[]): any {
    return keys.reduce((obj, key: string) => {
      obj[key] = this.get[key];
      return obj;
    }, {});
  }
  /**
   * 获取数字
   * @param key
   */
  getNumber(key: string): number {
    return Number(this.get(key));
  }
  /**
   * 获取布尔
   * @param key
   */
  getBoolean(key: string): boolean {
    return Boolean(this.get(key));
  }
  /**
   * 获取字典对象和数组
   * @param key
   */
  getJson(key: string): { [prop: string]: any } {
    try {
      return JSON.parse(this.get(key));
    } catch (error) {
      return null;
    }
  }
  /**
   * 检查一个key是否存在
   * @param key
   */
  has(key: string): boolean {
    return this.get(key) !== undefined;
  }

  /** 开发模式 */
  get isDevelopment(): boolean {
    return this.get('NODE_ENV') === 'development';
  }
  /** 生产模式 */
  get isProduction(): boolean {
    return this.get('NODE_ENV') === 'production';
  }
  /** 测试模式 */
  get isTest(): boolean {
    return this.get('NODE_ENV') === 'test';
  }
}
