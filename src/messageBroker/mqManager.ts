import amqp, { Channel, Connection } from "amqplib";
import { mqConnectionCreated, mqConnectionFailed } from "../../src/logEvents";

class RabbitMQManager {
  private connection: Connection | null = null;
  private channel: Channel | null = null;

  async connect(): Promise<void> {
    try {
      this.connection = await amqp.connect("amqp://localhost");
      mqConnectionCreated();
      this.channel = await this.connection.createChannel();

      // Declare queues and exchanges here
      // Example:
      const queueName = "add-expense";
      await this.channel.assertQueue(queueName, { durable: false });
    } catch (error) {
      mqConnectionFailed(error);
    }
  }

  async getChannel(): Promise<Channel> {
    if (!this.channel) {
      await this.connect();
    }
    return this.channel as Channel;
  }
}

export default new RabbitMQManager();
