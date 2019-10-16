const { Command } = require('../../lib/Command.js');
const command = new Command( [
    'ping',
    'pong',
    'pang',
], 0, 1000, async function ( { msg } ) {
    const start = Date.now();
    const message = await this.sendMsg(msg.channel, 'Pong!');
    if (!message) {
        return null;
    }
    return this.bot.editMessage(msg.channel.id, message.id, `Pong! \`${Date.now() - start}ms\``);
} );

module.exports = {
    command,
    info: {
        description: 'Ping the bot',
        author: 'Jacherr',
        usage: 'ping',
        examples: ['ping'],
    },
};
