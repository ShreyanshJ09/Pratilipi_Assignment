// utils/messageQueue.js
const amqp = require('amqplib');

class MessageQueue {
  constructor() {
    this.connection = null;
    this.channel = null;
  }

  async connect() {
    try {
      // Connect to RabbitMQ server (adjust URL as needed for your environment)
      this.connection = await amqp.connect('amqp://localhost');
      this.channel = await this.connection.createChannel();
      console.log('Connected to RabbitMQ');
    } catch (error) {
      console.error('Error connecting to RabbitMQ:', error);
      throw error;
    }
  }

  async publish(queue, message) {
    try {
      if (!this.channel) {
        await this.connect();
      }
      
      // Ensure queue exists
      await this.channel.assertQueue(queue, { durable: true });
      
      // Send message to queue
      this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
        persistent: true
      });
      
      console.log(`Message published to queue: ${queue}`);
    } catch (error) {
      console.error('Error publishing message:', error);
      throw error;
    }
  }

  async subscribe(queue, callback) {
    try {
      if (!this.channel) {
        await this.connect();
      }
      
      // Ensure queue exists
      await this.channel.assertQueue(queue, { durable: true });
      
      // Consume messages from queue
      this.channel.consume(queue, (message) => {
        if (message) {
          const content = JSON.parse(message.content.toString());
          callback(content);
          this.channel.ack(message);
        }
      });
      
      console.log(`Subscribed to queue: ${queue}`);
    } catch (error) {
      console.error('Error subscribing to queue:', error);
      throw error;
    }
  }
  
  async close() {
    try {
      if (this.channel) {
        await this.channel.close();
      }
      if (this.connection) {
        await this.connection.close();
      }
      console.log('Disconnected from RabbitMQ');
    } catch (error) {
      console.error('Error closing connection:', error);
    }
  }
}

module.exports = new MessageQueue();