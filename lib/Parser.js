class Parser {
    constructor({args: args, msg: msg}) {
        this.result = this.parse(args, msg)
    }

    parse(args, msg) {
        args = args.split(/ +/g);
        const newArgs = [];
        args.forEach(arg => {
            if (arg.startsWith('{') ) {
                if (!arg.endsWith('}') ) {
                    newArgs.push(arg);
                }
                if (arg.includes(':') ) {
                    const content = arg.slice(1, arg.length - 1);
                    const func = content.match(/.+?(?=:)/);
                    const param = content.match(/(?<=:).*$/)
                    const result = this.parseArgumentedContent(func[0], param[0])
                    if (result) {
                        newArgs.push(result);
                    } else {
                        newArgs.push(arg);
                    }
                } else {
                    const content = arg.slice(1, arg.length - 1);
                    const result = this.parseIndividualContent(content);
                    if (result) {
                        newArgs.push(result);
                    } else {
                        newArgs.push(arg);
                    }
                }
            } else {
                newArgs.push(arg)
            }
        } );
        return newArgs.join(' ');
    }

    parseArgumentedContent(func, paramater) {
        switch(func) {
            case 'sin':
                return Math.sin(paramater)
            case 'cos':
                return Math.cos(paramater)
            case 'tan':
                return Math.tan(paramater)
            default:
                return null
        }
    }

    parseIndividualContent(content) {
        switch (content) {
            case 'pi':
                return Math.PI;
            case 'e':
                return Math.E;
            default:
                return null;
        }
    }
}

module.exports = Parser;