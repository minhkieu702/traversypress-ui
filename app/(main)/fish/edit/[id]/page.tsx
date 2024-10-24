'use client'
import BackButton from "@/components/BackButton"
import { FishType } from "@/types/ResponseModel/FishType";
import { useState } from "react";

const FishPage = () => {
    const [fish, setFish] = useState<FishType>();
    
    return(
        <>
        <BackButton text='Go Back' link='/' />
        
        </>
    )
}

export default FishPage