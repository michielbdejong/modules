/**
 * File: Twitter
 */
RemoteStorage.defineModule('twitter', function(privClient, pubClient) {
  if(!CredentialsStore) {
    throw new Error('please include utils/credentialsstore.js');
  }
  /**
   * Schema: twitter/config
   *
   * Credentials configuration for Twitter
   *
   * actor - object:
   *   name - not used (must be a string)
   *   address - not used (must be a string)
   * object - object:
   *   objectType - always 'credentials'
   *   access_token - your access token for the Twitter API (string)
   *   access_token_secret - your access token secret for the Twitter API (string)
   *   consumer_secret - your consumer secret for the Twitter API (string)
   *   consumer_key - your consumer key for the Twitter API (string)
   */
  privClient.declareType('config', {
    type: 'object',
    properties: {
      actor: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          address: { type: 'string' },
        },
        required: ['name', 'address']
      },
      object: {
        type: 'object',
        properties: {
          objectType: {type: 'string', 'enum': ['credentials'] },
          access_token :        { type: 'string' },
          access_token_secret : { type: 'string' },
          consumer_secret :     { type: 'string' },
          consumer_key :        { type: 'string' }
        },
        required: ['objectType', 'access_token', 'access_token_secret', 'consumer_secret', 'consumer_key']
      }
    },
    required: ['actor', 'object']
  });
  return {
    exports: new CredentialsStore('twitter', privClient)
  };
});
