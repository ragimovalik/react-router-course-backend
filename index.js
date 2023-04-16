import Fastify from 'fastify';
import cors from '@fastify/cors';

import { vans, users } from './data.js';

const fastify = Fastify({
  logger: true,
});

fastify.register(cors);

const PORT = 8000;

fastify.get('/api/vans', function (request, reply) {
  reply.send({ vans });
});

async function vansRoute(fastify, options) {
  fastify.get('/api/vans/:id', (request, reply) => {
    const { id } = request.params;

    const van = vans.filter(v => v.id === id);

    return reply.send({ vans: van });
  });

  fastify.get('/api/host/vans', (request, reply) => {
    const { hostId = '123' } = request.params;

    const hostVans = vans.filter(v => v.hostId === hostId);

    return reply.send({ vans: hostVans });
  });

  fastify.get('/api/host/vans/:id', (request, reply) => {
    const { id, hostId = '123' } = request.params;

    const van = vans.filter(v => v.hostId === hostId && v.id === id);

    return reply.send({ vans: van });
  });
}

async function usersRoute(fastify, options) {
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
