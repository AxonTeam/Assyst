const { Command } = require('../../lib/Command.js');
// eslint-disable-next-line no-magic-numbers
const command = new Command( ['repl'], 0, 15000, async function ( { msg, args } ) {
    const aliases = await this.utils.getChiasmAliases(this);
    if (!aliases.includes(args[0] ) ) {
        return this.sendMsg(msg.channel, 'That language isn\'t valid.', 'error');
    } if (this.assyst.repl.map(i => i.channel).includes(msg.channel.id) && this.assyst.repl.map(i => i.user).includes(msg.author.id) ) {
        return this.sendMsg(msg.channel, 'You already have an active REPL session in this channel.', 'error');
    }
    this.assyst.repl.push( { user: msg.author.id, channel: msg.channel.id, lang: args[0] } );
    const res = await this.request('http://152.89.106.191:4840/languages', 'GET');
    const langName = Object.values(res.body).find(i => i.aliases.includes(args[0] ) ).language;
    return this.sendMsg(msg.channel, `REPL session activated for language ${langName}.`, 'success');
} );

module.exports = {
    command,
    info: {
        description: 'Start a REPL session in the current channel. Evaluate code by sending messages in backticks. Use `exit` (in backticks) to exit.',
        author: 'Jacherr',
        usage: 'repl [lang]',
        examples: ['repl node'],
    },
};
