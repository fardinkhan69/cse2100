"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { SlotItemMapArray, utils } from "swapy";
import { DragHandle, SwapyItem, SwapyLayout, SwapySlot } from "@/components/ui/swapy";
import { Heart, PlusCircle } from "lucide-react";

export function PatientsServedCard() {
    return (
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl h-full p-6 flex flex-col justify-center items-center text-center shadow-lg">
            <div className="flex gap-2">
                <h2 className="text-white 2xl:text-5xl text-3xl font-bold mb-2">15,847</h2>
                <div className="text-blue-200 flex items-center gap-1 mb-1">
                    <span className="text-xl"><Heart className="fill-blue-200" size={24} /></span>
                </div>
            </div>
            <p className="text-blue-100 font-medium">Patients Served</p>
            <p className="text-blue-200/80 text-sm">this year</p>
        </div>
    );
}
export function EmergencyServicesCard() {
    return (
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl h-full p-6 flex flex-col justify-center shadow-lg">
            <p className="text-red-100 mb-1 font-medium">Emergency Services</p>
            <h2 className="text-white 2xl:text-6xl text-4xl font-bold leading-none">24/7</h2>
            <p className="text-green-300 font-medium mt-2">Always Available</p>
        </div>
    );
}
export function MedicalTeamCard() {
    return (
        <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-6 h-full  flex flex-col justify-between relative overflow-hidden shadow-lg">
            <div className="bg-teal-600 text-white font-medium px-4 py-2 rounded-xl inline-block mb-4 max-w-fit">
                Expert medical professionals and specialists
            </div>
            <div>
                <p className="font-bold text-teal-800">Qualified Doctors</p>
                <div className="flex items-end gap-2">
                    <span className="text-6xl font-bold text-teal-900">25+</span>
                    <span className="text-green-500 font-medium mb-1">Available</span>
                </div>
            </div>
        </div>
    );
}
export function HealthServicesCard() {
    return (
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl h-full p-4 relative overflow-hidden shadow-lg">
            <div className="bg-white text-indigo-700 text-lg font-medium px-4 py-2 rounded-lg inline-block mb-4 w-full">
                <p>Comprehensive</p>
                <p>Healthcare Services</p>
                <p>For RUET Community</p>
            </div>
            <div className="flex  gap-2 h-20">
                <div className="w-full rounded-xl bg-indigo-400  overflow-hidden"></div>
                <div className="w-full rounded-xl bg-blue-200  overflow-hidden ml-4"></div>
            </div>
        </div>
    );
}
export function RUETLogoCard() {
    return (
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl h-full p-6 flex flex-col items-center justify-center shadow-lg">
            <div className="w-16 h-16 mb-4">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                    <circle cx="33" cy="33" r="25" fill="rgb(34, 197, 94)" />
                    <circle cx="67" cy="33" r="25" fill="rgb(22, 163, 74)" />
                    <circle cx="50" cy="67" r="25" fill="rgb(21, 128, 61)" />
                </svg>
            </div>
            <h2 className="2xl:text-3xl text-xl font-bold text-green-800">RUET Medical</h2>
        </div>
    );
}
export function PatientTrustCard() {
    return (
        <div className="bg-gradient-to-br from-cyan-600 to-cyan-700 rounded-xl h-full p-4 flex flex-col justify-center items-center text-white shadow-lg">
            <h3 className="text-2xl font-bold mb-2">Trusted By</h3>
            <p className="text-3xl font-bold mb-4">5000+ Patients</p>

            <div className="flex -space-x-2 mb-4">
                <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-cyan-600 bg-gray-200">
                </div>
                <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-cyan-600 bg-gray-200">
                </div>
                <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-cyan-600 bg-gray-200">
                </div>
                <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-cyan-600 bg-gray-200">
                </div>
                <div className="w-10 h-10 rounded-xl bg-yellow-500 border-2 border-cyan-600 flex items-center justify-center">
                    <PlusCircle className="w-5 h-5 text-white" />
                </div>
            </div>

            <p className="text-sm">Excellence in Healthcare Since 1964</p>
        </div>
    )
}
export function MedicalSpecialtiesCard() {
    return (
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl h-full p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-purple-800">Medical Specialties</h3>
            <h2 className="text-3xl font-bold mb-6 text-purple-900">15+ Departments</h2>

            <div className="bg-purple-600 text-white rounded-lg p-4 shadow-sm">
                <div className="flex justify-between text-sm mb-2">
                    <span>Cardiology</span>
                    <span>Neurology</span>
                </div>
                <div className="flex justify-between font-medium">
                    <span>Orthopedics</span>
                    <span>General Medicine</span>
                </div>
            </div>
        </div>
    )
}
export function HealthcareVisionCard() {
    return (
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white rounded-xl h-full p-6 flex flex-col justify-between relative shadow-lg">
            <p className="text-2xl font-bold">We Build Future of</p>
            <p className="text-2xl font-bold">Healthcare Excellence</p>
        </div>
    );
}
export function InsuranceCoverageCard() {
    return (
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl h-full p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-amber-800">Insurance Coverage</h3>
            <h2 className="text-3xl font-bold mb-6 text-amber-900">100% Free</h2>

            <div className="bg-amber-600 text-white rounded-lg p-4 shadow-sm">
                <div className="flex justify-between text-sm mb-2">
                    <span>All Students</span>
                    <span>All Staff</span>
                </div>
                <div className="flex justify-between font-medium">
                    <span>Faculty Members</span>
                    <span>Covered</span>
                </div>
            </div>
        </div>
    )
}


type Item = {
    id: string;
    title: string;
    widgets: React.ReactNode;
    className?: string;
};

const initialItems: Item[] = [
    {
        id: "1",
        title: "1",
        widgets: <PatientsServedCard />,
        className: "lg:col-span-4 sm:col-span-7 col-span-12",
    },
    { id: "2", title: "2", widgets: <EmergencyServicesCard />, className: "lg:col-span-3 sm:col-span-5 col-span-12" },
    { id: "3", title: "3", widgets: <HealthcareVisionCard />, className: "lg:col-span-5 sm:col-span-5 col-span-12" },
    { id: "4", title: "4", widgets: <MedicalTeamCard />, className: "lg:col-span-5 sm:col-span-7 col-span-12" },
    { id: "5", title: "5", widgets: <RUETLogoCard />, className: "lg:col-span-4 sm:col-span-6 col-span-12" },
    { id: "6", title: "6", widgets: <MedicalSpecialtiesCard />, className: "lg:col-span-3 sm:col-span-6 col-span-12" },
    {
        id: "7",
        title: "7",
        widgets: <HealthServicesCard />,
        className: "lg:col-span-4 sm:col-span-5 col-span-12",
    },
    { id: "8", title: "8", widgets: <PatientTrustCard />, className: "lg:col-span-4 sm:col-span-7 col-span-12" },
    { id: "9", title: "9", widgets: <InsuranceCoverageCard />, className: "lg:col-span-4 sm:col-span-12 col-span-12" },
];

import { motion } from "motion/react";

function SectionSwapy() {
    const [slotItemMap, setSlotItemMap] = useState<SlotItemMapArray>(
        utils.initSlotItemMap(initialItems, "id")
    );

    const slottedItems = useMemo(
        () => utils.toSlottedItems(initialItems, "id", slotItemMap),
        [initialItems, slotItemMap]
    );

    return (

        <div className="py-24 px-4 relative h-full w-full bg-[#f8fafc]">
            
            <div className="text-center m-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-5xl md:text-6xl font-bold mb-8">
                        Healthcare Excellence at RUET
                    </h2>
                    <p className="text-xl md:text-2xl mb-16 max-w-4xl mx-auto leading-relaxed opacity-90">
                        For years, we've been providing exceptional medical care to our university community,
                        ensuring every student, teacher, and staff member has access to quality healthcare services completely free of charge.
                    </p>
                </motion.div>
            </div>
            <div className="container">
                <SwapyLayout
                    id="swapy"
                    className="w-full"
                    config={{
                        swapMode: "hover",
                    }}
                    onSwap={(event: { newSlotItemMap: { asArray: any; }; }) => {
                        console.log("Swap detected!", event.newSlotItemMap.asArray);
                    }}
                >
                    <div className="grid w-full  grid-cols-12 gap-2 md:gap-6 py-4">
                        {slottedItems.map(({ slotId, itemId }) => {
                            const item = initialItems.find((i) => i.id === itemId);

                            return (
                                <SwapySlot
                                    key={slotId}
                                    className={`swapyItem rounded-lg h-64 ${item?.className}`}
                                    id={slotId}
                                >
                                    <SwapyItem
                                        id={itemId}
                                        className="relative rounded-lg w-full h-full 2xl:text-xl text-sm"
                                        key={itemId}
                                    >
                                        {item?.widgets}
                                    </SwapyItem>
                                </SwapySlot>
                            );
                        })}
                    </div>
                </SwapyLayout>
            </div>
        </div>
    );
}

export default SectionSwapy;
