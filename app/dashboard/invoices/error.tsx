'use client';

import { useEffect } from "react";



export default function Error({
    error,
    reset
}:{
    error:Error& {digest?: string};
    reset:()=>void;

}){
    console.log('error',error);
    

    useEffect(()=>{
        console.error("Error in Invoices Page",error);
    },[error]);
    

    return (
        <main className="flex h-full flex-col items-center justify-center">
            <h1 className="text-2xl font-bold">Something went wrong!</h1>
            <button 
            className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colora hover:bg-blue-400"
            onClick={()=>reset()}
            >
                Try Again
            </button>
        </main>
    );
      
}