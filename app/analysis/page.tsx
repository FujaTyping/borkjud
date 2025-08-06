"use client";

import React, { useState } from 'react'
import anatomy from "@/assets/anatody.svg";
import { CircleDot, HeartPlus, Volume2, Loader } from 'lucide-react';

import auth from '@/lib/firebase_auth';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { AnimatePresence, motion } from "motion/react"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { z } from "zod";
import axios from 'axios';

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
    FormLabel
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
    RadioGroup,
    RadioGroupItem,
} from "@/components/ui/radio-group"

const painLevels = ["ปวดมากจนเกือบเจ็บ", "ปวดมาก", "ปวดมากตอนขยับ", "ปวดหน่อยๆ", "พอมีอาการปวดเมื่อยบ้างบางครั้ง"] as const;

const formSchema = z.object({
    symptom: z.string().min(10, {
        message: "โปรดอธิบายอาการของคุณอย่างน้อย 10 ตัวอักษร",
    }).max(500, {
        message: "คำอธิบายอาการต้องไม่เกิน 500 ตัวอักษร",
    }),
    hurt: z.enum(painLevels, {
        message: "โปรดเลือกระดับความปวดของคุณ",
    }),
})

function APage() {
    const [part, setPart] = useState("");
    const [open, setOpen] = useState(false);
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);
    const [audioUrl, setAudioUrl] = useState("");
    const [isAudioLoading, setIsAudioLoading] = useState(false);
    const [firstView, setFirstView] = useState(true);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            symptom: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);
        const res = await axios.post('https://llmkun.ydev.studio/text/generate', { ...values, where: part })
        console.log(res.data);
        setResult(res.data);
        setOpen(false);
        setLoading(false);
        if (res.data) {
            try {
                const user = auth.currentUser;

                if (!user) {
                    console.log("User not logged in");
                    return;
                }
                await axios.post('/api/history', {
                    userid: user.uid,
                    where: part,
                    symptom: values.symptom,
                    hurt: values.hurt,
                    response: res.data
                });
            } catch (error) {
                console.error("Error saving to history:", error);
            }

        }
    }

    async function handleTextToSpeech() {
        if (!result || isAudioLoading) return;

        setIsAudioLoading(true);
        try {
            const res = await axios.post('/api/tts', { text: result });
            const newAudioUrl = res.data.url;
            setAudioUrl(newAudioUrl);
            const audio = new Audio(newAudioUrl);
            audio.play();
        } catch (error) {
            console.error("Failed to get audio:", error);
        } finally {
            setIsAudioLoading(false);
        }
    }

    return (
        <>
            <main className='max-w-7xl mx-auto px-4'>
                <section className='relative flex items-center justify-center'>
                    {
                        firstView ? <>
                            <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0 }}
                                key="box"
                                className='absolute flex flex-col items-center text-center p-8 bg-white/70 dark:bg-black/70 backdrop-blur-sm rounded-xl shadow-lg'
                            >
                                <h1 className='text-4xl font-bold text-[#703c00] dark:text-[#f4c692]'>BorkJud บอกจุด</h1>
                                <p className='mt-2 text-lg text-gray-700 dark:text-gray-300 max-w-md'>
                                    เว็บแอพที่จะช่วยวิเคราะห์อาการปวดเมื่อยตามร่างกายของคุณ พร้อมแนะนำวิธีแก้เบื้องต้น
                                </p>
                                <Button onClick={() => setFirstView(false)} className='mt-6 bg-[#f4c692] text-black hover:bg-[#eacfa6] dark:hover:bg-[#f4c692]/90'>
                                    เริ่มการวิเคราะห์
                                </Button>
                            </motion.div>

                        </> : <>
                            <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0 }}
                                className='absolute flex flex-col items-center'
                            >

                                <Tooltip>
                                    <TooltipTrigger onClick={() => { setPart("ไหล่ช้าย"); setOpen(true) }} id='sdleft' className='absolute -translate-x-[90px] -translate-y-[280px] cursor-pointer'>
                                        <motion.div
                                            whileHover={{ scale: 1.2 }}
                                            whileTap={{ scale: 0.8 }}
                                        >
                                            <CircleDot color='red' size={32} />
                                        </motion.div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>ไหล่ช้าย</p>
                                    </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger onClick={() => { setPart("ไหล่ขวา"); setOpen(true) }} id='sdright' className='absolute translate-x-[90px] -translate-y-[280px] cursor-pointer'>
                                        <motion.div
                                            whileHover={{ scale: 1.2 }}
                                            whileTap={{ scale: 0.8 }}
                                        >
                                            <CircleDot color='red' size={32} />
                                        </motion.div>

                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>ไหล่ขวา</p>
                                    </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger onClick={() => { setPart("แขนช้าย"); setOpen(true) }} id='left' className='absolute -translate-x-[125px] -translate-y-[125px] cursor-pointer'>
                                        <motion.div
                                            whileHover={{ scale: 1.2 }}
                                            whileTap={{ scale: 0.8 }}
                                        >
                                            <CircleDot color='red' size={32} />
                                        </motion.div>

                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>แขนช้าย</p>
                                    </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger onClick={() => { setPart("แขนขวา"); setOpen(true) }} id='left' className='absolute translate-x-[125px] -translate-y-[125px] cursor-pointer'>
                                        <motion.div
                                            whileHover={{ scale: 1.2 }}
                                            whileTap={{ scale: 0.8 }}
                                        >
                                            <CircleDot color='red' size={32} />
                                        </motion.div>

                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>แขนขวา</p>
                                    </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger onClick={() => { setPart("คอ"); setOpen(true) }} id='neck' className='absolute -translate-y-[370px] cursor-pointer'>
                                        <motion.div
                                            whileHover={{ scale: 1.2 }}
                                            whileTap={{ scale: 0.8 }}
                                        >
                                            <CircleDot color='red' size={32} />
                                        </motion.div>

                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>คอ</p>
                                    </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger onClick={() => { setPart("หลัง"); setOpen(true) }} id='left' className='absolute -translate-y-[250px] cursor-pointer'>
                                        <motion.div
                                            whileHover={{ scale: 1.2 }}
                                            whileTap={{ scale: 0.8 }}
                                        >
                                            <CircleDot color='red' size={32} />
                                        </motion.div>


                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>หลัง</p>
                                    </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger onClick={() => { setPart("ขาขวา"); setOpen(true) }} id='left' className='absolute translate-y-[250px] translate-x-[80px] cursor-pointer'>
                                        <motion.div
                                            whileHover={{ scale: 1.2 }}
                                            whileTap={{ scale: 0.8 }}
                                        >
                                            <CircleDot color='red' size={32} />
                                        </motion.div>

                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>ขาขวา</p>
                                    </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger onClick={() => { setPart("ขาช้าย"); setOpen(true) }} id='left' className='absolute translate-y-[250px] -translate-x-[70px] cursor-pointer'>
                                        <motion.div
                                            whileHover={{ scale: 1.2 }}
                                            whileTap={{ scale: 0.8 }}
                                        >
                                            <CircleDot color='red' size={32} />
                                        </motion.div>

                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>ขาช้าย</p>
                                    </TooltipContent>
                                </Tooltip>
                            </motion.div>
                        </>
                    }
                    <img src={anatomy.src} className={`w-[400px]`} alt="Anatomy" />
                </section>
                <section className='my-4 w-full flex tems-center justify-center'>
                    <div className='relative bg-[#ffddb7] p-4 rounded-xl px-6'>
                        <h1 className='font-bold text-[#703c00] text-3xl flex items-center gap-2'><HeartPlus className='hidden md:block' size={28} /> ผลวิเคราะห์อาการ</h1>
                        <p className='whitespace-pre-line mt-1 max-w-xl'>{result ? result : "กรุณาเลือกส่วนที่ปวดและบอกรายละเอียด"}</p>
                        {
                            result && <>
                                <button onClick={handleTextToSpeech} disabled={isAudioLoading} className='flex items-center justify-end mt-2 w-full'>
                                    {isAudioLoading
                                        ? <Loader size={28} className="animate-spin" />
                                        : <Volume2 size={28} className="cursor-pointer hover:text-gray-700" />
                                    }
                                </button>
                            </>
                        }
                    </div>
                </section>
            </main >
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-2xl">ลองบอกหน่อยสิว่าทำไมถึงปวด {part}?</DialogTitle>
                        {
                            loading ? <>
                                <div className='mt-6 flex items-center flex-col gap-3 justify-center'>
                                    <span className="loader"></span>
                                    <p>กำลังวิเคราะห์อาการของคุณ กรุณารอสักครู่</p>
                                </div>
                            </> : <>
                                <p>
                                    โปรดอธิบายอาการปวดของคุณให้ละเอียดที่สุด เช่น ปวดเมื่อย, ปวดแปลบ, หรือปวดตุบๆ และบอกเราว่าอาการเริ่มขึ้นเมื่อไหร่
                                </p>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                        <FormField
                                            control={form.control}
                                            name="symptom"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Textarea placeholder="เช่น ปวดเมื่อย, ปวดแปลบ, หรือปวดตุบๆ" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="hurt"
                                            render={({ field }) => (
                                                <FormItem className="space-y-3">
                                                    <FormLabel>ระดับความปวด</FormLabel>
                                                    <FormControl>
                                                        <RadioGroup
                                                            onValueChange={field.onChange}
                                                            defaultValue={field.value}
                                                            className="flex flex-col space-y-1"
                                                        >
                                                            {painLevels.map((level) => (
                                                                <FormItem key={level} className="flex items-center gap-3">
                                                                    <FormControl>
                                                                        <RadioGroupItem value={level} />
                                                                    </FormControl>
                                                                    <FormLabel className="font-normal">
                                                                        {level}
                                                                    </FormLabel>
                                                                </FormItem>
                                                            ))}
                                                        </RadioGroup>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button type="submit" className='w-full bg-[#f4c692] text-black hover:bg-[#f4c692] cursor-pointer'>วิเคราะห์อาการ</Button>
                                    </form>
                                </Form>
                            </>
                        }
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default APage