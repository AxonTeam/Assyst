const superagent = require('superagent');
class Command {
    constructor(names, permissions, timeout, execute) {
        this.names = names;
        this.permissions = permissions;
        this.timeout = timeout;
        this.execute = execute.bind(this);
    }

    /*
    info = {
        description
        author
        usage
        examples
    }
    */

    init(info, client) {
        this.info = info;
        this.assyst = client;
    }


    get bot() {
        return this.assyst.bot;
    }

    get utils() {
        return this.assyst.utils;
    }

    getCommand(name) {
        return this.commands[name];
    }

    async sendMsg(channel, message, type) {
        let msgToSend;
        switch (type) {
            case 'info':
                msgToSend = `${this.assyst.emotes.info} ${message}`;
                break;
            case 'error':
                msgToSend = `${this.assyst.emotes.error} ${message}`;
                break;
            case 'success':
                msgToSend = `${this.assyst.emotes.success} ${message}`;
                break;
            case 'loading':
                msgToSend = `${this.assyst.emotes.loading} ${message}`;
                break;
            default:
                msgToSend = message;
                break;
        }
        switch (typeof channel) {
            case 'object':
                if (channel.id) {
                    return this.bot.createMessage(channel.id, msgToSend);
                }
                throw new Error('Invalid channel object');
                
            case 'string':
                return this.bot.createMessage(channel, msgToSend);
            default:
                throw new Error('The channel paramater must either be a channel object or channel ID');
        }
    }

    async request(url, type, set, args) {
        if (type.toUpperCase() === 'GET') {
            const response = await superagent.get(url);
            return response;
        } if (type === 'POST') {
            const response = await superagent
                .post(url)
                .set(set)
                .send(args);
            return response;
        }
        throw new Error('You must either GET or POST with superagent');
    }
}

module.exports = {
    Command,
};
