import { initBotId } from 'botid/client/core';

// BotID: el cliente adjunta la prueba invisible a estas rutas; el servidor la verifica
// con checkBotId() antes de cada inferencia (src/lib/seguridad/http.ts).
initBotId({
  protect: [
    { path: '/api/chat', method: 'POST' },
    { path: '/api/diagnostico', method: 'POST' },
  ],
});
