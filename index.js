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
bot.start((ctx) => ctx.tg.sendMessage(-1001806294191, 'ку'));
bot.help((ctx) => ctx.reply('Send me a sticker'));
bot.launch({dropPendingUpdates: true});

bot.use(session()); 

bot.use((ctx,next)=>{
    if (typeof ctx.session === 'undefined'){
        ctx.session = {}
        
    }
    next()
})

bot.on('channel_post', async ctx => {
    try {
        let globarr = await collection.findOne({_id: ObjectId('63937136cf7a36ec32294ec1')})
        await cleverbot(ctx.channelPost.text, globarr.conversation).then(async response => {
            await ctx.reply(response)
            await collection.findOneAndUpdate({_id: ObjectId('6395e8207821c8a75f768028')}, {$set: {sended: ctx.channelPost.text}})
            await collection.findOneAndUpdate({_id: ObjectId('63937136cf7a36ec32294ec1')}, {$push: {conversation: ctx.channelPost.text}})
            await collection.findOneAndUpdate({_id: ObjectId('63937136cf7a36ec32294ec1')}, {$push: {conversation: response}})
        });
    } catch (e) {
        console.error(e);
    }
})


bot.on("text", async ctx => {
    try {
        let globarr = await collection.findOne({_id: ObjectId('63937136cf7a36ec32294ec1')})
        await cleverbot(ctx.message.text, globarr.conversation).then(async response => {
            await ctx.reply(response)
            await collection.findOneAndUpdate({_id: ObjectId('6395e8207821c8a75f768028')}, {$set: {sended: ctx.message.text}})
            await collection.findOneAndUpdate({_id: ObjectId('63937136cf7a36ec32294ec1')}, {$push: {conversation: ctx.message.text}})
            await collection.findOneAndUpdate({_id: ObjectId('63937136cf7a36ec32294ec1')}, {$push: {conversation: response}})
        });
    } catch (e) {
        console.error(e);
    }
})
  
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));