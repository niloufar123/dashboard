export default function DashLayout({children}:{
    children:React.ReactNode
}){
    
    
    return(
    <div>
        <h2>
            my main dashboard
        </h2>


        <div className="p-3 m-2 border-spacing-1 border-red-300 ">

        {children}

        </div>
    </div>

)}