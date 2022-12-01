
export const response = (ok:boolean,body:unknown,massage:string,status?:number) => {
            
    const Body = {
        ok:ok,
        body,
        massage,
    }
    return new Response(JSON.stringify(Body),
        {
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            status:status ?? ok ? 200 : 400,
        })
}