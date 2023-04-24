import Fastify from 'fastify';
import cors from '@fastify/cors';
import { promisify } from 'node:util';

import { vans, users } from './data.js';

const delay = promisify(setTimeout);

const fastify = Fastify({
  logger: true,
});

fastify.register(cors);

const PORT = 8000;

async function vansRoute(fastify, _) {
  fastify.get('/api/vans', async function (_, reply) {
    await delay(1000);

    reply.send({ vans });
  });

  fastify.get('/api/vans/:id', (request, reply) => {
    const { id } = request.params;

    const van = vans.filter(v => v.id === id);

    reply.send({ vans: van });
  });

  fastify.get('/api/host/vans', async (request, reply) => {
    await delay(500);
    const { hostId = '123' } = request.params;

    const hostVans = vans.filter(v => v.hostId === hostId);

    reply.send({ vans: hostVans });
  });

  fastify.get('/api/host/vans/:id', (request, reply) => {
    const { id, hostId = '123' } = request.params;

    const van = vans.filter(v => v.hostId === hostId && v.id === id);

    reply.send({ vans: van });
  });
}

async function usersRoute(fastify, _) {
  fastify.post('/login', (request, reply) => {
    const { email, password } = JSON.parse(request.body);

    const foundUser = users.find(user => {
      return user.email === email && user.password === password;
    });

    if (!foundUser) {
      return reply
        .code(401)
        .send({ message: 'No user with those credentials found!' });
    }

    reply.send({
      user: { ...foundUser, password: undefined },
      token: "Enjoy your pizza, here's your tokens.",
    });
  });
}

fastify.register(vansRoute);
fastify.register(usersRoute);

fastify.listen({ port: PORT }, function (err, address) {
  fastify.log.info(address);

  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }

  fastify.log.info(`Server now runnging on ${PORT}`);
});
