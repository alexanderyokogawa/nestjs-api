import * as AWS from 'aws-sdk';
import { IS_LOCAL } from './env';

AWS.config.setPromisesDependency(null);

const SQS = IS_LOCAL
  ? new AWS.SQS({
      region: process.env.AWS_REGION,
      endpoint: `http://${process.env.SQS_HOST || 'localhost'}:${
        process.env.SQS_PORT || 9324
      }`,
    })
  : new AWS.SQS();

/**
 * SQS Abstraction Library
 * @sendToQueue() - Save Item on SQS Queue;
 * @consumeQueue() - Consume Queue Messages;
 * @removeFromQueue() - Remove Message from Queue;
 */
const client = {
  sendToQueueBatch: (messages, queue, config = {}) => {
    const params = {
      Entries: messages,
      QueueUrl: queue,
      ...config,
    };
    return SQS.sendMessageBatch(params).promise();
  },
  /**
   * Send message to queue
   */
  sendToQueue: (message, queue, config = {}) => {
    const params = {
      MessageBody: JSON.stringify(message),
      QueueUrl: queue,
      ...config,
    };
    return SQS.sendMessage(params).promise();
  },

  /**
   * Get messages from Queue
   */
  consumeQueue: (numberOfMessages = 1, queue) => {
    const params = {
      QueueUrl: queue,
      MaxNumberOfMessages: numberOfMessages,
    };
    return SQS.receiveMessage(params).promise();
  },

  /**
   * Remove message from quue
   */
  removeFromQueue: (message, queue) => {
    const params = {
      QueueUrl: queue,
      ReceiptHandle: message.receiptHandle,
    };
    return SQS.deleteMessage(params).promise();
  },
};

export default client;
