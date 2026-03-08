'use client';

import { useQuery } from "@tanstack/react-query";
import { userService } from "@shared/api/services/users/service";
import { MdEmail } from "react-icons/md";
import { FaPhone } from "react-icons/fa6";
import { ScrollArea } from "@shared/shadcn/components/scroll-area";
import { EditUserProfileByAdmin } from "@features/profile/edit-by-admin/ui/EditUserProfileByAdmin";

export const UsersList = () => {
    const { data } = useQuery({
        queryFn: userService.getAll,
        queryKey: ['users']
    })

    return (
        <ScrollArea className='w-full h-[calc(100dvh-200px)] mt-2 sm:h-[calc(100dvh-250px)] pr-4'>
            <div className='flex flex-col gap-4'>
                {data?.map(user => (
                    <div className='px-5 py-4 rounded-2xl flex justify-between bg-zinc-800/70' key={user.id}>
                        <div className='flex items-center gap-3'>
                            <div className='p-3 rounded-full'
                                 style={{backgroundColor: user.email ? 'rgba(19,100,241,0.3)' : 'rgba(34,197,94,0.3)'}}>
                                {user.email ? <MdEmail className='text-blue-500'/> :
                                    <FaPhone className='text-green-500'/>}
                            </div>
                            {user.profile?.name || user.email || user.phone}
                        </div>

                        <EditUserProfileByAdmin userId={user.id} data={user.profile}/>
                    </div>
                ))}
            </div>
        </ScrollArea>
    )
}