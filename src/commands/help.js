const { Command } = require('../../lib/Command.js');
const command = new Command( ['help'], 0, 1000, function ( { msg, args } ) {
    if (args.length < 1) {
        const commands = [];
        const fields = [];
        Object.values(this.assyst.commands).forEach(c => {
            if (commands.map(i => i.names).includes(c.names) ) {
                return;
            }
            commands.push(c);
            if (c.permissions !== 0) {
                return;
            }
            const commandNamesFormat = c.names.map(i => `${this.assyst.prefix}${i}`).join(', ');
            fields.push( { name: commandNamesFormat, value: `${c.info.description}`, inline: false } );
        } );
        this.sendMsg(msg.channel, { embed: { title: 'Command Help', color: 0xFFFFFF, fields } } );
    }
} );
module.exports = {
    command,
    info: {
        description: 'Display command help',
        author: 'Jacherr',
        usage: 'help <command>',
        examples: ['help', 'help ping'],
    },
};
