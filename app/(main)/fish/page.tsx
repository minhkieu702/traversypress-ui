'use client'
import BackButton from "@/components/BackButton"
import { FishType } from "@/types/ResponseModel/FishType";
import { useEffect, useState } from "react";

const FishPage = () => {
    const [fish, setFish] = useState<FishType[]>();
    const [, set] = useState();
    
useEffect

    return(
        <>
        <BackButton text='Go Back' link='/' />
        
        </>
    )
}

export default FishPage