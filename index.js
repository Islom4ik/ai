const { Telegraf, Markup, session } = require('telegraf');
require('dotenv').config()
const cleverbot = require("cleverbot-free");
const bot = new Telegraf(process.env.BOT_TOKEN);
const { MongoClient, ObjectId } = require('mongodb');
const url = 'mongodb+srv://Muhammad007:Muhammad007@database.3dodl7a.mongodb.net';
const client = new MongoClient(url);
client.connect();
const db = client.db('bot');
const collection = db.collection('ai');
bot.start((ctx) => ctx.reply('Welcome'));
bot.help((ctx) => ctx.reply('Send me a sticker'));
bot.launch({dropPendingUpdates: true});

bot.use(session()); 

bot.use((ctx,next)=>{
    if (typeof ctx.session === 'undefined'){
        ctx.session = {}
        
    }
    next()
})


bot.on('text', async ctx => {
    try {
        let arr = await collection.findOne({_id: ObjectId('63937136cf7a36ec32294ec1')})
        let conversation = arr.conversation;
        await cleverbot(ctx.message.text, conversation).then(async response => {
            await conversation.push(ctx.message.text)
            await ctx.reply(response, {reply_to_message_id: ctx.message.message_id})
            await collection.findOneAndUpdate({_id: ObjectId('63937136cf7a36ec32294ec1')}, {$push: {conversation: ctx.message.text}})
            await collection.findOneAndUpdate({_id: ObjectId('63937136cf7a36ec32294ec1')}, {$push: {conversation: response}})
        });
    } catch (e) {
        console.error(e);
    }
})
 



  
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));