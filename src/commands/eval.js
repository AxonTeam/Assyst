const { Command } = require('../../lib/Command.js');
// eslint-disable-next-line consistent-return
const command = new Command( ['eval', 'e'], 2, 1000, async function ( { msg, args } ) {
    let evaled;
    const flags = this.utils.resolveFlags(args, [] );
    if (flags.map(i => i.flagName).includes('files.gg') ) {
        args = this.utils.removeFlags(args);
    }
    try {
        evaled = await eval(args.join(' ') ); // eslint-disable-line no-eval
    } catch (err) {
        return this.sendMsg(msg.channel, err, 'error');
    }

    if (typeof evaled === 'object') {
        evaled = require('util').inspect(evaled, { depth: 0, showHidden: true } );
    } else {
        evaled = String(evaled);
    }

    evaled = evaled.split(this.bot.token).join(' ');

    const fullLen = evaled.length;

    if (fullLen === 0) { // eslint-disable-line no-magic-numbers
        return null;
    }

    if (flags.map(i => i.flagName).includes('files.gg') ) {
        const file = await this.utils.uploadToFilesGG(evaled, 'evaloutput.js');
        this.sendMsg(msg.channel, file);
    } else {
        if (fullLen > 2000) { // eslint-disable-line no-magic-numbers
            const file = await this.utils.uploadToFilesGG(evaled, 'evaloutput.js');
            this.sendMsg(msg.channel, file);
        }
        return this.sendMsg(msg.channel, `\`\`\`js\n${evaled}\`\`\``);
    }
} );
module.exports = {
    command,
    info: {
        description: 'Evaluate code',
        author: 'Jacherr',
        usage: 'e [code]',
        examples: ['e 1+1', 'e this.bot'],
    },
};

