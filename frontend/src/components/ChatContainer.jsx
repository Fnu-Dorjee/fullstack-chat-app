
import { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore.js";
import { formatMessageTime } from "../lib/util.js";

import ChatHeader from "./ChatHeader.jsx";
import MessageInput from "./MessageInput.jsx";
import MessageSkeleton from "./skeletons/MessageSkeleton.jsx";


const ChatContainer = ()=>{
    const {
        messages, getMessages, isMessagesLoading,
        selectedUser, subscribeToMessages, unsubscribeFromMessages

    } = useChatStore();
    const messageEndRef = useRef(null);

    console.log("messages object: ", messages);
    console.log("se;ectedUser in chat container: ", selectedUser);
    const authUser = useAuthStore((state) => state.authUser);
    console.log("authUsers in cont: ", authUser);
    console.log("selectedUser in cont : ", selectedUser);
    
    useEffect(() => {
      getMessages(selectedUser._id);
      subscribeToMessages();

      return ()=>{
        unsubscribeFromMessages();
      }
          
    }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

    useEffect(()=>{
        if(messageEndRef.current && messages){
            messageEndRef.current.scrollIntoView({behavior: "smooth"})
        };
    },[messages])
    if (!authUser?._id || !selectedUser?._id) {
        return <div className="flex-1 flex justify-center items-center">Loading chat UI...</div>;
      }
      
    if(isMessagesLoading) return (
        <div className="flex-1 flex flex-col overflow-auto">
            <ChatHeader />
            <MessageSkeleton />
            <MessageInput />

        </div>
    );


    return(
        <div className="flex-1 flex flex-col overflow-auto">
            <ChatHeader/>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {
                    messages.map((message)=>{
                        console.log('message: ', message);
                        return(
                            <div 
                            key={message._id} 
                            className={`chat ${message.senderId === authUser._id ? 'chat-end': 'chat-start'}`}
                            ref={messageEndRef}
                            >
                                <div className="chat-image avatar">
                                    <div className="size-10 rounded-full border">
                                        <img src={message.senderId === authUser._id ? 
                                            authUser.profilePicture || '/avatar.png': selectedUser.profilePicture || "/avatar.png"
                                        }
                                        alt="profile img"
                                        />

                                    </div>
                                </div>

                                <div className="chat-header mb-1"> 
                                    <time className="text-xs opacity-50 ml-1">
                                        {formatMessageTime(message.createdAt)}
                                    </time>

                                </div>
                            <div className="chat-bubble flex flex-col">
                                {message.image && (
                                    <img 
                                        src={message.image}
                                        alt='Attachment'
                                        className="sm:max-w-[200px] rounded-md mb-2"
                                    />
                                )}
                                {message.text && <p>{message.text}</p>}
                            </div>
                            </div>
                        )
                    })
                }
            </div>
            <MessageInput />

        </div>
    )
}

export default ChatContainer;