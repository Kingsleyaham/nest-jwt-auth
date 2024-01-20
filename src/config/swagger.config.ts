import { DocumentBuilder, SwaggerDocumentOptions } from '@nestjs/swagger';

const API_URI_DEV = process.env.API_URI_DEV!;
const API_URI_REMOTE = process.env.API_URI_REMOTE!;

const swaggerConfig = new DocumentBuilder()
  .setTitle('Api Documentation')
  .setDescription(
    'The API gives you access to pretty much all the endpoints available on our api. It strives to be RESTful and is organized around the main resources you would be interacting with. You can also test the api endpoints within this documenation.',
  )
  .setVersion('1.0')
  .setContact(
    'Aham Kingsley',
    'https://github.com/Kingsleyaham',
    'kingsleyaham6@gmail.com',
  )
  .addTag('Users')
  .addTag('Auth')
  .addBearerAuth()
  .addServer(API_URI_DEV)
  .addServer(API_URI_REMOTE)
  .build();

export const swaggerOptions: SwaggerDocumentOptions = {
  operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
};

export default swaggerConfig;
