import { Microscope, History, Bookmark } from "lucide-react";
import APage from "./analysis/page";

export default function Home() {
  return (
    <>
      <main className="flex flex-col items-center justify-center min-h-screen bg-[#faf8f5] text-gray-800">
        <APage />

        <section id="how-it-works" className="py-20 w-full">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-[#703c00]">BorkJud ทำงานอย่างไร</h2>
            <div className="grid md:grid-cols-3 gap-12 mt-12">
              <div className="text-center p-6 bg-white rounded-xl">
                <div className="flex justify-center items-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-[#703c00] text-white flex items-center justify-center text-2xl font-bold">1</div>
                </div>
                <h3 className="text-xl font-semibold text-gray-800">เลือกจุดที่ปวด</h3>
                <p className="mt-2 text-gray-600">
                  เลือกส่วนของร่างกายที่คุณรู้สึกปวดเมื่อย
                </p>
              </div>
              <div className="text-center p-6 bg-white rounded-xl">
                <div className="flex justify-center items-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-[#703c00] text-white flex items-center justify-center text-2xl font-bold">2</div>
                </div>
                <h3 className="text-xl font-semibold text-gray-800">บอกอาการ</h3>
                <p className="mt-2 text-gray-600">
                  อธิบายอาการของคุณให้ AI ของเราช่วยวิเคราะห์
                </p>
              </div>
              <div className="text-center p-6 bg-white rounded-xl">
                <div className="flex justify-center items-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-[#703c00] text-white flex items-center justify-center text-2xl font-bold">3</div>
                </div>
                <h3 className="text-xl font-semibold text-gray-800">รับผลและคำแนะนำ</h3>
                <p className="mt-2 text-gray-600">
                  ดูผลการวิเคราะห์และคำแนะนำเบื้องต้นในการดูแลตัวเอง
                </p>
              </div>
            </div>
          </div>
        </section>


        <section id="features" className="py-20 w-full">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-[#703c00]">ฟีเจอร์ของเรา</h2>
            <div className="grid md:grid-cols-3 gap-12 mt-12">
              <div className="text-center bg-white p-6 rounded-xl">
                <div className="flex justify-center items-center mb-4">
                  <Microscope size={48} className="text-[#703c00]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">วิเคราะห์อาการ</h3>
                <p className="mt-2 text-gray-600">
                  AI ของเราจะวิเคราะห์อาการปวดเมื่อยของคุณและให้คำแนะนำที่เป็นประโยชน์
                </p>
              </div>
              <div className="text-center bg-white p-6 rounded-xl">
                <div className="flex justify-center items-center mb-4">
                  <History size={48} className="text-[#703c00]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">ประวัติการวิเคราะห์</h3>
                <p className="mt-2 text-gray-600">
                  ติดตามและดูประวัติการวิเคราะห์อาการของคุณได้ตลอดเวลา
                </p>
              </div>
              <div className="text-center bg-white p-6 rounded-xl">
                <div className="flex justify-center items-center mb-4">
                  <Bookmark size={48} className="text-[#703c00]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">จองร้านนวด</h3>
                <p className="mt-2 text-gray-600">
                  จองคิวร้านนวดใกล้คุณจากผลการวิเคราะห์เพื่อการรักษาที่ตรงจุด
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}