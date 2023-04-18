const MDBKey = process.env.NEXT_PUBLIC_MDB_KEY

export const fetchFromUrl = (url: String ,cb: (...args: any[]) => any) => {
     fetch(`${url}${MDBKey}`)
      .then((res) => res.json())
      .then((res) => {
        cb(res.results)
      })
}