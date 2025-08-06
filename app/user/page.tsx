'use client'

import { useEffect, useState } from 'react'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import { getDoc, doc } from 'firebase/firestore';
import db from '@/lib/firebase_db';
import auth from '@/lib/firebase_auth'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { Database, Loader, LogOut, TicketPlus, X } from 'lucide-react'

import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface HistoryItem {
    id: string
    response: string
    hurt: string
    createdAt: string
    where: string
    symptom: string
    booked: boolean
    scheduleTime: string | null;
}

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

interface AdminHistoryItem extends HistoryItem {
    userId: string;
    userEmail: string;
    userName: string;
    doctorName: string | null;
    scheduleTime: string | null;
    lastUpdated: string;
}

const emojinig = ['😊', '😢', '😡', '😑', '😱', '😨', '😲', '😴', '😝', '😍', '😌', '😐', '😷', '😳', '😵', '💔', '😎', '😭', '😅', '😉', '💜', '😇']

export default function UserProfile() {
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [history, setHistory] = useState<HistoryItem[]>([])
    const [isAdmin, setIsAdmin] = useState(false);
    const [adminHistory, setAdminHistory] = useState<AdminHistoryItem[]>([]);
    const router = useRouter()
    const [open, setOpen] = useState(false);
    const [isDelete, setIsDelete] = useState(false);
    const [hID, setHID] = useState("");
    const [date, setDate] = useState<Date>()
    const [dID, setDID] = useState("");
    const [adminActionUserId, setAdminActionUserId] = useState<string | undefined>();
    const [dloading, setDLoading] = useState(false);
    const [emo, setEmo] = useState('');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);
                try {
                    // Check if user is admin
                    const userDoc = await getDoc(doc(db, "Users", user.uid));
                    const isUserAdmin = userDoc.data()?.isAdmin || false;
                    setIsAdmin(isUserAdmin);

                    if (isUserAdmin) {
                        // Fetch all history for admin
                        const adminResponse = await fetch('/api/history/admin');
                        const adminData = await adminResponse.json();
                        setAdminHistory(adminData);
                    } else {
                        // Fetch normal user history
                        const response = await fetch(`/api/history?userid=${user.uid}`);
                        const data = await response.json();
                        setHistory(data);
                        if (data.length > 0) {
                            const emo = await axios.post('/api/emoji', {
                                text: data[0].symptom
                            });
                            setEmo(emojinig[parseInt(emo.data)])
                        }
                    }
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth)
            router.push('/analysis')
        } catch (error) {
            console.error("Error signing out:", error)
        }
    }

    const handleDeleteHistory = async (historyId: string, userId?: string) => {
        if (!user) return;

        setDLoading(true);
        try {
            if (isAdmin) {
                const response = await fetch('/api/bookmark', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        userid: userId,
                        historyid: historyId
                    })
                });

                if (!response.ok) throw new Error('Failed to reset booking');

                const adminResponse = await fetch('/api/history/admin');
                const adminData = await adminResponse.json();
                setAdminHistory(adminData);
            } else {
                const response = await fetch(
                    `/api/history?userid=${user.uid}&historyId=${historyId}`,
                    { method: 'DELETE' }
                );

                if (!response.ok) throw new Error('Failed to delete history');
                setHistory(history.filter(item => item.id !== historyId));
            }
        } catch (error) {
            console.error('Error handling history:', error);
        } finally {
            setDLoading(false);
            setIsDelete(false);
        }
    };

    const renderAdminDashboard = () => (
        <div className='flex flex-col gap-6 w-full max-w-4xl'>
            <h2 className="text-2xl font-bold">Admin Dashboard</h2>
            {
                adminHistory.length === 0 ? <>
                    <div className='w-full mt-16 flex flex-col items-center justify-center'>
                        <Database size={32} />
                        <p className='mt-1'>ไม่มีข้อมูลในประวัติของคุณ</p>
                    </div>
                </> : <>
                    {adminHistory.map((item) => (
                        <div key={item.id} className="border p-6 rounded-lg relative shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-semibold text-lg">{item.userName}</h3>
                                    <p className="text-sm text-gray-600">{item.userEmail}</p>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <p className="text-sm font-bold">Schedule: {item.scheduleTime || 'Not scheduled'}</p>
                                    <Tooltip>
                                        <TooltipTrigger
                                            onClick={() => {
                                                setDID(item.id);
                                                setAdminActionUserId(item.userId);
                                                setIsDelete(true);
                                            }}
                                            className="text-red-500 hover:text-red-700 cursor-pointer"
                                            aria-label="Cancel booking"
                                        ><X /></TooltipTrigger>
                                        <TooltipContent>
                                            <p>ยกเลิกการจอง</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <p className="font-medium">ตำแหน่ง: {item.where}</p>
                                    <p className="text-sm text-gray-600">อาการ: {item.symptom}</p>
                                    <p className="text-sm text-gray-600">ระดับความปวด: {item.hurt}</p>
                                </div>
                            </div>
                            <p className="text-sm mt-2">{item.response}</p>
                            <p className="text-xs text-gray-400 mt-2">
                                {new Date(item.lastUpdated).toLocaleString('th-TH')}
                            </p>
                        </div>
                    ))}
                </>
            }
        </div>
    );

    const submitBooking = async () => {
        if (!user || !date || !hID) return;

        setDLoading(true);
        try {
            const response = await fetch('/api/bookmark', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userid: user.uid,
                    historyid: hID,
                    scheduleTime: format(date, "PPP")
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update booking');
            }

            setOpen(false);
            const response2 = await fetch(`/api/history?userid=${user.uid}`);
            const data = await response2.json();
            setHistory(data);
            setDLoading(false);
        } catch (error) {
            console.error('Error booking appointment:', error);
        }
    }

    if (loading) {
        return <>
            <div className='h-[90vh] flex flex-col gap-3 items-center justify-center'>
                <span className="loader"></span>
                <p>กำลังโหลดข้อมูลของคุณ กรุณารอสักครู่</p>
            </div>
        </>
    }

    if (!user) {
        return <div>Please sign in to view this page</div>
    }

    return (
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center py-2">
            <div className="p-8">
                <div className='flex flex-col md:gap-32 md:flex-row md:items-center place-content-between'>
                    <div>
                        {user.photoURL && (
                            <div className="mb-4">
                                <img
                                    src={user.photoURL}
                                    alt="Profile picture"
                                    width={100}
                                    height={100}
                                    className="rounded-full"
                                />
                            </div>
                        )}
                        <h1 className="text-2xl font-bold mb-1">{user.displayName}</h1>
                        <p className="text-gray-600 mb-4">{user.email}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 flex flex-row md:flex-col items-center justify-center gap-1 text-white px-4 py-2 rounded-md w-full md:w-fit mb-4"
                    >
                        <LogOut />
                        Logout
                    </button>
                </div>


                {isAdmin ? renderAdminDashboard() : (
                    <>
                        {emo && history.length > 0 && (
                            <section className="w-full max-w-4xl mb-8 text-center p-6 bg-amber-100 dark:bg-gray-800 rounded-xl shadow-sm">
                                <h2 className="text-xl font-semibold text-amber-800 dark:text-amber-200">อีโมจิสำหรับอาการล่าสุดของคุณ</h2>
                                <p className="text-6xl mt-6 animate-bounce">{emo}</p>
                                <p className="mt-2 text-gray-600 dark:text-gray-400">
                                    จากอาการ: "{history[0].symptom}"
                                </p>
                            </section>
                        )}

                        <div className='flex flex-col gap-6 w-full max-w-4xl'>
                            {
                                history.length === 0 ? <>
                                    <div className='w-full mt-16 flex flex-col items-center justify-center'>
                                        <Database size={32} />
                                        <p className='mt-1'>ไม่มีข้อมูลในประวัติของคุณ</p>
                                    </div>
                                </> : <>
                                    {history.map((item) => (
                                        <div key={item.id} className="border p-4 rounded-lg relative">
                                            <div className="font-medium flex items-center place-content-between">ตำแหน่ง: {item.where}
                                                <div className='flex items-center gap-2'>
                                                    {item.booked ? <>
                                                        <Tooltip>
                                                            <TooltipTrigger
                                                                className=""
                                                                aria-label="ID history"
                                                            >
                                                                <TicketPlus color='green' size={20} />
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>จองวันที่ : {item.scheduleTime}</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </> : <>
                                                        <Tooltip>
                                                            <TooltipTrigger
                                                                onClick={() => { setOpen(true); setHID(item.id); }}
                                                                className="cursor-pointer"
                                                                aria-label="ID history"
                                                            >
                                                                <TicketPlus size={20} />
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>จองคิว</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </>}
                                                    <Tooltip>
                                                        <TooltipTrigger
                                                            onClick={() => {
                                                                setDID(item.id);
                                                                setAdminActionUserId(undefined);
                                                                setIsDelete(true);
                                                            }}
                                                            className="text-red-500 hover:text-red-700 cursor-pointer"
                                                            aria-label="Delete history"
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="h-5 w-5"
                                                                viewBox="0 0 20 20"
                                                                fill="currentColor"
                                                            >
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                                                    clipRule="evenodd"
                                                                />
                                                            </svg>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>ลบประวัติ</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-600">อาการ: {item.symptom}</p>
                                            <p className="text-sm text-gray-600">ระดับความปวด: {item.hurt}</p>
                                            <p className="text-sm mt-2 whitespace-pre-line">{item.response}</p>
                                            <p className="text-xs text-gray-400 mt-2">
                                                {new Date(item.createdAt).toLocaleString('th-TH')}
                                            </p>
                                        </div>
                                    ))}
                                </>
                            }
                        </div>
                    </>
                )}
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className='text-2xl'>ต้องการจองคิวร้านนวด?</DialogTitle>
                        <p>
                            สำหรับไอดี {hID}
                        </p>
                        <p className='mt-2'>กรุณาใส่วันที่จองคิว</p>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    data-empty={!date}
                                    className="data-[empty=true]:text-muted-foreground w-full justify-start text-left font-normal"
                                >
                                    <CalendarIcon />
                                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar mode="single" selected={date} onSelect={setDate} />
                            </PopoverContent>
                        </Popover>
                        <Button onClick={submitBooking} type="submit" className='w-full bg-[#f4c692] mt-2 text-black hover:bg-[#f4c692] cursor-pointer'>{dloading && <Loader className='animate-spin' />} จองเลย</Button>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
            <Dialog open={isDelete} onOpenChange={setIsDelete}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className='text-2xl'>
                            {isAdmin ? 'ต้องการที่จะยกเลิกการจองนี้?' : 'ต้องการที่จะลบประวัตินี้?'}
                        </DialogTitle>
                        <p>
                            ของไอดี {dID}
                        </p>
                        <Button onClick={() => handleDeleteHistory(dID, adminActionUserId)} type="submit" className='w-full bg-[#f4c692] mt-2 text-black hover:bg-[#f4c692] cursor-pointer'>
                            {dloading && <Loader className='animate-spin' />}
                            {isAdmin ? 'ยืนยันการยกเลิก' : 'ยืนยันการลบ'}
                        </Button>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    )
}