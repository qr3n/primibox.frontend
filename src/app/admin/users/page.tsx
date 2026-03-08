import { UsersList } from "@app/admin/users/UsersList";
import Image from "next/image";
import { bgImg } from "@shared/assets";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@shared/shadcn/components/tabs";
import { DriversList } from "@app/admin/users/DriversList";

export default function UsersPage() {
    return (
        <>
            <div className="flex items-center justify-center flex-col" vaul-drawer-wrapper="">
                <Image placeholder="blur" width={1920} height={1080} src={bgImg}
                       className='fixed w-[100dvw] h-[100dvh] object-cover top-0 left-0 -z-50' alt='bg'/>

                <div
                    className='fixed top-0 left-0 -z-50 w-[100dvw] h-[100dvh] bg-gradient-to-br from-transparent to-black'/>
                <div
                    className='fixed top-0 left-0 -z-50 w-[100dvw] h-[100dvh] bg-gradient-to-bl from-transparent to-black'/>
                <div
                    className='fixed top-0 left-0 -z-50 w-[100dvw] h-[100dvh] bg-gradient-to-b from-transparent to-black'/>
                <h1 className="font-semibold text-4xl sm:text-5xl mt-6 sm:mt-12">Пользователи</h1>
                <div
                    className="max-w-4xl w-full px-8"
                >
                    <Tabs defaultValue={'clients'} className='w-full h-full flex items-center flex-col'>
                        <TabsList className='mt-4'>
                            <TabsTrigger value={'clients'}>Клиенты</TabsTrigger>
                            <TabsTrigger value={'drivers'}>Водители</TabsTrigger>
                        </TabsList>

                        <TabsContent value={'clients'} className='w-full h-full justify-center  flex'>
                            <UsersList/>
                        </TabsContent>
                        <TabsContent value={'drivers'} className='w-full h-full justify-center  flex'>
                            <DriversList/>
                        </TabsContent>
                    </Tabs>
                </div>
                </div>
            </>
    )
}