import { FastifyInstance } from 'fastify';
import WebPush from 'web-push';
import { z } from 'zod';

const publicKey =
  'BDDlnU8Bghl6KANFkHQq877Oi2o57PtxpPKGojYVF9RNU2RXABhiUWCSqn6Jt0bnx6oGHGeh7Oy-REtCihDyG0E';

const privateKey = '4zy0IfK8vIrYZKbWyAai_kTBHpNQUt-1eT0SHzOAe_s';

WebPush.setVapidDetails('http://localhost:3333', publicKey, privateKey);

export async function notificationRoutes(app: FastifyInstance) {
  app.get('/push/public_key', () => {
    return { publicKey };
  });

  app.post('/push/register', (request, response) => {
    console.log(request.body);

    return response.status(201).send();
  });

  app.post('/push/send', async (request, response) => {
    const sendPushBody = z.object({
      subscription: z.object({
        endpoint: z.string(),
        keys: z.object({
          p256dh: z.string(),
          auth: z.string(),
        }),
      }),
    });

    const { subscription } = sendPushBody.parse(request.body);

    WebPush.sendNotification(subscription, 'Hello do backend');

    return response.status(200).send();
  });
}
