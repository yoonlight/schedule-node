import schedule from 'node-schedule'
import dotenv from 'dotenv'
import amqplib from 'amqplib/callback_api'

dotenv.config()
const env = process.env
const rabbitMQ_URL = env.RABBITMQ_URL
const job = schedule

amqplib.connect(rabbitMQ_URL, (error0, connection) => {
  if (error0) {
    throw error0
  }
  connection.createChannel((err, channel) => {
    if (err) {
      throw err
    }
    const queue = 'schedule'
    channel.assertQueue(queue, { durable: false })
    console.log(' [*] Waiting for messages in %s. To exit press CTRL+C', queue)
    channel.consume(
      queue,
      async (msg) => {
        const message = msg.content.toString()
        console.log(' [x] Received %s', message)
        const startTime = new Date(Date.now() + 5000)
        const endTime = new Date(startTime.getTime() + 5000)
        const rule = { start: startTime, end: endTime, rule: '*/1 * * * * *' }
        const task = () => {
          console.log('Time for tea!')
        }
        job.scheduleJob(rule, task)
      },
      { noAck: true }
    )
  })
})
