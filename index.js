const { Assyst } = require('./lib/Assyst.js');
const config = require('./config.json');
const client = new Assyst(config);
// eslint-disable-next-line no-shadow
const db = require('quick.db');
const timeout = new db.Table('timeout');

console.log('Starting Assyst');

console.log('Loading commands');

client.loadCommands();

async function checkRepl(msg) {
    if (!msg.content.startsWith('`') || !msg.content.endsWith('`') ) {
        return;
    } if (msg.content.startsWith('```') ) {
        return;
    } if (!client.repl.map(i => i.user).includes(msg.author.id) || !client.repl.find(i => i.channel === msg.channel.id) ) {
        return;
    }
    const currentRepl = client.repl.find(j => j.user === msg.author.id && j.channel === msg.channel.id);
    const contentToSend = msg.content.substr(1, msg.content.length - 2);
    if (contentToSend === 'exit') {
        client.repl.splice(client.repl.indexOf(currentRepl, 1) );
        msg.channel.createMessage(`${client.emotes.success} The REPL session was ended.`);
        return;
    }
    const response = await client.utils.requestAPI(require('./config.json').chiasmIP, 'POST', { 'content-type': 'application/json' }, { code: contentToSend, lang: currentRepl.lang, imports: [] } );
    msg.channel.createMessage(`\`\`\`\n${response.text}\n\`\`\``);
}

function findCommand(command) {
    const foundCommand = client.commands[command] || client.cmdAliases[command];
    if (!foundCommand) {
        return null;
    }
    return foundCommand;
}

function checkPermissions(msg) {
    let authorPermLevel;
    if (client.staff.owners.includes(msg.author.id) ) {
        authorPermLevel = 2;
    } else if (client.staff.admins.includes(msg.author.id) ) {
        authorPermLevel = 1;
    } else {
        authorPermLevel = 0;
    }
    return authorPermLevel;
}

client.bot.on('messageCreate', (msg) => {
    checkRepl(msg);
    if (!msg.content.startsWith(client.prefix) || msg.author.bot) {
        return;
    }
    const args = msg.content.slice(config.client.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const foundCommand = findCommand(command);
    if (!foundCommand) {
        return;
    }
    const authorPermLevel = checkPermissions(msg);
    if (foundCommand.permissions > authorPermLevel) {
        return;
    }
    if (!timeout.get(msg.author.id) || (foundCommand.timeout + timeout.get(msg.author.id) ) < Date.now() ) {
        db.set(msg.author.id, Date.now() );
    } else {
        foundCommand.sendMsg(msg.channel, `<@${msg.author.id}> You're using commands too quickly.`, 'error');
        return;
    }
    foundCommand.execute( { msg, args } );
} );

client.bot.on('ready', () => {
    console.log('Ready');
} );

client.bot.connect();
