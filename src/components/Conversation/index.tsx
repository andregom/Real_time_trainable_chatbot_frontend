import React, { useEffect, useState } from "react";
import fetchFakeMessages from '../../utils/fetchFakeMessages';

import './styles.scss';

import sendIcon from "../../assets/3.png";

import { useMutation } from "react-query";
import axios from "../../api/axios";
import { BASE_URL, queryClient } from '../../service/queryClient';

const POST_MESSAGE_URL = 'message/1'

interface ConversationProps {

}

interface IMessage {
    sender?: string;
    source?: number;
    content: string;
    date?: string
}

const postMessage = async (message: IMessage) => {
    const { data: response } = await axios.post(`${BASE_URL}/${POST_MESSAGE_URL}`,
        JSON.stringify(message),
        {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: false
        }
    );

    return response;
};

const Conversation: React.FC<ConversationProps> = () => {

    const [messages, setMessages] = useState<IMessage[]>([]);
    const [message, setMessage] = useState<string>('');

    useEffect(() => {
        async function loadMesages() {
            await fetchFakeMessages().then(data => {
                setMessages(data);
            });
        }
        loadMesages();
    }, []);

    async function handleSubmit(e: React.FormEvent): Promise<void> {
        e.preventDefault();

        await setMessages([...messages, { source: 0, content: message }]);

        await handleSendMessage({
            content: message
        });

        setMessage('');
    }

    const sendMessage = useMutation(postMessage, {
        onSuccess: (data) => {
            console.log(data);
            setMessages([...messages, { source: 1, content: data }]);
        },
        onError: () => {
            alert("there was an error");
        },
        onSettled: () => {
            queryClient.invalidateQueries('create');
        }
    });

    async function handleSendMessage(data: { content: string }) {
        sendMessage.mutateAsync(data);
    }

    return (
        <div>
            <div className='messages'>
                <ul>
                    {
                        messages.map(message => (
                            <div>
                                <div className='message-container'
                                    key={Object(message)._id}
                                    style={{ textAlign: `${message.source ? 'left' : 'right'}` }}
                                >
                                    <div
                                        className='message-content'
                                        style={{
                                            backgroundColor: `${message.source ? '#d0e4fbdd' : 'rgba(253, 253, 253, 0.877)'}`,
                                            border: `${message.source ? 'rgba(134, 111, 175, 0.904) solid 0.3px' : 'rgba(187, 169, 221, 0.884) solid 0.3px'}`

                                        }}
                                    >{message.content}</div>
                                </div>
                            </div>
                        ))
                    }
                </ul>
            </div>
            <form
                className='message-sender-form'
                onSubmit={handleSubmit}
            >
                <div className='message-sender-container'>
                    <input
                        name='message-sender'
                        id='message-sender'
                        placeholder='Em que posso ajudar?'
                        value={message}
                        required={true}
                        onChange={e => setMessage(e.target.value)}
                    >
                    </input>
                    <button>
                        <img src={sendIcon} alt="send message button" width={30} height={23} />
                    </button>
                </div>
            </form>
        </div>
    )
}

export default Conversation;