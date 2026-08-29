import useDynamicMutation from '@/lib/api/use-post-data'
import { Message } from './chat-room'
import { DeleteIcon, PencilIcon } from 'lucide-react'
import { toast } from 'sonner'

type Props = {
    message: Message,
    setMessageToBeEdit: (arg: Message) => void
    setIsEditMode: (arg: boolean) => void
}

function MessageActions({ message, setMessageToBeEdit, setIsEditMode }: Props) {
    const postMutation = useDynamicMutation({})
    async function deleteMessage() {
        try {
            await postMutation.mutateAsync({
                url: `messages/${message.message_id}/`,
                method: "DELETE",
                body: {},
                onSuccess: () => { toast.success("Message deleted Successfully!") },
            });
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className='p-1.5 pe-5 flex flex-col gap-1'>
            <div
                onClick={() => {
                    setMessageToBeEdit(message)
                    setIsEditMode(true)
                }}
                className='flex items-center gap-1.5 text-sm cursor-pointer hover:bg-gray-100 p-2'>
                <PencilIcon size={15} />Edit message
            </div>
            <div onClick={deleteMessage}
                className='flex items-center gap-1.5 text-sm cursor-pointer hover:bg-gray-100 p-2'>
                <DeleteIcon size={15} />Delete message
            </div>
        </div>
    )
}

export default MessageActions