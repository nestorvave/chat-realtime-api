import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';

const PORT = parseInt(process.env.PORT, 10) || 4000;

async function main() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: '*' });
  app.useGlobalPipes(new ValidationPipe({}));
  app.enableVersioning({ type: VersioningType.URI });
  app.setGlobalPrefix('api/v1');
 await app.listen(PORT, () => {
   console.log(`🚀 Application running at port ${PORT}`);
 });
}
main();
