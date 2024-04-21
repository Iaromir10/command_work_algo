import {chats, tokens, users} from '../db/controller.js'
import {authenticate} from './utils.js'


export const createChat = async (req, res) => {

    const { name } = req.body;
    if (!name) {
        return res.json({ error: 'Invalid parameters' }).status(400);
    }
    const user_id = await authenticate(req, res);
    if (!user_id) {
        return res.json({ error: 'Not logged in or invalid token' }).status(401);
    }

    try {
        const chat_id = await chats.createChat(name, user_id);

        res.json({ response: chat_id }).status(201);
    } 
    catch (error) {
        console.error(error);
        res.json({ error: 'Internal server error' }).status(500);
    }
}    

export const getChats = async (req, res) => {
    const user_id = await authenticate(req, res);
    if (!user_id) {
        return res.json({ error: 'Not logged in or invalid token' }).status(401);
    }

    try {
        const chats_list = await chats.getChatsFromUser(user_id);

        res.json({ response: chats_list }).status(200);

    } catch (error) {
        console.error(error);
        res.json({ error: 'Internal server error' }).status(500);
    }
}

export const getMembers = async (req, res) => {
    const user_id = await authenticate(req, res);
    if (!user_id) {
        return res.json({ error: 'Not logged in or invalid token' }).status(401);
    }

    if (!req.params.chat_id) {
        return res.json({ error: 'Invalid parameters' }).status(400);
    }

    try {

        if (! await chats.isUserinChat(user_id, req.params.chat_id)) {
            return res.json({ error: 'Not a member of this chat' }).status(403);
        }

        const members = await chats.getMembersFromChat(req.params.chat_id);
        res.json({ response: members }).status(200);

    } catch (error) {
        console.error(error);
        res.json({ error: 'Internal server error' }).status(500);
    }
}

export const joinChat = async (req, res) => {
    const user_id = await authenticate(req, res);
    if (!user_id) {
        return res.json({ error: 'Not logged in or invalid token' }).status(401);
    }
    if (!req.params.chat_id) {
        return res.json({ error: 'Invalid parameters' }).status(400);
    }
    try {
        if (await chats.isUserinChat(user_id, req.params.chat_id)) {
            return res.json({ error: 'Already a member of this chat' }).status(403);
        }

        await chats.addMember(req.params.chat_id,user_id);

        res.json({ response: 'Joined chat' }).status(200);

    } catch (error) {
        console.error(error);
        res.json({ error: 'Internal server error' }).status(500);
    }
}

export const leaveChat = async (req,res) => {

    const user_id = await authenticate(req, res);
    if (!user_id) {
        return res.json({ error: 'Not logged in or invalid token' }).status(401);
    }
    if (!req.params.chat_id) {
        return res.json({ error: 'Invalid parameters' }).status(400);
    }
    try {
        if (!await members.isMemberInChat(user_id, req.params.chat_id)) {
            return res.json({ error: 'Not a member of this chat' }).status(403);
        }
        await chats.deleteMember(req.params.chat_id,user_id);

        res.json({ response: 'Left chat' }).status(200);

    } catch (error) {
        console.error(error);
        res.json({ error: 'Internal server error' }).status(500);
    }

}