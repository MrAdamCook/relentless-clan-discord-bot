import { APIGatewayProxyHandler } from 'aws-lambda';
import { InteractionResponse } from './structures/InteractionResponse';
import { InteractionResponseType } from './structures/InteractionResponseType';
import { verifyKey } from './util/verifyKey';

// TODO: Use KMS Decrypt or SecretsManager
const publicKey = process.env.DISCORD_PUBLIC_KEY;

export const handler: APIGatewayProxyHandler = async (event) => {
  console.log(event);

  const rawBody = event.body;
  const signature = event.headers['x-signature-ed25519'] ?? null;
  const timestamp = event.headers['x-signature-timestamp'] ?? null;

  if (
    !rawBody
    || !signature
    || !timestamp
    || !publicKey
    || !verifyKey(rawBody, signature, timestamp, publicKey)
  ) {
    return {
      statusCode: 401,
      headers: { 'Content-Type': 'application/json' },
      body: 'invalid request signature',
    };
  }

  // TODO: Flesh out more responses
  const response: InteractionResponse = {
    type: InteractionResponseType.PONG,
  };

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(response),
  };
};
